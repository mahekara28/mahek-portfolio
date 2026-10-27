import test from "node:test";
import assert from "node:assert/strict";
import {
  decideSketch,
  inspectStage,
  sketchCases,
  sketchStages,
  sketchEdges,
  sketchPoints,
  sketchPath,
} from "../app/lib/decision-sketch.ts";

test("missing context cannot reach an explanation or evidence check", () => {
  for (const quotedDirective of [false, true]) {
    const result = decideSketch({ hasLog: false, quotedDirective });
    assert.equal(result.outcome, "ask");
    assert(result.edges.includes("route-ask"));
    assert(!result.edges.includes("check-answer"));
    assert(!result.edges.includes("route-check"));
    assert(!result.result.includes("httpx"));
  }
});

test("a quoted instruction cannot alter the supported explanation", () => {
  const clean = decideSketch({ hasLog: true, quotedDirective: false });
  const injected = decideSketch({ hasLog: true, quotedDirective: true });
  assert.equal(clean.result, injected.result);
  assert.equal(injected.boundary, "Treat as data");
  assert.deepEqual(
    injected.edges.filter((id) => id !== "context-boundary"),
    clean.edges,
  );
  assert(!injected.result.includes("Deploy"));
});

test("every illustrated outcome has a continuous request-to-outcome path", () => {
  for (const input of sketchCases) {
    const result = decideSketch(input);
    const reachable = new Set(["request"]);
    for (let step = 0; step < sketchEdges.length; step++) {
      for (const edge of sketchEdges)
        if (result.edges.includes(edge.id) && reachable.has(edge.from))
          reachable.add(edge.to);
    }
    assert(reachable.has(result.outcome === "ask" ? "ask" : "answer"));
    assert.equal(reachable.has("answer"), input.hasLog);
    assert.equal(reachable.has("boundary"), input.quotedDirective);
    assert.deepEqual(
      decideSketch(input),
      result,
      "Cases have deterministic results",
    );
  }
});

test("inspection explains unreached branches and the example's limits", () => {
  for (const input of sketchCases) {
    for (const stage of sketchStages) {
      const note = inspectStage(stage.id, input);
      assert(note.title && note.text && note.excerpt);
    }
  }
  assert.match(
    inspectStage("check", { hasLog: false, quotedDirective: false }).text,
    /not reached/,
  );
  assert.match(
    inspectStage("boundary", { hasLog: true, quotedDirective: true }).text,
    /predefined example, not an attack detector/,
  );
  assert.match(
    inspectStage("check", { hasLog: true, quotedDirective: false }).text,
    /doesn't prove/,
  );
});

test("mobile uses its own topology and all curve controls fit their viewBox", () => {
  assert.notDeepEqual(sketchPoints.desktop, sketchPoints.mobile);
  for (const mobile of [false, true]) {
    const width = mobile ? 360 : 1000,
      height = mobile ? 500 : 430;
    for (const edge of sketchEdges)
      for (let strand = -5; strand <= 5; strand++) {
        const values = sketchPath(edge, mobile, strand)
          .match(/-?\d+(?:\.\d+)?/g)
          .map(Number);
        for (let i = 0; i < values.length; i++)
          assert(values[i] >= 0 && values[i] <= (i % 2 ? height : width));
      }
  }
});
