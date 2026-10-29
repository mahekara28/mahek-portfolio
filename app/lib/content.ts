export const links = {
  github: "https://github.com/mahekara28",
  x: "https://x.com/mahekara28",
  linkedin: "https://www.linkedin.com/in/mahek-ara/",
  email: "mailto:mahekarabangi28@gmail.com",
};

export const reviewedOn = "2026-10-24";
export const focusAreas = [
  {
    id: "all",
    label: "All projects",
  },
  {
    id: "ai",
    label: "AI engineering",
  },
  {
    id: "developer",
    label: "Developer experience",
  },
  {
    id: "operations",
    label: "Operations & decisions",
  },
] as const;
export type Focus = (typeof focusAreas)[number]["id"];
export const isFocus = (value: string | null): value is Focus =>
  focusAreas.some((focus) => focus.id === value);

export type Project = {
  id: string;
  title: string;
  category: string;
  focus: Exclude<Focus, "all">[];
  status: string;
  description: string;
  question: string;
  steps: [string, string, string];
  scope: string;
  approach: string;
  boundary: string;
  stack: string[];
  repo: string;
  github: string;
  revision: string;
  evidence: { label: string; path: string }[];
};

export const projects: Project[] = [
  {
    id: "llm-router",
    title: "RouterFlow",
    category: "LLM routing",
    focus: ["ai"],
    status: "Local prototype",
    description:
      "Keyword-based routing between two local Ollama models, with a reason for each choice.",
    question: "Does this request need the bigger model?",
    steps: ["Read the request", "Match routing keywords", "Call a local model"],
    scope: "Rule-based routing; quality-based escalation is not implemented.",
    approach:
      "Classification lives in router.py; inference lives in llm.py. Three route labels map to two local models: Qwen 2.5 1.5B for small requests and Llama 3.2 3B for both medium and large routes.",
    boundary:
      "Keywords decide the route; there's no learned complexity estimate. Medium and large share a model, the cost field is fixed at zero, and quality-based escalation isn't implemented. It doesn't demonstrate cost savings.",
    stack: ["Python", "FastAPI", "Ollama", "Qwen / Llama"],
    repo: "LLM---Router",
    github: "https://github.com/mahekara28/LLM---Router",
    revision: "375eef5595611659548ff99fb5ce90ecbd163116",
    evidence: [
      {
        label: "Routing rules",
        path: "router.py",
      },
      {
        label: "Model calls & timing",
        path: "llm.py",
      },
      {
        label: "FastAPI endpoint",
        path: "main.py",
      },
    ],
  },
  {
    id: "narrative-gap-mcp",
    title: "Narrative Gap MCP",
    category: "Developer experience",
    focus: ["developer", "operations"],
    status: "Working prototype",
    description:
      "GitHub activity brought together to review docs and developer onboarding.",
    question: "What can repo activity tell us about onboarding?",
    steps: ["Fetch GitHub activity", "Apply signal rules", "Review a saved brief"],
    scope: "Findings are heuristic; full MCP integration is not implemented.",
    approach:
      "FastAPI fetches repository metadata, issues, pull requests and contributors. Next.js displays the analysis, and SQLite saves the workspace. Rules and templates generate the findings and briefs.",
    boundary:
      "The docs-demand and event-activity numbers are calculated from other repository signals; they aren't recorded visits or signups. Findings need human review. Despite the name, a full MCP integration isn't implemented yet.",
    stack: ["Next.js", "FastAPI", "SQLite", "GitHub API"],
    repo: "Narrative-Gap-MCP",
    github: "https://github.com/mahekara28/Narrative-Gap-MCP",
    revision: "fecd1749ff53965b62bb838858922a768f32d114",
    evidence: [
      {
        label: "GitHub ingestion",
        path: "backend/app/ingestion/github.py",
      },
      {
        label: "Signal rules",
        path: "backend/app/analysis/signals.py",
      },
      {
        label: "Analysis tests",
        path: "backend/tests/test_analysis.py",
      },
    ],
  },
  {
    id: "mcp-impact",
    title: "MCP Impact",
    category: "Developer tools",
    focus: ["ai", "developer"],
    status: "Local tool",
    description:
      "A contract-change checker that finds references across prompts, agents and workflows.",
    question: "What might a tool-contract change affect?",
    steps: ["Compare two revisions", "Find contract references", "Trace possible impact"],
    scope: "References suggest possible impact; they do not prove a runtime failure.",
    approach:
      "It compares a pull request or two refs, parses supported JSON and YAML-like contracts, and searches candidate files for tool and field names. The report links each possible dependency to a source path and exports as JSON.",
    boundary:
      "The scan follows text references with a bounded search. It won't find every dependency or prove a runtime failure. There's a sample PDF, but generating another requires configuring a machine-specific Python path.",
    stack: ["JavaScript", "Node.js", "MCP contracts", "GitHub API"],
    repo: "mcp-impact",
    github: "https://github.com/mahekara28/mcp-impact",
    revision: "31e7a74a2d0e4644662b1b50f3b9718a906b19ee",
    evidence: [
      {
        label: "Contract & reference scan",
        path: "server.js",
      },
      {
        label: "Report logic",
        path: "script.js",
      },
      {
        label: "Sample report (PDF)",
        path: "outputs/sample-impact-report.pdf",
      },
    ],
  },
  {
    id: "prompt-injection-lab",
    title: "Prompt Injection Lab",
    category: "AI security",
    focus: ["ai"],
    status: "Offline simulation",
    description:
      "An offline lab with 100 prompt-injection scenarios and simulated outcomes.",
    question: "How can I explore different prompt-injection scenarios?",
    steps: ["Choose an attack case", "Run the simulator", "Compare the outcomes"],
    scope: "Simulated outcomes, not attacks against a live model or security benchmarks.",
    approach:
      "The simulator combines attack keywords, categories, a deterministic text signature and configured defense weights to mark cases as blocked or exploited. The API returns each result and a category summary.",
    boundary:
      "It doesn't attack a live model. Responses and scores come from the simulator, so a high score here isn't evidence that a real model would resist an attack. These aren't security benchmark results.",
    stack: ["Python", "FastAPI", "Threat scenarios", "Simulation"],
    repo: "Prompt-Injection-Lab",
    github: "https://github.com/mahekara28/Prompt-Injection-Lab",
    revision: "6a9f15b22cf9c6926185b18d497eb9e9c473f73d",
    evidence: [
      {
        label: "Scenarios & simulator",
        path: "app.py",
      },
      {
        label: "Scope & setup",
        path: "README.md",
      },
    ],
  },
  {
    id: "build-buy-borrow",
    title: "Build, Buy or Borrow",
    category: "Decision support",
    focus: ["operations"],
    status: "Local application",
    description:
      "Compare training, hiring and contracting against a project's time, budget and skills.",
    question: "Train, hire or contract for the next project?",
    steps: ["Set time and budget", "Check people and skills", "Compare the plans"],
    scope: "A single-user planning tool using fictional people and example costs.",
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
    repo: "build-buy-borrow",
    github: "https://github.com/mahekara28/build-buy-borrow",
    revision: "bd642ab465fa10c5487707cde4e46c0ed0495912",
    evidence: [
      {
        label: "Planning engine",
        path: "engine.js",
      },
      {
        label: "Constraint tests",
        path: "tests/engine.test.cjs",
      },
      {
        label: "Decisions & scope",
        path: "PORTFOLIO.md",
      },
    ],
  },
  {
    id: "context-relay",
    title: "Context Relay",
    category: "Agent tooling",
    focus: ["ai", "developer"],
    status: "Public alpha",
    description:
      "Python tooling for current instructions, guarded tool calls and application-owned result checks.",
    question: "Did the tool actually do what was asked?",
    steps: ["Keep current instructions", "Check the tool call", "Verify the result"],
    scope: "A public alpha; checks cover registered tools and configured fields only.",
    approach:
      "Current preferences live separately from chat history. Declared tool arguments are checked against them, then an application-owned verifier checks the result. The release-desk example reads the saved file bytes; a successful callback isn't enough.",
    boundary:
      "It's a public alpha. The parser doesn't catch many phrasings, and checks only cover configured fields and registered tools. State is stored in local SQLite. The published evaluation includes no organisational pilot or hosted-provider acceptance run, so it isn't a reliability guarantee.",
    stack: ["Python", "SQLite", "Tool contracts", "Outcome checks"],
    repo: "context-relay",
    github: "https://github.com/mahekara28/context-relay",
    revision: "139d3c44df7882750db59c1ed87a6a45da7bfb53",
    evidence: [
      {
        label: "Action harness",
        path: "src/context_relay/actions.py",
      },
      {
        label: "File-readback example",
        path: "examples/verified_release_desk.py",
      },
      {
        label: "Validation & limits",
        path: "docs/VALIDATION.md",
      },
    ],
  },
  {
    id: "knowwhen-ai",
    title: "KnowWhen AI",
    category: "Applied AI",
    focus: ["ai"],
    status: "Local prototype",
    description:
      "An activity planner using your availability, timing rules and a local Llama model.",
    question: "When could this fit into my day?",
    steps: ["Describe an activity", "Apply timing rules", "Ask a local model"],
    scope: "Suggests a plan; it does not book time or check a live calendar.",
    approach:
      "Keyword rules suggest a time window and duration. Ollama runs Llama 3.2 3B locally, with a prompt asking for four short lines: time, duration, reasoning and action.",
    boundary:
      "It suggests a plan; it doesn't schedule one. Timing comes from simple rules, and nothing checks the recommendation against a real calendar.",
    stack: ["Python", "Streamlit", "Ollama", "Llama 3.2"],
    repo: "knowwhen-ai",
    github: "https://github.com/mahekara28/knowwhen-ai",
    revision: "cae85875e96eb416bd3b7bea7e39bb46500261f2",
    evidence: [
      {
        label: "Timing rules",
        path: "timing_engine.py",
      },
      {
        label: "Ollama prompt",
        path: "ai_engine.py",
      },
    ],
  },
  {
    id: "merchant-ops-desk",
    title: "Merchant Ops Desk",
    category: "Operational workflows",
    focus: ["operations"],
    status: "Local-first prototype",
    description:
      "CSV catalog reviews, suggested edits and approvals, saved locally in the browser.",
    question: "Which catalog entries need attention?",
    steps: ["Import a CSV", "Check product details", "Review suggested edits"],
    scope: "Rule-based suggestions, with optional Supabase storage requiring setup.",
    approach:
      "TypeScript rules score title length, tag coverage, images and stock movement after CSV import. An optional Supabase adapter stores workspace snapshots, with authentication and row-level policies.",
    boundary:
      "Suggestions use rules, not a language model. The optional Supabase setup needs a configured project and wasn't run during this source review. There isn't a verified live merchant integration or measured business impact.",
    stack: ["Next.js", "TypeScript", "CSV", "Optional Supabase"],
    repo: "merchant-ops-desk",
    github: "https://github.com/mahekara28/merchant-ops-desk",
    revision: "0816dc9a7cbc5aa5c2d9d1447bea7dfa52ce8ccc",
    evidence: [
      {
        label: "Product scoring",
        path: "lib/scoring.ts",
      },
      {
        label: "Storage adapter",
        path: "lib/workspace-storage.ts",
      },
      {
        label: "Database policies",
        path: "supabase/schema.sql",
      },
    ],
  },
  {
    id: "insightify",
    title: "Insightify",
    category: "Early experiment",
    focus: ["ai"],
    status: "Legacy API demo",
    description: "A small Streamlit Q&A app using an older Gemini API.",
    question: "What does a minimal model-backed app need?",
    steps: ["Read a question", "Call the Gemini API", "Display the response"],
    scope: "An early API experiment; the SDK and model name need updating.",
    approach:
      "Load a Google API key from the environment, call the configured model and render its text in Streamlit.",
    boundary:
      "The code uses the older google-generativeai SDK and gemini-pro model name. It hasn't been verified against the current API. There's no analytics pipeline in the app.",
    stack: ["Python", "Streamlit", "Gemini API"],
    repo: "Insightify",
    github: "https://github.com/mahekara28/Insightify",
    revision: "a56123b50b9148d7479c1979604f64f443e7d476",
    evidence: [
      {
        label: "Q&A application",
        path: "app.py",
      },
    ],
  },
];

export const featuredProjects = [
  "llm-router",
  "mcp-impact",
  "narrative-gap-mcp",
].map((id) => projects.find((project) => project.id === id)!);
export const sourceUrl = (project: Project, path: string) =>
  `${project.github}/blob/${project.revision}/${path}`;

export const repositoryNotes = [
  {
    title: "How the staffing planner makes a choice",
    kind: "Case study",
    project: "build-buy-borrow",
    path: "PORTFOLIO.md",
  },
  {
    title: "Checking an MCP contract change",
    kind: "Setup guide",
    project: "mcp-impact",
    path: "README.md",
  },
  {
    title: "What Context Relay's tests cover",
    kind: "Test notes",
    project: "context-relay",
    path: "docs/VALIDATION.md",
  },
];

export const routingPost = {
  title: "Why I built an LLM router.",
  href: "/blog/llm-routing",
  description:
    "Two local models, a few routing rules, and the questions that are still open.",
  date: "August 2026",
  readTime: "6 min read",
};
