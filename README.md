# Mahek Ara — A universe in progress

A spatial portfolio made of five connected scenes. The landing scene is a constellation of floating destinations; navigation travels through a moving star field. Work, About, Notes, and Contact each have their own composition.

For replacing the existing Vercel portfolio, start with [DEPLOYMENT_HANDOFF.md](DEPLOYMENT_HANDOFF.md).

## Run locally

Use Node.js 20 or newer. There is nothing to install.

```powershell
cd "C:\Users\Mehek\Documents\Codex\2026-09-13\create-an-image-of\portfolio"
npm run dev
```

Open http://127.0.0.1:4173. Keep the terminal running. Do not open `index.html` directly with `file://`; the project uses JavaScript modules and loads its content from JSON.

## What is included

- Original procedural nebula and a depth-based star field, generated in WebGL and Canvas.
- Five scenes with camera transitions, pointer parallax, suspended artwork, and shooting stars.
- An orbit-shaped navigation control and a full-screen constellation menu.
- Three selected projects: Context Relay, Aura, and Build, Buy & Borrow, with source links and project notes.
- Three complete articles with references and their original illustrations.
- Existing bio, résumé, and contact links from Mahek’s earlier portfolio.
- Original orbital line sculpture in place of the portrait; subtle pointer glow and topic filters for writing.
- Mobile layouts, native keyboard-accessible dialogs, Escape dismissal, and clear text-based controls.
- Automatic background shooting stars every few seconds, with an optional “Make a wish” interaction. There is no on-page motion toggle; the device’s reduced-motion setting is respected. CSS artwork remains available when WebGL is unavailable.
- No paid libraries, subscriptions, accounts, API keys, analytics, or external font requests.

## Edit

- `content.json`: projects and full article content. Content descriptions preserve the source portfolio’s stated prototype limits.
- `index.html`: biography, social links, landing composition, and scene structure.
- `styles.css`: core spatial layout, motion, responsive styles, and scene appearance.
- `refinements.css`: the responsive application grid, reading typography, the orbital sculpture, and the interactive editorial index.
- `app.js`: navigation, project artwork, readers, and interaction behavior.
- `sky.js`: procedural nebula, star volume, camera motion, and shooting stars.

The imported project descriptions are a snapshot, not a live GitHub sync. Edit `content.json` when a project changes. For consistency, update contact links in `index.html` and the email-copy text in `app.js` together.

## Export

```powershell
npm run check
npm run build
```

Upload the contents of `dist/` to a static host. Relative asset paths also support hosting under a repository subpath.

`vercel.json` configures Vercel to build this static site and serve `dist/` when placed at the root of the connected repository. The deployment handoff covers migration from the existing Next.js project and its legacy URLs.

Old portfolio paths still resolve. `/projects`, `/contact`, and `/blog` open Work, Contact, and Writing. `/about` opens About. `/desktop` opens the home scene, because the desktop window is no longer a separate page. `/blog/agent-cloud-workload`, `/blog/agent-latency`, and `/blog/context-relay` open those essays. `/blog/working-context` opens the Context Relay essay. `/blog/decision-assumptions`, `/blog/inference-latency`, `/blog/verify-the-result`, and `/blog/llm-routing` open Writing. Unknown paths stay missing instead of falling through to the home page.

For a zero-cost hosting option, GitHub Pages is available for public repositories on GitHub Free, using a `github.io` URL. A purchased custom domain is optional. See [GitHub’s hosting documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

To use GitHub Pages, put the exported files at the root of a new public repository, then choose that branch and root folder as the Pages publishing source. Publishing is a separate step; this deliverable is a local preview and source package.

## Assets and licenses

Instrument Sans, Fraunces, and IBM Plex Mono are bundled with their license files in `assets/fonts/`. The article assets were copied from Mahek’s existing portfolio. Context Relay’s original attribution remains in `assets/images/context-relay/THIRD_PARTY_LICENSE.txt`. The new nebula, star field, project diagrams, monogram, and interface are code-native assets authored for this portfolio.
