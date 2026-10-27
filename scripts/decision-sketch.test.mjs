import test from "node:test";
import assert from "node:assert/strict";
import {
  examples,
  stages,
  sampleDocs,
  sampleIssues,
  countTopics,
  runExample,
  describeStage,
  initialStory,
  storyReducer,
  edges,
  edgeState,
  points,
  storyPath,
} from "../app/lib/decision-sketch.ts";

test("a platform correction changes the actual lookup without changing the question", () => {
  const first = runExample("setup");
  const second = runExample("setup", true);
  assert.equal(first.question, second.question);
  assert.equal(first.tool, "lookup");
  assert.equal(second.tool, "lookup");
  assert.equal(first.detail, sampleDocs.unix.join("\n"));
  assert.equal(second.detail, sampleDocs.windows.join("\n"));
  assert(!second.detail.includes("source "));
  assert(second.detail.includes("Activate.ps1"));
});
test("counts are computed from sample reports and the feedback filter", () => {
  assert.deepEqual(countTopics([]), []);
  assert.deepEqual(
    countTopics([{ topic: "B" }, { topic: "A" }, { topic: "B" }]),
    [
      { topic: "B", count: 2 },
      { topic: "A", count: 1 },
    ],
  );
  const snapshot = JSON.stringify(sampleIssues);
  assert.equal(
    runExample("patterns").result,
    "Setup appears in 3 of 6 sample reports.",
  );
  assert.equal(
    runExample("patterns", true).result,
    "Setup appears in 2 of 3 Windows reports.",
  );
  assert(!runExample("patterns", true).detail.includes("Configuration"));
  assert.equal(
    JSON.stringify(sampleIssues),
    snapshot,
    "Filters do not mutate the fixture",
  );
});
test("a task takes exactly one tool route, and feedback connects back to context", () => {
  for (const example of examples) {
    const state = {
      ...initialStory,
      exampleId: example.id,
      step: 4,
      status: "complete",
    };
    const active = edges.filter((e) => edgeState(e.id, state));
    const tools = active.filter((e) => e.id === "lookup" || e.id === "count");
    assert.equal(tools.length, 1);
    assert.equal(tools[0].id, runExample(example.id).tool);
    assert(!edgeState("return", state));
    const revised = storyReducer(state, { type: "feedback", reduced: true });
    assert(edgeState("return", revised));
    assert.equal(edges.find((e) => e.id === "return").to, "context");
    for (let i = 0; i < stages.length; i++) {
      const description = describeStage(i, example.id, true);
      assert(description.title && description.text && description.excerpt);
    }
  }
});
test("playback is bounded, pausable, and ignores stale timer ticks", () => {
  let state = storyReducer(initialStory, { type: "play" });
  state = storyReducer(state, { type: "tick" });
  assert.equal(state.step, 1);
  const paused = storyReducer(state, { type: "pause" });
  assert.deepEqual(storyReducer(paused, { type: "tick" }), paused);
  state = storyReducer(paused, { type: "play" });
  for (let i = 0; i < 10; i++) state = storyReducer(state, { type: "tick" });
  assert.equal(state.step, 4);
  assert.equal(state.status, "complete");
  assert.equal(storyReducer(state, { type: "play" }).step, 0);
});
test("feedback requires a finished first pass and switching examples clears it", () => {
  assert.deepEqual(
    storyReducer(initialStory, { type: "feedback", reduced: false }),
    initialStory,
  );
  const end = { ...initialStory, step: 4, status: "complete" };
  for (const reduced of [true, false]) {
    const revised = storyReducer(end, { type: "feedback", reduced });
    assert.equal(revised.step, 1);
    assert.equal(revised.revised, true);
    assert.equal(revised.status, reduced ? "paused" : "playing");
    assert.deepEqual(
      storyReducer(revised, { type: "feedback", reduced }),
      revised,
    );
    const changed = storyReducer(revised, { type: "example", id: "patterns" });
    assert.equal(changed.step, 0);
    assert.equal(changed.revised, false);
    assert.equal(changed.status, "idle");
  }
});
test("mobile is recomposed and ribbon controls stay inside the drawing surface", () => {
  assert.notDeepEqual(points.desktop, points.mobile);
  for (const mobile of [false, true]) {
    const width = mobile ? 360 : 1000,
      height = mobile ? 550 : 400;
    for (const edge of edges)
      for (let strand = -5; strand <= 5; strand++) {
        const values = storyPath(edge.id, mobile, strand)
          .match(/-?\d+(?:\.\d+)?/g)
          .map(Number);
        values.forEach((v, i) =>
          assert(v >= 0 && v <= (i % 2 ? height : width), edge.id),
        );
      }
  }
});
