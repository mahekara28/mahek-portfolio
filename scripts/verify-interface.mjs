import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects, links } from "../app/lib/content.ts";
import { notes, readingTime } from "../app/lib/writing.ts";

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
  // About should fit rather than hiding its links below an inner scrollbar.
  for (const viewport of [
    { width: 1440, height: 900 }, { width: 1366, height: 768 },
    { width: 665, height: 532 }, { width: 844, height: 390 },
    { width: 390, height: 844 }, { width: 360, height: 640 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    const content = page.locator(".md-window-content");
    await expect.poll(() => content.evaluate(el => el.scrollHeight - el.clientHeight), {
      message: `About fits at ${viewport.width}×${viewport.height}`,
    }).toBeLessThanOrEqual(1);
    const bounds = await content.boundingBox();
    const linksBox = await page.locator(".md-about-links").boundingBox();
    assert(linksBox.y >= bounds.y && linksBox.y + linksBox.height <= bounds.y + bounds.height + 1, "About links stay inside the window");
    await expect(page.locator(".md-signature")).toBeInViewport();
    if (viewport.width === 320) await page.screenshot({ path: ".qa/about-small-phone.png", animations: "disabled" });
    if (viewport.width === 360) await page.screenshot({ path: ".qa/about-phone.png", animations: "disabled" });
    if (viewport.width === 665) await page.screenshot({ path: ".qa/about-short-window.png", animations: "disabled" });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  const photo = page.locator(".md-photo-print");
  const restingPhoto = await photo.evaluate(el => getComputedStyle(el).transform);
  await page.locator(".md-portrait-composition").hover();
  await expect.poll(() => photo.evaluate(el => getComputedStyle(el).transform)).not.toBe(restingPhoto);
  await page.mouse.move(1380, 810);
  await expect(page.locator(".md-grid-focus")).toHaveAttribute("data-visible", "true");
  await page.getByRole("button", { name: "Switch color theme" }).hover();
  await expect(page.locator(".md-grid-focus")).not.toHaveAttribute("data-visible");
  await expect(page.locator("h1")).toHaveText("Mahek Ara");
  for (const project of projects) assert(!(await page.locator("main").innerText()).includes(project.title), "Projects stay in their folder");
  assert(await page.getByRole("img", { name: /Mahek Ara/ }).evaluate(image => image.complete && image.naturalWidth > 0), "Portrait loads");
  await expect(page.locator(".md-app-icon")).toHaveCount(4);
  await expect(folders().getByRole("link", { name: "Resume", exact: true })).toHaveCount(0);
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
  // The title bar still moves; desktop app icons stay anchored.
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
  for (const name of ["About me", "Writing", "Projects", "Contact"]) {
    const shortcut = folders().getByRole("link", { name, exact: true });
    const before = await shortcut.boundingBox();
    await drag(shortcut, 45, 3);
    const after = await shortcut.boundingBox();
    assert.deepEqual(after, before, name + " stays anchored after a pointer gesture");
    await visit("/");
  }
  const writing = folders().getByRole("link", { name: "Writing", exact: true });
  const movedShortcut = await writing.boundingBox();
  await writing.focus();
  await page.keyboard.press("Alt+ArrowRight");
  assert.deepEqual(await writing.boundingBox(), movedShortcut, "Alt + arrow cannot move icons");
  await page.getByRole("button", { name: "Move window", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  assert((await frame.boundingBox()).x < movedWindow.x, "Keyboard can move windows");
  await page.getByRole("button", { name: "Reset window", exact: true }).click();
  assert.deepEqual(await frame.boundingBox(), initialWindow, "Reset returns the default window position");
  await folders().getByRole("link", { name: "Writing", exact: true }).click();
  await expect(page).toHaveURL(baseURL + "/blog");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator(".md-post")).toHaveCount(notes.length);
  await expect(page.locator('.md-post[href="/blog/agent-latency"]')).toContainText("The Model Was Fast. Why Did the Agent Take 12 Seconds?");
  await expect(page.locator('.md-post[href*="notion"]')).toHaveCount(0);
  await page.screenshot({ path: ".qa/writing-updated.png", fullPage: true });
  await page.locator('.md-post[href="/blog/context-relay"]').click();
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
  await expect(page.getByRole("img", { name: /A little room for curiosity/ })).toBeVisible();
  await page.screenshot({ path: ".qa/desktop-closed.png", fullPage: true, animations: "disabled" });
  await appearance("light");
  await layout("closed desktop / soft ivory");
  await page.screenshot({ path: ".qa/desktop-closed-light.png", fullPage: true, animations: "disabled" });
  await appearance("dark");
  await folders().getByRole("link", { name: "Writing", exact: true }).focus();
  await page.keyboard.press("Enter"); await expect(page).toHaveURL(baseURL + "/blog");
  await page.getByRole("link", { name: "Close window", exact: true }).click();
  await expect(folders().getByRole("link", { name: "Writing", exact: true })).toBeFocused();
  await folders().getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator(".md-project")).toHaveCount(3);
  assert.deepEqual(await page.locator(".md-project").evaluateAll(cards => cards.map(card => card.id)), ["context-relay", "aura-linkedin", "build-buy-borrow"]);
  await expect(page.locator("#context-relay")).toContainText("Public npm beta");
  await expect(page.locator("#context-relay .md-project-art--dark img")).toBeVisible();
  await expect(page.locator("#context-relay .md-project-art--light img")).toBeHidden();
  await expect(page.locator("#aura-linkedin")).toContainText("Unpacked Chrome extension");
  await expect(page.locator("#aura-linkedin img")).toBeVisible();
  await expect(page.locator("#build-buy-borrow img")).toBeVisible();
  for (const image of await page.locator(".md-project-cover img:visible").all()) {
    assert(await image.evaluate(node => node.complete && node.naturalWidth > 0), "Project artwork loads");
  }
  await appearance("light");
  await expect(page.locator("#context-relay .md-project-art--light img")).toBeVisible();
  await expect(page.locator("#context-relay .md-project-art--dark img")).toBeHidden();
  await appearance("dark");
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
    const articleText = await page.locator("article").innerText();
    if (note.slug === "context-relay") assert(articleText.split(/\s+/).length > 1200, "Deep dive includes the complete implementation path");
    await expect(page.locator(".md-architecture svg[role=img]")).toHaveCount(note.sections.filter(section => section.diagram).length);
    for (const svg of await page.locator(".md-architecture svg").all()) {
      assert((await svg.locator("title").textContent()).length > 20, "Diagram has a descriptive title");
      assert((await svg.locator("desc").textContent()).length > 80, "Diagram has a text equivalent");
    }
    if (note.sections.some(section => section.media === "architecture")) await expect(page.locator(".md-readme-architecture img")).toBeVisible();
    await expect(page.locator(".md-article-meta")).toContainText(readingTime(note));
    await expect(page.locator(".md-sources a")).toHaveCount(note.sources.length);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://mahekara.vercel.app/blog/" + note.slug);
    if (note.slug === "agent-latency") {
      assert(articleText.includes("These are example timings, not production measurements."));
      assert(articleText.includes("Once the delay has a cause, the next performance change becomes a reasoned choice."));
      await expect(page.locator('article a[href*="notion"]')).toHaveCount(0);
      await expect(page.locator(".md-article-meta time")).toHaveCount(0);
      await page.screenshot({ path: ".qa/agent-latency-article.png", animations: "disabled" });
      const illustration = page.locator("#agent-latency-animation");
      await illustration.scrollIntoViewIfNeeded();
      await expect(illustration).toHaveAttribute("src", /architecture\.gif$/);
      await expect.poll(() => illustration.evaluate(img => img.complete && img.naturalWidth === 1200)).toBe(true);
      assert(await illustration.evaluate(img => img.complete && img.naturalWidth === 1200), "Local illustration loads");
      await page.getByRole("button", { name: "Stop animation", exact: true }).click();
      await expect(illustration).toHaveAttribute("src", /architecture\.png$/);
      await page.getByRole("button", { name: "Play animation", exact: true }).click();
      await expect(illustration).toHaveAttribute("src", /architecture\.gif$/);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await expect(illustration).toHaveAttribute("src", /architecture\.png$/);
      await expect(page.getByRole("button", { name: "Stop animation", exact: true })).toHaveCount(0);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect(illustration).toHaveAttribute("src", /architecture\.gif$/);
      await page.getByRole("button", { name: "Stop animation", exact: true }).click();
      await expect(illustration).toHaveAttribute("src", /architecture\.png$/);
      await expect(page.locator(".md-section-references")).toHaveCount(0);
      await expect(page.locator(".md-sources a")).toHaveCount(4);
      await page.getByRole("navigation", { name: "On this page" }).locator('a[href="#critical-path"]').click();
      await expect(page.locator("#critical-path h2")).toBeInViewport();
    }
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
  const routes = ["/", "/blog", "/projects", "/contact", ...notes.map(note => "/blog/" + note.slug)];
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
    await expect(page.locator(".md-signature")).toBeInViewport();
    await expect(page.locator(".md-bio")).toBeInViewport();
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
  // Touch movement leaves the icons anchored and does not activate them.
  const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(baseURL + "/", { waitUntil: "networkidle" });
  const touchIcon = touchPage.locator('[data-open="contact"]');
  const touchStart = await touchIcon.boundingBox();
  const touchClient = await touchContext.newCDPSession(touchPage);
  const finger = { x: touchStart.x + touchStart.width / 2, y: touchStart.y + 20 };
  await touchClient.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [finger] });
  await touchClient.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: finger.x - 80, y: finger.y + 10 }] });
  await touchClient.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  assert.deepEqual(await touchIcon.boundingBox(), touchStart, "Touch gesture leaves the icon anchored");
  assert.equal(touchContext.pages().length, 1, "Touch gesture does not open an external tab");
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
  await page.getByRole("button", { name: "Minimize window", exact: true }).click();
  await expect(page.getByRole("img", { name: /A little room for curiosity/ })).toBeVisible();
  assert.equal(await page.evaluate(() => document.getAnimations().filter(animation => animation.playState === "running").length), 0, "Desktop sketch respects reduced motion");
  await page.getByRole("link", { name: "Back to my introduction" }).click();
  await expect(page.locator(".md-window")).toBeVisible();
  await page.getByRole("link", { name: "Close window", exact: true }).click();
  await layout("closed desktop / mobile / reduced motion");
  await page.screenshot({ path: ".qa/mobile-closed.png", fullPage: true });
  await page.getByRole("link", { name: "Back to my introduction" }).click();
  await expect(page.locator(".md-signature")).toBeInViewport();
  await expect(page.locator(".md-bio")).toBeInViewport();
  await visit("/");
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
  console.log("Desktop navigation, anchored icons, project artwork and order, history, article links, responsive layout, persisted dark/light themes, keyboard, no-JS reading and accessibility checks passed.");
} finally { await writeFile(".qa/interface-report.json", JSON.stringify({ report, errors, remoteRequests }, null, 2)); await browser.close(); }
