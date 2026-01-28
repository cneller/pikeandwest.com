# Sveltia CMS Maintenance Suite

> Skill, agent, and commands for ongoing content and schema maintenance of the Pike & West Hugo site through Sveltia CMS.

**Date:** 2026-01-27
**Status:** Approved design, ready for implementation

---

## Objective

Create a full suite of Claude Code tooling (skill + agent + commands) for ongoing maintenance of the Pike & West website through Sveltia CMS. The focus is on content and schema/metadata best practices -- leveraging Sveltia's features to make the Hugo site fully editable with proper SEO enforcement, navigation management, and breadcrumb integrity.

**Assumptions:**

- Sveltia CMS is already set up and functional
- Sitepins is removed and not relevant
- The site is deployed to Cloudflare Pages with CI/CD in place
- This is Pike & West-specific, not a portable/generic skill

**Editability scope:** Content (blog, events, static pages) + page structure (navigation menus, homepage sections, data files). Not site-wide settings like colors or deployment config.

---

## Components

| Component   | Name                       | Location                                           | Purpose                                                                                                             |
|-------------|----------------------------|----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| **Skill**   | `sveltia-hugo-maintenance` | `.claude/skills/sveltia-hugo-maintenance/SKILL.md` | Auto-activating knowledge base for Sveltia + Hugo patterns, Pike & West content model, schema design, SEO standards |
| **Agent**   | `sveltia-schema-manager`   | `.claude/agents/sveltia-schema-manager.md`         | Autonomous template-to-schema analysis, gap detection, schema generation                                            |
| **Command** | `/sveltia-audit`           | `.claude/commands/sveltia-audit.md`                | Config health check -- Sveltia config vs Hugo templates/content                                                     |
| **Command** | `/sveltia-schema`          | `.claude/commands/sveltia-schema.md`               | Generate or update schema for a specific collection                                                                 |
| **Command** | `/sveltia-health`          | `.claude/commands/sveltia-health.md`               | Content-level health check -- SEO, links, freshness, front matter                                                   |

---

## Interaction Model

```text
User action                    What activates              What happens
─────────────────────────────  ──────────────────────────  ─────────────────────────────────
Edit config.yml or             Skill auto-activates        Claude applies schema patterns,
front matter fields                                        SEO standards, widget selection
                                                           rules as it works

/sveltia-audit                 Command → Agent             Agent scans all templates +
                                                           content + config, command
                                                           formats the report

/sveltia-schema <collection>   Command → Agent             Agent analyzes one collection,
                                                           command presents schema +
                                                           writes on approval

/sveltia-health                Command (standalone)        Reads content files directly,
                                                           checks SEO/links/freshness,
                                                           no agent needed
```

**Key design decisions:**

- `/sveltia-health` does not need the agent -- it reads content files and checks values, not template logic. Faster standalone.
- `/sveltia-audit` and `/sveltia-schema` both delegate to the agent because they need template-to-schema analysis.
- The skill is always ambient -- auto-activates on CMS config, front matter, data files, menus, navigation, or breadcrumb context.

---

## Component Details

### 1. Skill: `sveltia-hugo-maintenance`

**Activation triggers:**

- Editing `static/admin/config.yml` (Sveltia config)
- Working with front matter in any `content/**/*.md`
- Modifying `data/*.yaml` files
- Changing `config/_default/menus.toml`
- Creating new content types or archetypes
- Discussing breadcrumbs, navigation, or CMS editability
- Any SEO-related front matter or schema.org work

**Six knowledge domains:**

#### Domain 1: Content Model Reference

Pike & West's specific collections and their purposes:

- **Blog** (folder collection) -- posts in `content/blog/`
- **Events** (folder collection) -- event type pages in `content/events/`
- **Static pages** (file collection) -- contact, about, workshops, privacy, accessibility, gallery-application
- **Data files** (file collections) -- `hero.yaml`, `events.yaml`, `about.yaml`, `cta_banner.yaml`, `workshops.yaml`, `venue_gallery.yaml`, `blog_taxonomy.yaml`
- **Navigation** -- `menus.toml` structure and how it maps to header/footer

#### Domain 2: Schema Design Patterns

Rules for building Sveltia `config.yml` collections:

- Widget selection guide (when to use `string` vs `text` vs `markdown`, `select` vs `relation`, etc.)
- Required vs optional fields per content type
- Nested objects and list widgets for repeated structures
- Slug generation and path patterns
- Default values and templates (linking to Hugo archetypes)

#### Domain 3: SEO Field Standards

Every content type must include these front matter fields with corresponding Sveltia widgets:

- `title` -- page title (string, required, max ~60 chars)
- `description` -- meta description (text, required, 150-160 chars guidance)
- `canonical` -- canonical URL override (string, optional)
- `og_image` -- Open Graph image (image widget, with dimension guidance)
- `og_title` / `og_description` -- OG overrides when different from page title/description
- `noindex` -- boolean for excluding from search
- `schema_type` -- structured data type selection (select widget: EventVenue, BlogPosting, Event, etc.)
- Blog-specific: `keywords`, `categories`, `tags` (relation widgets tied to `blog_taxonomy.yaml`)
- Event-specific: `event_type` for schema.org Event markup

#### Domain 4: Navigation & Breadcrumb Patterns

- How Hugo menus map to Sveltia-editable data
- Breadcrumb chain validation rules (every page must have a path back to home)
- When to use `menu` front matter vs `menus.toml` entries (prefer `menus.toml`)
- Parent/child page relationships and how they affect breadcrumb schema markup

#### Domain 5: Image & Media Standards

- Required `alt` text on every image field (enforced in schema)
- Image dimension recommendations per context (hero, blog featured, event card, OG)
- Media folder organization in Sveltia config
- Hugo image processing integration (how Sveltia-managed images flow through `resources.GetMatch`)

#### Domain 6: Hugo Version Awareness

- Known breaking changes by version for front matter / template features
- Template-to-front-matter contract (what templates expect, so schemas stay in sync)
- Archetype patterns that align with Sveltia collection defaults

---

### 2. Agent: `sveltia-schema-manager`

**Model:** opus

**Tools:** `Read`, `Glob`, `Grep`

**Inherits:** `sveltia-hugo-maintenance` skill

**Capability:** Given a collection name, it:

1. **Reads Hugo templates** -- scans `layouts/` for the relevant template files, extracts every `.Params.fieldName`, `.Title`, `.Description`, etc. to build a list of fields the template actually consumes
2. **Reads existing content** -- samples files in the target `content/` directory to see what front matter fields are currently in use
3. **Reads the Sveltia config** -- checks `static/admin/config.yml` for the current schema definition
4. **Produces a gap analysis:**
   - Fields templates expect but Sveltia schema doesn't expose (editors can't set them)
   - Fields in schema but no template consumes (dead weight, confusing for editors)
   - SEO fields missing from the schema (per skill's SEO standards)
   - Image fields without `alt` text companion fields
   - Breadcrumb/navigation fields that are absent or misconfigured
5. **Generates corrected schema YAML** -- outputs a valid Sveltia collection config block with proper widgets, defaults, required flags, and field ordering

**Boundaries:**

- Does NOT write to `config.yml` directly -- returns schema + gap report for the command/user to apply
- Does NOT create Hugo templates -- only reads them to understand expectations

---

### 3. Commands

#### `/sveltia-audit`

**Argument:** None (audits everything)

**What it checks:**

- Every `content/` directory has a matching Sveltia collection definition
- Every Sveltia collection's fields match what Hugo templates actually consume
- All content types include the required SEO fields (title, description, og_image, schema_type, etc.)
- Image fields have paired `alt` text fields
- Navigation menus in `menus.toml` are represented in Sveltia as editable
- Data file collections (`hero.yaml`, `events.yaml`, etc.) are all registered and schemas match data structure
- Breadcrumb fields are present on pages that use breadcrumb partials
- No orphaned collections (defined in Sveltia but no corresponding content/template)

**Output:** Structured report with severity levels (error/warning/info) and specific remediation steps.

**Delegates to:** `sveltia-schema-manager` agent.

#### `/sveltia-schema`

**Argument:** Collection name (required) -- e.g., `/sveltia-schema blog`

**Workflow:**

1. Delegates to `sveltia-schema-manager` agent to analyze templates + existing content
2. Presents the gap analysis to the user
3. Shows the proposed `config.yml` collection block
4. On approval, writes the schema into `static/admin/config.yml`
5. If a new collection, also generates a matching Hugo archetype in `archetypes/`

**SEO enforcement:** The generated schema always includes the full SEO field set. If a template doesn't yet consume `og_image` or `schema_type`, the command flags this and suggests template additions.

#### `/sveltia-health`

**Argument:** Optional path (defaults to all content)

**What it checks:**

- **SEO completeness** -- pages missing meta descriptions, empty `og_image`, title too long/short
- **Broken internal links** -- cross-references between content pages that 404
- **Stale content** -- event pages with past dates, blog posts not updated in configurable window
- **Front matter integrity** -- required fields that are empty or placeholder values
- **Breadcrumb chains** -- pages whose breadcrumb path has broken links or missing parents
- **Image health** -- images referenced in front matter that don't exist, missing alt text values
- **Taxonomy health** -- categories/tags used in content but not defined in `blog_taxonomy.yaml`

**Output:** Per-page health scorecard plus summary with most urgent issues first.

---

## Best Practices Encoded in the Skill

### Schema Design Rules

1. **Every content type gets the full SEO block.** No exceptions. The SEO fields (`title`, `description`, `og_image`, `og_title`, `og_description`, `noindex`, `schema_type`) are a standard group in every collection.

2. **Widget selection follows a hierarchy.** `string` for single-line display text. `text` for multi-line non-rendered text (meta descriptions). `markdown` only when the field renders as HTML. `select` when options are fixed. `relation` when options come from another collection. Never use `string` where `select` would prevent typos.

3. **Field ordering is intentional.** Group by purpose: (a) identity (title, slug), (b) content (body, summary), (c) SEO (description, og_image, schema_type), (d) taxonomy (categories, tags), (e) display (featured, weight, draft). Most-edited fields first.

4. **Required fields are minimal but enforced.** Only mark `required` if a missing value breaks rendering or SEO. Title, description, and slug are always required. OG image is required on blog and events, optional on utility pages.

5. **Alt text is a sibling field, not embedded.** Every `image` widget gets a companion `string` widget named `<field>_alt` (e.g., `featured_image` + `featured_image_alt`). Makes alt text visible and editable.

### Navigation Rules

6. **Menus are managed in `menus.toml`, not front matter.** Sveltia exposes `menus.toml` as a file collection. Centralized navigation, not scattered across pages. Flag front matter `menu:` entries as anti-pattern.

7. **Breadcrumbs derive from URL structure.** No manual breadcrumb fields. Hugo's `.Ancestors` or section hierarchy generates breadcrumbs automatically. Content must live in the correct section directory.

### SEO Rules

8. **Meta descriptions are hand-written, not auto-generated.** The `description` field should never default to truncated body. Sveltia `hint` reminds editors: "150-160 characters. Unique to this page. Include primary keyword."

9. **Structured data type is explicit.** Every page declares `schema_type` via a `select` widget. Options: `BlogPosting`, `Event`, `EventVenue`, `WebPage`, `FAQPage`. Templates use this to render the correct JSON-LD block.

10. **Canonical URLs default to self.** The `canonical` field is optional and empty by default. Hugo renders `<link rel="canonical">` using `.Permalink` unless overridden. Warn if canonical is set to the page's own URL (redundant).

### Maintenance Rules

11. **Archetypes mirror schemas.** When a Sveltia collection schema changes, the corresponding archetype in `archetypes/` must be updated to match. `hugo new` and Sveltia both produce consistent front matter.

12. **Data files are typed.** Each `data/*.yaml` file gets a Sveltia file collection with a schema matching the YAML structure. Editors can modify hero text, CTA copy, event listings without touching templates.

---

## Integration with Existing System

| Existing Component                   | New Component                    | Relationship                                                                                                 |
|--------------------------------------|----------------------------------|--------------------------------------------------------------------------------------------------------------|
| `content-editing` skill              | `sveltia-hugo-maintenance` skill | Complementary -- content-editing handles brand voice/editorial, new skill handles CMS structure/SEO          |
| `/content-audit` command             | `/sveltia-health` command        | Different concerns -- content-audit checks editorial quality, sveltia-health checks structural/SEO integrity |
| `blog-editor` / `page-editor` agents | `sveltia-schema-manager` agent   | Different files -- editors write content, schema-manager configures CMS                                      |

---

## Implementation Order

1. **Skill first** -- the knowledge base that everything else depends on
2. **Agent second** -- the analytical engine commands delegate to
3. **`/sveltia-schema` command** -- most immediately useful (generate schemas for existing collections)
4. **`/sveltia-audit` command** -- validates the whole config
5. **`/sveltia-health` command** -- ongoing content monitoring

Each step is independently useful. The skill alone makes ad-hoc CMS work better. The agent + `/sveltia-schema` lets you bootstrap all collection schemas. The audit and health commands are for steady-state maintenance.
