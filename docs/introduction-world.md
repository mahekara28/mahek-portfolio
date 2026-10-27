# One question, different evidence

This pass changes only the homepage experience. All shared styles, other routes,
project content, theme handling, header/footer and existing project sketches remain
as they were at the start of the pass. The old homepage gallery is no longer rendered.

## The idea

The same question can need a different next step when its context changes. The
homepage expresses that through an open field of paths and inspectable decision
points, rather than a list of technologies or a project gallery.

The question is deliberately ordinary: “Why did this build fail?” A predefined
Python import error provides evidence that a non-specialist can understand.
Visitors can change the context and inspect Context, Next step, Evidence and
Trust boundary. Notes describe what a path supports and what remains unknown.

The three examples are:

- Useful context: the supplied log identifies a failed import. Inspect it and
  explain only that claim, without claiming a verified fix or a full diagnosis.
- Missing context: the explanation branch is not reached. Ask for the log.
- Injected instruction: the log still contains the import error, but also quotes
  a deployment instruction. That instruction is treated as data. The supported
  explanation is unchanged; no deployment is performed or authorised.

The application uses predefined booleans and local deterministic rules. It does
not classify arbitrary text, call an LLM, invoke tools, measure confidence or test
a real security boundary. These limitations are visible in the interface. The
scenario is illustrative, not a claim about any portfolio project's capabilities.

## Visual and interaction decisions

Parallel strands express one path, not an amount of traffic or a measured score.
The apertures mark places where interpretation or verification matters. Teal is
the evidence path, amber is the request for more evidence, and rust is untrusted
instruction text. Active and inactive routes also differ in line density and
endpoint fill; state is described in ordinary text.

The visual occupies most of the first screen. The name and introduction are small,
and existing navigation provides access to projects, writing, About and the resume.
Social and contact links remain in the shared footer and mobile menu.

Changing a case changes the route and outcome. Selecting a decision point reveals
a concise explanation for that case. A short signal travels once, then stops;
“Follow again” replays that route. There are no random particles or perpetual loops.

Desktop paths run across the page; phone paths turn downward with repositioned
nodes and preserved label sizes. Native buttons, pressed states, live descriptions
and keyboard navigation support exploration without a pointer. Reduced motion
shows the settled paths immediately and hides the unnecessary replay control.

## Implementation

- `app/page.tsx`: short server-rendered introduction and scene.
- `app/components/decision-world.tsx`: one small interactive client boundary.
- `app/components/decision-world.module.css`: isolated homepage styling.
- `app/lib/decision-sketch.ts`: pure decisions, descriptions and SVG geometry.

The scene uses only existing React, CSS and SVG capabilities. There are no new
dependencies, remote assets, live feeds, secrets or external API calls.

Decision tests cover missing evidence, injected text, continuous paths, honest
inspection notes and responsive geometry. Browser tests cover the visual state,
labels, keyboard controls, replay settling, reduced motion and all existing routes.

## Verification

Validated on 27 October 2026:

- ESLint and the production Next.js build pass.
- All 18 content and decision tests pass.
- The full browser suite passes with no runtime errors or external requests.
- All 23 automated accessibility scans report zero violations; a final scan of
  the initial Context selection also reports zero violations.
- Browser checks cover three cases, four decision points, keyboard controls,
  replay completion, reduced motion and viewport widths from 320 to 1440 pixels.
- Existing routes, project interactions, mobile navigation and theme persistence
  remain covered. Fourteen shared and non-homepage source files were compared
  against their contents at the start of this pass and remain unchanged.

Automated scans complement visual and interaction checks; they are not a claim
of exhaustive accessibility certification.
