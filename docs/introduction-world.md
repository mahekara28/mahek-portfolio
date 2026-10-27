# Ideas → Intelligence → Action

The homepage is Mahek's About Me page. Her two introductory paragraphs remain
unchanged and visible before the interactive field. There is no separate About
page or homepage project gallery. Existing /about links redirect home.

## The visual idea

The woven path now tells a five-stage story: Input, Context, Route, Action and
Feedback. The open field, restrained palette and folded apertures extend the
existing visual direction. Teal carries the selected tool path; a warm clay path
carries feedback back to context. Inactive branches are finer and dashed, so
colour is not the only way to see which route is selected.

Rather than becoming a diagram of every possible AI component, the field follows
one small question. Sources join the context, one of two tool branches becomes
active, and a useful result appears. A correction travels back through the
feedback loop. There are no decorative particles, metrics or live-feed claims.

## Two honest, working examples

- **Run a project:** a lookup reads setup commands from a tiny local fixture for
  an illustrative Python app. Adding “I'm on Windows” switches the platform and
  retrieves the PowerShell activation command. No shell commands are executed.
- **Find a pattern:** a local function groups six fictional developer reports by
  topic. Adding “Just the Windows reports” filters that same fixture and
  recalculates the totals. These are not statistics from Mahek's repositories.

The routing policy uses the selected predefined task, not a classifier. Exact
instructions go to a lookup; counts go to code. The explanation distinguishes
those jobs from what a model might contribute. No LLM, external service, tool
server or GitHub API is invoked by the visualization.

Feedback changes the inputs for a second pass. It does not train a model or imply
that an AI system learns automatically from any feedback. The sample-data and
no-model boundary is visible below the field.

## Interaction and motion

Visitors can run, pause, continue, replay or advance one stage at a time. The
sequence finishes in about ten seconds and stops. A short signal travels along
the current path; previously reached paths remain legible. A background tab
pauses the sequence instead of completing unseen.

Every stage is a native button. Hovering, focusing or tapping it pauses the
sequence at that stage, reveals a nearby plain-English hint and updates the
detailed explanation. Arrow keys, Home and End move between stages and between
example choices. Escape dismisses the nearby hint.

The feedback control appears at the final stage, carrying a real correction back
to context. Changing examples clears the previous example's feedback.

Reduced motion replaces timed playback with a Next stage control. All paths,
explanations, results and feedback remain available without animated signals.
Mobile has a dedicated vertical path and repositioned sources and branches,
rather than a scaled-down desktop drawing.

## Implementation

- app/page.tsx: the preserved server-rendered About Me introduction.
- app/components/decision-world.tsx: SVG scene, playback and stage exploration.
- app/components/decision-world.module.css: isolated responsive presentation.
- app/lib/decision-sketch.ts: sample data, lookup/count functions, pure playback
  reducer, stage descriptions and responsive geometry.
- scripts/decision-sketch.test.mjs: routing, feedback, result and state invariants.
- scripts/verify.mjs: browser interactions, accessibility and regression coverage.

No dependencies were added. Projects, writing, navigation, themes, content,
public links and the About redirect remain unchanged by this pass.

## Verification

Unit coverage checks real fixture results, exclusive routing, feedback guards,
pause/resume, bounded playback, reset behavior and responsive path geometry.
Browser coverage checks both examples, both feedback results, nearby hints,
keyboard navigation, pause/replay, mobile label collisions, reduced motion,
themes, old About links and all existing project and writing interactions.

Validated on 28 October 2026:

- ESLint and the production build pass.
- All 19 content and story tests pass.
- The full browser suite passes: 19 automated accessibility scans with zero
  violations, no browser errors and no external requests.
- Two additional touch-device accessibility scans pass in light and dark mode.
  Tapping stages, dismissing nearby hints and applying Windows-only feedback
  were checked with touch input and reduced motion enabled.
- Stage/source labels and touch targets fit without collisions at widths of
  320, 360, 393, 760, 820, 1024 and 1440 pixels.
- The introduction, navigation, other pages, project content, shared styles,
  themes and About redirect were compared with their contents before this pass
  and remain unchanged.

Automated scans supplement visual, keyboard and touch checks; they are not an
exhaustive accessibility certification.
