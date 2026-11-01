import Link from "next/link";
import { PixelFlower } from "./pixel-flower";

export function DesktopRest({ id = "main", onReturn }: { id?: string; onReturn?: () => void }) {
  return (
    <main id={id} className="md-empty" tabIndex={-1}>
      <figure className="md-desk-keepsake">
        <div className="md-keepsake-tape" aria-hidden="true" />
        <svg className="md-flower-sketch" viewBox="0 0 240 250" role="img" aria-labelledby={`${id}-bloom-title ${id}-bloom-description`}>
          <title id={`${id}-bloom-title`}>A little room for curiosity.</title>
          <desc id={`${id}-bloom-description`}>A pixel flower grows from a drawn stem and unfolds, inspired by the little flower in my portrait.</desc>
          <path className="md-bloom-ground" d="M76 228h88M91 235h58" />
          <path className="md-bloom-stem" d="M120 226V112" />
          <g className="md-bloom-leaf md-bloom-leaf--left">
            <path d="M120 193H96v-8H82v-10H70v-17h20v7h14v10h16Z" />
            <path className="md-leaf-vein" d="m83 170 37 23" />
          </g>
          <g className="md-bloom-leaf md-bloom-leaf--right">
            <path d="M120 171h24v-8h14v-10h12v-17h-20v7h-14v10h-16Z" />
            <path className="md-leaf-vein" d="m157 148-37 23" />
          </g>
          <g transform="translate(56 4) scale(2)"><PixelFlower animated /></g>
          <path className="md-sketch-bracket" d="M30 36V24h12m156 0h12v12M30 208v12h12m156 0h12v-12" />
        </svg>
        <figcaption>A little room for curiosity.</figcaption>
      </figure>
      <h1>Mahek Ara</h1>
      <Link className="md-rest-return" href="/" onClick={onReturn}>Back to my introduction</Link>
    </main>
  );
}
