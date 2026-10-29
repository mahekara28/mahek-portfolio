# Homepage sketch and project reading

The homepage keeps the approved token-stream composition. The introduction has three short paragraphs about Mahek's interests in intelligent systems, developer tools and the people around technology. It does not name projects or list target jobs. Projects and Writing have direct links, alongside GitHub, LinkedIn and X. Résumé links are removed throughout the active site.

## Drawing interaction

The question is “How does an LLM answer?” Clicking or tapping the drawing, or pressing Enter/Space while it is focused, changes between two curated instructions and sequences:

- A short answer: “One token at a time.”
- More detail: “Each new token helps shape the next.”

Each token passes through context, candidate selection, acceptance and return to context. The accepted piece becomes part of the answer and the next pass's context. Dim paths are alternatives, not failures.

The authored timeline is played at three times its base rate: 3.2 seconds for the short example and about 4.27 seconds for the longer one. A separate limit of 4.8 seconds of visible playback also settles motion on slower devices. Time below the fold or in a hidden browser tab does not consume that budget. There is no automatic replay or continuing ambient animation. The scene remains still until further input. This removes the need for a pause/resume control without leaving continuous motion on the page.

Reduced motion shows the final still immediately. Direct interaction changes the still answer without movement. A screen-reader status announces a completed, user-triggered answer. The drawing is a native button with a descriptive accessible name; its visual token labels are hidden from the accessibility tree.

## Scope

This is a hand-authored illustration, not a model, AGI simulation or hidden-state measurement. Word-sized pieces and punctuation simplify real tokenization; three alternatives simplify a real vocabulary. There are no probabilities or model requests. Adding tokens means growing context, not training or changing weights. A short, optional disclosure explains this in plain English.

## Rendering and themes

Canvas 2D projects streams, five illustrative layers, candidate ribbons and a return stroke. Geometry is bounded, strokes are batched and pixel density is capped at 1.6. The renderer paints exact buffer dimensions so fractional sizes cannot leave a dark edge in light mode. Light mode uses stronger teal ink and copper on warm paper. Dark mode retains the approved colors.

Hidden tabs and offscreen canvases stop requesting frames. Resize, intersection, pointer and media listeners are removed on teardown. Theme changes retain the current result. Pointer movement changes the view slightly; touch scrolling is preserved. When Canvas is unavailable, the final textual example and direct interaction still work.

## Project presentation

Every project has a visible summary and status. A keyboard-operable row opens its question, three implementation steps, approach, current scope and source links. Fuller implementation limits and reviewed commit information are available under “More on the implementation.” Descriptions remain tied to the previously reviewed source revisions; no new implementation or outcomes are claimed.

Filters and project hashes retain shareable URLs and browser history. Mobile uses the same expandable rows, without a separate hidden project selector. Writing and article functionality are preserved.
