# Mahek Ara - portfolio

A personal portfolio with a short introduction, six selected projects, writing and a nine-project index. Project descriptions are backed by public source code.

## Run locally

```sh
npm ci
npm run dev
```

The application uses Next.js App Router, React, TypeScript, Tailwind CSS and the existing next-themes package. Fonts are served locally; their licenses are in `public/fonts`.

## Design

The homepage pairs a readable project list with a smaller sixty-line sketch. Names link directly to project notes; separate preview controls change the sketch. RouterFlow leads, followed by developer experience, MCP tooling, security and planning work. Context Relay is one of the six, not the homepage's subject.

These drawings are conceptual studies, not benchmark results or live project telemetry. Their labels and the accompanying text connect them to the actual work.

Motion is limited to a 540 ms transition after a project selection. Interrupted transitions continue from the visible geometry. The canvas stops drawing once settled, respects reduced motion, and caps rendering resolution. Preview controls support arrow keys. On phones, an explicit preview brings the sketch into view; project names still navigate directly to the implementation notes.

## Content and routes

- `app/lib/content.ts`: nine projects, focus areas, implementation limits, reviewed revisions, evidence links, profiles, resume and article metadata.
- `app/lib/github-snapshot.json`: validated public GitHub metadata, refreshed independently of descriptions.
- `app/lib/trace-studies.ts`: conceptual relationships, endpoint labels and shared drawing geometry.
- `/`: a personal introduction, six short project summaries and one writing link.
- `/projects`: a compact filterable index with implementation details, honest limits, source evidence and a real repository screenshot. Filters support shareable `?focus=ai`, `?focus=developer` and `?focus=operations` URLs; project anchors open the relevant notes.
- `/blog`: the existing article plus selected repository guides and validation writing.
- `/blog/llm-routing`: full article, working contents links, routing diagrams and code copying.
- `/about`: background and interests.

See [the refinement notes](docs/portfolio-refinement.md) for research sources and the decisions behind the shorter presentation.

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

Use Node.js 24 for the checks, which also test the TypeScript geometry directly. Set `BASE_URL` for a different port. Optionally set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed browser. Content tests cover evidence relationships, snapshot validation, caching, rate limits, missing repositories and network failures. Browser checks cover all routes, mobile overflow, six trace states and label collisions, shareable filters and browser history, field notes, the project image, persisted themes, short-screen drawer fit, reduced motion, canvas output and WCAG A/AA accessibility rules. Screenshots and results are written to the ignored `.qa/` directory.
