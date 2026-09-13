# Mend setup guide — start here

Updated: **14 September 2026**. Written for the person setting up the accounts, even if you have never configured an API before.

**Start with Step 1. Then follow the numbered steps in order.** Each step tells you what to open, what to enter, where to save it, and how to check it. You do not need to read the PRD or understand the code first.

## What you are setting up

Mend is the website with the Kanban board. It receives a complaint, asks an engineer in Slack whether to build a fix, verifies the fix, asks the marketer in Slack whether to release it, and then publishes the approved reply. The weather website is a **second, separate app** used to demonstrate that process.

| Service | Plain-English job | Do you need to create anything? |
| --- | --- | --- |
| GitHub | Stores both apps and runs the code-fixing jobs | Repositories already exist. One GitHub App and a runtime image are still needed. |
| OpenAI | Generates classifications, patches and persona replies | Your key is already saved and tested. Reuse it. |
| Convex | Stores cases and runs Mend's background work | Create one hosted project. |
| Vercel | Makes the two websites available on the internet | Create two projects: Mend and weather. |
| Slack | Where the engineer clicks Build and marketer clicks Go | Create a Slack app in your workspace. |
| Linear | Stores the engineering ticket | Create an API key and select a team. |
| Google Cloud (GCP) | Runs the two automated browsers on Cloud Run | Project and services created; add the remaining public URLs and enable workers. |
| X | The brand account that receives and sends replies | Connect your own dedicated account if using live X. |
| Reddit | An additional reply destination | Optional. Skip for the first demo. |

**No Clerk account, weather API key, or ChatGPT connector installation is needed.** The weather readings are fixed test data. Application model calls use `gpt-5-mini`. Keep combined model, hosting and build spend under **$100**.

### Choose how far to go

- **See the demo on this laptop:** do Step 1 only. It simulates the external services and clearly labels that fact.
- **Set up the real application:** complete Steps 2–11. Steps 2–8 collect and connect the accounts; Step 9 handles the remaining GitHub execution setup.
- **Add Reddit later:** use the optional section at the end. It is not required for the X/weather demonstration.

### Jump to a step

1. [Open the local demo](#step-1)
2. [Understand where keys go](#step-2)
3. [Create the Convex backend](#step-3)
4. [Put Mend on Vercel](#step-4)
5. [Set up Slack decisions](#step-5)
6. [Set up Linear tickets](#step-6)
7. [Set up the weather website](#step-7)
8. [Create the two browser workers](#step-8)
9. [Finish GitHub's code-fixing setup](#step-9)
10. [Connect the X account](#step-10)
11. [Check everything in order](#step-11)
12. [Troubleshooting](#troubleshooting)

<a id="step-1"></a>
## Step 1 — Open the demo on this laptop

**You need:** this computer. No new account or API key.

1. Open the Terminal application. On Ubuntu, **Ctrl + Alt + T** opens it.
2. Copy this whole block, paste it into Terminal, and press Enter:

```sh
export PATH="/home/big-daddy/.bun/bin:$PATH"
cd /home/big-daddy/Desktop/hackathon
bun run dev:demo
```

3. Wait for the terminal to say **Ready**. Leave that terminal open; it is running the website.
4. Open the **Local** address printed in the terminal, normally [http://127.0.0.1:3000](http://127.0.0.1:3000). If it prints port `3002`, open that address instead.
5. Open the board and use its demo controls. Keep a second tab open on the board to watch the same case move between columns.

**You are done when:** the Mend page opens and identifies the session as a demo. Simulated Slack decisions and publication receipts are expected here.

To open the separate weather app, open a **second** terminal and run:

```sh
export PATH="/home/big-daddy/.bun/bin:$PATH"
cd /home/big-daddy/Desktop/hackathon-weather
bun run dev
```

Open the Local address it prints, normally [http://127.0.0.1:3001](http://127.0.0.1:3001). Switching the initial `20°C` reading to Fahrenheit shows `20°F`. **That is the intentionally planted bug.** The demonstration's goal is to repair it to `68°F`.

To stop a server that you started, select its terminal and press **Ctrl + C**. If a server is already running, use its printed address instead of launching another copy.

If `bun` or dependencies are missing, see [Troubleshooting](#troubleshooting). These paths refer to this laptop's actual folders.

<a id="step-2"></a>
## Step 2 — Know where to paste the keys

An **API key/token** is a password that lets one application use another service. An **environment variable** is simply a named setting. For example:

```text
CONTROL_APP_ORIGIN=https://my-mend.vercel.app
```

In a website's environment-variable form, enter `CONTROL_APP_ORIGIN` in **Name/Key** and `https://my-mend.vercel.app` in **Value**. Do not put the entire line in the Value box. In an `.env` file, keep the entire `NAME=value` line. Do not add spaces around `=` or include example text such as `PASTE_HERE` in a final value.

**A setting saved on your laptop is not automatically copied to Vercel, Convex, or GCP.** The steps below tell you each destination explicitly.

### Open the private files already prepared for you

1. Open the Files application.
2. Press **Ctrl + L**, paste this folder path, and press Enter:

```text
/home/big-daddy/Desktop/hackathon/.data/deployment-secrets
```

3. Right-click the file you need and choose **Open With → Text Editor**. The files contain passwords; keep their contents out of screenshots, chat messages and Git commits.

| File in that folder | What to do with it |
| --- | --- |
| `next.env` | Copy its settings into the **Mend Vercel project** in Step 4. |
| `convex.env` | Copy its settings into **Convex Production** in Step 3. This bundle contains the initial prepared values; new credentials are entered in `.env` as explained below. |
| `social.env` | Import into the **Cloud Run social worker** in Step 8. |
| `verifier.env` | Import into the **Cloud Run weather verifier** in Step 8. |
| `engineering.env` | Signing keys already installed in GitHub. Keep them; do not replace them with new random values. |

The generated passwords already match across these files. Copy them exactly. The directory is excluded from Git. Do not put real values in this guide or in a new Markdown file inside `docs/`.

### Your main file for entering new values

Open `/home/big-daddy/Desktop/hackathon/.env` in your text editor. It now contains clearly labeled sections and blank fields for the missing Slack, Linear, Vercel and worker settings. **Fill these blanks in this one file.** Your OpenAI key and existing settings have been preserved. `.env.local` no longer overrides those values.

The private service bundles above are starting values for hosting. When you add a new value to `.env`, also copy it into the particular online service named in its step. Nothing synchronizes these files automatically. Do not import all of `.env` into a provider: it contains settings for several different services and local URLs.

### Keep a note of these addresses

Create a private note on your computer and fill it in as you go. These are addresses, not passwords.

```text
Mend website:                  [filled in at Step 4]
Convex function URL (.cloud):   [filled in at Step 3]
Convex callback URL (.site):    [filled in at Step 3]
Weather website:               [filled in at Step 7]
Weather hostname only:         [same address without https://]
Cloud Run verifier URL:           [filled in at Step 8]
Cloud Run social-worker URL:      [filled in at Step 8]
```

For example, `https://calm-fox-123.convex.cloud` is a Convex function URL and `https://calm-fox-123.convex.site` is its callback address. **Copy both from your actual deployment.** Do not use these made-up examples or the laptop's `127.0.0.1` address for an online service.

### What is already done

Both private repositories exist: [Mend/controller](https://github.com/Aarush-Dubey/hackathon) and [weather](https://github.com/Aarush-Dubey/hackathon-weather). Their branch protections, read-only weather checkout key, GitHub signing keys and PR-writing credential are configured. Your OpenAI key has also been tested.

**Publication status at this guide's update:** the new Mend implementation is still being finalized on `codex/hackathon-mvp`. The weather Bun changes are in [draft PR #1](https://github.com/Aarush-Dubey/hackathon-weather/pull/1). Account creation can proceed now. Deploying `main` before the reviewed changes merge can deploy the old application. Step 9 explains the outstanding code-publication checks.

<a id="step-3"></a>
## Step 3 — Create the hosted Convex backend

**Purpose:** gives Mend an online database and a place to run background tasks. The existing local Convex instance does not accept callbacks from Slack or GitHub.

### 3A. Create the project and copy its addresses

1. Open [dashboard.convex.dev](https://dashboard.convex.dev) and sign in. Using the same GitHub account is convenient.
2. Choose **Create Project**. Name it `mend`. If it asks for a team, select your own team.
3. Open the project. Select **Production** in the deployment selector. Stay on Production for this guide.
4. Open **Settings → General (called URL & Deploy Key in older dashboards)**. Copy the deployment's `.convex.cloud` URL and `.convex.site` URL into your private address note.
5. Under **Deploy keys**, generate a **Production deploy key** named `mend-setup` with `deployment:deploy` permission. It lets the command in 3C upload the backend code to this exact project. Do not choose a Preview deploy key.
6. In the private folder from Step 2, create a plain-text file named `convex-deploy.env`. Put this one line in it, replacing only the text after `=` with the key you just copied:

```dotenv
CONVEX_DEPLOY_KEY=PASTE_YOUR_PRODUCTION_DEPLOY_KEY_HERE
```

Save it. Do not paste this key into Vercel, the weather app, or a chat message.

### 3B. Add the backend settings

1. Open the existing private `convex.env` file in your text editor.
2. In the Convex **Production** deployment, open **Settings → Environment Variables**.
3. For each non-empty `NAME=value` line in that file, add one environment variable using the Name and Value fields. Skip any line starting with `#`.
4. Confirm `OPENAI_API_KEY` is included. It is the working key you supplied; you do not need a second one.
5. Leave `FDE_SOCIAL_POLLING_ENABLED=false` and `REDDIT_API_APPROVED=false` for now. These keep automatic intake and optional Reddit inactive while you finish setup.
6. Set `FDE_INFRASTRUCTURE_COMMITTED_USD` to the hosting/build amount already committed in US dollars. Use `0` only if you have committed nothing. This records the budget; it does not pay the provider or cancel charges.

Some URLs and provider credentials will be added in later steps. You can upload the backend before completing those connections.

### 3C. Upload the code to this project

From Terminal, run:

```sh
export PATH="/home/big-daddy/.bun/bin:$PATH"
cd /home/big-daddy/Desktop/hackathon
chmod 600 .data/deployment-secrets/convex-deploy.env
bun --no-env-file x --no-install convex deploy --env-file .data/deployment-secrets/convex-deploy.env
```

The command uses the private deployment key to select the hosted project. It does not need you to replace the existing local anonymous development configuration. If it shows a target confirmation, verify it is the Production project you created.

**You are done when:** the command succeeds, the Production **Functions** page contains Mend functions such as `control`, and both Convex addresses are in your note. The hosted database starts separately; local demo records, evaluations and ledger history are not copied by this command.

**If it fails:** `Unauthorized` usually means the wrong deploy key or an extra space/newline inside the value. A missing backend key is fixed in **Convex Production**, not in the weather project.

Official reference: [Convex environment settings](https://docs.convex.dev/production/environment-variables) and [deployment command](https://docs.convex.dev/cli/reference/deploy).

<a id="step-4"></a>
## Step 4 — Put the Mend website on Vercel

**You need:** the Convex `.cloud` address and private `next.env` file. This project is for **Mend**, not weather.

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Under **Import Git Repository**, find `Aarush-Dubey/hackathon` and click **Import**. If it is absent, use **Adjust GitHub App Permissions** and allow Vercel access to that repository.
3. Use project name `mend-control` if available. Keep the detected **Next.js** framework and root directory `./`.
4. Expand **Build and Output Settings** and turn on the command overrides. Enter:

| Field | Exact value |
| --- | --- |
| Install Command | `bunx bun@1.4.2 install --frozen-lockfile --ignore-scripts` |
| Build Command | `bunx bun@1.4.2 run build` |

5. Expand **Environment Variables**. Add each line from `next.env`, then add the following settings. For later edits, the same form is under **Project → Settings → Environment Variables**. Select **Production** as the target environment.

| Name | Value to enter |
| --- | --- |
| `CONTROL_SERVICE_SECRET` | Already in `next.env`; must equal the value in Convex. |
| `CONTROL_ACCESS_PASSWORD` | Already in `next.env`; this is the code you will type to enter Mend. |
| `NEXT_PUBLIC_CONVEX_URL` | Your actual `.convex.cloud` URL from Step 3. |
| `FDE_LOCAL_ACCESS` | `false` |
| `FDE_DEMO_MODE` | `false` |

6. Deploy the reviewed Mend code. **If GitHub `main` still contains the old application, keep the project and its settings but return after the controller PR merges.** Account configuration is not lost. The Vercel deployment page shows which commit it built.
7. When the deployment says **Ready**, copy its stable project address, such as `https://mend-control.vercel.app`, into your note. Use the project's normal domain, not a different temporary URL for every build.
8. Add `CONTROL_APP_ORIGIN` with that exact address in **both** places: Mend Vercel environment variables and Convex Production environment variables. Do not add a trailing path such as `/cases`.
9. In Vercel, open **Deployments**, choose the latest correct deployment's **… → Redeploy**, and confirm. Vercel needs a redeploy after environment-variable changes.
10. Open the Mend address in a private/incognito browser window. Enter the value of `CONTROL_ACCESS_PASSWORD` from `next.env` when the access page appears.

**You are done when:** the hosted board opens after entering the code. A different browser profile, or a new private session after closing all existing private windows, should still require the code. Connections can show missing services at this stage; you have not set those up yet.

**If the board cannot connect:** compare the `CONTROL_SERVICE_SECRET` in Vercel and Convex character for character, then check the `.cloud` address and redeploy Vercel.

Official reference: [Vercel environment settings](https://vercel.com/docs/environment-variables) and [pinning Bun](https://vercel.com/kb/guide/how-to-pin-a-specific-bun-version-for-vercel-builds).

<a id="step-5"></a>
## Step 5 — Set up Slack decisions

**Current setup:** the `Mend` app is installed in `BitsUp` with `chat:write` and has joined `#mend-approvals`. The replacement bot token passed Slack’s `auth.test`. These six settings are saved in local `.env`, the private Convex bundle and the running local Convex backend: `SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_TEAM_ID`, `SLACK_CHANNEL_ID`, `SLACK_ENGINEER_USER_IDS` (Elen), and `SLACK_MARKETER_USER_IDS` (David), using the IDs supplied by the user.

**Still required:** the public Convex HTTP-action URL, importing these six settings into that hosted deployment, and a live Slack approval test. Elen and David are both configured locally; no member ID is missing. No live Slack approval test has run.

To finish the callback after completing Step 4, open the existing [Mend Slack app](https://api.slack.com/apps/A0C1N1T82UU/general) → **Interactivity & Shortcuts** → turn **Interactivity** on → set **Request URL** to the actual hosted Convex `.site` URL followed by `/slack/interactions` → **Save Changes**. The local `127.0.0.1:3211` URL cannot receive Slack callbacks. Copy all configured Slack settings into that hosted Convex deployment too.

To change the marketer later, open that person’s Slack profile → **More (⋯) → Copy member ID**. Save the resulting `U…` ID as `SLACK_MARKETER_USER_IDS` in `.env` and the matching Convex deployment. The live check is in Step 11; credentials alone do not establish successful button delivery.


**Purpose:** the engineer approves **Build** in Slack. The marketer approves **Go**, exact replies and persona activation in Slack. A button in the Mend website does not replace those live decisions.

**You need:** a Slack workspace where you can install apps and your Convex `.site` address.

### 5A. Create the bot

1. Open [Slack's app dashboard](https://api.slack.com/apps).
2. Click **Create an app → Blank app → Continue**. Some versions of the page call this **Create New App → From scratch**.
3. Name it `Mend` and select the workspace you will use for the demo. Create the app.
4. In the left menu, open **OAuth & Permissions**.
5. Find **Scopes → Bot Token Scopes → Add an OAuth Scope**. Add **`chat:write`**.
6. Scroll to **Install to Workspace**, click it, and approve the installation.
7. Copy the **Bot User OAuth Token**; it normally starts with `xoxb-`. In Convex Production, add `SLACK_BOT_TOKEN` with this value. Also save it in the root `.env` file.
8. Open the app's **Basic Information** page. Under **App Credentials**, reveal and copy **Signing Secret**. Save it as `SLACK_SIGNING_SECRET` in Convex and the root `.env` file.

### 5B. Make its buttons work

1. Open **Interactivity & Shortcuts** in the Slack app settings.
2. Switch **Interactivity** on.
3. In **Request URL**, paste your Convex `.site` address followed by `/slack/interactions`.

For example, if your actual callback address is `https://calm-fox-123.convex.site`, the field would be:

```text
https://calm-fox-123.convex.site/slack/interactions
```

4. Click **Save Changes**. Leave Options Load URL blank. This app does not need Socket Mode, slash commands, incoming webhooks or Event Subscriptions.

### How Mend receives an approval

`chat:write` lets the bot post its Build/No-build and Go/No-go buttons. When someone clicks a button, Slack sends the decision and their member ID directly to the Request URL you just configured. Mend checks Slack’s signature, the person’s role and the current approval. **No channel-history/read scope is needed for this button flow. Typing “approved” or adding an emoji reaction does not approve a case.**

### 5C. Select the channel and the two people

1. In Slack, create a channel named `mend-approvals`, or use an existing dedicated channel.
2. Invite the Mend bot. You can type `/invite @Mend` in that channel or open channel details → **Integrations → Add apps**.
3. Open Slack **in a browser** and select the channel. Its address looks like `https://app.slack.com/client/T012ABC/C034DEF`.
4. Copy the part starting with `T` into Convex `SLACK_TEAM_ID`. Copy the part starting with `C` into `SLACK_CHANNEL_ID`. A private channel may have a different prefix; use its actual channel ID. Channel details also expose **Copy channel ID**.
5. Open the engineer's Slack profile. Click **… / More → Copy member ID**. Save that ID as `SLACK_ENGINEER_USER_IDS` in Convex.
6. Do the same for the marketer. Save their ID as `SLACK_MARKETER_USER_IDS`.
7. Save these settings in your root `.env` too. If a role has several people, separate their IDs with commas: `U012ABC,U034DEF`. For a two-person demo, put one person's actual ID in each role. `SLACK_ADMIN_USER_IDS` is optional.

**You are done configuring Slack when:** the bot is in your channel, the callback is saved, and all six required Slack values exist in Convex: bot token, signing secret, workspace ID, channel ID, engineer IDs and marketer IDs. The live button test comes in Step 11 after the other services are ready.

**Common mistakes:** a display name is not a member ID; a `xapp-` app token is not the `xoxb-` bot token; `.convex.cloud/slack/interactions` is the wrong callback host. If you add scopes after installing, reinstall the app.

Official reference: [Slack app creation](https://docs.slack.dev/quickstart/), [bot messages](https://docs.slack.dev/reference/methods/chat.postMessage/) and [interactive buttons](https://docs.slack.dev/interactivity/handling-user-interaction/).

<a id="step-6"></a>
## Step 6 — Set up Linear tickets

**Purpose:** Mend creates one ticket for a reproduced bug and updates it after release.

### 6A. Create the key

1. Open [Linear](https://linear.app) and sign in. Create a workspace if you do not have one.
2. Select or create a team for this demo, for example `Weather`. Note its name.
3. Open **Settings → Account → Security & Access** and find **Personal API keys / API**.
4. Create a key named `Mend hackathon`. Give it **Read**, **Write**, and **Create issues** access for the selected team. If creation is disabled, the workspace administrator must enable personal API keys.
5. Copy the key. Add `LINEAR_API_KEY=your-key` in the existing `LINEAR_API_KEY` field in the root `.env` file. Also add `LINEAR_API_KEY` in Convex Production.

### 6B. Find the correct IDs without writing an API request

1. Save the private file, then run this from Terminal:

```sh
export PATH="/home/big-daddy/.bun/bin:$PATH"
cd /home/big-daddy/Desktop/hackathon
bun --no-env-file scripts/setup-linear.ts
```

2. The helper lists the teams your key can read and their workflow states using small, separate paginated reads. It only reads Linear; it does not create or change tickets.
3. Find the team you selected. Copy its full ID into Convex `LINEAR_TEAM_ID` and into the root `.env` file.
4. Under that team, choose the final state where a released issue should go, usually **Done** or **Released**, with type **completed**. Copy that state's full ID into `LINEAR_RELEASED_STATE_ID` in both places.

**You are done when:** Convex contains `LINEAR_API_KEY`, `LINEAR_TEAM_ID` and `LINEAR_RELEASED_STATE_ID`. The two IDs look like long UUIDs, not the short team label `WTH`. The final state is a team workflow status, not a Linear Releases pipeline. No Linear webhook or separate Linear–Slack integration is needed.

**Current setup:** the real key successfully read the sole team **Drizzle (DRI)** and its **Done** completed status. Both IDs are already saved in local `.env` and the private Convex bundle. Import that bundle into the matching hosted Convex deployment once it exists.

**If the old helper returned HTTP 400:** it requested too many nested objects and Linear reported “Query too complex.” The current helper fixes that query; the error did not mean your key was wrong. [Linear query limits](https://linear.app/developers/rate-limiting).

**If the helper lists no team:** make sure the API key can read the team. If it reports a missing key, check that you edited `/home/big-daddy/Desktop/hackathon/.env`, not a similarly named file elsewhere.

Official reference: [Linear API-key settings](https://linear.app/docs/api-and-webhooks) and [team/state queries](https://linear.app/developers/graphql).

<a id="step-7"></a>
## Step 7 — Create the separate weather website

**You need:** the separate [weather repository](https://github.com/Aarush-Dubey/hackathon-weather). Do not add this website inside the Mend Vercel project.

### 7A. Create its Vercel project

1. Open [vercel.com/new](https://vercel.com/new) again.
2. Import **`Aarush-Dubey/hackathon-weather`**. Name the project `mend-weather` if available.
3. Select **Next.js**, root `./`, and the same pinned Bun install/build commands from Step 4.
4. Do **not** import `next.env` or `convex.env`. The weather app needs no private API keys.
5. Create the project. A build from the old `main` can fail until the Bun PR is merged. Keep the project and finish the settings below; the seed deployment comes after Step 9.
6. Open **Settings → Environments → Production → Branch Tracking**. Turn **Auto-assign Custom Production Domains** off and save. This lets Mend test a build before sending visitors to it.
7. Open **Settings → Domains** and record the project's stable weather domain. Add the hostname, without `https://` or `/`, as Convex `WEATHER_PRODUCTION_DOMAIN`.
8. Open **Settings → General**. Copy **Project ID** into Convex `VERCEL_PROJECT_ID` and the exact project name into `VERCEL_PROJECT_NAME`.

### 7B. Give Mend permission to deploy weather

1. Open [Vercel account tokens](https://vercel.com/account/settings/tokens).
2. Create a token named `Mend weather deployment`. Select the team/account owning the weather project and an expiry that covers the hackathon.
3. Copy the token into Convex `VERCEL_TOKEN` and your root `.env`.
4. If the project belongs to a team, open that team's **Settings → General** and copy **Team ID** into Convex `VERCEL_TEAM_ID`. Do not use the team name or your personal user ID.
5. Save `VERCEL_PROJECT_ID`, `VERCEL_PROJECT_NAME`, `VERCEL_TEAM_ID` if applicable, and `WEATHER_PRODUCTION_DOMAIN` in the root `.env` file as well.

You do not need a separate `VERCEL_RELEASE_TOKEN` for this hackathon; the implementation uses `VERCEL_TOKEN` when that optional setting is absent.

### 7C. If Vercel requires a login to view weather deployments

Open a weather deployment URL in an incognito window. If it shows Vercel's login/protection screen, the verifier needs authorized test access. In the weather project's **Settings → Deployment Protection**, create a **Protection Bypass for Automation** secret. Save its value as `VERCEL_AUTOMATION_BYPASS_SECRET` on the **Cloud Run verifier** in Step 8. Do not manually add it to the weather app's Environment Variables or to the social worker. Vercel may also supply its own system variable automatically.

**You are done with the account setup when:** the weather project exists, automatic domain assignment is off, and the project ID, name, domain and API token are saved on Convex. The deliberately buggy first deployment is a separate, explicit step in the [engineering setup guide](SETUP-ENGINEERING.md#seed-deployment).

Official reference: [Vercel project settings](https://vercel.com/docs/project-configuration/general-settings), [staged production deployments](https://vercel.com/docs/deployments/promoting-a-deployment) and [authorized automation access](https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-automation).

<a id="step-8"></a>
## Step 8 — Create the two browser workers on GCP

We are using **Google Cloud Run** for both workers. You do not need a Render account.

The project and both services are already created; their URLs are saved in `.env`. They currently reject work because the public app, Convex and weather settings are missing. Follow the **finish existing services** instructions at the top of [SETUP-GCP.md](SETUP-GCP.md), then its configuration sections 5–7. You do not need to recreate the project or rebuild the images for these settings.

| Service | What it does | Setting to copy back |
| --- | --- | --- |
| `mend-weather-verifier` | Opens weather and checks the bug/fix/version. | Its HTTPS URL → `ENGINEERING_WORKER_URL` in Convex and local `.env`. |
| `mend-social-worker` | Runs the X browser session and authorized replies. | Its HTTPS URL → `SOCIAL_WORKER_URL` in Convex, Mend Vercel and local `.env`. |

The GCP walkthrough includes the different CPU settings these services need. Keep the social worker's CPU allocated after requests because it completes work after acknowledging a job. Secret values stay in the named worker's Secret Manager references.

**You are done when:** setup-pending mode has been removed after adding real settings, both services pass their normal health check, the correct URLs are saved in each destination, and Mend has been redeployed after its Vercel setting changes. A health body containing `ready: false` means setup is still incomplete. Actual browser/account checks come later. No GCP API key goes in Mend.

<a id="step-9"></a>
## Step 9 — Finish GitHub's code-fixing setup

Most GitHub settings are already configured. **You do not need to recreate the repositories, generate another checkout key, or replace the existing signing keys.**

This step contains several terminal commands, so it has its own walkthrough: **[Open SETUP-ENGINEERING.md](SETUP-ENGINEERING.md)**. Complete it in its numbered order:

1. Create the small GitHub App that is allowed to report test results.
2. Put its numeric App ID and downloaded private key in the exact GitHub environment.
3. Publish the restricted coding image and save its immutable image address.
4. Complete the reviewed controller and weather baseline merges. The guide explains the currently pending baseline-check requirement.
5. Deploy the deliberately buggy weather seed with its actual Git identity.
6. Add the final GitHub addresses/revision values to Convex and GitHub.

**Do not skip the seed identity step.** A weather page that renders correctly is not enough for Mend to prove which version it tested.

**You are done when:** the engineering guide's checklist is complete, including an accessible runtime image, merged reviewed code, and a real seeded weather deployment. Creating a GitHub App alone does not verify a coding run.

<a id="step-10"></a>
## Step 10 — Connect the X brand account

**You need:** the live Mend website, working social worker, and an X account you own and intend to use as the brand account. This implementation uses a browser session; it does not ask for an X API key.

X requires prior approval for AI reply bots and restricts automated replies to permitted interactions. Use the tracked manual posting fallback until your intended account and browser-based use are authorized. The switches below record that status; they do not obtain permission. [X automation rules](https://help.x.com/en/rules-and-policies/x-automation).

### 10A. Save the account in Mend

1. Open your hosted Mend website and enter the shared access code.
2. Open **Connections**.
3. In the X card, enter the account's handle in **Account identifier**, for example `mend_weather_demo`, and click **Save account identifier**. Use your actual handle. This field uses the handle, not a numeric account ID.

### 10B. Enable the approved capability, then import the session

Before the final live import, set `X_PLATFORM_PERMISSION_APPROVED=true` on Cloud Run's social worker and `X_AUTOMATION_PERMISSION_CONFIRMED=true` on Convex **only after the intended use is approved**. Save/redeploy the Cloud Run worker first. If approval is still pending, keep both flags false and use manual posting. An import in that state can remain `access_pending`; changing the flags later requires importing the session again.

Then import only that account's session:

1. In Chrome or Chromium, sign in normally at [x.com](https://x.com) using that dedicated account. Complete any login challenge yourself.
2. Press **F12**, or **Ctrl + Shift + I**, to open Developer Tools.
3. Choose the **Application** tab. If hidden, use the `»` tab-overflow menu.
4. In the left sidebar, expand **Storage → Cookies** and select `https://x.com`.
5. Find the cookie named `auth_token`. Select its **Value** cell and copy that value. It acts like a login password; paste it only into Mend's import form.
6. Back in Mend's **Import X session** form, enter the same handle under **Expected brand account ID**.
7. Change **Import method** to **Guided session cookie entry**. Paste the copied value into `auth_token`.
8. Return to the same X cookie list, copy the value of `ct0`, and paste it into Mend's `ct0` field.
9. Click **Import encrypted session**. Wait for the result and inspect the account/status on the X card. Do not reset the connection after a successful import; resetting invalidates that session.

**You are done connecting the session when:** the reported account matches your handle and the connection check succeeds. An expired session or login challenge needs a new normal login and import.

### 10C. Enable only the permitted live behavior

The permission flags were set before the import in 10B. If you changed them after importing, import the session again so the connection records the approved capability.

Keep `FDE_SOCIAL_POLLING_ENABLED=false` until the first controlled test succeeds. You can start with **Manual signal intake** using the original post's URL and text. Enable Convex `FDE_SOCIAL_POLLING_ENABLED=true` only when you are ready for periodic X mentions intake.

For automatic low-risk banter, first configure the persona and obtain the marketer's Slack approval of that policy. A connected account alone does not activate autonomous replies. Real bug-fix announcements still require the engineer's Build, marketer's Go, and successful verification.

<a id="step-11"></a>
## Step 11 — Check the setup in this order

These are observable checks. A saved API key is not yet proof that the integration works.

| Order | What you do | What you should see |
| --- | --- | --- |
| 1 | Open hosted Mend in a fresh incognito window. | Access-code page, then the board after the correct code. |
| 2 | Open both Cloud Run service URLs with `/health` appended. | A response from each service, not a sleeping/error page. |
| 3 | Open the weather seed and its `/api/version` endpoint. | The intentionally wrong Fahrenheit reading and the exact seed identity from the engineering guide. |
| 4 | Add one real, owned test complaint through **Manual signal intake**. Preserve its original URL and wording. | A real case appears; another board tab receives its changes without refresh. |
| 5 | Let the engineering case reach reproduction. | Actual browser evidence of the seed bug, one Linear ticket, and a Slack Build card. |
| 6 | The configured engineer clicks **Build** on that Slack card. | GitHub runs the protected workflow and creates a candidate PR with actual passing candidate checks. |
| 7 | Wait for candidate verification; the configured marketer clicks **Go** on the current Slack card. | The tested deployment is promoted; live weather behavior is checked again. |
| 8 | With the platform enabled and exact reply approved, let the reply publish. | The actual reply exists on the intended source conversation and Mend stores its real receipt link. |
| 9 | Test a permitted low-risk persona interaction after marketer policy approval. | An eligible reply follows the approved voice; risky or factual claims do not use that autonomous path. |

A failed check tells you which part to fix before proceeding. Do not repeatedly click Build, Go, or Publish while a result is unknown. Inspect the case timeline and [operations guide](OPERATIONS.md) first.

The app's **Controls & audit → Project budget** records hosting commitments after initialization. Update it when you add or remove paid services. The app can only account for costs you record; it cannot see unrelated charges in your provider accounts.

### Final configuration cross-check

Use this to catch a value pasted into the wrong service:

| Destination | Must contain |
| --- | --- |
| Mend Vercel | `CONTROL_SERVICE_SECRET`, `CONTROL_ACCESS_PASSWORD`, `NEXT_PUBLIC_CONVEX_URL`, `CONTROL_APP_ORIGIN`, `SOCIAL_WORKER_URL`, both local/demo flags `false`. |
| Convex Production | Existing `convex.env` settings plus Slack keys/role IDs, three Linear settings, Vercel project/token/domain, both worker URLs, `CONTROL_APP_ORIGIN`, exact controller/weather revisions. |
| Cloud Run social worker | Its own `social.env`, `CONTROL_APP_ORIGIN`, `CONVEX_SITE_URL`; platform flags set deliberately. |
| Cloud Run verifier | Its own `verifier.env`, `WEATHER_ALLOWED_HOSTS`, `WEATHER_ACCEPT_SIGNED_DEPLOYMENT_HOSTS`; Vercel automation secret only if needed. |
| GitHub `engineering-controller` | Existing signing/checkout secrets plus `CONVEX_SITE_URL` and `CODING_SANDBOX_IMAGE`. |
| GitHub `engineering-pr-writer` | Existing callback/PR secrets plus Checks App ID/private key and `CONVEX_SITE_URL`. |
| Weather Vercel | Only the public seed/deployment identity values from the engineering guide. No OpenAI, Slack, social or controller keys. |

[ENVIRONMENT.md](ENVIRONMENT.md) is the complete technical variable reference. You should not need it for the normal steps above.

<a id="troubleshooting"></a>
## Troubleshooting

| What you see | What to do |
| --- | --- |
| `bun: command not found` | Run `export PATH="/home/big-daddy/.bun/bin:$PATH"` in that terminal. On a different machine, install Bun from [the official instructions](https://bun.com/docs/installation), pinned to 1.4.2. |
| `next: command not found` or dependencies missing | From the correct repository folder, run `bun install --frozen-lockfile --ignore-scripts`, then retry. Both apps have their own dependencies. |
| Local page will not open on port 3000 | Read the terminal's **Local** URL; another server may have moved it to 3002 or another port. |
| `/access` keeps rejecting the code | Use `CONTROL_ACCESS_PASSWORD` from `next.env`. It is not your GitHub password or the service secret. Check Vercel Production has the same value, then redeploy. |
| Hosted board says backend unavailable | Check Vercel's `.convex.cloud` URL, matching service secret, and deployed Convex functions. Do not use `.convex.site` for `NEXT_PUBLIC_CONVEX_URL`. |
| Slack card never appears | Check bot scope `chat:write`, bot channel membership, `SLACK_CHANNEL_ID`, and Convex logs. |
| Slack button fails or says unauthorized | Check the `.site/slack/interactions` URL, signing secret, workspace ID and the clicking person's member ID/role. Old cards can expire; use the current card. |
| Linear helper cannot find the team | Grant the key read access to the intended team. Use its UUID and a state UUID from that same team. |
| Cloud Build cannot find a Dockerfile | Upload the committed worker source archive and run the supplied build from its extracted root; see SETUP-GCP.md. |
| Weather verifier sees a Vercel login page | Complete Step 7C and put the authorized automation secret on the verifier. |
| GitHub says `Protected weather — Expected` | The required check has not been attached to that exact commit. Follow the engineering guide's baseline-check section; do not disable the protection. |
| `docker info` says permission denied | Docker is not usable by that terminal's account. Complete the official Docker setup in the engineering guide or use a machine where it works. |
| X import reports account mismatch | Both Mend account fields must name the same handle as the account currently logged into X. |
| X is configured but no reply is sent | Check platform capability, connection readiness, case approval/evidence and persona policy status. A missing approval is not fixed by adding another API key. |
| A new environment value seems ignored | Redeploy Vercel/Cloud Run after changing their environment settings. Confirm you changed Production, not Preview or Development. |

## Optional — Reddit

Skip this for the first demo. Reddit requires approved API access, an OAuth app and a refresh token. It is independent of the X session. The additional walkthrough is in [SETUP-REDDIT.md](SETUP-REDDIT.md).

## After the hackathon

Pause automated intake/publication in Mend. Delete paid Cloud Run services you no longer need, review Vercel/Convex billing, and revoke temporary provider tokens. Update the recorded budget when commitments actually end. Pausing a case in Mend does not stop a hosting subscription.
