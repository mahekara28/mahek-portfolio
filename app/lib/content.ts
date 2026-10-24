export const links = {
  github: "https://github.com/mahekara28",
  x: "https://x.com/mahekara28",
  linkedin: "https://www.linkedin.com/in/mahek-ara/",
  email: "mailto:mahekarabangi28@gmail.com",
  resume:
    "https://drive.google.com/file/d/1ieDdXUTnlAKEhHyRuVNN0C0Y5Sn8vDR3/view?usp=sharing",
};

export const reviewedOn = "2026-10-24";
export const focusAreas = [
  { id: "all", label: "All projects" },
  { id: "ai", label: "AI engineering" },
  { id: "developer", label: "Developer experience" },
  { id: "operations", label: "Operations & decisions" },
] as const;
export type Focus = (typeof focusAreas)[number]["id"];
export const isFocus = (value: string | null): value is Focus =>
  focusAreas.some((focus) => focus.id === value);

export type Project = {
  id: string;
  number: string;
  title: string;
  category: string;
  focus: Exclude<Focus, "all">[];
  status: string;
  question: string;
  description: string;
  detail: string;
  approach: string;
  boundary: string;
  stack: string[];
  repo: string;
  github: string;
  revision: string;
  evidence: { label: string; path: string }[];
};

const repository = (repo: string) => ({
  repo,
  github: `https://github.com/mahekara28/${repo}`,
});

export const projects: Project[] = [
  {
    id: "context-relay",
    number: "01",
    title: "Context Relay",
    category: "Agent tooling",
    focus: ["ai", "developer"],
    status: "Public alpha",
    question: "Did the agent follow the latest instruction?",
    description:
      "I built this Python library to carry supported instruction updates into later model calls, check registered tool calls before they run, and let the application verify what happened.",
    detail:
      "An agent can remember a conversation and still export the wrong file. The useful check is whether the latest instruction reaches the tool call and the saved output.",
    approach:
      "Current preferences live separately from chat history. Declared tool arguments are checked against them, then an application-owned verifier checks the result. The release-desk example reads the saved file bytes; a successful callback isn't enough.",
    boundary:
      "It's a public alpha. The parser doesn't catch many phrasings, and checks only cover configured fields and registered tools. State is stored in local SQLite. The published evaluation includes no organisational pilot or hosted-provider acceptance run, so it isn't a reliability guarantee.",
    stack: ["Python", "SQLite", "Tool contracts", "Outcome checks"],
    ...repository("context-relay"),
    revision: "139d3c44df7882750db59c1ed87a6a45da7bfb53",
    evidence: [
      { label: "Action harness", path: "src/context_relay/actions.py" },
      {
        label: "File-readback example",
        path: "examples/verified_release_desk.py",
      },
      { label: "Validation & limits", path: "docs/VALIDATION.md" },
    ],
  },
  {
    id: "llm-router",
    number: "02",
    title: "RouterFlow",
    category: "LLM routing",
    focus: ["ai"],
    status: "Local prototype",
    question: "Which model should answer this?",
    description:
      "A prompt goes in; a local Ollama model answers. This FastAPI app uses keyword rules to choose the model and returns the reason for the choice plus the measured call time.",
    detail:
      "I wanted to see which rule picked a model, rather than just get an answer back. RouterFlow shows that choice and the time spent waiting for inference.",
    approach:
      "Classification lives in router.py; inference lives in llm.py. Three route labels map to two local models: Qwen 2.5 1.5B for small requests and Llama 3.2 3B for both medium and large routes.",
    boundary:
      "Keywords decide the route; there's no learned complexity estimate. Medium and large share a model, the cost field is fixed at zero, and quality-based escalation isn't implemented. It doesn't demonstrate cost savings.",
    stack: ["Python", "FastAPI", "Ollama", "Qwen / Llama"],
    ...repository("LLM---Router"),
    revision: "375eef5595611659548ff99fb5ce90ecbd163116",
    evidence: [
      { label: "Routing rules", path: "router.py" },
      { label: "Model calls & timing", path: "llm.py" },
      { label: "FastAPI endpoint", path: "main.py" },
    ],
  },
  {
    id: "narrative-gap-mcp",
    number: "03",
    title: "Narrative Gap MCP",
    category: "Developer experience",
    focus: ["developer", "operations"],
    status: "Working prototype",
    question: "Where are developers getting stuck?",
    description:
      "This workspace pulls in GitHub activity to help review docs, onboarding and product messaging alongside the questions developers raise. Findings and suggested fixes come from rules, not an LLM.",
    detail:
      "I wanted issue threads and pull requests to have a place in docs and program planning. They give people reviewing the product something more concrete than a feature list.",
    approach:
      "FastAPI fetches repository metadata, issues, pull requests and contributors. Next.js displays the analysis, and SQLite saves the workspace. Rules and templates generate the findings and briefs.",
    boundary:
      "The docs-demand and event-activity numbers are calculated from other repository signals; they aren't recorded visits or signups. Findings need human review. Despite the name, a full MCP integration isn't implemented yet.",
    stack: ["Next.js", "FastAPI", "SQLite", "GitHub API"],
    ...repository("Narrative-Gap-MCP"),
    revision: "fecd1749ff53965b62bb838858922a768f32d114",
    evidence: [
      { label: "GitHub ingestion", path: "backend/app/ingestion/github.py" },
      { label: "Signal rules", path: "backend/app/analysis/signals.py" },
      { label: "Analysis tests", path: "backend/tests/test_analysis.py" },
    ],
  },
  {
    id: "mcp-impact",
    number: "04",
    title: "MCP Impact",
    category: "Developer tools",
    focus: ["ai", "developer"],
    status: "Local tool",
    question: "One tool changes. What breaks next?",
    description:
      "Change an MCP tool contract, then check where its names and fields appear elsewhere. The tool compares repository versions and flags references in prompts, agents, tests and workflows.",
    detail:
      "A diff shows the changed definition. I also want to find the prompt or agent that still expects the old one, before that mismatch reaches a tool call.",
    approach:
      "It compares a pull request or two refs, parses supported JSON and YAML-like contracts, and searches candidate files for tool and field names. The report links each possible dependency to a source path and exports as JSON.",
    boundary:
      "The scan follows text references with a bounded search. It won't find every dependency or prove a runtime failure. There's a sample PDF, but generating another requires configuring a machine-specific Python path.",
    stack: ["JavaScript", "Node.js", "MCP contracts", "GitHub API"],
    ...repository("mcp-impact"),
    revision: "31e7a74a2d0e4644662b1b50f3b9718a906b19ee",
    evidence: [
      { label: "Contract & reference scan", path: "server.js" },
      { label: "Report logic", path: "script.js" },
      {
        label: "Sample report (PDF)",
        path: "outputs/sample-impact-report.pdf",
      },
    ],
  },
  {
    id: "prompt-injection-lab",
    number: "05",
    title: "Prompt Injection Lab",
    category: "AI security",
    focus: ["ai"],
    status: "Offline simulation",
    question: "Where should an agent stop?",
    description:
      "An offline FastAPI lab for looking at prompt-injection scenarios side by side. Also called Sentinel AI, it contains 100 predefined prompts across five categories and simulates the outcomes.",
    detail:
      "Instruction hierarchy, untrusted content and tool permissions are easier to discuss with a specific case in front of you. The lab lays out those cases so you can compare how the simulation treats them.",
    approach:
      "The simulator combines attack keywords, categories, a deterministic text signature and configured defense weights to mark cases as blocked or exploited. The API returns each result and a category summary.",
    boundary:
      "It doesn't attack a live model. Responses and scores come from the simulator, so a high score here isn't evidence that a real model would resist an attack. These aren't security benchmark results.",
    stack: ["Python", "FastAPI", "Threat scenarios", "Simulation"],
    ...repository("Prompt-Injection-Lab"),
    revision: "6a9f15b22cf9c6926185b18d497eb9e9c473f73d",
    evidence: [
      { label: "Scenarios & simulator", path: "app.py" },
      { label: "Scope & setup", path: "README.md" },
    ],
  },
  {
    id: "build-buy-borrow",
    number: "06",
    title: "Build, Buy or Borrow",
    category: "Decision support",
    focus: ["operations"],
    status: "Local application",
    question: "Can the team be ready in time?",
    description:
      "Compare training people, hiring, contracting and blended teams for the same project. The JavaScript planner checks deadlines, budget and capacity, including time spent learning and mentoring.",
    detail:
      "The cheapest plan on paper can still miss the start date. This project puts preparation time and mentoring capacity next to the cost, so those constraints don't disappear from the decision.",
    approach:
      "A separate JavaScript engine assigns scarce roles first using a greedy heuristic. Each plan breaks down costs and blockers. Saved snapshots keep the assumptions behind an exported decision brief.",
    boundary:
      "The people, projects and rates are made up for the demo. This is a single-user planning tool, not an optimiser or HR system, and the numbers aren't client savings. Saving one plan doesn't reserve its people for other scenarios.",
    stack: [
      "JavaScript",
      "Constraint checks",
      "Scenario analysis",
      "Node tests",
    ],
    ...repository("build-buy-borrow"),
    revision: "bd642ab465fa10c5487707cde4e46c0ed0495912",
    evidence: [
      { label: "Planning engine", path: "engine.js" },
      { label: "Constraint tests", path: "tests/engine.test.cjs" },
      { label: "Decisions & scope", path: "PORTFOLIO.md" },
    ],
  },
  {
    id: "merchant-ops-desk",
    number: "07",
    title: "Merchant Ops Desk",
    category: "Operational workflows",
    focus: ["operations"],
    status: "Local-first prototype",
    question: "Which product listings need a fix?",
    description:
      "Import a product catalog from CSV, review listing issues and keep a record of proposed changes and approvals. The workspace saves in the browser by default.",
    detail:
      "A missing image or a thin title needs a next step, not just a warning. Merchant Ops Desk puts the review, proposed edit and approval history in one place.",
    approach:
      "TypeScript rules score title length, tag coverage, images and stock movement after CSV import. An optional Supabase adapter stores workspace snapshots, with authentication and row-level policies.",
    boundary:
      "Suggestions use rules, not a language model. The optional Supabase setup needs a configured project and wasn't run during this source review. There isn't a verified live merchant integration or measured business impact.",
    stack: ["Next.js", "TypeScript", "CSV", "Optional Supabase"],
    ...repository("merchant-ops-desk"),
    revision: "0816dc9a7cbc5aa5c2d9d1447bea7dfa52ce8ccc",
    evidence: [
      { label: "Product scoring", path: "lib/scoring.ts" },
      { label: "Storage adapter", path: "lib/workspace-storage.ts" },
      { label: "Database policies", path: "supabase/schema.sql" },
    ],
  },
  {
    id: "knowwhen-ai",
    number: "08",
    title: "KnowWhen AI",
    category: "Applied AI",
    focus: ["ai"],
    status: "Local prototype",
    question: "Does the plan fit your available time?",
    description:
      "Give this Streamlit app an activity, your available time and a goal. Simple timing rules and a local Llama model turn those inputs into a short recommendation.",
    detail:
      "Advice to do something is only partly useful if there's no room for it today. This experiment adds availability before asking the model for a next step.",
    approach:
      "Keyword rules suggest a time window and duration. Ollama runs Llama 3.2 3B locally, with a prompt asking for four short lines: time, duration, reasoning and action.",
    boundary:
      "It suggests a plan; it doesn't schedule one. Timing comes from simple rules, and nothing checks the recommendation against a real calendar.",
    stack: ["Python", "Streamlit", "Ollama", "Llama 3.2"],
    ...repository("knowwhen-ai"),
    revision: "cae85875e96eb416bd3b7bea7e39bb46500261f2",
    evidence: [
      { label: "Timing rules", path: "timing_engine.py" },
      { label: "Ollama prompt", path: "ai_engine.py" },
    ],
  },
  {
    id: "insightify",
    number: "09",
    title: "Insightify",
    category: "Early experiment",
    focus: ["ai"],
    status: "Legacy API demo",
    question: "What does a basic Gemini app need?",
    description:
      "An early Python experiment with Streamlit and Gemini: type a question, make an API call and show the response.",
    detail:
      "This one is small: a Python interface connected to a model API. It's an earlier experiment, not a full analytics application.",
    approach:
      "Load a Google API key from the environment, call the configured model and render its text in Streamlit.",
    boundary:
      "The code uses the older google-generativeai SDK and gemini-pro model name. It hasn't been verified against the current API. There's no analytics pipeline in the app.",
    stack: ["Python", "Streamlit", "Gemini API"],
    ...repository("Insightify"),
    revision: "a56123b50b9148d7479c1979604f64f443e7d476",
    evidence: [{ label: "Q&A application", path: "app.py" }],
  },
];

export const featuredProjects = projects.slice(0, 6);
export const sourceUrl = (project: Project, path: string) =>
  `${project.github}/blob/${project.revision}/${path}`;

export const repositoryNotes = [
  {
    title: "Adding Context Relay to a Python agent",
    kind: "Integration guide",
    description:
      "Setup steps, supported clients, and when you'll need to write an adapter.",
    project: "context-relay",
    path: "docs/AUTO_CONNECT.md",
  },
  {
    title: "What Context Relay's tests actually cover",
    kind: "Validation report",
    description:
      "Which local checks pass, which cases fail, and what hasn't been tested yet.",
    project: "context-relay",
    path: "docs/VALIDATION.md",
  },
  {
    title: "How the staffing planner makes a choice",
    kind: "Technical case study",
    description:
      "The rules behind Build, Buy or Borrow, including learning time, mentoring capacity and saved assumptions.",
    project: "build-buy-borrow",
    path: "PORTFOLIO.md",
  },
];

export const routingPost = {
  title: "Why I built an LLM router. And what it actually does.",
  href: "/blog/llm-routing",
  description:
    "RouterFlow uses keyword rules and two local models. Here's how the choice works, what the API measures, and what it can't tell me yet.",
  date: "August 2026",
  readTime: "6 min read",
};
