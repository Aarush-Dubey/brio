# brio

brio is the product previously called Mend. Existing service URLs, project IDs and local paths retain their original names; the Slack app is still registered as `Mend`.

A functional web control app for customer reports, engineering approvals, persona policies, and tracked public replies. The owned target is a separate weather repository with a deliberate Celsius/Fahrenheit conversion defect.

The control app uses Next.js 16, Convex Workflow, and Convex Agent. Live engineering changes require an engineer's Build approval and a marketer's approval of the exact candidate and replies. Eligible social engagement requires an active versioned persona policy. Slack is the live approval surface.

## Run the local demo

Use Node.js 22 or newer.

```sh
cd /home/big-daddy/Desktop/hackathon
bun install --frozen-lockfile --ignore-scripts
bun run dev:demo
```

Open [the control app](http://127.0.0.1:3000). The demo needs no provider credentials. It persists fixture state in `.data/demo-state.json` and lets you switch among labeled engineer, marketer, and admin demo identities. Operating the product uses forms, tables, links, and buttons; no terminal is needed after startup.

**Demo transitions are simulations.** They do not post publicly, call paid models, make real Slack decisions, alter the weather repository, or release production deployments. Source modes, evidence, and receipts retain fixture labels. Actual provider tests remain separate.

The workspace has an anonymous **local** Convex deployment for development and a separate hosted production deployment, `resilient-perch-131`. The hosted app and worker services are deployed; see the [remaining live verification checklist](docs/SETUP-REMAINING.md) for current status. Start local backend development with `bun run dev:convex`; the local demo uses its own isolated file store.

The controller checkout is `/home/big-daddy/Desktop/hackathon`. The independent weather checkout is `/home/big-daddy/Desktop/hackathon-weather`, with its own Git history, package manifest, and application at the repository root. To inspect the seeded weather app in another terminal:

```sh
cd /home/big-daddy/Desktop/hackathon-weather
bun install --frozen-lockfile --ignore-scripts
bun run dev
```

Open [the weather app](http://127.0.0.1:3001). Initially the Celsius/Fahrenheit toggle deliberately preserves the number instead of converting it. The engineering tests reproduce the defect and verify the protected regressions against an isolated candidate. Return to the controller checkout for the commands below. `FDE_WEATHER_REPOSITORY` must identify the actual owned weather GitHub repository; controller dispatch must identify the separate trusted controller repository. The default patch scope is `lib/temperature.ts` in the weather repository.

## Configuration and operation

- [Environment setup](docs/ENVIRONMENT.md): Next.js versus Convex configuration, local/hosted access, Slack roles, worker secrets, and live prerequisites.
- [Operator runbook](docs/OPERATIONS.md): persona activation, case progression, manual receipts, uncertain sends, recovery, and pause.
- [Product requirements](docs/PRD.md): scope and acceptance requirements.
- [UI verification](docs/UI-VERIFICATION.md): executed browser checks and external blockers.
- [Acceptance matrix](docs/ACCEPTANCE-MATRIX.md): A01–A36 evidence and remaining live/runtime gates.

Create or update the existing untracked `.env` through your local editor or secret manager. An `.env.example` file is intentionally not supplied. Never place provider API keys, session cookies, signing secrets, or encryption keys in `NEXT_PUBLIC_*` variables. The service key and hosted access code are server-only. The public Convex URL identifies an endpoint and grants no access.

## Readiness check

```sh
bun run test:preflight --mode demo --scope next --strict
bun run test:preflight --mode live --scope all --json
```

Preflight is a read-only local inventory: it prints key names and presence/shape flags, never credential values, and makes **zero API requests**. It does not verify that variables were copied to a remote deployment or that an account has provider access. Add `--strict` to return a failing exit status for missing required configuration in the selected mode. Reddit is conditional; use `--include-reddit` when preparing its live connector.

There is no external sign-in provider. Local operation opens directly only with `FDE_LOCAL_ACCESS=true` on loopback. Hosted operation uses the `/access` form with `CONTROL_ACCESS_PASSWORD`; Next.js and Convex share a server-only `CONTROL_SERVICE_SECRET`. The workspace actor can operate the hackathon controls, while exact live approval roles come from configured Slack user IDs. Keep `FDE_DEMO_MODE` unset or false on the live control app. Missing credentials produce explicit setup/readiness states; they do not enable anonymous live actions. Provider readiness must be established with actual authorized tests before reporting live completion.

## Checks

Install Chromium once for browser checks:

```sh
bunx playwright install chromium
```

| Command                                    | Purpose                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| `bun run lint`                             | Repository lint                                                                 |
| `bun run typecheck`                        | TypeScript validation                                                           |
| `bun run test`                             | Unit and integration suites, including protected weather execution tests        |
| `bun run test:persona`                     | Versioned persona evaluation and guard checks                                   |
| `bun run test:e2e`                         | Production browser tests; first run `FDE_NEXT_DIST_DIR=.next-e2e bun run build` |
| `bun run build`                            | Control app production build                                                    |
| `bun run test:all`                         | Lint, types, tests, build, then control browser suite                           |
| `bun run test:preflight --help`         | Readiness-check options                                                         |

Test reports must distinguish passed, failed, and access-blocked checks. A simulated approval, deployment, or social receipt does not establish live provider behavior.

## Cost limits

The approved model is `gpt-5-mini`; the aggregate incremental project ceiling is **USD 100**. The budget primitives reserve USD 10 for uncertainty/recovery and admit discretionary work only within USD 90. Unknown model charges retain their reservations. Hosting, integration subscriptions, and build charges count toward the same ceiling and must be registered before provisioning; the UI cannot discover unregistered provider bills. No service is provisioned by preflight.

## Main modules

```text
src/app/                 Control pages and authenticated API boundaries
src/components/control/  Functional forms, case detail, persona, connections, recovery
src/core/                Authorization, signal, persona, publication, and budget contracts
src/control/             Shared reducer, durable events, and public snapshot projection
convex/                  Authenticated state, workflows, agents, and provider actions
workers/social/          Isolated experimental X browser worker
workers/engineering/     Restricted coding, protected checks, release verification
tests/                   Core, integration, execution, and control browser suites
scripts/preflight.ts     Secret-safe local readiness inventory

../hackathon-weather/    Independent owned target repository
  app/                   Root weather application and identity endpoint
  lib/temperature.ts     Bounded conversion-change target
```

Current account setup and remaining manual steps: [SETUP-REMAINING.md](docs/SETUP-REMAINING.md). Verification evidence: [TEST-REPORT.md](docs/TEST-REPORT.md).

Step-by-step service setup: [SETUP-GUIDE.md](docs/SETUP-GUIDE.md). Current implementation status: [PROGRESS.md](docs/PROGRESS.md).

Browser workers use Google Cloud Run: [GCP setup](docs/SETUP-GCP.md). Runtime secrets stay in each worker’s Secret Manager references.
