# Desktop studio — October 2026

## Direction

The owner selected a personal desktop with a portrait collage, a cursive name and a beach wallpaper supplied in chat. White windows and blush title bars keep the pink restrained. A translucent menu bar and dimensional, Mac-inspired shortcut icons complete the desktop. The site uses one light appearance. The home view is a personal introduction. Work and writing live in their own folders.

References: [PostHog](https://posthog.com/) for the desktop metaphor; [April Leihuanani](https://aprilleihuanani.com/) for a personal portrait collage; [TypeUI Agentic public preview](https://www.typeui.sh/design-skills/agentic) for editorial typography and spacing. No source code or proprietary assets from those sites were copied. TypeUI’s paid skill file was not installed; the public preview informed the design.

## Assets

- `public/images/mahek-ara.jpg`: Mahek’s X avatar, supplied for use by the owner through https://x.com/mahekara28/photo. Source image: https://pbs.twimg.com/profile_images/2096128423227981824/mWcidAQx.jpg. Downloaded October 30, 2026. The photo is unchanged; the paper and tape are CSS.
- `public/images/beach-wallpaper.webp`: the beach photograph uploaded by the owner on October 30, 2026. The 3000×1994 PNG was resized to 2400×1595 and encoded as WebP (about 200 KiB); Next.js serves responsive sizes. The photograph is used as supplied, with no generated scenery or external image service.
- Allura (signature) and Nunito (interface, headings): self-hosted under `public/fonts` with each family’s SIL Open Font License. Nunito uses the Latin variable WOFF2 distribution from Google Fonts. No font service requests are made at build or runtime. PostHog uses RoundHog, but its [brand license](https://github.com/PostHog/brand/blob/main/LICENSE) prohibits use in another project, so this site uses the open-license rounded alternative.
- Existing Plex Mono remains for code. Its existing license is retained.
- `app/components/desktop-icon.tsx`: original SVG profile-card, notebook, folder and envelope illustrations. Rounded tiles, gentle shading and familiar objects take inspiration from desktop app icons; no Apple artwork is bundled. Lucide remains for the window controls under the installed package’s ISC license.

## Content

The five notes are complete, short essays about reviewed handoffs, context selection, decision assumptions, inference latency and artifact verification. Synthetic examples and the unperformed inference experiment are explicitly identified. The original routing essay keeps its URL and content. Project evidence is pinned; Context Relay was reviewed at `4e52ada45c471f17a94b16b2d81ed6636495f0f7`.

The earlier project index is available as an archive inside Projects. The old query filter is retired; project hash links still open the archive automatically. Source code and implementation links remain available for every project.

## Interaction and checks

The desktop frame is a persistent App Router layout sized to the browser viewport. Its menu, folders and footer stay stationary; only the content below the window title bar scrolls. Content remains server rendered and statically generated. New routes reset the inner scroll position, Back/Forward restores it, and hash links scroll the same inner container. Printing expands the content into ordinary document flow.

Maximize fills the browser viewport and keeps the title bar available. Covered desktop controls are inert until Restore or Escape returns the floating window. Closing navigates to `/desktop` and returns focus to the corresponding folder; Escape closes a window that is already restored. The four existing folder icons remain available in a horizontal row on mobile. No draggable or minimize controls are shown.

The browser suite checks the light appearance at desktop and 320px widths even when the system and an old stored preference request dark mode. It also checks wallpaper loading, internal wheel/keyboard scrolling, stable folder and title-bar positions, maximize/restore at desktop, mobile and short landscape sizes, keyboard focus, close/reopen, reading-position history, article copying, source links, archive anchors, no-JavaScript reading, error routes and axe WCAG A/AA rules. Automated accessibility checks do not replace a full assistive-technology audit. Visual inspection covers the portrait composition, the signature, wallpaper cropping, icon clarity and label contrast over the photograph.
