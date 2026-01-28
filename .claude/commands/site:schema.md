---
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Task
  - Bash
argument: collection name (e.g., "blog", "events", "hero", "contact")
---

# /site:schema Command

Generate or update the Sveltia CMS schema for a specific collection.

## Purpose

Analyze Hugo templates and existing content for the specified collection, produce
a gap analysis, and generate a corrected Sveltia CMS schema block ready to merge
into `static/admin/config.yml`.

## Workflow

### Phase 1: Delegate Analysis to Agent

Use the Task tool to launch the `sveltia-schema-manager` agent with this prompt:

```typescript
Analyze the "<COLLECTION_NAME>" collection for Pike & West.

1. Read Hugo templates that render this collection
2. Sample existing content files
3. Read current Sveltia config at static/admin/config.yml (if it exists)
4. Produce a gap analysis
5. Generate corrected schema YAML

Return the full gap analysis report and generated schema.
```

### Phase 2: Present Results

Show the user:

1. **Gap Analysis Summary** -- errors, warnings, and info items from the agent
2. **Proposed Schema** -- the generated `config.yml` collection block
3. **SEO Enforcement Notes** -- if any templates don't yet consume SEO fields
   that the schema includes, flag these for future template updates

Ask the user: "Apply this schema to static/admin/config.yml?"

### Phase 3: Apply (On Approval)

1. **Read** `static/admin/config.yml`
   - If the file doesn't exist, create it with the standard header (backend,
     media_folder, public_folder, site_url, locale, slug config, collections array)
   - If the file exists, find the `collections:` array

2. **Merge the schema:**
   - If the collection already exists in config, replace its definition
   - If the collection is new, append it to the `collections` array

3. **Write** the updated config file

4. **Archetype check:**
   - If this is a folder collection (blog, events), check that a matching
     archetype exists in `archetypes/`
   - If the archetype's front matter doesn't match the new schema fields,
     offer to update it

### Phase 4: Verify

Run Hugo to verify the config doesn't break the build:

```bash
hugo 2>&1
```

Report success or failure.

## Collection Name Mapping

The user may use shorthand names. Map them:

| Input                 | Collection Type          | Source                                   |
|-----------------------|--------------------------|------------------------------------------|
| `blog`                | Folder collection        | `content/blog/*/index.md` (page bundles) |
| `events`              | Folder collection        | `content/events/`                        |
| `contact`             | File collection (page)   | `content/contact.md`                     |
| `about`               | File collection (page)   | `content/about.md`                       |
| `workshops`           | File collection (page)   | `content/workshops.md`                   |
| `privacy`             | File collection (page)   | `content/privacy.md`                     |
| `accessibility`       | File collection (page)   | `content/accessibility.md`               |
| `gallery-application` | File collection (page)   | `content/gallery-application.md`         |
| `homepage`            | File collection (page)   | `content/_index.md`                      |
| `hero`                | Singleton                | `data/hero.yaml`                         |
| `cta-banner`          | Singleton                | `data/cta_banner.yaml`                   |
| `venue-gallery`       | Singleton                | `data/venue_gallery.yaml`                |
| `about-data`          | Singleton                | `data/about.yaml`                        |
| `events-data`         | Singleton                | `data/events.yaml`                       |
| `workshops-data`      | Singleton                | `data/workshops.yaml`                    |
| `taxonomy`            | Singleton                | `data/blog_taxonomy.yaml`                |
| `error404`            | Singleton                | `data/error404.yaml`                     |
| `site-settings`       | Singleton                | `data/site_settings.yaml`                |
| `menus`               | File collection (config) | `config/_default/menus.toml`             |

If the input doesn't match any known collection, ask the user to clarify.

## Notes

- The `sveltia-schema-manager` agent does the heavy analytical work
- This command handles the user interaction, approval flow, and file writing
- SEO fields are always included in generated schemas per the
  `sveltia-hugo-maintenance` skill standards
- When generating schemas for data files, the schema mirrors the YAML structure
  (no front matter / body split)
