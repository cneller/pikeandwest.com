# Cloudflare Pages Deployment & GA4 Cross-Domain Testing Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy Hugo site to beta.pikeandwest.com via GitHub Actions and verify GA4 cross-domain tracking with TicketTailor.

**Architecture:** Validate GitHub Actions secrets, configure Cloudflare Pages custom domain for beta subdomain, deploy Hugo site, then systematically test cross-domain tracking using GA4 DebugView to verify session continuity and purchase event attribution.

**Tech Stack:** Cloudflare Pages, GitHub Actions, Wrangler CLI, direnv, GA4 DebugView, Playwright (for configuration)

---

## Phase 1: Cloudflare API Token Validation

### Task 1: Check GitHub Secrets Status

**Files:**

- Check: `.github/workflows/deploy.yml` (lines 71-72)

**Step 1: Verify workflow expects these secrets**

The workflow at `.github/workflows/deploy.yml:71-72` expects:

```yaml
CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Step 2: Check recent GitHub Actions runs**

Run:

```bash
gh run list --repo colinneller/pikeandwest.com --limit 5
```

Expected: See recent runs - check if any failed with "secret not found" or auth errors.

**Step 3: If runs are failing, proceed to Task 2. If passing, skip to Task 4.**

---

### Task 2: Get Cloudflare Account ID via Playwright

**Prerequisite:** This task uses Playwright to navigate Cloudflare dashboard.

**Step 1: Navigate to Cloudflare Pages dashboard**

Using Playwright:

```text
browser_navigate: https://dash.cloudflare.com/
```

**Step 2: Login if needed, then navigate to Pages**

Once logged in, go to Workers & Pages section. The Account ID is visible in the right sidebar on any Pages project page.

**Step 3: Copy the Account ID**

Look for "Account ID" in the sidebar (format: 32 hex characters like `a1b2c3d4e5f6...`).

**Step 4: Record Account ID**

Save the Account ID for later use in direnv setup.

---

### Task 3: Create Cloudflare API Token via Playwright

**Reference:** [Cloudflare API Tokens docs](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)

**Step 1: Navigate to API Tokens page**

Using Playwright:

```text
browser_navigate: https://dash.cloudflare.com/profile/api-tokens
```

**Step 2: Click "Create Token"**

**Step 3: Select "Create Custom Token" and click "Get started"**

**Step 4: Configure the token with these settings:**

| Field             | Value                                       |
|-------------------|---------------------------------------------|
| Token name        | `pikeandwest-github-actions`                |
| Permissions       | Account → Cloudflare Pages → Edit           |
| Account Resources | Include → Specific account → [Your account] |

**Step 5: Click "Continue to summary" then "Create Token"**

**Step 6: Copy the token immediately**

The token is only shown once! Copy it securely.

---

### Task 4: Set Up direnv for Local Development

**Files:**

- Create: `.envrc`
- Create: `.envrc.example`
- Modify: `.gitignore`

**Step 1: Create .envrc.example template**

Create `.envrc.example`:

```bash
# Cloudflare Pages deployment credentials
# Copy this file to .envrc and fill in your values
# Run `direnv allow` after creating .envrc

export CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
export CLOUDFLARE_API_TOKEN="your-api-token-here"
```

**Step 2: Create actual .envrc with credentials**

Create `.envrc`:

```bash
# Cloudflare Pages deployment credentials
# DO NOT COMMIT THIS FILE

export CLOUDFLARE_ACCOUNT_ID="<actual-account-id>"
export CLOUDFLARE_API_TOKEN="<actual-api-token>"
```

Replace `<actual-account-id>` and `<actual-api-token>` with real values.

**Step 3: Add .envrc to .gitignore**

Verify `.gitignore` contains:

```text
.envrc
```

If not present, add it.

**Step 4: Allow direnv**

Run:

```bash
direnv allow
```

Expected: "direnv: loading .envrc" message

**Step 5: Verify environment variables**

Run:

```bash
echo $CLOUDFLARE_ACCOUNT_ID | head -c 8
```

Expected: First 8 characters of your account ID

**Step 6: Commit the example file**

```bash
git add .envrc.example .gitignore
git commit -m "chore: add direnv setup for Cloudflare credentials"
```

---

### Task 5: Add Secrets to GitHub Repository

**Step 1: Add CLOUDFLARE_ACCOUNT_ID secret**

Run:

```bash
gh secret set CLOUDFLARE_ACCOUNT_ID --repo colinneller/pikeandwest.com
```

Paste the Account ID when prompted.

**Step 2: Add CLOUDFLARE_API_TOKEN secret**

Run:

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo colinneller/pikeandwest.com
```

Paste the API Token when prompted.

**Step 3: Verify secrets are set**

Run:

```bash
gh secret list --repo colinneller/pikeandwest.com
```

Expected output:

```text
CLOUDFLARE_ACCOUNT_ID  Updated 2026-01-19
CLOUDFLARE_API_TOKEN   Updated 2026-01-19
```

---

## Phase 2: Configure beta.pikeandwest.com Subdomain

### Task 6: Add Custom Domain in Cloudflare Pages via Playwright

**Reference:** [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)

**Step 1: Navigate to Pages project settings**

Using Playwright, navigate to:

```text
https://dash.cloudflare.com/<account-id>/pages/view/pikeandwest
```

Or navigate via: Workers & Pages → pikeandwest project

**Step 2: Go to Custom domains tab**

Click "Custom domains" in the project settings.

**Step 3: Click "Set up a custom domain"**

**Step 4: Enter the subdomain**

Enter: `beta.pikeandwest.com`

**Step 5: Confirm DNS configuration**

Cloudflare will automatically add the required CNAME record since the domain is already on Cloudflare:

- Type: CNAME
- Name: beta
- Target: pikeandwest.pages.dev

**Step 6: Wait for activation**

Status should change from "Initializing" to "Active" within a few minutes.

**Step 7: Screenshot the completed configuration**

Take screenshot for documentation.

---

### Task 7: Test Initial Deployment

**Step 1: Trigger a deployment**

Push any change to main branch or manually trigger:

```bash
gh workflow run deploy.yml --repo colinneller/pikeandwest.com
```

Or push a small change:

```bash
echo "# Deployment test $(date)" >> README.md
git add README.md
git commit -m "chore: trigger deployment test"
git push origin main
```

**Step 2: Monitor the GitHub Actions run**

Run:

```bash
gh run watch --repo colinneller/pikeandwest.com
```

Expected: Run completes successfully with deployment URL.

**Step 3: Verify deployment at beta subdomain**

Open browser to: `https://beta.pikeandwest.com`

Expected: Hugo site loads correctly.

**Step 4: Verify GTM is loading (production only)**

Open browser DevTools → Network tab, filter by "gtm"

Expected: GTM script loads from `googletagmanager.com`

---

## Phase 3: GA4 Cross-Domain Tracking Verification

### Task 8: Enable GA4 Debug Mode

**Reference:** [GA4 DebugView Setup](https://support.google.com/analytics/answer/7201382)

**Step 1: Install GA Debugger Chrome extension**

Navigate to: <https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna>

Or add debug parameter to URL: `?debug_mode=true`

**Step 2: Enable the extension**

Click the extension icon to enable debug mode (icon turns orange).

**Step 3: Open GA4 DebugView**

Navigate to:

```text
https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview
```

---

### Task 9: Test Cross-Domain Navigation Flow

**Step 1: Clear browser cookies for pikeandwest.com**

In DevTools → Application → Cookies → Clear all pikeandwest.com cookies

**Step 2: Visit beta.pikeandwest.com with debug mode**

Navigate to: `https://beta.pikeandwest.com?debug_mode=true`

**Step 3: Observe GA4 DebugView**

In GA4 DebugView, you should see:

- `session_start` event
- `page_view` event with `page_location: https://beta.pikeandwest.com`

**Step 4: Record the session_id**

Click on any event and note the `ga_session_id` parameter value.

**Step 5: Click "Buy Tickets" link**

Find and click the link to tix.pikeandwest.com

**Step 6: Verify \_gl parameter in URL**

Check the URL bar on tix.pikeandwest.com. It should contain `?_gl=` parameter.

Example: `https://tix.pikeandwest.com/?_gl=1*abc123*...`

**Step 7: Verify session continuity in DebugView**

In GA4 DebugView, look for events from the ticket domain:

- `page_view` event with `page_location: https://tix.pikeandwest.com`
- **CRITICAL:** The `ga_session_id` should match the one from Step 4

**Step 8: Document results**

| Check                                 | Result |
|---------------------------------------|--------|
| \_gl parameter present                | ✓/✗    |
| session_id matches                    | ✓/✗    |
| No new session_start on ticket domain | ✓/✗    |

---

### Task 10: Test Purchase Event (if possible)

**Note:** This requires completing an actual test purchase or having a test mode in TicketTailor.

**Step 1: Navigate through checkout flow**

On tix.pikeandwest.com:

1. Select a ticket/event
2. Add to cart
3. Proceed to checkout
4. Complete purchase (use test payment if available)

**Step 2: Watch for purchase event in DebugView**

In GA4 DebugView, look for:

- `add_to_cart` event
- `begin_checkout` event
- `purchase` event

**Step 3: Verify purchase event parameters**

The `purchase` event should include:

- `transaction_id`
- `value`
- `currency`
- `items[]` array

**Step 4: Verify attribution**

Check that the purchase event has the same `ga_session_id` as the original session from beta.pikeandwest.com.

---

### Task 11: Check for Self-Referrals in GA4 Reports

**Step 1: Wait 24-48 hours after deployment**

GA4 needs time to process data for standard reports.

**Step 2: Navigate to Traffic Acquisition report**

In GA4:
Reports → Acquisition → Traffic acquisition

**Step 3: Filter for referral traffic**

Add filter: Session default channel group = Referral

**Step 4: Check referral sources**

Look for any entries showing:

- `tix.pikeandwest.com`
- `beta.pikeandwest.com`
- `pikeandwest.pages.dev`

**Step 5: If self-referrals found, add to unwanted referrals list**

Navigate to:
Admin → Data Streams → Pike & West Website → Configure tag settings → List unwanted referrals

Add any domains appearing as self-referrals.

---

## Phase 4: Documentation & Monitoring

### Task 12: Update Cross-Domain Tracking Documentation

**Files:**

- Modify: `docs/cross-domain-tracking-verification.md`

**Step 1: Add beta subdomain testing results**

Add a new section documenting:

- beta.pikeandwest.com deployment verified
- Cross-domain tracking test results
- Any issues found and resolutions

**Step 2: Commit documentation updates**

```bash
git add docs/cross-domain-tracking-verification.md
git commit -m "docs: add beta subdomain and GA4 testing results"
git push origin main
```

---

### Task 13: Set Up Monitoring Checklist

**Create ongoing monitoring tasks:**

**Weekly checks (first month):**

- [ ] Check GA4 Traffic Acquisition for self-referrals
- [ ] Verify purchase events are being captured
- [ ] Check Realtime report during business hours

**Monthly checks:**

- [ ] Review GA4 attribution reports
- [ ] Check for session continuity issues
- [ ] Verify conversion counts match TicketTailor reports

---

## Troubleshooting Reference

### Common Issues

| Issue              | Symptom                         | Solution                               |
|--------------------|---------------------------------|----------------------------------------|
| No \_gl parameter  | URL missing linker              | Check GTM Conversion Linker tag        |
| Session breaks     | Different session_id            | Verify domains in cross-domain config  |
| Self-referrals     | tix.pikeandwest.com as referral | Add to unwanted referrals list         |
| No purchase events | Missing in DebugView            | Verify TicketTailor GA4 config         |
| Deployment fails   | GitHub Actions error            | Check CLOUDFLARE_API_TOKEN permissions |

### Useful Commands

```bash
# Check deployment status
gh run list --repo colinneller/pikeandwest.com

# View deployment logs
gh run view <run-id> --log --repo colinneller/pikeandwest.com

# Local Hugo build test
hugo --gc --minify && hugo server

# Test wrangler locally
wrangler pages deploy public --project-name=pikeandwest --dry-run
```

### Key URLs

| Resource                   | URL                                                                                |
|----------------------------|------------------------------------------------------------------------------------|
| Cloudflare Pages Dashboard | <https://dash.cloudflare.com/pages>                                                  |
| GA4 Admin                  | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin>            |
| GA4 DebugView              | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/debugview>  |
| GTM Container              | <https://tagmanager.google.com/#/container/accounts/6297497052/containers/212421428> |
| TicketTailor Admin         | <https://www.tickettailor.com/dashboard>                                             |

---

## Sources

- [Cloudflare Pages GitHub Action](https://github.com/marketplace/actions/cloudflare-pages-github-action)
- [Cloudflare Pages Custom Domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Add Custom Domain to Branch](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/)
- [GA4 Cross-Domain Tracking Setup](https://support.google.com/analytics/answer/10071811?hl=en)
- [Test Purchase Events in GA4](https://medium.com/@jtlowry2/how-to-test-and-validate-the-purchase-event-in-ga4-a-comprehensive-guide-e8fb9f20ad13)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)
