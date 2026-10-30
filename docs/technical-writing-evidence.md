# Technical writing evidence notes

Audience: AI engineering and studio operations readers evaluating Mahek's ability to explain a system she built or a measurement she would run. Each article moves from an execution path to a design boundary and a falsifiable check. Diagrams describe data flow or decision order, not decorative process steps.

| Article | Checkable claim represented in the diagram | Primary evidence | Boundary |
| --- | --- | --- | --- |
| Context Relay | Native capture and MCP are separate integration paths; checkpoint and packet mediate the handoff. | Context Relay `docs/HARNESS_CONNECTIONS.md`, `packages/relay/src/store.ts`, `packages/relay/src/mcp.ts` at `4e52ada` | Acknowledgement is not task completion; uncaptured native turns are not detected by stored-revision checks. |
| Working context | A packet has required task fields, cited source references, and optional evidence constrained by a UTF-8 byte budget. | Context Relay `packages/relay/src/store.ts` and `packages/relay/src/model.ts` at `4e52ada` | Byte size is not model token count; a valid citation does not prove its interpretation. |
| Staffing | Eligibility, greedy assignment and feasibility gates precede plan ranking. | Build, Buy or Borrow `engine.js`, `tests/engine.test.cjs` at `bd642ab` | The heuristic has no global optimality claim; portfolio input data are fictional. |
| Inference | Transport, queue, prefill and decode can contribute to a client-visible response; KV caching reuses past attention state. | Hugging Face cache explanation and NVIDIA GenAI-Perf metric definitions | The timeline is a conceptual execution path, not measured latency for Mahek's projects. |
| Verification | Receipt, artifact readback and task checks establish different levels of evidence. Relay validates acceptance at the handoff boundary. | Context Relay `packages/relay/src/store.ts` and `packages/relay/src/mcp.ts` at `4e52ada` | The CSV verifier is illustrative; no production audit record is claimed. |

Evidence and evaluations are deliberately separate. The posts describe proposed experiments as proposals, not benchmark results, hiring savings, or verified cross-harness task success. If the linked implementations change, review the claims and diagrams against a new pinned revision before updating the posts.
