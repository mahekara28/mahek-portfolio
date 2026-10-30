import { useId } from "react";

export type DesktopIconKind = "about" | "writing" | "projects" | "contact" | "resume";

const silhouettes: Record<DesktopIconKind, string> = {
  about: "M11 29 28 14a6 6 0 0 1 8 0l17 15v21a4 4 0 0 1-4 4H38V41a6 6 0 0 0-12 0v13H15a4 4 0 0 1-4-4Z",
  writing: "M18 11h28a4 4 0 0 1 4 4v38H18a6 6 0 0 1-6-6V17a6 6 0 0 1 6-6Z",
  projects: "M12 18h13l6 6h20a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4Z",
  contact: "M17 11h30a4 4 0 0 1 4 4v31H13V15a4 4 0 0 1 4-4Zm-7 36h44l2 6a2 2 0 0 1-2 3H10a2 2 0 0 1-2-3Z",
  resume: "M18 9h21l12 12v31a3 3 0 0 1-3 3H18a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4Z",
};

/** Original sage objects with a shallow rim, pale face and engraved details. */
export function DesktopIcon({ kind }: { kind: DesktopIconKind }) {
  const id = useId();
  const shape = silhouettes[kind];
  return (
    <svg className="md-app-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-face`} x1="19" y1="10" x2="44" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0f6e7" /><stop offset=".48" stopColor="#d4e3c3" /><stop offset="1" stopColor="#b5ca9f" />
        </linearGradient>
      </defs>
      <path d={shape} transform="translate(0 2)" fill="#83996f" stroke="#6b8159" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={shape} fill={`url(#${id}-face)`} stroke="#758969" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={shape} transform="translate(1.2 1.2) scale(.963)" stroke="#f8fbed" strokeWidth="1.2" strokeLinejoin="round" />
      {kind === "about" && <>
        <path d="m15 29 16-14a2 2 0 0 1 2 0l15 13" stroke="#fffef5" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M15 33v16m34-16v16" stroke="#b8cda5" strokeLinecap="round" />
      </>}
      {kind === "writing" && <>
        <path d="M19 12v32m-1 0h31" stroke="#9eb48c" strokeWidth="1.5" />
        <path d="M18 46h29v5H18a2.5 2.5 0 0 1 0-5Z" fill="#f1f5e8" />
        <path d="M24 22h16m-16 6h16m-16 6h11" stroke="#6a8259" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m46 18 4 4-15 16-6 2 2-6Z" fill="#7b9567" stroke="#f1f6e8" strokeWidth="1.1" strokeLinejoin="round" />
      </>}
      {kind === "projects" && <>
        <path d="M10 29h43" stroke="#f4f8eb" strokeWidth="1.5" />
        <path d="M10 27h43" stroke="#a4ba93" strokeWidth="1.2" />
        <path d="m25 35-5 5 5 5m14-10 5 5-5 5m-5-12-4 14" stroke="#5c764d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {kind === "contact" && <>
        <path d="M17 16h30v26H17Z" fill="#e4eed7" stroke="#acc299" />
        <circle cx="32" cy="25" r="4.5" fill="#6f895b" />
        <path d="M24 38c0-8 16-8 16 0" fill="#6f895b" />
        <path d="M11 49h42" stroke="#f8fbef" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M27 49h10" stroke="#93aa7d" strokeWidth="2" strokeLinecap="round" />
      </>}
      {kind === "resume" && <>
        <path d="M39 10v10a2 2 0 0 0 2 2h9" fill="#e8f0dc" stroke="#94ab80" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="26" cy="26" r="4" fill="#769062" />
        <path d="M20 36c0-7 12-7 12 0" fill="#769062" />
        <path d="M36 29h7m-7 6h7m-22 8h22m-22 5h15" stroke="#80986c" strokeWidth="1.7" strokeLinecap="round" />
      </>}
    </svg>
  );
}
