import type { Note } from "./writing";

export const agentReliabilityNote: Note = {
  "slug": "agent-reliability-debt",
  "title": "AI Agents Have a Reliability Debt Problem—and Benchmarks Aren’t Paying It Off",
  "topic": "Agent reliability",
  "description": "The agent economy is attracting serious money. The harder question is whether these systems can earn serious trust.",
  "sections": [
    {
      "id": "the-demo",
      "label": "The demo vs. the work",
      "paragraphs": [
        "There is a familiar moment in almost every AI agent demo.",
        "The agent opens a browser, reads a document, calls a tool, updates a spreadsheet, and returns a neat summary. It feels less like software and more like watching a capable colleague work. Then the demo ends—usually before the awkward questions begin.",
        "What happens on the 500th run? What if the tool returns an unusual error? What if the customer record is incomplete, the website changes, or the model confidently misreads an instruction? Can anyone reconstruct why the agent made a decision? And if it does the wrong thing, can the business undo it?",
        "These are not edge cases. They are the gap between a prototype that impresses and a product that survives.",
        "AI agents have accumulated reliability debt: the hidden future cost created when teams add autonomy faster than they add testing, controls, observability, and recovery. Benchmarks help us measure capability, but most do not tell us whether an agent is dependable enough to run inside a real company. The market is rewarding what agents can do. Customers will ultimately pay for what agents can do repeatedly, safely, and economically."
      ]
    },
    {
      "id": "market-signal",
      "label": "Market vs. production",
      "title": "The market signal is loud. The production signal is mixed.",
      "paragraphs": [
        "The agent boom is not imaginary. According to Stanford HAI’s 2026 AI Index, global private investment in AI reached $344.7 billion in 2025, up 127.5% year over year. Generative AI companies accounted for $170.9 billion of that total. The same report says 88% of surveyed organizations used AI in 2025.",
        "But agent use remained in the single digits across almost every business function. That gap matters. Enterprises are comfortable experimenting with AI; they are much less comfortable handing it the keys.",
        "Gartner’s warning is blunt: it predicts that more than 40% of agentic AI projects will be cancelled by the end of 2027 because of escalating costs, unclear business value, or inadequate risk controls. Gartner also estimates that only about 130 of the thousands of vendors describing themselves as “agentic” offer substantive agent capabilities.",
        "This is the market’s current contradiction:",
        "Capital is pricing in autonomy. Buyers are still pricing in failure.",
        "For startups, that creates both danger and opportunity. A company can grow quickly on a compelling demo, but demos compress uncertainty. Production expands it. The winning products may not be the agents with the most freedom. They may be the systems that make autonomy boring, bounded, and measurable."
      ]
    },
    {
      "id": "reliability-debt",
      "label": "Reliability debt",
      "title": "Reliability debt works like technical debt—with a wider blast radius",
      "paragraphs": [
        "Technical debt usually means shortcuts in code that make future changes slower or riskier. Reliability debt is similar, but it builds up across the entire agent system:"
      ],
      "blocks": [
        {
          "type": "list",
          "items": [
            "a prompt that works only on familiar examples;",
            "permissions that are broader than the task requires;",
            "tool calls without schema validation;",
            "retries without a limit or cost budget;",
            "no durable trace of the agent’s decisions;",
            "evaluations run only before launch;",
            "no safe way to stop, reverse, or escalate an action;",
            "a business KPI that tracks usage but not corrected errors."
          ]
        },
        {
          "type": "paragraph",
          "text": "None of these choices necessarily breaks a prototype. Together, they make scale dangerous."
        },
        {
          "type": "paragraph",
          "text": "Traditional software is mostly deterministic: the same input and state should produce the same output. An agent combines a probabilistic model with changing context, third-party tools, permissions, memory, and multi-step plans. Its failure surface is not one model response. It is the interaction among all those parts."
        },
        {
          "type": "paragraph",
          "text": "That is why a high score at the model layer can coexist with a weak product at the system layer."
        }
      ]
    },
    {
      "id": "long-workflows",
      "label": "Long workflows",
      "title": "The quiet mathematics of long workflows",
      "paragraphs": [
        "Suppose every step in a workflow succeeds 99% of the time. That sounds excellent. Across 100 dependent steps, however, the chance that every step succeeds is roughly 36.6%, assuming independent failures and no recovery."
      ],
      "blocks": [
        {
          "type": "media",
          "media": "agent-reliability-chart"
        },
        {
          "type": "paragraph",
          "text": "Real systems are more complicated than this illustration. Some failures are correlated. Good systems detect and recover from errors. Bad ones amplify an early mistake across every later action. The point is not that every 100-step agent will fail 63.4% of the time. The point is that step accuracy is not end-to-end reliability."
        },
        {
          "type": "paragraph",
          "text": "This is also why “the task completed” is a weak metric. An agent might finish after three retries, consume ten times the expected tokens, use an unsafe workaround, produce a result that requires human repair, or quietly modify the wrong record. A binary pass can hide all of that."
        }
      ]
    },
    {
      "id": "benchmarks",
      "label": "Benchmark limits",
      "title": "Benchmarks are useful. They are not a warranty.",
      "paragraphs": [
        "Benchmarks have driven real progress. SWE-bench, for example, evaluates systems on real GitHub issues, and its Verified set contains 500 engineer-confirmed solvable problems. METR’s time-horizon work offers another useful lens: instead of asking whether a model can answer isolated questions, it estimates the length of tasks—measured by expert human completion time—that an agent can finish at a given success rate.",
        "METR found that the 50%-reliability task horizon for frontier agents had been doubling roughly every seven months over a six-year period. That is a meaningful capability trend. It is also easy to misread. A 50% time horizon describes the point at which an agent succeeds half the time on a particular task distribution. It does not mean a company should accept a 50% success rate in production.",
        "Three benchmark problems deserve more attention."
      ],
      "blocks": [
        {
          "type": "heading",
          "text": "1. Public tests become targets"
        },
        {
          "type": "paragraph",
          "text": "Once a benchmark influences reputation and purchasing, labs optimize for it. Test data or solutions can leak into training corpora. Agents with web access can encounter benchmark material at run time. Scaffolds can exploit quirks that have little to do with the intended capability."
        },
        {
          "type": "paragraph",
          "text": "OpenAI’s 2026 guidance on third-party evaluations describes how contamination, broken problems, unintended shortcuts, and evaluation awareness can distort results. In one example, an initial METR estimate suggested a roughly 13-hour time horizon for GPT-5.4; after human review removed successes involving reward hacking, the estimate fell to about six hours."
        },
        {
          "type": "paragraph",
          "text": "The lesson is not “ignore benchmarks.” It is “inspect what produced the score.”"
        },
        {
          "type": "heading",
          "text": "2. A clean environment removes the mess that defines real work"
        },
        {
          "type": "paragraph",
          "text": "Benchmark tasks usually begin with a clear goal, known tools, stable credentials, and enough context. Businesses are not like that. Requirements conflict. APIs time out. Customers change their minds. Data is stale. A permission expires halfway through the task. A correct action in one jurisdiction may be a compliance violation in another."
        },
        {
          "type": "paragraph",
          "text": "Stanford’s 2026 AI Index notes that agent benchmarks remain underdeveloped in areas such as human–AI interaction and multi-agent coordination. It also warns that contamination can inflate scores and that strong benchmark performance does not always translate into real-world utility."
        },
        {
          "type": "heading",
          "text": "3. Leaderboards compress a system into one number"
        },
        {
          "type": "paragraph",
          "text": "An agent is a model plus a scaffold, tools, prompts, memory, policies, and an execution environment. Change any one of those and the outcome can change. A leaderboard score often hides:"
        },
        {
          "type": "list",
          "items": [
            "how many attempts were allowed;",
            "how much inference cost was spent;",
            "whether a human selected the best result;",
            "how long the task took;",
            "whether failures were obvious or silent;",
            "whether the action was reversible;",
            "whether the same result appears across repeated runs."
          ]
        },
        {
          "type": "paragraph",
          "text": "A startup can therefore “win” a benchmark while losing the unit economics."
        }
      ]
    },
    {
      "id": "reliability-stack",
      "label": "A dependable loop",
      "title": "Reliability is a stack, not a model setting",
      "paragraphs": [
        "Teams often respond to failures by changing the prompt or upgrading the model. Sometimes that helps. It is rarely enough. Production reliability needs an architecture that assumes the model will occasionally be wrong.",
        "A dependable agent loop has seven parts:"
      ],
      "blocks": [
        {
          "type": "numbered",
          "items": [
            "Intent: translate a request into a clear goal, constraints, and definition of done.",
            "Policy: decide what this agent, for this user, is allowed to read, change, spend, or send.",
            "Plan: break work into bounded steps with budgets and stopping conditions.",
            "Act: call tools through typed interfaces, least-privilege credentials, and idempotent operations where possible.",
            "Verify: test the output against business rules, external sources, or deterministic checks.",
            "Observe: record decisions, tool calls, latency, token use, cost, and state changes.",
            "Recover: retry selectively, roll back safely, stop when uncertain, or escalate to a person."
          ]
        },
        {
          "type": "paragraph",
          "text": "Human review belongs in the exception lane, not as a decorative approval button. High-impact actions, ambiguous intent, policy conflicts, and exhausted retries should route to someone who has enough context and authority to decide."
        },
        {
          "type": "paragraph",
          "text": "This architecture changes the product question from “How autonomous is our agent?” to “How much autonomy has this workflow earned?”"
        }
      ]
    },
    {
      "id": "scorecard",
      "label": "What to measure",
      "title": "The metrics that should sit beside benchmark scores",
      "paragraphs": [
        "A production agent needs a reliability scorecard tied to user and business outcomes. At minimum, track:"
      ],
      "blocks": [
        {
          "type": "table",
          "columns": [
            "Metric",
            "What it tells you"
          ],
          "rows": [
            [
              "End-to-end task success",
              "Whether the user’s actual goal was achieved"
            ],
            [
              "First-pass success",
              "How often the system works without retries or repair"
            ],
            [
              "Silent failure rate",
              "Incorrect outcomes the system did not flag"
            ],
            [
              "Human correction minutes",
              "The real labor returned to the workflow"
            ],
            [
              "Cost per successful task",
              "Unit economics after retries and verification"
            ],
            [
              "P50 / P95 completion time",
              "Typical speed and painful tail latency"
            ],
            [
              "Recovery rate",
              "How often the system repairs a detected failure"
            ],
            [
              "Escalation precision",
              "Whether human attention is requested at the right moments"
            ],
            [
              "Policy-violation rate",
              "Unsafe or unauthorized attempted actions"
            ],
            [
              "Outcome consistency",
              "Variation across repeated runs of equivalent tasks"
            ]
          ]
        },
        {
          "type": "paragraph",
          "text": "The most important denominator is successful task, not call, token, or run. A cheap attempt that fails is not cheap. A fast result that needs 20 minutes of cleanup is not fast."
        },
        {
          "type": "paragraph",
          "text": "Teams should also separate three types of evaluation:"
        },
        {
          "type": "list",
          "items": [
            "Capability evals: Can the system do the task at all?",
            "Reliability evals: Does it keep working across variation, repetition, and time?",
            "Business evals: Does the workflow create measurable value after cost, oversight, and risk?"
          ]
        },
        {
          "type": "paragraph",
          "text": "Conflating these makes weak products look strong."
        }
      ]
    },
    {
      "id": "startup-cost",
      "label": "Startup costs",
      "title": "What reliability debt does to an AI startup",
      "paragraphs": [
        "Reliability debt does not stay in engineering. It moves through the income statement.",
        "Support costs rise. Every ambiguous failure becomes a ticket that requires someone to inspect a long trace—if a usable trace exists.",
        "Gross margins shrink. Retries, larger models, long contexts, and redundant verification can turn a healthy-looking API margin into an expensive managed service.",
        "Sales cycles lengthen. Security, compliance, and procurement teams ask for evidence: audit logs, access controls, incident procedures, evaluation data, and clear ownership when the agent acts incorrectly.",
        "Expansion stalls. A pilot may delight ten friendly users. A broad rollout exposes edge cases, inconsistent data, permission boundaries, and regional rules.",
        "The team becomes reactive. Engineers spend their time patching prompts and handling incidents instead of improving the product’s core economics.",
        "There is also a strategic trap: a startup may use autonomy as its differentiator when customers actually value accountability. If a buyer cannot understand, constrain, or reverse the agent’s actions, greater autonomy can reduce—not increase—the product’s value.",
        "The moat is not just a smarter model wrapper. It is the accumulated operational knowledge around a workflow: failure taxonomies, high-quality traces, private evals, recovery playbooks, permission design, customer-specific policies, and evidence that the system improves over time."
      ]
    },
    {
      "id": "paying-it-down",
      "label": "Paying it down",
      "title": "A practical way to pay the debt down",
      "paragraphs": [
        "Start with one narrow, valuable workflow. Map every state-changing action. Decide which failures are tolerable, which require confirmation, and which must be impossible. Then build the evaluation around the workflow—not around the model’s personality.",
        "Use a representative test set drawn from real work, including awkward cases: missing fields, conflicting instructions, tool outages, stale data, permission errors, prompt injection, and tasks that should be refused. Run it on every material change to the model, prompt, tool, policy, or memory layer.",
        "In production, sample traces and label outcomes continuously. Turn incidents into regression tests. Put limits on time, cost, retries, and action scope. Prefer reversible operations. Use canary releases. Increase autonomy only when the data shows that the workflow can handle it.",
        "A useful operating rule is:",
        "Capability earns a trial. Reliability earns a renewal."
      ]
    },
    {
      "id": "earned-trust",
      "label": "Earned trust",
      "title": "The next benchmark is the balance sheet",
      "paragraphs": [
        "AI agents are improving quickly. The correct response is neither blind optimism nor blanket dismissal. It is to recognize that capability progress and production reliability are different curves.",
        "Benchmarks will remain valuable for comparing systems and spotting new capabilities. But they cannot pay down reliability debt for a company. Only operational evidence can do that: repeated success, known failure modes, controlled permissions, recoverable actions, honest unit economics, and outcomes customers can trust.",
        "The AI startups that understand this will tell a different story. They will talk less about replacing whole jobs overnight and more about owning a workflow end to end. They will treat evaluation as product infrastructure, not launch marketing. They will design human judgment into the system instead of pretending it has disappeared.",
        "The agent economy does not have a shortage of intelligence. It has a shortage of earned trust.",
        "And trust, unlike a benchmark score, compounds in the right direction.",
        "Data note: Market and adoption figures refer to 2025 data published in the 2026 AI Index. The compounding-reliability chart is an illustration, not a measured forecast; it assumes independent steps and no recovery."
      ]
    }
  ],
  "sources": [
    {
      "title": "Stanford HAI, 2026 AI Index: Economy",
      "href": "https://hai.stanford.edu/ai-index/2026-ai-index-report/economy"
    },
    {
      "title": "Stanford HAI, 2026 AI Index: Technical performance",
      "href": "https://hai.stanford.edu/assets/files/ai_index_report_2026_chapter_2_technical.pdf"
    },
    {
      "title": "Gartner, agentic AI project forecast",
      "href": "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027"
    },
    {
      "title": "METR, time horizons",
      "href": "https://metr.org/time-horizons/"
    },
    {
      "title": "OpenAI, trustworthy third-party evaluations",
      "href": "https://openai.com/index/trustworthy-third-party-evaluations-foundations/"
    },
    {
      "title": "SWE-bench",
      "href": "https://www.swebench.com/SWE-bench/"
    }
  ]
};
