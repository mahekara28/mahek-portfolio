/** A local illustration: fixed questions, real fixture lookups/counts, no model calls. */
export const examples = [
  {
    id: "setup",
    label: "Run a project",
    question: "How do I run this locally?",
    feedback: "I'm on Windows.",
  },
  {
    id: "patterns",
    label: "Find a pattern",
    question: "Where are new users getting stuck?",
    feedback: "Just the Windows reports.",
  },
] as const;
export type ExampleId = (typeof examples)[number]["id"];
export const stages = [
  { id: "input", label: "Input", hint: "Ask a question" },
  { id: "context", label: "Context", hint: "Bring the details" },
  { id: "route", label: "Route", hint: "Choose the right tool" },
  { id: "action", label: "Action", hint: "Make it useful" },
  { id: "feedback", label: "Feedback", hint: "Learn what was missing" },
] as const;
export type StageId = (typeof stages)[number]["id"];
export type ToolId = "lookup" | "count";
export const sampleDocs = {
  unix: ["python -m venv .venv", "source .venv/bin/activate", "python app.py"],
  windows: [
    "python -m venv .venv",
    ".venv\\Scripts\\Activate.ps1",
    "python app.py",
  ],
} as const;
export const sampleIssues = [
  { title: "Install path not found", topic: "Setup", platform: "windows" },
  {
    title: "Virtual environment activation",
    topic: "Setup",
    platform: "windows",
  },
  { title: "Python version mismatch", topic: "Setup", platform: "macos" },
  {
    title: "Where does the API key go?",
    topic: "Authentication",
    platform: "windows",
  },
  { title: "Token expired", topic: "Authentication", platform: "linux" },
  {
    title: "Where is the config file?",
    topic: "Configuration",
    platform: "linux",
  },
] as const;

export function countTopics(issues: readonly { topic: string }[]) {
  const counts = new Map<string, number>();
  for (const issue of issues)
    counts.set(issue.topic, (counts.get(issue.topic) ?? 0) + 1);
  return [...counts]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}
export function runExample(id: ExampleId, revised = false) {
  const example = examples.find((item) => item.id === id)!;
  if (id === "setup") {
    const platform = revised ? "windows" : "unix";
    return {
      ...example,
      tool: "lookup" as ToolId,
      sources: [
        "Sample setup guide",
        revised ? "Windows / PowerShell" : "macOS / Linux",
      ],
      result: revised
        ? "Use the Windows activation command."
        : "Three steps from the setup guide.",
      detail: [...sampleDocs[platform]].join("\n"),
      toolLabel: "Read docs",
    };
  }
  const reports = revised
    ? sampleIssues.filter((issue) => issue.platform === "windows")
    : sampleIssues;
  const counts = countTopics(reports);
  return {
    ...example,
    tool: "count" as ToolId,
    sources: [
      "6 sample issues",
      revised ? "Windows reports only" : "All platforms",
    ],
    result: `Setup appears in ${counts[0].count} of ${reports.length} ${revised ? "Windows reports" : "sample reports"}.`,
    detail: counts.map(({ topic, count }) => `${topic} · ${count}`).join("\n"),
    toolLabel: "Count issues",
  };
}

export function describeStage(step: number, id: ExampleId, revised: boolean) {
  const example = runExample(id, revised);
  const notes = [
    {
      title: "Run it, or explore a point on the thread.",
      text: "An idea becomes a task the system can actually work on.",
      excerpt: example.question,
    },
    {
      title: revised
        ? "One new detail changes the context."
        : "Give the question something to work with.",
      text:
        id === "setup"
          ? "The sample guide supplies the commands; the platform tells us which version applies."
          : "The sample reports give us something to count. A filter changes which reports belong in the answer.",
      excerpt: example.sources.join(" + "),
    },
    {
      title: "Choose what the task needs.",
      text:
        id === "setup"
          ? "Exact instructions already exist. Route to a docs lookup instead of asking a model to guess them."
          : "Counting belongs in code. A model could help explain the pattern, but it shouldn't invent the numbers.",
      excerpt:
        id === "setup" ? "question → docs lookup" : "question → filter + count",
    },
    {
      title: "Turn the information into a useful result.",
      text:
        id === "setup"
          ? "These commands are read from a tiny local fixture. Nothing is installed or run on your machine."
          : "These totals are calculated here in the browser. They're sample reports, not metrics from my projects.",
      excerpt: example.result,
    },
    {
      title: revised
        ? "Better context. A more specific answer."
        : "The first answer isn't the end.",
      text: revised
        ? "Your feedback changed the inputs and the result. That's a second pass with new context, not a model retraining itself."
        : "Add one detail and follow it back into the system. The question stays the same; the next answer changes.",
      excerpt: revised
        ? "feedback → new context → revised result"
        : example.feedback,
    },
  ];
  return notes[Math.max(0, Math.min(4, step))];
}

export type StoryState = {
  exampleId: ExampleId;
  step: number;
  revised: boolean;
  status: "idle" | "playing" | "paused" | "complete";
  pass: number;
};
export const initialStory: StoryState = {
  exampleId: "patterns",
  step: 0,
  revised: false,
  status: "idle",
  pass: 0,
};
export type StoryEvent =
  | { type: "example"; id: ExampleId; autoplay?: boolean }
  | { type: "play" }
  | { type: "pause" }
  | { type: "tick" }
  | { type: "next" }
  | { type: "inspect"; step: number }
  | { type: "feedback"; reduced: boolean }
  | { type: "restart"; reduced: boolean };
export function storyReducer(state: StoryState, event: StoryEvent): StoryState {
  switch (event.type) {
    case "example":
      return {
        ...initialStory,
        exampleId: event.id,
        pass: state.pass + 1,
        status: event.autoplay ? "playing" : "idle",
      };
    case "play":
      if (state.status === "playing") return { ...state, status: "paused" };
      return {
        ...state,
        step: state.step === 4 ? 0 : state.step,
        status: "playing",
        pass: state.pass + 1,
      };
    case "pause":
      return state.status === "playing"
        ? { ...state, status: "paused" }
        : state;
    case "tick":
      if (state.status !== "playing") return state;
      return {
        ...state,
        step: Math.min(4, state.step + 1),
        status: state.step >= 3 ? "complete" : "playing",
      };
    case "next":
      return {
        ...state,
        step: Math.min(4, state.step + 1),
        status: state.step >= 3 ? "complete" : "paused",
      };
    case "inspect":
      return {
        ...state,
        step: Math.max(0, Math.min(4, event.step)),
        status: event.step >= 4 ? "complete" : "paused",
      };
    case "feedback":
      if (state.step !== 4 || state.revised) return state;
      return {
        ...state,
        step: 1,
        revised: true,
        status: event.reduced ? "paused" : "playing",
        pass: state.pass + 1,
      };
    case "restart":
      return {
        ...state,
        step: 0,
        status: event.reduced ? "paused" : "playing",
        pass: state.pass + 1,
      };
  }
}

export type PointId = StageId | ToolId | "sourceOne" | "sourceTwo";
export const points: Record<
  "desktop" | "mobile",
  Record<PointId, { x: number; y: number }>
> = {
  desktop: {
    input: { x: 9, y: 44 },
    context: { x: 28, y: 36 },
    route: { x: 48, y: 44 },
    action: { x: 86, y: 44 },
    feedback: { x: 54, y: 91 },
    lookup: { x: 67, y: 20 },
    count: { x: 67, y: 65 },
    sourceOne: { x: 20, y: 9 },
    sourceTwo: { x: 17, y: 67 },
  },
  mobile: {
    input: { x: 20, y: 15 },
    context: { x: 66, y: 31 },
    route: { x: 25, y: 52 },
    action: { x: 76, y: 77 },
    feedback: { x: 31, y: 92 },
    lookup: { x: 76, y: 51 },
    count: { x: 35, y: 73 },
    sourceOne: { x: 26, y: 33 },
    sourceTwo: { x: 78, y: 10 },
  },
};
export type EdgeId =
  | "gather"
  | "think"
  | ToolId
  | "reflect"
  | "return"
  | "sourceOne"
  | "sourceTwo";
export const edges: {
  id: EdgeId;
  from: PointId;
  to: PointId;
  controls: { desktop: number[]; mobile: number[] };
}[] = [
  {
    id: "gather",
    from: "input",
    to: "context",
    controls: { desktop: [15, 44, 19, 36], mobile: [20, 24, 48, 21] },
  },
  {
    id: "think",
    from: "context",
    to: "route",
    controls: { desktop: [36, 36, 39, 44], mobile: [66, 42, 25, 40] },
  },
  {
    id: "lookup",
    from: "route",
    to: "action",
    controls: { desktop: [60, 8, 74, 8], mobile: [74, 42, 91, 60] },
  },
  {
    id: "count",
    from: "route",
    to: "action",
    controls: { desktop: [59, 79, 75, 79], mobile: [12, 72, 43, 83] },
  },
  {
    id: "reflect",
    from: "action",
    to: "feedback",
    controls: { desktop: [94, 73, 76, 90], mobile: [82, 92, 52, 95] },
  },
  {
    id: "return",
    from: "feedback",
    to: "context",
    controls: { desktop: [7, 92, 5, 55], mobile: [6, 91, 6, 35] },
  },
  {
    id: "sourceOne",
    from: "sourceOne",
    to: "context",
    controls: { desktop: [24, 12, 24, 30], mobile: [35, 30, 45, 31] },
  },
  {
    id: "sourceTwo",
    from: "sourceTwo",
    to: "context",
    controls: { desktop: [20, 65, 26, 51], mobile: [80, 23, 73, 24] },
  },
];
export function edgeState(edge: EdgeId, state: StoryState) {
  const tool = runExample(state.exampleId, state.revised).tool;
  if (edge === "sourceOne" || edge === "sourceTwo" || edge === "gather")
    return state.step >= 1;
  if (edge === "think") return state.step >= 2;
  if (edge === "lookup" || edge === "count")
    return edge === tool && state.step >= 3;
  if (edge === "reflect") return state.step >= 4;
  return state.revised;
}
export function currentEdge(state: StoryState): EdgeId | undefined {
  return state.step === 1
    ? state.revised
      ? "return"
      : "gather"
    : state.step === 2
      ? "think"
      : state.step === 3
        ? runExample(state.exampleId).tool
        : state.step === 4
          ? "reflect"
          : undefined;
}
export function storyPath(id: EdgeId, mobile = false, strand = 0) {
  const mode = mobile ? "mobile" : "desktop",
    width = mobile ? 360 : 1000,
    height = mobile ? 550 : 400;
  const edge = edges.find((item) => item.id === id)!;
  const a = points[mode][edge.from],
    b = points[mode][edge.to],
    c = edge.controls[mode];
  const spread = strand * (mobile ? 0.65 : 0.9);
  return `M ${(a.x * width) / 100} ${(a.y * height) / 100} C ${((c[0] + (mobile ? spread : 0)) * width) / 100} ${((c[1] + (mobile ? 0 : spread)) * height) / 100}, ${((c[2] + (mobile ? spread : 0)) * width) / 100} ${((c[3] + (mobile ? 0 : spread)) * height) / 100}, ${(b.x * width) / 100} ${(b.y * height) / 100}`;
}
