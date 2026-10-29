/** Custom letterforms and the evidence model share exactly the same geometry. */
export type GlyphId = "B" | "P" | "R";
export type Point = readonly [number, number];
export const glyphIds: readonly GlyphId[] = ["B", "P", "R"];
export const field = { width: 540, height: 480 } as const;
export const band = { min: 64, max: 400, height: 68, initial: 112 } as const;
export const cellSize = 2;

function cubic(from: Point, a: Point, b: Point, to: Point): Point[] {
  return Array.from({ length: 28 }, (_, index) => {
    const t = (index + 1) / 28;
    const s = 1 - t;
    return [
      Number(
        (
          s ** 3 * from[0] +
          3 * s ** 2 * t * a[0] +
          3 * s * t ** 2 * b[0] +
          t ** 3 * to[0]
        ).toFixed(3),
      ),
      Number(
        (
          s ** 3 * from[1] +
          3 * s ** 2 * t * a[1] +
          3 * s * t ** 2 * b[1] +
          t ** 3 * to[1]
        ).toFixed(3),
      ),
    ];
  });
}

// The three forms have the same stem and upper bowl. Their lower strokes differ.
const upper: Point[] = [
  [90, 420],
  [90, 35],
  [225, 35],
  ...cubic([225, 35], [325, 35], [365, 65], [365, 125]),
  ...cubic([365, 125], [365, 188], [306, 215], [225, 215]),
  [130, 215],
];
const upperCounter: Point[] = [
  [130, 75],
  [225, 75],
  ...cubic([225, 75], [290, 75], [325, 87], [325, 125]),
  ...cubic([325, 125], [325, 161], [280, 175], [225, 175]),
  [130, 175],
];
const lowerCounter: Point[] = [
  [130, 275],
  [240, 275],
  ...cubic([240, 275], [302, 275], [325, 293], [325, 328]),
  ...cubic([325, 328], [325, 364], [291, 380], [240, 380]),
  [130, 380],
];

export const contours: Record<GlyphId, readonly (readonly Point[])[]> = {
  B: [
    [
      ...upper,
      [130, 235],
      [240, 235],
      ...cubic([240, 235], [332, 235], [365, 270], [365, 328]),
      ...cubic([365, 328], [365, 392], [312, 420], [240, 420]),
      [90, 420],
    ],
    upperCounter,
    lowerCounter,
  ],
  P: [[...upper, [130, 420]], upperCounter],
  R: [
    [
      ...upper,
      [130, 282],
      [165, 282],
      [375, 420],
      [310, 420],
      [130, 306],
      [130, 420],
    ],
    upperCounter,
  ],
};

export function glyphPath(id: GlyphId): string {
  return contours[id]
    .map(
      (polygon) =>
        polygon
          .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(3)} ${y.toFixed(3)}`)
          .join(" ") + " Z",
    )
    .join(" ");
}

const columns = field.width / cellSize;
const rows = field.height / cellSize;

/** Scanline rasterization, with the same even-odd fill rule as the visible SVG. */
export function rasterize(id: GlyphId): Uint8Array {
  const mask = new Uint8Array(columns * rows);
  for (let row = 0; row < rows; row++) {
    const y = row * cellSize + cellSize / 2;
    const intersections: number[] = [];
    const boundaryCells: number[] = [];
    for (const polygon of contours[id]) {
      for (let i = 0; i < polygon.length; i++) {
        const a = polygon[i],
          b = polygon[(i + 1) % polygon.length];
        if (a[1] > y !== b[1] > y) {
          intersections.push(
            a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]),
          );
        }
        // SVG includes points on contour edges, including a hole's boundary.
        if (a[1] === b[1] && y === a[1]) {
          const first = Math.ceil(
            (Math.min(a[0], b[0]) - cellSize / 2) / cellSize,
          );
          const last = Math.floor(
            (Math.max(a[0], b[0]) - cellSize / 2) / cellSize,
          );
          for (let x = first; x <= last; x++) boundaryCells.push(x);
        } else if (
          a[1] !== b[1] &&
          y >= Math.min(a[1], b[1]) &&
          y <= Math.max(a[1], b[1])
        ) {
          const edgeX =
            a[0] + ((y - a[1]) * (b[0] - a[0])) / (b[1] - a[1]);
          const column = (edgeX - cellSize / 2) / cellSize;
          if (Math.abs(column - Math.round(column)) < 1e-8)
            boundaryCells.push(Math.round(column));
        }
      }
    }
    intersections.sort((a, b) => a - b);
    for (let i = 0; i < intersections.length; i += 2) {
      const start = Math.max(
        0,
        Math.ceil((intersections[i] - cellSize / 2) / cellSize),
      );
      const end = Math.min(
        columns,
        Math.ceil((intersections[i + 1] - cellSize / 2) / cellSize),
      );
      mask.fill(1, row * columns + start, row * columns + end);
    }
    for (const x of boundaryCells)
      if (x >= 0 && x < columns) mask[row * columns + x] = 1;
  }
  return mask;
}

const masks = Object.fromEntries(
  glyphIds.map((id) => [id, rasterize(id)]),
) as Record<GlyphId, Uint8Array>;
// Prefix sums make each drag update a few integer lookups, not a new raster pass.
const comparisons = Object.fromEntries(
  glyphIds.map((truth) => [
    truth,
    Object.fromEntries(
      glyphIds.map((candidate) => {
        const extra = new Uint32Array(rows + 1),
          missing = new Uint32Array(rows + 1);
        for (let row = 0; row < rows; row++) {
          extra[row + 1] = extra[row];
          missing[row + 1] = missing[row];
          for (let x = 0; x < columns; x++) {
            const index = row * columns + x;
            if (masks[candidate][index] && !masks[truth][index])
              extra[row + 1]++;
            if (!masks[candidate][index] && masks[truth][index])
              missing[row + 1]++;
          }
        }
        return [candidate, { extra, missing }];
      }),
    ),
  ]),
) as Record<
  GlyphId,
  Record<GlyphId, { extra: Uint32Array; missing: Uint32Array }>
>;

export function clampPosition(value: number): number {
  return Math.round(
    Math.max(
      band.min,
      Math.min(band.max, Number.isFinite(value) ? value : band.initial),
    ),
  );
}

function names(ids: readonly GlyphId[]) {
  return ids.length === 1
    ? ids[0]
    : ids.length === 2
      ? ids.join(" or ")
      : `${ids.slice(0, -1).join(", ")} or ${ids.at(-1)}`;
}

export function observe(value: number, truth: GlyphId = "R") {
  const position = clampPosition(value);
  const top = position - band.height / 2,
    bottom = position + band.height / 2;
  const start = Math.max(0, Math.ceil((top - cellSize / 2) / cellSize));
  const end = Math.min(rows, Math.ceil((bottom - cellSize / 2) / cellSize));
  const evidence = glyphIds.map((id) => {
    const data = comparisons[truth][id];
    const extra = data.extra[end] - data.extra[start];
    const missing = data.missing[end] - data.missing[start];
    const matches = extra === 0 && missing === 0;
    const reason = matches
      ? "Agrees with everything visible in the band."
      : extra && missing
        ? "Adds ink in some places and misses it in others."
        : extra
          ? "Adds ink where the view is empty."
          : "Misses ink that's visible here.";
    return { id, matches, extra, missing, reason };
  });
  const matches = evidence
    .filter((item) => item.matches)
    .map((item) => item.id);
  const headline =
    matches.length === 3
      ? "This part fits all three."
      : matches.length === 1
        ? `Only ${matches[0]} matches this view.`
        : `Could be ${names(matches)}.`;
  return { position, top, bottom, matches, evidence, headline };
}
