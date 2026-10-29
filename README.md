# Mahek Ara - portfolio

A personal portfolio with an About Me homepage and automatic technical sketch, a separate nine-project index, and writing. Project descriptions are backed by public source code.

## Run locally

```sh
npm ci
npm run dev
```

The application uses Next.js App Router, React, TypeScript, Tailwind CSS and the existing next-themes package. Fonts are served locally; their licenses are in `public/fonts`.

## Design

The homepage pairs a personal introduction with a small evidence experiment: an AI says “done”, a tool reports success, but only inspecting the returned file establishes whether it matches the request. The three stages unfold automatically when the sketch comes into view. The example returns JSON where CSV was requested, and a local check of the contents identifies the mismatch. No dragging, clicking or selecting is required. No model is running, and the narrow checks do not prove complete correctness.

The typographic visual changes from solid to outlined as a claim is inspected. Motion runs for under four seconds and settles on the result. Playback waits while offscreen or in a hidden tab; reduced motion shows the final state immediately. Both themes use solid, readable colors. There are no graphics dependencies or external requests. See [the evidence-study notes](docs/evidence-study.md) for the interaction and its limits.

## Content and routes

- `app/lib/content.ts`: nine projects, their questions and steps, focus areas, implementation limits, reviewed revisions, evidence links, profiles and article metadata.
- `app/lib/github-snapshot.json`: validated public GitHub metadata, refreshed independently of descriptions.
- `app/lib/evidence-study.ts`: local fixtures and content checks.
- `app/components/evidence-field.tsx`: automatic playback, visual states and a short inline explanation.
- `app/components/project-book.tsx`: compact project grid, direct code links and native detail dialogs.
- `/`: the essential About Me introduction and an automatic evidence study. No project references in the introduction.
- `/projects`: a filterable compact grid. Read notes opens the approach, implementation limits and pinned source links in a keyboard-accessible dialog. Filters support shareable `?focus=ai`, `?focus=developer` and `?focus=operations` URLs; project anchors open the relevant dialog. The real repository screenshot is preserved.
- `/blog`: the existing article plus selected repository guides and validation writing.
- `/blog/llm-routing`: full article, working contents links, routing diagrams and code copying.
- `/about`: a permanent redirect to `/` for existing bookmarks; there is no separate About page or navigation entry.

The sentence study, decision planes, PBR, graph and earlier refinement notes document retired design passes. Their old components are retained as source history and are not imported by active routes.

Every fresh document starts in dark mode, including when an older light preference exists in local storage or the OS uses light mode. The server HTML and next-themes startup script agree on dark. The secondary theme switch works throughout client-side navigation; a reload or fresh visit intentionally resets it to dark. Navigation is shared across all pages; the mobile drawer uses a native modal dialog with focus containment and Escape dismissal.

Résumé links have been removed at the owner's request. Contact uses the email on the public GitHub profile. GitHub, LinkedIn and the user-supplied personal X profile remain available on the homepage and in the shared navigation/footer.

## Source review and metadata

See [the content audit](docs/content-audit.md) for the reviewed repositories, pinned revisions, naming corrections, source limitations and screenshot provenance. No production metrics, client deployments or achievements were inferred from example data.

Refresh public repository metadata with Node.js 24:

```sh
npm run content:refresh
npm run content:refresh -- --force
```

The script uses the official GitHub REST API, reuses snapshots for six hours and retains the last good snapshot on network, rate-limit or validation failure. An optional `GITHUB_TOKEN` can be supplied to the local or CI environment; never expose it with a `NEXT_PUBLIC_` prefix. Public requests work without a token within GitHub's rate limits.

This is a refresh-and-deploy workflow, not a live or scheduled feed. Visitors make no social API requests, and descriptions do not update automatically. Review source changes and update the pinned evidence in `content.ts` separately. X posts and detailed LinkedIn information could not be verified, so no automatic integration or invented public activity is shown.

## Checks

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Run the browser checks against an already running local server:

```sh
npx playwright install chromium
npm run verify
```

Use Node.js 24 for the checks. Set `BASE_URL` for a different port; optionally set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed browser. Unit checks cover artifact validation, unverified tool receipts, project evidence and snapshot handling. Browser checks exercise automatic playback, offscreen suspension and the absence of manual controls, project dialogs and history, source links, article copying, laptop fit, mobile widths, dark-first loads, themes, reduced motion, keyboard navigation, removed résumé links and WCAG A/AA rules. Screenshots and results go to the ignored `.qa/` directory.
