type DiagramId = "relay" | "projection" | "staffing" | "latency" | "verification";

type Node = { x: number; y: number; w: number; h: number; tag: string; title: string; detail: string; tone?: "mint" | "rose" | "sand" };
type Edge = { x1: number; y1: number; x2: number; y2: number; label?: string; dashed?: boolean };
type Diagram = { title: string; description: string; caption: string; source: { label: string; href: string }; nodes: Node[]; edges: Edge[] };

const relaySource = "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/packages/relay/src/store.ts";

const diagrams: Record<DiagramId, Diagram> = {
  relay: {
    title: "Context Relay capture and handoff architecture",
    description: "Four native harness histories enter explicit capture adapters and a local event store. A reviewer creates a checkpoint and bounded packet. The receiving harness reads it through a project-scoped MCP server. Capture and MCP are separate paths.",
    caption: "Capture reads native histories; MCP exposes the reviewed handoff. The destination does not inherit the source chat automatically.",
    source: { label: "Relay architecture and connections", href: "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/docs/HARNESS_CONNECTIONS.md" },
    nodes: [
      { x: 20, y: 48, w: 155, h: 82, tag: "SOURCE", title: "Native sessions", detail: "4 harness histories" },
      { x: 226, y: 48, w: 155, h: 82, tag: "CAPTURE", title: "Adapters", detail: "explicit project sync", tone: "mint" },
      { x: 432, y: 48, w: 155, h: 82, tag: "LOCAL", title: "Event store", detail: "events + revisions", tone: "mint" },
      { x: 432, y: 210, w: 155, h: 82, tag: "REVIEW", title: "Checkpoint", detail: "goal + cited decisions", tone: "sand" },
      { x: 226, y: 210, w: 155, h: 82, tag: "EXPORT", title: "Bounded packet", detail: "digest + omissions", tone: "sand" },
      { x: 20, y: 210, w: 155, h: 82, tag: "DESTINATION", title: "MCP tools", detail: "inspect + accept", tone: "rose" },
    ],
    edges: [
      { x1: 175, y1: 89, x2: 226, y2: 89, label: "read" },
      { x1: 381, y1: 89, x2: 432, y2: 89, label: "append" },
      { x1: 510, y1: 130, x2: 510, y2: 210, label: "cite" },
      { x1: 432, y1: 251, x2: 381, y2: 251, label: "pack" },
      { x1: 226, y1: 251, x2: 175, y2: 251, label: "offer" },
    ],
  },
  projection: {
    title: "Task-scoped working context projection",
    description: "A task objective and source events feed a reviewed selection. Corrections, constraints and open work form a bounded packet. Original events remain available for inspection. Evidence may be omitted to satisfy the byte budget, but required fields must fit.",
    caption: "A working packet is a task-scoped view over source history, with a route back to cited events.",
    source: { label: "Packet construction in Relay", href: relaySource },
    nodes: [
      { x: 20, y: 40, w: 170, h: 78, tag: "INPUT A", title: "Current task", detail: "action + constraints", tone: "rose" },
      { x: 20, y: 218, w: 170, h: 78, tag: "INPUT B", title: "Source events", detail: "revisions + citations" },
      { x: 284, y: 129, w: 170, h: 78, tag: "REVIEW", title: "Select + resolve", detail: "scope + conflicts", tone: "sand" },
      { x: 548, y: 129, w: 170, h: 78, tag: "OUTPUT", title: "Working packet", detail: "fields + evidence", tone: "mint" },
    ],
    edges: [
      { x1: 190, y1: 79, x2: 284, y2: 158, label: "focus" },
      { x1: 190, y1: 257, x2: 284, y2: 178, label: "cite" },
      { x1: 454, y1: 168, x2: 548, y2: 168, label: "budget" },
      { x1: 548, y1: 222, x2: 202, y2: 263, label: "inspect source", dashed: true },
    ],
  },
  staffing: {
    title: "Build Buy or Borrow decision pipeline",
    description: "A project brief, talent data and cost assumptions feed eligibility gates. The engine assigns scarce roles with a greedy heuristic, checks plan feasibility, scores eligible plans and presents a recommendation for human review.",
    caption: "Eligibility and feasibility are gates. The final score ranks plans that survive those gates; the assignment is a heuristic.",
    source: { label: "Planning engine source", href: "https://github.com/mahekara28/build-buy-borrow/blob/bd642ab465fa10c5487707cde4e46c0ed0495912/engine.js" },
    nodes: [
      { x: 16, y: 124, w: 129, h: 90, tag: "INPUT", title: "Brief + team", detail: "skills + dates" },
      { x: 185, y: 124, w: 129, h: 90, tag: "GATE 1", title: "Eligibility", detail: "capacity + skill", tone: "sand" },
      { x: 354, y: 124, w: 129, h: 90, tag: "ASSIGN", title: "Scarce first", detail: "greedy, no reuse", tone: "mint" },
      { x: 523, y: 124, w: 129, h: 90, tag: "GATE 2", title: "Feasibility", detail: "budget + deadline", tone: "sand" },
      { x: 692, y: 124, w: 129, h: 90, tag: "OUTPUT", title: "Ranked plans", detail: "human review", tone: "rose" },
    ],
    edges: [
      { x1: 145, y1: 169, x2: 185, y2: 169 },
      { x1: 314, y1: 169, x2: 354, y2: 169 },
      { x1: 483, y1: 169, x2: 523, y2: 169 },
      { x1: 652, y1: 169, x2: 692, y2: 169 },
    ],
  },
  latency: {
    title: "Autoregressive response latency timeline",
    description: "The client request begins at t0. Network, server queue and prompt prefill precede first answer content at t1. Autoregressive decode produces later tokens until response completion at t2. First-content latency spans t0 to t1; total latency spans t0 to t2.",
    caption: "Client-visible first content includes network and queue time. Server-only model timings need separate instrumentation.",
    source: { label: "Cache mechanics", href: "https://huggingface.co/docs/transformers/en/cache_explanation" },
    nodes: [
      { x: 20, y: 111, w: 128, h: 90, tag: "CLIENT", title: "Request", detail: "t0 · send", tone: "rose" },
      { x: 178, y: 111, w: 128, h: 90, tag: "TRANSPORT", title: "Network", detail: "connect · transfer" },
      { x: 336, y: 111, w: 128, h: 90, tag: "SERVER", title: "Queue", detail: "wait for capacity", tone: "sand" },
      { x: 494, y: 111, w: 128, h: 90, tag: "MODEL", title: "Prefill", detail: "prompt → KV cache", tone: "mint" },
      { x: 652, y: 111, w: 128, h: 90, tag: "MODEL", title: "Decode", detail: "t1 → tokens → t2", tone: "mint" },
    ],
    edges: [
      { x1: 148, y1: 156, x2: 178, y2: 156 },
      { x1: 306, y1: 156, x2: 336, y2: 156 },
      { x1: 464, y1: 156, x2: 494, y2: 156 },
      { x1: 622, y1: 156, x2: 652, y2: 156 },
    ],
  },
  verification: {
    title: "Verification states after a tool action",
    description: "The request contract leads to an attempted action and tool receipt. Readback inspects the resulting artifact. Format and semantic checks decide whether to release, fail, or leave the result unverified. A receipt alone cannot establish success.",
    caption: "A receipt proves a call returned. Readback and task-specific checks establish whether the requested artifact exists and is usable.",
    source: { label: "Relay handoff checks", href: relaySource },
    nodes: [
      { x: 20, y: 126, w: 136, h: 84, tag: "CONTRACT", title: "Expected", detail: "path + schema" },
      { x: 192, y: 126, w: 136, h: 84, tag: "ACTION", title: "Tool call", detail: "possible effect", tone: "sand" },
      { x: 364, y: 126, w: 136, h: 84, tag: "EVIDENCE 1", title: "Receipt", detail: "returned status", tone: "rose" },
      { x: 536, y: 126, w: 136, h: 84, tag: "EVIDENCE 2", title: "Readback", detail: "bytes + parse", tone: "mint" },
      { x: 708, y: 126, w: 136, h: 84, tag: "GATE", title: "Release / fail", detail: "or unverified", tone: "mint" },
    ],
    edges: [
      { x1: 156, y1: 168, x2: 192, y2: 168 },
      { x1: 328, y1: 168, x2: 364, y2: 168 },
      { x1: 500, y1: 168, x2: 536, y2: 168 },
      { x1: 672, y1: 168, x2: 708, y2: 168 },
    ],
  },
};

export function ArticleDiagram({ id }: { id: DiagramId }) {
  const diagram = diagrams[id];
  const width = { relay: 610, projection: 740, staffing: 840, latency: 800, verification: 860 }[id];
  const compact = id === "staffing" || id === "latency" || id === "verification";
  const height = id === "relay" ? 316 : compact ? 230 : 336;
  return <figure className="md-architecture">
    <p className="md-architecture-hint">Swipe or scroll the diagram to inspect every stage.</p>
    <div className="md-architecture-scroll" tabIndex={0} role="region" aria-label={`${diagram.title} diagram; scroll horizontally on small screens`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`} xmlns="http://www.w3.org/2000/svg">
        <title id={`${id}-title`}>{diagram.title}</title>
        <desc id={`${id}-description`}>{diagram.description}</desc>
        <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
        <g transform={compact ? "translate(0 -54)" : undefined}>
          {diagram.edges.map((edge, index) => <g key={index} className="md-diagram-edge">
            <path d={`M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`} markerEnd={`url(#${id}-arrow)`} strokeDasharray={edge.dashed ? "5 5" : undefined} />
            {edge.label && <text x={(edge.x1 + edge.x2) / 2} y={(edge.y1 + edge.y2) / 2 - 10} textAnchor="middle" className="md-diagram-edge-label">{edge.label}</text>}
          </g>)}
          {diagram.nodes.map(node => <g key={node.tag + node.title} className={`md-diagram-node md-diagram-node--${node.tone ?? "plain"}`}>
            <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="8" />
            <text x={node.x + 12} y={node.y + 20} className="md-diagram-tag">{node.tag}</text>
            <text x={node.x + 12} y={node.y + 45} className="md-diagram-title">{node.title}</text>
            <text x={node.x + 12} y={node.y + 65} className="md-diagram-detail">{node.detail}</text>
          </g>)}
        </g>
      </svg>
    </div>
    <figcaption>{diagram.caption} <a href={diagram.source.href} target="_blank" rel="noreferrer">{diagram.source.label}</a></figcaption>
  </figure>;
}

export type { DiagramId };
