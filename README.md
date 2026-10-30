# Mahek Ara — a personal desktop

[Visit the portfolio](https://mahekara.vercel.app/)

A Graphite desktop with a Soft ivory light mode, fixed sage app icons, draggable windows, a layered photo print and a handwritten name. About, Writing, Projects and Contact open ordinary pages. The introduction has no project feed.

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
| `/blog` | The Context Relay technical deep dive |
| `/blog/context-relay` | Statically generated article with architecture diagrams, contents links and source references |
| `/projects` | Context Relay, Aura for LinkedIn, then Build, Buy or Borrow; earlier experiments in a disclosure |
| `/contact` | Email, GitHub, X and LinkedIn |
| `/desktop` | Closed-window view; folders remain available |
| `/about` | Permanent redirect to the introduction |

The shared layout is `app/components/site-shell.tsx`. Red closes the window, yellow minimizes it, and green maximizes or restores it. Minimizing keeps the content and reading position; the footer or the app icon reopens the window. Closing shows Mahek’s handwritten name on the desktop and returns focus to the app. Escape restores a maximized window, then closes a floating one.

Drag the title bar to move a window within the workspace. The four app icons stay in place. With the title focused, arrow keys move the window; Shift makes smaller moves. Reset window restores its default position. Window position survives page navigation; resizing the viewport restores the default to keep controls reachable. Only the window’s content scrolls. New pages start at the top, while Back/Forward restores reading positions. Ordinary links and reading work without JavaScript.

The site starts in Graphite: neutral charcoal surfaces, off-white text and restrained lilac accents. The menu-bar theme control switches to Soft ivory, a lighter cream-and-sage appearance. The choice persists across navigation and reloads in the dedicated `mahek-appearance` storage key; `next-themes` applies it before hydration. The centered portrait uses a tilted photo print, lined paper and translucent tape, following the owner’s screenshot. The original four sage icons retain their artwork, colors, dimensions and fixed positions in both themes. Icons, fonts and the portrait are local assets. The menu bar has an MA logo linking home, plus compact GitHub, LinkedIn and X links. Mobile has a four-app row and internal window scrolling. Reduced motion disables transitions. Projects stay outside the home introduction; older project anchors still reveal the relevant archive entry.

Selected work uses the Context Relay npm banner from its repository in a theme-matched, mobile-aware cover. Aura uses its four-theme gallery. Build, Buy or Borrow uses a new cover composed from a real sample screenshot of its scenario studio. The project covers, source files and provenance are recorded in [`public/projects/ASSETS.md`](public/projects/ASSETS.md).

- `app/lib/writing.ts`: the Context Relay article, source references and reading-time calculation.
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

Set `BASE_URL` if the server uses another port. `PLAYWRIGHT_EXECUTABLE_PATH` can select an installed browser. Browser checks cover desktop, 320px and short landscape layouts, both appearances, keyboard theme switching, persistence after navigation and reloads, fixed icon positions, window dragging and keyboard placement, project order and artwork, window reset, minimize/restore, internal scrolling, maximize/restore, keyboard navigation, close/reopen focus, reading-position history, project anchors, the Context Relay article, clipboard actions, the real portrait, no-JavaScript reading, 404s and WCAG A/AA rules. Reports and screenshots are written to the ignored `.qa/` folder.

The existing Vercel integration deploys `main`. Branch pushes create previews. No new hosting account or deployment credentials are required.

## Source review

Project claims refer to public code and include implementation limits. Context Relay is a public npm beta; live model-quality evaluation is pending. Build, Buy or Borrow uses fictional scenarios. Aura for LinkedIn is a locally loaded Chrome extension; its four-theme gallery is copied from the source repository's `docs/images/theme-collection.jpg`, with image provenance in [`public/projects/ASSETS.md`](public/projects/ASSETS.md). Its current version still needs installed LinkedIn verification.

Refresh optional repository metadata with `npm run content:refresh` (or `-- --force`). This is a local refresh-and-deploy workflow. It does not change reviewed descriptions or pinned evidence automatically. See the original [content audit](docs/content-audit.md) for the earlier repository review.
