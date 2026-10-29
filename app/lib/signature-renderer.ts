export type SignatureState = { expanded: boolean; moving: boolean; reduced: boolean };
export type SignatureScene = { toggle: () => void; theme: (dark: boolean) => void; dispose: () => void };
type Run = { x: number; y: number; width: number; layer: number; row: number; tx?: number; ty?: number; tw?: number };

export function createSignatureScene(canvas: HTMLCanvasElement, onState: (state: SignatureState) => void): SignatureScene | null {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;
  const ctx = context;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const W = 740, H = 510;
  let width = 740, height = 510, frame = 0, last = 0, elapsed = 0;
  let dark = document.documentElement.dataset.theme !== "light";
  let expanded = false, expansion = 0, intro = motion.matches ? 1 : 0;
  let visible = false, moving = !motion.matches, disposed = false, dirty = true;
  let pointerX = .5, pointerY = .5, pointerInside = false;
  let previousState = "";
  let runs: Run[] = [];
  const clamp = (n: number, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = (n: number) => { n = clamp(n); return 1 - (1 - n) ** 3; };
  // The mark's fine structure is seeded from the owner's name, not frame noise.
  const name = "MAHEK ARA";
  const seed = [...name].reduce((a, c) => (Math.imul(a, 31) + c.charCodeAt(0)) >>> 0, 17);
  const hash = (n: number) => { const x = Math.sin(n * 127.1 + seed * .001) * 43758.5453; return x - Math.floor(x); };
  const rgb = (hex: string, alpha: number) => {
    const c = parseInt(hex.slice(1), 16);
    return `rgba(${c >> 16},${(c >> 8) & 255},${c & 255},${alpha})`;
  };
  const palette = () => dark
    ? { paper: "#080d10", ink: "#e8e6db", accent: "#f38c73", faint: "#53676c" }
    : { paper: "#f6f5f1", ink: "#172e36", accent: "#b7432c", faint: "#9ba8a8" };

  function build() {
    const mask = document.createElement("canvas"); mask.width = W; mask.height = H;
    const m = mask.getContext("2d", { willReadFrequently: true });
    if (!m) return;
    runs = [];
    for (let layer = 0; layer < 2; layer++) {
      m.clearRect(0, 0, W, H);
      m.fillStyle = "#fff";
      m.font = '850 405px "Hanken",sans-serif';
      m.save();
      m.translate(layer === 0 ? 76 : 351, 407);
      m.transform(1, -.045, -.09, 1, 0, 0);
      m.fillText(layer === 0 ? "M" : "A", 0, 0);
      m.restore();
      const pixels = m.getImageData(0, 0, W, H).data;
      for (let row = 0; row < 91; row++) {
        const y = 65 + row * 4;
        let start = -1;
        for (let x = 35; x <= 710; x++) {
          const inside = x < 710 && pixels[(Math.floor(y) * W + x) * 4 + 3] > 100;
          if (inside && start < 0) start = x;
          if (!inside && start >= 0) {
            runs.push({ x: start, y, width: x - start, layer, row });
            start = -1;
          }
        }
      }
      const initial = runs.filter((run) => run.layer === layer);
      m.clearRect(0, 0, W, H);
      m.font = layer === 0 ? '800 183px "Hanken",sans-serif' : '800 210px "Hanken",sans-serif';
      m.fillText(layer === 0 ? "MAHEK" : "ARA", layer === 0 ? 62 : 302, layer === 0 ? 239 : 410);
      const full = m.getImageData(0, 0, W, H).data;
      const target: { x: number; y: number; width: number }[] = [];
      for (let y = 65; y < 430; y += 4) {
        let start = -1;
        for (let x = 35; x <= 710; x++) {
          const inside = x < 710 && full[(y * W + x) * 4 + 3] > 100;
          if (inside && start < 0) start = x;
          if (!inside && start >= 0) { target.push({ x: start, y, width: x - start }); start = -1; }
        }
      }
      initial.forEach((run, i) => {
        const end = target[Math.min(target.length - 1, Math.floor(i / initial.length * target.length))];
        if (end) { run.tx = end.x; run.ty = end.y; run.tw = end.width; }
      });
    }
    schedule();
  }

  function draw() {
    const p = palette();
    ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
    ctx.fillStyle = p.paper; ctx.fillRect(0, 0, W, H);
    // Sparse registration strokes make the large silhouette deliberate without
    // a frame, glow, floor grid, floating particles or decorative hardware.
    ctx.strokeStyle = rgb(p.faint, dark ? .36 : .55); ctx.lineWidth = .7;
    ctx.beginPath();
    ctx.moveTo(50, 84); ctx.lineTo(50, 102); ctx.moveTo(50, 84); ctx.lineTo(68, 84);
    ctx.moveTo(692, 422); ctx.lineTo(674, 422); ctx.moveTo(692, 422); ctx.lineTo(692, 404);
    ctx.stroke();

    for (const run of runs) {
      const { layer, row } = run;
      const local = clamp(1 - Math.abs(row / 91 - pointerY) * 3.5);
      const inspect = pointerInside && !motion.matches ? local * 10 * (pointerX - .5) : 0;
      const reveal = ease(clamp((intro * 1.45 - row / 130)));
      const shift = (1 - reveal) * (layer ? 90 : -100) + inspect;
      const x = run.x + ((run.tx ?? run.x) - run.x) * expansion + shift;
      const y = run.y + ((run.ty ?? run.y) - run.y) * expansion;
      const runWidth = run.width + ((run.tw ?? run.width) - run.width) * expansion;
      const color = layer ? p.accent : p.ink;
      const start = x, end = x + runWidth;
      if (reveal < .01) continue;
      // A second, offset impression is drawn as ink rather than a 3D material.
      if (row % 3 === 0) {
        ctx.strokeStyle = rgb(color, (dark ? .13 : .11) * reveal); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(start - 9, y + 13); ctx.lineTo(end - 9, y + 13); ctx.stroke();
      }
      const microtype = (row + layer * 3) % 9 === 0 || (expansion > .5 && row % 3 === 0);
      if (microtype) {
        ctx.font = '6.8px "Plex Mono",monospace';
        ctx.fillStyle = rgb(color, reveal * .95);
        for (let gx = start; gx < end - 5; gx += 7) {
          const index = (Math.floor((gx - start) / 7) + row + layer) % name.length;
          ctx.fillText(name[index], gx, y + 1);
        }
      } else {
        ctx.strokeStyle = rgb(color, reveal * (row % 4 === 0 ? 1 : .78)); ctx.lineWidth = row % 4 === 0 ? 2.2 : 1.25;
        ctx.beginPath(); ctx.moveTo(start, y); ctx.lineTo(end, y); ctx.stroke();
        // Gaps reveal the overprint: the two letters remain independently legible.
        if (runWidth > 50 && row % 5 === 0) {
          const cut = start + runWidth * (.2 + hash(row + layer * 100) * .6);
          ctx.strokeStyle = p.paper; ctx.lineWidth = 3.8;
          ctx.beginPath(); ctx.moveTo(cut, y); ctx.lineTo(cut + 4 + expansion * 9, y); ctx.stroke();
        }
      }
    }
    const state = { expanded, moving, reduced: motion.matches };
    const key = JSON.stringify(state);
    if (key !== previousState) { onState(state); previousState = key; }
    canvas.dataset.painted = "true";
    dirty = false;
  }

  function tick(now: number) {
    frame = 0;
    if (disposed) return;
    const dt = Math.min((now - last) / 1000, .1) || 0;
    last = now;
    if (moving && visible && !document.hidden && !motion.matches) {
      elapsed += dt;
      intro = Math.min(1, intro + dt / 1.5);
      expansion += ((expanded ? 1 : 0) - expansion) * Math.min(1, dt * 9);
      if (elapsed >= 2.2) { intro = 1; expansion = expanded ? 1 : 0; moving = false; }
      draw();
    } else if (dirty) draw();
    if (visible && !document.hidden && moving && !motion.matches) frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (disposed) return;
    dirty = true;
    if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  function resize() {
    const box = canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    width = box.width; height = box.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    draw(); schedule();
  }
  function pointer(e: PointerEvent) {
    if (e.pointerType === "touch" || motion.matches) return;
    const box = canvas.getBoundingClientRect();
    pointerInside = true; pointerX = clamp((e.clientX - box.left) / width); pointerY = clamp((e.clientY - box.top) / height);
    schedule();
  }
  function leave() { pointerInside = false; schedule(); }
  function visibility() {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else schedule();
  }
  function reduced() {
    if (motion.matches) { intro = 1; expansion = expanded ? 1 : 0; moving = false; }
    schedule();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: .04 });
  intersection.observe(canvas);
  canvas.addEventListener("pointermove", pointer); canvas.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility); motion.addEventListener("change", reduced);
  build(); resize();
  void document.fonts.ready.then(() => { if (!disposed) build(); });
  return {
    toggle() {
      expanded = !expanded; elapsed = 0; moving = !motion.matches;
      if (motion.matches) { expansion = expanded ? 1 : 0; intro = 1; }
      schedule();
    },
    theme(value) { dark = value; schedule(); },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
      canvas.removeEventListener("pointermove", pointer); canvas.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", reduced);
    },
  };
}
