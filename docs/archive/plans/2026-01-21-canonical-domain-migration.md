# Canonical Domain Migration: WWW to Naked Domain

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate pikeandwest.com canonical domain from `www.pikeandwest.com` to `pikeandwest.com` (naked domain) without impacting SEO rankings.

**Architecture:** The Hugo site is already configured with the correct `baseURL` and canonical tags. This migration primarily involves: (1) creating redirect rules, (2) updating documentation, and (3) monitoring post-migration.

**Tech Stack:** Hugo, Cloudflare Pages, Cloudflare DNS, Google Search Console, GTM/GA4

---

## Pre-Migration Status (Phase 1 - COMPLETE)

| Task                             | Status | Evidence                                       |
|----------------------------------|--------|------------------------------------------------|
| GSC domain property verified     | Done   | `sc-domain:pikeandwest.com` active             |
| Hugo baseURL set to naked domain | Done   | `config/_default/hugo.toml` line 1             |
| Canonical tags use .Permalink    | Done   | `layouts/partials/head.html` line 36           |
| robots.txt uses naked domain     | Done   | `Sitemap: https://pikeandwest.com/sitemap.xml` |
| No hardcoded www in code         | Done   | Grep confirmed layouts/content clean           |

---

## Phase 2: DNS & Redirect Configuration

### Task 1: Create Cloudflare Pages Redirect File

**Files:**

- Create: `static/_redirects`

**Step 1: Create the \_redirects file**

```text
# Canonical Domain Redirect
# Redirect www to naked domain (301 permanent)
# Reference: docs/infrastructure/canonical-domain-migration-analysis.md

https://www.pikeandwest.com/* https://pikeandwest.com/:splat 301
```

**Step 2: Verify file is in correct location**

Run:

```bash
ls -la static/_redirects
cat static/_redirects
```

Expected: File exists with redirect rule.

**Step 3: Test locally that Hugo copies static files**

Run:

```bash
hugo --gc --minify
ls -la public/_redirects
cat public/_redirects
```

Expected: File exists in `public/` directory with same content.

**Step 4: Commit**

```bash
git add static/_redirects
git commit -m "feat(dns): add www to naked domain 301 redirect for Cloudflare Pages"
```

---

### Task 2: Verify DNS Configuration Ready

**Files:**

- Reference: `scripts/dns-switch.sh`
- Reference: `.envrc` (credentials)

**Step 1: Check current DNS status**

Run:

```bash
./scripts/dns-switch.sh status
```

Expected: Shows current CNAME targets (likely Webflow).

**Step 2: Verify Cloudflare Pages custom domain is configured**

Open Cloudflare Dashboard → Pages → pikeandwest project → Custom domains.

Verify both domains are listed:

- `pikeandwest.com`
- `www.pikeandwest.com`

If not configured, add them before proceeding.

**Step 3: Document current state (no commit - just verification)**

Note the current CNAME targets shown in Step 1 for rollback reference.

---

### Task 3: Update DNS Configuration Documentation

**Files:**

- Modify: `docs/infrastructure/dns-configuration.md`

**Step 1: Update the Canonical Domain section**

Replace the existing "Canonical Domain" section (lines 5-21) with:

```markdown
## Canonical Domain

**Canonical URL: `https://pikeandwest.com/`** (naked domain)

Changed from `www.pikeandwest.com` on 2026-01-21. See [migration analysis](./canonical-domain-migration-analysis.md) for rationale.

Google Search Console domain property (`sc-domain:pikeandwest.com`) covers all variants. The www version now 301 redirects to naked domain via Cloudflare Pages `_redirects` file.
```

**Step 2: Update the redirect configuration section**

Find and update the redirect examples to show www → naked (not naked → www).

**Step 3: Commit**

```bash
git add docs/infrastructure/dns-configuration.md
git commit -m "docs(dns): update canonical domain to naked domain"
```

---

## Phase 3: Content & Sitemap Updates

### Task 4: Verify Internal Links Use Relative Paths

**Files:**

- Reference: `layouts/**/*.html`
- Reference: `content/**/*.md`

**Step 1: Check for absolute internal links**

Run:

```bash
grep -r "https://pikeandwest.com" layouts/ content/ --include="*.html" --include="*.md" | grep -v "canonical" | head -20
grep -r "https://www.pikeandwest.com" layouts/ content/ --include="*.html" --include="*.md" | head -20
```

Expected: No matches (internal links should be relative or use Hugo functions).

**Step 2: If matches found, update to relative paths**

Replace absolute URLs with:

- Hugo template: `{{ .Permalink }}` or `{{ relURL "/path" }}`
- Markdown: `[Link](/path/)` (relative)

**Step 3: Commit if changes made**

```bash
git add -A
git commit -m "fix: convert absolute URLs to relative paths"
```

---

### Task 5: Verify Sitemap Generation

**Files:**

- Reference: `config/_default/hugo.toml` (sitemap config)
- Output: `public/sitemap.xml`

**Step 1: Generate sitemap**

Run:

```bash
hugo --gc --minify
cat public/sitemap.xml | head -30
```

Expected: All `<loc>` entries use `https://pikeandwest.com/` (naked domain).

**Step 2: Verify sitemap URLs are correct**

Run:

```bash
grep -o '<loc>[^<]*</loc>' public/sitemap.xml
```

Expected output (example):

```html
<loc>https://pikeandwest.com/</loc>
<loc>https://pikeandwest.com/contact/</loc>
<loc>https://pikeandwest.com/about/</loc>
...
```

No `www` should appear in any URL.

**Step 3: No commit needed - this is verification only**

---

### Task 6: Verify robots.txt Configuration

**Files:**

- Reference: `static/robots.txt`

**Step 1: Check robots.txt content**

Run:

```bash
cat static/robots.txt
```

Expected: `Sitemap: https://pikeandwest.com/sitemap.xml` (naked domain - already correct).

**Step 2: No changes needed if already correct**

Current file already uses naked domain.

---

## Phase 4: External Updates

### Task 7: Update Documentation References

**Files:**

- Modify: `docs/analytics/README.md`
- Modify: `docs/analytics/implementation-guide.md`
- Modify: `docs/cross-domain-tracking-verification.md`
- Modify: `docs/next-steps.md`

**Step 1: Update analytics README.md**

Run search and replace:

```bash
# Preview changes first
grep -n "www\.pikeandwest\.com" docs/analytics/README.md
```

Update primary domain references from `www.pikeandwest.com` to `pikeandwest.com`.

**Step 2: Update implementation-guide.md**

```bash
grep -n "www\.pikeandwest\.com" docs/analytics/implementation-guide.md
```

Update line 126 and any other references.

**Step 3: Update cross-domain-tracking-verification.md**

```bash
grep -n "www\.pikeandwest\.com" docs/cross-domain-tracking-verification.md
```

Update all references.

**Step 4: Update next-steps.md**

```bash
grep -n "www\.pikeandwest\.com" docs/next-steps.md
```

Update production domain status.

**Step 5: Commit documentation updates**

```bash
git add docs/
git commit -m "docs: update all references from www to naked domain"
```

---

### Task 8: Update GA4 Stream URL (If Needed) - PLAYWRIGHT GUIDED

**Files:**

- Reference: GTM Container (external)
- Reference: GA4 Property (external)

**Method:** Playwright-guided UI navigation. User logs in, Claude navigates.

**Step 1: Check GA4 Data Stream URL (Playwright)**

Claude will:

1. Navigate to `https://analytics.google.com`
2. Wait for user login if needed
3. Navigate to Admin → Data Streams
4. Read current stream URL and report

**Step 2: Update if shows www (Playwright guided)**

If stream URL is `https://www.pikeandwest.com`:

1. Claude clicks edit icon on stream
2. User updates URL to `https://pikeandwest.com`
3. Claude clicks "Update stream"

Note: GA4 is flexible about this, but consistency helps reporting.

**Step 3: Verify GTM cross-domain settings (Playwright guided)**

Claude will:

1. Navigate to `https://tagmanager.google.com`
2. Open GA4 Configuration tag
3. Verify cross-domain linking includes `pikeandwest.com`

**Step 4: No code commit - external service update only**

**CLI Alternative:** [GA4 Admin API](https://developers.google.com/analytics/devguides/config/admin/v1/rest/v1beta/properties.dataStreams/patch) can update stream URL but requires OAuth setup. Playwright is simpler for one-time updates.

---

### Task 9: Prepare External Service Update List

**Files:**

- Create: `docs/infrastructure/canonical-migration-external-updates.md`

**Step 1: Create external updates checklist**

```markdown
# Canonical Domain Migration - External Updates

> Checklist of external services to update after DNS cutover.

## Immediate (Within 24 hours of go-live)

- [ ] **Google Business Profile**
  - URL: https://business.google.com
  - Update website URL from www to naked domain

- [ ] **Instagram Bio**
  - URL: https://www.instagram.com/pikeandwest/
  - Update link in bio (likely using Linktree or direct)

- [ ] **Facebook Page**
  - URL: https://www.facebook.com/pikeandwest
  - Update website link in About section

## Within First Week

- [ ] **TicketTailor Primary Domain**
  - Update cross-domain tracking primary domain setting
  - Reference: docs/plans/2026-01-19-tickettailor-ga4-integration.md

- [ ] **HoneyBook**
  - Verify portal.pikeandwest.com links work correctly
  - No URL change needed (subdomain unaffected)

## Verify (No Action Needed)

- [ ] **Google Search Console** - Domain property covers both versions
- [ ] **Cloudflare** - DNS managed, no external update needed
- [ ] **GitHub** - Repository URLs unaffected
```

**Step 2: Commit**

```bash
git add docs/infrastructure/canonical-migration-external-updates.md
git commit -m "docs: add external service update checklist for canonical migration"
```

---

## Phase 5: Go-Live & Post-Migration Monitoring

### Task 10: Deploy and Switch DNS

**Files:**

- Reference: `scripts/dns-switch.sh`

**Step 1: Push all changes to trigger Cloudflare Pages deploy**

```bash
git push origin main
```

**Step 2: Verify Cloudflare Pages deployment succeeded**

Check Cloudflare Dashboard → Pages → pikeandwest → Deployments.

Wait for deployment to complete (usually 1-2 minutes).

**Step 3: Test redirect on preview URL (if available)**

If a preview deployment exists, test:

```bash
curl -I https://[preview-hash].pikeandwest.pages.dev
```

**Step 4: Switch DNS to Hugo**

```bash
./scripts/dns-switch.sh hugo
```

Expected output: Success messages for both naked and www CNAME updates.

**Step 5: Verify redirect works**

Wait 1-2 minutes for DNS propagation, then:

```bash
curl -I https://www.pikeandwest.com
```

Expected: `HTTP/2 301` with `location: https://pikeandwest.com/`

```bash
curl -I https://pikeandwest.com
```

Expected: `HTTP/2 200`

---

### Task 11: Submit Sitemap to GSC - PLAYWRIGHT GUIDED

**Files:**

- Reference: Google Search Console (external)

**Method:** Playwright-guided UI navigation. User logs in, Claude navigates.

**Step 1: Navigate to GSC (Playwright)**

Claude will:

1. Navigate to `https://search.google.com/search-console`
2. Wait for user login if needed
3. Select property `sc-domain:pikeandwest.com`

**Step 2: Navigate to Sitemaps (Playwright)**

Claude will click: Left sidebar → Indexing → Sitemaps

**Step 3: Submit new sitemap (Playwright guided)**

Claude will:

1. Find sitemap input field
2. Type `https://pikeandwest.com/sitemap.xml`
3. Click Submit button

**Step 4: Verify submission**

Claude will confirm status shows "Success" or "Pending".

**CLI Alternative:** [Search Console API](https://developers.google.com/webmaster-tools/v1/sitemaps/submit) supports sitemap submission via `PUT` request, but requires OAuth setup with service account.

---

### Task 12: Verify Canonical Recognition in GSC - PLAYWRIGHT GUIDED

**Files:**

- Reference: Google Search Console (external)

**Method:** Playwright-guided UI navigation. Continues from Task 11 session.

**Step 1: Use URL Inspection tool (Playwright)**

Claude will:

1. Find URL inspection search bar at top
2. Enter `https://pikeandwest.com/`
3. Press Enter and wait for results

**Step 2: Check canonical URL (Playwright)**

Claude will:

1. Look for "Google-selected canonical" field in results
2. Report the current canonical URL
3. Expected: `https://pikeandwest.com/` (may take a few days to update)

**Step 3: Request indexing (Playwright guided)**

Claude will click "Request Indexing" button to speed up canonical recognition.

**Step 4: Repeat for key pages (Playwright)**

Claude will repeat Steps 1-3 for:

- `https://pikeandwest.com/contact/`
- `https://pikeandwest.com/about/`

Note: URL Inspection API exists but doesn't support requesting indexing programmatically.

---

### Task 13: Set Up Monitoring Dashboard

**Files:**

- Create: `docs/infrastructure/canonical-migration-monitoring.md`

**Step 1: Create monitoring checklist**

````markdown
# Canonical Domain Migration - Monitoring Log

> Track migration health for 30 days post-cutover.

## Cutover Date: [INSERT DATE]

## Daily Checks (First Week)

| Date  | GSC Coverage | Organic Traffic | Issues |
|-------|--------------|-----------------|--------|
| Day 1 |              |                 |        |
| Day 2 |              |                 |        |
| Day 3 |              |                 |        |
| Day 4 |              |                 |        |
| Day 5 |              |                 |        |
| Day 6 |              |                 |        |
| Day 7 |              |                 |        |

## Weekly Checks (Weeks 2-4)

| Week   | Indexed Pages | Avg Position | Clicks | Issues |
|--------|---------------|--------------|--------|--------|
| Week 2 |               |              |        |        |
| Week 3 |               |              |        |        |
| Week 4 |               |              |        |        |

## Key Metrics to Watch

1. **GSC Coverage Report**
   - Indexed pages should remain stable (~7 pages)
   - "Page with redirect" count may increase temporarily

2. **Organic Traffic (GA4)**
   - Compare to previous 4 weeks
   - Minor dip (5-10%) is normal for first 1-2 weeks

3. **Keyword Rankings**
   - Track: "pike and west", "germantown event venue", "germantown wedding venue"
   - Use GSC Performance report

## Rollback Trigger

If any of these occur, consider rollback:
- [ ] Organic traffic drops >30% for 5+ consecutive days
- [ ] Indexed pages drop to 0
- [ ] Major ranking loss for brand terms

## Rollback Command

```bash
./scripts/dns-switch.sh webflow
````

````text

**Step 2: Commit**

```bash
git add docs/infrastructure/canonical-migration-monitoring.md
git commit -m "docs: add post-migration monitoring template"
````

---

### Task 14: Complete External Service Updates - PLAYWRIGHT GUIDED (where applicable)

**Files:**

- Reference: `docs/infrastructure/canonical-migration-external-updates.md`

**Step 1: Update Google Business Profile (Playwright guided)**

Claude will:

1. Navigate to `https://business.google.com`
2. Wait for user login if needed
3. Navigate to Pike & West profile
4. Find Edit → Website option
5. Guide user to change to `https://pikeandwest.com`
6. Click Save

**Step 2: Update Instagram (Manual - mobile app)**

User action required:

1. Open Instagram app
2. Edit profile
3. Update website link to `https://pikeandwest.com`

**Step 3: Update Facebook (Playwright guided)**

Claude will:

1. Navigate to `https://www.facebook.com/pikeandwest`
2. Wait for user login if needed
3. Navigate to About → Edit
4. Guide user to update website URL

**Step 4: Mark items complete in checklist**

Update `docs/infrastructure/canonical-migration-external-updates.md` with completion status.

**Step 5: Commit**

```bash
git add docs/infrastructure/canonical-migration-external-updates.md
git commit -m "docs: mark external service updates complete"
```

---

### Task 15: 30-Day Monitoring Complete

**Files:**

- Modify: `docs/infrastructure/canonical-migration-monitoring.md`
- Modify: `docs/next-steps.md`

**Step 1: Complete monitoring log**

Fill in final metrics in monitoring document.

**Step 2: Update next-steps.md**

Change Production Domain status from "Pending" to "Complete":

```markdown
| Production Domain  | Complete | pikeandwest.com (naked domain canonical) |
```

**Step 3: Add to changelog**

```markdown
| 2026-XX-XX | Canonical domain migration complete: www → naked domain |
```

**Step 4: Final commit**

```bash
git add docs/
git commit -m "docs: canonical domain migration complete - 30-day monitoring passed"
```

---

## Summary

| Phase   | Tasks               | Estimated Time |
|---------|---------------------|----------------|
| Phase 1 | Pre-migration setup | COMPLETE       |
| Phase 2 | DNS & Redirects     | 30 min         |
| Phase 3 | Content & Sitemap   | 15 min         |
| Phase 4 | External Updates    | 30 min         |
| Phase 5 | Go-Live & Monitor   | 30 days        |

## Related Documentation

- [Canonical Domain Migration Analysis](../infrastructure/canonical-domain-migration-analysis.md)
- [DNS Configuration](../infrastructure/dns-configuration.md)
- [Next Steps](../next-steps.md)
