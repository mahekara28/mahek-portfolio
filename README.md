# Mahek Ara — a personal desktop

[Visit the portfolio](https://mahekara.vercel.app/)

A quiet charcoal desktop, a real portrait and a handwritten name. About, Writing, Projects and Contact are ordinary pages behind desktop folders. The introduction has no project feed.

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
```

Next.js App Router, React and TypeScript. The interface and headings use self-hosted Nunito; Mahek’s handwritten name uses Allura. Fonts, icons and the portrait are served locally. No analytics, external font requests or social API calls are needed to render the site.

## Routes and content

| Route | Contents |
| --- | --- |
| `/` | Portrait collage and introduction |
| `/blog` | Five short technical notes and the original routing essay |
| `/blog/[slug]` | Complete, statically generated articles with source links |
| `/blog/llm-routing` | Original article, diagrams, contents links and code copying |
| `/projects` | Context Relay and Build, Buy or Borrow; earlier experiments in a disclosure |
| `/contact` | Email, GitHub, X and LinkedIn |
| `/desktop` | Closed-window view; folders remain available |
| `/about` | Permanent redirect to the introduction |

The shared layout is `app/components/site-shell.tsx`. Window controls use real routes, so refresh, browser history and direct links work. Escape closes the current window and returns focus to its folder. Folder navigation and reading work without JavaScript; the theme switch and clipboard actions are enhancements.

Fresh documents start in charcoal. The stone theme lasts through client navigation. Mobile uses the same four folders in a horizontal row, with ordinary page scrolling. Reduced motion disables transitions. Projects remain outside the home introduction; earlier project anchors still reveal the relevant archive entry. Old `?focus=` links resolve to the complete project page, with their anchor preserved.

- `app/lib/writing.ts`: five articles, source references and reading-time calculation.
- `app/lib/content.ts`: project descriptions, scope, pinned evidence and contact links.
- `app/lib/github-snapshot.json`: optional public repository metadata snapshot.
- `docs/desktop-studio.md`: visual references, asset provenance and verification scope.

Past visual-study components and their data remain in the repository as retired experiments; active routes do not import them. Existing artifact/content unit tests remain available.

## Verify and deploy

```sh
npm run lint
npm run build
npm run start
# In another terminal, against that local server:
npx playwright install chromium
npm run verify
```

Set `BASE_URL` if the server uses another port. `PLAYWRIGHT_EXECUTABLE_PATH` can select an installed browser. Browser checks cover desktop and 320px layouts, both themes, keyboard navigation, close/reopen focus, history, project anchors, all articles, clipboard actions, the real portrait, no-JavaScript reading, 404s and WCAG A/AA rules. Reports and screenshots are written to the ignored `.qa/` folder.

The existing Vercel integration deploys `main`. Branch pushes create previews. No new hosting account or deployment credentials are required.

## Source review

Project claims refer to public code and include implementation limits. Context Relay is a public npm beta; live model-quality evaluation is pending. Build, Buy or Borrow uses fictional scenarios. The inference note describes a measurement method, not benchmark results.

Refresh optional repository metadata with `npm run content:refresh` (or `-- --force`). This is a local refresh-and-deploy workflow. It does not change reviewed descriptions or pinned evidence automatically. See the original [content audit](docs/content-audit.md) for the earlier repository review.
