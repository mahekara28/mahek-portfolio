# Cursor handoff: replace Mahek's Vercel portfolio

## The task

Deploy this finished space portfolio as the replacement for Mahek's existing portfolio. Keep the existing Vercel project and production domain if they are still attached to the GitHub repository below. First make a preview deployment, verify it, and only then release to the production branch. The current live site is untouched by this handoff.

## Exact locations

- **New editable source:** `C:\Users\Mehek\Documents\Codex\2026-11-17\i-w\outputs\mahek-orbit`
- **Portable source ZIP:** `C:\Users\Mehek\Documents\Codex\2026-11-17\i-w\outputs\mahek-space-portfolio.zip`
- **Generated static output:** `C:\Users\Mehek\Documents\Codex\2026-11-17\i-w\outputs\mahek-orbit\dist` (rebuild; do not edit by hand)
- **Existing Next.js portfolio checkout:** `C:\Users\Mehek\Documents\Codex\2026-09-13\create-an-image-of\portfolio`
- **Existing Git remote:** `https://github.com/mahekara28/mahek-portfolio.git`
- **Existing checkout branch:** `main`, tracking `origin/main` when inspected on 18 November 2026; both local refs resolved to `7131da9e33038d3de635bbb18fe51372c994d51b`, and the worktree was clean. Fetch again before starting because the remote may have advanced.
- **Production URL recorded by the old repo:** `https://mahekara.vercel.app/`. Confirm its current domain and the connected repository/production branch in Vercel before changing deployment settings. No local `.vercel/project.json` was found, so the Vercel project ID is unknown here.

The new site is not a Git checkout and is not yet pushed or deployed. The `127.0.0.1:4173` link is only a local development server.

## Product and file map

This is a static HTML/CSS/JavaScript app with five scenes: Universe, Work, About, Writing and Contact. It includes an original orbital sculpture instead of a portrait, a procedural nebula/star field with shooting stars, a floating star map, three selected projects (Context Relay, Aura, Build, Buy & Borrow), and three full essays. No runtime package, API key, paid asset or external font service is needed. The site honors the device's reduced-motion preference.

| File | Purpose |
| --- | --- |
| `index.html` | Scene structure, biography, navigation, contact/social links, metadata |
| `content.json` | The three project records and full text of three essays |
| `app.js` | Scene routing, project/article rendering, filters, reader dialogs, hover behavior |
| `sky.js` | Procedural background, parallax, shooting stars |
| `styles.css` | Base design and component rules |
| `refinements.css` | Final responsive layout and typography; loaded after `styles.css` |
| `assets/` | Local fonts, article media, favicon and the original orbital SVG; retain license files |
| `scripts/build.mjs` | Cleans and regenerates `dist/` |
| `scripts/validate.mjs` | Checks local references and content structure |
| `vercel.json` | Versioned static Vercel build settings |

Do not restore the old portrait file or old Next.js Open Graph portrait from the existing repo. Project descriptions preserve the stated prototype limits; do not turn them into unsupported production claims.

## Migration plan for the existing Vercel project

1. In the old checkout, fetch the current `origin/main`, read its `AGENTS.md`, and create a working branch from the latest production commit. Its present `AGENTS.md` describes Next.js; update those instructions if Next.js is fully removed. Keep Git history and the current production deployment as a rollback point.
2. Replace the old Next.js application with the contents of the **new editable source** folder. Copy `index.html`, `styles.css`, `refinements.css`, `app.js`, `sky.js`, `content.json`, `package.json`, `vercel.json`, `.gitignore`, `scripts/`, `assets/`, and the documentation. Do not copy `dist/`, the outer `outputs/` folder, the ZIP, previews or temporary `work/` files. Remove obsolete Next.js app/config/public files and the old Next.js `package-lock.json`; a mismatched lockfile can trigger an unwanted install. Review the diff before committing.
3. Keep `vercel.json` at the **root of the connected Git repository**. It selects Framework Preset `Other`, runs `npm run build`, skips dependency installation, and serves only `dist/`. The project Root Directory should remain the repository root (`.`). Versioned configuration overrides the earlier Next.js build settings. Confirm the dashboard does not impose a different root directory or a conflicting ignore-build rule.
4. Run `npm run check` and `npm run build` from that repository root. Check that `dist/index.html`, `dist/content.json`, `dist/app.js`, `dist/assets/` and the license files exist. For a local preview run `npm run dev` and visit `http://127.0.0.1:4173/`. Do not use `file://` because the app loads a JavaScript module and fetches JSON.
5. Push the working branch and inspect its Vercel preview deployment. A branch/PR preview should be verified before merging to `main` (assuming the project still tracks `main`). Compare the preview's served `index.html` and assets with the local build, check browser console and network failures, and verify desktop, tablet, 390px and 360px phone layouts.
6. Test all five scenes, the star map, all three projects and their source links, project notes, writing filters and full essay readers, keyboard/Escape behavior, links, shooting stars, and reduced motion. Confirm no horizontal scrolling at narrow phone widths. Check the contact email and résumé link. Verify the page title, description, favicon and social preview do not use the removed portrait.
7. **Preserve old URLs before production.** The current Next.js site serves `/blog`, `/blog/agent-cloud-workload`, `/blog/agent-latency`, `/blog/context-relay`, `/projects`, `/contact`, `/about`, `/desktop`, and redirects `/blog/working-context`, `/blog/decision-assumptions`, `/blog/inference-latency`, `/blog/verify-the-result`, and `/blog/llm-routing` in `next.config.ts`. The new app currently routes within `/` using hashes such as `/#work` and `/#notes`; the individual essay readers are opened in JavaScript. Implement and test redirects or compatible entry routes so old article URLs open the *correct* essay, and old scene URLs reach the right scene. Avoid a catch-all rewrite that hides missing assets or leaves old article bookmarks on the home screen. Consider distinct crawlable article URLs if search indexing matters.
8. Once the preview and legacy URLs pass, merge to the production branch or promote the approved preview through Vercel. Confirm the actual domain loads the new home, assets and legacy URLs. Record the deployment ID and the previous working production deployment.

If production fails, use Vercel's **Instant Rollback** to restore the previous deployment, then fix the branch and deploy again. On Vercel Hobby, instant rollback is limited to the immediately previous production deployment. A Git revert is the longer term source correction.

## Handoff boundaries

The source and static build have been validated locally. The deployment, Vercel project identity, remote branch freshness, preview URL and post-deploy behavior have **not** been verified here. The existing repo's README says its Vercel integration deploys `main`; confirm this in the dashboard. The new app's hash navigation means its previous Next.js page URLs need explicit migration work before release.

Official references: [Vercel build configuration](https://vercel.com/docs/project-configuration/vercel-json), [Git previews and production branches](https://vercel.com/docs/git), [Vercel rollback](https://vercel.com/docs/instant-rollback).
