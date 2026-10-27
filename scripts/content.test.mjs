import test from "node:test";
import assert from "node:assert/strict";
import { fetchSnapshot, parseRepository } from "./github-snapshot.mjs";
import {
  projects,
  featuredProjects,
  repositoryNotes,
  sourceUrl,
  focusAreas,
} from "../app/lib/content.ts";
import { traceStudies } from "../app/lib/trace-studies.ts";
import { workConnections, workTopics } from "../app/lib/work-connections.ts";

const now = new Date("2026-10-24T12:00:00.000Z");
const payload = projects.map(({ repo }) => ({
  name: repo,
  full_name: `mahekara28/${repo}`,
  owner: { login: "mahekara28" },
  private: false,
  fork: false,
  archived: false,
  language: "Python",
  default_branch: "main",
  pushed_at: "2026-10-23T10:00:00Z",
  ignored: "Do not publish arbitrary API fields",
}));
const response = (body, status = 200) =>
  new Response(JSON.stringify(body), { status });

test("project identity, focus and source relationships stay aligned", () => {
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  assert.equal(featuredProjects.length, 3);
  traceStudies.forEach((study) =>
    assert(projects.some((p) => p.id === study.projectId)),
  );
  for (const project of projects) {
    assert.match(project.revision, /^[a-f\d]{40}$/);
    assert(project.boundary && project.status && project.evidence.length);
    assert(
      project.focus.every((id) => focusAreas.some((focus) => focus.id === id)),
    );
    project.evidence.forEach(({ path }) =>
      assert(
        sourceUrl(project, path).startsWith(
          `${project.github}/blob/${project.revision}/`,
        ),
      ),
    );
  }
  assert(
    repositoryNotes.every((note) =>
      projects.some((p) => p.id === note.project),
    ),
  );
});

test("the selection stays varied and project summaries stay brief", () => {
  assert.deepEqual(
    featuredProjects.map((p) => p.id),
    ["llm-router", "mcp-impact", "narrative-gap-mcp"],
  );
  assert(featuredProjects.some((p) => p.focus.includes("developer")));
  assert(featuredProjects.some((p) => p.focus.includes("operations")));
  assert(projects.some((p) => p.id === "prompt-injection-lab"));
  assert(projects.some((p) => p.id === "context-relay"));
  assert(projects.every((p) => p.description.split(/\s+/).length <= 24));
  assert.equal(
    new Set(repositoryNotes.map((note) => note.project)).size,
    repositoryNotes.length,
  );
});

test("map connections resolve to reviewed source and real shared technologies", () => {
  assert.equal(workConnections.length, featuredProjects.length);
  for (const [index, connection] of workConnections.entries()) {
    const project = featuredProjects[index];
    assert.equal(project.id, connection.projectId);
    assert(
      project.evidence.some((item) => item.path === connection.sourcePath),
    );
    assert(
      connection.topics.every((id) =>
        workTopics.some((topic) => topic.id === id),
      ),
    );
    if (connection.topics.includes("python"))
      assert(
        project.stack.includes("Python") || project.stack.includes("FastAPI"),
      );
    if (connection.topics.includes("github"))
      assert(project.stack.includes("GitHub API"));
    if (connection.topics.includes("local-models"))
      assert(project.stack.includes("Ollama"));
    if (connection.topics.includes("contracts"))
      assert(project.stack.includes("MCP contracts"));
  }
  assert.equal(
    workConnections.filter((p) => p.topics.includes("python")).length,
    2,
  );
  assert.equal(
    workConnections.filter((p) => p.topics.includes("github")).length,
    2,
  );
});

test("official GitHub metadata is allowlisted and stripped to public display fields", async () => {
  const result = await fetchSnapshot({
    now,
    token: "test-secret",
    fetchImpl: async (url, options) => {
      assert.equal(new URL(url).origin, "https://api.github.com");
      assert.equal(options.headers.Authorization, "Bearer test-secret");
      assert.equal(options.redirect, "error");
      assert(options.signal instanceof AbortSignal);
      return response(payload);
    },
  });
  assert.equal(Object.keys(result.repositories).length, projects.length);
  assert.equal(result.fetchedAt, now.toISOString());
  assert(!JSON.stringify(result).includes("test-secret"));
  assert(!JSON.stringify(result).includes("ignored"));
});

test("recent snapshot avoids a network call; forcing refresh does not", async () => {
  const previous = await fetchSnapshot({
    now,
    fetchImpl: async () => response(payload),
  });
  const cached = await fetchSnapshot({
    previous,
    now,
    fetchImpl: async () => {
      throw Error("Must not fetch");
    },
  });
  assert.equal(cached, previous);
  let fetched = false;
  await fetchSnapshot({
    previous,
    now,
    force: true,
    fetchImpl: async () => {
      fetched = true;
      return response(payload);
    },
  });
  assert(fetched);
});

for (const status of [401, 403, 404, 429, 500]) {
  test(`HTTP ${status} cannot replace the last good snapshot`, async () => {
    const previous = await fetchSnapshot({
      now,
      fetchImpl: async () => response(payload),
    });
    const before = structuredClone(previous);
    await assert.rejects(
      fetchSnapshot({
        previous,
        now,
        force: true,
        fetchImpl: async () => response({}, status),
      }),
      /GitHub returned HTTP/,
    );
    assert.deepEqual(previous, before);
  });
}

test("missing repos, malformed bodies and network errors fail closed", async () => {
  await assert.rejects(
    fetchSnapshot({ now, fetchImpl: async () => response(payload.slice(1)) }),
    /missing or private/,
  );
  await assert.rejects(
    fetchSnapshot({ now, fetchImpl: async () => response({}) }),
    /Invalid GitHub/,
  );
  await assert.rejects(
    fetchSnapshot({ now, fetchImpl: async () => new Response("not json") }),
  );
  await assert.rejects(
    fetchSnapshot({
      now,
      fetchImpl: async () => {
        throw new DOMException("Timed out", "TimeoutError");
      },
    }),
    /Timed out/,
  );
});

test("private, forked, wrong-owner or malformed repo data is rejected", () => {
  for (const change of [
    { private: true },
    { fork: true },
    { owner: { login: "someone-else" } },
    { pushed_at: "yesterday" },
    { default_branch: null },
  ]) {
    assert.throws(() =>
      parseRepository({ ...payload[0], ...change }, payload[0].name),
    );
  }
});

test("stale snapshots refresh and inventory pagination is bounded", async () => {
  let calls = 0;
  const result = await fetchSnapshot({
    now,
    previous: { fetchedAt: "2020-01-01" },
    fetchImpl: async () =>
      response(
        ++calls === 1
          ? Array.from({ length: 100 }, (_, i) => ({ name: `other-${i}` }))
          : payload,
      ),
  });
  assert.equal(calls, 2);
  assert.equal(Object.keys(result.repositories).length, projects.length);
});
