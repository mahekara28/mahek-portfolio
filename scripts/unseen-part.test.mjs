import test from "node:test";
import assert from "node:assert/strict";
import {
  band,
  cellSize,
  field,
  glyphIds,
  glyphPath,
  observe,
  rasterize,
  clampPosition,
} from "../app/lib/unseen-part.ts";

test("three distinct complete forms share the initial observation", () => {
  assert.equal(new Set(glyphIds.map(glyphPath)).size, 3);
  assert.equal(
    new Set(glyphIds.map((id) => Buffer.from(rasterize(id)).toString("base64")))
      .size,
    3,
  );
  assert.deepEqual(observe(band.initial).matches, ["B", "P", "R"]);
  assert(
    observe(band.initial).evidence.every(
      (item) => item.extra === 0 && item.missing === 0,
    ),
  );
});

test("moving the view rules out B, then P; returning restores ambiguity", () => {
  const original = observe(112);
  assert.deepEqual(observe(244).matches, ["P", "R"]);
  assert.deepEqual(observe(350).matches, ["R"]);
  assert.deepEqual(observe(112), original);
  assert.equal(
    observe(244).evidence[0].reason,
    "Adds ink where the view is empty.",
  );
  assert.equal(
    observe(350).evidence[1].reason,
    "Misses ink that's visible here.",
  );
});

test("the answer comes from the observed shape, not an R-specific animation script", () => {
  assert.deepEqual(observe(350, "B").matches, ["B"]);
  assert.deepEqual(observe(350, "P").matches, ["P"]);
  for (const truth of glyphIds) {
    for (let position = band.min; position <= band.max; position += 7) {
      assert(observe(position, truth).matches.includes(truth));
    }
  }
});

test("prefix-sum evidence equals direct comparison of visible mask cells", () => {
  const width = field.width / cellSize;
  const masks = Object.fromEntries(glyphIds.map((id) => [id, rasterize(id)]));
  for (const truth of glyphIds) {
    for (const y of [64, 112, 199, 213, 244, 258, 282, 350, 400]) {
      const view = observe(y, truth);
      for (const candidate of view.evidence) {
        let extra = 0,
          missing = 0;
        for (let row = 0; row < field.height / cellSize; row++) {
          const center = row * cellSize + cellSize / 2;
          if (center < view.top || center >= view.bottom) continue;
          for (let x = 0; x < width; x++) {
            const i = row * width + x;
            if (masks[candidate.id][i] && !masks[truth][i]) extra++;
            if (!masks[candidate.id][i] && masks[truth][i]) missing++;
          }
        }
        assert.deepEqual(
          [candidate.extra, candidate.missing],
          [extra, missing],
        );
        assert.equal(candidate.matches, extra + missing === 0);
      }
    }
  }
});

test("out-of-range views stay bounded and queries do not alter the geometry", () => {
  assert.equal(clampPosition(-Infinity), band.initial);
  assert.equal(clampPosition(NaN), band.initial);
  assert.equal(clampPosition(-400), band.min);
  assert.equal(clampPosition(999), band.max);
  const snapshot = glyphIds.map(glyphPath);
  for (let y = -10; y < 500; y++) {
    const result = observe(y);
    assert(result.matches.length >= 1 && result.matches.length <= 3);
    assert(result.top >= 0 && result.bottom <= field.height);
  }
  assert.deepEqual(glyphIds.map(glyphPath), snapshot);
});
