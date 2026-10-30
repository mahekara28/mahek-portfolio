type DiagramId = "projection" | "handoff";

type Node = { x: number; y: number; w: number; h: number; tag: string; title: string; detail: string; tone?: "mint" | "rose" | "sand" };
type Edge = { x1: number; y1: number; x2: number; y2: number; label?: string; dashed?: boolean };
type Diagram = { title: string; description: string; caption: string; source: { label: string; href: string }; nodes: Node[]; edges: Edge[] };

const relaySource = "https://github.com/mahekara28/context-relay/blob/4e52ada45c471f17a94b16b2d81ed6636495f0f7/packages/relay/src/store.ts";

const diagrams: Record<DiagramId, Diagram> = {
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
  handoff: {
    title: "Checkpoint freshness and handoff acceptance",
    description: "A reviewed checkpoint passes freshness checks before an immutable packet is offered. The destination inspects the offer, then acceptance checks recipient, integrity and freshness again. Stale state requires renewed review. Acceptance records acknowledgement, not successful task execution.",
    caption: "State is checked before the offer and again at acceptance. A changed source, selected file or Git HEAD requires renewed review.",
    source: { label: "Offer and accept implementation", href: relaySource },
    nodes: [
      { x: 20, y: 40, w: 170, h: 82, tag: "REVIEWED", title: "Checkpoint", detail: "revisions + file hashes", tone: "sand" },
      { x: 270, y: 40, w: 170, h: 82, tag: "BEFORE OFFER", title: "Freshness check", detail: "sources + files + HEAD", tone: "mint" },
      { x: 520, y: 40, w: 170, h: 82, tag: "OFFERED", title: "Immutable packet", detail: "recipient + digest", tone: "sand" },
      { x: 520, y: 220, w: 170, h: 82, tag: "BEFORE ACCEPT", title: "Validate again", detail: "recipient + integrity", tone: "mint" },
      { x: 270, y: 220, w: 170, h: 82, tag: "ACCEPTED", title: "Acknowledged", detail: "work remains to verify", tone: "mint" },
      { x: 20, y: 220, w: 170, h: 82, tag: "STALE", title: "Review required", detail: "create a new checkpoint", tone: "rose" },
    ],
    edges: [
      { x1: 190, y1: 81, x2: 270, y2: 81, label: "compare" },
      { x1: 440, y1: 81, x2: 520, y2: 81, label: "pass" },
      { x1: 605, y1: 122, x2: 605, y2: 220, label: "inspect" },
      { x1: 520, y1: 261, x2: 440, y2: 261, label: "pass" },
      { x1: 310, y1: 122, x2: 165, y2: 220, label: "stale", dashed: true },
    ],
  },
};

export function ArticleDiagram({ id }: { id: DiagramId }) {
  const diagram = diagrams[id];
  const width = 740;
  const height = 336;
  return <figure className="md-architecture">
    <p className="md-architecture-hint">Swipe or scroll the diagram to inspect every stage.</p>
    <div className="md-architecture-scroll" tabIndex={0} role="region" aria-label={`${diagram.title} diagram; scroll horizontally on small screens`}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`} xmlns="http://www.w3.org/2000/svg">
        <title id={`${id}-title`}>{diagram.title}</title>
        <desc id={`${id}-description`}>{diagram.description}</desc>
        <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="currentColor" strokeWidth="1.5" /></marker></defs>
        <g>
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
