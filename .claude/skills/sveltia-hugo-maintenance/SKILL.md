---
name: sveltia-hugo-maintenance
description: >
  Sveltia CMS + Hugo maintenance for Pike & West. Auto-activates when working
  with Sveltia config (static/admin/config.yml), front matter in content/**/*.md,
  data files (data/*.yaml), menus (config/_default/menus.toml), archetypes,
  breadcrumbs, navigation, or CMS editability. Covers schema design, SEO field
  standards, widget selection, content model, and maintenance best practices.
---

# Sveltia CMS + Hugo Maintenance

This skill provides the knowledge base for maintaining the Pike & West website
through Sveltia CMS. It covers schema design, SEO enforcement, navigation
management, and content model patterns specific to this project.

Sveltia CMS is a drop-in replacement for Decap CMS. Configuration lives at
`static/admin/config.yml` and uses the same YAML format.

---

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

---

## Domain 1: Content Model Reference

Pike & West has these content collections, each requiring a Sveltia schema:

### Folder Collections (Multiple Files)

| Collection | Directory         | Slug Pattern     | Archetype              | Notes                          |
|------------|-------------------|------------------|------------------------|--------------------------------|
| Blog       | `content/blog/`   | `{{slug}}/index` | `archetypes/blog.md`   | Page bundles, has `index_file` |
| Events     | `content/events/` | `{{slug}}`       | `archetypes/events.md` | Has `index_file`               |

### File Collections (Individual Files)

**Static Pages:**

| Page                | File                             | Layout                |
|---------------------|----------------------------------|-----------------------|
| Contact             | `content/contact.md`             | `contact`             |
| About               | `content/about.md`               | `about`               |
| Workshops           | `content/workshops.md`           | `workshops`           |
| Privacy             | `content/privacy.md`             | default               |
| Accessibility       | `content/accessibility.md`       | default               |
| Gallery Application | `content/gallery-application.md` | `gallery-application` |
| Homepage            | `content/_index.md`              | `index`               |

**Data Files:**

Data files are configured as **singletons** in Sveltia CMS (not file collections):

| File                      | Purpose               | Structure                                                                                                              |
|---------------------------|-----------------------|------------------------------------------------------------------------------------------------------------------------|
| `data/site_settings.yaml` | Contact & social data | `contact{}` (phone, email, address, city, state, zip, hours, googleMapsUrl), `social{}` (instagram, facebook, twitter) |
| `data/hero.yaml`          | Homepage hero section | `title_line1`, `title_line2`, `tagline[]`, `cta{}`, `background_image`, `foreground_image`, `image_alt`                |
| `data/events.yaml`        | Event types grid      | `heading`, `cta_text`, `cta_link`, `types[]` (each: `icon`, `label`, `link`)                                           |
| `data/about.yaml`         | About page blocks     | `heading`, `blocks[]` (each: `id`, `subtitle`, `paragraphs[]`, `cta{}`, `image{}`, `reverse`)                          |
| `data/cta_banner.yaml`    | CTA banner component  | `heading`, `text`, `cta{}`, `background_image`                                                                         |
| `data/venue_gallery.yaml` | Gallery carousel      | `heading`, `subtext`, `images[]`                                                                                       |
| `data/workshops.yaml`     | Workshops landing     | `heading`, `subheading`, `intro{}`, `features[]`, `host_cta{}`                                                         |
| `data/blog_taxonomy.yaml` | Taxonomy reference    | `categories[]`, `tags[]`                                                                                               |
| `data/error404.yaml`      | 404 page              | `headline`, `tagline[]`, `message`, `cta_primary{}`, `cta_secondary[]`, `background_image`, `image_alt`                |

**Navigation:**

| Menu             | File                         | Items                                                                                     |
|------------------|------------------------------|-------------------------------------------------------------------------------------------|
| `main`           | `config/_default/menus.toml` | Workshops, Host Your Event                                                                |
| `footer_events`  | `config/_default/menus.toml` | Weddings, Corporate Events, Birthday Parties, Baby Showers, Private Parties, Dance Events |
| `footer_explore` | `config/_default/menus.toml` | About, Blog, Workshops, Contact, Gallery Application                                      |
| `footer_legal`   | `config/_default/menus.toml` | Privacy Policy, Accessibility                                                             |

---

## Domain 2: Schema Design Patterns

### Widget Selection Guide

Choose the right Sveltia widget for each field type:

| Data Need                         | Widget     | When to Use                              |
|-----------------------------------|------------|------------------------------------------|
| Short display text (title, label) | `string`   | Single-line text that renders directly   |
| Multi-line non-rendered text      | `text`     | Meta descriptions, alt text, summaries   |
| Rich content body                 | `markdown` | Only when field renders as HTML          |
| Fixed set of options              | `select`   | Categories, schema types, layout names   |
| Options from another collection   | `relation` | Tags from taxonomy, related posts        |
| True/false toggle                 | `boolean`  | draft, noindex, featured                 |
| Date or timestamp                 | `datetime` | Publication date, event dates            |
| Numeric value                     | `number`   | Weight, capacity, order                  |
| File upload                       | `image`    | Any image field                          |
| Grouped fields                    | `object`   | Nested structures (cta, address, schema) |
| Repeatable items                  | `list`     | Tags, keywords, paragraphs, features     |
| Non-editable metadata             | `hidden`   | Type fields, layout assignments          |

**Key rule:** Never use `string` where `select` would prevent typos. If the set
of valid values is known, use `select`.

### Field Ordering Convention

Group fields in this order within every collection:

1. **Identity** -- `title`, `slug` (most-edited, first in editor)
2. **Content** -- `body`, `summary`, `sections`
3. **SEO** -- `description`, `og_image`, `og_title`, `og_description`, `schema_type`, `canonical`, `noindex`
4. **Taxonomy** -- `categories`, `tags`, `keywords`
5. **Display** -- `image`, `image_alt`, `icon`, `featured`, `weight`, `draft`
6. **Metadata** -- `author`, `date`, `type`, `layout`

### Required vs Optional Fields

Only mark fields `required: true` if a missing value would break rendering or SEO:

| Always Required   | Required on Blog/Events | Optional Everywhere           |
|-------------------|-------------------------|-------------------------------|
| `title`           | `description`           | `canonical`                   |
| `slug` (implicit) | `image`                 | `og_title`                    |
|                   | `image_alt`             | `og_description`              |
|                   | `date`                  | `noindex`                     |
|                   |                         | `og_image` (on utility pages) |

### Collection Configuration Patterns

**Folder collection (blog):**

```yaml
- name: blog
  label: Blog Posts
  folder: content/blog
  create: true
  slug: "{{slug}}"
  fields:
    - { label: Title, name: title, widget: string, required: true }
    - { label: Body, name: body, widget: markdown }
    - label: Description
      name: description
      widget: text
      required: true
      hint: "150-160 characters. Unique to this page. Include primary keyword."
    # ... additional fields per SEO standards
```

**File collection (data files):**

```yaml
- name: data
  label: Site Data
  files:
    - name: hero
      label: Homepage Hero
      file: data/hero.yaml
      fields:
        - { label: Title Line 1, name: title_line1, widget: string }
        - { label: Title Line 2, name: title_line2, widget: string }
        - label: Tagline Lines
          name: tagline
          widget: list
          field: { label: Line, name: line, widget: string }
        - label: Call to Action
          name: cta
          widget: object
          fields:
            - { label: Text, name: text, widget: string }
            - { label: Link, name: link, widget: string }
        - { label: Background Image, name: background_image, widget: image }
        - { label: Foreground Image, name: foreground_image, widget: image }
        - { label: Image Alt Text, name: image_alt, widget: text }
```

### Slug Configuration

```yaml
slug:
  encoding: unicode
  clean_accents: true
  sanitize_replacement: "-"
```

Blog posts use `{{slug}}` (derived from title). Event pages use `{{slug}}`.

---

## Domain 3: SEO Field Standards

Every content type must expose these fields in its Sveltia schema:

### Universal SEO Fields

```yaml
# Required on ALL content types
- label: Title
  name: title
  widget: string
  required: true
  hint: "50-60 characters. Include primary keyword."

- label: Meta Description
  name: description
  widget: text
  required: true
  hint: "150-160 characters. Unique to this page. Include primary keyword. Hand-written, not auto-generated."

# Required on blog and events, optional on utility pages
- label: Featured Image
  name: image
  widget: image
  required: true  # false for utility pages
  hint: "Hero/featured image. Recommended: 1200x630px for OG sharing."

- label: Image Alt Text
  name: image_alt
  widget: text
  required: true  # false for utility pages
  hint: "Describe the image for accessibility. Be specific and concise."

# Optional overrides
- label: Canonical URL
  name: canonical
  widget: string
  required: false
  hint: "Leave empty to use page URL. Only set if canonical differs from this page."

- label: OG Image Override
  name: og_image
  widget: image
  required: false
  hint: "Override featured image for social sharing. 1200x630px recommended."

- label: OG Title Override
  name: og_title
  widget: string
  required: false
  hint: "Override page title for social sharing. Leave empty to use page title."

- label: OG Description Override
  name: og_description
  widget: text
  required: false
  hint: "Override meta description for social sharing."

- label: Exclude from Search
  name: noindex
  widget: boolean
  default: false
  hint: "Set true to add noindex meta tag."
```

### Blog-Specific SEO Fields

```yaml
- label: Keywords
  name: keywords
  widget: list
  field: { label: Keyword, name: keyword, widget: string }
  hint: "3-5 SEO keywords. Include location (Memphis, Germantown, Tennessee)."

- label: Categories
  name: categories
  widget: select
  options:
    - News
    - Weddings
    - Corporate Events
    - Planning Tips
    - Behind the Scenes
    - Baby Showers
  multiple: true
  min: 1
  max: 2

- label: Tags
  name: tags
  widget: select
  options: []  # Populate from blog_taxonomy.yaml
  multiple: true
  min: 1
  max: 8
```

### Event-Specific SEO Fields

```yaml
- label: Event Type
  name: eventType
  widget: select
  options:
    - { label: Wedding, value: wedding }
    - { label: Corporate Event, value: corporate }
    - { label: Birthday Party, value: birthday }
    - { label: Baby Shower, value: baby-shower }
    - { label: Private Party, value: private-party }
    - { label: Dance Event, value: dance }
  required: true
```

### Structured Data Fields

```yaml
- label: Schema Type
  name: schema_type
  widget: select
  options:
    - { label: Blog Post, value: BlogPosting }
    - { label: Event, value: Event }
    - { label: Event Venue, value: EventVenue }
    - { label: Web Page, value: WebPage }
    - { label: FAQ Page, value: FAQPage }
    - { label: Contact Page, value: ContactPage }
    - { label: About Page, value: AboutPage }
  required: false
  hint: "Schema.org type for structured data. Templates use this for JSON-LD."

# Some pages use a more detailed schema object:
- label: Schema
  name: schema
  widget: object
  required: false
  collapsed: true
  fields:
    - label: Type
      name: type
      widget: select
      options: [ContactPage, AboutPage, EventVenue, WebPage, FAQPage]
    - { label: Name, name: name, widget: string, required: false }
    - { label: Main Entity, name: main_entity, widget: string, required: false }
```

### SEO Rules

1. **Meta descriptions are hand-written.** Never default to truncated body text. The Sveltia `hint` reminds editors of the 150-160 character target.
2. **Canonical URLs default to self.** The `canonical` field is optional and empty by default. Hugo renders `<link rel="canonical">` using `.Permalink` unless overridden. Warn if canonical is set to the page's own URL (redundant).
3. **Structured data type is explicit.** Every page should declare `schema_type` or `schema.type` via a `select` widget so templates render the correct JSON-LD block.
4. **Title tag format:** "Page Title | Pike & West" -- the brand suffix is added by the template, not by the editor.

---

## Domain 4: Navigation & Breadcrumb Patterns

### Menu Management

Menus are managed in `config/_default/menus.toml`, NOT in page front matter.

```toml
# config/_default/menus.toml
[[main]]
  name = "Workshops"
  url = "/workshops/"
  weight = 1

[[main]]
  name = "Host Your Event"
  url = "/contact/"
  weight = 2

[[footer_events]]
  name = "Weddings"
  url = "/events/weddings/"
  weight = 1
```

**Sveltia integration:** Expose `menus.toml` as a file collection so editors can
manage navigation labels, URLs, and ordering without code changes.

**Anti-pattern:** Do NOT use `menu:` front matter entries on individual pages.
Centralized navigation in `menus.toml` prevents scattered, hard-to-audit menu
definitions.

### Breadcrumb Rules

Breadcrumbs derive automatically from URL structure. No manual breadcrumb fields
in front matter.

- Hugo's section hierarchy generates breadcrumb paths
- Content must live in the correct directory for breadcrumbs to work
- `layouts/partials/breadcrumb.html` and `breadcrumb-schema.html` handle rendering
- Breadcrumb schema markup uses JSON-LD (BreadcrumbList)

**Validation rules:**

- Every page must have a path back to home
- Section pages (`_index.md`) must exist for breadcrumb intermediate steps
- Breadcrumb labels come from page `title` front matter

### CTA Language System

Navigation CTAs follow a strict pattern:

| Location                | CTA Text        | Links To      |
|-------------------------|-----------------|---------------|
| Header (outline button) | Workshops       | `/workshops/` |
| Header (gold button)    | Host Your Event | `/contact/`   |
| Hero section            | BOOK A TOUR     | `/contact/`   |
| Event types section     | HOST YOUR EVENT | `/contact/`   |
| CTA banner              | Book a Tour     | `/contact/`   |
| Footer                  | Host an Event   | `/contact/`   |
| Footer                  | Workshops       | `/workshops/` |

When adding or editing navigation, respect this language distinction between
"Host Your Event" (venue rental) and "Workshops" (class attendance).

---

## Domain 5: Image & Media Standards

### Alt Text Rule

Every `image` widget gets a companion `text` widget for alt text:

```yaml
- { label: Featured Image, name: image, widget: image }
- label: Image Alt Text
  name: image_alt
  widget: text
  required: true
  hint: "Describe the image for accessibility. Be specific and concise."
```

**Naming convention:** Image field `<name>` pairs with alt field `<name>_alt`.
Exception: if the image field is already named `image`, the alt field is
`image_alt` (not `image_alt_alt`).

### Image Dimension Recommendations

| Context             | Recommended Size | Notes                      |
|---------------------|------------------|----------------------------|
| Hero / background   | 1920x1080px      | Full-width, lazy-loaded    |
| Blog featured image | 1200x630px       | Also used as OG image      |
| Event page hero     | 1200x630px       | Also used as OG image      |
| OG image            | 1200x630px       | Social sharing standard    |
| Event type icon     | SVG preferred    | Small, inline              |
| About section photo | 800x600px        | Displayed in content block |
| Gallery carousel    | 1200x800px       | Processed via Hugo Pipes   |

### Media Configuration

```yaml
media_folder: static/images
public_folder: /images
```

All site images live in `static/images/` and are visible in the Sveltia CMS
assets browser. A Hugo module mount in `config/_default/hugo.toml` maps
`static/images` to `assets/images`, so templates can use `resources.Get
"images/..."` for Hugo Pipes processing (resize, WebP conversion, responsive
variants). This gives both CMS visibility and build-time image optimization.

**Blog page bundles** use co-located images. The blog collection config uses
`media_folder: ""` and `public_folder: ""` so images upload directly into the
page bundle directory. Blog templates use dual resolution: page bundle resources
first (`$.Resources.GetMatch`), then global assets (`resources.Get`).

**Why Hugo Pipes matters:** Templates generate WebP variants, responsive sizes,
and quality-controlled outputs (q80-q90). Without Pipes, images would serve
as-is at full size in their original format, degrading Lighthouse performance
scores.

### Current Image Organization

```text
static/images/
  blog/           # Blog post images (placeholder, page bundles preferred)
  brand/          # Logo variants and social media icons
  categories/     # Blog category taxonomy images
  homepage-hero/  # Homepage hero background/foreground images
  icons/          # Event type and workshop icons (PNG + SVG)
  photos/         # Venue and event photography (venue-01 through venue-XX)
```

**Hugo module mount** (in `config/_default/hugo.toml`):

```toml
[[module.mounts]]
  source = "static/images"
  target = "assets/images"
```

This mount makes `static/images/` available as `assets/images/` so that
`resources.Get "images/homepage-hero/venue-exterior.jpg"` resolves correctly for Hugo
Pipes processing.

---

## Domain 6: Hugo Version Awareness

### Current Version

Hugo version is pinned in `wrangler.toml`:

```toml
[build.environment]
HUGO_VERSION = "0.154.5"
```

### Template-to-Front-Matter Contract

Templates consume these `.Params` fields. If a field is referenced in a template,
it MUST exist in the Sveltia schema for that collection:

| Template                                | Fields Consumed                                                                      |
|-----------------------------------------|--------------------------------------------------------------------------------------|
| `layouts/partials/head.html`            | `description`, `canonical`, `noindex`, `nofollow`, `og_image`, `og_type`, `keywords` |
| `layouts/partials/head.html`            | `.Site.Data.site_settings.social.twitter` (Twitter card)                             |
| `layouts/partials/structured-data.html` | `.Site.Data.site_settings.contact.*`, `.Site.Data.site_settings.social.*`            |
| `layouts/partials/footer.html`          | `.Site.Data.site_settings.contact.*`, `.Site.Data.site_settings.social.*`            |
| `layouts/page/contact.html`             | `.Site.Data.site_settings.contact.*` (address, hours, phone, googleMapsUrl)          |
| `layouts/page/gallery-application.html` | `.Site.Data.site_settings.contact.*` (address, hours, phone, googleMapsUrl)          |
| `layouts/blog/single.html`              | `title`, `date`, `author`, `image`, `image_alt`, `categories`, `tags`                |
| `layouts/blog/list.html`                | `image`, `image_alt`, `categories`, `date`, `title`                                  |
| `layouts/events/single.html`            | `title`, `eventType`, `icon`, `image`, `image_alt`, `description`                    |
| `layouts/page/about.html` (via data)    | References `data/about.yaml` structure                                               |
| `layouts/partials/hero.html` (via data) | References `data/hero.yaml` structure                                                |

**Note:** Contact and social data is sourced from `data/site_settings.yaml`
(via `.Site.Data.site_settings`), NOT from `config/_default/params.toml`. The
params.toml still holds `analytics`, `forms`, `maps`, and `ticketTailor` config.

### Archetype Alignment

When Sveltia collection schemas change, update the corresponding archetype to
match. Both `hugo new` and Sveltia should produce identical front matter
structures.

| Archetype | Location                | Must Match                   |
|-----------|-------------------------|------------------------------|
| Blog      | `archetypes/blog.md`    | Blog collection fields       |
| Events    | `archetypes/events.md`  | Events collection fields     |
| Default   | `archetypes/default.md` | Minimal (title, date, draft) |

---

## Sveltia-Specific Features

### Index File Inclusion (`index_file`)

Hugo uses `_index.md` files as section list pages (e.g., `content/blog/_index.md`,
`content/events/_index.md`). These files have different fields than regular
entries in the same folder collection.

**Problem:** Sveltia CMS folder collections ignore `_index.md` by default. Putting
`_index.md` in a file collection doesn't work either -- if a folder collection
already claims that directory, the file collection entry will load blank.

**Solution:** Use the `index_file` option directly on the folder collection. This
tells Sveltia to treat `_index.md` as a special entry with its own field schema:

```yaml
collections:
  - name: events
    label: Event Pages
    folder: content/events
    extension: md
    format: yaml-frontmatter
    index_file:
      fields:
        - label: Title
          name: title
          widget: string
        - label: Description
          name: description
          widget: text
        - label: Body
          name: body
          widget: markdown
    fields:
      # Regular entry fields (different from index_file fields)
      - label: Title
        name: title
        widget: string
      # ...
```

**Rules:**

1. **Never use a file collection entry for `_index.md` in a directory owned by a
   folder collection.** The folder collection will intercept the file, causing
   blank fields in the file collection editor.
2. **`index_file.fields` are independent** from the collection's `fields`. The
   index page typically has fewer fields (title, description, body) while regular
   entries have type-specific fields.
3. **Both blog and events** collections use this pattern since both have
   `_index.md` section list pages with distinct content.

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

---

## Best Practices

### Schema Design Rules

1. **Every content type gets the full SEO block.** No exceptions. The SEO fields
   (`title`, `description`, `image`, `image_alt`, `og_image`, `og_title`,
   `og_description`, `noindex`, `schema_type`) are a standard group in every
   collection.

2. **Widget selection follows the hierarchy in Domain 2.** `string` for display
   text, `text` for non-rendered text, `markdown` only for HTML-rendered fields,
   `select` for fixed options, `relation` for cross-collection references.

3. **Field ordering is intentional.** Follow the convention in Domain 2:
   identity, content, SEO, taxonomy, display, metadata.

4. **Required fields are minimal but enforced.** Only mark `required: true` if
   a missing value breaks rendering or SEO.

5. **Alt text is a sibling field.** Every `image` widget gets a companion `text`
   widget. See Domain 5 for naming convention.

### Navigation Rules

6. **Menus are managed in `menus.toml`, not front matter.** Sveltia exposes
   `menus.toml` as a file collection. Flag front matter `menu:` entries as
   anti-pattern.

7. **Breadcrumbs derive from URL structure.** No manual breadcrumb fields.
   Content must live in the correct section directory.

### SEO Rules

8. **Meta descriptions are hand-written.** The `description` field should never
   default to truncated body. Use Sveltia `hint` to remind editors of the
   150-160 character target.

9. **Structured data type is explicit.** Every page declares `schema_type` via
   a `select` widget. Templates use this for JSON-LD.

10. **Canonical URLs default to self.** The `canonical` field is optional and
    empty by default. Warn if set to the page's own URL.

### Maintenance Rules

11. **Archetypes mirror schemas.** When a Sveltia collection schema changes,
    update the corresponding archetype in `archetypes/` to match.

12. **Data files are typed.** Each `data/*.yaml` file gets a Sveltia file
    collection with a schema matching the YAML structure.

---

## Common Task Workflows

### Adding a New Field to an Existing Collection

1. Determine widget type (Domain 2)
2. Add to Sveltia config (correct field group position)
3. Add pattern validation if SEO field
4. Update Hugo archetype to match
5. Update Hugo template if field needs rendering
6. Run `/check:config` to verify

### Creating a New Content Type

1. Create content directory
2. Create Hugo template
3. Create Hugo archetype
4. Run `/site:schema <name>` to generate CMS schema
5. Add SEO field block
6. Add to navigation if needed (menus.toml)
7. Run `/check:config` to verify

### Adding a New Data File (Singleton)

1. Create data YAML file with structure
2. Add singleton definition to config.yml
3. Create or update Hugo template to reference `site.Data.<name>`
4. Run `/check:config` to verify

### Changing Navigation Structure

1. Edit `config/_default/menus.toml`
2. Follow CTA language system (Domain 4)
3. Verify breadcrumb chain integrity
4. Do NOT use front matter menu entries

### Updating SEO Requirements Across All Collections

1. Update SEO field definitions in skill (Domain 3)
2. Run `/check:config` to identify collections missing new fields
3. Run `/site:schema` for each collection needing updates
4. Update archetypes to match
5. Run `/check:seo` to verify content compliance

---

## Quick Reference: Sveltia Config Structure

```yaml
# static/admin/config.yml
backend:
  name: github
  repo: cneller/pikeandwest.com
  branch: main

media_folder: static/images
public_folder: /images

site_url: https://pikeandwest.com

slug:
  encoding: unicode
  clean_accents: true
  sanitize_replacement: "-"

collections:
  # Folder collections (blog uses page bundles, events uses flat files)
  - name: blog
    label: Blog Posts
    folder: content/blog
    create: true
    slug: "{{slug}}"
    path: "{{slug}}/index"
    media_folder: ""
    public_folder: ""
    index_file:
      fields: [...]  # Fields for _index.md (title, description, keywords, body)
    fields: [...]

  - name: events
    label: Event Pages
    folder: content/events
    create: false
    delete: false
    index_file:
      fields: [...]  # Fields for _index.md (title, description, body)
    fields: [...]     # Fields for regular event pages

  # File collection (static pages)
  - name: pages
    label: Pages
    files:
      - name: home
        label: Homepage
        file: content/_index.md
        fields: [...]

# Singletons (data files -- NOT under collections)
singletons:
  - name: site_settings
    label: Site Settings
    file: data/site_settings.yaml
    fields: [...]

  - name: hero
    label: Hero Section
    file: data/hero.yaml
    fields: [...]
```

**Important:** Data files use the `singletons` key (Sveltia CMS feature), not
the `collections` key. This gives them a distinct sidebar section.

---

## Related Components

- **Agent:** `sveltia-schema-manager` -- Analyzes Hugo templates and generates
  Sveltia schemas. Delegates from `/check:config` and `/site:schema`.
- **Commands:**
  - `/check:config` -- Full config health check
  - `/site:schema <collection>` -- Generate/update one collection schema
  - `/check:seo` -- Content-level SEO and integrity check
- **Complementary skill:** `content-editing` -- Handles brand voice, editorial
  standards, and content index. This skill handles CMS structure and SEO.
