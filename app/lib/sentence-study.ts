export const prompt = "How does an LLM answer?";
export const contexts = ["Briefly", "More detail"] as const;
export type Context = 0 | 1;
type TokenStep = { candidates: readonly [string, string, string]; pick: 0 | 1 | 2 };

// Curated examples of autoregressive generation, not model output or tokenizer data.
// Alternatives have no assigned probabilities. A different instruction selects a
// different authored sequence; previously chosen pieces become its context.
export const sequences: readonly (readonly TokenStep[])[] = [
  [
    { candidates: ["One", "A", "The"], pick: 0 },
    { candidates: [" step", " word", " token"], pick: 2 },
    { candidates: [" at", " from", " in"], pick: 0 },
    { candidates: [" the", " a", " each"], pick: 1 },
    { candidates: [" turn", " time", " step"], pick: 1 },
    { candidates: [",", ".", "—"], pick: 1 },
  ],
  [
    { candidates: ["Every", "Each", "The"], pick: 1 },
    { candidates: [" next", " chosen", " new"], pick: 2 },
    { candidates: [" token", " word", " step"], pick: 0 },
    { candidates: [" shapes", " helps", " changes"], pick: 1 },
    { candidates: [" define", " guide", " shape"], pick: 2 },
    { candidates: [" a", " the", " each"], pick: 1 },
    { candidates: [" next", " answer", " output"], pick: 0 },
    { candidates: [".", ",", "—"], pick: 0 },
  ],
];

export const tokenDuration = 1.6;
export const phaseStarts = [0, .3, .65, 1.05] as const;
export const phases = [
  "Reading the context",
  "Considering the next token",
  "Choosing one",
  "Adding it back to the context",
] as const;

export function duration(context: Context) {
  return sequences[context].length * tokenDuration;
}

export function sentenceAt(elapsed: number, context: Context) {
  const sequence = sequences[context];
  const time = Math.max(0, elapsed);
  const complete = time >= duration(context);
  const step = Math.min(sequence.length - 1, Math.floor(time / tokenDuration));
  const local = complete ? tokenDuration : time - step * tokenDuration;
  const phase = local < phaseStarts[1] ? 0 : local < phaseStarts[2] ? 1 : local < phaseStarts[3] ? 2 : 3;
  const current = sequence[step];
  const previous = sequence.slice(0, step).map(({ candidates, pick }) => candidates[pick]).join("");
  const token = current.candidates[current.pick];
  const completion = previous + (phase === 3 ? token : "");
  return {
    phase,
    step,
    count: step + (phase === 3 ? 1 : 0),
    total: sequence.length,
    candidates: current.candidates,
    token,
    previous,
    completion,
    selected: phase >= 2 ? current.pick : null,
    // The return stroke makes the accepted token joining the context visible
    // before the next iteration begins.
    contextText: `${prompt} ${contexts[context]}.${completion ? ` ${completion}` : ""}`,
    complete,
  } as const;
}

