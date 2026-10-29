import test from "node:test";
import assert from "node:assert/strict";
import { evidenceAt, inspectArtifact, samples } from "../app/lib/evidence-study.ts";

test("a reply and a tool receipt never count as verification", () => {
  for (const sample of Object.keys(samples)) {
    assert.equal(evidenceAt(0, sample).state, "unverified");
    assert.equal(evidenceAt(1, sample).state, "reported");
  }
});
test("the final verdict follows the returned bytes", () => {
  assert.equal(evidenceAt(2, "wrong-format").state, "mismatch");
  assert.match(evidenceAt(2, "wrong-format").detail, /JSON/);
  assert.equal(evidenceAt(2, "missing-column").state, "mismatch");
  assert.match(evidenceAt(2, "missing-column").detail, /email/);
  assert.equal(evidenceAt(2, "matching").state, "checked");
});
test("JSON with all required keys still fails the CSV request", () => {
  assert.equal(inspectArtifact(samples["wrong-format"].contents).passed, false);
});
test("a header alone or malformed row cannot pass", () => {
  for (const content of ["", "name,email", "name,email\nAlex", "name,email\nAlex,test,extra"]) {
    assert.equal(inspectArtifact(content).passed, false, content);
  }
});
test("the scoped check accepts matching simple CSV with either column order and CRLF", () => {
  assert.equal(inspectArtifact("email,name\r\nalex@example.test,Alex\r\n").passed, true);
  assert.equal(inspectArtifact(samples.matching.contents).passed, true);
});
