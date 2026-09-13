# Implementation verification

Verified 2026-09-14. **Latest source CI:** [34784514320](https://github.com/Aarush-Dubey/hackathon/actions/runs/34784514320) succeeded on `296f8d4`; the populated workspace passed 493 tests/32 files and 22 browser scenarios locally. The earlier counts below describe prior runs.

[GitHub CI run 34782975073](https://github.com/Aarush-Dubey/hackathon/actions/runs/34782975073) passed on source commit `9da2b61`: 490 automated tests across 31 files, all 21 browser scenarios in one run, lint, TypeScript, and both application builds. Cloud integration and generated-code execution remain separate readiness gates.

| Check | Result |
|---|---|
| Controller lint and TypeScript | Passed. |
| Full unit/integration/execution suite | 490 tests passed across 31 files in GitHub CI, including the Linear correction. The earlier local full run passed 486 before four tests were added. |
| Controller production build | Passed. |
| Production browser tests | All 21 scenarios passed together in GitHub CI in 1.4 minutes. Earlier local evidence was split across 19 initial passes and two corrected stream-fixture reruns; the complete CI run supersedes that limitation. |
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

No full customer-to-fix-to-public-reply run is claimed. The current user cannot access the local Docker daemon, so generated candidate execution has not run. Hosted Convex, Vercel, Linear settings and the GCP workers are now configured; remaining account and flow checks are listed in [SETUP-REMAINING.md](SETUP-REMAINING.md). The initial weather baseline has been deployed and promoted; no PR-based weather repair or candidate release, X send, or Reddit send has occurred. Manual fallback and provider behavior have local automated coverage.

GitHub Actions results are separate from local checks. The [controller draft PR #1](https://github.com/Aarush-Dubey/hackathon/pull/1) is open. Its first run on implementation commit `90dd60f` stopped before application tests because actions/checkout was given an empty token input despite an SSH key. The workflow fix supplies the ephemeral GitHub token as the action input fallback, retains the read-only weather SSH key, and passed in the subsequent run on `9da2b61`. [CI evidence](../artifacts/github-ci-verification.json) records the exact run and summaries. A configured key, successful health response, or passing fixture does not count as a live integration test.

## Mend and GCP follow-up

The 13-step simulation completed in the production browser with pause/reload/resume/restart coverage. Cross-tab SSE delivery passed with observer HTTP reads blocked; a 503 stream failure recovered through HTTP fallback and returned to SSE without a reload. Ten stream unit tests cover access failure, cancellation, native callback delivery, redaction and renewal. Five pending-worker tests ensure every job/import/verification endpoint rejects while setup is incomplete.

GCP project and billing linkage are real, as are the runtime/build identities and four scoped Secret Manager entries. Both worker images built successfully. The original setup-pending revisions were replaced with active revisions after hosted origins were configured. Their health routes now report ok; social platform permission remains pending. [Deployment evidence](../artifacts/gcp-worker-deployment.json) records the actual revisions, image digests and probes. Cloud Run Chromium execution is verified by the hosted baseline evidence below. No live social post, weather fix or release is implied by infrastructure setup.

## Linear setup correction

The user’s real metadata request returned HTTP 400 with “Query too complex.” The helper now reads teams and workflow states in separate cursor-paginated queries and distinguishes complexity, access and rate-limit failures without printing provider bodies or credentials. Ten focused tests, targeted lint and whole-project TypeScript passed after this change. A real read-only run found Drizzle/Done and the selected IDs were saved locally. [Evidence](../artifacts/linear-setup.json). The subsequent GitHub run passed all 490 automated tests and all 21 browser tests.

## Slack configuration evidence

The replacement bot token passed Slack auth.test for BitsUp; Mend is installed with chat:write and joined the created mend-approvals channel. All six settings, including the user-supplied Elen engineer ID and David marketer ID, are saved in .env/private bundle/local Convex. The first exposed token was revoked. Hosted Convex settings are now imported; the public callback is enabled and its URL persisted after browser reload. No live approval message/test was sent. [Configuration record](../artifacts/slack-setup.json).

## Populated workspace iteration — 2026-09-14

Local verification on the complete seeded-workspace change passed 493 tests in 32 files, all 22 production browser scenarios together in 1.0 minute, lint, TypeScript and an isolated `.next-e2e` production build. The additional browser scenario seeds only its isolated test database, receives the changes over the event stream, filters the board, opens a persona reply and checks the mobile layout. Seed tests cover all stages, fixture-only targets, idempotence, preserved existing data and live-state rejection. [Recorded evidence](../artifacts/seed-workspace-verification.json). Cloud integration authentication remains separate from this local result.

## Hosted verification — 14 September 2026

- [Hosted Mend admission](../artifacts/hosted-mend-verification.json): unauthenticated page redirect, API denial, wrong-code denial, secure HttpOnly cookie and authenticated live Convex state all verified.
- [Vercel and callback checks](../artifacts/hosted-provider-verification.json): token accesses the expected weather project, production alias resolves to the recorded deployment, candidate auto-assignment is disabled, only public identity settings exist, and unsigned Slack callback is refused.
- [Cloud weather baseline](../artifacts/hosted-weather-baseline.json): signed GCP request returned 200; exact expected source identity matched; Chromium recorded 34 checks and reproduced the planted conversion defect. Twelve conversion observations intentionally fail. This is baseline reproduction, not a fixed release.
- [Sandbox build](../artifacts/gcp-coding-sandbox-deployment.json): Cloud Build succeeded; immutable runtime passed Bun/Chromium smoke as UID 65532 with no network, read-only root and no Docker socket. Workflow lint and credential-cleanup checks passed. Real GitHub OIDC pull/candidate execution awaits reviewed workflow publication and a valid signed Build.

No live public message or complete engineer-to-marketer approval flow is claimed.

- GitHub Checks App 4934302: matching private key verified, selected weather-only installation confirmed, writer environment saved, repository-scoped token mint succeeded and probe token revoked. [Evidence](../artifacts/github-checks-app-setup.json).
- X: normal-browser identity and hosted worker import both verified Vinaychamoc5. Platform automation permission remains unverified; no public send. [Evidence](../artifacts/x-connection-verification.json).

## Complete connector and dispatch verification

Source 6981750 passed 530 automated tests across 37 files, all 22 production browser scenarios in 1.1 minutes, lint, TypeScript and an isolated `.next-e2e` production build. The new dispatch test reproduces the previous engineering_scope_denied failure and verifies that a bound Build passes the same scope check used by the runner. Reddit tests cover OAuth browser proof, replay/expiry, exact account and scope checks, encrypted credential binding, disconnect, bounded intake and API admission. Reddit remains deferred and disabled; these tests do not establish live provider access.
