export type Note = {
  slug: string;
  title: string;
  topic: string;
  description: string;
  date: string;
  sections: {
    title?: string;
    paragraphs: string[];
    bullets?: string[];
    example?: { label: string; text: string };
  }[];
  sources: { title: string; href: string }[];
};

export const notes: Note[] = [
  {
    slug: "context-relay",
    title: "What should survive when a coding thread ends?",
    topic: "Context Relay · Build notes",
    description: "A useful handoff preserves decisions, their sources, and the work still open.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A coding thread can contain three abandoned approaches, a requirement that changed halfway through, and a final fix that still needs testing. When I imagine handing that work to a fresh agent, the difficult question is what the next session should treat as current.",
        "That is the problem behind Context Relay. The public npm beta brings a local interface, CLI, SQLite store and MCP server into one package. The useful unit is a reviewed checkpoint: a record of the goal, current instructions, acceptance criteria and unfinished work, with references back to the selected evidence."
      ] },
      { title: "Keep the correction attached to its source", paragraphs: [
        "Consider an illustrative thread that begins with a thirty-day retention requirement. Later, the user changes it to seven days. A summary saying ‘we discussed retention’ discards the decision. A handoff saying ‘use seven days’ is better, but the receiving agent also needs to know where that instruction came from.",
        "Relay lets the reviewer select source events and cite them in the checkpoint. When checkpoints disagree on an instruction key, the merge requires an explicit choice. A shorter record is useful only if the correction survives."
      ], example: { label: "Illustrative handoff, not a captured user session", text: "Current instruction: retain records for seven days.\nEvidence: the later user correction in the source thread.\nOpen work: update the cleanup task and check its tests.\nStill uncertain: whether backups have a separate policy." } },
      { title: "MCP is the access layer", paragraphs: [
        "Native capture adapters read supported history from Claude Code, Codex, OpenCode and Goose. MCP exposes tools and resources so a connected agent can inspect a checkpoint or accept a handoff addressed to it. These are separate jobs: adding an MCP entry does not automatically give Relay the harness’s conversation history.",
        "Before accepting an offered packet, the service checks its recipient, integrity and freshness, including recorded source revisions and file state. Acceptance records that the packet was acknowledged. The receiving agent still has to carry out the work and verify its result."
      ] },
      { title: "Try the small loop first", paragraphs: [
        "With Node 22.16 or later, run the demo command below, then open the UI. The demo uses synthetic sessions. Inspect one correction, make a checkpoint, and read the exported packet before connecting your own project.",
        "Model-assisted drafts are optional and require review. The beta has transport and workflow checks, but live model-quality evaluation remains pending. Its value should be judged by whether the next session can resume a specific task without losing its constraints."
      ], example: { label: "Public npm beta", text: "npx @mahekara28/context-relay@beta demo\nnpx @mahekara28/context-relay@beta ui" } }
    ],
    sources: [
      { title: "Context Relay — workflow, installation and current limits", href: "https://github.com/mahekara28/context-relay/tree/4e52ada45c471f17a94b16b2d81ed6636495f0f7" },
      { title: "MCP — architecture and scope", href: "https://modelcontextprotocol.io/docs/learn/architecture" },
      { title: "Relay MCP implementation — handoff acceptance", href: "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/packages/relay/src/mcp.ts" }
    ]
  },
  {
    slug: "working-context",
    title: "A longer chat isn’t always better context.",
    topic: "AI fundamentals · Context",
    description: "A transcript records the journey. A working context helps with the next decision.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A transcript is an excellent record of how a task unfolded. It can also be an awkward starting point for continuing that task. A new session may have to separate the latest instruction from an earlier idea, a successful test from a failed attempt, and an open question from a settled decision.",
        "For designing a handoff, I find it useful to distinguish three things. The transcript is the sequence of events. The working context is the material selected for the current task. Persistent memory is information retained across sessions. Keeping something in storage does not, by itself, make it relevant or correct for the next request."
      ] },
      { title: "Start with the next action", paragraphs: [
        "Suppose a thread is preparing a report. It contains a discussion of JSON and CSV, two failed exports, and a correction to the required columns. The next action is to produce the final file. A useful working set should make the requested format, columns, destination and verification step easy to find.",
        "This is an editorial decision. I would retain the correction and a pointer to the failed export, while leaving the full debugging dialogue in the source history. That gives the next agent a clear starting point and somewhere to look if the abbreviated record proves insufficient."
      ], example: { label: "Illustrative working context", text: "Goal: export the approved report.\nFormat: CSV, superseding the earlier JSON suggestion.\nColumns: date, account, amount.\nOpen check: parse the saved file and verify the header.\nSource: link to the correction and the failed export." } },
      { title: "Compression has a cost", paragraphs: [
        "An omitted attempt might explain why an apparently obvious fix was rejected. A short instruction may lose the condition under which it applies. A summary can sound more certain than the discussion it came from. I would therefore keep uncertainty explicit and preserve a route back to the evidence.",
        "The same applies to saved preferences. ‘Use CSV for this report’ should not quietly become ‘always use CSV for every task.’ Scope belongs alongside the instruction. A current decision, a reusable preference and a one-time workaround need different treatment."
      ] },
      { title: "A practical review question", paragraphs: [
        "Before passing context along, ask: could someone use this to take the next step, explain the applicable constraints, and identify what still needs checking? If the answer depends on a missing correction, the handoff needs that correction. If the packet repeats material unrelated to the next step, it may be taking space without helping.",
        "This is the design principle I use in Context Relay: review the working set beside its sources. The complete history stays valuable; the handoff earns its place by making the next decision easier to inspect."
      ] }
    ],
    sources: [
      { title: "Context Relay — checkpoints, source review and conflicts", href: "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/docs/WORKSPACE.md" }
    ]
  },
  {
    slug: "decision-assumptions",
    title: "A recommendation is only as good as its assumptions.",
    topic: "Decision systems · Operations",
    description: "A staffing planner becomes useful when its constraints and trade-offs are inspectable.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A staffing recommendation needs an explanation that survives a change to the brief. If a deadline moves forward, does the suggested team still fit? If a mentor is unavailable, is the training plan still realistic? These are the questions behind Build, Buy or Borrow, my local planning application.",
        "The app compares internal development, hiring, contracting and a blend of those approaches. It uses fictional people, example rates and explicit constraints. The results are simulated planning estimates; they are not evidence of savings on a client engagement."
      ] },
      { title: "Write down what makes a plan possible", paragraphs: [
        "A person’s recorded skill is only one input. The plan also depends on availability, assignment interest, time to readiness and any mentoring required. Costs include preparation as well as delivery. Making those assumptions visible gives the reviewer something concrete to challenge.",
        "The calculation engine is separate from the interface. It uses a greedy assignment heuristic, prioritising roles with fewer eligible internal candidates. That makes the order of decisions inspectable, but it does not guarantee a globally optimal team. A plausible recommendation still needs someone to review its inputs and trade-offs."
      ] },
      { title: "Change one constraint at a time", paragraphs: [
        "For an illustrative review, imagine a project starting in four weeks and an internal candidate who needs three weeks of preparation. First check whether that preparation has the required mentoring capacity. Then move the project start to two weeks away, leaving the other assumptions unchanged.",
        "The useful output is the explanation of what no longer fits. A plan may need a different assignment, outside help, a later start, or a narrower scope. A ranking alone cannot tell the reviewer which compromise is acceptable."
      ], bullets: [
        "Save the original brief and its assumptions.",
        "Change the start date, budget or mentor capacity individually.",
        "Compare readiness, cost components and blockers.",
        "Record the reason for the chosen plan and who must confirm it."
      ] },
      { title: "Keep the decision with the people doing the work", paragraphs: [
        "A future workplace trial would need validated skills, current availability, approved costs and consent around development plans. The local app does not reserve a person across simultaneous projects, so two individually feasible scenarios can still compete for the same capacity.",
        "The tool’s useful contribution is a repeatable comparison with an inspectable record. It helps make a conversation more specific: this option fits these assumptions, this constraint is binding, and this question remains unresolved. That is a stronger basis for a decision than a confident score on its own."
      ] }
    ],
    sources: [
      { title: "Build, Buy or Borrow — project decisions and scope", href: "https://github.com/mahekara28/build-buy-borrow/blob/bd642ab465fa10c5487707cde4e46c0ed0495912/PORTFOLIO.md" },
      { title: "Planning engine", href: "https://github.com/mahekara28/build-buy-borrow/blob/bd642ab465fa10c5487707cde4e46c0ed0495912/engine.js" },
      { title: "Constraint tests", href: "https://github.com/mahekara28/build-buy-borrow/blob/bd642ab465fa10c5487707cde4e46c0ed0495912/tests/engine.test.cjs" }
    ]
  },
  {
    slug: "inference-latency",
    title: "Where the seconds go in an AI response.",
    topic: "AI fundamentals · Inference",
    description: "First output and finished output answer different questions about latency.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "An AI response can begin quickly and take a long time to finish. It can also pause before the first word, then produce a short answer. A single ‘response time’ number hides that distinction. For an interactive tool, I want to understand both waits.",
        "In a typical autoregressive transformer, prefill processes the input prompt. Decode then generates additional tokens using the preceding context. A key-value cache retains attention keys and values from earlier tokens, avoiding repeated computation of those values. These mechanisms help explain why input length and output length can affect different parts of the wait."
      ] },
      { title: "Measure what the person actually sees", paragraphs: [
        "Client-side time to first output includes more than model computation: connection overhead, queueing and buffering may all contribute. A network chunk can also contain metadata or multiple tokens. I would record the first non-empty content event separately from the first network event, and describe that measurement precisely.",
        "Streaming makes partial output visible before completion. It can improve the experience without shortening the time needed to generate the full answer. For a tool that must parse a complete structured result, the completion time may still be the relevant wait."
      ], example: { label: "Measurement definitions — a proposed method, not benchmark results", text: "t0 = request begins\nt1 = first non-empty answer content arrives\nt2 = response completes\n\nFirst-content latency = t1 - t0\nTotal latency = t2 - t0\nKeep server-reported token timings separate." } },
      { title: "Make the comparison reproducible", paragraphs: [
        "A small experiment can compare a short and long input with the same requested output. A second comparison can hold the input fixed and vary the requested output length. I would log the actual token counts because an output limit is a ceiling, not a guarantee of equal-length answers.",
        "Record the exact model revision, serving configuration, hardware or provider, sampling settings, concurrency and cache state. Separate cold starts from warmed runs. Repeat requests, retain individual measurements and report the spread. One fast response is a poor description of what another person should expect."
      ], bullets: [
        "Keep prompt content and request settings with every timing record.",
        "Count failures and interrupted streams as outcomes.",
        "Check answer quality alongside speed.",
        "Use server instrumentation to investigate a suspected bottleneck."
      ] },
      { title: "Choose an improvement after locating the wait", paragraphs: [
        "If queueing dominates, trimming a sentence from the answer may barely help the initial pause. If a verbose answer takes most of the time, clearer output requirements may matter more. The measurements should decide which change is worth trying.",
        "This note describes a measurement plan, not a completed latency study. Publishing the run configuration and raw observations would be the next step before making a performance claim."
      ] }
    ],
    sources: [
      { title: "Prefill and decode — TNG’s inference engineering explanation", href: "https://huggingface.co/blog/tngtech/llm-performance-prefill-decode-concurrent-requests" },
      { title: "Hugging Face Transformers — how caching works", href: "https://huggingface.co/docs/transformers/en/cache_explanation" },
      { title: "Text Generation Inference — streaming", href: "https://huggingface.co/docs/text-generation-inference/en/conceptual/streaming" }
    ]
  },
  {
    slug: "verify-the-result",
    title: "The tool said “done.” What would I check?",
    topic: "Operations · Verification",
    description: "A success message is one piece of evidence. The artifact needs its own checks.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "Imagine asking an automation to save a CSV report. The tool returns a success response and a file path. Opening that file reveals JSON. The call completed, but the requested outcome is still missing.",
        "That small example is useful because it separates several claims that can get compressed into ‘done.’ The tool accepted the request. It wrote something. The artifact has the required format. Its contents satisfy the task. Each claim needs evidence at the appropriate level."
      ] },
      { title: "Define success before running the tool", paragraphs: [
        "For a CSV export, I would write down the required destination, column names, encoding and any task-specific constraints. Then I would inspect the saved bytes with a CSV parser, check the header and validate the rows against those constraints. A filename ending in .csv is not enough.",
        "The verifier should be owned by the application or workflow, with a clear contract. Asking the same model whether it succeeded can provide another opinion, but it does not replace a direct check of an artifact that can be read and parsed."
      ], example: { label: "Illustrative acceptance record", text: "Requested: report.csv with date, account, amount.\nObserved: saved bytes parse as JSON.\nResult: failed format check.\nNext step: regenerate the file, then repeat validation.\nDo not mark the report ready to send." } },
      { title: "Design the failure path too", paragraphs: [
        "A useful check returns enough detail to fix the problem: what was expected, what was observed and which artifact was inspected. If the checker cannot read the file, that is an unverified result. It should not silently become a pass.",
        "Retries need boundaries. Re-running a local export is different from repeating a payment or sending another email. Before retrying, the workflow should establish whether the first attempt already created an external effect, and which actions require a person’s review."
      ] },
      { title: "Be precise about what a receipt means", paragraphs: [
        "Context Relay makes this distinction at the handoff boundary. An accepted packet records that a destination acknowledged a checked handoff. It does not prove the destination implemented the requested change or that its tests passed. Those outcomes need their own evidence.",
        "For a release, I would connect the request to the changed files, the verification result and the deployed version. If any link is missing, describe the state accurately: prepared, checked locally, uploaded, or verified live. Those words help the next person know what remains to be done."
      ] },
      { title: "Keep the check close to the promise", paragraphs: [
        "The general habit is simple: identify the thing the user will rely on, then inspect that thing. For a report, it is the file. For a website, it is the deployed page. For a handoff, it is the packet and its source state. A good completion message can then point to the evidence behind the promise."
      ] }
    ],
    sources: [
      { title: "Context Relay — file-readback verification example", href: "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/examples/verified_release_desk.py" },
      { title: "Relay’s handoff contract — acknowledgement versus completion", href: "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/packages/relay/src/mcp.ts" }
    ]
  }
];

export function readingTime(note: Note) {
  const words = note.sections.flatMap(section => [...section.paragraphs, ...(section.bullets ?? []), section.example?.text ?? ""]).join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
