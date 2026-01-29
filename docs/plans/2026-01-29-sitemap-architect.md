# Implementation Plan: Sitemap Architect System

**Date:** 2026-01-29
**Status:** Pending Approval
**Scope:** Documentation + Agent + GSC Integration Script

---

## Overview

Create a URL migration system for Pike & West consisting of:

1. **Documentation** - Operational reference for URL migrations on Hugo + Cloudflare Pages
2. **Agent** - `sitemap-architect` that analyzes proposed URL changes and outputs structured recommendations
3. **GSC Script** - Modular Google Search Console URL inspection script

---

## Task Breakdown

### Phase 1: Documentation

#### Task 1.1: Create URL Migration Patterns Document

**File:** `docs/architecture/patterns/url-migration-patterns.md`

**Content outline:**

```markdown
# URL Migration Patterns

Operational reference for reorganizing URLs on Hugo + Cloudflare Pages.

## Quick Reference

### Cloudflare `_redirects` File

- Location: `static/_redirects`
- Format: `source destination [status]`
- Limits: 2,000 static + 100 dynamic redirects

### Hugo Aliases (Client-Side Fallback)

- Add `aliases:` array in front matter
- Creates HTML files with meta refresh
- Use for backward compatibility, not primary redirects

## Implementation Steps

### Pre-Migration Checklist
- [ ] Export current URL list from sitemap
- [ ] Create redirect mapping (old → new)
- [ ] Identify high-value pages (internal links, indexed)
- [ ] Backup current content and config

### Creating Redirects

[Code examples for _redirects file]
[Splat patterns for bulk redirects]
[Hugo aliases syntax]

### Updating Internal Links

[Grep commands to find references]
[Content file update workflow]

### Post-Migration Verification

[curl commands to test redirects]
[Search Console submission steps]
[Monitoring checklist]

## Timeline Recommendations

- Keep redirects active: minimum 1 year
- High-value pages: consider permanent redirects
- Monitor rankings: weekly for first month

## Common Pitfalls

- Redirect chains (A → B → C)
- Redirect loops
- Losing query parameters
- Forgetting embedded content URLs
- Not updating internal links
```

**Acceptance criteria:**

- Actionable, not theoretical
- Includes copy-paste code snippets
- References project-specific paths (`static/_redirects`)

---

### Phase 2: Sitemap Architect Agent

#### Task 2.1: Create Agent Definition File

**File:** `.claude/agents/sitemap-architect.md`

**Frontmatter:**

```yaml
---
name: sitemap-architect
description: >
  Use when reorganizing site URL structure. Triggers: "move page from X to Y",
  "change URL structure", "reorganize site structure", "rename section",
  "migrate URLs", "consolidate pages", "restructure blog", "change slug".
  Analyzes current structure, identifies affected files, assesses risk,
  and outputs structured recommendations for parent planning agent.
model: claude-sonnet-4-20250514
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---
```

**Agent responsibilities:**

1. **Parse intended changes** from natural language description
2. **Crawl current site structure:**
   - Content files (`content/**/*.md`) - extract slugs, URLs, aliases from front matter
   - Internal links across all content and templates
   - Existing `_redirects` file
   - Current `sitemap.xml` (if built)
   - Hardcoded URLs in JS/CSS (`assets/js/`, `assets/scss/`)
   - Shortcodes containing URL references
3. **Check Google Search Console** (if configured):
   - Index status of affected URLs
   - Last crawl dates
4. **Assess risk levels:**
   - **High**: 5+ internal links, indexed in GSC, page older than 6 months
   - **Medium**: 2-4 internal links, in sitemap
   - **Low**: 0-1 internal links, new or unlisted page
5. **Generate structured output** (YAML format for machine consumption + human summary)

**Output schema:**

```yaml
summary: |
  Human-readable overview of the migration scope and key considerations.

proposed_changes:
  - old_url: "/blog/old-post/"
    new_url: "/articles/old-post/"
    risk: high
    reasons:
      - "12 internal links reference this URL"
      - "Indexed in GSC, last crawl 2025-12-15"
      - "Page created 8 months ago (git history)"
    content_file: "content/blog/old-post/index.md"

redirects_needed:
  - source: "/blog/old-post/"
    destination: "/articles/old-post/"
    status: 301
    pattern_type: static  # or "splat" for wildcards

internal_links_to_update:
  - file: "content/about.md"
    line: 42
    current: "/blog/old-post/"
    replacement: "/articles/old-post/"
    context: "[Read our story](/blog/old-post/)"

hardcoded_urls:
  - file: "assets/js/main.js"
    line: 15
    url: "/blog/old-post/"
    context: "const blogUrl = '/blog/old-post/';"

shortcode_references:
  - file: "content/services.md"
    line: 88
    shortcode: "related-posts"
    contains_url: "/blog/old-post/"

gsc_status:  # Only if GSC configured
  - url: "/blog/old-post/"
    indexed: true
    last_crawl: "2025-12-15"
    verdict: "URL is on Google"

checklist:
  - "Update 12 internal links before deployment"
  - "Add 1 redirect to static/_redirects"
  - "Submit updated sitemap to Google Search Console"
  - "Keep redirect active for minimum 1 year"
  - "Monitor Search Console for crawl errors (weekly for 4 weeks)"

warnings:
  - severity: high
    message: "Page /blog/old-post/ has significant internal linking"
  - severity: medium
    message: "Consider 301 redirect chain prevention for future moves"
```

**Acceptance criteria:**

- Agent returns structured data (parseable by parent agent)
- Also includes human-readable summary
- Risk assessment based on measurable signals
- Checklist is actionable and specific

---

#### Task 2.2: Implement Site Crawl Logic

The agent should execute these analysis steps:

**Step 1: Parse front matter from all content files**

```bash
# Find all content files
glob "content/**/*.md"

# For each file, extract:
# - url (if set)
# - slug (if set)
# - aliases (array)
# - Calculate effective URL from file path if not explicit
```

**Step 2: Find internal links**

```bash
# Markdown links to the target URL
grep -rn '\[.*\](/old-path' content/

# HTML href attributes
grep -rn 'href="/old-path' layouts/

# Shortcode references
grep -rn 'old-path' layouts/shortcodes/
```

**Step 3: Check JS/CSS for hardcoded URLs**

```bash
grep -rn '/old-path' assets/js/
grep -rn '/old-path' assets/scss/
```

**Step 4: Check existing redirects**

```bash
grep '/old-path' static/_redirects
```

**Step 5: Check sitemap (if built)**

```bash
# Build site first if needed
hugo --quiet
grep '/old-path' public/sitemap.xml
```

**Step 6: Git history for page age**

```bash
git log --follow --format="%ai" --diff-filter=A -- content/old-path/index.md | tail -1
```

---

### Phase 3: GSC Integration Script

#### Task 3.1: Create GSC URL Inspection Script

**Directory:** `scripts/gsc/`

**Files to create:**

1. `scripts/gsc/check-url.sh` - Check single URL
2. `scripts/gsc/bulk-check.sh` - Check multiple URLs from file
3. `scripts/gsc/README.md` - Setup and usage instructions

**Authentication method:** Google Cloud default credentials

```bash
# One-time setup (documented in README)
gcloud auth application-default login
```

**check-url.sh implementation:**

```bash
#!/usr/bin/env bash
# Check URL index status via Google Search Console API
# Usage: ./check-url.sh "https://pikeandwest.com/some-page/"

set -euo pipefail

URL="${1:?Usage: $0 <url>}"
SITE_URL="sc-domain:pikeandwest.com"

# Requires: gcloud CLI with application-default credentials
ACCESS_TOKEN=$(gcloud auth application-default print-access-token)

curl -s -X POST \
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"inspectionUrl\": \"$URL\",
    \"siteUrl\": \"$SITE_URL\"
  }" | jq '{
    url: .inspectionResult.indexStatusResult.inspectedUrl,
    verdict: .inspectionResult.indexStatusResult.verdict,
    coverageState: .inspectionResult.indexStatusResult.coverageState,
    lastCrawlTime: .inspectionResult.indexStatusResult.lastCrawlTime,
    robotsTxtState: .inspectionResult.indexStatusResult.robotsTxtState,
    indexingState: .inspectionResult.indexStatusResult.indexingState
  }'
```

**bulk-check.sh implementation:**

```bash
#!/usr/bin/env bash
# Bulk check URLs from a file (one URL per line)
# Usage: ./bulk-check.sh urls.txt > results.jsonl

set -euo pipefail

INPUT_FILE="${1:?Usage: $0 <urls-file>}"

while IFS= read -r url; do
  [[ -z "$url" || "$url" =~ ^# ]] && continue
  ./check-url.sh "$url"
  sleep 0.1  # Rate limiting
done < "$INPUT_FILE"
```

**README.md content:**

````markdown
# Google Search Console URL Inspection

Scripts to check URL index status via the GSC API.

## Prerequisites

1. Google Cloud project with Search Console API enabled
2. Site verified in Google Search Console
3. gcloud CLI installed

## Setup

### One-time authentication:

```bash
gcloud auth application-default login
````

This opens a browser for Google OAuth. Select the account that owns the Search Console property.

### Verify access

```bash
./check-url.sh "https://pikeandwest.com/"
```

## Usage

### Single URL

```bash
./check-url.sh "https://pikeandwest.com/blog/some-post/"
```

### Multiple URLs

```bash
# Create a file with URLs (one per line)
echo "https://pikeandwest.com/contact/" > urls.txt
echo "https://pikeandwest.com/gallery/" >> urls.txt

# Run bulk check
./bulk-check.sh urls.txt
```

## Output Format

```json
{
  "url": "https://pikeandwest.com/contact/",
  "verdict": "PASS",
  "coverageState": "Submitted and indexed",
  "lastCrawlTime": "2025-12-15T10:30:00Z",
  "robotsTxtState": "ALLOWED",
  "indexingState": "INDEXING_ALLOWED"
}
```

## Rate Limits

- 2,000 requests/day per property
- 600 requests/minute

## Troubleshooting

### "Request had insufficient authentication scopes"

Re-run `gcloud auth application-default login` and ensure you grant access to Search Console.

### "User does not have sufficient permission"

Verify you have owner or full access to the Search Console property.

````text

**Acceptance criteria:**
- Scripts are executable and tested
- README covers setup completely
- Output is JSON for easy parsing
- Rate limiting built in

---

### Phase 4: CLAUDE.md Updates

#### Task 4.1: Add Sitemap Architect Agent Reference

Add to the "Mandatory Content Agent Delegation" table:

```markdown
| URL changes proposed       | `sitemap-architect`      | Move, rename, restructure, consolidate |
````

Add new section after "Sveltia Schema Manager Agent":

```markdown
### Sitemap Architect Agent

**The sitemap-architect agent analyzes URL changes before implementation.** It is automatically triggered when discussing URL reorganization.

Located at `.claude/agents/sitemap-architect.md`, the agent:

- Parses intended URL changes from natural language
- Crawls current site structure (content, links, redirects, JS/CSS)
- Checks Google Search Console index status (if configured)
- Assesses risk levels based on internal links, indexing, and page age
- Outputs structured recommendations for the planning agent

**Trigger phrases:**
- "move page from X to Y"
- "change URL structure"
- "reorganize site structure"
- "rename this section"
- "migrate URLs"
- "consolidate pages"

**Output:** Structured YAML with redirect mappings, internal links to update, risk assessments, and actionable checklist.

**Does NOT:** Create the final implementation plan or execute changes. Feeds into the planning workflow.

**Related:** [URL Migration Patterns](docs/architecture/patterns/url-migration-patterns.md)
```

#### Task 4.2: Add Implementation Patterns Reference

Update the "See also" line in Implementation Patterns section:

```markdown
See also: [Animation Patterns](docs/architecture/patterns/animation-patterns.md) | [SCSS Organization](docs/architecture/patterns/scss-organization.md) | [URL Migration](docs/architecture/patterns/url-migration-patterns.md)
```

#### Task 4.3: Add GSC Scripts Reference

Add to Commands Reference section:

```markdown
# Google Search Console URL Inspection
scripts/gsc/check-url.sh "https://pikeandwest.com/page/"  # Check single URL
scripts/gsc/bulk-check.sh urls.txt                         # Bulk check
```

---

## File Summary

| File                                                   | Action | Purpose                         |
|--------------------------------------------------------|--------|---------------------------------|
| `docs/architecture/patterns/url-migration-patterns.md` | Create | Operational reference           |
| `.claude/agents/sitemap-architect.md`                  | Create | Agent definition                |
| `scripts/gsc/check-url.sh`                             | Create | Single URL inspection           |
| `scripts/gsc/bulk-check.sh`                            | Create | Bulk URL inspection             |
| `scripts/gsc/README.md`                                | Create | Setup documentation             |
| `CLAUDE.md`                                            | Edit   | Add agent + patterns references |

---

## Verification

After implementation:

1. **Test agent trigger:** Say "I want to move /blog/ to /articles/" and verify agent activates
2. **Test GSC scripts:** Run `./check-url.sh` against a known indexed page
3. **Verify documentation:** Ensure patterns doc has all copy-paste snippets
4. **Build site:** `hugo` to ensure no syntax errors introduced

---

## Dependencies

- `gcloud` CLI installed (for GSC scripts)
- Google Cloud project with Search Console API enabled
- Site verified in Google Search Console

---

## Notes

- The agent is a **consultant**, not an implementer - it feeds into the planning workflow
- GSC integration is optional but recommended - agent works without it using other signals
- Risk assessment uses measurable signals: internal link count, git history, sitemap presence
