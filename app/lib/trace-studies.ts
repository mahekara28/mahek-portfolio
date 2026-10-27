export type TraceLabel = { text: string; x: number; y: number };
type TraceStudy = {
  projectId: string;
  shape: number;
  operation: string;
  input: string[];
  output: [string, string, string] | [string];
};

export const traceStudies: TraceStudy[] = [
  {
    projectId: "llm-router",
    shape: 0,
    operation: "Choose a model path",
    input: ["Request"],
    output: ["Small route", "Medium route", "Large route"],
  },
  {
    projectId: "narrative-gap-mcp",
    shape: 4,
    operation: "Review the mismatch",
    input: ["Issues", "Pull requests", "Contributors"],
    output: ["Review prompts"],
  },
  {
    projectId: "mcp-impact",
    shape: 3,
    operation: "Follow references",
    input: ["Contract change"],
    output: ["Prompts", "Agents", "Workflows"],
  },
  {
    projectId: "prompt-injection-lab",
    shape: 1,
    operation: "Test the boundary",
    input: ["Attack scenarios"],
    output: ["Blocked", "Exploited", "Risk report"],
  },
  {
    projectId: "build-buy-borrow",
    shape: 5,
    operation: "Compare readiness",
    input: ["Project brief"],
    output: ["Develop skills", "Hire", "Contract"],
  },
  {
    projectId: "context-relay",
    shape: 2,
    operation: "Carry intent forward",
    input: ["Current intent", "Tool proposal", "Checks"],
    output: ["Checked action"],
  },
];

export const STRANDS = 60;
export const STEPS = 100;
const lane = (group: number) => 0.22 + group * 0.28;
const smooth = (t: number) => {
  const v = Math.max(0, Math.min(1, t));
  return v * v * (3 - 2 * v);
};

export function traceEnd(study: number, group: number) {
  return traceStudies[study].shape === 1 && group === 0 ? 0.53 : 1;
}

// Geometry shares its endpoints with the readable labels; the strands are not telemetry.
export function tracePoint(study: number, line: number, progress: number) {
  const group = Math.floor(line / 20);
  const local = ((line % 20) - 9.5) * 0.006;
  const t = progress * traceEnd(study, group);
  const shape = traceStudies[study].shape;
  const merge = shape === 2 || shape === 4;
  const start = merge ? lane(group) : 0.5 + (group - 1) * 0.035;
  const finish = merge ? 0.5 + (group - 1) * 0.025 : lane(group);
  const splitAt = [0.35, 0, 0.12, 0.12, 0.4, 0.28][shape];
  const fork =
    shape === 1 ? smooth(progress) : smooth((t - splitAt) / (0.95 - splitAt));
  const bend = Math.sin(t * Math.PI * 2) * Math.sin(t * Math.PI) * 0.075;
  const irregularity =
    shape === 5
      ? Math.sin(t * 25 + line * 0.6) *
        0.018 *
        Math.pow(1 - t, 2) *
        Math.sin(t * Math.PI)
      : 0;
  return {
    x: 0.02 + t * 0.96,
    y: start * (1 - fork) + finish * fork + local + bend + irregularity,
  };
}

export function traceLabels(study: number): {
  inputs: TraceLabel[];
  outputs: TraceLabel[];
} {
  const trace = traceStudies[study];
  return {
    inputs: trace.input.map((text, index) => ({
      text,
      x: 0.02,
      y: trace.input.length === 1 ? 0.56 : lane(index) + 0.035,
    })),
    outputs: trace.output.map((text, index) => ({
      text,
      x: 0.02 + traceEnd(study, index) * 0.96,
      y: trace.output.length === 1 ? 0.56 : lane(index) + 0.035,
    })),
  };
}
