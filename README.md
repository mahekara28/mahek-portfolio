# Mahek Ara - portfolio

A personal portfolio with a short introduction, three selected projects, writing and a nine-project index. Project descriptions and graph connections are backed by public source code.

## Run locally

```sh
npm ci
npm run dev
```

The application uses Next.js App Router, React, TypeScript, Tailwind CSS and the existing next-themes package. Fonts are served locally; their licenses are in `public/fonts`.

## Design

The homepage connects RouterFlow, MCP Impact and Narrative Gap MCP through the tools and concerns they actually share. Selecting a project traces its connections and reveals a pinned source link. Three concise entries lead to project details; all nine projects remain in the index, including Context Relay.

The palette pairs warm limestone, charcoal ink, petrol teal and a restrained brass accent. Dark mode uses blue-black ink surfaces, warm text and softer teal. Both modes use shared semantic colour tokens, including the retained flow sketches inside project details.

The graph draws selected connections once in 500 ms, with no perpetual movement or pointer tracking. Its native buttons support keyboard, touch and arrow-key selection. Reduced motion settles immediately. Project names remain ordinary links, independent of the map. The original six flow sketches remain conceptual illustrations in expanded project notes, not live telemetry or benchmark results.

## Content and routes

- `app/lib/content.ts`: nine projects, focus areas, implementation limits, reviewed revisions, evidence links, profiles, resume and article metadata.
- `app/lib/github-snapshot.json`: validated public GitHub metadata, refreshed independently of descriptions.
- `app/lib/trace-studies.ts`: conceptual relationships, endpoint labels and shared drawing geometry.
- `app/lib/work-connections.ts`: curated project-topic relationships, positions and pinned source paths.
- `/`: a personal introduction, one interactive map, three short project summaries and one writing link.
- `/projects`: a compact filterable index with implementation details, honest limits, source evidence and a real repository screenshot. Filters support shareable `?focus=ai`, `?focus=developer` and `?focus=operations` URLs; project anchors open the relevant notes.
- `/blog`: the existing article plus selected repository guides and validation writing.
- `/blog/llm-routing`: full article, working contents links, routing diagrams and code copying.
- `/about`: background and interests.

See [the graph refinement notes](docs/graph-refinement.md) for the current direction and [the earlier refinement notes](docs/portfolio-refinement.md) for the copy reduction and portfolio research.

Light mode is the first-visit default. An explicit theme choice persists across routes and reloads. Navigation is shared across all pages; the mobile drawer uses a native modal dialog with focus containment and Escape dismissal.

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

Use Node.js 24 for the checks, which also test the TypeScript geometry directly. Set `BASE_URL` for a different port. Optionally set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed browser. Content tests cover the three-project limit, graph evidence, snapshot validation, caching, rate limits, missing repositories and network failures. Browser checks cover all routes, graph selection and label collisions, the six retained sketches, shareable filters and browser history, source links, the project image, persisted themes, short-screen drawer fit, reduced motion, canvas output and WCAG A/AA accessibility rules. Screenshots and results are written to the ignored `.qa/` directory.
