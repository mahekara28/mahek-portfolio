# The Smallest Change

Historical notes for the retired homepage. The current implementation is
documented in [The Unseen Part](unseen-part.md).

The homepage is the About Me page. A short introduction sits beside four joined,
notched surfaces. One explicit contract edit opens only the affected surfaces.
There is no automatic playback, orbit, graph, canvas, render loop or model call.
The old five-stage scene and its state machine have been removed.

## Source and limits

Source: `mahekara28/mcp-impact`, revision
`31e7a74a2d0e4644662b1b50f3b9718a906b19ee`, `script.js`.
The locally saved script's Git blob hash matched the saved Git tree:
`e100ca922a59594000ee8d4ac1857390a1186302`.
Remote GitHub was unavailable during this review, so this is verified pinned
source, not a claim about the latest remote revision.

The names, toolRefs and paths come from `scenarios.customer.inventory`.
This is a fictional, bundled demo. The listed consumer paths are demo metadata,
not real files in this portfolio or in the MCP Impact repository.

Only one of that demo's changes is used: `search_accounts.lifecycle_stage`
goes from optional to required. The original diff and evaluation functions
were run in an isolated VM against that one edit. They flagged QBR Prompt
Builder, CSM Renewal Triage and Account Discovery Agent. Brief Quality Regression
only references `create_success_brief` and was not flagged.

The homepage implements that narrow optional-to-required comparison locally in
`app/lib/smallest-change.ts`. It derives impact from exact declared tool
references, not consumer names or preassigned animation flags. It does not claim
to run MCP Impact's complete scanner, rename heuristics or severity engine.

An inventory reference is potential impact. Without the actual call arguments
or an executed failing test, failure is unknown. An unflagged consumer is only
outside the known references for this change, not generally safe. The UI and
data model preserve those distinctions. There are no confidence percentages,
failure counters or invented production metrics.

## Presentation and interaction

- Dark by default; the existing light switch and route behaviour remain.
- Warm, nearly black ground; stone sheets; ochre underside only for review.
- An off-centre seam, staggered edges and small cuts form one silhouette.
- Sheet dimensions are compositional, not traffic or severity encodings.
- The contract toggle changes three sheets together in 420ms, without stagger.
  They are direct references, not a transitive execution chain.
- The unrelated eval retains its position, material, text and status.
- Selecting a sheet shows the reason and demo path. Hover never changes data.
- A second disclosure explains the check, evidence boundary and pinned source.
- Native buttons support touch and keyboard. Up/Down/Home/End move between
  sheets; Escape closes an explanation and restores focus.
- Reduced motion immediately reveals a shallow, static edge without rotation.
- Phone widths stack the short introduction and shallower surface. Expanded
  explanations can scroll naturally; content is never clipped to force a fit.

Projects, writing, source links, contact details and the mobile menu remain in
their existing routes. The shared mark echoes the new notched silhouette.

## Maintenance

- `app/components/smallest-change.tsx`: interaction and evidence disclosure.
- `app/components/smallest-change.module.css`: homepage-only composition/theme.
- `app/lib/smallest-change.ts`: pinned fixture and narrow comparison.
- `scripts/smallest-change.test.mjs`: data and evidence invariants.
- `scripts/verify.mjs`: rendered interactions, accessibility, responsive and
  reduced-motion checks, plus retained route regressions.

To change the demo, re-check the source contract and inventory together. Do not
give a consumer an animation flag by hand. Review the meaning of any new status
before showing it to visitors.
