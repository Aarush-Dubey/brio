# Configured setup and remaining account steps

Updated 2026-09-14. This inventory separates actual settings from services that still need an account. No secret values belong in this document or chat.

## Already configured

- The controller repository is `Aarush-Dubey/hackathon`. The independent private weather repository is `Aarush-Dubey/hackathon-weather`; its seeded baseline is pinned in the controller's GitHub variable `WEATHER_BASELINE_SHA` and local `FDE_BASE_SHA`.
- Both `main` branches require pull requests and successful checks, with admin enforcement and force-push/deletion protection. Controller requires `checks`; weather requires `Protected weather`.
- The weather repository has a dedicated read-only SSH deploy key. Its private half is installed as `WEATHER_REPO_READ_SSH_KEY` in controller Actions and the `engineering-controller` environment. It cannot write weather code.
- `engineering-controller` and `engineering-pr-writer` are separate GitHub environments restricted to `main`. Signing/callback secrets, the target repository, target branch, and trusted PR-writer credential are installed.
- The existing GitHub CLI OAuth credential is reused for trusted local controller API calls and the trusted PR-writer job. It has broader account repository access than a dedicated GitHub App; it is never passed into the generated candidate container. The separate checkout key has only weather read access.
- OpenAI is configured in the local app and local Convex backend. Real `gpt-5-mini` writer and durable-triage calls have succeeded. No other app model is enabled.
- Local Convex is running. Server access, social grants/callbacks, engineering grants/callbacks, browser-verification signing, a hosted access code, and session encryption secrets have been generated.
- Vercel CLI 59.16.0 is installed globally via Bun at `/home/big-daddy/.bun/bin/vercel`. CLI installation does not create or authenticate projects.
- Slack Mend app exists in BitsUp with chat:write. Its replacement bot token passed auth.test; bot token, signing secret and workspace ID are saved in `.env`, private Convex bundle and local Convex. The mend-approvals channel ID and Elen’s engineer ID are also configured locally; Mend joined the channel. The hosted callback is missing and the user deferred the marketer ID.
- Linear’s actual API key was verified with a read-only lookup. The sole team Drizzle and its Done status IDs are saved in `.env`, the private Convex bundle and the running local Convex backend; no issues were created or updated.
- GCP project `mend-hackathon-260914` is linked to billing. Both browser-worker images built and both Cloud Run services are deployed with separate runtime identities and four scoped secrets. Worker URLs are saved in `.env`; services explicitly reject work until public dependency URLs are configured.
- Bun 1.4.2 is installed and used for both application lockfiles, commands, and workflow installs.
- Clerk has been removed. The local app opens without login on loopback. Hosted access uses the generated shared code; approval roles still come from Slack IDs.

Private deployment secret bundles are saved under `.data/deployment-secrets/` in the controller checkout, with directory permissions 0700 and file permissions 0600. These files are ignored by Git. Use each bundle only for its named service; generated secrets do not create cloud services. Local configuration does not automatically configure hosting.

## Account steps still required

| Service | What you must provide or create | Settings and destination |
|---|---|---|
| Hosted Convex | Sign into Convex and create/select a project and production deployment. The anonymous local backend cannot receive public Slack or worker callbacks. | Deploy controller functions, import the private `convex.env` bundle, and supply the resulting function URL to Next.js as `NEXT_PUBLIC_CONVEX_URL`. Set the public HTTP-action URL as `CONVEX_SITE_URL` in both GitHub engineering environments and the social worker. |
| Slack | Existing Mend app, bot credentials, approval channel and Elen’s engineer ID are configured. Supply the real hosted Convex callback and import the five settings there. The marketer ID is intentionally deferred by the user; add it before Go/policy approvals. | Convex: `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_TEAM_ID`, `SLACK_CHANNEL_ID`, `SLACK_ENGINEER_USER_IDS`, `SLACK_MARKETER_USER_IDS`; optionally `SLACK_ADMIN_USER_IDS`. Interactivity URL: your Convex HTTP-action origin plus `/slack/interactions`. Engineer Build/No-build and marketer Go/No-go, reply approval, and policy activation occur here. |
| Linear | The local API key and Drizzle/Done IDs are configured and metadata access is verified. Import those settings into hosted Convex, then verify the required issue write access during the controlled live flow. | Convex: `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_RELEASED_STATE_ID`. No Linear webhook is required by this implementation. |
| Vercel | Sign in and create two separate projects: controller app and independent weather target. Provide a scoped API token. Weather root is the repository root; disable automatic production alias assignment for candidates. | Convex: `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_PROJECT_NAME`, `WEATHER_PRODUCTION_DOMAIN`; optionally `VERCEL_TEAM_ID`, `VERCEL_RELEASE_TOKEN`. Next.js: generated access secrets and the hosted Convex URL. Set the actual `CONTROL_APP_ORIGIN` in Next.js, Convex and the social worker. Hosted `FDE_LOCAL_ACCESS=false`. |
| Worker hosting | Finish the existing Cloud Run services using [SETUP-GCP.md](SETUP-GCP.md): add actual public origins/hosts, remove setup-pending mode, and enable always-allocated CPU plus one minimum instance for live social jobs. No GCP budget policy was created, as requested; reconcile actual provider charges separately. | Use `social.env` only on the social worker and `verifier.env` only on the verifier. Add actual allowed origins/hosts and Convex URL. Convex gets `SOCIAL_WORKER_URL` and `ENGINEERING_WORKER_URL`; verifier gets `WEATHER_ALLOWED_HOSTS`. Record hosting commitments before enabling execution. |
| Coding sandbox image | Provide a working Docker daemon/build runner and an authorized image registry. Local Docker is installed but the current user cannot access its daemon. | Build and verify `workers/engineering/Dockerfile`; publish the reviewed image and set the immutable digest as GitHub `engineering-controller` variable `CODING_SANDBOX_IMAGE`. The application refuses to run generated code unrestricted on the host. |
| X brand account | Sign in as the dedicated brand account and establish the permitted automation capability. | Import its session through the app's Connections page once the worker is hosted. Set the exact account handle there. Only then enable worker `X_PLATFORM_PERMISSION_APPROVED`; keep polling disabled until the account passes checks. No X API key is used by this browser adapter. |
| Reddit, optional | Obtain approved Reddit API access, create the OAuth app, and authorize the dedicated account for the permitted communities. | Social worker only: `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_REFRESH_TOKEN`, `REDDIT_USER_AGENT`, `REDDIT_ALLOWED_SUBREDDITS`. Enable `REDDIT_API_APPROVED=true` on worker and Convex only after access is approved. Otherwise keep Reddit disabled and use the tracked manual flow. |

No weather API key is needed: the target uses deterministic fixtures. No Clerk keys or accounts are needed.

## One GitHub account step that the existing CLI login cannot complete

Create a GitHub App with repository **Checks: read and write**, install it only on `hackathon-weather`, and generate its private key. In controller environment `engineering-pr-writer`, set variable `WEATHER_CHECKS_APP_ID` and secret `WEATHER_CHECKS_APP_PRIVATE_KEY`. The workflow mints an installation token for the check-writing job. This token creates the required `Protected weather` result only after trusted candidate verification; it does not grant candidate code credentials.

The existing GitHub CLI OAuth token cannot create check runs. GitHub documents the distinction in [Checks API authentication](https://docs.github.com/en/rest/checks/runs). A GitHub App is the supported path here; no success check is fabricated to bypass this missing capability.

After the reviewed controller implementation is merged to `main`, pin its actual deployed SHA as `GITHUB_CONTROLLER_SHA` in Convex. Add the hosted Convex URL and verified sandbox image digest to the already-created engineering environment variables. These values depend on the merge and cloud setup; placeholder URLs or unverified image tags are not configured as working values.

## Verification order

1. Deploy Convex and the control app; confirm hosted access and direct Convex credential checks.
2. Install Slack and set member IDs. Verify a signed engineer Build decision and rejection of a wrong-role decision.
3. Connect Linear and Vercel; deploy the seeded weather target to its own project.
4. Deploy workers and the immutable sandbox image; record hosting costs.
5. Exercise reproduction, approved Build, restricted candidate tests, exact Go, staged promotion and protected live verification.
6. Enable only the selected approved social account, then test controlled publication and receipt reconciliation. Keep the manual fallback available.

The full variable inventory and placement rules are in [ENVIRONMENT.md](ENVIRONMENT.md).
