---
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
argument: optional file path (e.g., "content/blog/" or "content/events/weddings.md"). Defaults to all content.
---

# /check:seo Command

Content-level health check for SEO completeness, link integrity, front matter
quality, and content freshness.

## Purpose

Audit published content files for issues that editors should fix through
Sveltia CMS. Unlike `/check:config` (which checks config structure), this
command checks the actual content values in front matter and body.

## Workflow

### Phase 1: Discover Content Files

Determine scope based on argument:

- **No argument:** Scan all content (`content/blog/*/index.md`, `content/events/*.md`,
  `content/*.md`)
- **Directory path:** Scan all `.md` files in that directory
- **File path:** Check that single file

Build the file list using Glob.

### Phase 2: Check Each File

Read each content file and evaluate against these criteria:

#### SEO Completeness (per file)

| Check                 | Severity | Pass Criteria                                                      |
|-----------------------|----------|--------------------------------------------------------------------|
| Title present         | ERROR    | `title` field exists and is non-empty                              |
| Title length          | WARNING  | 50-60 characters (warn if outside range)                           |
| Description present   | ERROR    | `description` field exists and is non-empty                        |
| Description length    | WARNING  | 150-160 characters (warn if outside range)                         |
| Description is unique | WARNING  | Not duplicated across pages (compare against other files in scope) |
| Image present         | WARNING  | `image` field exists (blog and events only)                        |
| Image alt text        | ERROR    | `image_alt` exists when `image` is set                             |
| OG image present      | INFO     | `og_image` field exists (static pages)                             |
| Keywords present      | WARNING  | `keywords` array has 3-5 items (blog and events)                   |
| Schema type present   | INFO     | `schema_type` or `schema.type` is set                              |

#### Front Matter Integrity (per file)

| Check                     | Severity | Pass Criteria                                                                                                      |
|---------------------------|----------|--------------------------------------------------------------------------------------------------------------------|
| Required fields populated | ERROR    | `title`, `description` are non-empty                                                                               |
| No placeholder values     | WARNING  | No "TODO", "FIXME", "TBD", "Lorem ipsum", "example" in field values                                                |
| Date is valid             | ERROR    | `date` field parses as a valid date                                                                                |
| Draft status              | INFO     | `draft: true` files are flagged (not published)                                                                    |
| Categories valid          | WARNING  | Blog categories match known set (News, Weddings, Corporate Events, Planning Tips, Behind the Scenes, Baby Showers) |
| Event type valid          | WARNING  | Event `eventType` matches known set (wedding, corporate, birthday, baby-shower, private-party, dance)              |

#### Broken Internal Links (per file)

Scan the markdown body for internal links and validate:

1. Extract all links matching `](/path/` or `]({{< ref "..." >}})`
2. For each link path, check if a corresponding content file exists:
   - `/contact/` -> `content/contact.md`
   - `/blog/post-slug/` -> `content/blog/post-slug/index.md`
   - `/events/weddings/` -> `content/events/weddings.md`
3. Flag broken links as ERROR

#### Stale Content (per file)

| Check                    | Severity | Pass Criteria                                                                     |
|--------------------------|----------|-----------------------------------------------------------------------------------|
| Blog freshness           | WARNING  | `date` or `lastmod` within 12 months                                              |
| Event page freshness     | INFO     | Event pages checked for outdated date references in body                          |
| Outdated year references | WARNING  | Body text references years before current year (2026) in a time-sensitive context |

#### Breadcrumb Chain (per file)

| Check                | Severity | Pass Criteria                                                                       |
|----------------------|----------|-------------------------------------------------------------------------------------|
| Section index exists | WARNING  | For files in sections (blog, events), verify `_index.md` exists in parent directory |
| Page has title       | ERROR    | Title exists (used as breadcrumb label)                                             |

#### Image Health (per file)

| Check                 | Severity | Pass Criteria                                                                                                     |
|-----------------------|----------|-------------------------------------------------------------------------------------------------------------------|
| Featured image exists | WARNING  | If `image` is set, verify the file exists at the specified path (check page bundle, then `static/` and `assets/`) |
| Alt text quality      | INFO     | Alt text is longer than 10 characters and doesn't just say "image" or "photo"                                     |
| OG image exists       | WARNING  | If `og_image` is set, verify the file exists                                                                      |

#### Taxonomy Health (blog files only)

| Check              | Severity | Pass Criteria                                      |
|--------------------|----------|----------------------------------------------------|
| Categories defined | WARNING  | `categories` array is non-empty                    |
| Tags defined       | INFO     | `tags` array is non-empty                          |
| Tags in taxonomy   | INFO     | Tags used are defined in `data/blog_taxonomy.yaml` |

### Phase 3: Compile Results

#### Per-Page Scorecard

For each file, produce a health score:

| Component              | Weight | Max Points |
|------------------------|--------|------------|
| SEO Completeness       | 30%    | 30         |
| Front Matter Integrity | 20%    | 20         |
| Link Health            | 20%    | 20         |
| Content Freshness      | 15%    | 15         |
| Image Health           | 10%    | 10         |
| Taxonomy Health        | 5%     | 5          |

**Scoring:**

- Each check that passes earns its proportional points
- Each ERROR deducts points from its category
- Each WARNING deducts half points
- INFO items don't affect score

**Thresholds:**

| Score  | Status          |
|--------|-----------------|
| 85-100 | Healthy         |
| 70-84  | Needs Attention |
| 50-69  | Needs Work      |
| 0-49   | Critical        |

#### Summary Report

```text
# Content Health Report

## Scope: [all content | specific path]
## Date: [current date]

### Overall Health
- Pages checked: X
- Average score: XX/100
- Errors: X | Warnings: Y | Info: Z

### Score Distribution
- Healthy (85+): X pages
- Needs Attention (70-84): X pages
- Needs Work (50-69): X pages
- Critical (<50): X pages

---

### Most Urgent Issues

1. [ERROR] page.md -- Issue description -- Fix: remediation
2. [ERROR] page.md -- Issue description -- Fix: remediation
3. ...

---

### Per-Page Results

#### content/blog/post-slug/index.md -- Score: XX/100 [Status]
- [ERROR] Missing meta description
- [WARNING] Title too long (72 chars, target 50-60)
- [INFO] No schema_type set

#### content/events/weddings.md -- Score: XX/100 [Status]
- All checks passed

...

---

### Recommendations

1. Fix all ERROR items first (these affect SEO and accessibility)
2. Address WARNING items for better search performance
3. Consider INFO items for completeness
```

### Phase 4: Cross-File Checks

After all individual files are checked, run these cross-cutting analyses:

#### Duplicate Descriptions

Compare `description` fields across all pages. Flag any exact or near-exact
duplicates as WARNING (each page should have unique meta description).

#### Orphan Pages

Check which pages have no internal links pointing to them from other pages:

1. Build a link graph: for each page, record all internal links in its body
2. Find pages with zero inbound links (excluding homepage)
3. Flag as WARNING with suggestion to add links from related pages

#### Keyword Cannibalization

For blog posts, compare `keywords` arrays:

1. Find pages targeting the same primary keyword
2. Flag as WARNING if two or more pages share their first keyword

## Notes

- This command runs standalone (no agent delegation needed)
- For config-level auditing, use `/check:config`
- For editorial quality auditing (brand voice, shortcode usage), use `/check:editorial`
- This command focuses on what editors can fix through Sveltia CMS: front matter
  fields, images, descriptions, links

## Related Commands

- `/check:config` -- Verify CMS config structure and schema alignment
- `/check:editorial` -- Audit editorial quality and brand voice
- `/check:all` -- Run all three checks and produce a unified dashboard
