# A question, followed through

The homepage is Mahek's About Me page. A compact introduction sits beside the
interactive thread on laptops; phones stack the two. Existing /about links
redirect home. There is no separate About page or homepage project gallery.

## The introduction and composition

The introduction points to three pieces of real work: local model routing, MCP
contract changes and developer questions in GitHub issues. Each is an inline
link to the corresponding project notes. The short closing thought connects
directly to the interaction: change one assumption and follow the consequence.

The existing woven paths, folded apertures, palette and type are retained. The
full-width lesson heading and explanatory deck have been removed. The current
question now leads the scene. A smaller home-only footer keeps email, GitHub,
LinkedIn, X and the resume available without another content section.

The default view and ordinary playback fit a typical laptop viewport. Reading
the optional detail disclosure can expand the page; nothing is clipped to force
a viewport fit. Mobile uses ordinary vertical scrolling, readable text and a
dedicated drawing rather than squeezing the desktop layout.

## The visual idea

The thread tells a five-stage story: Input, Context, Route, Action and Feedback.
Teal carries the selected tool path; a warm clay path carries feedback back to
context. Inactive branches are finer and dashed, so colour is not the only way
to see which route is selected.

Sources appear at context; tool labels appear when the task reaches routing.
One of two branches becomes active, and a computed result appears beneath the
scene. A correction travels back through the feedback loop. There are no
decorative particles, metrics or live-feed claims.

## Two honest, working examples

- **Find a pattern** opens by default. A local function groups six fictional
  developer reports by topic. Adding “Just the Windows reports” filters the same
  fixture and recalculates the totals. These are not statistics from Mahek's
  repositories.
- **Run a project** reads setup commands from a tiny local fixture for an
  illustrative Python app. Adding “I'm on Windows” changes the platform and
  retrieves the PowerShell activation command. No shell commands are executed.

The routing policy uses the selected predefined task, not a classifier. Exact
instructions go to a lookup; counts go to code. No LLM, external service, tool
server or GitHub API is invoked by the visualization.

Feedback changes the inputs for a second pass. It does not train a model or imply
that AI systems learn automatically from feedback. The sample-data and no-model
boundary is visible below the field.

## Interaction and motion

The first sequence starts once when at least 45% of the drawing is visible,
unless the visitor has already taken control. It finishes in roughly four
seconds and stops. Choosing another example starts it immediately. Visitors can
pause, continue, replay or advance one stage at a time.

A bright leading signal and softer trail travel along the selected route. Short
source signals converge at context; the selected aperture opens slightly. These
are finite movements tied to the current step, with quicker transitions and a
longer hold for the computed result. Scrolling the field out of view or hiding
the tab pauses playback. Turning on reduced motion also pauses it.

Every stage is a native button. Hovering, focusing or tapping it pauses the
sequence at that stage, reveals a nearby plain-English hint and updates the
readout. Arrow keys, Home and End move between stages and example choices.
Escape dismisses the nearby hint.

The concise result stays visible. Opening “Look inside” pauses playback and
reveals the explanation, fixture detail and any revised-pass note. It is a native
details element, operable by keyboard without a custom disclosure dependency.

The feedback control appears at the final stage. Changing examples clears the
previous example's feedback. Reduced motion replaces timed playback with a
Next stage control; every result and correction remains available.

## Theme behavior

Every fresh document starts dark, even if local storage contains a previous
light preference. The server HTML has data-theme="dark". A visit-scoped React
state supplies next-themes' forcedTheme so its startup script uses the same
theme. System preferences and stored values cannot override the initial view.

The manual switch works, including across client-side route changes. Reloading
or opening a new document intentionally resets it to dark.

## Implementation

- app/page.tsx: server-rendered personal introduction and inline evidence links.
- app/components/decision-world.tsx: SVG scene, playback, stage exploration and
  detail disclosure.
- app/components/decision-world.module.css: isolated responsive presentation.
- app/lib/decision-sketch.ts: sample data, lookup/count functions, pure playback
  reducer, stage descriptions and responsive geometry.
- app/components/site-shell.tsx: the compact homepage footer; other footers and
  navigation retain their existing behavior.
- app/theme-provider.tsx and app/layout.tsx: consistent dark-first rendering and
  visit-scoped manual theme choice.
- scripts/decision-sketch.test.mjs: routing, feedback, result and state invariants.
- scripts/verify.mjs: browser interactions, accessibility and regression coverage.

No dependencies were added. The project index, writing pages, project content,
public destinations and About redirect are preserved.

## Verification

Unit coverage checks fixture results, exclusive routing, feedback guards,
pause/resume, bounded playback, reset behavior and responsive path geometry.
Browser coverage checks both examples, both feedback results, the disclosure,
nearby hints, keyboard navigation, pause/replay, mobile label collisions,
reduced motion, old About links and existing project and writing interactions.

Theme checks seed an older light preference, check the dark server markup and
fresh view, toggle light through client navigation, then reload to confirm dark.
Laptop checks cover 1366×768, 1280×720, 1366×650 and 1024×768. Responsive checks
also cover tablet layouts and phone widths down to 320 pixels.

Automated scans supplement visual, keyboard and touch checks; they are not an
exhaustive accessibility certification.


Checked on 28 October 2026: 19 content/story tests and the complete browser
suite passed, including 20 accessibility scans with no reported violations.
Two additional scans covered the expanded disclosure on a touch viewport in
both themes. The faster entrance was also checked at 320×568: it waits until
the field is visible, pauses on scroll-away, and does not restart over visitor
control. Example switching, paused trails and changing reduced-motion settings
during playback were checked directly. There were no browser runtime errors or external requests during
the full suite. Protected project content, project/writing page files and route
configuration were compared with their pre-pass contents and remain unchanged.
