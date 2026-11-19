import type { DiagramId } from "../components/article-diagram";

export type Note = {
  slug: string;
  title: string;
  topic: string;
  description: string;
  date?: string;
  sections: {
    id: string;
    title?: string;
    label: string;
    paragraphs: string[];
    paragraphsAfterMedia?: string[];
    example?: { label: string; text: string };
    diagram?: DiagramId;
    media?: "architecture" | "demo" | "agent-latency" | "agent-cloud-workload";
    comparison?: { caption: string; columns: [string, string, string]; rows: [string, string, string][] };
    references?: { title: string; href: string }[];
  }[];
  sources: { title: string; href: string }[];
};

const sources = {
  agentSysBench: { title: "AgentSysBench paper", href: "https://arxiv.org/abs/2608.15127" },
  propagation: { title: "Context propagation documentation", href: "https://opentelemetry.io/docs/concepts/context-propagation/" },
  conventions: { title: "OpenTelemetry agent conventions", href: "https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md" },
  tail: { title: "The Tail at Scale", href: "https://research.google/pubs/the-tail-at-scale/" },
};

const agentCloudWorkloadNote: Note = {
  slug: "agent-cloud-workload",
  title: "An Agent Is Becoming a Cloud Workload",
  topic: "Agent infrastructure",
  description: "What has to survive when the process running it disappears?",
  sections: [
    {
      id: "when-the-worker-stops", label: "When the worker stops",
      paragraphs: [
        "Imagine a sales-report agent that reads a spreadsheet, calculates revenue, and drafts a summary. Before publishing, it pauses for your approval.",
        "You go for coffee. A deployment restarts the worker running the agent.",
        "When you return, the draft should still be there. The approval should still be pending. And if publishing had already started, the system should establish what happened before trying again.",
        "These are reasonable expectations. Meeting them takes quite a bit more than a good model response.",
        "That is why I find the move toward managed agent infrastructure interesting. OpenAI’s September 2026 Agents API launch packages a harness for long-running work, including context management, tools, and subagents. My reading: providers are increasingly selling the machinery that carries a task through to completion.",
      ],
    },
    {
      id: "harness-and-sandbox", label: "Harness and sandbox",
      paragraphs: [
        "For the report agent, I would start with a task ID and asynchronous execution: accept the job, expose its status, and let it continue independently of the browser connection. The user should be able to close the tab and return to the same work.",
        "Start with the harness: the software that runs the agent loop. It prepares context, calls the model, routes tool requests, receives results, and continues or pauses. This is the control plane, where execution is coordinated.",
        "The sandbox is the execution environment where code runs and working files live. A tool that queries a business API can run elsewhere; every tool call does not need a sandbox. Keeping these responsibilities separate makes it possible to replace a worker without losing the records needed to recover the task.",
      ],
      media: "agent-cloud-workload",
    },
    {
      id: "three-kinds-of-state", label: "Three kinds of state",
      paragraphs: [
        "The tricky part is deciding what “remembering the task” means.",
        "Context is what the model receives for its next decision: instructions, relevant messages, and tool results. Context compaction condenses earlier material to fit within the model’s context window. That helps a long conversation continue, but a summary saying “the report is ready” is not evidence that a file was saved.",
        "Execution state records where the workflow stands: calculations completed, draft saved at a particular location, approval pending. With durable execution, this progress survives the process running the work. Temporal, for example, uses a persisted event history to reconstruct workflow progress after a worker fails.",
        "There is another kind of state worth naming: effect state. Did the outside action actually happen? If the agent published the report, the publishing service’s record is the authority. Temporal’s agent-memory example makes this distinction explicit: remembered information, workflow progress, and external effects answer different questions.",
      ],
    },
    {
      id: "retrying-safely", label: "Retrying safely",
      paragraphs: [
        "That distinction becomes very practical when a request times out.",
        "Suppose the publishing service creates the report, but its response never reaches the agent. The agent sees a timeout. Retrying blindly could create a second report. Even a saved checkpoint cannot remove this uncertainty if the crash happened before success was recorded.",
        "An idempotency key can help: reuse one identifier for attempts at the same logical operation, and have the receiving service enforce duplicate protection. The key alone does nothing. The service’s implementation and retention rules matter; Stripe’s API documents both. If a tool offers no such guarantee, recovery needs a way to check whether the action already happened before repeating it.",
        "For our report agent, I would save the validated draft durably before requesting approval, tie the approval to that version, and use a stable operation ID when publishing. Temporary read failures could retry with backoff, meaning a delay that increases between attempts, plus a timeout and an attempt limit.",
      ],
    },
    {
      id: "access-and-limits", label: "Access and limits",
      paragraphs: [
        "The same care belongs around access and cost. Give the calculation sandbox only the files and permissions it needs. Keep publishing behind an explicit approval gate. Least privilege still matters inside a sandbox: generated code can access the credentials and network connections available to that environment.",
        "I would also set limits on run duration, tool calls, spending, and concurrency—how much work can run at once. Cancellation should stop new work and report actions already completed. Observability should connect model calls, tools, retries, and approval waits to the same task ID, so a developer can explain where time and money went.",
        "A polished paragraph is only part of success. For this task, success means a validated report, a saved artifact, the required approval, and confirmed publication.",
      ],
    },
    {
      id: "who-runs-the-runtime", label: "Who runs the runtime?",
      paragraphs: [
        "Who operates all of this is a separate decision. A managed harness takes on more orchestration and session management. Running an SDK inside your application gives your team more control over deployment, storage, and integration—and more operational responsibility. OpenAI’s runtime comparison separates those choices from where the sandbox runs.",
        "You can run your own orchestration while using a hosted model. You can also use a managed harness with your own execution environment. Either way, your product still defines who can access the data, which actions require approval, and what counts as finished.",
        "For me, that is the useful test of an agent architecture: can the work continue correctly after the worker disappears?",
        "The user who went for coffee should come back to the same task, with its progress intact and an honest account of what happened.",
      ],
    },
  ],
  sources: [
    { title: "OpenAI’s Agents API announcement", href: "https://openai.com/index/introducing-the-agents-api/" },
    { title: "Sandbox architecture", href: "https://developers.openai.com/api/docs/guides/agents/sandboxes" },
    { title: "Temporal event history", href: "https://docs.temporal.io/encyclopedia/event-history" },
    { title: "Agent memory, workflow state and external effects", href: "https://docs.temporal.io/ai/featured/memory-state-stripe" },
    { title: "Stripe’s idempotent requests", href: "https://docs.stripe.com/api/idempotent_requests" },
    { title: "Compare agent runtimes", href: "https://developers.openai.com/api/docs/guides/agents" },
  ],
};

const agentLatencyNote: Note = {
  slug: "agent-latency",
  title: "The Model Was Fast. Why Did the Agent Take 12 Seconds?",
  topic: "Agent performance",
  description: "An agent’s speed depends on how quickly it thinks, what it chooses to do, and what must wait for what.",
  sections: [
    {
      id: "model-time", label: "Model time vs. task time",
      paragraphs: [
        "A developer asks an AI assistant why checkout errors increased after a deployment. The assistant retrieves logs, checks the deployment history, and returns an explanation twelve seconds later.",
        "The monitoring dashboard reports three seconds of model calls.",
        "Nothing is necessarily wrong with either measurement. They describe different boundaries: one measures model requests; the other measures the experience of completing a task.",
        "That difference is easy to overlook when model benchmarks become our main reference for application performance.",
      ],
    },
    {
      id: "reconstruct-the-wait", title: "To improve the wait, first reconstruct it.", label: "Reconstruct the wait",
      paragraphs: [
        "Consider an illustrative workflow: the model spends one second choosing tools, the logs lookup takes five seconds, and the deployment lookup takes three. A second model call spends two seconds interpreting the results. Request handling, transport, and rendering account for the remaining second. These are example timings, not production measurements.",
      ],
      media: "agent-latency",
      paragraphsAfterMedia: [
        "Halving the duration of both model calls would reduce the total to 10.5 seconds, assuming the workflow and answer quality stayed the same. Even instantaneous model calls would leave nine seconds of other work.",
        "That calculation puts a limit on what a model-speed improvement alone can achieve.",
        "There is evidence for looking beyond inference. In the 2026 AgentSysBench preprint, researchers studied ten agentic applications and found that non-LLM components dominated latency in five. They also found that bottlenecks changed across workloads and deployments. The result supports measuring the whole application; it does not establish that tools dominate every agent.",
      ],
    },
    {
      id: "critical-path", title: "The sequence can matter as much as the speed of each step.", label: "The critical path",
      paragraphs: [
        "Our assistant fetches logs before fetching deployment details. If both requests already know the service and time window, neither needs to wait for the other.",
        "Running them together could reduce their combined wait from eight seconds to roughly five, bringing the example to nine seconds. That depends on the requests being independent and the services having capacity to handle both.",
        "If the logs reveal which deployment to inspect, the dependency is real. Parallel execution would be premature.",
        "This is the practical meaning of the critical path: the chain of dependent work that determines when the result can be ready. Improving a step helps completion time when it shortens that path. Simply adding every span’s duration is misleading when operations overlap or contain other spans.",
      ],
    },
    {
      id: "decisions", title: "But a slow tool call can also be evidence of a poor decision.", label: "Work the model creates",
      paragraphs: [
        "Suppose the model requests the same logs twice. Each lookup takes five seconds. The trace shows ten seconds of tool activity, but making the logs service faster is only one possible response. Preventing the duplicate request removes an entire lookup.",
        "This separates two questions: how much time did the model consume, and how much work did its choices create?",
        "A model that responds more slowly could still finish a task sooner by making fewer unnecessary calls. A faster model could lose its advantage through retries or an inefficient plan. Model comparisons should therefore include the complete workflow, with answer quality held to the same standard.",
      ],
    },
    {
      id: "traces", title: "A useful trace connects decisions to execution.", label: "Follow a request",
      paragraphs: [
        "A trace groups the operations belonging to a request. Each timed operation is a span. To follow work across services, instrumentation propagates identifiers so downstream operations can be connected to their parents. OpenTelemetry commonly uses the W3C traceparent HTTP header for this.",
        "For our assistant, I would inspect the model’s selected tool arguments alongside the tool’s duration and result. Did the query search the right time window? Did the result supply new evidence? Did it cause another necessary step?",
        "A five-second tool span alone cannot answer those questions. Nor does it reveal how much time the remote service spent in its database. That requires further instrumentation. A model-call span similarly includes whatever the client observes, potentially including transport and provider waiting, rather than just GPU computation.",
      ],
    },
    {
      id: "observability-tools", title: "The tools provide different parts of this visibility.", label: "Observability tools",
      paragraphs: [
        "LangSmith records operations as runs, groups related runs into traces, and exposes nested execution details such as timing, retries, inputs, and outputs. Its trajectory view presents the sequence of messages and actions across a session. That makes it useful for examining both the route an agent chose and the time spent following it.",
        "Agent Zero is an agent framework. Its community Langfuse Observability plugin adds tracing for model calls, tool executions, and agent interactions, with a trace viewer inside Agent Zero. Langfuse provides the observability backend in that arrangement.",
        "OpenTelemetry’s GenAI semantic conventions supply shared names and meanings for the telemetry. Examples include invoke_agent, execute_tool, gen_ai.request.model, and token-usage fields. The conventions also define metrics for operations such as model calls. They describe the data; instrumentation produces it and a backend displays it. HTTP, database, queue, and browser measurements still need their own coverage. These conventions continue to evolve.",
      ],
    },
    {
      id: "measure-again", title: "One clean trace is the start of an investigation.", label: "Measure again",
      paragraphs: [
        "Production requests vary. A tool that is usually quick may occasionally stall, and an agent waiting for several required results inherits the slowest response. This is a familiar distributed-systems problem: Dean and Barroso’s The Tail at Scale explains how occasional delays can become significant as services grow more complex. The same concern applies when an agent coordinates several services.",
        "After a change, compare the same task set under comparable load and cache conditions. Track correctness and failures alongside median completion time and a high percentile such as p95—the point by which roughly 95% of measured requests finish. Keep timeouts visible rather than dropping them from the comparison.",
        "Measure from submission to a useful result as well as to completion. Streaming can deliver useful evidence earlier, but an immediate “I’m checking” message does not mean the investigation finished sooner.",
        "The most valuable outcome of observability is an explanation you can test: this query was too broad, this lookup was repeated, or these two operations waited unnecessarily. Once the delay has a cause, the next performance change becomes a reasoned choice.",
      ],
    },
  ],
  sources: Object.values(sources),
};

export const relaySource = "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7";

export const notes: Note[] = [
  agentCloudWorkloadNote,
  agentLatencyNote,
  {
    slug: "context-relay",
    title: "Context Relay: carrying a coding task across agents",
    topic: "Engineering Context Relay",
    description: "Why a fresh coding session loses the thread, and how native capture, reviewed checkpoints and MCP make a handoff inspectable.",
    date: "2026-10-30",
    sections: [
      {
        id: "the-problem", title: "The conversation grows. The task state gets harder to find.", label: "The problem",
        paragraphs: [
          "You have spent an afternoon in a coding thread. The first approach failed. A requirement changed. The tests caught a regression. Now the conversation is large enough that you want a fresh session, perhaps in another coding agent. The repository contains the edits, but it does not contain every decision that explains them. You have to reconstruct the task before the next agent can continue.",
          "Consider a retention feature. The initial request says thirty days; a later correction says seven. The thread also contains an unsuccessful cleanup query and a reminder to test timezone boundaries. A handoff that says ‘implement retention’ loses the correction. Copying everything preserves it, but asks the next session to distinguish current instructions from abandoned work again.",
          "I built Context Relay around that transition. It turns selected history into a reviewed, versioned handoff: the current goal, cited instructions, acceptance criteria and unfinished work. This article follows the npm beta's implementation, including the checks that make a packet usable and the limits those checks cannot remove."
        ]
      },
      {
        id: "architecture", title: "One local service, two integration paths", label: "Architecture",
        paragraphs: [
          "The package ships a CLI, browser workbench, local service, SQLite store and MCP server. The CLI and UI operate on the same local state. Native capture adapters import session history; the MCP server exposes reviewed state to a receiving agent. These paths meet at the service, but they have different responsibilities.",
          "That separation matters because an MCP connection does not expose a host's entire conversation. The host controls what a server receives. Relay therefore needs explicit capture integrations to read history, while MCP gives the destination a standard interface for inspecting a handoff. The protocol standardizes access; Relay's checkpoint and packet schemas define the meaning of the transferred state.",
          "The service binds to loopback and authenticates requests. Working files remain in the repository; packets carry paths and digests. SQLite holds the captured evidence and reviewed records. This keeps the default workflow local and makes its boundaries visible before any optional model request."
        ],
        media: "architecture",
        references: [
          { title: "README architecture", href: `${relaySource}/README.md#where-mcp-fits` },
          { title: "MCP host and server boundaries", href: "https://modelcontextprotocol.io/specification/2025-06-18/architecture" }
        ]
      },
      {
        id: "capture", title: "Capture history without rewriting it", label: "Native capture",
        paragraphs: [
          "Each harness has a different history surface. Claude Code uses project-filtered JSONL. Codex uses read-only app-server JSON-RPC for completed turns. OpenCode exposes session and message endpoints over a loopback API. Goose provides CLI JSON export. Relay normalizes completed, visible messages and tool results into events with a source identity and role.",
          "Imports are project-scoped and transactional. Repeating a capture is idempotent; a changed event under an already captured ID is rejected rather than silently replacing its evidence. Sessions have revisions so a checkpoint can name the captured state it reviewed. Reasoning blocks and unfinished assistant turns are excluded.",
          "This is where portability costs engineering work. An adapter must validate the native format, match the project root and report partial failures. A common MCP interface cannot make those upstream formats identical. Relay has format and transport tests for all four paths, but those tests do not certify every installed harness version."
        ],
        references: [{ title: "Capture contracts and compatibility limits", href: `${relaySource}/docs/HARNESS_CONNECTIONS.md` }]
      },
      {
        id: "checkpoint", title: "Make the checkpoint the unit of review", label: "Checkpoint contract",
        paragraphs: [
          "A checkpoint separates decisions from the events supporting them. An instruction has a stable key, current text and citations to source events. The checkpoint also records the goal, criteria, open work, source revisions and selected repository files. The reviewer can inspect an instruction beside its evidence before saving an immutable snapshot.",
          "The store rejects citations outside the selected sessions and references to missing events. It also rejects duplicate instruction keys. When two parent checkpoints assign different text to the same key, a merge requires an explicit resolution matching the new instruction. The result records its parents and resolution; the original checkpoints remain intact.",
          "These rules validate provenance and consistency. They cannot decide whether a cited sentence actually supports an interpretation. That judgment remains part of review. A plausible summary with incorrect citations should never become authoritative just because its JSON parses."
        ],
        example: { label: "Illustrative instruction using Relay's actual schema", text: '{\n  "key": "retention-days",\n  "text": "Retain records for seven days.",\n  "sources": [\n    { "sessionId": "session-a", "eventId": "user-correction-7" }\n  ]\n}' },
        diagram: "projection",
        references: [{ title: "Checkpoint schema and validation", href: `${relaySource}/packages/relay/src/model.ts` }]
      },
      {
        id: "packet", title: "Bound the packet without deleting the contract", label: "Packet budget",
        paragraphs: [
          "A checkpoint is the reviewed record; a packet is its bounded continuation view. The packet contains the goal, instructions, criteria, open work, source references, file digests, Git state and a trust notice. Its default budget is 24,000 UTF-8 bytes, measured after canonical serialization.",
          "The builder first checks whether required fields fit. If they exceed the budget, it returns an error asking for a narrower checkpoint. It then tries each selected evidence item in order, retaining it when the packet fits and counting omissions otherwise. An oversized item can be skipped while a later, smaller one still fits. A final size check accounts for the omission counter itself.",
          "This makes the budget policy inspectable. It also leaves a deliberate limitation: bytes are a transport bound, not a tokenizer-specific context budget. The receiving harness still controls prompt assembly. Source text and tool results remain untrusted data, even when a reviewed packet references them."
        ],
        references: [{ title: "packet() and its budget checks", href: `${relaySource}/packages/relay/src/store.ts` }]
      },
      {
        id: "handoff", title: "Recheck state at the handoff boundary", label: "Freshness and MCP",
        paragraphs: [
          "Before offering a packet, Relay compares the recorded session revisions, selected file SHA-256 values and Git HEAD with current local state. Acceptance checks freshness again, along with recipient and packet integrity. If relevant state changed between review and acceptance, the destination cannot acknowledge the stale offer as current.",
          "The destination uses relay_handoff_inspect to read an addressed handoff and relay_handoff_accept to acknowledge it. Other MCP tools expose captured source events and bounded checkpoint packets; a checkpoint resource and continuation prompt support inspection. Each server connection is scoped to a project and receiving harness. Acceptance records delivery, while implementation and result verification remain work for the receiving session.",
          "Freshness only covers what Relay can observe. New native messages are invisible until recaptured. Unselected files are outside the file-digest check. A Git HEAD match does not prove an entire working tree is unchanged. The practical sequence is to capture again, review the relevant files and create a new checkpoint when the task state moves."
        ],
        diagram: "handoff",
        references: [{ title: "MCP tools and project scoping", href: `${relaySource}/packages/relay/src/mcp.ts` }]
      },
      {
        id: "model-proposals", title: "Use a model to propose the handoff", label: "Optional Nebius",
        paragraphs: [
          "Manual review works without an API key. Nebius Token Factory can draft a checkpoint from explicitly selected evidence. The UI previews the exact redacted payload, requests consent and returns the model output to the editor. Applying a proposal requires review again; it does not create or accept a checkpoint by itself.",
          "The request is bounded to forty events and 48,000 input bytes, with a thirty-second timeout. Responses must satisfy the schema, use unique instruction keys and cite only selected events. Malformed or truncated output is rejected, and there are no automatic retries. These checks contain structural failures; they do not establish that the model chose the right decisions. That is why the review step stays in the path."
        ],
        references: [{ title: "Provider data flow and limits", href: `${relaySource}/docs/WORKSPACE.md#nebius-proposals` }]
      },
      {
        id: "demo", title: "Follow one correction through the workbench", label: "Watch and try it",
        paragraphs: [
          "The README recording follows the seven-day retention correction from a captured Claude Code thread into review and a Codex handoff. It uses the actual npm workspace with synthetic sessions. Watch which source event supports the instruction, then inspect what appears in the exported packet. The recording demonstrates the handoff UI; it does not include a live model call or completed coding task.",
          "With Node 22.16 or later, run the pinned beta below. The demo creates its own synthetic project. The dedicated data directory keeps this walkthrough separate from other Relay experiments; use the same path on each command. In the UI, open Threads, review the correction, choose a recipient and inspect the offered handoff."
        ],
        media: "demo",
        example: { label: "Run the README demo from npm", text: 'npx @mahekara28/context-relay@0.3.0-beta.1 demo --data-dir ./relay-demo\nnpx @mahekara28/context-relay@0.3.0-beta.1 ui --data-dir ./relay-demo\n\n# Stop the walkthrough service when finished.\nnpx @mahekara28/context-relay@0.3.0-beta.1 stop --data-dir ./relay-demo' },
        references: [
          { title: "Interactive project tour", href: "https://mahekara28.github.io/context-relay/" },
          { title: "How the recording was produced", href: `${relaySource}/docs/assets/workspace/README.md` },
          { title: "Reproduce the capture", href: `${relaySource}/scripts/npm/render-demo.mjs` }
        ]
      },
      {
        id: "evaluation", title: "The remaining question is continuation quality", label: "What is proven",
        paragraphs: [
          "The release documents Node tests for imports, provenance, conflicts, budgets, stale state and recipient checks, plus real transport and browser workflows. Those establish behavior at the software boundaries. A successful packet transfer still leaves the harder question open: does a fresh agent complete the task more accurately or with less repeated work?",
          "I would evaluate that with repository tasks containing known corrections and rejected approaches. Compare a raw transcript, a conventional summary and a reviewed Relay packet using the same starting commit, harness and acceptance tests. Measure task success, lost constraints, unsupported assumptions, reviewer time and token use. Repeat across tasks and report failures alongside successful runs.",
          "Relay's current contribution is an inspectable handoff contract. It preserves decisions with evidence, surfaces stale state and gives different harnesses a common entry point. The next proof should come from measured continuation outcomes."
        ],
        references: [{ title: "Release verification and untested boundaries", href: `${relaySource}/docs/releases/NPM_VERIFICATION.md` }]
      }
    ],
    sources: [
      { title: "Context Relay npm beta README and recorded demo", href: `${relaySource}/README.md` },
      { title: "Checkpoint, packet, offer and acceptance implementation", href: `${relaySource}/packages/relay/src/store.ts` },
      { title: "Checkpoint and packet types", href: `${relaySource}/packages/relay/src/model.ts` },
      { title: "Project-scoped MCP server", href: `${relaySource}/packages/relay/src/mcp.ts` },
      { title: "Capture adapters and harness compatibility", href: `${relaySource}/docs/HARNESS_CONNECTIONS.md` },
      { title: "Workspace operations and optional model proposals", href: `${relaySource}/docs/WORKSPACE.md` },
      { title: "MCP architecture specification", href: "https://modelcontextprotocol.io/specification/2025-06-18/architecture" }
    ]
  },
  {
    slug: "inference-provider-evaluation",
    title: "How I would compare inference providers for a real workload",
    topic: "Inference field notes",
    description: "A practical test for latency, cost and deployment fit, with a source-backed map of Simplismart, Modal and Baseten.",
    date: "2026-11-20",
    sections: [
      {
        id: "the-decision", title: "A faster model demo is not yet a buying decision", label: "The decision",
        paragraphs: [
          "An inference vendor can show an impressive latency number and still leave the buyer's hardest question unanswered: will this deployment meet our response-time target when the real traffic arrives, in the place our data is allowed to run, at a cost we can sustain? One median latency number cannot answer all three.",
          "I started this comparison while studying how inference platforms describe themselves. Simplismart's published Ema case study reports a drop from 10 seconds to 0.9 seconds in median end-to-end routing latency after changes to batching, scheduling, kernels and scaling. That is a useful account of one customer's workload. It is not a controlled benchmark against another provider, and I would not present it as one.",
          "A founder or buyer needs a decision record: the workload, the constraints, the options that qualify, the measurement method and the unresolved risks. The rest of this note is the evaluation I would use to produce that record."
        ],
        references: [{ title: "Simplismart's Ema case study", href: "https://simplismart.ai/case-study/from-10-seconds-to-1-how-ema-made-agentic-routing-feel-instant-with-simplismart" }]
      },
      {
        id: "request-path", title: "First, separate the time spent waiting from the time spent generating", label: "Request path",
        paragraphs: [
          "For a streaming language model, the user sees a request path: network and gateway, admission or queue, prefill of the input, then token-by-token decode. Time to first token captures the wait until output begins; inter-token latency describes the pace after that. End-to-end latency includes the whole request. Those quantities change differently as load rises.",
          "The measurement boundary matters. vLLM can report server-side queue time and time to first token after scheduling, while a client timer includes network and any time before the server admits the request. For a cross-provider comparison I would use the same client-side timer for every endpoint and treat server metrics as diagnostic evidence when available. I would record p50 and p95, not just a single mean.",
          "A burst adds another path: if no suitable replica is ready, the request waits for scale-up or fails. Keeping a warm replica reduces that risk but changes the bill. A fair comparison therefore measures steady traffic, a burst, and the first request after idle separately."
        ],
        diagram: "inference",
        references: [
          { title: "vLLM per-request timing definitions", href: "https://docs.vllm.ai/en/latest/features/per_request_metrics/" },
          { title: "Modal on warm capacity and scale to zero", href: "https://modal.com/docs/guide/scale" }
        ]
      },
      {
        id: "workload-contract", title: "Write the workload contract before opening a pricing page", label: "Workload contract",
        paragraphs: [
          "Here is an illustrative support-copilot brief, not measured customer traffic: a fixed model and revision; a representative distribution of 1,200-token inputs and 180-token outputs; four requests per second normally, with a short twenty-request-per-second peak; streaming responses; a p95 first-token target and a p95 completion target; and a requirement to keep prompts in a specified cloud account. The exact thresholds would come from the product owner. The point is to make them explicit before testing.",
          "The run record should keep model revision, tokenizer, sampling settings, precision, hardware, prompt set, output lengths, request arrival pattern, concurrency, region and deployment mode. If two providers cannot run the same model or the same data boundary, I would compare product fit and operating responsibilities, not publish a latency ranking. Different models can be a separate quality-versus-cost decision, but they are not a clean serving comparison.",
          "vLLM's benchmark tooling supports controlled request rates, concurrency limits and burstiness. For a hosted endpoint, the client may need a separate load generator, but the principle is the same: use the same arrival trace, warm-up policy and success criteria for each eligible path. Keep failed and throttled requests in the results."
        ],
        references: [{ title: "vLLM benchmark load patterns", href: "https://docs.vllm.ai/en/latest/benchmarking/cli/" }]
      },
      {
        id: "market-map", title: "Compare operating boundaries before claiming a winner", label: "Market map",
        paragraphs: [
          "Public documentation establishes a useful first cut. Simplismart offers shared and dedicated serving, managed infrastructure inside a customer's cloud, and an imported Kubernetes path. Modal documents shared and dedicated endpoints on Modal-managed capacity, with configurable scale-to-zero for dedicated endpoints. Baseten describes managed cloud, dedicated and self-hosted deployments in a customer's VPC. These are vendor descriptions of available paths, not proof that any one path is faster for the same task.",
          "This matters for positioning. 'We support BYOC' alone is not a defensible distinction when another provider offers self-hosted deployment. The sharper question is what the team owns in each mode: cluster provisioning, model optimization, autoscaling policy, observability, support and the commercial commitment. Simplismart's own BYOC guide distinguishes its managed-cluster path from importing an existing cluster; that difference belongs in the buyer's evaluation."
        ],
        comparison: {
          caption: "Public product paths as of 20 November 2026. Capability and contract details should be confirmed in a vendor trial.",
          columns: ["Platform", "Documented deployment paths", "Question to resolve"],
          rows: [
            ["Simplismart", "Shared, dedicated, managed BYOC, imported Kubernetes", "Who owns node scaling, optimization and incident response in the chosen mode?"],
            ["Modal", "Shared and dedicated endpoints on managed capacity", "How do warm replicas and scale-to-zero affect p95 and monthly cost?"],
            ["Baseten", "Managed cloud, dedicated and self-hosted VPC", "Which data and control-plane boundaries apply to the proposed contract?"]
          ]
        },
        references: [
          { title: "Simplismart BYOC operating modes", href: "https://simplismart.ai/blog/byoc-ai-infrastructure" },
          { title: "Modal endpoint modes", href: "https://modal.com/docs/guide/endpoints" },
          { title: "Baseten deployment boundaries", href: "https://www.baseten.co/security/" }
        ]
      },
      {
        id: "economic-test", title: "Count qualified requests, not only cheap tokens", label: "Economic test",
        paragraphs: [
          "For each candidate, I would report successful requests per second that satisfy both latency targets. That is the useful throughput for this product, rather than raw generated tokens per second. My working cost measure is total inference spend during the observation window divided by the number of successful, target-compliant requests. The numerator includes token or compute charges, warm capacity, platform fees and any separately billed supporting infrastructure. The denominator excludes errors and requests that miss the agreed target, but the report still shows those failures explicitly.",
          "That calculation should be repeated at normal load, peak load and after idle. A low per-token price can coexist with high queue delay. An always-warm deployment can have excellent response time and poor utilization. A scale-to-zero path can look cheap until cold-start failures are counted. The right result is a feasible region: which options meet the workload contract, and at what fully loaded cost?",
          "I made a blank run sheet for this analysis. It records assumptions, measured p50 and p95 values, errors, spend, evidence links and open questions in one row per run. It contains no invented benchmark results."
        ],
        example: { label: "Decision metric, computed for each comparable run", text: "qualified_request_cost = total_inference_spend / successful_requests_meeting_both_latency_targets\n\nReport alongside: error rate, p95 first-token time, p95 end-to-end time, and qualified requests per second." },
        references: [
          { title: "Download the blank inference run sheet", href: "/downloads/inference-run-sheet.csv" },
          { title: "vLLM goodput and latency metrics", href: "https://docs.vllm.ai/en/latest/benchmarking/cli/" }
        ]
      },
      {
        id: "founder-brief", title: "What I would hand the founder", label: "Founder brief",
        paragraphs: [
          "My one-page brief would start with the customer workload and the decision deadline. It would show the eligible deployment paths, a link to each measured run, the cost per qualified request, and the reason any option was excluded. It would end with one recommendation and the next experiment needed to reduce uncertainty. No traffic trace, no comparable result: no winner.",
          "For Simplismart, the first research hypothesis I would test is whether buyers with bursty traffic and a fixed data perimeter value one team that can tune serving and operate the deployment across their chosen infrastructure. The Ema case study and the BYOC guide make that a plausible positioning angle, but it remains a hypothesis until customer interviews and matched trials test it. A small, evidence-led operating process would give the founding team a better answer than another generic comparison chart."
        ],
        references: [
          { title: "Simplismart's infrastructure thesis", href: "https://simplismart.ai/blog/nvidia-backs-our-14m-series-b" },
          { title: "Simplismart's Ema case study", href: "https://simplismart.ai/case-study/from-10-seconds-to-1-how-ema-made-agentic-routing-feel-instant-with-simplismart" }
        ]
      }
    ],
    sources: [
      { title: "Simplismart: Ema routing case study", href: "https://simplismart.ai/case-study/from-10-seconds-to-1-how-ema-made-agentic-routing-feel-instant-with-simplismart" },
      { title: "Simplismart: BYOC infrastructure modes", href: "https://simplismart.ai/blog/byoc-ai-infrastructure" },
      { title: "Simplismart: platform and inference positioning", href: "https://simplismart.ai/blog/nvidia-backs-our-14m-series-b" },
      { title: "Modal: shared and dedicated endpoints", href: "https://modal.com/docs/guide/endpoints" },
      { title: "Modal: autoscaling and warm capacity", href: "https://modal.com/docs/guide/scale" },
      { title: "Baseten: managed, dedicated and self-hosted deployment", href: "https://www.baseten.co/security/" },
      { title: "vLLM: per-request metrics", href: "https://docs.vllm.ai/en/latest/features/per_request_metrics/" },
      { title: "vLLM: benchmark load patterns", href: "https://docs.vllm.ai/en/latest/benchmarking/cli/" }
    ]
  }
];

export function readingTime(note: Note) {
  const words = note.sections.flatMap(section => [section.title ?? "", ...section.paragraphs, ...(section.paragraphsAfterMedia ?? []), section.example?.text ?? ""]).join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
