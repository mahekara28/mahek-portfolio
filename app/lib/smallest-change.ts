/**
 * A deliberately narrow, local version of MCP Impact's optional → required
 * check. The inventory is fictional demo data from the pinned source below,
 * not a scan of this portfolio and not a set of executed consumers.
 */
export const impactSource = {
  revision: "31e7a74a2d0e4644662b1b50f3b9718a906b19ee",
  url: "https://github.com/mahekara28/mcp-impact/blob/31e7a74a2d0e4644662b1b50f3b9718a906b19ee/script.js",
  fixture: "scenarios.customer",
} as const;

export type Contract = {
  tools: {
    name: string;
    params: { name: string; type: string; required: boolean }[];
  }[];
};
export type Consumer = {
  id: string;
  name: string;
  category: string;
  toolRefs: readonly string[];
  sourcePath: string;
};
export type Requirement = { tool: string; field: string };

export const baseline: Contract = {
  tools: [
    {
      name: "search_accounts",
      params: [
        { name: "segment", type: "string", required: false },
        { name: "region", type: "string", required: false },
        { name: "lifecycle_stage", type: "string", required: false },
      ],
    },
    {
      name: "get_account_health",
      params: [{ name: "account_id", type: "string", required: true }],
    },
    {
      name: "create_success_brief",
      params: [
        { name: "account_id", type: "string", required: true },
        { name: "tone", type: "string", required: false },
      ],
    },
  ],
};

export const consumers: readonly Consumer[] = [
  {
    id: "prompt-01",
    name: "QBR Prompt Builder",
    category: "Prompt",
    toolRefs: ["search_accounts", "create_success_brief"],
    sourcePath: "prompts/qbr-builder.md",
  },
  {
    id: "workflow-02",
    name: "CSM Renewal Triage",
    category: "Workflow",
    toolRefs: ["get_account_health", "search_accounts"],
    sourcePath: "workflows/renewal-triage.ts",
  },
  {
    id: "eval-03",
    name: "Brief Quality Regression",
    category: "Eval",
    toolRefs: ["create_success_brief"],
    sourcePath: "evals/brief-quality.spec.ts",
  },
  {
    id: "workflow-04",
    name: "Account Discovery Agent",
    category: "Workflow",
    toolRefs: ["search_accounts"],
    sourcePath: "agents/account-discovery.ts",
  },
];

export function contractWithRequirement(required: boolean): Contract {
  return {
    tools: baseline.tools.map((tool) => ({
      ...tool,
      params: tool.params.map((param) => ({
        ...param,
        required:
          tool.name === "search_accounts" && param.name === "lifecycle_stage"
            ? required
            : param.required,
      })),
    })),
  };
}

export function newRequirements(
  before: Contract,
  after: Contract,
): Requirement[] {
  return after.tools.flatMap((tool) => {
    const previous = before.tools.find((entry) => entry.name === tool.name);
    return tool.params.flatMap((param) => {
      const old = previous?.params.find((entry) => entry.name === param.name);
      return old && !old.required && param.required
        ? [{ tool: tool.name, field: param.name }]
        : [];
    });
  });
}

export function assessConsumers(
  before: Contract,
  after: Contract,
  inventory: readonly Consumer[],
) {
  const changes = newRequirements(before, after);
  return inventory.map((consumer) => {
    const reasons = changes.filter((change) =>
      consumer.toolRefs.includes(change.tool),
    );
    return {
      ...consumer,
      reasons,
      status: reasons.length ? ("review" as const) : ("unflagged" as const),
      // Null means unknown, not a successful run or zero failures.
      confirmedFailure: null,
      execution: "not-run" as const,
    };
  });
}
