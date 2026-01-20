# Cross-Domain Tracking Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable unified GA4 tracking between pikeandwest.com and tix.pikeandwest.com (TicketTailor) for complete visitor journey visibility.

**Architecture:** GTM-based implementation. The main site uses GTM container `GTM-P8XR8C5S` which fires GA4 `G-Y9PFGHX5Z3`. TicketTailor's custom domain `tix.pikeandwest.com` is a subdomain, so GA4 handles cookie sharing automatically. No direct gtag code needed on the main site.

**Tech Stack:** Google Tag Manager, Google Analytics 4, TicketTailor, Hugo (future), Webflow (current), **Playwright MCP** (for browser automation)

**Reference Document:** [TicketTailor GA4 Integration Research](./2026-01-19-tickettailor-ga4-integration.md)

**Automation:** This plan uses Playwright MCP tools for external platform configuration and verification. User will authenticate manually when prompted.

---

## Phase 1: TicketTailor Configuration (Playwright-Assisted)

### Task 1: Configure TicketTailor GA4 Integration via Playwright

**Platform:** TicketTailor Dashboard (browser automation)

**Step 1: Launch browser and navigate to TicketTailor**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://dashboard.tickettailor.com
```

**Step 2: Wait for user to authenticate**

User will manually log in. After login, take a snapshot to verify we're on the dashboard.

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
```

**Step 3: Navigate to Box Office Settings**

Click account menu, then "Box office settings":

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Account menu / Box office settings link
```

**Step 4: Navigate to Connect Apps > Google Analytics**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "Connect apps" in left sidebar
Then: "Google Analytics" option
```

**Step 5: Capture current settings (before)**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Save snapshot to understand current form state
```

**Step 6: Configure GA4 Measurement ID**

```text
Use: mcp__plugin_playwright_playwright__browser_fill_form
Fields:
  - Measurement ID field: "G-Y9PFGHX5Z3"
  - Primary domain field: "www.pikeandwest.com"
```

Or use individual type commands:

```text
Use: mcp__plugin_playwright_playwright__browser_type
Element: Measurement ID input
Text: "G-Y9PFGHX5Z3"

Use: mcp__plugin_playwright_playwright__browser_type
Element: Primary domain input
Text: "www.pikeandwest.com"
```

**Step 7: Save settings**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "Save settings" button
```

**Step 8: Verify and screenshot confirmation**

```text
Use: mcp__plugin_playwright_playwright__browser_wait_for
Text: "Active" (or success indicator)

Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "tickettailor-ga4-config-complete.png"
```

**Step 9: Capture the gtag code shown (for documentation)**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Document the gtag code TicketTailor displays (we will NOT use it, but document for reference)
```

**Expected Outcome:**

- Measurement ID: `G-Y9PFGHX5Z3` configured
- Primary domain: `www.pikeandwest.com` configured
- Status: Active
- Screenshot saved to `.playwright-mcp/tickettailor-ga4-config-complete.png`

---

## Phase 2: GTM Verification (Playwright-Assisted)

### Task 2: Verify GTM GA4 Configuration Tag via Playwright

**Platform:** Google Tag Manager (browser automation)

**Step 1: Navigate to GTM**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://tagmanager.google.com
```

**Step 2: Wait for user to authenticate**

User will log in with Google account. Take snapshot after login.

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
```

**Step 3: Select the correct GTM container**

Look for container `GTM-P8XR8C5S` and click to open:

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Container "GTM-P8XR8C5S" or "Pike & West"
```

**Step 4: Navigate to Tags**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "Tags" in left sidebar
```

**Step 5: Snapshot tag list**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Document all tags present, especially GA4-related ones
```

**Step 6: Find and click GA4 Configuration tag**

Look for tag containing "GA4" or "Google Analytics":

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: GA4 Configuration tag (name varies)
```

**Step 7: Capture GA4 tag configuration**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Verify:
  - Measurement ID is "G-Y9PFGHX5Z3"
  - Trigger is "All Pages" or equivalent
  - Note any Fields to Set
```

**Step 8: Screenshot GA4 tag settings**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "gtm-ga4-tag-config.png"
```

**Expected Outcome:**

- Confirmed GA4 tag uses Measurement ID `G-Y9PFGHX5Z3`
- Trigger verified as All Pages
- Screenshot saved

---

### Task 3: Check/Create Conversion Linker in GTM (Optional)

**Prerequisite:** Only needed if using Google Ads remarketing

**Step 1: Search for existing Conversion Linker**

From the Tags list, look for "Conversion Linker":

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Search for any tag of type "Conversion Linker"
```

**Step 2: If Conversion Linker exists, verify domains**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Existing Conversion Linker tag

Use: mcp__plugin_playwright_playwright__browser_snapshot
Check if "Link domains" contains tickettailor.com
```

**Step 3: If no Conversion Linker and Google Ads is used, create one**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "New" button

Use: mcp__plugin_playwright_playwright__browser_click
Element: Tag Configuration area

Use: mcp__plugin_playwright_playwright__browser_click
Element: "Conversion Linker" tag type
```

Configure:

- Enable "Enable linking across domains"
- Link domains: `tickettailor.com, tix.pikeandwest.com`

```text
Use: mcp__plugin_playwright_playwright__browser_type
Element: Link domains field
Text: "tickettailor.com, tix.pikeandwest.com"
```

Add trigger:

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Triggering section

Use: mcp__plugin_playwright_playwright__browser_click
Element: "All Pages" trigger
```

Save:

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "Save" button
```

**Step 4: Screenshot final state**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "gtm-conversion-linker.png"
```

**Note:** Do NOT publish yet - will publish after all verification complete.

---

## Phase 3: Hugo Implementation (Code Changes)

### Task 4: Create GTM Head Partial

**Files:**

- Create: `layouts/partials/gtm-head.html`

**Step 1: Create the partial file**

```html
{{/* layouts/partials/gtm-head.html */}}
{{/*
  Purpose: Google Tag Manager script for <head>
  Context: Called from baseof.html inside <head> tag
  Usage: {{ partial "gtm-head.html" . }}

  GTM Container: GTM-P8XR8C5S
  Fires: GA4 (G-Y9PFGHX5Z3), plus any other tags configured in GTM
*/}}
{{ if hugo.IsProduction }}
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{{ site.Params.gtm_id | default "GTM-P8XR8C5S" }}');</script>
<!-- End Google Tag Manager -->
{{ end }}
```

**Step 2: Verify file was created**

Run: `cat layouts/partials/gtm-head.html`

Expected: File contents shown above

---

### Task 5: Create GTM Body Partial

**Files:**

- Create: `layouts/partials/gtm-body.html`

**Step 1: Create the partial file**

```html
{{/* layouts/partials/gtm-body.html */}}
{{/*
  Purpose: Google Tag Manager noscript fallback for <body>
  Context: Called from baseof.html immediately after opening <body> tag
  Usage: {{ partial "gtm-body.html" . }}

  This provides tracking for users with JavaScript disabled.
*/}}
{{ if hugo.IsProduction }}
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ site.Params.gtm_id | default "GTM-P8XR8C5S" }}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
{{ end }}
```

**Step 2: Verify file was created**

Run: `cat layouts/partials/gtm-body.html`

Expected: File contents shown above

---

### Task 6: Add GTM Configuration to Hugo Config

**Files:**

- Modify: `config/_default/params.toml`

**Step 1: Check if params.toml exists**

Run: `cat config/_default/params.toml 2>/dev/null || echo "File does not exist"`

**Step 2: Add or update GTM configuration**

Add this section (or merge with existing):

```toml
# Google Tag Manager
# All GA4 and analytics configuration is managed in GTM
gtm_id = "GTM-P8XR8C5S"
```

**Step 3: Verify configuration**

Run: `grep -A1 "gtm_id" config/_default/params.toml`

Expected: `gtm_id = "GTM-P8XR8C5S"`

---

### Task 7: Integrate GTM Partials into Base Template

**Files:**

- Modify: `layouts/_default/baseof.html`

**Step 1: Read current baseof.html**

Run: `cat layouts/_default/baseof.html`

**Step 2: Add GTM head partial inside `<head>`**

Find the `<head>` section and add before the closing `</head>`:

```html
  {{- partial "gtm-head.html" . -}}
</head>
```

**Step 3: Add GTM body partial immediately after `<body>`**

Find the opening `<body>` tag and add immediately after:

```html
<body{{ with .Params.body_class }} class="{{ . }}"{{ end }}>
  {{- partial "gtm-body.html" . -}}
```

**Step 4: Verify integration**

Run: `grep -A2 "gtm-head\|gtm-body" layouts/_default/baseof.html`

Expected: Both partial calls should appear

---

### Task 8: Commit Hugo GTM Implementation

**Step 1: Stage changes**

```bash
git add layouts/partials/gtm-head.html layouts/partials/gtm-body.html config/_default/params.toml layouts/_default/baseof.html
```

**Step 2: Commit**

```bash
git commit -m "feat(analytics): add GTM partials for cross-domain tracking

- Add gtm-head.html partial for GTM script in <head>
- Add gtm-body.html partial for noscript fallback
- Add gtm_id parameter to Hugo config
- Integrate partials into baseof.html
- Only loads in production (hugo.IsProduction)

GTM Container: GTM-P8XR8C5S
GA4 Property: G-Y9PFGHX5Z3"
```

---

## Phase 4: Testing & Verification (Playwright-Assisted)

### Task 9: Test Cross-Domain Tracking via Playwright

**Prerequisites:** TicketTailor configured (Task 1 complete)

**Step 1: Navigate to main site**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://www.pikeandwest.com
```

**Step 2: Take snapshot of homepage**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Look for links to tix.pikeandwest.com or ticket-related CTAs
```

**Step 3: Find and click ticket link**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Link containing "ticket" or linking to tix.pikeandwest.com
```

**Step 4: Capture destination URL**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Check page URL for _gl= parameter
```

**Step 5: Evaluate URL**

The URL should contain `_gl=` parameter like:

```text
https://tix.pikeandwest.com/...?_gl=1*xxxxx*_ga*xxxxx
```

**Step 6: Screenshot result**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "cross-domain-gl-parameter-test.png"
```

**Step 7: Document result**

- If `_gl=` present: SUCCESS - Cross-domain linking is working
- If `_gl=` absent: INVESTIGATE - Check troubleshooting section in research doc

---

### Task 10: Verify Session Continuity in GA4 Realtime via Playwright

**Platform:** Google Analytics 4 (browser automation)

**Step 1: Navigate to GA4 Realtime**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://analytics.google.com/analytics/web/#/a300399219p424998364/reports/realtime
```

**Step 2: Wait for authentication and take snapshot**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Capture current realtime state
```

**Step 3: Open new tab for test navigation**

```text
Use: mcp__plugin_playwright_playwright__browser_tabs
Action: "new"

Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://www.pikeandwest.com
```

**Step 4: Perform cross-domain journey in new tab**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Link to tix.pikeandwest.com

Use: mcp__plugin_playwright_playwright__browser_wait_for
Time: 3 (seconds for GA4 to register)
```

**Step 5: Switch back to GA4 Realtime tab**

```text
Use: mcp__plugin_playwright_playwright__browser_tabs
Action: "select"
Index: 0 (first tab with GA4)
```

**Step 6: Capture realtime data**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Check:
  - Users count (should not double)
  - Pages show both domains
  - No sudden spike in users
```

**Step 7: Screenshot realtime report**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "ga4-realtime-cross-domain-test.png"
```

---

### Task 11: Check for Self-Referrals in GA4 via Playwright

**Platform:** Google Analytics 4 (browser automation)

**Step 1: Navigate to Traffic Acquisition report**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://analytics.google.com/analytics/web/#/a300399219p424998364/reports/explorer?params=_u..nav%3Dmaui%26_r.explorerCard..selmet%3D%5B%22sessions%22%5D%26_r.explorerCard..seldim%3D%5B%22sessionSource%22%5D&r=traffic-acquisition-v2
```

**Step 2: Take snapshot of report**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
```

**Step 3: Look for TicketTailor referrals**

Search the report for:

- `tix.pikeandwest.com`
- `tickettailor.com`

```text
Use: mcp__plugin_playwright_playwright__browser_type
Element: Search/filter box
Text: "tix.pikeandwest"
Submit: true
```

**Step 4: Capture results**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
```

**Step 5: Evaluate**

- If found as referral: Cross-domain tracking is NOT working
- If not found: SUCCESS (or no traffic yet)

**Step 6: Screenshot**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "ga4-self-referral-check.png"
```

---

### Task 12: Test Hugo Build Locally

**Prerequisites:** Tasks 4-7 complete (Hugo GTM partials)

**Step 1: Build Hugo in production mode**

```bash
hugo --environment production
```

**Step 2: Check GTM code in output**

```bash
grep -l "GTM-P8XR8C5S" public/*.html | head -3
```

Expected: Multiple HTML files should contain GTM code

**Step 3: Verify GTM placement**

```bash
grep -A2 "Google Tag Manager" public/index.html
```

Expected: GTM script in `<head>` and noscript after `<body>`

**Step 4: Verify development mode excludes GTM**

```bash
hugo --environment development
grep "GTM-P8XR8C5S" public/index.html
```

Expected: No GTM code (or empty result) since `hugo.IsProduction` is false

---

### Task 13: Create Test Results Documentation

**Step 1: Create test results file**

Create `docs/plans/2026-01-19-cross-domain-tracking-test-results.md`:

```markdown
# Cross-Domain Tracking Test Results

**Date:** 2026-01-19
**Tester:** Claude (Playwright-assisted)

## Configuration Status

| Component                   | Status | Notes                              |
|-----------------------------|--------|------------------------------------|
| TicketTailor GA4            | [ ]    | Measurement ID: G-Y9PFGHX5Z3       |
| TicketTailor Primary Domain | [ ]    | www.pikeandwest.com                |
| GTM GA4 Tag                 | [ ]    | Verified in container GTM-P8XR8C5S |
| GA4 Cross-Domain Config     | [x]    | "Ends with pikeandwest.com"        |

## Screenshots Captured

| Screenshot                             | Purpose                     |
|----------------------------------------|-----------------------------|
| `tickettailor-ga4-config-complete.png` | TicketTailor GA4 settings   |
| `gtm-ga4-tag-config.png`               | GTM GA4 Configuration tag   |
| `cross-domain-gl-parameter-test.png`   | URL with _gl= parameter     |
| `ga4-realtime-cross-domain-test.png`   | Realtime session continuity |
| `ga4-self-referral-check.png`          | Self-referral check         |

## Test Results

### URL Parameter Test

- **Date/Time:**
- **From URL:** www.pikeandwest.com
- **To URL:** tix.pikeandwest.com
- **`_gl=` parameter present:** [ ] Yes / [ ] No
- **Screenshot:** `cross-domain-gl-parameter-test.png`

### GA4 Realtime Test

- **Session appeared unified:** [ ] Yes / [ ] No
- **Screenshot:** `ga4-realtime-cross-domain-test.png`
- **Notes:**

### Self-Referral Check

- **tix.pikeandwest.com as referral:** [ ] Yes / [ ] No
- **tickettailor.com as referral:** [ ] Yes / [ ] No
- **Screenshot:** `ga4-self-referral-check.png`
- **Notes:**

### Hugo Build Test

- **Production build includes GTM:** [ ] Yes / [ ] No
- **Development build excludes GTM:** [ ] Yes / [ ] No

## Issues Found

(List any issues and resolutions)

## Sign-Off

- [ ] All tests passing
- [ ] Ready for production deployment
```

**Step 2: Commit**

```bash
git add docs/plans/2026-01-19-cross-domain-tracking-test-results.md
git commit -m "docs: add cross-domain tracking test results template"
```

---

## Phase 5: GA4 Conversion Setup (Playwright-Assisted, Optional)

### Task 14: Mark Purchase as Key Event in GA4 via Playwright

**Platform:** Google Analytics 4 (browser automation)

**Step 1: Navigate to Events**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/events
```

**Step 2: Take snapshot of events list**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Look for "purchase" event in the list
```

**Step 3: If purchase event exists, mark as key event**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: Toggle for "Mark as key event" next to purchase
```

**Step 4: Screenshot confirmation**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "ga4-purchase-key-event.png"
```

**Note:** If purchase event doesn't exist yet, it will appear after TicketTailor sends purchase data. Return to this task later.

---

### Task 15: Verify GA4 Cross-Domain Settings via Playwright

**Platform:** Google Analytics 4 (browser automation)

**Step 1: Navigate to Data Stream**

```text
Use: mcp__plugin_playwright_playwright__browser_navigate
URL: https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/streams/table/6676080268
```

**Step 2: Click Configure tag settings**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "Configure tag settings" button
```

**Step 3: Click Configure your domains**

```text
Use: mcp__plugin_playwright_playwright__browser_click
Element: "Configure your domains" option
```

**Step 4: Capture current configuration**

```text
Use: mcp__plugin_playwright_playwright__browser_snapshot
Verify:
  - Match type: "Ends with"
  - Domain: "pikeandwest.com"
```

**Step 5: Screenshot for documentation**

```text
Use: mcp__plugin_playwright_playwright__browser_take_screenshot
Filename: "ga4-cross-domain-config-verified.png"
```

**Expected:** Configuration already correct (no changes needed)

---

### Task 16: Close Browser

**Step 1: Close Playwright browser session**

```text
Use: mcp__plugin_playwright_playwright__browser_close
```

---

## Summary

### Key IDs Reference

```text
GTM Container ID:   GTM-P8XR8C5S
GA4 Measurement ID: G-Y9PFGHX5Z3
GA4 Property ID:    424998364
GA4 Stream ID:      6676080268
Main Domain:        www.pikeandwest.com
Ticket Domain:      tix.pikeandwest.com
```

### Files Created/Modified

| File                                                          | Action | Purpose                 |
|---------------------------------------------------------------|--------|-------------------------|
| `layouts/partials/gtm-head.html`                              | Create | GTM script for `<head>` |
| `layouts/partials/gtm-body.html`                              | Create | GTM noscript fallback   |
| `config/_default/params.toml`                                 | Modify | Add `gtm_id` parameter  |
| `layouts/_default/baseof.html`                                | Modify | Integrate GTM partials  |
| `docs/plans/2026-01-19-cross-domain-tracking-test-results.md` | Create | Test documentation      |

### Screenshots to Capture (via Playwright)

| Filename                               | Task | Purpose                        |
|----------------------------------------|------|--------------------------------|
| `tickettailor-ga4-config-complete.png` | 1    | TicketTailor GA4 configuration |
| `gtm-ga4-tag-config.png`               | 2    | GTM GA4 tag verification       |
| `gtm-conversion-linker.png`            | 3    | Conversion Linker (if created) |
| `cross-domain-gl-parameter-test.png`   | 9    | URL with \_gl= parameter       |
| `ga4-realtime-cross-domain-test.png`   | 10   | Realtime session test          |
| `ga4-self-referral-check.png`          | 11   | Self-referral verification     |
| `ga4-purchase-key-event.png`           | 14   | Purchase marked as key event   |
| `ga4-cross-domain-config-verified.png` | 15   | Cross-domain settings verified |

### External Configurations

| Platform     | Configuration                              | Method     |
|--------------|--------------------------------------------|------------|
| TicketTailor | GA4 Measurement ID + Primary domain        | Playwright |
| GTM          | Verify GA4 tag, optional Conversion Linker | Playwright |
| GA4          | Verify cross-domain config, mark key event | Playwright |

### Playwright MCP Tools Used

| Tool                      | Purpose                         |
|---------------------------|---------------------------------|
| `browser_navigate`        | Open URLs                       |
| `browser_snapshot`        | Capture page state for analysis |
| `browser_click`           | Click buttons and links         |
| `browser_type`            | Enter text in forms             |
| `browser_fill_form`       | Fill multiple form fields       |
| `browser_take_screenshot` | Save visual evidence            |
| `browser_wait_for`        | Wait for elements or time       |
| `browser_tabs`            | Manage multiple tabs            |
| `browser_close`           | Close browser session           |
