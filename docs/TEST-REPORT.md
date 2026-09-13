# Implementation verification

Verified 2026-09-14. This records the implemented working tree; cloud credentials and a working generated-code sandbox are separate readiness gates.

| Check | Result |
|---|---|
| Controller lint and TypeScript | Passed. |
| Full unit/integration/execution suite | 486 tests passed across 31 files after the Mend demo/stream, bootstrap, setup helper and pending-worker changes. |
| Controller production build | Passed. |
| Production browser tests | All 21 scenarios have passing evidence: 19 passed initially; the two new stream/fallback cases passed on targeted rerun after unique complaint fixtures prevented intended incident grouping. No app change was needed for those two failures. |
| Standalone weather production build | Passed in its own repository using Bun 1.4.2. The target pins `packageManager` and `.bun-version`, uses `bun.lock`, and passes frozen installation and TypeScript checking; the seeded conversion defect is unchanged. |
| Actual Chromium weather baseline | Correctly reproduces seeded conversion failure; 34 protected observations recorded. The target intentionally remains unfixed. |
| Real OpenAI writer smoke | Passed with gpt-5-mini; recorded cost $0.000159. |
| Real durable triage smoke | Passed after correcting the strict nullable model schema; recorded cost $0.000359. |
| Real 60-case persona evaluation | Passed with gpt-5-mini: 20/20 eligible examples accepted; 0/20 hard exclusions, 0/10 ambiguous examples and 0/10 factual examples accepted for autonomous replies. All 12 writer/validator calls settled at $0.012922. [Full results and ledger](../artifacts/live-persona-evaluation.json). No policy was activated or public reply sent. |
| GitHub configuration | Independent target pushed, immutable baseline configured, read-only SSH checkout verified, protected branches and separate environments configured. |
| Secret scan | Configured secret values absent from Git candidate files. Private environment bundles remain ignored. |

The first two durable triage attempts failed. Their reservations totaling $0.009157 remain conservatively counted as unknown charges; the successful retry does not erase those reservations. Model charges and infrastructure commitments are tracked separately. A $1 infrastructure allowance was reserved for bounded GitHub CI and artifact storage; it is a budget reservation, not proof of a charge.

The persona evaluation's initial final callback failed because its digest depended on JSON property order across the Convex storage boundary. Both producer and validator now hash canonical JSON, with a regression test that reorders object keys. The saved, unmodified writer and independent-validator outputs were recovered, passed the unchanged 60-case guard, and were replayed into the original task without another model call. [Recovery record](../artifacts/live-persona-evaluation-recovery.json) and [saved final batch](../artifacts/live-persona-final-batch-raw.json) preserve this history. The policy remains pending, without human approval.

Recorded model usage costs total **$0.013440**: writer smoke $0.000159, successful durable triage $0.000359, and the 60-case evaluation $0.012922. Retained unknown model reservations are **$0.009157**. With the separate $1 infrastructure allowance, recorded cost exposure before GCP provisioning is **$1.022597**; the allowance and unknown reservations are not represented as confirmed vendor charges.

New GCP charges have not yet been reconciled into that application ledger. No GCP budget or alert policy was created.

The tests cover revision-bound approvals, role and service-key checks, signed Slack replay, budget concurrency, restricted patch scope, release locks, deployment identity, public-send guards, opt-outs, cancellation, unknown-send reconciliation, persona gates, and supplemental manual resolution. Browser tests additionally verify admission, HttpOnly access cookies, wrong-code/tampered-cookie rejection, and cross-origin rejection. See [UI-VERIFICATION.md](UI-VERIFICATION.md) and [ACCEPTANCE-MATRIX.md](ACCEPTANCE-MATRIX.md).

## Remaining live evidence

No full customer-to-fix-to-public-reply run is claimed. The current user cannot access the local Docker daemon, so generated candidate execution has not run. Slack, Linear, hosted Convex, Vercel, the check-writing GitHub App, and the chosen social accounts require the account setup in [SETUP-REMAINING.md](SETUP-REMAINING.md). There has been no live PR-based weather repair, staging/promotion, X send, or Reddit send. Manual fallback and provider behavior have local automated coverage.

GitHub Actions results are separate from local checks. The [controller draft PR #1](https://github.com/Aarush-Dubey/hackathon/pull/1) is open. Its first run on implementation commit `90dd60f` stopped before application tests because actions/checkout was given an empty token input despite an SSH key. The workflow fix supplies the ephemeral GitHub token as the action input fallback, retains the read-only weather SSH key, and is being rerun. No CI pass is claimed until the run finishes. A configured key, successful health response, or passing fixture does not count as a live integration test.

## Mend and GCP follow-up

The 13-step simulation completed in the production browser with pause/reload/resume/restart coverage. Cross-tab SSE delivery passed with observer HTTP reads blocked; a 503 stream failure recovered through HTTP fallback and returned to SSE without a reload. Ten stream unit tests cover access failure, cancellation, native callback delivery, redaction and renewal. Five pending-worker tests ensure every job/import/verification endpoint rejects while setup is incomplete.

GCP project and billing linkage are real, as are the runtime/build identities and four scoped Secret Manager entries. Both worker images built successfully and both Cloud Run services are deployed in setup-pending mode. Their public health routes report ready=false, and job routes reject requests with HTTP 503 until the remaining public URLs are configured. [Deployment evidence](../artifacts/gcp-worker-deployment.json) records the actual revisions, image digests and probes. Chromium execution on Cloud Run remains unverified. No live social post, weather fix or release is implied by infrastructure setup.

## Linear setup correction

The user’s real metadata request returned HTTP 400 with “Query too complex.” The helper now reads teams and workflow states in separate cursor-paginated queries and distinguishes complexity, access and rate-limit failures without printing provider bodies or credentials. Ten focused tests, targeted lint and whole-project TypeScript passed after this change. A real read-only run found Drizzle/Done and the selected IDs were saved locally. [Evidence](../artifacts/linear-setup.json). The earlier full-suite count of 486 predates these four added tests; no later full-suite run is claimed here.
