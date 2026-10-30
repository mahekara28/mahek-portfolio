# Mahek Ara — a personal desktop

[Visit the portfolio](https://mahekara.vercel.app/)

A light sage desktop with movable app icons, draggable cream windows, a layered photo print and a handwritten name. About, Writing, Projects and Contact open ordinary pages; Resume opens Mahek’s existing PDF on Google Drive. The introduction has no project feed.

## Run locally

Use Node.js 24.

```sh
npm ci
npm run dev
```

Next.js App Router, React and TypeScript. The interface uses self-hosted Nunito and headings use Hanken Grotesk; Mahek’s handwritten name uses Allura. Fonts, icons and the portrait are served locally. No analytics, external font requests or social API calls are needed to render the site.

## Routes and content

| Route | Contents |
| --- | --- |
| `/` | Layered portrait, handwritten name and builder introduction |
| `/blog` | Five short technical notes and the original routing essay |
| `/blog/[slug]` | Complete, statically generated articles with source links |
| `/blog/llm-routing` | Original article, diagrams, contents links and code copying |
| `/projects` | Context Relay and Build, Buy or Borrow; earlier experiments in a disclosure |
| `/contact` | Email, GitHub, X and LinkedIn |
| `/desktop` | Closed-window view; folders remain available |
| `/about` | Permanent redirect to the introduction |

The shared layout is `app/components/site-shell.tsx`. Red closes the window, yellow minimizes it, and green maximizes or restores it. Minimizing keeps the content and reading position; the footer or the app icon reopens the window. Closing shows Mahek’s handwritten name on the desktop and returns focus to the app. Escape restores a maximized window, then closes a floating one.

Drag a title bar or any of the five app icons to arrange the desktop. Movement is bounded to the workspace. With the title focused, arrow keys move the window; Alt + arrow keys move focused app icons. Shift makes smaller moves. Reset layout restores the defaults. Positions survive page navigation; resizing the viewport resets them to keep all controls reachable. Only the window’s content scrolls. New pages start at the top, while Back/Forward restores reading positions. Ordinary links and reading work without JavaScript.

The site uses a single light sage-and-cream appearance with green accents and a fine static texture. The centered portrait uses a tilted photo print, lined paper and translucent tape, following the owner’s screenshot. Standalone sage icons have pale faces and shallow sculpted edges. Icons, fonts and the portrait are local assets. The menu bar has an MA logo linking home, plus compact GitHub, LinkedIn and X links. Mobile has a five-app row and internal window scrolling. Reduced motion disables transitions. Projects stay outside the home introduction; older project anchors still reveal the relevant archive entry.

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

Set `BASE_URL` if the server uses another port. `PLAYWRIGHT_EXECUTABLE_PATH` can select an installed browser. Browser checks cover desktop, 320px and short landscape layouts, the light appearance with a dark system preference, dragging and keyboard placement, drag-versus-click behavior, layout reset, minimize/restore, internal scrolling, maximize/restore, keyboard navigation, close/reopen focus, reading-position history, project anchors, all articles, clipboard actions, the real portrait, no-JavaScript reading, 404s and WCAG A/AA rules. Reports and screenshots are written to the ignored `.qa/` folder.

The existing Vercel integration deploys `main`. Branch pushes create previews. No new hosting account or deployment credentials are required.

## Source review

Project claims refer to public code and include implementation limits. Context Relay is a public npm beta; live model-quality evaluation is pending. Build, Buy or Borrow uses fictional scenarios. The inference note describes a measurement method, not benchmark results.

Refresh optional repository metadata with `npm run content:refresh` (or `-- --force`). This is a local refresh-and-deploy workflow. It does not change reviewed descriptions or pinned evidence automatically. See the original [content audit](docs/content-audit.md) for the earlier repository review.
