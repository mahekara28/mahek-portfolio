# The Unseen Part

The homepage introduces Mahek beside an experiment with incomplete information.
It contains no project list, project names or separate About section. Projects,
Writing, profiles, resume and email remain available through shared navigation.

## What changes

Three custom shapes resemble B, P and R. They share the same upper stem and bowl
but have different lower strokes. The hidden shape is R throughout the visit.
Only a horizontal band of its solid ink is revealed. Coral outlines show every
candidate that still agrees with the information in that band.

- At position 112, all three fit.
- At 244, B adds ink where the view is empty. P and R still fit.
- At 350, P misses the diagonal stroke. Only R fits.
- Returning to 112 restores all three possibilities.

The observation is deliberately local: it does not remember previous bands.
The shape and its geometry never change. This is not learning, an LLM call or a
confidence estimate. A unique match establishes only which of these three
specified shapes fits; it does not prove uniqueness among all possible shapes.

## Shared geometry and evidence

`app/lib/unseen-part.ts` defines the filled polygon contours used by both SVG
rendering and the comparison. Curves are sampled into 28 segments and coordinates
are quantized to three decimal places before either consumer uses them. Both
rendering and scanline rasterization use the even-odd fill rule.

The comparison samples cell centres on a 2px grid. For each candidate/truth pair,
row prefix sums store additional and missing ink. Every drag update subtracts
two prefix entries per metric; it does not rasterize the scene again. A match
requires zero discrepancies in the currently visible rows. Explanations derive
from those discrepancy counts rather than preset animation states.

The model is approximate at sub-cell boundaries, which the disclosure makes
explicit. It runs entirely on-device without external requests or credentials.

## Motion and input

An IntersectionObserver starts one 2.6-second excursion from the initial view
to the lower stroke and back, when most of the drawing is visible. It stops
afterward. Pointer input, focus, a hidden document, scrolling offscreen or a
change to reduced-motion preference cancels it. There is no idle render loop.

Mouse users can drag anywhere in the drawing. Touch users can tap a location or
drag the handle; the rest of the drawing allows normal vertical page scrolling.
The focusable slider supports arrow keys, Page Up/Down, Home and End. Candidate
outlines withdraw in 220ms when contradicted. Reduced motion disables both the
intro movement and transitions without removing functionality.

The current result is available as slider value text and a live caption. Live
announcements are off during the automatic introduction. The Why disclosure
reports all three candidates and the limits of the comparison. Escape closes
it and returns focus to its trigger.

## Composition

A concise introduction occupies the left side of a compact desktop viewport.
The large overprinted shape occupies the right; the white observation cuts
across its silhouette. There is no panel frame or outer illustration container.
Mobile stacks the introduction before the shape without reserving a large
empty hero area. Expanded evidence can increase the page length naturally.

The previous contract-demo component, model and CSS are removed. The shared
palette, metadata typography and wordmark were updated so Projects and Writing
belong to the same visual system. Their content, routes, filters, source links,
article controls and project-specific sketches remain intact.

## Verification

`scripts/unseen-part.test.mjs` checks the actual comparison against an independent
cell-by-cell calculation, alternative hidden shapes, reversibility and immutable
geometry. `scripts/verify.mjs` also compares sample points against native SVG
`isPointInFill`, exercises keyboard/pointer controls and evidence, checks existing
routes and interactions, and audits responsive layouts and WCAG A/AA rules.
The application remains a Next.js App Router project with no new runtime
dependencies or remote font requests.

The implementation pass also checked real browser touch events: a tap selects a
view, dragging the handle changes it, and swiping elsewhere scrolls without
changing the observation. The intro was observed moving and settling, interrupted
with keyboard input, and suppressed on a fresh reduced-motion visit. Twenty
route/theme/layout accessibility scans and two expanded-explanation scans
reported no WCAG A/AA violations. These are browser checks, not a claim of
testing on every physical handset or of complete accessibility certification.
