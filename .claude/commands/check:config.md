---
allowed-tools:
  - Read
  - Glob
  - Grep
  - Task
  - Bash
---

# /check:config Command

Full health check of the Sveltia CMS configuration against the Hugo site.

## Purpose

Audit `static/admin/config.yml` to verify every collection, field, and schema
aligns with what Hugo templates expect, what content files contain, and what
SEO standards require. Reports gaps with severity levels and remediation steps.

## Workflow

### Phase 1: Verify Config Exists

Read `static/admin/config.yml`. If it doesn't exist:

```text
CRITICAL: No Sveltia CMS configuration found.

Expected: static/admin/config.yml
Action: Run /site:schema for each collection to bootstrap the config.

Collections to configure:
  - blog (folder: content/blog/*/index.md -- page bundles)
  - events (folder: content/events/)
  - pages (file: contact, about, workshops, privacy, accessibility, gallery-application, homepage)
  - singletons (site_settings, hero, events, about, cta_banner, venue_gallery, workshops, blog_taxonomy, error404)
  - menus (developer-managed: config/_default/menus.toml -- not in CMS)
```

Stop here if config doesn't exist.

### Phase 2: Delegate Full Analysis to Agent

Use the Task tool to launch the `sveltia-schema-manager` agent in **audit mode**
(no collection argument):

```text
Run a full audit of the Sveltia CMS configuration for Pike & West.

Analyze ALL expected collections:
1. Blog (content/blog/*/index.md -- page bundles)
2. Events (content/events/)
3. Static pages (contact, about, workshops, privacy, accessibility, gallery-application, homepage)
4. Singletons (site_settings, hero, events, about, cta_banner, venue_gallery, workshops, blog_taxonomy, error404)
5. Menus (config/_default/menus.toml -- developer-managed, not in CMS)

For each collection:
- Compare template field requirements against Sveltia schema definitions
- Check SEO field completeness
- Verify image/alt text pairing
- Check widget type appropriateness

Also check:
- Menus are developer-managed (not in CMS) -- verify no content files use front matter menu: entries
- No orphaned collections (defined in Sveltia but no matching content/template)
- All data files have corresponding singleton definitions
- site_settings singleton covers contact/social data (migrated from params.toml)

Return the full gap analysis for every collection plus an overall summary.
```

### Phase 3: Supplemental Checks (Run in Parallel)

While the agent analyzes schemas, run these checks directly:

#### Check 1: Archetype Alignment

For each folder collection (blog, events):

1. Read the archetype file (`archetypes/<name>.md`)
2. Read the Sveltia schema fields for that collection
3. Compare front matter fields in archetype vs schema fields
4. Report mismatches

#### Check 2: Admin Page Exists

Verify `static/admin/index.html` exists and loads Sveltia CMS:

```bash
test -f static/admin/index.html && echo "EXISTS" || echo "MISSING"
```

If missing, flag as ERROR with remediation to create the admin entry point.

#### Check 3: Backend Configuration

Read the `backend:` section of config.yml and verify:

- `name` is set (github, gitlab, etc.)
- `repo` matches the actual repository
- `branch` matches the primary branch

### Phase 4: Compile Report

Combine agent results and supplemental checks into a single report:

```text
# Sveltia CMS Audit Report

## Overall Health: [HEALTHY | NEEDS ATTENTION | CRITICAL]

### Summary
- Collections defined: X / Y expected
- Total errors: X
- Total warnings: Y
- Total info: Z

---

## Collection: blog
[Gap analysis from agent]

## Collection: events
[Gap analysis from agent]

## Collection: pages (static)
[Gap analysis from agent]

## Singletons: data files
[Gap analysis from agent]

## Menus (developer-managed)
[Status check from agent]

---

## Supplemental Checks

### Archetype Alignment
- blog: [PASS/FAIL] -- [details]
- events: [PASS/FAIL] -- [details]

### Admin Entry Point
- static/admin/index.html: [EXISTS/MISSING]

### Backend Configuration
- [PASS/FAIL] -- [details]

---

## Recommended Actions (Priority Order)

1. [Highest severity items first]
2. ...
```

### Overall Health Thresholds

| Status          | Criteria                              |
|-----------------|---------------------------------------|
| HEALTHY         | 0 errors, any number of warnings/info |
| NEEDS ATTENTION | 1-5 errors                            |
| CRITICAL        | 6+ errors or missing config file      |

## Notes

- This command audits configuration only -- it does NOT check content quality
  (use `/check:seo` for content checks or `/check:editorial` for editorial quality)
- The `sveltia-schema-manager` agent does the template analysis work
- Run this after making template changes, adding new content types, or updating
  Hugo versions to catch schema drift

## Related Commands

- `/check:seo` -- Check content-level SEO and link health
- `/check:editorial` -- Audit editorial quality and brand voice
- `/check:all` -- Run all three checks and produce a unified dashboard
- `/site:schema` -- Generate/update schema for a specific collection
