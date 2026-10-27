# Portfolio content review

Reviewed on 24 October 2026. Descriptions are based on the public source at the
revisions below, not on repository names, generated scores or README ambitions.
This was a source review, not an execution or security certification of each app.

## Public profiles

- [GitHub](https://github.com/mahekara28): the official REST API returned 28 public
  repositories. Nine original repositories were selected for closer source review.
  Forks were not presented as Mahek's own projects. The contact email is from the
  public GitHub profile.
- [LinkedIn](https://www.linkedin.com/in/mahek-ara/): only an indexed public summary
  was accessible. It mentioned Sambhav Foundation, but did not provide enough
  information to verify a role title, responsibilities or achievements. No such
  details were added. Existing user-provided educational background was preserved,
  not independently certified.
- [X](https://x.com/mahekara28): the supplied profile link is retained, but usable
  technical posts were not accessible. There is no X feed or claim of synchronisation.
- The existing Google Drive resume link is preserved. Automated browsing could
  not verify the document's sharing permissions or contents.

## Reviewed repositories

| Project                                                                                                                                | Reviewed revision | Evidence and important limits                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Context Relay](https://github.com/mahekara28/context-relay/tree/139d3c44df7882750db59c1ed87a6a45da7bfb53)                             | `139d3c4`         | Python action harness, structured verification, release-file readback example, integration guide and validation report. Public alpha. Configured checks are not a general guarantee; instruction parsing and provider support have documented limits. No organisational pilot or hosted-provider acceptance claim. |
| [RouterFlow / LLM Router](https://github.com/mahekara28/LLM---Router/tree/375eef5595611659548ff99fb5ce90ecbd163116)                    | `375eef5`         | `main.py`, `router.py`, `llm.py` and interface title confirm RouterFlow. Keyword routing and measured Ollama call latency. Three route labels map to two models; cost is a fixed zero. No savings or learned-routing claim.                                                                                        |
| [Narrative Gap MCP](https://github.com/mahekara28/Narrative-Gap-MCP/tree/fecd1749ff53965b62bb838858922a768f32d114)                     | `fecd174`         | GitHub ingestion, rule-based signals, templated brief and analysis tests. Some dashboard values are derived proxies, not observed docs or event analytics. Full MCP integration is not implemented.                                                                                                                |
| [MCP Impact](https://github.com/mahekara28/mcp-impact/tree/31e7a74a2d0e4644662b1b50f3b9718a906b19ee)                                   | `31e7a74`         | GitHub comparison, supported contract parsing, bounded reference scans, report logic and sample PDF. Dependencies are inferred, not runtime traces. PDF generation has a machine-specific Python path requiring configuration.                                                                                     |
| [Prompt Injection Lab / Sentinel AI](https://github.com/mahekara28/Prompt-Injection-Lab/tree/6a9f15b22cf9c6926185b18d497eb9e9c473f73d) | `6a9f15b`         | FastAPI app with 100 predefined prompts in five categories. Outcome and risk calculations are deterministic simulation rules. No live model is attacked; scores are not real security measurements.                                                                                                                |
| [Build, Buy or Borrow](https://github.com/mahekara28/build-buy-borrow/tree/bd642ab465fa10c5487707cde4e46c0ed0495912)                   | `bd642ab`         | Separate planning engine, constraint tests and case-study documentation. Greedy assignment, readiness and capacity checks, reproducible plans. Fictional data and illustrative costs; not client savings or a mathematically optimal staffing solution.                                                            |
| [Merchant Ops Desk](https://github.com/mahekara28/merchant-ops-desk/tree/0816dc9a7cbc5aa5c2d9d1447bea7dfa52ce8ccc)                     | `0816dc9`         | TypeScript scoring, CSV parsing, local storage, optional Supabase adapter and row-level policies. Suggestions are deterministic. Cloud storage was not exercised; no live merchant or business-impact claim.                                                                                                       |
| [KnowWhen AI](https://github.com/mahekara28/knowwhen-ai/tree/cae85875e96eb416bd3b7bea7e39bb46500261f2)                                 | `cae8587`         | Streamlit interface, keyword timing rules and Ollama Llama 3.2 call. Corrected the previous OpenAI attribution. No calendar integration or schedule validation.                                                                                                                                                    |
| [Insightify](https://github.com/mahekara28/Insightify/tree/a56123b50b9148d7479c1979604f64f443e7d476)                                   | `a56123b`         | Small Streamlit-to-Gemini Q&A application. Corrected the analytics description. Current provider compatibility is unverified. The repository tree includes an `.env` file; it was not opened or copied. The owner should review that tracked file for credentials and rotate any exposed secrets.                  |

The public inventory and reviewed implementations did not establish projects
named CodePilot MCP, OmniDesk AI or CommunityOps AI. They were not invented,
renamed from unrelated repositories or added without evidence. RouterFlow was
confirmed as the application name inside `LLM---Router`.

## Selection and presentation

The six existing trace shapes remain, in a supporting preview beside the project
list. RouterFlow leads with a small Python application. Narrative Gap and MCP
Impact connect engineering to developer experience. The security simulation is
labelled honestly, and Build, Buy or Borrow adds decision-support work. Context
Relay is sixth, with the same source-backed details as the other projects. The
remaining three projects stay discoverable in the index with their original anchors.

The writing archive retains the routing article and links to the staffing case
study, MCP Impact's setup guide and Context Relay's validation notes. These are
labelled as documentation, not invented blog posts, talks or community achievements.

On 27 October 2026, the public inventory was checked again (28 repositories),
along with the latest commit and primary implementation file for each of the nine
listed projects. All nine heads still matched the reviewed revisions above. The
shortened descriptions do not introduce new capability or deployment claims.

The planning screenshot is the original `preview-studio.png` at revision
`bd642ab465fa10c5487707cde4e46c0ed0495912`, stored locally as
`public/projects/build-buy-borrow.png`. Its caption identifies fictional data.
No hosted demo was added without a verified demo URL.

## Integration boundary

`npm run content:refresh` uses the official public GitHub REST API to refresh a
checked-in metadata snapshot for the curated repository allowlist. It reuses a
snapshot younger than six hours, validates identity and visibility, strips unused
fields, limits network time and pagination, and replaces the file only after a
complete successful response. Failures preserve the previous snapshot.

An optional `GITHUB_TOKEN` is read only by the local/CI refresh script. It is never
included in browser code or written to the snapshot. No token is required for
public access within GitHub's unauthenticated limits. Do not use a `NEXT_PUBLIC_`
variable for it.

This is an explicit refresh-and-deploy workflow, not a scheduled sync or live feed.
Page loads make no GitHub, X or LinkedIn API requests. Source review dates and
pinned revision links stay unchanged until a human reviews the implementation.
Refreshing metadata cannot update capability claims. X and LinkedIn remain
curated links because authenticated API access was not available.

## Re-review checklist

1. Read the changed implementation, not only the README.
2. Update the description, status and limits in `app/lib/content.ts` as needed.
3. Update the pinned revision and evidence paths only after reviewing them.
4. Keep trace labels conceptual and consistent with the implementation.
5. Refresh metadata, run checks, inspect screenshots and deploy through the normal workflow.
