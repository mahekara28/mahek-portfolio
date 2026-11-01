import type { CSSProperties } from "react";
import { flowerPetals } from "../lib/pixel-flower";

export function PixelFlower({ animated = false }: { animated?: boolean }) {
  return (
    <g className={animated ? "md-bloom-head" : undefined}>
      {flowerPetals.map((path, index) => (
        <path key={path} d={path} className={`md-bloom-petal${index % 2 ? " md-bloom-petal--small" : ""}`}
          style={{ "--petal": index } as CSSProperties} />
      ))}
      <rect className="md-bloom-center" x="26" y="26" width="12" height="12" rx="2" />
      <path className="md-bloom-glint" d="M29 29h3v3h-3Z" />
    </g>
  );
}
