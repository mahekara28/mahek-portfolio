import { PixelFlower } from "./pixel-flower";

export function BrandMark() {
  return (
    <svg className="md-brand-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect className="md-brand-tile" x="1" y="1" width="62" height="62" rx="14" />
      <g transform="translate(6 6) scale(.8125)"><PixelFlower /></g>
    </svg>
  );
}
