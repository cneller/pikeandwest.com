# Pre-Launch Validation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete 5 pre-launch validation tasks: SEO validation, Open Graph testing, Lighthouse audit, CI artifact retention policy, and CMS login/edit flow verification.

**Architecture:** Manual verification tasks using CLI tools, browser testing, and CI workflow updates. No code changes to site templates (they're already complete). CI workflow update adds artifact retention policy.

**Tech Stack:** Hugo, GitHub Actions, Lighthouse CLI, Playwright browser automation, Sveltia CMS

---

## Task 1: SEO Validation (Meta Tags, JSON-LD, Canonicals)

**Files:**

- Read: `layouts/partials/head.html`
- Read: `layouts/partials/structured-data.html`
- Output: `docs/validation/seo-audit-2026-01-30.md`

**Step 1: Build site and inspect meta tags for key pages**

Run:

```bash
hugo --gc --minify && cat public/index.html | grep -A1 -E '<meta name="description"|<link rel="canonical"|<meta property="og:'
```

Expected: Meta description, canonical URL pointing to `https://pikeandwest.com/`, and OG tags present.

**Step 2: Verify blog post meta tags**

Run:

```bash
cat public/blog/milestone-birthday-new-year/index.html | grep -A1 -E '<meta name="description"|<link rel="canonical"|<meta property="og:|article:published_time'
```

Expected: Page-specific description, canonical URL, OG tags with article type, and `article:published_time`.

**Step 3: Validate JSON-LD structured data with Google's Rich Results Test**

Navigate browser to: `https://search.google.com/test/rich-results?url=https://pikeandwest.com/`

Expected: Organization and EventVenue schemas detected, no errors.

**Step 4: Validate blog post JSON-LD**

Navigate browser to: `https://search.google.com/test/rich-results?url=https://pikeandwest.com/blog/milestone-birthday-new-year/`

Expected: BlogPosting schema detected, no errors.

**Step 5: Check canonical URLs point to production domain**

Run:

```bash
grep -r 'rel="canonical"' public/ | head -5 | grep -o 'href="[^"]*"'
```

Expected: All canonicals use `https://pikeandwest.com/` (not preview URLs).

**Step 6: Document results**

Create `docs/validation/seo-audit-2026-01-30.md` with findings:

- Meta tags: PASS/FAIL
- JSON-LD: PASS/FAIL
- Canonicals: PASS/FAIL
- Any issues found

**Step 7: Commit**

```bash
git add docs/validation/seo-audit-2026-01-30.md
git commit -m "docs: add SEO validation audit results"
```

---

## Task 2: Open Graph Testing (Social Share Previews)

**Files:**

- Output: `docs/validation/og-audit-2026-01-30.md`

**Step 1: Test homepage OG with Facebook Sharing Debugger**

Navigate browser to: `https://developers.facebook.com/tools/debug/?q=https://pikeandwest.com/`

Expected: Image preview loads, title shows "Pike & West | Art Gallery & Event Venue in Germantown, TN", description present.

**Step 2: Test blog post OG with Facebook Sharing Debugger**

Navigate browser to: `https://developers.facebook.com/tools/debug/?q=https://pikeandwest.com/blog/milestone-birthday-new-year/`

Expected: Featured image loads, article title and description display correctly.

**Step 3: Test with Twitter Card Validator**

Navigate browser to: `https://cards-dev.twitter.com/validator`

Enter URL: `https://pikeandwest.com/`

Expected: Large image card renders with site image and description.

**Step 4: Test with LinkedIn Post Inspector**

Navigate browser to: `https://www.linkedin.com/post-inspector/inspect/https://pikeandwest.com/`

Expected: Preview renders correctly with image and description.

**Step 5: Verify OG image dimensions**

Run:

```bash
file static/images/og-default.jpg
```

Expected: Image exists and is at least 1200x630px (recommended OG size).

**Step 6: Document results**

Create `docs/validation/og-audit-2026-01-30.md`:

- Facebook: PASS/FAIL + screenshot description
- Twitter: PASS/FAIL + screenshot description
- LinkedIn: PASS/FAIL + screenshot description
- Image dimensions: PASS/FAIL

**Step 7: Commit**

```bash
git add docs/validation/og-audit-2026-01-30.md
git commit -m "docs: add Open Graph validation audit results"
```

---

## Task 3: Lighthouse Performance Audit

**Files:**

- Read: `lighthouserc.json`
- Output: `docs/validation/lighthouse-audit-2026-01-30.md`

**Step 1: Install Lighthouse CLI if needed**

Run:

```bash
which lighthouse || npm install -g lighthouse
```

**Step 2: Run Lighthouse on homepage**

Run:

```bash
lighthouse https://pikeandwest.com/ --output=json --output-path=/tmp/lighthouse-home.json --preset=desktop --chrome-flags="--headless"
```

**Step 3: Extract scores from homepage report**

Run:

```bash
jq '{performance: .categories.performance.score, accessibility: .categories.accessibility.score, bestPractices: .categories["best-practices"].score, seo: .categories.seo.score}' /tmp/lighthouse-home.json
```

Expected: All scores >= 0.80, target >= 0.95 for performance.

**Step 4: Run Lighthouse on blog page**

Run:

```bash
lighthouse https://pikeandwest.com/blog/ --output=json --output-path=/tmp/lighthouse-blog.json --preset=desktop --chrome-flags="--headless"
```

**Step 5: Run Lighthouse on contact page**

Run:

```bash
lighthouse https://pikeandwest.com/contact/ --output=json --output-path=/tmp/lighthouse-contact.json --preset=desktop --chrome-flags="--headless"
```

**Step 6: Extract and compare all scores**

Run:

```bash
echo "=== Homepage ===" && jq '{perf: (.categories.performance.score * 100 | floor), a11y: (.categories.accessibility.score * 100 | floor), bp: (.categories["best-practices"].score * 100 | floor), seo: (.categories.seo.score * 100 | floor)}' /tmp/lighthouse-home.json
echo "=== Blog ===" && jq '{perf: (.categories.performance.score * 100 | floor), a11y: (.categories.accessibility.score * 100 | floor), bp: (.categories["best-practices"].score * 100 | floor), seo: (.categories.seo.score * 100 | floor)}' /tmp/lighthouse-blog.json
echo "=== Contact ===" && jq '{perf: (.categories.performance.score * 100 | floor), a11y: (.categories.accessibility.score * 100 | floor), bp: (.categories["best-practices"].score * 100 | floor), seo: (.categories.seo.score * 100 | floor)}' /tmp/lighthouse-contact.json
```

**Step 7: Check Core Web Vitals**

Run:

```bash
jq '{FCP: .audits["first-contentful-paint"].numericValue, LCP: .audits["largest-contentful-paint"].numericValue, CLS: .audits["cumulative-layout-shift"].numericValue, TBT: .audits["total-blocking-time"].numericValue}' /tmp/lighthouse-home.json
```

Expected: FCP < 2000ms, LCP < 3500ms, CLS < 0.15, TBT < 500ms.

**Step 8: Document results**

Create `docs/validation/lighthouse-audit-2026-01-30.md`:

```markdown
# Lighthouse Audit Results - 2026-01-30

## Summary

| Page     | Performance | Accessibility | Best Practices | SEO |
|----------|-------------|---------------|----------------|-----|
| Homepage | XX          | XX            | XX             | XX  |
| Blog     | XX          | XX            | XX             | XX  |
| Contact  | XX          | XX            | XX             | XX  |

## Core Web Vitals (Homepage)

| Metric | Value | Target  | Status    |
|--------|-------|---------|-----------|
| FCP    | XXms  | <2000ms | PASS/FAIL |
| LCP    | XXms  | <3500ms | PASS/FAIL |
| CLS    | X.XX  | <0.15   | PASS/FAIL |
| TBT    | XXms  | <500ms  | PASS/FAIL |

## Issues Found

[List any audit failures or warnings]
```

**Step 9: Commit**

```bash
git add docs/validation/lighthouse-audit-2026-01-30.md
git commit -m "docs: add Lighthouse performance audit results"
```

---

## Task 4: CI Artifact Retention Policy

**Files:**

- Modify: `.github/workflows/deploy.yml:96-101`
- Modify: `.github/workflows/lighthouse.yml:119-124`
- Modify: `.github/workflows/visual-regression.yml` (if exists)

**Step 1: Read current deploy workflow artifact config**

Run:

```bash
grep -A5 'upload-artifact' .github/workflows/deploy.yml
```

Expected: See current `retention-days` setting (currently 1 day).

**Step 2: Verify lighthouse workflow artifact config**

Run:

```bash
grep -A5 'upload-artifact' .github/workflows/lighthouse.yml
```

Expected: See current retention-days setting.

**Step 3: Check visual regression workflow**

Run:

```bash
grep -A5 'upload-artifact' .github/workflows/visual-regression.yml 2>/dev/null || echo "No visual regression artifact uploads found"
```

**Step 4: Verify deploy.yml already has retention-days: 1**

The deploy.yml already has `retention-days: 1` at line 101. Confirm this is adequate.

Run:

```bash
grep 'retention-days' .github/workflows/*.yml
```

Expected: All workflows should have `retention-days: 1` or similar short retention.

**Step 5: Add retention policy to lighthouse workflow if missing**

If lighthouse.yml line 124 doesn't have retention-days, add it:

Edit `.github/workflows/lighthouse.yml` at the upload-artifact step to ensure it has:

```yaml
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-results-${{ matrix.page.name }}
          path: results/
          retention-days: 1
```

**Step 6: Verify no other workflows need updates**

Run:

```bash
grep -l 'upload-artifact' .github/workflows/*.yml | xargs -I{} sh -c 'echo "=== {} ===" && grep -A6 "upload-artifact" {}'
```

Confirm all have appropriate retention.

**Step 7: Update next-steps.md to mark task complete**

Edit `docs/next-steps.md`, change:

```markdown
- [ ] Add artifact retention policy to CI workflows (see below)
```

to:

```markdown
- [x] Add artifact retention policy to CI workflows (see below)
```

**Step 8: Commit**

```bash
git add .github/workflows/*.yml docs/next-steps.md
git commit -m "chore(ci): verify artifact retention policy across workflows"
```

---

## Task 5: CMS Login and Edit Flow Verification

**Files:**

- Output: `docs/validation/cms-flow-audit-2026-01-30.md`

**Step 1: Navigate to CMS admin**

Open browser to: `https://pikeandwest.com/admin/`

Expected: Sveltia CMS loads without configuration errors.

**Step 2: Verify GitHub OAuth login**

Click "Login with GitHub" button.

Expected: Redirects to GitHub OAuth, then back to CMS with authenticated session.

**Step 3: Verify collections load**

After login, check sidebar shows:

- Blog Posts
- Event Pages
- Categories
- Taxonomy
- Pages
- Site Settings
- Hero Section
- etc.

Expected: All collections visible and load without errors.

**Step 4: Test editing a blog post**

1. Click "Blog Posts" collection
2. Click any existing post
3. Verify all fields load (title, description, image, tags, etc.)
4. Make a trivial change (add a space somewhere)
5. Click Save

Expected: Save completes, commits to `main` branch on GitHub.

**Step 5: Verify commit appears on GitHub**

Run:

```bash
git fetch origin main && git log origin/main --oneline -3
```

Expected: See the CMS commit from step 4.

**Step 6: Revert test change**

If a test commit was made, revert it:

```bash
git pull origin main
git revert HEAD --no-edit
git push
```

**Step 7: Test creating a draft post**

1. In CMS, click "New" in Blog Posts
2. Fill minimal required fields
3. Toggle "Draft" to ON
4. Save

Expected: Post saves as draft, doesn't appear on live site.

**Step 8: Delete test draft**

Delete the test draft post from CMS.

**Step 9: Document results**

Create `docs/validation/cms-flow-audit-2026-01-30.md`:

```markdown
# CMS Flow Audit Results - 2026-01-30

## Login Flow

- [ ] CMS loads without errors
- [ ] GitHub OAuth works
- [ ] Session persists after login

## Collections

- [ ] Blog Posts: loads, editable
- [ ] Event Pages: loads, editable
- [ ] Categories: loads (read-only expected)
- [ ] Taxonomy: loads, editable
- [ ] Pages: loads, editable
- [ ] Singletons (Site Settings, Hero, etc.): loads, editable

## Edit Flow

- [ ] Open existing post
- [ ] All fields render correctly
- [ ] Tags relation widget works
- [ ] Save commits to main branch
- [ ] Changes appear on live site after deploy

## Draft Flow

- [ ] Create draft post
- [ ] Draft doesn't appear on live site
- [ ] Delete draft works

## Issues Found

[List any issues]
```

**Step 10: Commit**

```bash
git add docs/validation/cms-flow-audit-2026-01-30.md
git commit -m "docs: add CMS login and edit flow audit results"
```

---

## Final Step: Update next-steps.md

**Step 1: Mark pre-launch tasks complete**

Edit `docs/next-steps.md` and update the Pre-Launch Checklist section:

```markdown
### SEO

- [x] Verify meta tags render correctly on all pages
- [x] Confirm Open Graph images work (test with social sharing debuggers)
- [x] Validate JSON-LD structured data
- [x] Check canonical URLs point to production domain

### Performance

- [x] Run Lighthouse audit, target score >95
```

And under Sveltia CMS:

```markdown
- [x] Test full CMS login flow on production domain
- [x] Verify content edits commit to `main` branch correctly
```

And under Infrastructure:

```markdown
- [x] Add artifact retention policy to CI workflows (see below)
```

**Step 2: Commit final updates**

```bash
git add docs/next-steps.md
git commit -m "docs: mark pre-launch validation tasks complete"
```

**Step 3: Push all changes**

```bash
git push
```
