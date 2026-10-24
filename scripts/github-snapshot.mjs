import { readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import dns from "node:dns";
import { projects } from "../app/lib/content.ts";

const owner = "mahekara28";
const names = projects.map((project) => project.repo);
const maxAge = 6 * 60 * 60 * 1000;

export function parseRepository(value, expected) {
  if (
    !value ||
    value.name !== expected ||
    value.full_name !== `${owner}/${expected}` ||
    value.owner?.login !== owner ||
    value.private !== false ||
    value.fork !== false ||
    typeof value.archived !== "boolean" ||
    typeof value.default_branch !== "string" ||
    !value.default_branch ||
    !/^\d{4}-\d{2}-\d{2}T/.test(value.pushed_at) ||
    !Number.isFinite(Date.parse(value.pushed_at)) ||
    !(value.language === null || typeof value.language === "string")
  )
    throw new Error(`Invalid public repository metadata for ${expected}`);
  return {
    repo: expected,
    pushedAt: value.pushed_at,
    language: value.language,
    archived: value.archived,
    branch: value.default_branch,
  };
}

function validSnapshot(value) {
  return (
    value?.version === 1 &&
    Number.isFinite(Date.parse(value.fetchedAt)) &&
    names.every((name) => {
      const repo = value.repositories?.[name];
      return (
        repo?.repo === name &&
        Number.isFinite(Date.parse(repo.pushedAt)) &&
        typeof repo.archived === "boolean" &&
        typeof repo.branch === "string"
      );
    })
  );
}

export async function fetchSnapshot({
  fetchImpl = fetch,
  previous,
  now = new Date(),
  token,
  force = false,
} = {}) {
  const age = now.getTime() - Date.parse(previous?.fetchedAt);
  if (!force && validSnapshot(previous) && age >= 0 && age < maxAge)
    return previous;
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Mahek-Portfolio-Content",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const repositories = {};
  // A bounded inventory request; no user-controlled URLs or browser credentials.
  for (let page = 1; page <= 3; page++) {
    const response = await fetchImpl(
      `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&type=owner`,
      { headers, signal: AbortSignal.timeout(15000), redirect: "error" },
    );
    if (!response.ok)
      throw new Error(
        `GitHub returned HTTP ${response.status}. Snapshot retained.`,
      );
    const values = await response.json();
    if (!Array.isArray(values))
      throw new Error("Invalid GitHub inventory. Snapshot retained.");
    for (const name of names) {
      const value = values.find((repo) => repo?.name === name);
      if (value) repositories[name] = parseRepository(value, name);
    }
    if (names.every((name) => repositories[name]) || values.length < 100) break;
  }
  if (!names.every((name) => repositories[name])) {
    throw new Error(
      "A curated repository is missing or private. Review it before refreshing.",
    );
  }
  return { version: 1, fetchedAt: now.toISOString(), repositories };
}

async function main() {
  dns.setDefaultResultOrder("ipv4first");
  const target = new URL("../app/lib/github-snapshot.json", import.meta.url);
  const previous = await readFile(target, "utf8")
    .then(JSON.parse)
    .catch(() => undefined);
  const snapshot = await fetchSnapshot({
    previous,
    token: process.env.GITHUB_TOKEN,
    force: process.argv.includes("--force"),
  });
  if (snapshot === previous) {
    console.log(
      "Using the GitHub snapshot from the last six hours. Pass --force to refresh.",
    );
    return;
  }
  const temporary = new URL(
    "../app/lib/github-snapshot.json.tmp",
    import.meta.url,
  );
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + "\n");
  await rename(temporary, target);
  console.log(
    `Refreshed ${names.length} public repositories. Descriptions and source reviews are unchanged.`,
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(
      error instanceof Error
        ? error.message
        : "GitHub refresh failed. Snapshot retained.",
    );
    process.exitCode = 1;
  });
}
