// Curated from the pinned source files in content.ts. These are shared tools
// and concerns, not claims that the repositories depend on one another.
export const workTopics = [
  { id: "python", label: "Python", x: 8, y: 48 },
  { id: "local-models", label: "Local models", x: 76, y: 7 },
  { id: "contracts", label: "Contracts", x: 88, y: 36 },
  { id: "github", label: "GitHub API", x: 83, y: 81 },
  { id: "feedback", label: "Developer feedback", x: 48, y: 91 },
] as const;

export type TopicId = (typeof workTopics)[number]["id"];

export const workConnections: {
  projectId: string;
  x: number;
  y: number;
  topics: TopicId[];
  note: string;
  sourceLabel: string;
  sourcePath: string;
}[] = [
  {
    projectId: "llm-router",
    x: 28,
    y: 21,
    topics: ["python", "local-models"],
    note: "Python routing rules choose which local Ollama model answers.",
    sourceLabel: "Read the routing rules",
    sourcePath: "router.py",
  },
  {
    projectId: "mcp-impact",
    x: 53,
    y: 51,
    topics: ["contracts", "github"],
    note: "GitHub diffs feed a scan for changed contracts and their references.",
    sourceLabel: "Read the contract scan",
    sourcePath: "server.js",
  },
  {
    projectId: "narrative-gap-mcp",
    x: 23,
    y: 77,
    topics: ["python", "github", "feedback"],
    note: "Python gathers GitHub issues and pull requests for a closer look at developer feedback.",
    sourceLabel: "Read the GitHub ingestion",
    sourcePath: "backend/app/ingestion/github.py",
  },
];

export function connectionPath(
  project: (typeof workConnections)[number],
  topic: (typeof workTopics)[number],
) {
  const x1 = project.x * 6,
    y1 = project.y * 3.4;
  const x2 = topic.x * 6,
    y2 = topic.y * 3.4;
  const bend = (x2 - x1) * 0.45;
  return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
}
