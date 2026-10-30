import type { DiagramId } from "../components/article-diagram";

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
    diagram?: DiagramId;
  }[];
  sources: { title: string; href: string }[];
};

const relay = "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7";
const staffing = "https://github.com/mahekara28/build-buy-borrow/blob/bd642ab465fa10c5487707cde4e46c0ed0495912";

export const notes: Note[] = [
  {
    slug: "context-relay",
    title: "How a coding agent inherits a task without inheriting the whole chat",
    topic: "Context Relay · System design",
    description: "Native capture, reviewed checkpoints and MCP solve different parts of a cross-agent handoff.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A long coding session is not a clean specification. It contains rejected approaches, tool output, corrections and instructions that were valid only for an earlier version of the task. Starting another agent with the entire transcript asks it to discover the current contract again. Starting it with a confident summary risks dropping the correction that matters most.",
        "Context Relay treats a handoff as a reviewed state transfer. Its npm beta stores captured events locally, lets a person assemble a checkpoint, then exposes a bounded packet to a destination agent. The design question is not ‘how much chat can we move?’ It is ‘which claims can the next agent safely act on, and how can it inspect their origin?’"
      ], diagram: "relay" },
      { title: "Capture and MCP have different responsibilities", paragraphs: [
        "The capture adapters read completed, visible history from the native surfaces of Claude Code, Codex, OpenCode and Goose. These are four different contracts: JSONL, app-server JSON-RPC, a loopback API and CLI JSON export. Capture is explicit and project-scoped. The adapters normalize messages and tool results into local session events with revisions. A connected MCP server cannot simply read a host's full chat; the host owns its conversation and chooses what to send to tools.",
        "The destination path is MCP. A project-scoped server exposes sessions, checkpoints, packet inspection and handoff acceptance through tools, plus a checkpoint resource and continuation prompt. That is an access protocol for reviewed state, not a universal transcript export. Keeping these paths separate is what makes the trust boundary visible: one path imports selected native data; the other presents an approved handoff."
      ] },
      { title: "The checkpoint is the actual interface", paragraphs: [
        "A checkpoint records a goal, instructions, acceptance criteria, open work, source session revisions, cited evidence, selected files and optional parent checkpoints. Each instruction has a stable key and event citations. When parent checkpoints disagree on a key, creating a merged checkpoint requires an explicit resolution. Duplicate instruction keys and citations to missing events are rejected. The immutable checkpoint also records a digest, file hashes and Git HEAD.",
        "The packet is a separate export. It includes the checkpoint identity and digest, required task fields, source references, artifacts and a trust notice. The default limit is 24,000 UTF-8 bytes. Optional evidence is dropped if necessary and the omitted count is reported; if the required fields alone do not fit, packet construction fails. This is a byte bound, not a model-token guarantee. A receiving agent should still decide what fits its own context window."
      ], example: { label: "Illustrative checkpoint shape; field names reflect the current schema", text: "goal: Finish the CSV export\ninstructions:\n  - key: output-format\n    text: CSV supersedes the earlier JSON proposal\n    sources: [session-id, correction-event-id]\ncriteria: [Saved file parses as CSV, Header matches contract]\nopenWork: [Implement export, Run readback verification]\nsources: [session-id + captured revision]" } },
      { title: "Freshness and acceptance are narrower than completion", paragraphs: [
        "Before an offer, Relay checks the captured source revisions, selected file SHA-256 values and Git HEAD. Acceptance checks the addressed recipient, packet integrity and freshness again. It means the destination acknowledged a valid packet. It does not mean that the task is implemented, tests pass, or the new agent has read every referenced source.",
        "There is an important limit: a native session may have changed without being captured again. Freshness can compare against the stored revision, but it cannot detect unseen native turns. Recapture before a consequential handoff. Relay also does not move working files or restore hidden model state. The destination still needs the repository and a normal verification loop."
      ] },
      { title: "What I would test next", paragraphs: [
        "The beta has transport tests, adapter format checks and browser workflow coverage. Those establish that the software moves and validates packets under tested conditions. They do not establish that a fresh agent completes a real task better. My next evaluation would give two fresh sessions the same repository issue: one receives the raw transcript, the other a reviewed Relay packet. Score correctness against prewritten acceptance criteria, count lost constraints and unsupported assumptions, and record setup time and token use. Keep the task and harness versions fixed, then repeat across different issue types.",
        "That experiment would expose both sides of the tradeoff. A packet may reduce rereading, but a missing decision could be more expensive than extra context. The design earns its value when a second agent can resume accurately and explain which evidence supports its next action."
      ] }
    ],
    sources: [
      { title: "Context Relay checkpoint, packet and freshness implementation", href: `${relay}/packages/relay/src/store.ts` },
      { title: "Context Relay MCP server and tool contract", href: `${relay}/packages/relay/src/mcp.ts` },
      { title: "Native harness capture versus MCP connection", href: `${relay}/docs/HARNESS_CONNECTIONS.md` },
      { title: "Model Context Protocol architecture", href: "https://modelcontextprotocol.io/specification/2025-06-18/architecture" }
    ]
  },
  {
    slug: "working-context",
    title: "Working context is a projection of task state",
    topic: "AI engineering · Context design",
    description: "Select the decisions needed for the next action, then preserve a path back to their evidence.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A transcript is an event log. A model prompt is a working set. They have different jobs. The log should preserve what happened; the working set should make the next decision possible within a finite budget. Treating all prior turns as equally relevant creates a retrieval problem inside the prompt, and treating a compressed paragraph as authoritative creates a provenance problem.",
        "I think of working context as a projection: take the current objective, select the source events that govern it, resolve superseded instructions, and emit a bounded view. The original events remain available for inspection. This is the mental model behind the checkpoint and packet path in Context Relay; it is not a claim that Relay can automatically infer what every future task will need."
      ], diagram: "projection" },
      { title: "Selection needs a rule, not just a shorter word count", paragraphs: [
        "Suppose the next action is to finish a report export. The session contains a JSON prototype, a later user correction to CSV, a failed parser test and an unrelated discussion of chart colours. The working set needs the current output format, required columns, artifact destination and verification step. The failed test should be linked as evidence; the chart discussion can stay in history. If the next action changes to designing the chart, the projection changes too.",
        "That rule is task-scoped relevance. It also has a precedence rule: a later explicit correction overrides an earlier proposal, but only for the scope stated. ‘CSV for this report’ should not turn into ‘always use CSV’. A durable preference, a temporary constraint and a single task decision should be represented differently, with source references where practical."
      ], example: { label: "Illustrative selection record", text: "Task: finish the approved report\nCurrent instruction: CSV for this report [event 42]\nRequired columns: date, account, amount [event 31]\nOpen work: export, parse saved bytes, validate header\nOmitted from working packet: chart discussion\nStill inspectable: full source session and failed export [event 39]" } },
      { title: "Budget the export without hiding omissions", paragraphs: [
        "The current Relay packet builder measures serialized UTF-8 bytes. It reserves required fields such as the goal, instructions, criteria and open work. Optional evidence is added while the packet fits, with an omission count when some evidence does not. If the required portion exceeds the limit, the builder errors instead of silently deleting an instruction. That is a defensible failure mode for a handoff contract.",
        "Bytes are only a transport budget. Tokenizers and model context policies differ. Even a packet that fits can carry prompt injection, stale claims or a misleading citation. Relay marks source text as untrusted and checks that cited events exist, but a reviewer still needs to verify that the cited event actually supports the instruction. Provenance makes a claim auditable; it does not make it true."
      ] },
      { title: "Measure omission cost, not compression ratio", paragraphs: [
        "A useful evaluation would seed tasks with known corrections, rejected approaches and unresolved questions. Prepare a working packet, then ask a fresh agent to state the next action and applicable constraints before it edits code. Compare that answer with a rubric written before the handoff. Record three failure classes: a required instruction missing from the packet, a present instruction ignored by the agent, and an unsupported inference added by the agent.",
        "Compression ratio alone says little about whether the task survived. The practical target is enough context for correct action, with evidence available when uncertainty matters. If the reviewer cannot distinguish a current decision from an old suggestion, the projection needs another pass."
      ] }
    ],
    sources: [
      { title: "Context Relay packet builder and byte-budget behavior", href: `${relay}/packages/relay/src/store.ts` },
      { title: "Context Relay checkpoint schema", href: `${relay}/packages/relay/src/model.ts` },
      { title: "Context Relay workbench and review workflow", href: `${relay}/docs/WORKSPACE.md` }
    ]
  },
  {
    slug: "decision-assumptions",
    title: "A staffing recommendation is a constraint check before it is a score",
    topic: "Decision systems · Operations engineering",
    description: "Inside the eligibility gates and greedy assignment heuristic of Build, Buy or Borrow.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A project needs four roles in six weeks. One internal candidate has the right skills but no capacity; another can learn the missing skill but needs mentoring. A contractor can start sooner at a higher delivery cost. A single ‘best option’ score is premature until those constraints are evaluated.",
        "I built Build, Buy or Borrow as a local planning tool for this kind of comparison. It takes a brief, internal talent data and cost assumptions, then generates build, hire, contractor and blended plans. The sample people and rates are fictional. The output is a scenario estimate, not a demonstrated reduction in hiring cost."
      ], diagram: "staffing" },
      { title: "What the engine actually computes", paragraphs: [
        "For an internal candidate, the engine compares required and recorded skills, estimates learning hours and weeks for gaps, computes readiness and sums delivery, learning, course and mentoring costs. Capacity, interest and maximum learning time are eligibility gates. A blend adds mentor capacity as another gate. External options use hiring or contractor assumptions rather than pretending every role can be developed in time.",
        "The assignment pass orders roles with fewer eligible internal candidates first. It then chooses candidates greedily and does not reuse the same person for another seat in that plan. This protects scarce matches from being taken by flexible roles, but it is a heuristic. It does not search all possible teams, so a feasible or cheaper global assignment can be missed. The interface should say ‘recommended under these assumptions,’ never ‘mathematically optimal.’"
      ], example: { label: "Decision pipeline, simplified from the current engine", text: "for each role: compute eligible internal candidates\norder roles by fewest eligible candidates\nassign candidates without reusing a person\nconstruct build / buy / borrow / blend plans\nreject plans missing roles, deadline, budget or mentor capacity\nscore remaining plans on cost, readiness and retained capability\nreturn recommendation + blockers for review" } },
      { title: "Feasibility precedes ranking", paragraphs: [
        "A plan can be cheap and still fail the start date. Another may fit the deadline but exceed the budget. The engine marks plans blocked when roles are unfilled, readiness is late, costs exceed the budget or mentoring capacity is insufficient. It ranks feasible plans using weighted cost, readiness and retained capability, with a strong lateness penalty in candidate scoring. Those weights encode a policy choice; a different studio may reasonably choose different priorities.",
        "The example portfolio scenario reports a blended plan for a fictional four-seat brief. Those numbers are useful for inspecting the arithmetic and UI. They should not be cited as real savings, and they cannot answer whether the skills inventory or salary assumptions match a real organisation."
      ] },
      { title: "The stress test is a changed assumption", paragraphs: [
        "I would test the engine with paired scenarios. Keep the people and role requirements fixed, move the start date forward, and assert that any newly late internal route becomes blocked or is explained. Then reduce mentoring capacity to zero and confirm that a blend requiring a mentor cannot remain feasible. Add a case with two roles competing for one scarce person to expose assignment order. These tests check invariants and explainability, not the realism of the input data.",
        "For workplace use, the missing layer is operational state: validated skill evidence, current availability, salary or vendor rates approved for use, and reservations across simultaneous projects. The local tool does not reserve a person between project scenarios. Two individually feasible plans may conflict in reality. A human should review the underlying data and record why a recommendation was accepted or overridden."
      ] }
    ],
    sources: [
      { title: "Build, Buy or Borrow calculation and assignment engine", href: `${staffing}/engine.js` },
      { title: "Build, Buy or Borrow constraint tests", href: `${staffing}/tests/engine.test.cjs` },
      { title: "Project scope and fictional example", href: `${staffing}/PORTFOLIO.md` }
    ]
  },
  {
    slug: "inference-latency",
    title: "The first token is not the whole response",
    topic: "AI engineering · Inference",
    description: "A measurement plan for queueing, prefill, decode and what the client actually sees.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "A model starts streaming in half a second, then spends ten seconds finishing a long answer. Another waits three seconds, then finishes almost immediately. Calling both ‘response time’ hides the experience and the bottleneck. I would measure first useful content and complete output separately before deciding what to optimise.",
        "For a typical autoregressive transformer, prefill processes the prompt and initializes attention state. Decode generates subsequent tokens conditioned on prior tokens. A key-value cache retains earlier attention keys and values so each step can reuse them. That mechanism explains why prompt length and generated length can affect different portions of a request. It does not mean the same latency profile holds for every model or serving stack."
      ], diagram: "latency" },
      { title: "Define clocks at the boundary you control", paragraphs: [
        "From the client, start a monotonic clock immediately before the request. Record the arrival of the first network event, the first non-empty answer content and the completed response. The first event may contain metadata rather than user-visible text; a stream chunk may carry multiple tokens. I would label the metric ‘time to first content’ unless I have tokenizer-aware instrumentation that truly identifies the first token.",
        "Client-visible first-content latency includes transport, server queueing, prefill and any output buffering. Server-side time to first token is a different measurement. Subtracting a client timestamp from an unsynchronised server clock is not a valid decomposition. To locate the wait, collect server queue and model timings separately, with a request identifier that joins both traces."
      ], example: { label: "Proposed measurements, not benchmark results", text: "t0 = client begins request\nt1 = first non-empty answer content reaches client\nt2 = complete answer reaches client\n\nfirst-content latency = t1 - t0\ncompletion latency    = t2 - t0\nstreaming tail        = t2 - t1\n\nKeep server queue / prefill / decode timings as separate spans." } },
      { title: "Run two controlled comparisons", paragraphs: [
        "First, hold the requested output and generation settings steady while varying prompt length. Then hold the prompt steady while varying the requested output length. Log actual input and output token counts, because a maximum-token setting is a ceiling, not a promise of equal-length generations. Record model revision, provider or hardware, sampling settings, concurrency and cache state. Separate cold starts from warm requests and retain the distribution of runs rather than one attractive number.",
        "Streaming can make the initial wait feel shorter without shortening the time needed for a complete structured response. If a workflow cannot act until it parses the final JSON object, completion latency is the relevant outcome. If the application can safely render partial prose, first-content latency may matter more. Track answer validity and failures alongside timings; a fast malformed response is not an improvement."
      ] },
      { title: "Optimise the measured bottleneck", paragraphs: [
        "If queueing dominates, changing prompt wording may have little effect on first content. If prefill dominates, inspect repeated or unnecessarily large input and whether the server supports a suitable reuse strategy. If decode dominates, limit needless output or consider a faster serving setup, then verify that answer quality remains acceptable. Each intervention should be evaluated against the span it is meant to change.",
        "This is a proposed experiment, not a published benchmark for Mahek's projects. I would publish the request set, configurations, raw timing records and failure counts before claiming that a change made inference faster."
      ] }
    ],
    sources: [
      { title: "Hugging Face Transformers — attention cache mechanics", href: "https://huggingface.co/docs/transformers/en/cache_explanation" },
      { title: "NVIDIA GenAI-Perf — latency metric definitions", href: "https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/perf_analyzer/genai-perf/README.html" },
      { title: "Hugging Face — prefill, decode and concurrent requests", href: "https://huggingface.co/blog/tngtech/llm-performance-prefill-decode-concurrent-requests" }
    ]
  },
  {
    slug: "verify-the-result",
    title: "A tool receipt is not a verified outcome",
    topic: "AI engineering · Verification",
    description: "Separate a completed call from an inspected artifact and a satisfied task contract.",
    date: "2026-10-30",
    sections: [
      { paragraphs: [
        "An agent asks a tool to save a CSV. The tool returns a path and a success status. The bytes at that path are JSON. The call returned; the task failed. This small failure mode appears in more consequential workflows too: an upload receipt says little about the deployed page, and a handoff acknowledgement says nothing about whether the destination completed the work.",
        "I use a three-part contract: define the expected artifact before execution, inspect the artifact after execution, and check the properties that matter to the user. The receipt is useful evidence about the attempted action, but it is only one stage in the chain."
      ], diagram: "verification" },
      { title: "Specify observable success first", paragraphs: [
        "For a report export, the contract might include the absolute destination, CSV encoding, exact header, row schema and a task-specific invariant such as nonnegative amounts. A verifier reads the saved bytes and parses them with a CSV library. It compares the header to the contract and checks the rows. A filename extension and a tool's success message are not substitutes for parsing.",
        "Verification has levels. A parse check proves the bytes are syntactically readable. A schema check proves they have the expected shape. A semantic check tests the task claim, such as totals reconciling with a trusted input. Stronger claims need stronger evidence; syntactic validity alone cannot prove the underlying numbers are right."
      ], example: { label: "Illustrative verifier logic; not a library API", text: "receipt = export_report(request)\nif not receipt.ok: return FAILED_CALL\n\nbytes = read_back(expected_path)\nif bytes unavailable: return UNVERIFIED\nrows = parse_csv(bytes)\nif parse failed or header != expected_header: return FAILED_ARTIFACT\nif totals(rows) != trusted_totals: return FAILED_SEMANTICS\nreturn VERIFIED_WITH_EVIDENCE(path, checksum, checks)" } },
      { title: "Unknown is a real state", paragraphs: [
        "If readback is unavailable, the system should report ‘unverified,’ not turn uncertainty into success. A useful failure record says which artifact was inspected, what was expected, what was observed and which check failed. That makes a retry or manual review possible without repeating the entire conversation.",
        "Retries must account for side effects. A local export can often be regenerated safely. Repeating an email, payment or publish operation may duplicate an external effect. Before retrying, check whether the first attempt already created the side effect and use an idempotency key or human review where the downstream API supports it. The verifier should not create a second effect just to discover the first."
      ] },
      { title: "Apply the same boundary to agent handoffs", paragraphs: [
        "Context Relay's accept operation checks packet identity, recipient, integrity and freshness, then records acknowledgement. That verifies a handoff boundary; it does not verify a coding outcome. The receiving agent still needs to inspect its repository, implement the change, run meaningful checks and report the commit or deployed version. Its completion evidence belongs to a later stage.",
        "For a website release, I would connect four pieces: the requested change, the merged code, a passing build and the live page. A successful build cannot prove the live deployment is current; a green deployment cannot prove the requested interaction works. Naming these states precisely makes status updates useful to the next person who has to act."
      ] },
      { title: "What I would instrument", paragraphs: [
        "A production workflow could keep a small verification record containing request ID, artifact URI, content hash, checker version, observed checks and final state. That is a proposed design, not a feature I am claiming is already in Relay. It would make an audit question answerable: which bytes did we inspect, with which rule, before we told someone the work was ready?"
      ] }
    ],
    sources: [
      { title: "Context Relay offer, packet and accept implementation", href: `${relay}/packages/relay/src/store.ts` },
      { title: "Context Relay MCP handoff contract", href: `${relay}/packages/relay/src/mcp.ts` },
      { title: "Context Relay workspace workflow", href: `${relay}/docs/WORKSPACE.md` }
    ]
  }
];

export function readingTime(note: Note) {
  const words = note.sections.flatMap(section => [...section.paragraphs, ...(section.bullets ?? []), section.example?.text ?? ""]).join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
