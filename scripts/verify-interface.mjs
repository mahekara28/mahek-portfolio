import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { projects, links } from "../app/lib/content.ts";

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "light" });
await context.addInitScript(() => { localStorage.setItem("theme", "light"); });
await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: baseURL });
const page = await context.newPage();
page.setDefaultTimeout(20000);
const errors = [], remoteRequests = [], report = [];
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== new URL(baseURL).origin) remoteRequests.push(request.url());
});
const study = page.getByTestId("evidence-field");
const projectDialog = page.locator(".case-dialog");
const navigation = () => page.getByRole("navigation", { name: "Main navigation", exact: true });

async function visit(route) {
  const response = await page.goto(baseURL + route, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, route);
  await page.locator("h1").waitFor({ state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("link", { name: /resume/i })).toHaveCount(0);
}
async function layout(label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, label + ": overflow");
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  report.push({ label, violations: axe.violations.map(({ id, impact, nodes }) => ({ id, impact, elements: nodes.map((node) => node.target) })) });
  console.log(label + ": " + axe.violations.length + " accessibility issues");
}
async function capture(name, fullPage = true) {
  await page.screenshot({ path: ".qa/" + name + ".png", fullPage, animations: "disabled" });
}
async function closeProject() {
  await page.getByRole("button", { name: "Close project details" }).click();
  await expect(projectDialog).not.toBeVisible();
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
}
async function changeTheme() {
  await page.getByRole("button", { name: "Toggle light and dark theme" }).first().click();
}
try {
  await visit("/");
  await expect(page.getByTestId("home-introduction")).toBeInViewport();
  await expect(page.locator("a[href='/about']")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^(Briefly|More detail|Run again|Pause animation|Resume animation)$/ })).toHaveCount(0);
  for (const project of projects) assert(!(await page.locator("main").innerText()).includes(project.title), "No project names on home");
  await expect(study.locator('button,input,select,summary,a')).toHaveCount(0);
  await expect(study).toHaveAttribute("data-state", "reported");
  await expect(study).toHaveAttribute("data-step", "2");
  await expect(study).toHaveAttribute("data-state", "mismatch");
  await expect(study).toContainText("The tool returned JSON. The request was for CSV.");
  await page.waitForTimeout(900);
  assert.equal(await study.evaluate(el => el.getAnimations({subtree:true}).filter(a => a.playState === "running").length), 0, "Automatic sequence settles");
  await layout("home / desktop / dark"); await capture("home-desktop", false);
  await changeTheme();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await layout("home / desktop / light"); await capture("home-light", false);

  await navigation().getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".work-card")).toHaveCount(projects.length);
  await expect(projectDialog).not.toBeVisible();
  await layout("projects / desktop / light"); await capture("projects-light");
  await changeTheme();
  for (const project of projects) {
    const card = page.locator(".work-card[data-project='" + project.id + "']");
    await expect(card.locator(".work-repo")).toHaveAttribute("href", project.github);
    const trigger = card.getByRole("button", { name: "About " + project.title, exact: true });
    await trigger.click();
    await expect(projectDialog).toBeVisible();
    await expect(page.locator(".case-sheet")).toHaveAttribute("data-project", project.id);
    await expect(projectDialog.locator(".project-boundary")).toHaveText(project.boundary);
    await expect(projectDialog.locator(".source-files a").first()).toHaveAttribute("href", new RegExp("/blob/" + project.revision + "/"));
    await closeProject();
    await expect(trigger).toBeFocused();
  }
  await page.getByRole("button", { name: "Developer experience", exact: true }).click();
  await expect(page.locator(".work-card")).toHaveCount(projects.filter((p) => p.focus.includes("developer")).length);
  await expect(page).toHaveURL(/focus=developer/);
  await page.goBack();
  await expect(page.getByRole("button", { name: "All projects", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(page.getByRole("button", { name: "Developer experience", exact: true })).toHaveAttribute("aria-pressed", "true");
  await visit("/projects");
  await layout("projects / desktop / dark"); await capture("projects-desktop");
  await visit("/projects?focus=ai#context-relay");
  await expect(projectDialog).toBeVisible();
  await expect(page.locator(".case-sheet")).toHaveAttribute("data-project", "context-relay");
  await layout("project dialog / desktop / dark"); await capture("project-detail", false);
  await page.keyboard.press("Escape");
  await expect(projectDialog).not.toBeVisible();
  await visit("/projects?focus=operations#context-relay");
  await expect(page.getByRole("button", { name: "All projects", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(projectDialog).toBeVisible();
  await page.mouse.click(10, 100);
  await expect(projectDialog).not.toBeVisible();
  await visit("/projects#build-buy-borrow");
  await page.locator(".project-capture").scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector(".project-capture img")?.naturalWidth > 0);
  await closeProject();

  await visit("/blog");
  await expect(page.locator(".repository-note")).toHaveCount(3);
  await layout("writing / desktop / dark");
  await page.locator(".writing-link").click();
  await expect(page).toHaveURL(/\/blog\/llm-routing$/);
  await page.getByRole("button", { name: "Copy article link", exact: true }).click();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), baseURL + "/blog/llm-routing");
  await page.getByRole("button", { name: "Copy code", exact: true }).first().click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes('complexity == "low"'));
  await page.locator(".essay-toc a[href='#routing-cost']").click();
  await expect(page.locator("#routing-cost")).toBeInViewport();
  await layout("article / desktop / dark");
  await changeTheme(); await layout("article / desktop / light");
  await visit("/about"); await expect(page).toHaveURL(baseURL + "/");
  await expect(study).toHaveAttribute("data-step", "2");
  for (const width of [1366, 1024, 820]) {
    await page.setViewportSize({ width, height: 768 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "Home width " + width);
    if (width >= 1024) assert(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight + 1), "Home fits " + width + "x768");
  }

  await page.setViewportSize({ width: 393, height: 852 });
  for (const route of ["/", "/projects", "/blog", "/blog/llm-routing"]) {
    await visit(route);
    if (route === "/") { await study.scrollIntoViewIfNeeded(); await expect(study).toHaveAttribute("data-step", "2"); }
    await layout(route + " / mobile / dark");
    await capture((route === "/" ? "home" : route.split("/").filter(Boolean).join("-")) + "-mobile");
    await changeTheme(); await layout(route + " / mobile / light");
  }
  await visit("/projects");
  const trigger = page.getByRole("button", { name: "About MCP Impact", exact: true });
  await trigger.focus(); await page.keyboard.press("Enter");
  await expect(projectDialog).toBeVisible();
  await expect(page).toHaveURL(/#mcp-impact$/);
  await layout("project dialog / mobile / dark");
  await page.setViewportSize({ width: 320, height: 568 });
  await projectDialog.locator(".case-footer").scrollIntoViewIfNeeded();
  await expect(projectDialog.locator(".case-footer")).toBeInViewport();
  await layout("project dialog / 320px");
  await page.keyboard.press("Escape"); await expect(trigger).toBeFocused();
  await changeTheme();
  await trigger.click(); await layout("project dialog / mobile / light"); await closeProject();
  await page.getByRole("button", { name: "Open navigation" }).click();
  const dialog = page.getByRole("dialog", { name: "Navigation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /resume/i })).toHaveCount(0);
  await layout("mobile menu");
  for (const [width, height] of [[393, 600], [320, 568]]) {
    await page.setViewportSize({ width, height });
    assert(await page.locator(".mobile-menu-footer").evaluate((el) => el.getBoundingClientRect().bottom <= innerHeight), "Menu bottom remains visible");
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => !!document.activeElement.closest("dialog")), "Focus remains inside drawer");
  }
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open navigation" })).toBeFocused();
  await visit("/");
  await expect(study).toHaveAttribute("data-step", "0");
  await page.waitForTimeout(1700);
  await expect(study).toHaveAttribute("data-step", "0");
  await study.scrollIntoViewIfNeeded();
  await expect(study).toHaveAttribute("data-step", "1");
  await page.evaluate(() => scrollTo(0,0));
  await page.waitForTimeout(200);
  const pausedStep = await study.getAttribute("data-step");
  await page.waitForTimeout(1700);
  await expect(study).toHaveAttribute("data-step", pausedStep);
  await study.scrollIntoViewIfNeeded();
  await expect(study).toHaveAttribute("data-step", "2");
  await layout("home / 320px");
  await page.emulateMedia({ reducedMotion: "reduce" }); await visit("/");
  await expect(study).toHaveAttribute("data-step", "2");
  assert.equal(await study.evaluate(el => el.getAnimations({subtree:true}).filter(a => a.playState === "running").length), 0, "Reduced motion has no running animations");
  await expect(study.locator("button,input,select,summary,a")).toHaveCount(0);
  await visit("/projects"); await layout("projects / 320px / reduced motion");
  await visit("/blog");
  await expect(page.locator(".contact-link")).toHaveAttribute("href", links.email);
  await expect(page.locator(".footer-links a[href='" + links.github + "']")).toHaveCount(1);
  assert.deepEqual(errors, [], "Runtime errors");
  assert.deepEqual(remoteRequests, [], "No external services needed to render");
  await writeFile(".qa/interface-report.json", JSON.stringify({ report, errors }, null, 2));
  assert.equal(report.flatMap((r) => r.violations).length, 0, "Accessibility issues: see .qa/interface-report.json");
  console.log("All route, interaction, theme, mobile, keyboard and reduced-motion checks passed.");
} finally { await browser.close(); }
