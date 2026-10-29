export type Conditions = { privateDocument: boolean; localAvailable: boolean };
export type RouteId = "local" | "hosted" | "ask";

// A deliberately small executable policy, not an LLM or a model-quality score.
// Local-first ordering is explicit. A fallback cannot override data permission.
export function evaluateDecision(conditions: Conditions) {
  const { privateDocument, localAvailable } = conditions;
  const selected: RouteId = localAvailable ? "local" : !privateDocument ? "hosted" : "ask";
  return {
    selected,
    routes: [
      {
        id: "local" as const,
        label: "Keep it here",
        allowed: localAvailable,
        reason: localAvailable ? "Available · no data leaves" : "Local model is unavailable",
        trace: "document / local model / summary / source notes",
      },
      {
        id: "hosted" as const,
        label: "Send it out",
        allowed: !privateDocument,
        reason: privateDocument ? "Blocked by the privacy rule" : "Allowed · fallback only",
        trace: "document / remote model / summary / source notes",
      },
      {
        id: "ask" as const,
        label: "Ask first",
        allowed: true,
        reason: selected === "ask" ? "No permitted model is available" : "No clarification needed yet",
        trace: "keep document / request permission / wait",
      },
    ],
    title: selected === "local" ? "Stay on this device."
      : selected === "hosted" ? "The fallback has permission."
      : "An answer can wait.",
    explanation: selected === "local"
      ? "The local model is ready. A cloud option doesn’t mean we need to use it."
      : selected === "hosted"
        ? "The local model is unavailable, and sharing this document is allowed."
        : "The local model is unavailable. Privacy still applies, so ask before sending anything.",
  };
}
