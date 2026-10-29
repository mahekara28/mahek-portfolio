import test from "node:test";
import assert from "node:assert/strict";
import {
  assessConsumers,
  baseline,
  consumers,
  contractWithRequirement,
  newRequirements,
  impactSource,
} from "../app/lib/smallest-change.ts";

test("the interaction changes only the one declared requirement, without mutating the baseline", () => {
  const before = JSON.stringify(baseline);
  const after = contractWithRequirement(true);
  assert.deepEqual(newRequirements(baseline, after), [
    { tool: "search_accounts", field: "lifecycle_stage" },
  ]);
  after.tools[0].params[2].required = false;
  assert.deepEqual(after, baseline);
  assert.equal(JSON.stringify(baseline), before);
  assert.deepEqual(contractWithRequirement(false), baseline);
});

test("exact references yield three potential impacts and preserve the unrelated eval", () => {
  const results = assessConsumers(
    baseline,
    contractWithRequirement(true),
    consumers,
  );
  assert.deepEqual(
    results.map(({ id, status }) => [id, status]),
    [
      ["prompt-01", "review"],
      ["workflow-02", "review"],
      ["eval-03", "unflagged"],
      ["workflow-04", "review"],
    ],
  );
  assert.deepEqual(results[2].reasons, []);
  for (const entry of results.filter((item) => item.status === "review")) {
    assert.deepEqual(entry.reasons, [
      { tool: "search_accounts", field: "lifecycle_stage" },
    ]);
  }
});

test("impact follows reference data, not a hardcoded consumer identity", () => {
  const inventory = consumers.map((item) => ({
    ...item,
    toolRefs: item.id === "eval-03" ? ["search_accounts"] : [],
  }));
  const results = assessConsumers(
    baseline,
    contractWithRequirement(true),
    inventory,
  );
  assert.deepEqual(
    results.filter((item) => item.status === "review").map((item) => item.id),
    ["eval-03"],
  );
  const almost = [{ ...consumers[0], toolRefs: ["search_accounts_archive"] }];
  assert.equal(
    assessConsumers(baseline, contractWithRequirement(true), almost)[0].status,
    "unflagged",
  );
});

test("reverting clears the impact without implying successful execution", () => {
  for (const required of [true, false, true, false]) {
    const results = assessConsumers(
      baseline,
      contractWithRequirement(required),
      consumers,
    );
    assert.equal(
      results.filter((item) => item.status === "review").length,
      required ? 3 : 0,
    );
    for (const entry of results) {
      assert.equal(entry.confirmedFailure, null);
      assert.equal(entry.execution, "not-run");
    }
  }
});

test("a different tool's required field affects only its actual references", () => {
  const after = contractWithRequirement(false);
  after.tools[2].params[1].required = true;
  const results = assessConsumers(baseline, after, consumers);
  assert.deepEqual(
    results
      .filter((entry) => entry.status === "review")
      .map((entry) => entry.id),
    ["prompt-01", "eval-03"],
  );
  assert.deepEqual(results[2].reasons, [
    { tool: "create_success_brief", field: "tone" },
  ]);
});

test("the narrow comparison does not pretend to handle removed or newly added tools", () => {
  assert.deepEqual(newRequirements(baseline, { tools: [] }), []);
  assert.deepEqual(newRequirements({ tools: [] }, baseline), []);
  assert.deepEqual(assessConsumers(baseline, baseline, []), []);
  assert.match(impactSource.revision, /^[a-f\d]{40}$/);
  assert(impactSource.url.includes(`/blob/${impactSource.revision}/script.js`));
});
