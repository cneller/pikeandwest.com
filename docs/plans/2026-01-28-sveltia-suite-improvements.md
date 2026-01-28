# Sveltia Suite Improvements

> Improvements to the Sveltia CMS maintenance suite: command renaming, skill enhancements, and new `/check:all` command.

**Date:** 2026-01-28
**Status:** Approved design, ready for implementation
**Depends on:** [2026-01-27-sveltia-cms-maintenance-suite.md](2026-01-27-sveltia-cms-maintenance-suite.md)

---

## Overview

Two categories of changes:

1. **Command renaming** -- All 13 project commands get renamed to a consistent `category:action` scheme
2. **Skill and command enhancements** -- New content for the skill, new `/check:all` command, cross-references between commands

---

## Part 1: Command Renaming

### New Naming Convention

All commands use `category:action` format with colon separator.

**Categories:**

| Category   | Purpose                                | Count |
|------------|----------------------------------------|-------|
| `content:` | Creating and planning content          | 5     |
| `check:`   | Verifying quality, health, correctness | 4     |
| `site:`    | Site and CMS configuration             | 1     |
| `market:`  | Marketing and distribution             | 1     |
| `migrate:` | Webflow migration work                 | 3     |

### Full Rename Mapping

| Current File          | New File             | Old Command         | New Command        |
|-----------------------|----------------------|---------------------|--------------------|
| `blog-draft.md`       | `content:draft.md`   | `/blog-draft`       | `/content:draft`   |
| `blog-outline.md`     | `content:outline.md` | `/blog-outline`     | `/content:outline` |
| `content-queue.md`    | `content:queue.md`   | `/content-queue`    | `/content:queue`   |
| `persona.md`          | `content:persona.md` | `/persona`          | `/content:persona` |
| `social-from-blog.md` | `content:social.md`  | `/social-from-blog` | `/content:social`  |
| `content-audit.md`    | `check:editorial.md` | `/content-audit`    | `/check:editorial` |
| `sveltia-audit.md`    | `check:config.md`    | `/sveltia-audit`    | `/check:config`    |
| `sveltia-health.md`   | `check:seo.md`       | `/sveltia-health`   | `/check:seo`       |
| _(new)_               | `check:all.md`       | _(new)_             | `/check:all`       |
| `sveltia-schema.md`   | `site:schema.md`     | `/sveltia-schema`   | `/site:schema`     |
| `utm-link.md`         | `market:utm.md`      | `/utm-link`         | `/market:utm`      |
| `compare-section.md`  | `migrate:compare.md` | `/compare-section`  | `/migrate:compare` |
| `update-mapping.md`   | `migrate:mapping.md` | `/update-mapping`   | `/migrate:mapping` |
| `visual-diff.md`      | `migrate:diff.md`    | `/visual-diff`      | `/migrate:diff`    |

### Implementation Steps

For each command:

1. Create new file with new name in `.claude/commands/`
2. Copy content from old file
3. Update any internal cross-references to other commands (use new names)
4. Delete old file

After all renames:

5. Update `CLAUDE.md` command reference tables
6. Update `docs/plans/2026-01-27-sveltia-cms-maintenance-suite.md` references
7. Update blog-editor agent (references `/blog-draft` and `/content-audit`)
8. Update content-auditor agent (if it references commands)
9. Update any other files that reference old command names

### Files to Update for Cross-References

Search for old command names in:

- `CLAUDE.md` -- command tables, blog editor section
- `.claude/agents/blog-editor.md` -- references `/blog-draft`, `/content-audit`
- `.claude/agents/content-auditor.md` -- may reference `/content-audit`
- `.claude/commands/sveltia-audit.md` (now `check:config.md`) -- references `/sveltia-health`, `/content-audit`
- `.claude/commands/sveltia-health.md` (now `check:seo.md`) -- references `/sveltia-audit`, `/content-audit`
- `.claude/commands/sveltia-schema.md` (now `site:schema.md`) -- references `/sveltia-audit`
- `.claude/commands/blog-draft.md` (now `content:draft.md`) -- may reference blog-editor agent
- `.claude/skills/sveltia-hugo-maintenance/SKILL.md` -- references commands
- `.claude/skills/content-editing/SKILL.md` -- may reference commands

---

## Part 2: Skill Enhancements

### Enhancement 1: Setup & Bootstrap Section

Add to SKILL.md after the intro, before Domain 1.

**Content to add:**

```markdown
## Setup & Bootstrap

### Admin Entry Point

Create `static/admin/index.html`:

    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Pike & West CMS</title>
      <link rel="stylesheet" href="https://unpkg.com/sveltia-cms/dist/sveltia-cms.css" />
    </head>
    <body>
      <script src="https://unpkg.com/sveltia-cms/dist/sveltia-cms.js"></script>
    </body>
    </html>

### Backend Configuration

    backend:
      name: github
      repo: cneller/pikeandwest.com
      branch: main

### Local Development

Sveltia CMS supports the File System Access API for local editing without a
proxy server. Open `/admin/` in Chrome/Edge (not Firefox/Safari) and grant
file system access when prompted. Changes write directly to your local repo.

### Authentication

For production: Configure GitHub OAuth app or use Sveltia's
built-in authenticator (Cloudflare Workers-based).
```

### Enhancement 2: Sveltia-Specific Features Section

Add to SKILL.md after Domain 6, before Best Practices.

**Content to add:**

```markdown
## Sveltia-Specific Features

### Singletons

Data files use the `singletons` top-level key (Sveltia-specific, not in
Decap CMS). This gives data files their own sidebar section, separate from
content collections.

### Pattern Validation

Enforce field constraints at the CMS level:

    - label: Title
      name: title
      widget: string
      pattern: ['^.{10,60}$', "Title must be 10-60 characters"]

    - label: Meta Description
      name: description
      widget: text
      pattern: ['^.{100,160}$', "Description must be 100-160 characters"]

### Preview Styling

Add Pike & West brand fonts to CMS preview in static/admin/index.html.
Include Typekit (Le Mores Collection) and Google Fonts (Montserrat, Oswald)
in the admin page head, plus custom preview CSS matching site styles.

### Stock Photo Integration

    media_library:
      name: pexels   # or unsplash
      config:
        api_key: <key>
```

### Enhancement 3: Common Task Workflows Section

Add to SKILL.md after Best Practices.

**5 workflow checklists:**

1. **Adding a New Field to an Existing Collection**
   - Determine widget type (Domain 2)
   - Add to Sveltia config (correct field group position)
   - Add pattern validation if SEO field
   - Update Hugo archetype to match
   - Update Hugo template if field needs rendering
   - Run `/check:config` to verify

2. **Creating a New Content Type**
   - Create content directory
   - Create Hugo template
   - Create Hugo archetype
   - Run `/site:schema <name>` to generate CMS schema
   - Add SEO field block
   - Add to navigation if needed (menus.toml)
   - Run `/check:config` to verify

3. **Adding a New Data File (Singleton)**
   - Create data YAML file with structure
   - Add singleton definition to config.yml
   - Create or update Hugo template to reference `site.Data.<name>`
   - Run `/check:config` to verify

4. **Changing Navigation Structure**
   - Edit `config/_default/menus.toml`
   - Follow CTA language system (Domain 4)
   - Verify breadcrumb chain integrity
   - Do NOT use front matter menu entries

5. **Updating SEO Requirements Across All Collections**
   - Update SEO field definitions in skill (Domain 3)
   - Run `/check:config` to identify collections missing new fields
   - Run `/site:schema` for each collection needing updates
   - Update archetypes to match
   - Run `/check:seo` to verify content compliance

---

## Part 3: New Command `/check:all`

### File: `.claude/commands/check:all.md`

**Purpose:** Unified dashboard that orchestrates all three check commands and
produces a single summary.

**Workflow:**

1. Run `/check:config` (CMS config health)
2. Run `/check:seo` (content SEO/links/freshness)
3. Run `/check:editorial` (brand voice/shortcodes/styling)
4. Compile results into a single dashboard

**Output format:**

```text
# Site Health Dashboard

## Overall Grade: [A/B/C/D/F]

### Config Health (check:config)
- Status: [HEALTHY | NEEDS ATTENTION | CRITICAL]
- Collections: X/Y defined
- Errors: X | Warnings: Y

### Content SEO (check:seo)
- Average score: XX/100
- Pages checked: X
- Errors: X | Warnings: Y

### Editorial Quality (check:editorial)
- Average score: XX/100
- Posts audited: X
- Issues: X high | Y medium | Z low

---

### Top 5 Issues Across All Checks
1. [source] issue description — fix
2. ...

### Run Individual Reports
- `/check:config` for full CMS config details
- `/check:seo` for per-page SEO scorecards
- `/check:editorial` for editorial styling analysis
```

**Implementation:** Use Task tool to run all three checks in parallel, then
aggregate results.

---

## Part 4: Cross-References

Add a "Related Commands" section to the bottom of each check command:

### In `/check:editorial`

```text
## Related Commands
- `/check:config` -- Verify CMS schema matches Hugo templates
- `/check:seo` -- Check SEO fields, broken links, content freshness
- `/check:all` -- Run all three checks and produce a unified dashboard
```

### In `/check:config`

```text
## Related Commands
- `/check:seo` -- Check content-level SEO and link health
- `/check:editorial` -- Audit editorial quality and brand voice
- `/check:all` -- Run all three checks and produce a unified dashboard
- `/site:schema` -- Generate/update schema for a specific collection
```

### In `/check:seo`

```text
## Related Commands
- `/check:config` -- Verify CMS config structure and schema alignment
- `/check:editorial` -- Audit editorial quality and brand voice
- `/check:all` -- Run all three checks and produce a unified dashboard
```

---

## Implementation Order

1. **Rename commands** -- rename all 13 files, update all cross-references
2. **Create `/check:all`** -- new command
3. **Enhance skill** -- add Setup, Sveltia Features, and Workflows sections
4. **Add cross-references** -- update check commands with Related Commands sections
5. **Update CLAUDE.md** -- reflect all changes

Each step is a discrete commit.
