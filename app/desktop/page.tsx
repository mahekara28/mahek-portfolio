import type { Metadata } from "next";
import { DesktopRest } from "../components/desktop-rest";

export const metadata: Metadata = { title: "Desktop", robots: { index: false, follow: true } };

export default function DesktopPage() {
  return <DesktopRest />;
}
