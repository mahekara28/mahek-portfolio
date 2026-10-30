import { useId } from "react";

export type DesktopIconKind = "about" | "writing" | "projects" | "contact" | "resume";

const colors = {
  about: ["#a8c9fb", "#5483cf"],
  writing: ["#f0dfb3", "#caa76a"],
  projects: ["#d3f0f7", "#94c8dd"],
  contact: ["#b2b6e4", "#777bad"],
  resume: ["#e4e6ed", "#a4aab8"],
};

/** Original desktop artwork: dimensional surfaces and familiar, readable objects. */
export function DesktopIcon({ kind }: { kind: DesktopIconKind }) {
  const id = useId();
  const [top, bottom] = colors[kind];
  return (
    <svg className="md-app-icon" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-tile`} x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor={top} /><stop offset="1" stopColor={bottom} />
        </linearGradient>
        <linearGradient id={`${id}-folder`} x1="32" y1="27" x2="32" y2="51" gradientUnits="userSpaceOnUse">
          <stop stopColor="#72c3e8" /><stop offset="1" stopColor="#3c91c1" />
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="56" height="56" rx="14" fill="#433043" opacity=".12" />
      <rect x="4" y="3" width="56" height="56" rx="14" fill={`url(#${id}-tile)`} stroke="#fff" strokeOpacity=".7" />
      <rect x="5.5" y="4.5" width="53" height="53" rx="12.5" stroke="#fff" strokeOpacity=".3" />
      {kind === "about" && <>
        <rect x="16" y="13" width="34" height="40" rx="5" fill="#456a9b" opacity=".25" />
        <rect x="14" y="11" width="34" height="40" rx="5" fill="#f8fbff" />
        <path d="M20 11h22a6 6 0 0 1 6 6v5H14v-5a6 6 0 0 1 6-6Z" fill="#d1e0f6" />
        <circle cx="31" cy="28" r="6" fill="#5378a9" />
        <path d="M21 44c0-6 4-10 10-10s10 4 10 10" fill="#5378a9" />
        <path d="M46 19h4m-4 10h4m-4 10h4" stroke="#6d91c2" strokeWidth="3" strokeLinecap="round" />
      </>}
      {kind === "writing" && <>
        <rect x="15" y="12" width="34" height="42" rx="4" fill="#bca5a3" opacity=".22" />
        <rect x="13" y="10" width="34" height="42" rx="4" fill="#fffdfa" />
        <path d="M17 10h26a4 4 0 0 1 4 4v8H13v-8a4 4 0 0 1 4-4Z" fill="#d6b775" />
        <path d="M20 27h20m-20 7h20m-20 7h12" stroke="#d4c9ae" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M18 8v7m9-7v7m9-7v7" stroke="#9b8456" strokeWidth="2.5" strokeLinecap="round" />
        <path d="m49 24 5 5-18 21-7 3 2-8Z" fill="#3b4459" opacity=".15" />
        <path d="m47 22 5 5-18 21-7 3 2-8Z" fill="#7186a5" />
        <path d="m47 22 2-2a2 2 0 0 1 3 0l2 2a2 2 0 0 1 0 3l-2 2Z" fill="#a6b8d2" />
        <path d="m29 43 5 5-7 3Z" fill="#f4d8b9" /><path d="m28 47 3 3-4 1Z" fill="#65505a" />
      </>}
      {kind === "projects" && <>
        <path d="M11 22a4 4 0 0 1 4-4h12l5 5h17a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4Z" fill="#438db3" />
        <rect x="24" y="17" width="21" height="28" rx="2" transform="rotate(8 24 17)" fill="#eaf7fc" />
        <path d="m29 25 12 2m-13 4 12 2" stroke="#b6d5e4" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M11 30a4 4 0 0 1 4-4h37a3 3 0 0 1 3 4l-3 18a4 4 0 0 1-4 3H15a4 4 0 0 1-4-4Z" fill={`url(#${id}-folder)`} />
        <path d="M16 28h35" stroke="#bde7f8" strokeLinecap="round" />
        <path d="m27 35-4 4 4 4m10-8 4 4-4 4m-4-10-3 12" stroke="#e4f5fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>}
      {kind === "contact" && <>
        <rect x="12" y="21" width="40" height="28" rx="5" fill="#4b5f9e" opacity=".25" />
        <rect x="12" y="18" width="40" height="28" rx="5" fill="#fffdfd" />
        <path d="m14 43 13-12m23 12L37 31" stroke="#d1daee" strokeWidth="1.5" />
        <path d="m14 21 15 12a5 5 0 0 0 6 0l15-12" stroke="#9cafd7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m14 19 15 11a5 5 0 0 0 6 0l15-11" fill="#f4f6fc" />
      </>}
      {kind === "resume" && <>
        <path d="M19 12h19l10 10v31H19a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3Z" fill="#3c445c" opacity=".18" />
        <path d="M18 10h19l10 10v30H18a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3Z" fill="#fafbff" />
        <path d="M37 10v10h10" fill="#c4ccdb" />
        <circle cx="25" cy="25" r="4" fill="#798bac" />
        <path d="M20 34c0-5 10-5 10 0m5-8h6m-6 5h6m-21 9h21m-21 5h15" stroke="#798bac" strokeWidth="2" strokeLinecap="round" />
      </>}
    </svg>
  );
}
