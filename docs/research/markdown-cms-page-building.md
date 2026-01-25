# Markdown-Based CMS and Page Building Research

> Comprehensive guide to building rich, multi-section pages with markdown-based content management systems.

**Last Updated:** 2026-01-23

---

## Table of Contents

- [Overview](#overview)
- [Sitepins CMS](#sitepins-cms)
  - [What is Sitepins?](#what-is-sitepins)
  - [Content Schemas](#content-schemas)
  - [Content Snippets](#content-snippets)
  - [WYSIWYG Editor](#wysiwyg-editor)
  - [Configuration](#configuration)
- [TinaCMS Block-Based Page Building](#tinacms-block-based-page-building)
- [Hugo Blox Page Builder](#hugo-blox-page-builder)
- [Front Matter CMS](#front-matter-cms)
- [Decap CMS](#decap-cms)
- [Comparison Matrix](#comparison-matrix)
- [Implementation Patterns](#implementation-patterns)

---

## Overview

Markdown-based CMSs provide visual editing interfaces for static site generators while keeping content in version-controlled files. The key challenge is **creating rich pages with multiple sections** when content isn't just a single markdown body.

### Core Approaches

| Approach                    | Description                                                      | Best For                              |
|-----------------------------|------------------------------------------------------------------|---------------------------------------|
| **Frontmatter Fields**      | Define structured data in YAML/TOML at the top of markdown files | Simple metadata, page settings        |
| **Content Schemas**         | JSON/config files defining field types and structure             | Consistent content types across files |
| **Block/Section Templates** | Reusable, typed content blocks that can be arranged              | Landing pages, flexible layouts       |
| **Shortcodes/Snippets**     | Reusable code snippets inserted into content                     | Embedded components, widgets          |

---

## Sitepins CMS

### What is Sitepins?

[Sitepins](https://sitepins.com/) is a Git-based headless CMS designed for static site generators like Hugo, Astro, Next.js, and others.

**Key Characteristics:**

- **Zero Configuration Required** - No manual schema creation needed; auto-detects content structure
- **Git-First Workflow** - All changes committed to your Git repository
- **Cloud-Based** - No installation; runs in the browser
- **Visual + Raw Editing** - Toggle between WYSIWYG and code/markdown modes

**Supported Formats:**

- Markdown (`.md`)
- MDX (`.mdx`)
- JSON
- YAML
- TOML

### Content Schemas

Schemas define the structure and fields for content files, enabling consistent content creation.

#### Schema Location

```text
.sitepins/schema/
├── blog.json       # Schema for blog posts
├── pages.json      # Schema for static pages
└── events.json     # Schema for events
```

#### Schema Structure

```json
{
  "name": "Blog Post",
  "file": "content/blog/example-post.md",
  "fileType": "md",
  "fmType": "yaml",
  "template": [
    {
      "name": "title",
      "type": "text",
      "label": "Post Title",
      "required": true
    },
    {
      "name": "date",
      "type": "datetime",
      "label": "Publish Date",
      "required": true
    },
    {
      "name": "author",
      "type": "text",
      "label": "Author Name",
      "default": "John Doe"
    },
    {
      "name": "draft",
      "type": "boolean",
      "label": "Draft Status",
      "default": true
    },
    {
      "name": "tags",
      "type": "array",
      "label": "Tags",
      "default": []
    },
    {
      "name": "featured_image",
      "type": "text",
      "label": "Featured Image"
    },
    {
      "name": "sections",
      "type": "object",
      "label": "Page Sections"
    }
  ]
}
```

#### Supported Field Types

| Type       | Description                      | Use Case                        |
|------------|----------------------------------|---------------------------------|
| `text`     | Single-line text input           | Titles, names, short strings    |
| `textarea` | Multi-line text input            | Descriptions, excerpts          |
| `number`   | Numeric values                   | Counts, prices, order           |
| `boolean`  | True/false toggle                | Draft status, featured flags    |
| `date`     | Date picker                      | Publish dates                   |
| `datetime` | Date and time picker             | Timestamps with time            |
| `select`   | Dropdown with predefined options | Categories, status              |
| `array`    | List of values                   | Tags, categories, related items |
| `object`   | Nested fields                    | Complex structured data         |

#### Schema Inheritance

Sitepins supports schema inheritance for nested folder structures:

```text
.sitepins/schema/blog.json    # Parent schema
content/
  blog/
    2024/
      post-1.md               # Uses blog schema
      post-2.md               # Uses blog schema
    2025/
      post-3.md               # Uses blog schema
```

If a subfolder doesn't have its own schema, Sitepins searches parent folders.

### Content Snippets

Snippets are reusable code blocks (shortcodes, JSX components, HTML) that can be quickly inserted while editing.

#### Snippet Location

```text
.sitepins/snippet/
├── youtube-embed.json
├── call-to-action.json
└── info-box.json
```

#### Creating Snippets

1. Write your shortcode/component in the editor
2. Hover over the block
3. Click the "+" icon in the toolbar
4. Name your snippet
5. Save

#### Using Snippets

1. Click the **Snippets** button (+) in the editor toolbar
2. Select a snippet from the list
3. Sitepins inserts the code at cursor position

**Smart Insertion:** Block-level snippets automatically convert to inline when inserted inside paragraphs.

#### Linking Snippets to Schemas

Associate snippets with specific schemas to show only relevant snippets when editing certain content types.

### WYSIWYG Editor

Sitepins provides two editing modes:

#### Visual Editor (Default)

- Rich text formatting (bold, italic, headings, lists)
- Inline shortcode rendering
- Media insertion via drag-and-drop
- Real-time preview

#### Raw/Code Mode

- Monaco editor (VS Code engine)
- Multi-language syntax highlighting (MDX, JSON, YAML, CSS)
- Standard shortcuts (`Cmd+S` to commit, `Cmd+R` to reset)
- Full markdown control

Toggle between modes using the `isRawMode` setting or editor toggle button.

### Configuration

#### Site Configuration File

Sitepins auto-detects configuration by looking for `.sitepins.json` in the repository root:

```json
{
  "content": {
    "root": "content"
  },
  "media": {
    "root": "public/media"
  }
}
```

#### Configuration Fields

| Field          | Description                 | Example                         |
|----------------|-----------------------------|---------------------------------|
| `content.root` | Base path for content files | `content`, `src/content`        |
| `media.root`   | Base path for media assets  | `public/media`, `static/images` |
| `provider`     | Git provider                | `Github`, `Gitlab`              |
| `branch`       | Active branch               | `main`, `master`                |

---

## TinaCMS Block-Based Page Building

[TinaCMS](https://tina.io/) provides a powerful block-based editing system for building full pages from pre-defined sections.

### Concept

Blocks are typed templates that editors can arrange to compose pages. Each block has its own schema and can be reordered, added, or removed.

### Schema Definition

```typescript
import { defineConfig } from 'tinacms';
import type { Template } from 'tinacms';

// Define a Hero block
const heroBlock: Template = {
  name: 'hero',
  label: 'Hero',
  fields: [
    {
      type: 'string',
      label: 'Tagline',
      name: 'tagline',
    },
    {
      type: 'string',
      label: 'Headline',
      name: 'headline',
    },
    {
      type: 'string',
      label: 'Text',
      name: 'text',
      ui: {
        component: 'textarea',
      },
    },
  ],
};

// Define a Features block
const featureBlock: Template = {
  name: 'features',
  label: 'Features',
  fields: [
    {
      type: 'object',
      label: 'Feature Items',
      name: 'items',
      list: true,
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'string',
          label: 'Text',
          name: 'text',
        },
      ],
    },
  ],
};

// Define a Content block
const contentBlock: Template = {
  name: 'content',
  label: 'Content',
  fields: [
    {
      type: 'string',
      ui: {
        component: 'textarea',
      },
      label: 'Body',
      name: 'body',
    },
  ],
};

// Collection configuration
export default defineConfig({
  schema: {
    collections: [
      {
        name: 'pages',
        label: 'Pages',
        path: 'content/pages',
        fields: [
          {
            type: 'object',
            list: true,
            name: 'blocks',
            label: 'Sections',
            templates: [heroBlock, featureBlock, contentBlock],
          },
        ],
      },
    ],
  },
});
```

### Visual Block Selector

Enable visual previews for blocks:

```typescript
const featureBlock = {
  name: 'features',
  label: 'Features',
  ui: {
    previewSrc: 'https://example.com/feature-preview.png',
    category: 'Page Section',
  },
  fields: [
    // ... field definitions
  ],
};
```

Then enable in the parent field:

```typescript
{
  type: 'object',
  list: true,
  name: 'blocks',
  label: 'Sections',
  ui: {
    visualSelector: true,
  },
  templates: [heroBlock, featureBlock, contentBlock],
}
```

### Querying Block Data

Use GraphQL fragments to query block data:

```graphql
{
  pages(relativePath: "home.json") {
    blocks {
      __typename
      ... on PagesBlocksHero {
        tagline
        headline
        text
      }
      ... on PagesBlocksFeatures {
        items {
          title
          text
        }
      }
      ... on PagesBlocksContent {
        body
      }
    }
  }
}
```

### Rendering Blocks

```tsx
// Blocks.tsx
import React from 'react';
import type { Pages } from '../tina/__generated__/types';
import { Content } from './blocks/content';
import { Features } from './blocks/features';
import { Hero } from './blocks/hero';

export const Blocks = (props: Pages) => {
  return (
    <>
      {props.blocks?.map((block, i) => {
        switch (block.__typename) {
          case 'PagesBlocksContent':
            return <Content key={i} data={block} />;
          case 'PagesBlocksHero':
            return <Hero key={i} data={block} />;
          case 'PagesBlocksFeatures':
            return <Features key={i} data={block} />;
          default:
            return null;
        }
      })}
    </>
  );
};
```

---

## Hugo Blox Page Builder

[Hugo Blox](https://hugoblox.com/) (formerly Wowchemy) provides a block-based page builder specifically for Hugo.

### Concept

Landing pages are defined in `content/_index.md` with a list of `sections`, where each section uses a specific `block` (design).

### Basic Structure

```yaml
---
title: Home
type: landing

sections:
  - block: markdown
    content:
      title: Welcome
      text: Hello World!

  - block: collection
    content:
      title: Latest Posts
    design:
      view: card
---
```

### Available Blocks

| Block             | Description                              |
|-------------------|------------------------------------------|
| `markdown`        | Custom content with rich text            |
| `hero`            | Hero banner with background image        |
| `collection`      | Display posts, projects, or publications |
| `about.biography` | Personal biography section               |
| `contact`         | Contact form                             |
| `portfolio`       | Project showcase grid                    |
| `experience`      | Timeline of experience                   |
| `skills`          | Skills visualization                     |
| `features`        | Feature list with icons                  |
| `cta`             | Call-to-action section                   |

### Example: Hero Section

```yaml
- block: markdown
  id: hero
  content:
    title: Hi, I'm George
    subtitle: I build open source software.
    text: Welcome to my portfolio.
  design:
    background:
      image:
        filename: bg.jpg
      filters:
        brightness: 0.5
```

### Customizing Blocks

#### Backgrounds

```yaml
design:
  background:
    image:
      filename: background.jpg
      parallax: true
    filters:
      brightness: 0.6
```

Or solid colors:

```yaml
design:
  background:
    color: '#1a1a2e'
```

Or gradients:

```yaml
design:
  background:
    gradient_start: '#4a00e0'
    gradient_end: '#8e2de2'
```

#### Spacing & Style

```yaml
design:
  spacing:
    # Top, Right, Bottom, Left
    padding: ['20px', '0', '20px', '0']
  css_class: 'my-custom-class'
```

#### Collection Views

| View       | Description                                  |
|------------|----------------------------------------------|
| `showcase` | Large featured images with side-by-side text |
| `card`     | Standard grid of cards                       |
| `compact`  | Minimal list with thumbnails                 |
| `masonry`  | Pinterest-style layout                       |

---

## Front Matter CMS

[Front Matter](https://frontmatter.codes/) is a VS Code extension providing CMS functionality directly in the editor.

### Field Types

```json
{
  "frontMatter.taxonomy.contentTypes": [
    {
      "name": "blog",
      "pageBundle": false,
      "fields": [
        { "name": "title", "type": "string" },
        { "name": "description", "type": "string" },
        { "name": "date", "type": "datetime" },
        { "name": "draft", "type": "boolean" },
        { "name": "tags", "type": "tags" },
        { "name": "categories", "type": "categories" },
        {
          "name": "author",
          "type": "fields",
          "fields": [
            { "name": "name", "type": "string" },
            { "name": "avatar", "type": "image" }
          ]
        },
        {
          "name": "sections",
          "type": "block",
          "fieldGroup": ["hero", "features", "cta"]
        }
      ]
    }
  ]
}
```

### Block Fields

Define reusable field groups:

```json
{
  "frontMatter.taxonomy.fieldGroups": [
    {
      "id": "hero",
      "fields": [
        { "name": "title", "type": "string" },
        { "name": "subtitle", "type": "string" },
        { "name": "image", "type": "image" },
        { "name": "cta_text", "type": "string" },
        { "name": "cta_link", "type": "string" }
      ]
    },
    {
      "id": "features",
      "fields": [
        { "name": "title", "type": "string" },
        {
          "name": "items",
          "type": "block",
          "fieldGroup": ["feature_item"]
        }
      ]
    }
  ]
}
```

### WYSIWYG Support

Enable rich text editing on string fields:

```json
{
  "name": "description",
  "type": "string",
  "wysiwyg": true
}
```

Options: `true` (HTML output), `"html"`, `"markdown"`

---

## Decap CMS

[Decap CMS](https://decapcms.org/) (formerly Netlify CMS) provides a Git-based CMS with extensive widget support.

### Markdown Widget

```yaml
- name: body
  label: Body
  widget: markdown
  buttons:
    - bold
    - italic
    - code
    - link
    - heading-one
    - heading-two
    - quote
    - bulleted-list
    - numbered-list
  editor_components:
    - image
    - code-block
  modes:
    - raw
    - rich_text
```

### Variable Types / Blocks

```yaml
- name: sections
  label: Page Sections
  widget: list
  types:
    - name: hero
      label: Hero Section
      widget: object
      fields:
        - { name: title, label: Title, widget: string }
        - { name: subtitle, label: Subtitle, widget: string }
        - { name: image, label: Background Image, widget: image }
    - name: features
      label: Features Section
      widget: object
      fields:
        - { name: title, label: Title, widget: string }
        - name: items
          label: Feature Items
          widget: list
          fields:
            - { name: icon, label: Icon, widget: string }
            - { name: title, label: Title, widget: string }
            - { name: description, label: Description, widget: text }
    - name: cta
      label: Call to Action
      widget: object
      fields:
        - { name: text, label: Button Text, widget: string }
        - { name: url, label: Button URL, widget: string }
```

### Custom Editor Components

Register custom components for the markdown editor:

```javascript
CMS.registerEditorComponent({
  id: 'youtube',
  label: 'YouTube',
  fields: [
    { name: 'id', label: 'Video ID', widget: 'string' }
  ],
  pattern: /{{< youtube (\S+) >}}/,
  fromBlock: match => ({ id: match[1] }),
  toBlock: ({ id }) => `{{< youtube ${id} >}}`,
  toPreview: ({ id }) => `<img src="https://img.youtube.com/vi/${id}/0.jpg" />`,
});
```

---

## Comparison Matrix

| Feature                   | Sitepins     | TinaCMS            | Hugo Blox             | Front Matter     | Decap CMS      |
|---------------------------|--------------|--------------------|-----------------------|------------------|----------------|
| **Setup Complexity**      | Zero config  | Schema required    | Minimal               | VS Code config   | Admin config   |
| **Block/Section Support** | Via schemas  | First-class        | First-class           | Via field groups | Via list types |
| **WYSIWYG Editor**        | Yes (toggle) | Yes                | No (frontmatter only) | Yes (in VS Code) | Yes            |
| **Visual Block Selector** | No           | Yes (experimental) | No                    | No               | No             |
| **Git Integration**       | Native       | Native             | N/A (Hugo native)     | Native           | Native         |
| **SSG Support**           | All          | All                | Hugo only             | All              | All            |
| **Self-Hosted Option**    | Cloud only   | Yes                | N/A                   | Local only       | Yes            |
| **Pricing**               | $17/mo+      | Free/Paid          | Free                  | Free             | Free           |

---

## Implementation Patterns

### Pattern 1: Frontmatter Sections (Hugo/Any SSG)

Define sections directly in frontmatter:

```yaml
---
title: Home
sections:
  - type: hero
    title: Welcome
    subtitle: Build amazing things
    image: /images/hero.jpg
    cta:
      text: Get Started
      link: /contact/

  - type: features
    title: Why Choose Us
    items:
      - icon: rocket
        title: Fast
        description: Lightning quick performance
      - icon: shield
        title: Secure
        description: Enterprise-grade security

  - type: testimonials
    title: What People Say
    quotes:
      - text: "Amazing product!"
        author: Jane Doe
        role: CEO, Acme Inc
---
```

### Pattern 2: Data Files + Partials

Separate data from templates:

```yaml
# data/home/sections.yaml
- partial: hero
  data:
    title: Welcome
    subtitle: Build amazing things

- partial: features
  data:
    title: Why Choose Us
    items:
      - icon: rocket
        title: Fast
```

```html
<!-- layouts/index.html -->
{{ range .Site.Data.home.sections }}
  {{ partial (printf "sections/%s.html" .partial) .data }}
{{ end }}
```

### Pattern 3: Page Bundles with Section Files

```text
content/
  _index.md
  sections/
    01-hero.md
    02-features.md
    03-testimonials.md
```

Each section file contains its own frontmatter and content.

### Pattern 4: JSON Data with MDX Components

For Next.js/Astro with MDX:

```json
{
  "sections": [
    {
      "component": "Hero",
      "props": {
        "title": "Welcome",
        "subtitle": "Build amazing things"
      }
    },
    {
      "component": "Features",
      "props": {
        "items": [...]
      }
    }
  ]
}
```

---

## Sources

- [Sitepins Documentation](https://docs.sitepins.com/)
- [Sitepins Developer Docs](https://developer.sitepins.com/)
- [TinaCMS Block-Based Editing](https://tina.io/docs/editing/blocks)
- [TinaCMS Schema Reference](https://tina.io/docs/schema)
- [Hugo Blox Page Builder](https://docs.hugoblox.com/guides/blocks/)
- [Front Matter CMS Fields](https://frontmatter.codes/docs/content-creation/fields)
- [Decap CMS Markdown Widget](https://decapcms.org/docs/widgets/markdown/)
- [Hugo Discourse: Sitepins Discussion](https://discourse.gohugo.io/t/sitepins-a-simple-cms-for-hugo-no-config-needed/55388)
