---
name: ship-feature
description: Wraps up a finished feature. Use when asked to ship, publish or wrap up a feature, or after a feature works locally.
---

# Ship Feature

Run these steps in order. Stop and tell me if any step fails.

1. **Check it works.** Run `npm run build` and fix any errors. Confirm the feature works with `npm run dev`.
2. **Check nothing secret is included.** Make sure `.env.local` and the API key are not staged or printed anywhere.
3. **Commit.** Use a clear message that says what the feature does, e.g. "feat: show top 3 cheapest hotels".
4. **Push to GitHub** (`main`). Vercel deploys from `main` automatically.
5. **Confirm the deployment.** Check that the Vercel deployment for this commit is live. If it failed, report why.
   - If you can't check Vercel directly, ask me for the live URL. Then open it and confirm the app loads and the search form shows.
   - If the project isn't on Vercel yet, tell me to import the repo in the Vercel dashboard and add `HASDATA_API_KEY` as an environment variable. Then wait for me to give you the URL.
6. **Update Notion.** Set the feature's Status to "Built" in the Hotel Finder Features database. Also add the live URL and today's date to the feature's Notion page under a "Shipped" heading.

Finish with a summary report in plain language, in this format:

| Step | Status | Detail |
|---|---|---|
| Build and local check | ✅ PASS / ❌ FAIL | e.g. "built with no errors" |
| Secrets check | ✅ PASS / ❌ FAIL | e.g. ".env.local not committed" |
| Commit | ✅ PASS / ❌ FAIL | commit message and short hash |
| Push to GitHub | ✅ PASS / ❌ FAIL | branch `main` |
| Vercel deployment | ✅ PASS / ❌ FAIL | Ready / Failed, and why if it failed |
| Notion Status | ✅ PASS / ❌ FAIL / ⏭️ SKIPPED | "Built", or why it was skipped |

- **Live URL:** the deployed link, or "not deployed" if it failed.
- **Open items:** anything unfinished or worth checking, or "none".

If a step failed, mark it ❌, mark later steps ⏭️ SKIPPED, and say what to fix.

Rules:
- Never commit `.env.local` or print the API key.
- Don't set Status to "Built" until the deployment is live.
- Don't add new features while shipping; note new ideas under "Future scope" in the PRD.
