# Partial Caching Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Cache 9 Hugo partials that currently regenerate unnecessarily on every page, establishing correct patterns for build performance.

**Architecture:** Hugo's `partialCached` function caches partial output keyed by context. Partials using only `site.Data.*` or `site.Params` produce identical output across all pages and should be cached. Partials using page context (`.Title`, `.Permalink`, `.Params`) vary per page and cannot be cached.

**Tech Stack:** Hugo (Go templates), `partialCached` function

---

## Task 1: Cache GTM Partials in baseof.html

**Files:**

- Modify: `layouts/_default/baseof.html:5,8`

**Step 1: Update gtm-head.html call to use partialCached**

Change line 5 from:

```go-html-template
  {{- partial "gtm-head.html" . -}}
```

To:

```go-html-template
  {{- partialCached "gtm-head.html" . -}}
```

**Step 2: Update gtm-body.html call to use partialCached**

Change line 8 from:

```go-html-template
  {{- partial "gtm-body.html" . -}}
```

To:

```go-html-template
  {{- partialCached "gtm-body.html" . -}}
```

**Step 3: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 4: Verify site renders correctly**

Run: `hugo server -D`
Expected: Site loads, GTM scripts present in page source (production env) or absent (dev env)

**Step 5: Commit**

```bash
git add layouts/_default/baseof.html
git commit -m "perf(templates): cache GTM partials

GTM head and body partials only use site.Params and hugo.IsProduction,
producing identical output on every page. Caching eliminates redundant
template execution."
```

---

## Task 2: Cache scripts.html in baseof.html

**Files:**

- Modify: `layouts/_default/baseof.html:27`

**Step 1: Update scripts.html call to use partialCached**

Change line 27 from:

```go-html-template
  {{- partial "scripts.html" . -}}
```

To:

```go-html-template
  {{- partialCached "scripts.html" . -}}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Verify JS bundle loads**

Run: `hugo server -D`
Expected: Site loads, main.js script tag present with integrity hash

**Step 4: Commit**

```bash
git add layouts/_default/baseof.html
git commit -m "perf(templates): cache scripts partial

Scripts partial only processes static JS bundle via resources.Get,
producing identical output on every page."
```

---

## Task 3: Cache cta-banner.html in baseof.html

**Files:**

- Modify: `layouts/_default/baseof.html:19`

**Step 1: Update cta-banner.html call to use partialCached**

Change line 19 from:

```go-html-template
    {{- partial "cta-banner.html" . -}}
```

To:

```go-html-template
    {{- partialCached "cta-banner.html" . -}}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Verify CTA banner renders**

Run: `hugo server -D`
Expected: CTA banner appears on homepage and other pages (except contact/404)

**Step 4: Commit**

```bash
git add layouts/_default/baseof.html
git commit -m "perf(templates): cache CTA banner partial

CTA banner only reads from site.Data.cta_banner, producing identical
output wherever it appears."
```

---

## Task 4: Cache speculation-rules.html in head.html

**Files:**

- Modify: `layouts/partials/head.html:253`

**Step 1: Update speculation-rules.html call to use partialCached**

Change line 253 from:

```go-html-template
{{- partial "speculation-rules.html" . -}}
```

To:

```go-html-template
{{- partialCached "speculation-rules.html" . -}}
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 3: Verify speculation rules in page source**

Run: `hugo server -D`
Open browser, view page source, search for `speculationrules`
Expected: JSON script block with prefetch/prerender rules present

**Step 4: Commit**

```bash
git add layouts/partials/head.html
git commit -m "perf(templates): cache speculation rules partial

Speculation rules partial outputs static JSON with no dynamic content."
```

---

## Task 5: Cache Homepage Partials in index.html

**Files:**

- Modify: `layouts/index.html`

**Step 1: Read current index.html structure**

Run: Read `layouts/index.html` to see current partial calls

**Step 2: Update hero.html call to use partialCached**

Change from:

```go-html-template
{{ partial "hero.html" . }}
```

To:

```go-html-template
{{- partialCached "hero.html" . -}}
```

**Step 3: Update venue-gallery.html call to use partialCached**

Change from:

```go-html-template
{{ partial "venue-gallery.html" . }}
```

To:

```go-html-template
{{- partialCached "venue-gallery.html" . -}}
```

**Step 4: Update event-types.html call to use partialCached**

Change from:

```go-html-template
{{ partial "event-types.html" . }}
```

To:

```go-html-template
{{- partialCached "event-types.html" . -}}
```

**Step 5: Update about.html call to use partialCached**

Change from:

```go-html-template
{{ partial "about.html" . }}
```

To:

```go-html-template
{{- partialCached "about.html" . -}}
```

**Step 6: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 7: Verify homepage renders correctly**

Run: `hugo server -D`
Expected: Homepage loads with hero, gallery, event types, and about sections all rendering correctly

**Step 8: Commit**

```bash
git add layouts/index.html
git commit -m "perf(templates): cache homepage section partials

Hero, venue gallery, event types, and about partials all read exclusively
from site.Data files with no page context, producing identical output."
```

---

## Task 6: Add Cache Comments for Documentation

**Files:**

- Modify: `layouts/_default/baseof.html`
- Modify: `layouts/index.html`
- Modify: `layouts/partials/head.html`

**Step 1: Add comments explaining caching strategy in baseof.html**

After line 4 (before gtm-head), add comment:

```go-html-template
  {{- /* GTM partials cached - only use site.Params, identical on all pages */ -}}
```

Update the existing header comment (line 9) to include GTM:

```go-html-template
  {{- /* Header cached - uses site.Menus, identical on all pages */ -}}
```

After line 18 (cta-banner conditional), update to:

```go-html-template
  {{- if and (not $isContactPage) (not $is404Page) -}}
    {{- /* CTA banner cached - only uses site.Data.cta_banner */ -}}
    {{- partialCached "cta-banner.html" . -}}
  {{- end -}}
```

Before scripts.html call, add:

```go-html-template
  {{- /* Scripts cached - static JS bundle, identical on all pages */ -}}
```

**Step 2: Add comments in index.html**

Add comment before homepage partials:

```go-html-template
{{- /* All homepage partials cached - they read only from site.Data files */ -}}
```

**Step 3: Add comment in head.html**

Before speculation-rules.html call (line 253), add:

```go-html-template
{{/* Speculation rules cached - static JSON, no dynamic content */}}
```

**Step 4: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes without errors

**Step 5: Commit**

```bash
git add layouts/_default/baseof.html layouts/index.html layouts/partials/head.html
git commit -m "docs(templates): add caching strategy comments

Document why each partial is or isn't cached to guide future development."
```

---

## Task 7: Update Architecture Documentation

**Files:**

- Modify: `docs/architecture/partials-reference.md`

**Step 1: Update the Quick Reference table**

Update the "Cached" column for the newly cached partials:

- gtm-head.html: No → **Yes**
- gtm-body.html: No → **Yes**
- scripts.html: No → **Yes**
- speculation-rules.html: No → **Yes**
- hero.html: No → **Yes**
- venue-gallery.html: No → **Yes**
- about.html: No → **Yes**
- event-types.html: No → **Yes**
- cta-banner.html: No → **Yes**

**Step 2: Update the Caching Strategy section**

Replace the existing "Caching Strategy" section with:

```markdown
## Caching Strategy

Twelve partials use `partialCached` for performance:

| Partial                    | Cache Key  | Reason                            |
|----------------------------|------------|-----------------------------------|
| header.html                | Site-level | Uses site.Menus only              |
| footer.html                | Site-level | Uses site.Data + menus            |
| schema-local-business.html | Site-level | Uses site.Data only               |
| gtm-head.html              | Site-level | Uses site.Params only             |
| gtm-body.html              | Site-level | Uses site.Params only             |
| scripts.html               | Site-level | Static JS bundle                  |
| speculation-rules.html     | Site-level | Static JSON                       |
| hero.html                  | Site-level | Uses site.Data.hero only          |
| venue-gallery.html         | Site-level | Uses site.Data.venue_gallery only |
| about.html                 | Site-level | Uses site.Data.about only         |
| event-types.html           | Site-level | Uses site.Data.events only        |
| cta-banner.html            | Site-level | Uses site.Data.cta_banner only    |

**Not cached (page-specific content):**
- head.html - Title, description, permalink, params, paginator
- structured-data.html - Page-specific schema (BlogPosting, BreadcrumbList)
- breadcrumb.html - Page hierarchy
- breadcrumb-schema.html - Page-specific breadcrumb JSON-LD
- pagination.html - Paginator state
- responsive-image.html - Parameterized utility
- contact-form-shimmer.html - Only used on one page
```

**Step 3: Update the "Last Updated" date**

Change to: `**Last Updated:** 2026-01-29`

**Step 4: Commit**

```bash
git add docs/architecture/partials-reference.md
git commit -m "docs: update partials reference with caching changes

Reflect the 9 newly cached partials in documentation."
```

---

## Task 8: Final Verification

**Step 1: Full production build**

Run: `hugo --gc --minify`
Expected: Build completes successfully

**Step 2: Run development server and test all pages**

Run: `hugo server -D`

Test these pages:

- Homepage (`/`) - All sections render
- Contact (`/contact/`) - No CTA banner, form loads
- Blog list (`/blog/`) - Pagination works
- Blog post (any) - Structured data present
- 404 (any invalid URL) - Error page renders

**Step 3: Verify no regressions in page source**

For each page, view source and verify:

- GTM scripts present (or absent in dev)
- Speculation rules JSON present
- Scripts tag with integrity hash
- Appropriate structured data

**Step 4: Commit verification notes (optional)**

If any issues were found and fixed during verification, commit those fixes.

---

## Summary

**Total changes:**

- 4 files modified
- 9 partials now cached
- 0 new files created

**Expected impact:**

- Reduced template execution during builds
- Correct caching patterns established for future development
- Documentation updated for maintainability
