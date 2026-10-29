import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  tracePoint,
  traceStudies,
  traceLabels,
  STRANDS,
  STEPS,
} from "../app/lib/trace-studies.ts";
import { projects, links } from "../app/lib/content.ts";
import {
  band,
  field as observationField,
  glyphIds,
  observe,
  rasterize,
  cellSize,
} from "../app/lib/unseen-part.ts";

const shapes = new Set();
assert.equal(traceStudies.length, 6);
for (let study = 0; study < traceStudies.length; study++) {
  const points = Array.from({ length: STRANDS }, (_, line) =>
    Array.from({ length: STEPS + 1 }, (_, step) =>
      tracePoint(study, line, step / STEPS),
    ),
  );
  for (const point of points.flat()) {
    assert(
      point.x >= 0 && point.x <= 1 && point.y >= 0 && point.y <= 1,
      "Trace stays within its field",
    );
  }
  shapes.add(JSON.stringify(points));
  assert(traceLabels(study).outputs.length > 0);
}
assert.equal(shapes.size, 6, "Each study has a distinct relationship");
const securityIndex = traceStudies.findIndex(
  (study) => study.projectId === "prompt-injection-lab",
);
assert(
  tracePoint(securityIndex, 0, 1).x < 0.6,
  "Blocked trace stops at the boundary",
);
assert(
  tracePoint(securityIndex, 20, 1).x > 0.9,
  "Exploited trace crosses the boundary",
);

const baseURL = process.env.BASE_URL || "http://127.0.0.1:3000";
await mkdir(".qa", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
    ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
    : {}),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await context.addInitScript(() => {
  try {
    localStorage.setItem("theme", "light");
  } catch {}
});
const page = await context.newPage();
page.setDefaultTimeout(30000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const report = [];
const remoteRequests = [];
page.on("request", (request) => {
  if (
    /^https?:/.test(request.url()) &&
    new URL(request.url()).origin !== new URL(baseURL).origin
  )
    remoteRequests.push(request.url());
});

async function capture(options) {
  const observation = page.getByTestId("unseen-part");
  if (await observation.count())
    await expect(observation).toHaveAttribute("data-previewing", "false", {
      timeout: 6000,
    });
  await page.screenshot({ timeout: 90000, animations: "disabled", ...options });
}

async function visit(route) {
  console.log(`Opening ${route}`);
  const response = await page.goto(baseURL + route, {
    waitUntil: "networkidle",
    timeout: 180000,
  });
  // Same-page anchors have no new HTTP response.
  if (response) assert.equal(response.status(), 200, route);
  await expect(page).toHaveURL(new URL(route, baseURL).href);
  await page.locator("h1").waitFor();
  await page.evaluate(() => document.fonts.ready);
}

async function assertLayout(label) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  );
  assert.equal(overflow, false, `${label}: horizontal overflow`);
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  report.push({
    label,
    violations: result.violations.map(({ id, impact, nodes }) => ({
      id,
      impact,
      elements: nodes.map((node) => node.target),
    })),
  });
  console.log(`${label}: ${result.violations.length} accessibility violations`);
}

async function painted() {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("canvas");
    if (!canvas || !canvas.width) return false;
    const data = canvas
      .getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height).data;
    let ink = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 0) ink++;
    return ink > 500;
  });
}

async function setView(position) {
  const drawing = page.getByTestId("observation-field");
  await page.getByRole("slider", { name: "Observation band" }).focus();
  await drawing.scrollIntoViewIfNeeded();
  const rect = await drawing.boundingBox();
  await page.mouse.click(
    rect.x + rect.width * 0.55,
    rect.y + (position / observationField.height) * rect.height,
  );
}

async function inspectObservation() {
  const world = page.getByTestId("unseen-part");
  const slider = page.getByRole("slider", { name: "Observation band" });
  const close = page.getByRole("button", {
    name: "Close explanation",
    exact: true,
  });
  if (await close.isVisible()) await close.click();
  await slider.focus();
  await slider.press("Home");
  const original = await world
    .getByTestId("observed-ink")
    .locator("path")
    .getAttribute("d");
  for (const position of [112, 244, 350, 112]) {
    await setView(position);
    const expected = observe(position);
    await expect(world).toHaveAttribute("data-position", String(position));
    await expect(world).toHaveAttribute(
      "data-matches",
      expected.matches.join(""),
    );
    await expect(page.getByTestId("observation-statement")).toHaveText(
      expected.headline,
    );
    for (const glyph of glyphIds)
      await expect(
        world.locator('[data-glyph="' + glyph + '"]'),
      ).toHaveAttribute("data-match", String(expected.matches.includes(glyph)));
    assert.equal(
      await world.getByTestId("observed-ink").locator("path").getAttribute("d"),
      original,
      "Moving the view never changes the underlying shape",
    );
    await page.getByRole("button", { name: "Explain this view" }).click();
    for (const entry of expected.evidence)
      await expect(
        page.locator('[data-candidate="' + entry.id + '"]'),
      ).toContainText(entry.reason);
    await expect(page.locator("#observation-evidence")).toContainText(
      "sampled on a 2px grid",
    );
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Explain this view" }),
    ).toBeFocused();
    await expect(page.locator("#observation-evidence")).toHaveCount(0);
  }
  await slider.focus();
  await slider.press("End");
  await expect(world).toHaveAttribute("data-position", String(band.max));
  await expect(world).toHaveAttribute("data-matches", "R");
  await slider.press("Home");
  await slider.press("ArrowDown");
  await expect(world).toHaveAttribute("data-position", String(band.min + 8));
  await setView(112);
  await page.waitForTimeout(280);
  await expect(world).toHaveAttribute("data-previewing", "false");
  assert.equal(
    await world.evaluate((el) =>
      el
        .getAnimations({ subtree: true })
        .some((a) => a.playState === "running"),
    ),
    false,
    "No perpetual motion remains after interaction",
  );
}

async function verifySvgGeometry() {
  const samples = [];
  for (const id of glyphIds) {
    const mask = rasterize(id),
      columns = observationField.width / cellSize;
    for (const y of [37, 75, 113, 175, 211, 241, 281, 307, 351, 401]) {
      for (const x of [91, 115, 131, 167, 223, 291, 331, 363])
        samples.push({
          id,
          x,
          y,
          expected:
            !!mask[
              Math.floor(y / cellSize) * columns + Math.floor(x / cellSize)
            ],
        });
    }
  }
  const mismatches = await page.evaluate(
    (samples) =>
      samples.filter(
        ({ id, x, y, expected }) =>
          document
            .querySelector('[data-glyph="' + id + '"] path')
            .isPointInFill(new DOMPoint(x, y)) !== expected,
      ),
    samples,
  );
  assert.deepEqual(
    mismatches,
    [],
    "Native SVG fill agrees with the evidence masks",
  );
}

async function inspectStudies() {
  for (let index = 0; index < traceStudies.length; index++) {
    const study = traceStudies[index];
    const project = projects.find((p) => p.id === study.projectId);
    await visit("/projects#" + project.id);
    const detail = page.locator(`#${project.id}-details`);
    await expect(detail.locator(".trace-operation")).toHaveText(
      study.operation,
    );
    await painted();
    const layout = await detail.locator(".field-surface").evaluate((field) => {
      const bounds = field.getBoundingClientRect();
      const labels = [
        ...field.querySelectorAll(".trace-labels span, .trace-operation"),
      ].map((label) => label.getBoundingClientRect());
      return {
        contained: labels.every(
          (r) =>
            r.left >= bounds.left - 1 &&
            r.right <= bounds.right + 1 &&
            r.top >= bounds.top &&
            r.bottom <= bounds.bottom + 1,
        ),
        collision: labels.some((a, i) =>
          labels
            .slice(i + 1)
            .some(
              (b) =>
                Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
                Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2,
            ),
        ),
      };
    });
    assert(
      layout.contained && !layout.collision,
      project.title + ": legible, contained sketch labels",
    );
  }
}

try {
  await visit("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Hi, I'm Mahek Ara.",
  );
  await expect(
    page.locator(".featured-projects, .home-writing, .project-explorer"),
  ).toHaveCount(0);
  await expect(page.locator("main a[href^='/projects']")).toHaveCount(0);
  await expect(page.locator("a[href='/about']")).toHaveCount(0);
  const introduction = page.getByTestId("home-introduction");
  await expect(introduction.getByRole("link")).toHaveCount(0);
  await expect(introduction).not.toContainText(
    /RouterFlow|MCP Impact|Narrative Gap|open to work|DevRel|AI Engineer/i,
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const initialHTML = await (await context.request.get(baseURL)).text();
  assert.match(
    initialHTML,
    /<html[^>]*data-theme="dark"/,
    "Dark is present in server-rendered HTML before JavaScript",
  );
  await expect(introduction).toBeInViewport({ ratio: 1 });
  await expect(page.getByTestId("unseen-part")).toBeInViewport({
    ratio: 1,
  });
  const legacyAbout = await context.request.get(baseURL + "/about", {
    maxRedirects: 0,
  });
  assert.equal(
    legacyAbout.status(),
    308,
    "Old About URLs redirect permanently",
  );
  assert.equal(new URL(legacyAbout.headers().location, baseURL).pathname, "/");
  await page.goto(baseURL + "/about", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(baseURL + "/");
  await expect(introduction).toBeVisible();
  assert.equal(
    await page.locator("canvas").count(),
    0,
    "The homepage draws its custom letterforms with SVG",
  );
  await expect(page.getByTestId("unseen-part")).toHaveAttribute(
    "data-previewing",
    "false",
    { timeout: 6000 },
  );
  await expect(page.getByTestId("unseen-part")).toHaveAttribute(
    "data-position",
    "112",
  );
  await verifySvgGeometry();
  await capture({ path: ".qa/home-desktop.png", fullPage: true });
  console.log("Desktop screenshot saved");
  if (process.env.VISUAL_ONLY === "1") process.exitCode = 0;
  else {
    await assertLayout("Home desktop / dark");
    await inspectObservation();
    await page
      .getByRole("button", { name: "Toggle light and dark theme" })
      .first()
      .click();
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "light",
    );
    await capture({ path: ".qa/home-light.png", fullPage: true });
    await assertLayout("Home desktop / light");
    await inspectObservation();
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name: "Projects", exact: true })
      .click();
    await expect(page).toHaveURL(baseURL + "/projects");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await assertLayout("Projects desktop / light via client navigation");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await assertLayout("Projects desktop / dark after reload");
    await page
      .getByRole("button", { name: "Toggle light and dark theme" })
      .first()
      .click();
    await page
      .getByRole("button", { name: "Developer experience", exact: true })
      .click();
    await expect(page.locator(".project-study")).toHaveCount(3);
    await expect(page).toHaveURL(/focus=developer/);
    await page
      .getByRole("heading", { name: "Narrative Gap MCP", exact: true })
      .waitFor();
    await page
      .getByRole("button", { name: "Operations & decisions", exact: true })
      .click();
    await expect(page.locator(".project-study")).toHaveCount(3);
    await page.goBack();
    await expect(
      page.getByRole("button", { name: "Developer experience", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page
      .getByRole("button", { name: "All projects", exact: true })
      .click();
    await expect(page.locator(".project-study")).toHaveCount(projects.length);
    await page
      .locator("#context-relay")
      .getByRole("button", { name: "Show details" })
      .click();
    await expect(page.locator("#context-relay-details")).toBeVisible();
    await expect(
      page.locator("#context-relay-details .source-evidence a").first(),
    ).toHaveAttribute(
      "href",
      /blob\/[a-f\d]{40}\/src\/context_relay\/actions.py/,
    );
    await capture({ path: ".qa/projects-desktop.png", fullPage: true });
    await assertLayout("Projects desktop");
    await inspectStudies();
    for (const route of ["/blog", "/blog/llm-routing"]) {
      await visit(route);
      await assertLayout(route + " desktop / dark");
      assert.equal(
        await page.locator("canvas").count(),
        0,
        "No repeated decorative canvases",
      );
      await capture({
        path: `.qa/${route.split("/").filter(Boolean).join("-")}-desktop.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Toggle light and dark theme" })
        .first()
        .click();
      await assertLayout(route + " desktop / light");
      await capture({
        path: `.qa/${route.split("/").filter(Boolean).join("-")}-dark.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Toggle light and dark theme" })
        .first()
        .click();
    }
    await visit("/projects#mcp-impact");
    await expect(page.locator("#mcp-impact-details")).toBeVisible();
    await visit("/projects?focus=ai");
    await expect(page.locator(".project-study")).toHaveCount(6);
    await visit("/projects#build-buy-borrow");
    await expect(page.locator("#build-buy-borrow-details")).toBeVisible();
    await page.locator(".project-capture").scrollIntoViewIfNeeded();
    await page.waitForFunction(
      () => document.querySelector(".project-capture img")?.naturalWidth > 0,
    );
    await capture({
      path: ".qa/planning-evidence.png",
      fullPage: true,
    });
    await visit("/blog");
    await expect(page.locator(".repository-note")).toHaveCount(3);
    await expect(
      page.locator(".site-footer a[href^='mailto:']"),
    ).toHaveAttribute("href", links.email);
    await expect(
      page.locator(".site-footer a[aria-label='Mahek Ara on X']"),
    ).toHaveAttribute("href", links.x);
    for (const viewport of [
      { width: 1366, height: 768 },
      { width: 1280, height: 720 },
      { width: 1366, height: 650 },
      { width: 1024, height: 768 },
    ]) {
      await page.setViewportSize(viewport);
      await visit("/");
      await inspectObservation();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollHeight > innerHeight + 1,
        ),
        false,
        "Compact home fits laptop " + JSON.stringify(viewport),
      );
      await expect(page.locator(".home-footer")).toBeInViewport({ ratio: 1 });
    }
    await page.setViewportSize({ width: 393, height: 852 });
    for (const route of ["/", "/projects", "/blog", "/blog/llm-routing"]) {
      await visit(route);
      await expect(page.locator("a[href='/about']")).toHaveCount(0);
      if (route === "/") {
        await expect(introduction).toBeInViewport({ ratio: 1 });
        await expect(
          page.getByRole("slider", { name: "Observation band" }),
        ).toBeInViewport({ ratio: 1 });
        await expect(page.getByTestId("unseen-part")).toBeInViewport({
          ratio: 0.25,
        });
      }
      await assertLayout(route + " mobile / dark");
      await capture({
        path: `.qa/${route === "/" ? "home" : route.split("/").filter(Boolean).join("-")}-mobile.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Toggle light and dark theme" })
        .first()
        .click();
      await assertLayout(route + " mobile / light");
      await page
        .getByRole("button", { name: "Toggle light and dark theme" })
        .first()
        .click();
    }
    await visit("/");
    await inspectObservation();
    for (const width of [1024, 820, 760, 360, 320]) {
      await page.setViewportSize({ width, height: 852 });
      await inspectObservation();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        "Unseen Part responsive width " + width,
      );
    }
    await page.setViewportSize({ width: 393, height: 852 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("dialog", { name: "Navigation" }),
    ).toBeVisible();
    await capture({ path: ".qa/mobile-menu.png" });
    await assertLayout("Mobile menu");
    await page.setViewportSize({ width: 393, height: 600 });
    const bottomVisible = await page
      .locator(".mobile-menu-footer")
      .evaluate(
        (element) => element.getBoundingClientRect().bottom <= innerHeight,
      );
    assert.equal(
      bottomVisible,
      true,
      "Menu footer fits a short Android viewport",
    );
    await page
      .getByRole("button", { name: "Close navigation" })
      .press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await page.setViewportSize({ width: 320, height: 568 });
    await assertLayout("Small phone");
    await inspectObservation();
    await inspectStudies();
    await visit("/projects#context-relay");
    await expect(page.locator("#context-relay-details")).toBeVisible();
    await assertLayout("Small phone / expanded project");
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.locator(".mobile-menu-footer a[aria-label='Mahek Ara on X']"),
    ).toBeVisible();
    assert(
      await page
        .locator(".mobile-menu-footer")
        .evaluate(
          (element) => element.getBoundingClientRect().bottom <= innerHeight,
        ),
      "Small phone footer remains visible",
    );
    await page
      .getByRole("button", { name: "Close navigation" })
      .press("Escape");
    await visit("/");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await inspectObservation();
    await setView(350);
    assert.equal(
      await page
        .getByTestId("unseen-part")
        .evaluate((el) =>
          el
            .getAnimations({ subtree: true })
            .some((a) => a.playState === "running"),
        ),
      false,
      "Reduced-motion views update immediately",
    );
    await expect(page.getByTestId("unseen-part")).toHaveAttribute(
      "data-matches",
      "R",
    );
    await visit("/projects#mcp-impact");
    await painted();
    const still = await page
      .locator("canvas")
      .evaluate((canvas) => canvas.toDataURL());
    await page.waitForTimeout(800);
    assert.equal(
      await page.locator("canvas").evaluate((canvas) => canvas.toDataURL()),
      still,
      "Reduced-motion sketch is still",
    );
    assert.deepEqual(errors, [], "Browser runtime errors");
    assert.deepEqual(
      remoteRequests,
      [],
      "The visualization does not need external network access",
    );
    await writeFile(
      ".qa/report.json",
      JSON.stringify({ report, errors }, null, 2),
    );
    assert.equal(
      report.flatMap((entry) => entry.violations).length,
      0,
      "Accessibility violations: see .qa/report.json",
    );
    console.log(
      "All interaction, layout, accessibility and reduced-motion checks passed.",
    );
  }
} finally {
  await writeFile(
    ".qa/report.json",
    JSON.stringify({ report, errors }, null, 2),
  );
  await browser.close();
}
