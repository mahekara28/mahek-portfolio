# Inference provider evaluation method

The [portfolio article](https://mahekara.vercel.app/blog/inference-provider-evaluation) compares publicly
documented deployment paths, not vendor performance. The accompanying
[`inference-run-sheet.csv`](../public/downloads/inference-run-sheet.csv) is a
blank measurement log. It includes no invented results.

## One row per controlled run

Record the same model revision, tokenizer, sampling policy, prompt set, input
and output length distribution, client region, arrival trace, concurrency and
warm-up policy for every comparable provider. If those controls cannot be held
constant, write the mismatch in `open_question` and compare product fit instead
of publishing a speed ranking.

`client_ttft_*` and `client_e2e_*` are measured at the same client boundary for
every provider. `server_queue_p95_ms` is optional diagnostic data and must not
replace client timing. Keep failures and throttles in the sheet.

Before running a trial, define the p95 first-token and completion targets with
the product owner. For the observation window:

```text
qualified_requests = successful requests meeting both targets
cost_per_qualified_request_usd = total_inference_spend_usd / qualified_requests
```

If `qualified_requests` is zero, leave the cost field empty and report the
failure, rather than dividing by zero or implying the option is economical.
The spend figure should include token or compute charges, warm capacity,
platform fees and separately billed supporting infrastructure. Keep a link to
the source invoice, export or run artifact in `evidence_url`.

## Source and scope

Product paths were read from [Simplismart's BYOC guide](https://simplismart.ai/blog/byoc-ai-infrastructure),
[Modal's endpoint documentation](https://modal.com/docs/guide/endpoints), and
[Baseten's deployment descriptions](https://www.baseten.co/security/) on 20
November 2026. The measurement fields follow the [vLLM timing definitions](https://docs.vllm.ai/en/latest/features/per_request_metrics/)
and [load patterns](https://docs.vllm.ai/en/latest/benchmarking/cli/).
Vendor pages describe capabilities; they do not establish a matched benchmark.
