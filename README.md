# Mahek Ara - portfolio

A personal portfolio with an About Me homepage and interactive technical sketch, a separate nine-project index, and writing. Project descriptions are backed by public source code.

## Run locally

```sh
npm ci
npm run dev
```

The application uses Next.js App Router, React, TypeScript, Tailwind CSS and the existing next-themes package. Fonts are served locally; their licenses are in `public/fonts`.

## Design

The homepage pairs a short personal introduction with **The Smallest Change**: four joined, notched surfaces and one editable requirement. Making an optional MCP input required opens only surfaces whose demo inventory references the changed tool. The unrelated eval stays still. There is no timeline, automatic playback, neural-network graphic or project gallery.

The example is grounded in a pinned revision of MCP Impact's fictional demo. The comparison runs locally and derives its three potential impacts from exact tool references. Selecting a surface reveals the evidence and demo path. A separate explanation identifies what the check cannot prove: no consumers are executed, and no runtime failures are confirmed.

An asymmetric silhouette, off-centre seam, stone surfaces and ochre revealed edges replace the previous woven scene. Motion is a bounded response to the visitor's change, not a repeating effect. Reduced motion gives an immediate static change. The homepage uses a compact laptop composition and a shallower stacked phone layout. Expanded evidence can scroll naturally. The original project sketches remain on the Projects page.

## Content and routes

- `app/lib/content.ts`: nine projects, focus areas, implementation limits, reviewed revisions, evidence links, profiles, resume and article metadata.
- `app/lib/github-snapshot.json`: validated public GitHub metadata, refreshed independently of descriptions.
- `app/lib/trace-studies.ts`: conceptual relationships, endpoint labels and shared drawing geometry.
- `app/lib/smallest-change.ts`: pinned demo inventory, contract and narrow optional-to-required comparison.
- `app/components/smallest-change.tsx` and its CSS module: the homepage interaction and local evidence disclosure.
- `/`: the complete essential About Me introduction and an interactive contract-change example. Projects and writing are available through shared navigation.
- `/projects`: a compact filterable index with implementation details, honest limits, source evidence and a real repository screenshot. Filters support shareable `?focus=ai`, `?focus=developer` and `?focus=operations` URLs; project anchors open the relevant notes.
- `/blog`: the existing article plus selected repository guides and validation writing.
- `/blog/llm-routing`: full article, working contents links, routing diagrams and code copying.
- `/about`: a permanent redirect to `/` for existing bookmarks; there is no separate About page or navigation entry.

See [The Smallest Change notes](docs/smallest-change.md) for the current homepage. [The introduction notes](docs/introduction-world.md) record the retired five-stage scene. [The graph refinement notes](docs/graph-refinement.md) and [earlier refinement notes](docs/portfolio-refinement.md) document previous passes.

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

Use Node.js 24 for the checks. Set `BASE_URL` for a different port; optionally set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed browser. Unit checks cover contract isolation, data-derived impact, unchanged consumers, reversible updates, unknown execution results, preserved project evidence and snapshot handling. Browser checks cover selective motion, evidence disclosures, keyboard controls, laptop fit, mobile widths, no external requests, existing routes and features, dark-first loads, theme changes across navigation, reduced motion and WCAG A/AA rules. Screenshots and results go to the ignored `.qa/` directory.
