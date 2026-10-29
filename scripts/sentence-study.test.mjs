import test from "node:test";
import assert from "node:assert/strict";
import { duration, prompt, sentenceAt, sequences, tokenDuration } from "../app/lib/sentence-study.ts";

test("changing the instruction changes the answer to the same question", () => {
  assert.equal(sentenceAt(0, 0).completion, sentenceAt(0, 1).completion);
  assert(sentenceAt(0, 0).contextText.startsWith(prompt));
  assert(sentenceAt(0, 1).contextText.startsWith(prompt));
  assert.equal(sentenceAt(duration(0), 0).completion, "One token at a time.");
  assert.equal(sentenceAt(duration(1), 1).completion, "Each new token helps shape the next.");
  assert.notDeepEqual(sentenceAt(0, 0).candidates, sentenceAt(0, 1).candidates);
});

test("each chosen token is appended once and becomes context for the next pass", () => {
  for (const context of [0, 1]) {
    let previous = "";
    const visited = new Set();
    for (let step = 0; step < sequences[context].length; step++) {
      const base = step * tokenDuration;
      const reading = sentenceAt(base + .01, context);
      const considering = sentenceAt(base + .4, context);
      const choosing = sentenceAt(base + .8, context);
      const feedback = sentenceAt(base + 1.2, context);
      assert.equal(reading.previous, previous);
      assert.equal(reading.completion, previous);
      assert.equal(considering.selected, null);
      assert.equal(choosing.completion, previous, "Selection precedes acceptance");
      const token = choosing.candidates[choosing.selected];
      visited.add(choosing.selected);
      assert.equal(feedback.completion, previous + token);
      assert.equal(feedback.count, step + 1);
      assert(feedback.contextText.endsWith(feedback.completion));
      previous = feedback.completion;
      if (step + 1 < sequences[context].length) {
        const next = sentenceAt(base + tokenDuration + .01, context);
        assert.equal(next.contextText, feedback.contextText, "The next pass retains the chosen token");
        assert.notDeepEqual(next.candidates, reading.candidates);
      }
    }
    assert.equal(visited.size, 3, "The selected path follows the current token, not one fixed lane");
    assert.equal(sentenceAt(duration(context) + 100, context).completion, previous);
    assert(sentenceAt(duration(context), context).complete);
  }
});

test("the complete still retains its answer, candidates and context", () => {
  for (const context of [0, 1]) {
    const still = sentenceAt(duration(context), context);
    assert(still.complete);
    assert.equal(still.count, sequences[context].length);
    assert.deepEqual(still, sentenceAt(duration(context) + 30, context));
    assert.equal(sentenceAt(0, context).completion, "", "A new pass starts with fresh context");
  }
  assert.equal(sentenceAt(-1, 0).phase, 0);
});
