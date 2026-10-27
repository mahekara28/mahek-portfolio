# Personal portfolio refinement

27 October 2026. This pass reduces product-style presentation without replacing
the Next.js application, the two themes or the original line geometry.

## Research

These are principles taken from public personal sites, not layouts to reproduce:

- [Cassidy Williams](https://cassidoo.co/): a direct personal introduction and
  readable routes to writing and professional links. A varied career does not
  require a separate pitch for every role.
- [Maggie Appleton](https://maggieappleton.com/): concise context lets different
  kinds of work coexist. Essays, notes and experiments need not all become
  elaborate case studies.
- [Simon Willison](https://simonwillison.net/): specific work and dated writing
  carry more useful evidence than a long claim about expertise.
- [Jhey Tompkins](https://www.jhey.dev/): prototypes are accessible as work, with
  a compact introduction rather than a long explanation of the site's concept.

No source copy, assets, signature interactions or page composition were imported.

## Changes

- The homepage introduces Mahek in one sentence. Six project names and short
  descriptions are visible together and link directly to their existing anchors.
- A smaller supporting sketch retains the original canvas and deliberate motion.
  Preview buttons, link focus and arrow keys change the selection. A phone preview
  scrolls the sketch into view, without making project navigation depend on it.
- RouterFlow, Narrative Gap MCP, MCP Impact, Prompt Injection Lab and Build, Buy
  or Borrow precede Context Relay. This exposes Python, developer experience,
  security and operations without manufacturing new roles or achievements.
- Removed all nine repeated project questions and motivation paragraphs, the
  homepage's second biography, the About-page slogan and question list, duplicate
  Context Relay documentation links and the large contact banner.
- Project details retain implementation, limitations, technical stacks, pinned
  source links and the original planning screenshot. All nine projects remain.
- About has three short paragraphs. Writing has one article and three real
  repository documents, with one document per project. No fake feed was added.
- Smaller headings, less vertical padding and a quiet footer apply to all routes
  in both themes. Existing local fonts, colours and the trace mark are retained.

## Evidence and boundaries

The official GitHub API returned 28 public repositories. The nine displayed
repositories' current commits match the pinned source review. Primary files were
re-read, and the MCP Impact, Narrative Gap and staffing READMEs were checked.
Forks are not presented as original work. The simulation is still identified as
a simulation, prototypes remain prototypes, and fictional data is identified.

No dependencies, telemetry, external feeds or new routes were introduced. The
metadata refresh stays an explicit local/CI action. Shared themes, direct links,
filters, history navigation, expanded notes, clipboard controls and reading tools
are preserved. This pass does not push to GitHub or deploy to Vercel.

## Verification

- ESLint and the Next.js production build pass; all page routes remain static.
- All 12 content tests pass. Project identities, repository URLs, pinned commits,
  evidence paths, statuses, stacks and personal links match the previous source.
- Browser checks pass for desktop, phone and narrow-phone layouts, both themes,
  the mobile menu, project filters, shared URLs, back navigation and all six
  sketch states. Reduced-motion behavior and canvas bounds are checked.
- The 23 automated accessibility scans report no violations; the browser error
  log is empty. These checks supplement, rather than replace, visual review.
- Article link copying, code copying, section anchors and reading progress were
  checked separately. Clipboard text matches after Windows newline normalization.
- Light and dark homepage screenshots and the projects, About, writing and article
  layouts were visually reviewed. All original routes and nine projects remain.
