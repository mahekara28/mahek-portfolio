import { duration, sentenceAt, tokenDuration, type Context } from "./sentence-study";

type Point = { x: number; y: number; p: number; s: number };
type Vec3 = [number, number, number];
export type SceneState = ReturnType<typeof sentenceAt> & {
  context: Context;
  playing: boolean;
  reduced: boolean;
  manual: boolean;
};
export type SentenceScene = {
  explore: () => void;
  theme: (dark: boolean) => void;
  dispose: () => void;
};

export function createSentenceScene(
  canvas: HTMLCanvasElement,
  labels: HTMLElement[],
  onState: (state: SceneState) => void,
): SentenceScene | null {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;
  const ctx = context;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let w = 700, h = 420, dpr = 1, time = 0, elapsed = 0;
  let selection: Context = 0;
  let model = sentenceAt(0, 0), cycle = 0;
  // One short pass, then a still scene. No perpetual motion or pause controls.
  let active = !motion.matches, visible = true, disposed = false;
  if (motion.matches) elapsed = duration(selection);
  let frame = 0, last = 0, manual = false, dirty = true;
  let visibleMilliseconds = 0;
  let px = 0, py = 0, tx = 0, ty = 0;
  let cy = Math.cos(-.36), sy = Math.sin(-.36), cp = Math.cos(.24), sp = Math.sin(.24);
  let dark = document.documentElement.dataset.theme !== "light";
  let lastState = "";
  const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };
  const fract = (x: number) => x - Math.floor(x);
  const hash = (n: number) => fract(Math.sin(n * 127.1 + 311.7) * 43758.5453);
  const rgba = (color: string, a: number) => `rgba(${color},${clamp(a)})`;
  const palette = () => dark
    ? { gold: "238,188,116", cold: "126,207,218", ink: "225,235,235", bg: "#080d10", center: "#213639", mid: "#101c22" }
    : { gold: "153,66,29", cold: "32,83,99", ink: "20,45,54", bg: "#f6f5f1", center: "#e6eae5", mid: "#f0f1ec" };

  function project(x: number, y: number, z: number): Point {
    const xx = x * cy - z * sy, zz = x * sy + z * cy;
    const yy = y * cp - zz * sp, depth = y * sp + zz * cp;
    const perspective = 13 / (13 + depth);
    const scale = Math.min(w / 12.9, h / 7.7);
    return { x: w * .46 + xx * scale * perspective, y: h * .48 - yy * scale * perspective, s: scale * perspective, p: perspective };
  }
  function stroke(points: Point[], color: string, width = 1) {
    ctx.beginPath();
    points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
  }
  function polygon(points: Point[], fill: string | CanvasGradient) {
    ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
    ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
  }
  function curve(u: number, lane: number, offset = 0): Vec3 {
    const y = [1.65, .04, -1.65][lane], z = [.45, -.22, .72][lane];
    const bend = smooth(u), collapse = smooth((cycle - .65) / .4);
    const targetY = lane === model.selected || model.selected === null ? y : y + (lane === 0 ? .85 : -.65) * collapse;
    return [1.30 + u * 4.35, y * .38 + (targetY - y * .38) * bend + Math.sin(u * Math.PI) * (.28 + offset * .17) + offset * .17, z * .45 + z * .55 * bend + offset * .12];
  }
  function ribbon(lane: number, offset: number, start: number, end: number, color: string, width: number) {
    const points: Point[] = [];
    for (let i = 0; i <= 20; i++) points.push(project(...curve(start + (end - start) * i / 20, lane, offset)));
    stroke(points, color, width);
  }
  function background() {
    const p = palette(); ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h);
    const center = project(.2, 0, 0), light = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, w * .49);
    light.addColorStop(0, p.center); light.addColorStop(.45, p.mid); light.addColorStop(1, p.bg);
    ctx.fillStyle = light; ctx.fillRect(0, 0, w, h);
    for (let z = -4; z <= 4; z += 1.2) stroke([project(-8, -2.7, z), project(7, -2.7, z)], rgba(p.cold, .055), .65);
    for (let x = -6; x <= 6; x += 2) stroke([project(x, -2.7, -4), project(x, -2.7, 4)], rgba(p.cold, .04), .65);
  }
  function incoming() {
    const p = palette();
    for (let lane = 0; lane < 16; lane++) {
      const y = (lane - 7.5) * .18, z = Math.sin(lane * 1.7) * 1.35, points: Point[] = [];
      for (let j = 0; j <= 23; j++) { const u = j / 23; points.push(project(-7.8 + u * 6.2, y * (1 - .55 * u), z * (1 - .65 * u))); }
      stroke(points, rgba(lane % 3 === 0 ? p.cold : p.ink, (dark ? .09 : .17) + (lane % 3 === 0 ? .07 : 0)), .8);
      const speed = active && cycle < .65 ? .24 : .10;
      for (let j = 0; j < 3; j++) {
        const u = fract(time * speed + j * .33 + lane * .073);
        const a = project(-7.8 + u * 6.2, y * (1 - .55 * u), z * (1 - .65 * u));
        const b = project(-7.8 + Math.max(0, u - .05) * 6.2, y * (1 - .55 * u), z * (1 - .65 * u));
        stroke([b, a], rgba(lane % 3 === 0 ? p.cold : p.ink, .38 + .4 * u), lane % 3 === 0 ? 1.9 : 1.1);
      }
    }
    const words = model.contextText.split(" ");
    for (let i = 0; i < 12; i++) {
      const u = fract(time * .115 + i * .117), lane = i % 3 - 1;
      const point = project(-7.7 + u * 6.1, lane * .67 + .12, lane * .46);
      ctx.font = `${Math.max(11, Math.min(15, point.s * .29))}px "Plex Mono",monospace`;
      ctx.fillStyle = rgba(i % 3 === 0 ? p.ink : p.cold, Math.sin(u * Math.PI) * (dark ? .65 + (i % 3 === 0 ? .35 : 0) : 1));
      ctx.fillText(words[(i + Math.floor(time * .65)) % words.length], point.x, point.y);
    }
  }
  function sheets() {
    const p = palette(), sweep = fract(time * .38);
    for (let sheet = 0; sheet < 5; sheet++) {
      const event = active ? Math.max(0, 1 - Math.abs(cycle / .65 * 5 - sheet) * .8) : 0;
      const x = -1.55 + sheet * .68, swing = Math.sin(time * .6 + sheet * .32) * .09;
      const corners = [project(x, -2.35, -1.45), project(x, 2.35, -1.45), project(x, 2.35, 1.45), project(x, -2.35, 1.45)];
      const surface = ctx.createLinearGradient(corners[0].x, 0, corners[2].x, 0);
      surface.addColorStop(0, rgba(p.cold, dark ? .018 : .035)); surface.addColorStop(.5, rgba(sheet > 2 ? p.gold : p.cold, dark ? .07 : .13)); surface.addColorStop(1, rgba(p.cold, dark ? .018 : .035)); polygon(corners, surface);
      // Quantized batches avoid thousands of individual strokes per frame.
      const rows = w < 430 ? 24 : 30, cols = 14, batches: [Point, Point][][] = [[], [], [], []];
      for (let row = 0; row < rows; row++) {
        const y = -2.2 + row / (rows - 1) * 4.4, scan = 1 - Math.min(1, Math.abs(row / (rows - 1) - sweep) * 6);
        for (let col = 0; col < cols; col++) {
          const z = -1.36 + col / (cols - 1) * 2.72;
          if (hash(row * 19 + col * 3 + sheet * 79) < .22) continue;
          const value = hash(row * 73 + col * 7 + sheet * 11 + Math.floor(time * 5 + sheet * .9));
          const a = project(x, y + Math.sin(z * 1.7 + time * .7) * swing, z);
          const b = project(x, y + Math.sin(z * 1.7 + time * .7) * swing, z + .05 + value * .105);
          const alpha = .10 + value * .38 + scan * .55 + (sheet / 4) * event * .15;
          batches[Math.min(3, Math.floor(alpha * 4))].push([a, b]);
          if (value > .90) batches[3].push([a, project(x, y + .045, z)]);
        }
      }
      for (let b = 0; b < 4; b++) {
        ctx.beginPath(); for (const [a, z] of batches[b]) { ctx.moveTo(a.x, a.y); ctx.lineTo(z.x, z.y); }
        ctx.strokeStyle = rgba(b === 3 ? p.ink : sheet > 2 ? p.gold : p.cold, (dark ? .14 : .30) + b * .22); ctx.lineWidth = .7 + b * .35; ctx.stroke();
      }
      const scan: Point[] = [], y = -2.2 + sweep * 4.4;
      for (let z = -1.4; z <= 1.4; z += .08) scan.push(project(x, y + Math.sin(z * 1.7 + time * .7) * swing, z));
      ctx.save(); ctx.globalCompositeOperation = dark ? "screen" : "source-over";
      ctx.shadowColor = rgba(sheet > 2 ? p.gold : p.cold, .8); ctx.shadowBlur = dark ? 12 + event * 14 : 0;
      stroke(scan, rgba(sheet > 2 ? p.gold : p.cold, .7 + event * .30), 2.2); ctx.restore();
      stroke([corners[1], corners[2]], rgba(sheet > 2 ? p.gold : p.cold, .35), .8);
      stroke([corners[0], corners[3]], rgba(sheet > 2 ? p.gold : p.cold, .24), .7);
    }
  }
  function outgoing() {
    const p = palette(), activation = smooth((cycle - .3) / .35), choice = smooth((cycle - .65) / .3);
    for (let lane = 2; lane >= 0; lane--) {
      const winner = lane === model.selected, alpha = (.55 + activation * .45) * (winner ? 1 : 1 - choice * (dark ? .86 : .65)), color = winner ? p.gold : p.cold;
      const silhouette: Point[] = [];
      for (let i = 0; i <= 36; i++) silhouette.push(project(...curve(i / 36, lane, -1.2)));
      for (let i = 36; i >= 0; i--) silhouette.push(project(...curve(i / 36, lane, 1.2)));
      polygon(silhouette, rgba(color, alpha * .055));
      for (let t = 0; t < 18; t++) {
        const off = (t - 8.5) * .13, position = fract(time * (winner ? .235 : .175) + t * .057 + lane * .23);
        ribbon(lane, off, 0, 1, rgba(color, alpha * (t % 4 === 0 ? .42 : .19)), t % 5 === 0 ? 1.4 : .7);
        ribbon(lane, off, Math.max(0, position - .12 - activation * .11), position, rgba(color, alpha * (.55 + hash(t) * .45)), 1.25);
      }
      if (winner && activation > .2) {
        ctx.save(); ctx.globalCompositeOperation = dark ? "screen" : "source-over";
        ctx.shadowBlur = dark ? 18 : 0; ctx.shadowColor = rgba(p.gold, 1);
        ribbon(lane, 0, 0, 1, rgba(p.gold, alpha * .5), 3.5); ctx.restore();
      }
      for (let i = 0; i < 3; i++) {
        if (model.complete && !winner) continue;
        const u = model.complete ? .24 + i * .2 : fract(time * .165 + i * .30 + lane * .2); if (u < .14 || u > .68) continue;
        const point = project(...curve(u, lane, -.4));
        ctx.font = `${Math.max(10, Math.min(13, point.s * .24))}px "Plex Mono",monospace`;
        const word = model.complete ? model.completion.split(/\s+/).slice(-3)[i] : model.candidates[lane].trim();
        ctx.fillStyle = rgba(winner ? p.ink : p.cold, alpha * Math.sin(u * Math.PI)); ctx.fillText(word ?? "", point.x, point.y - 4);
      }
    }
    if (active && model.selected !== null && cycle < 1.05) {
      const u = clamp((cycle - .65) / .4);
      ctx.save(); ctx.globalCompositeOperation = dark ? "screen" : "source-over"; ctx.shadowColor = rgba(p.gold, 1); ctx.shadowBlur = dark ? 18 : 0;
      for (let j = 0; j < 7; j++) ribbon(model.selected, (j - 3) * .15, Math.max(0, u - .20), u, rgba(p.ink, .65 * (1 - j * .06)), 1.4);
      ctx.restore();
    }
  }
  function feedback() {
    if (model.selected === null || model.complete) return;
    const p = palette(), start = curve(1, model.selected);
    const controls: Vec3[] = [start, [5.1, -3.25, 1.4], [-3.5, -3.25, 1.4], [-3.9, -.25, -.3]];
    function at(u: number) {
      const v = 1 - u;
      return project(...[0, 1, 2].map((axis) => v ** 3 * controls[0][axis] + 3 * v * v * u * controls[1][axis] + 3 * v * u * u * controls[2][axis] + u ** 3 * controls[3][axis]) as Vec3);
    }
    stroke(Array.from({ length: 49 }, (_, i) => at(i / 48)), rgba(p.gold, .14), .8);
    if (cycle < 1.05) return;
    const u = smooth((cycle - 1.05) / .55);
    const trail = Array.from({ length: 15 }, (_, i) => at(Math.max(0, u - .16) + Math.min(.16, u) * i / 14));
    ctx.save(); ctx.shadowColor = rgba(p.gold, 1); ctx.shadowBlur = dark ? 9 : 0;
    stroke(trail, rgba(p.gold, .9), 2.2); ctx.restore();
    const point = at(u);
    ctx.font = '11px "Plex Mono",monospace'; ctx.fillStyle = rgba(p.ink, .95);
    const token = model.token.trim();
    ctx.fillText(token, clamp(point.x + 7, 8, w - ctx.measureText(token).width - 8), clamp(point.y + 17, 15, h - 8));
  }
  function publish() {
    const state = { ...model, context: selection, playing: active && !motion.matches, reduced: motion.matches, manual };
    const key = JSON.stringify(state);
    if (key !== lastState) { lastState = key; onState(state); }
  }
  function draw() {
    model = sentenceAt(elapsed, selection);
    cycle = model.complete ? tokenDuration : elapsed - model.step * tokenDuration;
    const push = smooth(elapsed / 1.4) * (1 - smooth((elapsed - duration(selection) + 2) / 2));
    const yaw = -.36 + px * .055 + push * .075, pitch = .24 + py * .035 + push * .045;
    cy = Math.cos(yaw); sy = Math.sin(yaw); cp = Math.cos(pitch); sp = Math.sin(pitch);
    ctx.setTransform(canvas.width / w, 0, 0, canvas.height / h, 0, 0); background(); incoming(); outgoing(); sheets(); feedback();
    const p = palette();
    for (let i = 0; i < 8; i++) {
      const u = fract(time * .16 + i * .127), a = project(-6 + u * 10, -2.2 + i * .025, -2.1), b = project(-6 + Math.max(0, u - .04) * 10, -2.2 + i * .025, -2.1);
      stroke([b, a], rgba(p.ink, .06 + .1 * hash(i)), .7);
    }
    labels.forEach((el, i) => {
      const point = project(...curve(1, i));
      el.style.left = `${Math.min(w - el.offsetWidth - 9, point.x + 8)}px`; el.style.top = `${point.y - 16}px`;
    });
    publish(); dirty = false;
  }
  function tick(now: number) {
    frame = 0; if (disposed) return;
    const frameMilliseconds = Math.max(0, now - last);
    const dt = Math.min(frameMilliseconds / 1000, .25) || 0; last = now;
    if (active && !motion.matches && visible && !document.hidden) {
      visibleMilliseconds += frameMilliseconds;
      time += dt; px += (tx - px) * .045; py += (ty - py) * .045;
      elapsed += dt * 3;
      // Bound visible playback on slower devices without using up that time
      // while the drawing is below the fold or its browser tab is hidden.
      if (elapsed >= duration(selection) || visibleMilliseconds >= 4800) { elapsed = duration(selection); active = false; }
      draw();
    } else if (dirty) draw();
    if (visible && !document.hidden && ((active && !motion.matches) || dirty)) frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (disposed) return;
    dirty = true; if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); }
  }
  function explore() {
    selection = selection === 0 ? 1 : 0;
    manual = true; visibleMilliseconds = 0; active = !motion.matches;
    elapsed = motion.matches ? duration(selection) : 0;
    schedule();
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0 || disposed) return;
    w = bounds.width; h = bounds.height;
    dpr = Math.min(devicePixelRatio || 1, 1.6);
    const width = Math.round(w * dpr), height = Math.round(h * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width; canvas.height = height;
    }
    // Resizing clears a canvas even when playback is paused. Paint synchronously
    // so a resize/observer callback cannot leave a cleared buffer on screen.
    draw();
    canvas.dataset.painted = "true";
    schedule();
  }
  function pointer(event: PointerEvent) {
    if (motion.matches || event.pointerType === "touch") return;
    const bounds = canvas.getBoundingClientRect(); tx = clamp((event.clientX - bounds.left) / bounds.width) * 2 - 1; ty = clamp((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    if (!active) { px = tx; py = ty; schedule(); }
  }
  function leave() { tx = 0; ty = 0; if (!active) { px = 0; py = 0; schedule(); } }
  function visibility() { if (!document.hidden) schedule(); else { cancelAnimationFrame(frame); frame = 0; } }
  function motionChanged() { if (motion.matches) { elapsed = duration(selection); active = false; } schedule(); }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) schedule(); else { cancelAnimationFrame(frame); frame = 0; } }, { threshold: .02 }); observer.observe(canvas);
  canvas.addEventListener("pointermove", pointer); canvas.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", visibility); motion.addEventListener("change", motionChanged);
  resize();
  return {
    explore,
    theme(value) { dark = value; schedule(); },
    dispose() {
      disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect();
      canvas.removeEventListener("pointermove", pointer); canvas.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", motionChanged);
    },
  };
}
