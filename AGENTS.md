# Portfolio agent notes

This repository is a static site. There is no Next.js app, package install, or API key.

- Edit `content.json` for projects and essays, `index.html` for biography and links, `styles.css` and `refinements.css` for layout, `app.js` for interaction, and `sky.js` for the background.
- Run `npm run check`, then `npm run build`. The build writes `dist/` and does not install dependencies.
- Preview with `npm run dev` at http://127.0.0.1:4173/. Do not open `index.html` through `file://`.
- Keep `vercel.json` at the repository root. It selects a static build and serves `dist/`.
- Legacy URLs are listed in `vercel.json` and `scripts/serve.mjs`. Article entry uses `/#notes/<slug>` after a short query redirect. Do not add a catch-all rewrite.
- Do not restore the removed portrait or describe prototypes as production systems.
