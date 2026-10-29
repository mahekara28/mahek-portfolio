export type Sample = "wrong-format" | "missing-column" | "matching";

// Local fixtures, not real model or tool responses. The check reads the bytes;
// neither the filename nor the success message is treated as proof.
export const samples: Record<Sample, { label: string; contents: string }> = {
  "wrong-format": { label: "A JSON file instead", contents: '[{"name":"Alex","email":"alex@example.test"}]' },
  "missing-column": { label: "A missing column", contents: "name\nAlex\n" },
  matching: { label: "The requested CSV", contents: "name,email\nAlex,alex@example.test\n" },
};

export function inspectArtifact(contents: string) {
  const text = contents.trim();
  let json = false;
  try { JSON.parse(text); json = true; } catch { /* Check the CSV fixture next. */ }
  if (json) return { passed: false, kind: "JSON", detail: "The tool returned JSON. The request was for CSV.", columns: [] as string[] };
  const [header, ...rows] = text.split(/\r?\n/);
  const columns = header.split(",").map((value) => value.trim());
  const missing = ["name", "email"].filter((column) => !columns.includes(column));
  if (missing.length) return { passed: false, kind: "CSV", detail: `The file is missing the ${missing.join(" and ")} column.`, columns };
  if (!rows.length || rows.some((row) => row.split(",").length !== columns.length)) {
    return { passed: false, kind: "CSV", detail: "The rows do not match the requested columns.", columns };
  }
  return { passed: true, kind: "CSV", detail: "CSV, both requested columns, and a row with the right shape.", columns };
}

export function evidenceAt(step: number, sample: Sample) {
  const check = inspectArtifact(samples[sample].contents);
  if (step === 0) return { state: "unverified", title: "A confident reply.", detail: "The model says it’s done. That’s a claim, not a check." } as const;
  if (step === 1) return { state: "reported", title: "The tool says it worked.", detail: "A success response still doesn’t tell us what’s in the file." } as const;
  return { state: check.passed ? "checked" : "mismatch", title: check.passed ? "The requested checks pass." : "Not what was requested.", detail: check.detail } as const;
}
