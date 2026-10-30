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
let expectedTheme = "dark";
async function appearance(theme) {
  if (await page.locator("html").getAttribute("data-theme") !== theme) {
    await page.getByRole("button", { name: "Switch color theme" }).click();
  }
  expectedTheme = theme;
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
}
async function visit(route) {
  const response = await page.goto(baseURL + route, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await expect(page.locator("h1")).toHaveCount(1);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("data-theme", expectedTheme);
}
async function layout(label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label + ": horizontal overflow");
  assert.equal(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1), false, label + ": desktop must fit viewport");
  for (const content of await page.locator(".md-window-content:visible").all()) assert(await content.evaluate(el => el.scrollWidth <= el.clientWidth + 1), label + ": window content fits horizontally");
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  report.push({ label, violations: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })) });
  console.log(label + ": " + axe.violations.length + " accessibility issues");
}
try {
  await visit("/");
  await expect(page.locator("h1")).toHaveText("Mahek Ara");
  for (const project of projects) assert(!(await page.locator("main").innerText()).includes(project.title), "Projects stay in their folder");
  assert(await page.getByRole("img", { name: /Mahek Ara/ }).evaluate(image => image.complete && image.naturalWidth > 0), "Portrait loads");
  await expect(page.locator(".md-app-icon")).toHaveCount(5);
  await expect(folders().getByRole("link", { name: "Resume", exact: true })).toHaveAttribute("href", links.resume);
  await expect(page.getByRole("navigation", { name: "Social profiles" }).getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", links.linkedin);
  await layout("home / desktop / graphite");
  await page.screenshot({ path: ".qa/desktop-home.png", fullPage: true });
  const originalIcons = await page.locator(".md-app-icon").evaluateAll(icons => icons.map(icon => ({
    artwork: icon.outerHTML, width: icon.getBoundingClientRect().width, height: icon.getBoundingClientRect().height,
  })));
  const themeControl = page.getByRole("button", { name: "Switch color theme" });
  await themeControl.focus();
  await page.keyboard.press("Enter");
  expectedTheme = "light";
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(themeControl.locator(".md-show-in-light")).toBeVisible();
  await expect(themeControl.locator(".md-show-in-dark")).toBeHidden();
  assert.equal(await page.evaluate(() => localStorage.getItem("mahek-appearance")), "light", "Theme choice is saved");
  assert.deepEqual(await page.locator(".md-app-icon").evaluateAll(icons => icons.map(icon => ({
    artwork: icon.outerHTML, width: icon.getBoundingClientRect().width, height: icon.getBoundingClientRect().height,
  }))), originalIcons, "Theme switching preserves the existing icon artwork and dimensions");
  await layout("home / desktop / soft ivory");
  await page.screenshot({ path: ".qa/desktop-home-light.png", fullPage: true });
  await folders().getByRole("link", { name: "Writing", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await appearance("dark");
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await visit("/");
  // Pointer gestures rearrange items without navigating; explicit activation still opens them.
  async function drag(locator, dx, dy) {
    const box = await locator.boundingBox();
    assert(box, "Drag target exists");
    const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + dx, start.y + dy, { steps: 10 });
    await page.mouse.up();
  }
  const frame = page.locator(".md-window");
  const initialWindow = await frame.boundingBox();
  await drag(page.getByRole("button", { name: "Move window", exact: true }), 100, 40);
  const movedWindow = await frame.boundingBox();
  assert(movedWindow.x > initialWindow.x + 50 && movedWindow.y > initialWindow.y + 20, "Title bar moves the window");
  await page.getByRole("button", { name: "Maximize window", exact: true }).click();
  await page.getByRole("button", { name: "Restore window", exact: true }).click();
  assert.deepEqual(await frame.boundingBox(), movedWindow, "Restore remembers the dragged location");
  for (const name of ["About me", "Writing", "Projects", "Contact", "Resume"]) {
    const shortcut = folders().getByRole("link", { name, exact: true });
    const before = await shortcut.boundingBox();
    await drag(shortcut, 45, 3);
    const after = await shortcut.boundingBox();
    assert(after.x > before.x + 30, name + " moves independently");
    await expect(page).toHaveURL(baseURL + "/");
    assert.equal(context.pages().length, 1, "Dragging the resume cannot open an external tab");
  }
  // A single large pointer move must be captured even after it leaves a small icon.
  const resume = folders().getByRole("link", { name: "Resume", exact: true });
  const resumeStart = await resume.boundingBox();
  await page.mouse.move(resumeStart.x + 30, resumeStart.y + 25);
  await page.mouse.down();
  await page.mouse.move(resumeStart.x + 150, resumeStart.y - 35);
  await page.mouse.up();
  assert((await resume.boundingBox()).x > resumeStart.x + 80, "Fast drag retains the target");
  assert.equal(context.pages().length, 1, "Fast resume drag does not open a tab");
  const writing = folders().getByRole("link", { name: "Writing", exact: true });
  const movedShortcut = await writing.boundingBox();
  await writing.focus();
  await page.keyboard.press("Alt+ArrowRight");
  assert((await writing.boundingBox()).x > movedShortcut.x, "Keyboard can arrange icons");
  await page.getByRole("button", { name: "Move window", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  assert((await frame.boundingBox()).x < movedWindow.x, "Keyboard can move windows");
  await page.getByRole("button", { name: "Reset layout", exact: true }).click();
  assert.deepEqual(await frame.boundingBox(), initialWindow, "Reset returns the default window position");
  await folders().getByRole("link", { name: "Writing", exact: true }).click();
  await expect(page).toHaveURL(baseURL + "/blog");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".md-post")).toHaveCount(1);
  await page.locator(".md-post").first().click();
  await expect(page).toHaveURL(baseURL + "/blog/context-relay");
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toHaveAttribute("aria-current", "page");
  const reading = page.locator(".md-window-content");
  await reading.evaluate(el => { el.scrollTop = 400; });
  await page.getByRole("button", { name: "Minimize window", exact: true }).click();
  await expect(frame).toBeHidden();
  await expect(page.locator("#desktop-main h1")).toHaveText("Mahek Ara");
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Open Writing", exact: true }).click();
  await expect(frame).toBeVisible();
  await expect.poll(() => reading.evaluate(el => el.scrollTop)).toBe(400);
  await reading.evaluate(el => { el.scrollTop = 0; });
  await page.getByRole("button", { name: "Copy article link" }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), baseURL + "/blog/context-relay");
  await page.goBack(); await expect(page).toHaveURL(baseURL + "/blog");
  await page.goForward(); await expect(page).toHaveURL(baseURL + "/blog/context-relay");
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(baseURL + "/desktop");
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toBeFocused();
  await expect(page.locator(".md-window")).toHaveCount(0);
  await expect(page.locator("h1")).toHaveText("Mahek Ara");
  await layout("closed desktop / graphite");
  await page.keyboard.press("Enter"); await expect(page).toHaveURL(baseURL + "/blog");
  await page.getByRole("link", { name: "Close window", exact: true }).click();
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toBeFocused();
  await folders().getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator(".md-project")).toHaveCount(3);
  await expect(page.locator("#context-relay")).toContainText("Public npm beta");
  await expect(page.locator("#aura-linkedin")).toContainText("Unpacked Chrome extension");
  await expect(page.locator("#aura-linkedin img")).toBeVisible();
  await page.locator("#context-relay summary").click();
  await expect(page.locator("#context-relay")).toContainText(/live model-quality evaluation remains pending/i);
  await visit("/projects?focus=ai#llm-router");
  await expect(page.locator(".md-archive")).toHaveAttribute("open", "");
  await expect(page.locator("#llm-router")).toBeInViewport();
  await visit("/blog/context-relay");
  await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes('retention-days'));
  const contents = page.getByRole("navigation", { name: "On this page" });
  await contents.locator('a[href="#packet"]').click();
  await expect(page.locator("#packet h2")).toBeInViewport();
  await expect(contents.locator('a[href="#packet"]')).toHaveAttribute("aria-current", "location");
  await page.locator("#handoff").scrollIntoViewIfNeeded();
  await expect(contents.locator('a[href="#handoff"]')).toHaveAttribute("aria-current", "location");
  assert.equal(await page.evaluate(() => scrollY), 0, "Contents navigation scrolls the window, not the desktop");
  const railTop = (await page.locator(".md-article-toc").boundingBox()).y;
  await contents.locator('a[href="#model-proposals"]').click();
  await expect(contents.locator('a[href="#model-proposals"]')).toHaveAttribute("aria-current", "location");
  assert(Math.abs((await page.locator(".md-article-toc").boundingBox()).y - railTop) < 2, "Contents rail stays fixed while sections scroll");
  const demo = page.getByRole("button", { name: "Play recorded demo", exact: true });
  await expect(page.locator("#relay-recording")).toHaveAttribute("src", /threads\.png$/);
  await demo.click();
  await expect(page.locator("#relay-recording")).toHaveAttribute("src", /workflow\.gif$/);
  await page.getByRole("button", { name: "Stop demo", exact: true }).click();
  await expect(page.locator("#relay-recording")).toHaveAttribute("src", /threads\.png$/);
  for (const note of notes) {
    await visit("/blog/" + note.slug);
    await expect(page.locator("h1")).toHaveText(note.title);
    assert((await page.locator("article").innerText()).split(/\s+/).length > 1200, "Deep dive includes the complete implementation path");
    await expect(page.locator(".md-architecture svg[role=img]")).toHaveCount(2);
    for (const svg of await page.locator(".md-architecture svg").all()) {
      assert((await svg.locator("title").textContent()).length > 20, "Diagram has a descriptive title");
      assert((await svg.locator("desc").textContent()).length > 80, "Diagram has a text equivalent");
    }
    await expect(page.locator(".md-readme-architecture img")).toBeVisible();
    await expect(page.locator(".md-article-meta")).toContainText(/[6-8] min read/);
    await expect(page.locator(".md-sources a")).toHaveCount(note.sources.length);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mahekara.vercel.app/blog/" + note.slug);
  }
  await visit("/contact");
  await expect(page.locator(".md-email")).toHaveAttribute("href", links.email);
  await expect(page.locator(".md-contact-links a")).toHaveCount(3);
  await visit("/about"); await expect(page).toHaveURL(baseURL + "/");
  await visit("/blog/working-context"); await expect(page).toHaveURL(baseURL + "/blog/context-relay");
  for (const retired of ["decision-assumptions", "inference-latency", "verify-the-result", "llm-routing"]) {
    await visit("/blog/" + retired); await expect(page).toHaveURL(baseURL + "/blog");
  }
  await visit("/blog/context-relay#packet");
  await expect(page.locator("#packet h2")).toBeInViewport();
  await expect(contents.locator('a[href="#packet"]')).toHaveAttribute("aria-current", "location");
  const routes = ["/", "/blog", "/projects", "/contact", "/blog/context-relay"];
  for (const width of [1440, 320]) {
    await page.setViewportSize({ width, height: width === 320 ? 760 : 900 });
    for (const route of routes) {
      await visit(route);
      for (const theme of ["dark", "light"]) {
        await appearance(theme);
        await layout(route + " / " + width + " / " + theme);
        if (width === 320 && route === "/") await page.screenshot({ path: ".qa/mobile-home-" + theme + ".png", fullPage: true });
      }
      await appearance("dark");
    }
  }
  await page.setViewportSize({ width: 320, height: 760 });
  for (const note of notes) {
    await visit("/blog/" + note.slug);
    for (const diagram of await page.locator(".md-architecture-scroll").all()) {
      assert(await diagram.evaluate(el => el.scrollWidth > el.clientWidth), note.slug + ": diagram can be inspected horizontally on mobile");
      await diagram.focus();
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => diagram.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    }
    await layout(note.slug + " diagrams / mobile");
  }
  for (const viewport of [{ width: 1440, height: 900 }, { width: 320, height: 760 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport);
    await visit("/blog/context-relay");
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
    await expect(page).toHaveURL(baseURL + "/blog/context-relay");
    await content.evaluate(el => { el.scrollTop = 500; });
    await expect.poll(() => content.evaluate(el => el.scrollTop)).toBe(500);
    const readingPosition = await content.evaluate(el => el.scrollTop);
    await folders().getByRole("link", { name: "About me", exact: true }).click();
    await expect(page.locator(".md-welcome")).toBeInViewport();
    await expect.poll(() => page.locator(".md-window-content").evaluate(el => el.scrollTop)).toBe(0);
    await page.goBack();
    await expect(page).toHaveURL(baseURL + "/blog/context-relay");
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
  // Real touch events cover pointer capture and cancellation, not just synthetic callbacks.
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(baseURL + "/", { waitUntil: "networkidle" });
  const touchIcon = touchPage.locator('[data-open="resume"]');
  const touchStart = await touchIcon.boundingBox();
  const touchClient = await touchContext.newCDPSession(touchPage);
  const finger = { x: touchStart.x + touchStart.width / 2, y: touchStart.y + 20 };
  await touchClient.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [finger] });
  await touchClient.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: finger.x - 80, y: finger.y + 10 }] });
  await touchClient.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(async () => (await touchIcon.boundingBox()).x).toBeLessThan(touchStart.x - 50);
  assert.equal(touchContext.pages().length, 1, "Touch drag does not open resume");
  await expect(touchPage).toHaveURL(baseURL + "/");
  // A narrow viewport gets an accessible default arrangement rather than stranded controls.
  await touchPage.setViewportSize({ width: 320, height: 760 });
  await expect.poll(() => touchIcon.evaluate(el => el.style.transform)).toBe("");
  const touchBounds = await touchIcon.boundingBox();
  assert(touchBounds.x >= 0 && touchBounds.x + touchBounds.width <= 320);
  await touchContext.close();
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
  console.log("Desktop navigation, history, article links, unchanged icons, responsive layout, persisted dark/light themes, keyboard, no-JS reading and accessibility checks passed.");
} finally { await writeFile(".qa/interface-report.json", JSON.stringify({ report, errors, remoteRequests }, null, 2)); await browser.close(); }
