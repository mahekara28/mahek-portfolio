# Mahek Ara - portfolio

A personal portfolio with an interactive technical introduction, a separate nine-project index, writing and an About page. Project descriptions are backed by public source code.

## Run locally

```sh
npm ci
npm run dev
```

The application uses Next.js App Router, React, TypeScript, Tailwind CSS and the existing next-themes package. Fonts are served locally; their licenses are in `public/fonts`.

## Design

The homepage asks one question: what changes when the evidence changes? A large SVG sketch lets visitors follow the same build question with a useful log, no log, or an instruction quoted inside the log. The paths and outcome follow deterministic local rules. Selecting a decision point explains its role in that case. No project cards or gallery are displayed on the homepage.

The homepage retains the site's limestone and ink themes. Teal carries the evidence path, amber marks a request for more context, and rust marks untrusted instructions. Its colour additions and layout live in a CSS module; the rest of the site's styles are unchanged by this pass.

Signals travel once on load or after changing a case. A replay control follows the current route again. There is no perpetual movement, pointer tracking, API dependency or model inference. Native buttons support touch, Tab, Enter and arrow keys. Reduced motion keeps the final paths visible and removes the animated signal and replay control. Mobile uses a separate vertical topology with full-size labels. The original six project sketches remain in expanded project notes.

## Content and routes

- `app/lib/content.ts`: nine projects, focus areas, implementation limits, reviewed revisions, evidence links, profiles, resume and article metadata.
- `app/lib/github-snapshot.json`: validated public GitHub metadata, refreshed independently of descriptions.
- `app/lib/trace-studies.ts`: conceptual relationships, endpoint labels and shared drawing geometry.
- `app/lib/decision-sketch.ts`: predefined examples, deterministic decisions, inspection notes and desktop/mobile path geometry.
- `app/components/decision-world.tsx` and its CSS module: the homepage's interactive scene.
- `/`: a short personal introduction and a conceptual decision sketch. The wider portfolio is available through shared navigation.
- `/projects`: a compact filterable index with implementation details, honest limits, source evidence and a real repository screenshot. Filters support shareable `?focus=ai`, `?focus=developer` and `?focus=operations` URLs; project anchors open the relevant notes.
- `/blog`: the existing article plus selected repository guides and validation writing.
- `/blog/llm-routing`: full article, working contents links, routing diagrams and code copying.
- `/about`: background and interests.

See [the introduction notes](docs/introduction-world.md) for the current homepage. [The graph refinement notes](docs/graph-refinement.md) and [earlier refinement notes](docs/portfolio-refinement.md) document previous passes.

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

Use Node.js 24 for the checks, which also test the TypeScript geometry directly. Set `BASE_URL` for a different port. Optionally set `PLAYWRIGHT_EXECUTABLE_PATH` to use an installed browser. Tests cover decision invariants, example limitations, preserved project evidence, snapshot validation, caching and network failure handling. Browser checks cover all cases and inspection points, keyboard controls, bounded animation, mobile label collisions, no external requests, all routes and existing project/navigation features, both themes, reduced motion and WCAG A/AA rules. Screenshots and results are written to the ignored `.qa/` directory.
