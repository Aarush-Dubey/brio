# Optional Reddit setup — current implementation limit

**Skip Reddit for the first Mend demo.** X is the primary automated reply destination. Reddit is optional, and its automatic connection setup is not complete yet.

The Reddit OAuth publisher and reply/reconciliation checks exist, but Mend does not yet have a Reddit identity-verification action that marks a connection ready. Entering API keys alone will not enable automatic Reddit publication. This is an implementation gap, not something you should try to fix by creating extra tokens.

## What you can use now

You can manually copy an original Reddit interaction into Mend's **Manual signal intake** form. A person can publish an approved response themselves and record its actual receipt using the case's manual-publication controls. Preserve the original URL and exact approved text; opening a composer is not proof a reply was posted.

## What to prepare if Reddit is needed later

1. Read the [Reddit Data API Wiki](https://support.reddithelp.com/hc/en-us/articles/16160319875092-Reddit-Data-API-Wiki) and use its access-request link to request API access for the intended bot/account/community. A working Reddit login does not automatically grant this capability.
2. After approval, create the permitted OAuth app through [Reddit app preferences](https://www.reddit.com/prefs/apps). Follow the approved application type and redirect-URI requirements.
3. Store the resulting client ID and secret in a private file named `/home/big-daddy/Desktop/hackathon/.data/deployment-secrets/reddit.env`. Do not put them in the weather website or public Markdown documentation.
4. The completed OAuth setup must authorize `identity read submit` with permanent access to obtain a refresh token. The runtime needs that refresh token, not a temporary access token. [Reddit OAuth protocol](https://github.com/reddit-archive/reddit/wiki/OAuth2).

These are the eventual **social-worker-only** variables:

| Name | Meaning |
| --- | --- |
| `REDDIT_CLIENT_ID` | OAuth application's client identifier. |
| `REDDIT_CLIENT_SECRET` | OAuth application's secret. |
| `REDDIT_REFRESH_TOKEN` | Permanent refresh token for the authorized dedicated account. |
| `REDDIT_USER_AGENT` | Descriptive app/version/account identity required by Reddit. |
| `REDDIT_ALLOWED_SUBREDDITS` | Permitted community names, separated by commas, without `r/`. |

Keep `REDDIT_API_APPROVED=false` on both Convex and the Cloud Run social worker until access is approved and the missing identity/readiness setup is implemented and tested. The secret values belong in Google Secret Manager with access limited to `mend-social-runtime` when the connection is enabled.

## Work still required before automatic Reddit replies

- A usable OAuth authorization/callback flow with verified state and private token storage.
- A controller action that verifies the actual Reddit account through the worker and grants readiness for that exact account/version.
- Browser/operator setup coverage and a real controlled reply with an independent receipt.

There is also no Reddit feed-ingestion poller in this version; intake uses the original manually supplied URL. The application must not describe this connector as ready until those prerequisites are satisfied.

Return to [the main setup guide](SETUP-GUIDE.md).
