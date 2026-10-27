# Mahek Ara - portfolio

A personal portfolio with an About Me homepage and interactive technical sketch, a separate nine-project index, and writing. Project descriptions are backed by public source code.

## Run locally

```sh
npm ci
npm run dev
```

The application uses Next.js App Router, React, TypeScript, Tailwind CSS and the existing next-themes package. Fonts are served locally; their licenses are in `public/fonts`.

## Design

The homepage pairs a short personal introduction with an interactive thread. The introduction links directly to local model routing, MCP contract changes and developer questions in GitHub issues. The scene follows a question through context, a tool choice, a result and feedback. It opens with the developer-report example. No role targets, project cards or gallery are displayed on the homepage.

On laptops the introduction, scene and compact contact footer fit within the first viewport. Phones use a stacked composition and a dedicated vertical drawing. Source and tool labels appear as they become relevant. A concise result stays visible; the native “Look inside” disclosure reveals the implementation explanation and sample output without crowding the initial view.

The woven paths and folded apertures retain the limestone and ink themes. Teal identifies the selected path; a warm clay loop carries feedback back into context. The two local examples read a sample setup guide or count fictional developer reports. A Windows-specific correction changes the actual lookup or filtered count. The interface clearly identifies sample data and the absence of AI model or external service calls.

An initial sequence plays once when the field is visible and finishes in roughly four seconds. Switching examples starts the new sequence immediately. Pause, replay, step through or inspect any stage. Brighter short trails show the chosen route; context signals converge and the selected aperture opens. Motion stops after one pass; background tabs and scrolling out of view pause it. Native buttons support touch and keyboard navigation. Reduced motion uses manual advancement. Mobile has a dedicated vertical composition. There are no new dependencies, remote assets or perpetual effects. The original six project sketches remain in expanded project notes.

## Content and routes

- `app/lib/content.ts`: nine projects, focus areas, implementation limits, reviewed revisions, evidence links, profiles, resume and article metadata.
- `app/lib/github-snapshot.json`: validated public GitHub metadata, refreshed independently of descriptions.
- `app/lib/trace-studies.ts`: conceptual relationships, endpoint labels and shared drawing geometry.
- `app/lib/decision-sketch.ts`: sample data, local tools, playback state, stage explanations and desktop/mobile path geometry.
- `app/components/decision-world.tsx` and its CSS module: the homepage's interactive scene.
- `/`: the complete essential About Me introduction and a conceptual decision sketch. Projects and writing are available through shared navigation.
- `/projects`: a compact filterable index with implementation details, honest limits, source evidence and a real repository screenshot. Filters support shareable `?focus=ai`, `?focus=developer` and `?focus=operations` URLs; project anchors open the relevant notes.
- `/blog`: the existing article plus selected repository guides and validation writing.
- `/blog/llm-routing`: full article, working contents links, routing diagrams and code copying.
- `/about`: a permanent redirect to `/` for existing bookmarks; there is no separate About page or navigation entry.

See [the introduction notes](docs/introduction-world.md) for the current homepage. [The graph refinement notes](docs/graph-refinement.md) and [earlier refinement notes](docs/portfolio-refinement.md) document previous passes.

Every fresh document starts in dark mode, including when an older light preference exists in local storage or the OS uses light mode. The server HTML and next-themes startup script agree on dark. The secondary theme switch works throughout client-side navigation; a reload or fresh visit intentionally resets it to dark. Navigation is shared across all pages; the mobile drawer uses a native modal dialog with focus containment and Escape dismissal.

The resume URL is preserved from the original homepage. Contact uses the email on the public GitHub profile. GitHub, LinkedIn and the user-supplied personal X profile are linked in shared navigation and footer areas.

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

Use Node.js 24 for the checks, which also test the TypeScript geometry directly. Set `BASE_URL` for a different port. Optionally set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed browser. Tests cover decision invariants, example limitations, preserved project evidence, snapshot validation, caching and network failure handling. Browser checks cover both examples and their feedback, the detail disclosure, keyboard controls, bounded animation, laptop viewport fit, mobile label collisions, no external requests, all routes and existing project/navigation features, dark-first loads with an old saved light preference, manual theme changes across client navigation, reduced motion and WCAG A/AA rules. Screenshots and results are written to the ignored `.qa/` directory.
