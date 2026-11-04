# Desktop studio — October 2026

## Copy and theme polish

The About introduction now names Python, LLM context and learning with other
developers, without project names or a list of target roles. Introductory project
and contact copy is more direct. Decorative link arrows are removed from the
active pages; directional arrows within article diagrams still explain the flow.
Warm charcoal and paper surfaces use muted sage for actions and focus. The
centered portrait, local fonts, adaptive About sizing and window behavior remain.

## November 1 refinement

Reviewed the current public PostHog desktop and Ladybug studio in the browser.
PostHog informed the approachable desktop navigation; Ladybug informed the
restrained inset edges, tactile controls and hierarchy of the surrounding frame.
Neither site's assets or source code were copied. This pass starts from repository
revision `b125d49`, preserving the newer portrait, project artwork and article.

Dark mode now pairs charcoal-green surfaces with sage accents; light mode retains
the soft ivory palette. Fine grid lines sit behind the window. A shallow rim and
selected-app plate clarify the frame and active navigation without changing icon
artwork. The title-bar grip describes a real drag interaction, not a fake control.

The owner’s preferred composition is restored: the centered portrait above the
name, introduction and links. The refined frame and buttons remain.
The photo’s brief entrance is automatic and disabled for reduced motion.

Projects retain their source artwork, selected order, descriptions, disclosures
and links, with smaller corner radii and less shadow. Writing uses a numbered
editorial entry with a visible reading time. Existing drag, minimize, maximize,
close, keyboard and reading-position behavior is unchanged.

## Typography and interaction follow-up

The owner requested new fonts and an About window that needs no inner scrolling.
Instrument Sans now serves the interface and headings; Fraunces replaces the
large script name. Both Latin WOFF2 files are served locally (about 97 KB total),
with their SIL OFL licenses retained. Container queries size the portrait and
spacing to the actual available window height. Text is never clipped to force a
fit; very small or zoomed layouts can still scroll for accessibility.

[Himanshu Sangshetti](https://himanshusangshetti.com/) was inspected for small
interactive details and background texture, not its page layout or artwork.
The existing portrait straightens slightly on hover, app icons lift on hover or
keyboard focus, and action arrows follow their links. A single background grid
cell responds to a pointer over unused desktop space. It runs only on pointer
movement, is inactive over controls, and is disabled for touch and reduced
motion. There is no new mascot, copied illustration or perpetual animation.

Font sources: [Instrument Sans](https://github.com/google/fonts/tree/main/ofl/instrumentsans)
and [Fraunces](https://github.com/google/fonts/tree/main/ofl/fraunces). WOFF2 files
come from Google Fonts’ Latin subsets; each family’s OFL file is bundled locally.

## Direction

The current direction pairs Graphite dark mode (charcoal, off-white type and sage accents) with Soft ivory light mode (lighter cream-and-sage surfaces). Both retain the original small, sculpted sage app icons, including their artwork, colors and dimensions. The four icons remain fixed; Resume is absent from the desktop. The owner’s screenshot supplies the portrait treatment: a tilted photo print over lined paper with translucent tape. It is centered above the introduction and name. The beach wallpaper remains retired. Work and writing live in their own apps, and the introduction points directly to both. A closed window reveals a small pixel-flower sketch on graph paper, followed by “Mahek Ara” in the same Fraunces display font and a link back to the introduction. Its CSS animation grows a stem and unfolds eight petals once, then stops within three seconds.

References: [ZenML](https://www.zenml.io/) (reviewed October 30, 2026) for generous medium-weight headings, monospace labels, muted surfaces, rounded actions and fine texture; [PostHog](https://posthog.com/) for the desktop metaphor; [April Leihuanani](https://aprilleihuanani.com/) for a personal portrait collage; [TypeUI Agentic public preview](https://www.typeui.sh/design-skills/agentic) for editorial typography and spacing. No source code or proprietary assets from those sites were copied. TypeUI’s paid skill file was not installed; the public preview informed the design.

## Assets

- `public/images/mahek-ara.jpg`: Mahek’s X avatar, supplied for use by the owner through https://x.com/mahekara28/photo. Source image: https://pbs.twimg.com/profile_images/2096128423227981824/mWcidAQx.jpg. Downloaded October 30, 2026. The image content is unchanged; its crop, photo border, lined backing paper and tape are CSS.
- Earlier font assets, retained for provenance — Allura and Nunito: bundled under `public/fonts` with each family’s SIL Open Font License, but no longer loaded by the site. The current Instrument Sans and Fraunces files are also local. No reference site's font files were copied.
- Earlier Hanken Grotesk assets are retained; its bundled SIL Open Font License is retained. The reference uses Borna; no font files from ZenML are copied.
- `public/images/desktop-grain.svg`: original, static SVG turbulence used at low opacity behind the desktop. No third-party wallpaper.
- Existing Plex Mono remains for code and small interface labels. Its existing license is retained.
- `app/components/desktop-icon.tsx`: original standalone SVG house, notebook, code folder and contact laptop illustrations. The owner’s sidebar reference informs their pale sage faces, bright upper edges, shallow darker rims and compact scale. The previous colored square tiles are retired. No third-party icon artwork is bundled. Lucide supplies the window-control symbols and reset icon under the installed package’s ISC license.

- `app/lib/pixel-flower.ts` contains the original eight-petal pixel-flower paths. `PixelFlower` shares them between the corner mark and the closed-desktop sketch. The flower is inspired by the one in Mahek’s portrait. `app/icon.svg` matches the mark; `app/favicon.ico` contains 16, 32, 48 and 64px PNG fallbacks. The favicon artwork is independent of the name’s display font.

- The Resume shortcut is temporarily removed. LinkedIn and GitHub links retain the established profile URLs. External profiles open only after activation.

## Content

“An Agent Is Becoming a Cloud Workload” is available at `/blog/agent-cloud-workload`. The owner selected the second, more conversational version from the supplied Notion document. Its wording and original architecture illustration are retained, with six core sources collected at the end. The article and image are hosted locally, without a Notion link or embed. Contents links group the continuous essay without inserting extra visible headings. No publication date was supplied.

Writing includes “The Model Was Fast. Why Did the Agent Take 12 Seconds?” at `/blog/agent-latency`, alongside the Context Relay deep dive. The new article retains the author-supplied text, illustration and four core research/documentation references at the end, without repeated inline lists. The article and its GIF are hosted locally, with no Notion link or embed. The GIF starts when the illustration comes into view, stops when it leaves view, and has a stop/play control. Reduced-motion preferences and no-JavaScript reading use the still frame. The source did not specify a publication date, so none is invented. Project evidence is pinned; Context Relay was reviewed at `4e52ada45c471f17a94b16b2d81ed6636495f0f7`.

The earlier project index is available as an archive inside Projects. The old query filter is retired; project hash links still open the archive automatically. Source code and implementation links remain available for every project.

## Interaction and checks

The desktop frame is a persistent App Router layout sized to the browser viewport. Its shell remains stationary while the window content scrolls. Pages are server rendered and statically generated. New routes reset inner scroll position, Back/Forward restores it, and hash links scroll the same inner container. Printing removes desktop chrome and positional transforms.

Pointer events support mouse, pen and touch dragging of title bars. Pointer capture starts on press so fast movements do not lose the target; a six-pixel threshold distinguishes a click from a drag. A completed drag suppresses that pointer’s click. Window movement is clamped to the workspace. Routes keep the window position; viewport resizing resets it to a responsive default. Reset window is always available. Title-bar arrow keys provide keyboard movement; Shift uses smaller steps. App shortcuts stay fixed and remain ordinary links.

The Mac-style controls have explicit accessible names: red closes, yellow minimizes, green maximizes/restores. Minimize hides the window without unmounting its reading content. The app or footer button restores it. Maximize fills the viewport, makes covered desktop controls inert, and preserves the dragged position for Restore. Closing navigates to `/desktop`, shows the name and returns focus to the app. Four shortcuts remain in a row on narrow screens; compact social icons sit in the menu bar.

The menu-bar theme button supports keyboard activation and saves the choice under `mahek-appearance`. Graphite is the first-visit default, including when the operating system prefers light mode. `next-themes` restores the saved choice before hydration; both button labels are server-rendered and CSS displays the appropriate one. Article surfaces, code examples, section highlights and original diagrams share the theme tokens. Embedded README images keep their source colors. Printing uses a light background in either theme.

The browser suite checks desktop, 320px and short landscape layouts, both appearances, theme persistence after navigation and reloads, unchanged icon artwork and dimensions, fixed icon positions, window movement, keyboard placement, project order and source artwork, minimize reading-position retention, maximize/restore, reset, internal wheel/keyboard scrolling, close/reopen focus, history, article copying, project anchors, no-JavaScript reading, error routes and axe WCAG A/AA rules. Automated accessibility checks do not replace a full assistive-technology audit. Visual review covers desktop, mobile and the closed desktop.
