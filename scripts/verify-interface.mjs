import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects, links } from "../app/lib/content.ts";
import { notes } from "../app/lib/writing.ts";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
await context.addInitScript(() => localStorage.setItem("theme", "light"));
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [], remoteRequests = [], report = [];
page.on("pageerror", error => errors.push({ url: page.url(), message: error.message }));
page.on("request", request => {
  if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL).origin) remoteRequests.push(request.url());
});
const folders = () => page.getByRole("navigation", { name: "Desktop folders" });
async function visit(route) {
  const response = await page.goto(baseURL + route, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await expect(page.locator("h1")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
}
async function layout(label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label + ": horizontal overflow");
  assert.equal(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1), false, label + ": desktop must fit viewport");
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  report.push({ label, violations: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })) });
  console.log(label + ": " + axe.violations.length + " accessibility issues");
}
try {
  await visit("/");
  await expect(page.locator("h1")).toHaveText("Mahek Ara");
  for (const project of projects) assert(!(await page.locator("main").innerText()).includes(project.title), "Projects stay in their folder");
  assert(await page.getByRole("img", { name: /Mahek Ara/ }).evaluate(image => image.complete && image.naturalWidth > 0), "Portrait loads");
  await layout("home / desktop / garden");
  await page.screenshot({ path: ".qa/desktop-home.png", fullPage: true });
  await page.getByRole("button", { name: "Use stone theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await layout("home / desktop / stone");
  await folders().getByRole("link", { name: "Writing", exact: true }).click();
  await expect(page).toHaveURL(baseURL + "/blog");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".md-post")).toHaveCount(5);
  await page.locator(".md-post").first().click();
  await expect(page).toHaveURL(baseURL + "/blog/context-relay");
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "Copy article link" }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), baseURL + "/blog/context-relay");
  await page.goBack(); await expect(page).toHaveURL(baseURL + "/blog");
  await page.goForward(); await expect(page).toHaveURL(baseURL + "/blog/context-relay");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(baseURL + "/desktop");
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toBeFocused();
  await expect(page.locator(".md-window")).toHaveCount(0);
  await layout("closed desktop / stone");
  await page.keyboard.press("Enter"); await expect(page).toHaveURL(baseURL + "/blog");
  await page.getByRole("link", { name: "Close window", exact: true }).click();
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toBeFocused();
  await folders().getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator(".md-project")).toHaveCount(2);
  await expect(page.locator("#context-relay")).toContainText("Public npm beta");
  await page.locator("#context-relay summary").click();
  await expect(page.locator("#context-relay")).toContainText(/live model-quality evaluation remains pending/i);
  await visit("/projects?focus=ai#llm-router");
  await expect(page.locator(".md-archive")).toHaveAttribute("open", "");
  await expect(page.locator("#llm-router")).toBeInViewport();
  await visit("/blog/llm-routing");
  await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes('complexity == "low"'));
  await page.locator(".essay-toc a[href='#routing-cost']").click();
  await expect(page.locator("#routing-cost")).toBeInViewport();
  for (const note of notes) {
    await visit("/blog/" + note.slug);
    await expect(page.locator("h1")).toHaveText(note.title);
    assert((await page.locator("article").innerText()).split(/\s+/).length > 300, "Finished article, not an outline");
    await expect(page.locator(".md-sources a")).toHaveCount(note.sources.length);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mahekara.vercel.app/blog/" + note.slug);
  }
  await visit("/contact");
  await expect(page.locator(".md-email")).toHaveAttribute("href", links.email);
  await expect(page.locator(".md-contact-links a")).toHaveCount(3);
  await visit("/about"); await expect(page).toHaveURL(baseURL + "/");
  const routes = ["/", "/blog", "/projects", "/contact", "/blog/context-relay", "/blog/llm-routing"];
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 760 : 900 });
    for (const route of routes) {
      await visit(route);
      await layout(route + " / " + width + " / garden");
      await page.getByRole("button", { name: "Use stone theme" }).click();
      await layout(route + " / " + width + " / stone");
      if (width === 320 && route === "/") await page.screenshot({ path: ".qa/mobile-home.png", fullPage: true });
    }
  }
  for (const viewport of [{ width: 1440, height: 900 }, { width: 320, height: 760 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await visit("/blog/llm-routing");
    const content = page.locator(".md-window-content");
    const frame = page.locator(".md-window");
    const sidebarBefore = await folders().boundingBox();
    const barBefore = await page.locator(".md-window-bar").boundingBox();
    const frameBefore = await frame.boundingBox();
    await content.hover();
    await page.mouse.wheel(0, 650);
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBeGreaterThan(100);
    assert.equal(await page.evaluate(() => scrollY), 0, "The page stays still while reading");
    assert.deepEqual(await folders().boundingBox(), sidebarBefore, "Folders stay in place");
    assert.deepEqual(await page.locator(".md-window-bar").boundingBox(), barBefore, "Window controls stay in place");
    await content.focus();
    const beforePageDown = await content.evaluate(el => el.scrollTop);
    const keyboardScrollEnded = content.evaluate(el => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Keyboard scroll did not finish")), 5000);
      el.addEventListener("scrollend", () => { clearTimeout(timeout); resolve(true); }, { once: true });
    }));
    await page.keyboard.press("PageDown");
    await keyboardScrollEnded;
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBeGreaterThan(beforePageDown);
    await page.getByRole("button", { name: "Maximize window", exact: true }).click();
    await expect(frame).toHaveAttribute("data-maximized", "true");
    assert.deepEqual(await frame.boundingBox(), { x: 0, y: 0, ...viewport }, "Maximize fills the viewport");
    await expect(page.getByRole("button", { name: "Restore window", exact: true })).toBeFocused();
    await expect(page.getByRole("button", { name: "Restore window", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(folders()).toHaveCount(0); // Covered controls cannot receive keyboard focus.
    assert((await content.evaluate(el => el.scrollTop)) > 100, "Maximize preserves reading progress");
    await layout("maximized article / " + viewport.width + "x" + viewport.height);
    if (viewport.width === 1440) await page.screenshot({ path: ".qa/maximized-article.png" });
    await content.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await content.hover();
    await page.mouse.wheel(0, 650);
    // At the edge no scrollend event fires. Finish the native wheel gesture
    // before resizing so queued input cannot scroll the newly restored window.
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => scrollY), 0, "Scrolling at the window edge cannot move the desktop");
    await page.keyboard.press("Escape");
    await expect(frame).toHaveAttribute("data-maximized", "false");
    assert.deepEqual(await frame.boundingBox(), frameBefore, "Restore returns the floating window size");
    await expect(page.getByRole("button", { name: "Maximize window", exact: true })).toBeFocused();
    await expect(page).toHaveURL(baseURL + "/blog/llm-routing");
    await content.evaluate(el => { el.scrollTop = 500; });
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBe(500);
    const readingPosition = await content.evaluate(el => el.scrollTop);
    await folders().getByRole("link", { name: "About me", exact: true }).click();
    await expect(page.locator(".md-welcome")).toBeInViewport();
    await expect.poll(() => page.locator(".md-window-content").evaluate(el => el.scrollTop)).toBe(0);
    await page.goBack();
    await expect(page).toHaveURL(baseURL + "/blog/llm-routing");
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBe(readingPosition);
    await page.goForward();
    await expect(page).toHaveURL(baseURL + "/");
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBe(0);
    await page.getByRole("button", { name: "Maximize window", exact: true }).click();
    await page.getByRole("link", { name: "Close window", exact: true }).click();
    await expect(page).toHaveURL(baseURL + "/desktop");
    await expect(folders().getByRole("link", { name: "About me", exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator(".md-window")).toHaveAttribute("data-maximized", "false");
  }
  await page.setViewportSize({ width: 320, height: 760 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await visit("/");
  assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter"); await expect(page.locator("main")).toBeFocused();
  const missing = await page.goto(baseURL + "/blog/missing-note");
  assert.equal(missing.status(), 404);
  await expect(page.locator("h1")).toHaveText("This page wandered off.");
  await layout("404 / mobile");
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noScript.newPage();
  await staticPage.goto(baseURL + "/blog");
  await staticPage.locator(".md-post").first().click();
  await expect(staticPage.locator("h1")).toHaveText(notes[0].title);
  await staticPage.locator(".md-sources a").last().scrollIntoViewIfNeeded();
  await expect(staticPage.locator(".md-sources a").last()).toBeInViewport();
  assert.equal(await staticPage.evaluate(() => scrollY), 0, "Inner scrolling works without JavaScript");
  await noScript.close();
  assert.deepEqual(errors, [], "Runtime errors");
  assert.deepEqual(remoteRequests, [], "No third-party services needed to render");
  await writeFile(".qa/interface-report.json", JSON.stringify({ report, errors, remoteRequests }, null, 2));
  assert.equal(report.flatMap(item => item.violations).length, 0, "Accessibility issues: see .qa/interface-report.json");
  console.log("Desktop navigation, history, article links, portrait, responsive layout, themes, keyboard, no-JS reading and accessibility checks passed.");
} finally { await writeFile(".qa/interface-report.json", JSON.stringify({ report, errors, remoteRequests }, null, 2)); await browser.close(); }
