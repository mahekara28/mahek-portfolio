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
  sketchCases,
  sketchStages,
  decideSketch,
  inspectStage,
} from "../app/lib/decision-sketch.ts";

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

async function inspectWorld() {
  const world = page.getByTestId("decision-world");
  await expect(world.locator("svg:visible")).toHaveCount(1);
  for (const example of sketchCases) {
    const decision = decideSketch(example);
    await page
      .getByRole("button", { name: example.label, exact: true })
      .click();
    await expect(page.locator("section[data-case]")).toHaveAttribute(
      "data-outcome",
      decision.outcome,
    );
    await expect(page.getByRole("status")).toHaveText(decision.result);
    await expect(
      world.locator("svg:visible [data-edge][data-active='true']"),
    ).toHaveCount(decision.edges.length);
    for (const stage of sketchStages) {
      await page
        .getByRole("button", { name: `Inspect ${stage.label}`, exact: true })
        .click();
      await expect(page.locator("#decision-insight h3")).toHaveText(
        inspectStage(stage.id, example).title,
      );
      await expect(page.locator("#decision-insight code")).toHaveText(
        inspectStage(stage.id, example).excerpt,
      );
    }
  }
  const layout = await world.evaluate((field) => {
    const bounds = field.getBoundingClientRect();
    const labels = [
      ...field.querySelectorAll("[data-stage], [data-endpoint]"),
    ].map((el) => ({ text: el.textContent, r: el.getBoundingClientRect() }));
    return {
      outside: labels
        .filter(
          ({ r }) =>
            r.left < bounds.left - 1 ||
            r.right > bounds.right + 1 ||
            r.top < bounds.top - 1 ||
            r.bottom > bounds.bottom + 1,
        )
        .map((x) => x.text),
      collisions: labels.flatMap(({ r: a, text }, i) =>
        labels
          .slice(i + 1)
          .filter(
            ({ r: b }) =>
              Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2 &&
              Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2,
          )
          .map((b) => [text, b.text]),
      ),
    };
  });
  assert.deepEqual(
    layout,
    { outside: [], collisions: [] },
    "Decision labels and hit targets remain distinct and contained",
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
  await expect(page.locator("main a[href='/projects']")).toBeVisible();
  await expect(page.locator("main a[href='/about']")).toBeVisible();
  await expect(
    page.getByRole("group", { name: "Change the context" }).getByRole("button"),
  ).toHaveCount(3);
  assert.equal(
    await page.locator("canvas").count(),
    0,
    "The homepage uses a local SVG world",
  );
  await capture({ path: ".qa/home-desktop.png", fullPage: true });
  console.log("Desktop screenshot saved");
  if (process.env.VISUAL_ONLY === "1") process.exitCode = 0;
  else {
    await assertLayout("Home desktop / light");
    await inspectWorld();
    await page
      .getByRole("button", { name: "Injected instruction", exact: true })
      .press("Home");
    await expect(
      page.getByRole("button", { name: "Useful context", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page
      .getByRole("button", { name: "Useful context", exact: true })
      .press("ArrowRight");
    await expect(page.getByRole("status")).toHaveText(
      "Ask for the error log first.",
    );
    await page
      .getByRole("button", { name: "Inspect Context", exact: true })
      .focus();
    await page
      .getByRole("button", { name: "Inspect Context", exact: true })
      .press("End");
    await expect(
      page.getByRole("button", { name: "Inspect Trust boundary", exact: true }),
    ).toBeFocused();
    await expect(
      page.getByRole("button", { name: "Inspect Trust boundary", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await page
      .getByRole("button", { name: "Follow the path again", exact: true })
      .click();
    await expect
      .poll(() =>
        page
          .getByTestId("decision-world")
          .evaluate((el) =>
            el
              .getAnimations({ subtree: true })
              .some((a) => a.playState === "running"),
          ),
      )
      .toBe(true);
    await expect
      .poll(
        () =>
          page
            .getByTestId("decision-world")
            .evaluate((el) =>
              el
                .getAnimations({ subtree: true })
                .some((a) => a.playState === "running"),
            ),
        { timeout: 5000 },
      )
      .toBe(false);
    await page
      .getByRole("button", { name: "Toggle light and dark theme" })
      .first()
      .click();
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === "dark",
    );
    await capture({ path: ".qa/home-dark.png", fullPage: true });
    await assertLayout("Home desktop / dark");
    await inspectWorld();
    await visit("/projects");
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
    await assertLayout("Projects desktop / dark");
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
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
    for (const route of ["/blog", "/blog/llm-routing", "/about"]) {
      await visit(route);
      await assertLayout(route + " desktop");
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
      await assertLayout(route + " desktop / dark");
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
    await page.setViewportSize({ width: 393, height: 852 });
    for (const route of [
      "/",
      "/projects",
      "/blog",
      "/blog/llm-routing",
      "/about",
    ]) {
      await visit(route);
      await assertLayout(route + " mobile");
      await capture({
        path: `.qa/${route === "/" ? "home" : route.split("/").filter(Boolean).join("-")}-mobile.png`,
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Toggle light and dark theme" })
        .first()
        .click();
      await assertLayout(route + " mobile / dark");
      await page
        .getByRole("button", { name: "Toggle light and dark theme" })
        .first()
        .click();
    }
    await visit("/");
    await inspectWorld();
    for (const width of [1024, 820, 760, 360, 320]) {
      await page.setViewportSize({ width, height: 852 });
      await inspectWorld();
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        false,
        "Decision world responsive width " + width,
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
    await inspectWorld();
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
    await page
      .getByRole("button", { name: "Missing context", exact: true })
      .click();
    await expect(page.getByRole("status")).toHaveText(
      "Ask for the error log first.",
    );
    await expect(
      page.getByRole("button", { name: "Follow the path again", exact: true }),
    ).not.toBeVisible();
    assert.equal(
      await page
        .getByTestId("decision-world")
        .evaluate((el) =>
          el
            .getAnimations({ subtree: true })
            .some((a) => a.playState === "running"),
        ),
      false,
      "Reduced-motion sketch stays still",
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
