# Mend: what remains to set up

Updated 14 September 2026. This is the checklist for the existing installation. Do not recreate the completed projects.

## Already configured

| Service | Existing installation | Evidence and remaining verification |
| --- | --- | --- |
| Convex | Team `vinay-chamola`, project `mend-hackathon`, production `resilient-perch-131` | Functions deployed; hosted authenticated state works. |
| Mend website | [mend-hackathon.vercel.app](https://mend-hackathon.vercel.app) | Shared-code admission verified. Local populated demo remains on port 3002; hosted production is separate. |
| Weather website | [mend-weather.vercel.app](https://mend-weather.vercel.app) | Revision `a96c50e` deployed and exact identity verified. GCP Chromium reproduced the planted conversion defect. |
| Vercel API | Token saved and imported into production Convex | Real project, deployment, production alias, staging settings and environment allowlist verified. Automatic domain assignment is disabled. |
| GCP | Project `mend-hackathon-260914`, region `us-central1` | Social and verifier services active; immutable sandbox image built and offline Chromium smoke passed. No further GCP credentials needed. |
| OpenAI | App key installed; `gpt-5-mini` | Prior real writer, triage and persona evaluation passed. |
| Linear | Drizzle team and Done state configured in hosted Convex | Metadata read verified; issue creation/update still needs a controlled live flow. |
| GitHub | Separate controller/weather repositories and engineering environments | Hosted callback and private sandbox pull variables saved. Checks App configured; workflow publication described below. |
| Slack | Mend app in BitsUp, bot in `#mend-approvals` | Elen is engineer; David is marketer. Hosted secrets saved. Callback enabled and URL persisted after reload; actual human button test remains. |

## 1. Finish the reviewed GitHub workflow and baseline publication

**The Checks App is complete.** `brio-mkc`, App ID `4934302`, is owned by Aarush-Dubey and installed only on `hackathon-weather`. It has Checks write and Metadata read. The downloaded key matched the app; `WEATHER_CHECKS_APP_ID` and `WEATHER_CHECKS_APP_PRIVATE_KEY` are saved in `engineering-pr-writer`. A scoped installation token was minted successfully and revoked after the read-only setup probe. No extra GitHub credential is currently needed from the user. [Evidence](../artifacts/github-checks-app-setup.json).

The remaining work is source publication and execution verification:

1. Complete the independent review and tests, then publish the reviewed controller workflow on protected `main`.
2. Run the pinned weather Bun bootstrap workflow. It verifies the existing migration and honestly records that the planted conversion bug remains.
3. Merge the reviewed weather toolchain migration after its required check passes.
4. Deploy that actual resulting weather-main SHA and tree as the fresh buggy baseline, then update production `FDE_BASE_SHA`. A merge commit may have the same tree but a different SHA from the current a96c50e deployment; they must not be treated as identical.
5. Pin the actual reviewed controller-main commit in Convex as `GITHUB_CONTROLLER_SHA`.
6. Exercise a current signed engineer Build to verify GitHub OIDC image pull and restricted candidate execution.

The immutable sandbox is built and its private registry access is configured. [Sandbox evidence](../artifacts/gcp-coding-sandbox-deployment.json). The independent audit also found an approval-hash mismatch in dispatch; its fix and regression test are in progress before the first live Build.

## 2. Verify Slack decisions

The expected configuration is:

- App: Mend in BitsUp.
- Socket Mode: **Off**; this app receives HTTP interactions.
- Interactivity: **On**.
- Request URL: `https://resilient-perch-131.convex.site/slack/interactions`.
- Engineer: Elen (`U0C1L62486M`).
- Marketer: David (`U0C1DJRE4KF`).

After saving, reload the Slack settings page to confirm the URL persisted. An unsigned request to the hosted endpoint correctly returns HTTP 403. This does not replace a real engineer/marketer button test. No message history scope is required for these signed button interactions.

## 3. X session is connected; platform permission remains

The latest intended X account is **@Vinaychamoc5**. Its normal Chrome login was verified and its session imported into hosted Mend. The worker verified matching identity on 14 September 2026. Earlier incorrect/unavailable account connections were replaced.

Mend reports `access_pending` because platform automation permission is not yet verified. Establish that capability before enabling `X_PLATFORM_PERMISSION_APPROVED` on the worker and `X_AUTOMATION_PERMISSION_CONFIRMED` on the controller, or enabling polling. A valid login alone does not approve automated posting. No X post/reply was sent; the manual workflow remains available.

## 4. Reddit is optional for the first demo

The intended Reddit account is **u/drizzle-123**. Provide the subreddit names that Mend is allowed to monitor. No permitted community has been supplied yet.

1. Log in through your normal browser and complete Reddit's human-verification challenge. Current automated login/app settings are blocked by network security.
2. Obtain approved API access for this use and create the OAuth app following [Reddit setup](SETUP-REDDIT.md).
3. Save `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET` privately in the app's `.env` worksheet. They must then be installed only on the social worker, not in browser-visible configuration.
4. Configure an accurate `REDDIT_USER_AGENT` and the allowed subreddit list. Set the OAuth redirect URI exactly to `https://mend-social-worker-ajmx2yigqq-uc.a.run.app/v1/oauth/reddit/callback`.
5. Authorize `drizzle-123` through the account connection flow after that integration is deployed. Keep `REDDIT_API_APPROVED=false` until access is approved.

OAuth/readiness/polling implementation and focused tests are complete; final review, full-suite validation and deployment are in progress. Browser access, credentials and approval remain unverified; no Reddit send has been performed. You do not need to send passwords or manually extract refresh tokens.

## Final live verification

After these account steps, exercise an actual complaint, engineer Build, isolated candidate verification, marketer Go, staged promotion, protected live verification and an approved reply with receipt reconciliation. A seeded presentation, configured token or worker health response is not evidence that this full flow has passed.

No Clerk or weather API account is needed. See [environment inventory](ENVIRONMENT.md), [GCP setup](SETUP-GCP.md), and the [test report](TEST-REPORT.md).
