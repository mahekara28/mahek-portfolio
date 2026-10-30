# Context Relay article evidence

Audience: a technical reader evaluating the implementation of agent context handoffs. The article should explain the problem, follow state through capture/review/export/acceptance, and show exactly which claims the current software validates. Scope: npm beta 0.3.0-beta.1 at Context Relay revision `4e52ada45c471f17a94b16b2d81ed6636495f0f7`.

| Claim | Evidence at the pinned revision | Visual implication / boundary |
| --- | --- | --- |
| Native capture and MCP are separate integration paths. | README, `docs/HARNESS_CONNECTIONS.md`, MCP architecture specification | Reuse the README architecture with its original harness icons and local service boundary. MCP does not expose full host history. |
| Checkpoints retain source references and explicit instruction resolutions. | `packages/relay/src/model.ts`, `store.ts` | Projection diagram shows selection and a path back to evidence. Citation validity does not establish interpretation quality. |
| Required packet fields must fit; optional evidence can be skipped under the byte budget. | `store.ts`, `packet()` | Describe exact ordered admission behavior and omission count; bytes are not tokens. |
| Offer and accept perform freshness checks. | `store.ts`, `offer()`, `accept()`, `freshness()` | Handoff diagram separates checks, offered state and acknowledgement. Uncaptured native turns and unselected files remain outside coverage. |
| MCP is project/harness scoped. | `packages/relay/src/mcp.ts` | Receiver inspects and acknowledges; acceptance is not completed coding work. |
| Optional model drafts return to review. | `docs/WORKSPACE.md`, Nebius implementation | Describe explicit consent and schema/citation checks; no semantic correctness claim. |
| The README recording is an actual UI with synthetic data. | `docs/assets/workspace/README.md`, `scripts/npm/render-demo.mjs` | Playback is opt-in and stoppable. Caption states that no model call or task execution occurs. |
| Continuation quality remains unmeasured. | `docs/releases/NPM_VERIFICATION.md` | Proposed transcript/summary/packet comparison is clearly an evaluation plan, not a benchmark result. |

The earlier short articles are retired from the public writing list. Their URLs redirect to the expanded Context Relay article where content overlaps, or temporarily to Writing while the second article is chosen. The historical text remains in Git.
