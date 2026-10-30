# Desktop studio — October 2026

## Direction

The owner selected a personal desktop with a portrait collage, a cursive name, restrained olive/cream colors and very little pink. The home view is a personal introduction. Work and writing live in their own folders.

References: [PostHog](https://posthog.com/) for the desktop metaphor; [April Leihuanani](https://aprilleihuanani.com/) for a personal portrait collage; [TypeUI Agentic public preview](https://www.typeui.sh/design-skills/agentic) for editorial typography and spacing. No source code or proprietary assets from those sites were copied. TypeUI’s paid skill file was not installed; the public preview informed the design.

## Assets

- `public/images/mahek-ara.jpg`: Mahek’s X avatar, supplied for use by the owner through https://x.com/mahekara28/photo. Source image: https://pbs.twimg.com/profile_images/2096128423227981824/mWcidAQx.jpg. Downloaded October 30, 2026. The photo is unchanged; the paper and tape are CSS.
- Allura (signature) and Nunito (interface, headings): self-hosted under `public/fonts` with each family’s SIL Open Font License. Nunito uses the Latin variable WOFF2 distribution from Google Fonts. No font service requests are made at build or runtime. PostHog uses RoundHog, but its [brand license](https://github.com/PostHog/brand/blob/main/LICENSE) prohibits use in another project, so this site uses the open-license rounded alternative.
- Existing Plex Mono remains for code. Its existing license is retained.
- Lucide provides the four folder icons, theme controls and close icon under the installed package’s ISC license.

## Content

The five notes are complete, short essays about reviewed handoffs, context selection, decision assumptions, inference latency and artifact verification. Synthetic examples and the unperformed inference experiment are explicitly identified. The original routing essay keeps its URL and content. Project evidence is pinned; Context Relay was reviewed at `4e52ada45c471f17a94b16b2d81ed6636495f0f7`.

The earlier project index is available as an archive inside Projects. The old query filter is retired; project hash links still open the archive automatically. Source code and implementation links remain available for every project.

## Interaction and checks

The desktop frame is a persistent App Router layout. Folders are links; content is server rendered and statically generated. Closing a window navigates to `/desktop`; Escape uses the same destination and returns focus to the corresponding folder. Browser history and direct article URLs remain meaningful. There are no pretend draggable controls or inactive minimize/maximize buttons.

The browser suite checks both palettes at desktop and 320px widths, keyboard focus, close/reopen, history, article copying, source links, archive anchors, no-JavaScript reading, error routes and axe WCAG A/AA rules. Automated accessibility checks do not replace a full assistive-technology audit. Visual inspection covers the portrait composition, the signature and the responsive folder arrangement.
