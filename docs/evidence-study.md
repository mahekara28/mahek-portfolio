# The evidence study

The active homepage asks a narrow question: when an AI says “done”, what has
actually been checked? This replaces the token-generation tutorial. It follows
the result-checking concern already documented in the portfolio's reviewed
Context Relay source notes, without naming or demonstrating that project on the
homepage.

## What changes

The displayed model reply stays “done”. The reply, successful tool receipt and
returned file appear automatically. The first two states remain unverified.
The final check reads an in-memory example's contents and finds JSON where CSV
was requested. A successful receipt is never presented as proof.

There is no model call, external service or claimed benchmark. This deliberately
small checker supports simple, unquoted CSV fixtures; it is not a general CSV
parser or a production validation library. Other fixtures remain available to
the unit tests, but the homepage has no file selector or manual controls.

## Presentation

The reply begins solid, becomes an outline while inspected, and stays outlined
when the contents contradict the request. A short scanning rule marks each
change. Three passive progress markers replace the slider. A short explanation
is always visible; nothing needs to be clicked open.

Playback starts when at least half the sketch is visible. The states advance
at 1.4 and 3 seconds of visible time, with the final transition ending before
four seconds. It plays once and leaves the result visible. Time is suspended
while offscreen or in a hidden tab. Reduced motion shows the final state
immediately without scans or transitions. Automatic text changes are not
announced through a live region.

Dark and light themes retain their readable ink/accent colors. No canvas,
WebGL, lighting simulation, particles or perpetual animation is involved.

## Project presentation

Projects have compact summaries, a direct Code link and an optional Read notes
dialog. Numbers and categories share the top row, avoiding the old blank area.
Implementation details, limitations and commit-pinned source links are retained.
Native dialogs provide keyboard focus containment and Escape dismissal; closing
returns focus to the project trigger. The URL preserves filters and opened
project anchors. Mobile dialogs have a dynamic-viewport height and scroll internally.

## Files

- `app/lib/evidence-study.ts`: fixtures and result checks.
- `app/components/evidence-field.tsx`: automatic playback and lifecycle.
- `app/components/evidence-field.module.css`: visual state and responsive themes.
- `app/components/project-book.tsx` and its CSS module: project grid and dialogs.
- `scripts/evidence-study.test.mjs`: false-success and artifact checks.
- `scripts/verify-interface.mjs`: routes, interaction, themes, mobile and accessibility.

The older sentence, decision, PBR and graph components are retained as inactive
source history. No active page imports them.
