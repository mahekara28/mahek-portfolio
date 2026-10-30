# Desktop studio — October 2026

## Direction

The current direction is a light sage desktop with cream windows, muted green accents and dimensional app icons. The owner’s screenshot supplies the portrait treatment: a tilted photo print over lined paper with translucent tape, centered above the handwritten name. The beach wallpaper remains retired. Work and writing live in their own apps, and the introduction points directly to both. A closed window reveals “Mahek Ara” in the same signature font.

References: [ZenML](https://www.zenml.io/) (reviewed October 30, 2026) for generous medium-weight headings, monospace labels, muted surfaces, rounded actions and fine texture; [PostHog](https://posthog.com/) for the desktop metaphor; [April Leihuanani](https://aprilleihuanani.com/) for a personal portrait collage; [TypeUI Agentic public preview](https://www.typeui.sh/design-skills/agentic) for editorial typography and spacing. No source code or proprietary assets from those sites were copied. TypeUI’s paid skill file was not installed; the public preview informed the design.

## Assets

- `public/images/mahek-ara.jpg`: Mahek’s X avatar, supplied for use by the owner through https://x.com/mahekara28/photo. Source image: https://pbs.twimg.com/profile_images/2096128423227981824/mWcidAQx.jpg. Downloaded October 30, 2026. The image content is unchanged; its crop, photo border, lined backing paper and tape are CSS.
- Allura (signature) and Nunito (interface and body): self-hosted under `public/fonts` with each family’s SIL Open Font License. Nunito uses the Latin variable WOFF2 distribution from Google Fonts. No font service requests are made at build or runtime. PostHog uses RoundHog, but its [brand license](https://github.com/PostHog/brand/blob/main/LICENSE) prohibits use in another project, so this site uses the open-license rounded alternative.
- Existing Hanken Grotesk supplies the medium-weight editorial headings; its bundled SIL Open Font License is retained. The reference uses Borna; no font files from ZenML are copied.
- `public/images/desktop-grain.svg`: original, static SVG turbulence used at low opacity behind the desktop. No third-party wallpaper.
- Existing Plex Mono remains for code and small interface labels. Its existing license is retained.
- `app/components/desktop-icon.tsx`: original SVG profile-card, notebook, folder, envelope and resume illustrations. Rounded tiles, gentle shading and familiar objects take inspiration from desktop app icons; no Apple artwork is bundled. Lucide supplies the window-control symbols and reset icon under the installed package’s ISC license.

- Resume: the existing Google Drive link from the earlier portfolio, restored from repository history. Verified on October 30, 2026: the public viewer responds with “Mahek_Ara_Resume.pdf”. LinkedIn and GitHub links retain the established profile URLs. External profiles and the PDF open only after activation.

## Content

The five notes are complete, short essays about reviewed handoffs, context selection, decision assumptions, inference latency and artifact verification. Synthetic examples and the unperformed inference experiment are explicitly identified. The original routing essay keeps its URL and content. Project evidence is pinned; Context Relay was reviewed at `4e52ada45c471f17a94b16b2d81ed6636495f0f7`.

The earlier project index is available as an archive inside Projects. The old query filter is retired; project hash links still open the archive automatically. Source code and implementation links remain available for every project.

## Interaction and checks

The desktop frame is a persistent App Router layout sized to the browser viewport. Its shell remains stationary while the window content scrolls. Pages are server rendered and statically generated. New routes reset inner scroll position, Back/Forward restores it, and hash links scroll the same inner container. Printing removes desktop chrome and positional transforms.

Pointer events support mouse, pen and touch dragging of title bars and all five shortcuts. Pointer capture starts on press so fast movements do not lose the target; a six-pixel threshold distinguishes a click from a drag. A completed drag suppresses that pointer’s click, including the external resume link. Positions are clamped so the whole item remains inside the workspace. Routes keep the arrangement; viewport resizing resets it to a responsive default. Reset layout is always available. Title-bar arrow keys and shortcut Alt + arrow keys provide keyboard movement; Shift uses smaller steps.

The Mac-style controls have explicit accessible names: red closes, yellow minimizes, green maximizes/restores. Minimize hides the window without unmounting its reading content. The app or footer button restores it. Maximize fills the viewport, makes covered desktop controls inert, and preserves the dragged position for Restore. Closing navigates to `/desktop`, shows the handwritten name and returns focus to the app. Five shortcuts remain in a row on narrow screens. Resume opens the original Google Drive PDF in a new tab; compact social icons sit in the menu bar.

The browser suite checks desktop, 320px and short landscape layouts, the light appearance against a dark system preference, app and window movement, keyboard placement, drag-versus-click behavior, minimize reading-position retention, maximize/restore, reset, internal wheel/keyboard scrolling, close/reopen focus, history, article copying, project anchors, no-JavaScript reading, error routes and axe WCAG A/AA rules. Automated accessibility checks do not replace a full assistive-technology audit. Visual review covers desktop, mobile and the closed desktop.
