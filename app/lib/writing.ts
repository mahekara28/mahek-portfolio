import type { DiagramId } from "../components/article-diagram";

export type Note = {
  slug: string;
  title: string;
  topic: string;
  description: string;
  date: string;
  sections: {
    id: string;
    title: string;
    label: string;
    paragraphs: string[];
    example?: { label: string; text: string };
    diagram?: DiagramId;
    media?: "architecture" | "demo";
    references?: { title: string; href: string }[];
  }[];
  sources: { title: string; href: string }[];
};

export const relaySource = "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7";

export const notes: Note[] = [
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
  }
];

export function readingTime(note: Note) {
  const words = note.sections.flatMap(section => [section.title, ...section.paragraphs, section.example?.text ?? ""]).join(" ").trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
