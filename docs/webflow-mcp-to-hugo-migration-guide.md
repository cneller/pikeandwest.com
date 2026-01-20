# Webflow MCP: Site Analysis for Hugo Migration

A comprehensive guide for using the Webflow MCP server to analyze and extract site structure, content, and design systems for migration to Hugo.

---

## Overview

The Webflow MCP (Model Context Protocol) server connects AI tools directly to Webflow projects, enabling read access to site structure, CMS content, design elements, and styles. This makes it ideal for comprehensive site analysis before migration.

**Key Benefit:** The remote MCP server runs at `https://mcp.webflow.com/sse` with OAuth authentication—no local installation or API token management required.

---

## Setup for Claude Code

### Configuration

Add this to your Claude MCP configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "webflow": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.webflow.com/sse"]
    }
  }
}
```

### Prerequisites

- Node.js 22.3.0 or higher (required for mcp-remote package)
- Webflow account with access to the target site

Verify your Node version:

```bash
node -v  # Should be 22.3.0+
```

### First-Time Authorization

1. Save the configuration and restart Claude
2. An OAuth login page will open automatically
3. Authorize access to your Webflow sites
4. The MCP connection is now active

### Reset Authorization (If Needed)

```bash
rm -rf ~/.mcp-auth
```

---

## Available Tools for Site Analysis

The MCP exposes two categories of tools. For read-only analysis, these are the most relevant:

### Data API Tools (Always Available)

These work immediately after OAuth—no Designer required.

| Tool            | Purpose                  | Key Data Retrieved                                |
|-----------------|--------------------------|---------------------------------------------------|
| **Sites**       | List all sites           | Site IDs, names, domains, locales, publish status |
| **Pages**       | Get page metadata        | URLs, slugs, SEO settings, page structure         |
| **Components**  | List reusable components | Component definitions and usage                   |
| **Collections** | CMS structure            | Collection schemas, field definitions             |
| **Fields**      | Field details            | Field types, validation rules, metadata           |
| **Items**       | CMS content              | All content items with field values               |
| **Custom Code** | Scripts                  | Site-wide and page-level custom code              |

### Designer API Tools (Requires Companion App)

For visual/structural analysis, open the site in Webflow Designer:

1. Open your site in Webflow Designer
2. Press `E` to open Apps panel
3. Launch "Webflow MCP Bridge App"
4. Keep it open during analysis

| Tool          | Purpose        | Key Data Retrieved                             |
|---------------|----------------|------------------------------------------------|
| **Elements**  | Page structure | All elements, hierarchy, nesting, attributes   |
| **Styles**    | CSS classes    | Style names, CSS properties, breakpoint values |
| **Assets**    | Media files    | Image URLs, file metadata, asset IDs           |
| **Variables** | Design tokens  | Colors, spacing, typography variables          |

---

## Read-Only Analysis Commands

### Phase 1: Site Architecture

Start with these prompts to understand overall structure:

```
List all my Webflow sites and show me the site IDs
```

```
For site [SITE_NAME], show me:
- All pages with their slugs and URLs
- All CMS collections with their field schemas
- Any custom code on the site
```

```
Get the complete field schema for the [COLLECTION_NAME] collection,
including field types, validation rules, and any reference relationships
```

### Phase 2: Content Extraction

Extract CMS content for migration:

```
List all items in the [COLLECTION_NAME] collection with all field values
```

```
For each CMS collection, export all items showing:
- Item name and slug
- All field values
- Reference field relationships
- Created and updated dates
```

```
Identify all reference and multi-reference fields across collections
and map their relationships
```

### Phase 3: Design System Analysis

With the Designer Companion App open:

```
Get all elements on the [PAGE_NAME] page with their:
- Element types and hierarchy
- Applied style names
- Custom attributes
- Nesting structure
```

```
List all styles (classes) used on this site with their CSS properties
```

```
Get all design variables including:
- Color variables
- Spacing values
- Typography settings
```

```
List all assets with their URLs and where they're used
```

### Phase 4: Page-by-Page Analysis

For comprehensive structural understanding:

```
Analyze the homepage structure:
- Element hierarchy (sections, containers, grids)
- Classes applied to each element
- Responsive breakpoint configurations
- Any dynamic CMS bindings
```

```
For each page template (blog post, landing page, etc.),
document the layout structure and reusable patterns
```

---

## Webflow to Hugo Mapping Reference

### CMS Collections → Hugo Content Types

| Webflow Concept   | Hugo Equivalent                      |
|-------------------|--------------------------------------|
| CMS Collection    | Content type (folder in `/content/`) |
| Collection Item   | Markdown file with front matter      |
| Collection Fields | Front matter fields                  |
| Rich Text field   | Markdown body content                |
| Plain Text field  | String in front matter               |
| Number field      | Number in front matter               |
| Date field        | Date in front matter                 |
| Switch (boolean)  | Boolean in front matter              |
| Option field      | String or taxonomy term              |
| Reference field   | Related content or taxonomy          |
| Multi-Reference   | List in front matter or taxonomy     |
| Image field       | Path in front matter + static file   |
| File field        | Path in front matter + static file   |

### Example: Blog Post Migration

**Webflow Collection Schema:**

```
Collection: Blog Posts
Fields:
  - Name (Plain Text) → Required
  - Slug (Plain Text) → Required
  - Post Body (Rich Text)
  - Excerpt (Plain Text)
  - Featured Image (Image)
  - Author (Reference → Team Members)
  - Categories (Multi-Reference → Categories)
  - Tags (Multi-Reference → Tags)
  - Publish Date (Date)
  - SEO Title (Plain Text)
  - SEO Description (Plain Text)
```

**Hugo Content File:** `/content/blog/my-post-slug.md`

```yaml
---
title: "My Post Title"
slug: "my-post-slug"
date: 2025-01-15T10:00:00Z
draft: false
description: "SEO description here"
excerpt: "Short excerpt for listings"
featured_image: "/images/blog/featured.jpg"
author: "team/john-doe"
categories:
  - "Technology"
  - "Web Development"
tags:
  - "Hugo"
  - "Migration"
seo:
  title: "Custom SEO Title"
  description: "SEO meta description"
---

Post body content converted from Rich Text to Markdown goes here.

## Subheadings become H2

Regular paragraphs, **bold text**, *italic text*, and [links](https://example.com).

- Bullet lists
- Work as expected

1. Numbered lists
2. Also work
```

### Hugo Front Matter Field Reference

Hugo recognizes these predefined front matter fields:

| Field         | Type     | Purpose                                        |
|---------------|----------|------------------------------------------------|
| `title`       | string   | Page title                                     |
| `date`        | datetime | Creation/publish date                          |
| `draft`       | boolean  | If true, won't publish without `--buildDrafts` |
| `slug`        | string   | URL tail (overrides filename)                  |
| `url`         | string   | Full path from web root                        |
| `description` | string   | SEO meta description                           |
| `keywords`    | array    | SEO keywords                                   |
| `weight`      | integer  | Sort order in lists                            |
| `aliases`     | array    | Redirects from old URLs                        |
| `type`        | string   | Content type (derived from folder if unset)    |
| `layout`      | string   | Specific layout template to use                |
| `markup`      | string   | Content format (md, rst, html)                 |
| `publishDate` | datetime | Future publish date                            |
| `expiryDate`  | datetime | Content expiration                             |

Custom fields can be added and accessed via `.Params.fieldname` in templates.

### Page Types Mapping

| Webflow Page Type    | Hugo Equivalent                                           |
|----------------------|-----------------------------------------------------------|
| Static page          | `/content/page-name.md` or `/content/page-name/_index.md` |
| CMS template page    | Layout template in `/layouts/`                            |
| Collection list page | List template (`list.html`)                               |
| Collection item page | Single template (`single.html`)                           |
| Homepage             | `/content/_index.md` + `/layouts/index.html`              |
| 404 page             | `/layouts/404.html`                                       |

### Styles → Hugo/CSS

| Webflow           | Hugo Approach                    |
|-------------------|----------------------------------|
| Global styles     | `/assets/css/` or `/static/css/` |
| Component classes | CSS modules or utility classes   |
| Breakpoint styles | CSS media queries                |
| CSS variables     | CSS custom properties in `:root` |
| Interactions      | JavaScript or CSS animations     |

---

## Recommended Migration Workflow

### Step 1: Document Everything

```
Create a complete inventory of:
1. All pages (static and CMS-driven)
2. All CMS collections with schemas
3. All CMS items (content export)
4. All styles/classes with CSS properties
5. All assets with URLs
6. All custom code
7. Navigation structure
8. Form configurations
```

### Step 2: Generate Hugo Structure

Based on the analysis:

```
/my-hugo-site/
├── config.toml           # Site configuration
├── content/
│   ├── _index.md         # Homepage
│   ├── blog/             # Blog posts (from CMS)
│   │   ├── _index.md     # Blog listing page
│   │   ├── post-1.md
│   │   └── post-2.md
│   ├── team/             # Team members (from CMS)
│   └── pages/            # Static pages
├── layouts/
│   ├── _default/
│   │   ├── baseof.html   # Base template
│   │   ├── list.html     # Collection list
│   │   └── single.html   # Single item
│   ├── blog/             # Blog-specific layouts
│   └── partials/         # Reusable components
├── static/
│   └── images/           # Migrated assets
├── assets/
│   └── css/              # Styles (processed by Hugo Pipes)
└── data/                 # Data files (JSON, YAML, TOML)
```

### Step 3: Content Migration Checklist

- [ ] Export all CMS collections with field mappings
- [ ] Convert Rich Text fields to Markdown
- [ ] Download and organize all images/assets
- [ ] Map reference relationships to Hugo taxonomies or related content
- [ ] Preserve URL slugs for SEO continuity
- [ ] Migrate SEO metadata (titles, descriptions)
- [ ] Convert custom code to Hugo equivalents
- [ ] Test all internal links
- [ ] Set up redirects for any changed URLs

### Step 4: Design Migration

- [ ] Extract CSS from Webflow styles
- [ ] Document responsive breakpoints
- [ ] Identify reusable components → Hugo partials
- [ ] Map Webflow interactions to CSS/JS
- [ ] Create Hugo templates matching Webflow layouts
- [ ] Test across breakpoints

---

## Analysis Prompts by Use Case

### Complete Site Audit

```
Perform a complete audit of my Webflow site [SITE_NAME]:

1. List all pages with URLs and any CMS bindings
2. Document all CMS collections with complete schemas
3. Export all CMS items from each collection
4. List all styles with their CSS properties
5. Identify all assets and their locations
6. Document the navigation structure
7. List any custom code (site-wide and per-page)

Format this as a migration planning document.
```

### Content Structure Analysis

```
Analyze the content structure of [SITE_NAME]:

1. How many CMS collections exist?
2. What are the relationships between collections?
3. How many items are in each collection?
4. What field types are used?
5. Are there any complex field configurations?

Create a data model diagram showing relationships.
```

### Design System Extraction

```
Extract the design system from [SITE_NAME]:

1. List all color values used (hex codes)
2. Document typography settings (fonts, sizes, weights)
3. Identify spacing patterns
4. List all reusable component patterns
5. Document responsive breakpoint configurations

Format this as design tokens I can recreate in CSS.
```

### URL Structure Mapping

```
Map the complete URL structure of [SITE_NAME]:

1. All static page URLs
2. CMS collection list page URLs
3. CMS item URL patterns
4. Any URL redirects or custom slugs

I need this to maintain SEO continuity during migration.
```

### Element Tree Analysis

```
For [PAGE_NAME], get the complete element tree with:

1. Full hierarchy (parent/child relationships)
2. Element types (div, section, heading, paragraph, etc.)
3. Applied classes/styles on each element
4. Any custom attributes or IDs
5. Text content in text elements

Present this as a nested structure I can recreate in Hugo templates.
```

---

## Handling Specific Content Types

### Rich Text Fields

Webflow Rich Text is returned as HTML. To convert to Markdown:

1. Extract the HTML content via MCP
2. Use a converter like Turndown.js:

```javascript
// Example conversion
const TurndownService = require("turndown");
const turndown = new TurndownService();
const markdown = turndown.convert(richTextHtml);
```

1. Review for any Webflow-specific embeds or formatting

### Reference Fields (Relationships)

**Option A: Hugo Taxonomies**

For many-to-many relationships (categories, tags):

```yaml
# config.toml
[taxonomies]
  category = "categories"
  tag = "tags"
  author = "authors"
```

```yaml
# content/blog/post.md
---
categories: ["Technology"]
tags: ["Hugo", "Migration"]
authors: ["john-doe"]
---
```

**Option B: Related Content**

For one-to-one references:

```yaml
# content/blog/post.md
---
author: "team/john-doe" # Path to related content
---
```

Access in template:

```go
{{ with .Site.GetPage .Params.author }}
  <p>By {{ .Title }}</p>
{{ end }}
```

### Images and Assets

1. Get asset URLs from MCP
2. Download to `/static/images/`
3. Update references in content

```yaml
# Before (Webflow URL)
featured_image: "https://uploads-ssl.webflow.com/..."

# After (Hugo static path)
featured_image: "/images/blog/featured.jpg"
```

Bulk download script:

```bash
# Save asset URLs to file, then:
wget -i asset-urls.txt -P ./static/images/
```

---

## Limitations & Workarounds

### MCP Limitations

1. **Designer tools require the companion app** — For element/style analysis, you must have the Webflow Designer open with the MCP Bridge App running

2. **Rich Text comes as HTML** — You'll need to convert to Markdown separately

3. **Images are URLs, not files** — Asset URLs are provided; download them separately

4. **No direct file export** — The MCP reads data; process and save it yourself

5. **Large collections may need pagination** — Query in batches for sites with lots of content

### Data Not Available via MCP

- Webflow Interactions/animations (must be recreated manually)
- Form submission data
- E-commerce products (separate API)
- Memberships configuration
- Analytics data

---

## Quick Reference: Common Prompts

| Task               | Prompt                                            |
|--------------------|---------------------------------------------------|
| List sites         | "List all my Webflow sites"                       |
| Get site structure | "Show all pages and collections for [SITE]"       |
| Export collection  | "Export all items from [COLLECTION] collection"   |
| Get field schema   | "Show the complete field schema for [COLLECTION]" |
| Analyze page       | "Get all elements on [PAGE] with styles"          |
| Extract styles     | "List all styles/classes with CSS properties"     |
| Get assets         | "List all assets with URLs"                       |
| Custom code        | "Show all custom code on the site"                |
| Page metadata      | "Get SEO metadata for all pages"                  |
| Site info          | "Show site configuration and locales"             |

---

## Verification After Migration

### Content Checklist

- [ ] All pages render correctly
- [ ] All blog posts/CMS items migrated
- [ ] Images display properly
- [ ] Internal links work
- [ ] External links preserved
- [ ] SEO metadata in place
- [ ] Structured data intact

### Design Checklist

- [ ] Layouts match original
- [ ] Responsive behavior works
- [ ] Typography correct
- [ ] Colors accurate
- [ ] Spacing consistent
- [ ] Navigation functional

### Technical Checklist

- [ ] Build completes without errors
- [ ] URLs match original (or redirects in place)
- [ ] RSS/sitemap generates
- [ ] 404 page works
- [ ] Performance acceptable
- [ ] Hosting configured

---

## Resources

### Webflow MCP

- [Webflow MCP Documentation](https://developers.webflow.com/mcp/reference/overview)
- [Webflow MCP GitHub](https://github.com/webflow/mcp-server)
- [Webflow Data API Reference](https://developers.webflow.com/data/reference)
- [Webflow Designer API Reference](https://developers.webflow.com/designer/reference)

### Hugo

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Front Matter](https://gohugo.io/content-management/front-matter/)
- [Hugo Content Organization](https://gohugo.io/content-management/organization/)
- [Hugo Taxonomies](https://gohugo.io/content-management/taxonomies/)
- [Hugo Templates](https://gohugo.io/templates/)

### Migration Tools

- [Turndown](https://github.com/mixmark-io/turndown) - HTML to Markdown
- [Hugo Import Tools](https://gohugo.io/tools/migrations/)

---

_Guide Version: 1.0 | Last Updated: January 2025_
