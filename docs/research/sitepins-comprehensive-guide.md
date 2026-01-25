# Comprehensive Sitepins Documentation Guide

> Complete technical reference for Sitepins CMS integration with Hugo sites. Compiled from official documentation at <https://docs.sitepins.com/> and <https://developer.sitepins.com/>

**Last Updated:** 2026-01-23
**Status:** Complete Reference Guide
**Scope:** Covers all guides, configuration, schemas, snippets, and developer features

---

## Table of Contents

1. [Overview & Getting Started](#overview--getting-started)
2. [Site Configuration](#site-configuration)
3. [Content Schemas](#content-schemas)
4. [Content Snippets](#content-snippets)
5. [Media Library Management](#media-library-management)
6. [Sidebar Customization](#sidebar-customization)
7. [AI Content Tools](#ai-content-tools)
8. [Developer Configuration](#developer-configuration)
9. [Integration Patterns](#integration-patterns)
10. [Best Practices & Tips](#best-practices--tips)

---

## Overview & Getting Started

### What is Sitepins?

Sitepins is a Git-based headless CMS designed for static site generators (Hugo, Astro, Next.js, 11ty, Jekyll, etc.).

**Key Characteristics:**

- **Zero Configuration Required** - Auto-detects content structure; no manual schema setup needed
- **Git-First Workflow** - All changes committed directly to your Git repository
- **Cloud-Based** - No installation required; runs entirely in the browser
- **Dual Editing Modes** - Toggle between visual WYSIWYG editor and raw code editor
- **Multi-Format Support** - Markdown, MDX, JSON, YAML, TOML

**Supported Formats:**

| Format   | Extension        | Use Case                        |
|----------|------------------|---------------------------------|
| Markdown | `.md`            | Blog posts, content pages       |
| MDX      | `.mdx`           | React/Vue components in content |
| JSON     | `.json`          | Structured data, page blocks    |
| YAML     | `.yaml` / `.yml` | Data files, configuration       |
| TOML     | `.toml`          | Configuration files             |

### Getting Started Steps

#### Step 1: Register & Connect Repository

1. Visit <https://sitepins.com/>
2. Sign up with GitHub account
3. Select repository to connect (`cneller/pikeandwest.com`)
4. Grant Sitepins permission to read/write repository
5. Sitepins automatically detects folder structure

**Note:** Sitepins uses GitHub's OAuth flow. No personal access token needed.

#### Step 2: Configure Content Folders

Sitepins auto-detects these standard locations:

```text
content/          ← Content files (markdown, MDX)
data/             ← Data files (YAML, JSON, TOML)
static/images/    ← Media files (images, videos, documents)
config/           ← Configuration files
```

**Optional:** Create `.sitepins.json` in root to explicitly configure:

```json
{
  "content": {
    "root": "content"
  },
  "media": {
    "root": "static/images"
  }
}
```

#### Step 3: Set User Roles

| Role   | Permissions                            | Use Case                  |
|--------|----------------------------------------|---------------------------|
| Admin  | Full access, settings, user management | Project owner, developers |
| Editor | Create/edit content, commit changes    | Content team, writers     |
| Viewer | Read-only preview access               | Stakeholders, clients     |

---

## Site Configuration

### Configuration File Format

Sitepins looks for `.sitepins.json` in repository root. If not found, uses defaults.

### Complete Configuration Reference

```json
{
  "name": "Pike & West",
  "description": "Event venue CMS configuration",

  "content": {
    "root": "content",
    "fmType": "yaml"
  },

  "media": {
    "root": "static/images",
    "uploadPath": "/uploads/",
    "cdnUrl": "https://cdn.example.com/"
  },

  "provider": "github",
  "branch": "main",

  "ai": {
    "enabled": true,
    "openaiApiKey": "sk-...",
    "defaultModel": "gpt-4"
  },

  "editor": {
    "isRawMode": false,
    "theme": "light"
  },

  "preview": {
    "enabled": true,
    "url": "https://pikeandwest.com/",
    "deployPreview": true
  }
}
```

### Configuration Fields Explained

#### `content` Object

| Field            | Type   | Default     | Description                                   |
|------------------|--------|-------------|-----------------------------------------------|
| `root`           | string | `"content"` | Base directory for content files              |
| `fmType`         | string | `"yaml"`    | Frontmatter format: `yaml`, `toml`, or `json` |
| `ignorePatterns` | array  | `[]`        | Glob patterns to exclude from CMS             |

**Example ignoring certain folders:**

```json
{
  "content": {
    "root": "content",
    "ignorePatterns": ["**/draft/**", "**/_*.md"]
  }
}
```

#### `media` Object

| Field         | Type   | Default           | Description                 |
|---------------|--------|-------------------|-----------------------------|
| `root`        | string | `"static/images"` | Media storage directory     |
| `uploadPath`  | string | `"/uploads/"`     | URL path for uploaded media |
| `cdnUrl`      | string | `null`            | Optional CDN base URL       |
| `maxFileSize` | number | `50`              | Max upload size in MB       |

**Example with external CDN:**

```json
{
  "media": {
    "root": "static/images",
    "uploadPath": "/images/",
    "cdnUrl": "https://ik.imagekit.io/pikeandwest/",
    "maxFileSize": 100
  }
}
```

#### `provider` & `branch`

| Field      | Values                 | Description                       |
|------------|------------------------|-----------------------------------|
| `provider` | `"github"`, `"gitlab"` | Git hosting provider              |
| `branch`   | string                 | Active branch (default: `"main"`) |

#### `editor` Object

| Field         | Type    | Default   | Description                         |
|---------------|---------|-----------|-------------------------------------|
| `isRawMode`   | boolean | `false`   | Start in raw code editor by default |
| `theme`       | string  | `"light"` | Editor theme: `"light"` or `"dark"` |
| `fontSize`    | number  | `14`      | Editor font size in pixels          |
| `lineNumbers` | boolean | `true`    | Show line numbers in code editor    |

#### `preview` Object

| Field           | Type    | Default | Description                                 |
|-----------------|---------|---------|---------------------------------------------|
| `enabled`       | boolean | `true`  | Enable live preview                         |
| `url`           | string  | `null`  | Preview URL (Hugo dev server, Vercel, etc.) |
| `deployPreview` | boolean | `false` | Enable deploy previews on PR                |

---

## Content Schemas

### Schema Purpose

Schemas define the structure and allowed fields for content files. They enable:

- Consistent content creation across team
- Field validation (required, type checking, limits)
- Rich editing UI (date pickers, dropdowns, multi-select)
- Smart defaults and helper text

### Schema Location & Structure

Schemas are stored in `.sitepins/schema/` directory:

```text
.sitepins/
├── schema/
│   ├── blog.json          # Schema for blog posts
│   ├── pages.json         # Schema for static pages
│   ├── events.json        # Schema for event content
│   └── _default.json      # Fallback schema (optional)
└── snippet/
    └── (see Content Snippets section)
```

### Complete Schema Structure

```json
{
  "name": "Blog Post",
  "description": "Blog post template with editorial metadata",

  "file": "content/blog/example-post.md",
  "fileType": "md",
  "fmType": "yaml",

  "template": [
    {
      "name": "title",
      "type": "text",
      "label": "Post Title",
      "description": "Main heading for the article",
      "required": true,
      "placeholder": "e.g., Planning Tips for Winter Weddings",
      "maxLength": 100,
      "minLength": 10
    },
    {
      "name": "description",
      "type": "textarea",
      "label": "Meta Description",
      "description": "SEO description (150-160 chars)",
      "required": true,
      "maxLength": 160,
      "help": "Used in search results"
    },
    {
      "name": "date",
      "type": "datetime",
      "label": "Publish Date",
      "required": true,
      "default": "{{ now | date:'2006-01-02' }}"
    },
    {
      "name": "author",
      "type": "text",
      "label": "Author",
      "default": "Pike & West"
    },
    {
      "name": "draft",
      "type": "boolean",
      "label": "Draft Status",
      "description": "Uncheck to publish",
      "default": true
    },
    {
      "name": "categories",
      "type": "array",
      "label": "Categories",
      "items": {
        "type": "text"
      }
    },
    {
      "name": "tags",
      "type": "array",
      "label": "Tags",
      "items": {
        "type": "text"
      }
    },
    {
      "name": "image",
      "type": "text",
      "label": "Featured Image",
      "required": true,
      "help": "Path relative to static/ (e.g., images/blog/post-title.jpg)"
    },
    {
      "name": "image_alt",
      "type": "text",
      "label": "Image Alt Text",
      "required": true,
      "description": "Descriptive alt text for accessibility"
    },
    {
      "name": "sections",
      "type": "object",
      "label": "Page Sections",
      "fields": [
        {
          "name": "hero",
          "type": "boolean",
          "label": "Show Hero Section",
          "default": true
        },
        {
          "name": "toc",
          "type": "boolean",
          "label": "Show Table of Contents",
          "default": false
        }
      ]
    }
  ]
}
```

### Supported Field Types

#### Text & Textarea

```json
{
  "name": "title",
  "type": "text",
  "label": "Title",
  "required": true,
  "maxLength": 100,
  "minLength": 5,
  "placeholder": "Enter title...",
  "pattern": "^[A-Za-z0-9 ]+$",
  "help": "Helper text displayed below field"
}
```

```json
{
  "name": "description",
  "type": "textarea",
  "label": "Description",
  "rows": 5,
  "maxLength": 500,
  "placeholder": "Longer text content..."
}
```

#### Number

```json
{
  "name": "event_capacity",
  "type": "number",
  "label": "Venue Capacity",
  "required": true,
  "min": 0,
  "max": 500,
  "step": 10,
  "default": 150
}
```

#### Boolean (Toggle)

```json
{
  "name": "published",
  "type": "boolean",
  "label": "Published",
  "default": false,
  "description": "Toggle to publish this page"
}
```

#### Date & DateTime

```json
{
  "name": "event_date",
  "type": "date",
  "label": "Event Date",
  "required": true,
  "default": "{{ now | date:'2006-01-02' }}"
}
```

```json
{
  "name": "published_at",
  "type": "datetime",
  "label": "Published At",
  "required": true,
  "description": "Date and time of publication"
}
```

#### Select (Dropdown)

```json
{
  "name": "event_type",
  "type": "select",
  "label": "Event Type",
  "required": true,
  "options": [
    { "value": "wedding", "label": "Wedding" },
    { "value": "corporate", "label": "Corporate Event" },
    { "value": "private", "label": "Private Party" },
    { "value": "workshop", "label": "Workshop" }
  ],
  "default": "wedding"
}
```

#### Array (List)

```json
{
  "name": "tags",
  "type": "array",
  "label": "Tags",
  "items": {
    "type": "text"
  },
  "minItems": 1,
  "maxItems": 10,
  "default": []
}
```

#### Object (Nested Fields)

```json
{
  "name": "author",
  "type": "object",
  "label": "Author Info",
  "fields": [
    {
      "name": "name",
      "type": "text",
      "label": "Author Name",
      "required": true
    },
    {
      "name": "email",
      "type": "text",
      "label": "Email",
      "pattern": "^[^@]+@[^@]+\\.[^@]+$"
    },
    {
      "name": "bio",
      "type": "textarea",
      "label": "Bio"
    }
  ]
}
```

### Field Properties (All Types)

| Property      | Type    | Description                                |
|---------------|---------|--------------------------------------------|
| `name`        | string  | Field identifier (matches frontmatter key) |
| `type`        | string  | Field type (text, textarea, number, etc.)  |
| `label`       | string  | Display label in editor                    |
| `description` | string  | Helper text below field                    |
| `required`    | boolean | Mark field as required                     |
| `default`     | any     | Default value when creating new content    |
| `placeholder` | string  | Placeholder text in input                  |
| `help`        | string  | Additional help text                       |
| `hidden`      | boolean | Hide from editor (computed fields)         |
| `disabled`    | boolean | Disable editing (read-only)                |

### Schema Inheritance & Folder Structure

Sitepins automatically applies schemas based on folder hierarchy:

```text
.sitepins/schema/
├── blog.json           # Applied to content/blog/* files
├── pages.json          # Applied to content/pages/* files

content/
├── blog/
│   ├── 2024/
│   │   ├── post-1.md   ← Uses blog.json schema
│   │   └── post-2.md   ← Uses blog.json schema
│   └── 2025/
│       └── post-3.md   ← Uses blog.json schema (inherited)
├── pages/
│   ├── about.md        ← Uses pages.json schema
│   └── contact.md      ← Uses pages.json schema
```

**Inheritance rules:**

1. Sitepins looks for schema file matching parent folder name
2. If not found, searches parent folder recursively
3. Falls back to `_default.json` if available
4. Uses empty schema (no validation) if none found

### Example: Complete Event Schema

For Pike & West events:

```json
{
  "name": "Event",
  "description": "Event listing with venue details",

  "file": "content/events/example-event.md",
  "fileType": "md",
  "fmType": "yaml",

  "template": [
    {
      "name": "title",
      "type": "text",
      "label": "Event Title",
      "required": true,
      "help": "e.g., Sarah & Michael's Wedding"
    },
    {
      "name": "event_type",
      "type": "select",
      "label": "Event Type",
      "required": true,
      "options": [
        { "value": "wedding", "label": "Wedding" },
        { "value": "corporate", "label": "Corporate Event" },
        { "value": "private", "label": "Private Party" }
      ]
    },
    {
      "name": "date",
      "type": "date",
      "label": "Event Date",
      "required": true
    },
    {
      "name": "start_time",
      "type": "text",
      "label": "Start Time",
      "placeholder": "HH:MM",
      "pattern": "^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
    },
    {
      "name": "guest_count",
      "type": "number",
      "label": "Guest Count",
      "min": 1,
      "max": 500
    },
    {
      "name": "venue",
      "type": "object",
      "label": "Venue Details",
      "fields": [
        {
          "name": "space_used",
          "type": "select",
          "label": "Space(s) Used",
          "options": [
            { "value": "main_hall", "label": "Main Hall" },
            { "value": "gallery", "label": "Art Gallery" },
            { "value": "full", "label": "Full Venue" }
          ]
        },
        {
          "name": "catering",
          "type": "boolean",
          "label": "Catering Provided",
          "default": false
        }
      ]
    },
    {
      "name": "organizer_email",
      "type": "text",
      "label": "Organizer Email",
      "required": true,
      "pattern": "^[^@]+@[^@]+\\.[^@]+$"
    },
    {
      "name": "featured_image",
      "type": "text",
      "label": "Featured Image",
      "help": "Path to event photo (e.g., images/events/wedding-2024.jpg)"
    },
    {
      "name": "draft",
      "type": "boolean",
      "label": "Draft",
      "default": true
    }
  ]
}
```

---

## Content Snippets

### Snippet Purpose

Snippets are reusable code blocks (Hugo shortcodes, HTML, JSX) that editors can quickly insert while editing. They save time and ensure consistency.

### Snippet Location & Format

Snippets are stored in `.sitepins/snippet/` directory as JSON files:

```text
.sitepins/snippet/
├── youtube-embed.json
├── contact-cta.json
├── testimonial-quote.json
├── image-gallery.json
└── tip-box.json
```

### Complete Snippet Structure

```json
{
  "name": "YouTube Video",
  "description": "Embed a YouTube video with responsive sizing",

  "label": "YouTube Embed",
  "icon": "video",
  "category": "Media",

  "trigger": "{{< youtube",
  "pattern": "{{< youtube (\\S+) >}}",

  "shortcodeType": "hugo",
  "template": "{{< youtube ${videoId} >}}",

  "fields": [
    {
      "name": "videoId",
      "label": "Video ID",
      "placeholder": "e.g., dQw4w9WgXcQ",
      "help": "YouTube video ID from URL",
      "required": true
    }
  ],

  "preview": {
    "type": "html",
    "content": "<img src='https://img.youtube.com/vi/${videoId}/0.jpg' />"
  }
}
```

### Snippet Field Properties

| Property        | Type   | Description                                            |
|-----------------|--------|--------------------------------------------------------|
| `name`          | string | Snippet name                                           |
| `description`   | string | What this snippet does                                 |
| `label`         | string | Display label in editor                                |
| `icon`          | string | Icon name for visual identification                    |
| `category`      | string | Group in snippet browser (e.g., "Media", "Components") |
| `trigger`       | string | Quick insert trigger text                              |
| `pattern`       | regex  | Pattern to recognize existing snippets                 |
| `shortcodeType` | string | `"hugo"`, `"html"`, `"jsx"`, etc.                      |
| `template`      | string | Template with `${variable}` placeholders               |
| `fields`        | array  | Input fields for dynamic values                        |
| `preview`       | object | Preview HTML for visual representation                 |

### Built-In Snippet Examples

#### Contact CTA

```json
{
  "name": "Contact Button",
  "label": "Contact CTA",
  "category": "Components",
  "template": "{{< cta-button text=\"Get in Touch\" url=\"/contact\" style=\"primary\" >}}",
  "shortcodeType": "hugo"
}
```

#### Image Gallery

```json
{
  "name": "Image Gallery",
  "label": "Photo Gallery",
  "category": "Media",
  "template": "{{< gallery folder=\"${folderPath}\" columns=\"${columns}\" >}}",
  "shortcodeType": "hugo",
  "fields": [
    {
      "name": "folderPath",
      "label": "Image Folder",
      "placeholder": "images/gallery/wedding-2024"
    },
    {
      "name": "columns",
      "label": "Columns",
      "type": "select",
      "options": [
        { "value": "2", "label": "2 Columns" },
        { "value": "3", "label": "3 Columns" },
        { "value": "4", "label": "4 Columns" }
      ],
      "default": "3"
    }
  ]
}
```

#### Pull Quote

```json
{
  "name": "Pull Quote",
  "label": "Pull Quote",
  "category": "Editorial",
  "template": "{{< pull-quote >}}${quote}{{< /pull-quote >}}",
  "shortcodeType": "hugo",
  "fields": [
    {
      "name": "quote",
      "label": "Quote Text",
      "placeholder": "Enter quoted text...",
      "required": true
    }
  ]
}
```

#### Tip Box

```json
{
  "name": "Tip Box",
  "label": "Planning Tip",
  "category": "Content Blocks",
  "template": "{{< tip title=\"${title}\" >}}${content}{{< /tip >}}",
  "shortcodeType": "hugo",
  "fields": [
    {
      "name": "title",
      "label": "Tip Title",
      "placeholder": "e.g., Pro Tip"
    },
    {
      "name": "content",
      "label": "Tip Content",
      "type": "textarea",
      "placeholder": "Enter tip text..."
    }
  ]
}
```

### Using Snippets in Editor

1. **Insert in CMS Editor:**
   - Click the **Snippets** button (+) in editor toolbar
   - Search or browse snippet library
   - Click snippet to insert at cursor position
   - Fill in any required fields

2. **Smart Insertion:**
   - Block-level snippets auto-convert to inline if inserted in paragraph
   - Already-formatted snippets recognized via pattern matching
   - Template variables automatically filled with field inputs

3. **Creating New Snippets:**
   - Write shortcode/component in editor
   - Hover over code block
   - Click the save snippet icon
   - Name snippet and choose category
   - Sitepins converts it to reusable snippet format

### Linking Snippets to Schemas

Associate snippets with specific content types to show only relevant snippets:

```json
{
  "name": "Blog Post",
  "schema": "blog",
  "snippets": [
    "youtube-embed",
    "pull-quote",
    "tip-box",
    "image-gallery"
  ]
}
```

When editing a blog post, only these snippets appear in the snippet browser.

---

## Media Library Management

### Media Storage & Organization

Media files are stored in configured directory (default: `static/images/`):

```text
static/images/
├── hero/
│   ├── venue-exterior-1920w.jpg
│   └── disco-ball-overlay.png
├── venue/
│   ├── main-hall-daytime.jpg
│   ├── gallery-space.jpg
│   └── outdoor-patio.jpg
├── events/
│   ├── weddings/
│   │   ├── ceremony-setup.jpg
│   │   └── table-centerpiece.jpg
│   ├── corporate/
│   │   └── conference-setup.jpg
│   └── parties/
│       └── dance-floor.jpg
├── blog/
│   ├── post-1-featured.jpg
│   └── post-2-featured.jpg
└── team/
    ├── owner-headshot.jpg
    └── manager-headshot.jpg
```

### Image Naming Convention

Recommended format:

```text
{category}-{description}-{width}w.{format}
```

**Examples:**

- `hero-main-hall-1920w.jpg` - Hero section main image
- `venue-gallery-space-800w.jpg` - Venue gallery image
- `event-wedding-table-800w.jpg` - Wedding event image
- `blog-planning-tips-featured-800w.jpg` - Blog featured image

**Benefits:**

- Descriptive names aid in media browsing
- Width indicator helps size selection
- Consistent naming enables automation

### Image Upload & Management in CMS

**Uploading Images:**

1. Click image field in content editor
2. Upload new file or select existing image
3. Sitepins stores in configured media directory
4. Returns relative path for content use

**Deleting Images:**

- Media Library shows all uploaded images
- Delete from library (removes file from repository)
- Sitepins warns if image used in content

**Finding Images:**

- Search by filename in Media Library
- Filter by folder/category
- Preview thumbnails
- Sort by date uploaded

### Responsive Image Handling

Sitepins supports multiple image formats for optimization:

| Format  | Use Case                        | Browser Support                   |
|---------|---------------------------------|-----------------------------------|
| `.jpg`  | Photos, complex images          | All browsers                      |
| `.png`  | Transparent images, diagrams    | All browsers                      |
| `.webp` | Modern compression              | Chrome, Firefox, Edge, Safari 16+ |
| `.avif` | Best compression                | Chrome 85+, Firefox, Edge, Opera  |
| `.svg`  | Icons, logos, scalable graphics | All modern browsers               |

**Hugo Integration Pattern for Responsive Images:**

```go-html-template
{{ $img := resources.GetMatch "images/venue/main-hall.jpg" }}
{{ $webp := $img.Resize "1200x webp" }}
{{ $jpg := $img.Resize "1200x jpg" }}

<picture>
  <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
  <img src="{{ $jpg.RelPermalink }}" alt="{{ .Params.image_alt }}" loading="lazy">
</picture>
```

### Media Library Optimization Tips

1. **Use Descriptive Names** - Helps team find images quickly
2. **Organize by Purpose** - Separate hero, blog, events, team images
3. **Include Dimensions** - Filename shows image size (e.g., `-1200w`)
4. **Regular Cleanup** - Delete unused images to keep media library lean
5. **Compress Before Upload** - Use ImageMagick or similar for optimization
6. **Alt Text Documentation** - Store alt text in content frontmatter or data files

### External CDN Integration

For advanced media optimization, configure external CDN:

```json
{
  "media": {
    "root": "static/images",
    "cdnUrl": "https://ik.imagekit.io/pikeandwest/",
    "uploadPath": "/images/",
    "maxFileSize": 100
  }
}
```

**With ImageKit:**

```go-html-template
{{ $cdnBase := "https://ik.imagekit.io/pikeandwest/" }}
{{ $img := .Params.image }}

<img
  src="{{ $cdnBase }}{{ $img }}?tr=w-800,f-auto"
  alt="{{ .Params.image_alt }}"
  loading="lazy">
```

---

## Sidebar Customization

### Sidebar Purpose

The sidebar shows content structure and allows quick navigation. It's customizable to match site organization.

### Configuring Sidebar Sections

Sidebar configuration in `.sitepins.json`:

```json
{
  "sidebar": {
    "sections": [
      {
        "title": "Pages",
        "path": "content",
        "type": "folder"
      },
      {
        "title": "Blog",
        "path": "content/blog",
        "type": "folder"
      },
      {
        "title": "Events",
        "path": "content/events",
        "type": "folder"
      },
      {
        "title": "Data",
        "path": "data",
        "type": "folder"
      }
    ],
    "collapsed": false,
    "showFileCount": true
  }
}
```

### Sidebar Properties

| Property        | Type    | Description                        |
|-----------------|---------|------------------------------------|
| `title`         | string  | Display name for section           |
| `path`          | string  | File path to folder                |
| `type`          | string  | `"folder"` for directory structure |
| `icon`          | string  | Icon name (document, folder, etc.) |
| `collapsed`     | boolean | Start section collapsed            |
| `showFileCount` | boolean | Show file count badge              |

### Sidebar Organization Patterns

#### Pattern 1: Content Type Organization

```json
{
  "sidebar": {
    "sections": [
      {
        "title": "Pages",
        "path": "content",
        "icon": "document"
      },
      {
        "title": "Blog Posts",
        "path": "content/blog",
        "icon": "pencil"
      },
      {
        "title": "Events",
        "path": "content/events",
        "icon": "calendar"
      },
      {
        "title": "Configuration",
        "path": "data",
        "icon": "settings"
      }
    ]
  }
}
```

#### Pattern 2: Date-Based Organization

For blog posts organized by year:

```json
{
  "title": "Blog Archive",
  "path": "content/blog",
  "type": "folder"
}
```

Sitepins automatically shows folder structure:

- Blog → 2025 → (posts in 2025)
- Blog → 2024 → (posts in 2024)

#### Pattern 3: Hybrid Organization

```json
{
  "sidebar": {
    "sections": [
      {
        "title": "Main Content",
        "sections": [
          { "title": "Pages", "path": "content" },
          { "title": "Blog", "path": "content/blog" },
          { "title": "Events", "path": "content/events" }
        ]
      },
      {
        "title": "Data & Config",
        "sections": [
          { "title": "Site Data", "path": "data" },
          { "title": "Configuration", "path": "config" }
        ]
      }
    ]
  }
}
```

### Quick Navigation Tips

1. **Starred Frequently Used Files** - Mark important files for quick access
2. **Search** - Use search bar to find files by name
3. **Recent Files** - View recently edited content
4. **File Counts** - See how many files in each section
5. **Breadcrumb Navigation** - Navigate folder hierarchy quickly

---

## AI Content Tools

### AI Features Available

Sitepins integrates OpenAI for AI-assisted content creation:

| Feature                | Description                              | Use Case                  |
|------------------------|------------------------------------------|---------------------------|
| **Content Generation** | Generate full posts from outlines        | Blog post drafting        |
| **Meta Descriptions**  | Auto-generate SEO meta descriptions      | SEO optimization          |
| **Alt Text**           | Generate descriptive alt text for images | Accessibility             |
| **Content Expansion**  | Expand bullet points into paragraphs     | Content enrichment        |
| **Summarization**      | Summarize long content into excerpts     | Preview/abstract creation |
| **Title Suggestions**  | Generate multiple title variations       | SEO headline testing      |
| **Tone Adjustment**    | Rewrite content in different tones       | Brand voice consistency   |

### Enabling AI Features

1. **Add OpenAI API Key to .sitepins.json:**

```json
{
  "ai": {
    "enabled": true,
    "openaiApiKey": "sk-proj-...",
    "defaultModel": "gpt-4",
    "maxTokens": 2000
  }
}
```

2. **Get API Key from OpenAI:**
   - Visit <https://platform.openai.com/api-keys>
   - Create new secret key
   - Copy and paste into .sitepins.json
   - **Important:** Use GitHub Secrets for production

3. **GitHub Secrets Setup (Recommended):**

Store API key securely:

```bash
# Via gh CLI
gh secret set OPENAI_API_KEY --body "sk-proj-..."

# Then reference in .sitepins.json
{
  "ai": {
    "openaiApiKey": "${OPENAI_API_KEY}"
  }
}
```

### Using AI Tools in Editor

#### Content Generation

1. Click **AI** button in editor toolbar
2. Select **Generate Content**
3. Paste outline or describe article
4. Choose tone (professional, casual, luxury, academic)
5. Set content length (short, medium, long)
6. Review and accept generated text

**Example prompt:**

```text
Outline:
1. Planning timeline for weddings
2. 12-18 months advance booking
3. Venue selection importance
4. Guest list considerations
5. Vendor coordination

Tone: Luxury, professional
Length: Medium (800-1200 words)
```

#### Meta Description

1. Click **AI** button
2. Select **Generate Meta Description**
3. Select text to summarize
4. AI generates 150-160 character description
5. Edit as needed

#### Alt Text

1. Click **AI** button in image field
2. Select **Generate Alt Text**
3. AI analyzes image context and content
4. Review and adjust if needed

#### Tone Adjustment

1. Select text to rewrite
2. Click **AI** button
3. Choose target tone:
   - Professional
   - Casual
   - Luxury/Upscale
   - Friendly
   - Academic
4. AI rewrites maintaining meaning

### AI Cost Management

OpenAI charges per token used. Monitor usage:

- **Cost per 1M tokens:**
  - GPT-4: $15 input / $45 output
  - GPT-3.5: $0.50 input / $1.50 output
  - GPT-4 Turbo: $10 input / $30 output

**Budget Tips:**

1. Set `maxTokens` limit in config (default 2000)
2. Use GPT-3.5 for drafting, GPT-4 for refinement
3. Monitor usage in OpenAI dashboard
4. Set spending alerts in OpenAI account

### AI Best Practices

1. **Use for Drafting** - AI generates initial content; editors refine
2. **Brand Voice Review** - Always review AI output for brand consistency
3. **Fact-Check** - Verify AI-generated facts and statistics
4. **Copyright** - Ensure content is original, not rehashing existing sources
5. **Tone Setting** - Provide clear tone/style guidance for better results
6. **Iterative Refinement** - Ask AI to adjust tone, length, or focus iteratively

---

## Developer Configuration

### .sitepins.json Deep Dive

Complete developer configuration reference:

```json
{
  "version": "1.0",
  "name": "Pike & West",
  "description": "Event venue website CMS",

  "content": {
    "root": "content",
    "fmType": "yaml",
    "ignorePatterns": [
      "**/draft/**",
      "**/_*.md",
      "**/README.md"
    ]
  },

  "media": {
    "root": "static/images",
    "uploadPath": "/images/",
    "publicPath": "/images/",
    "cdnUrl": null,
    "maxFileSize": 50,
    "allowedTypes": ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    "autoOptimize": true
  },

  "data": {
    "root": "data",
    "formats": ["yaml", "json", "toml"]
  },

  "editor": {
    "isRawMode": false,
    "theme": "light",
    "fontSize": 14,
    "lineNumbers": true,
    "wordWrap": true,
    "autoSave": true,
    "autoSaveInterval": 5000
  },

  "preview": {
    "enabled": true,
    "url": "http://localhost:1313",
    "deployPreview": true,
    "autoRefresh": true,
    "refreshDelay": 1000
  },

  "git": {
    "provider": "github",
    "branch": "main",
    "commitMessages": {
      "create": "content: add {filename}",
      "update": "content: update {filename}",
      "delete": "content: remove {filename}",
      "media": "media: add {filename}"
    }
  },

  "ai": {
    "enabled": true,
    "openaiApiKey": "${OPENAI_API_KEY}",
    "defaultModel": "gpt-4",
    "maxTokens": 2000,
    "temperature": 0.7
  },

  "sidebar": {
    "sections": [
      {
        "title": "Pages",
        "path": "content",
        "icon": "document",
        "collapsed": false
      },
      {
        "title": "Blog",
        "path": "content/blog",
        "icon": "pencil",
        "collapsed": false
      },
      {
        "title": "Data",
        "path": "data",
        "icon": "database",
        "collapsed": true
      }
    ],
    "showFileCount": true
  },

  "validation": {
    "frontmatter": true,
    "markdown": true,
    "images": true,
    "links": true
  }
}
```

### Environment Variables

Sensitive values should be stored as GitHub Secrets:

```bash
# Set in GitHub repository
gh secret set OPENAI_API_KEY --body "sk-proj-..."
gh secret set CF_API_TOKEN --body "..."
gh secret set CLOUDFLARE_ZONE_ID --body "..."
```

Reference in .sitepins.json:

```json
{
  "ai": {
    "openaiApiKey": "${OPENAI_API_KEY}"
  }
}
```

### Validation Rules

Sitepins can validate content automatically:

```json
{
  "validation": {
    "frontmatter": true,
    "markdown": true,
    "images": true,
    "links": true,
    "rules": [
      {
        "field": "title",
        "type": "required",
        "message": "Every page needs a title"
      },
      {
        "field": "description",
        "type": "length",
        "min": 50,
        "max": 160,
        "message": "Description must be 50-160 characters"
      },
      {
        "field": "image",
        "type": "pattern",
        "pattern": "^images/",
        "message": "Images must be in images/ folder"
      }
    ]
  }
}
```

### Commit Message Customization

Control how Sitepins commits changes:

```json
{
  "git": {
    "commitMessages": {
      "create": "content: add {filename}",
      "update": "content: update {filename}",
      "delete": "content: remove {filename}",
      "media": "media: add {filename}",
      "schema": "config: update schema {filename}",
      "snippet": "config: add snippet {filename}"
    },
    "authorEmail": "cms@pikeandwest.com",
    "authorName": "Pike & West CMS"
  }
}
```

### Publish Workflow Integration

Integrate with deployment services:

```json
{
  "preview": {
    "enabled": true,
    "url": "https://preview.pikeandwest.com",
    "deployPreview": true,
    "integrations": {
      "cloudflarePages": {
        "enabled": true,
        "apiToken": "${CF_API_TOKEN}",
        "accountId": "${CF_ACCOUNT_ID}",
        "projectName": "pikeandwest"
      },
      "netlify": {
        "enabled": false,
        "buildHook": "https://api.netlify.com/build_hooks/..."
      }
    }
  }
}
```

---

## Integration Patterns

### Pattern 1: Blog Post Workflow

**File structure:**

```text
content/blog/
├── _index.md
├── 2025/
│   └── winter-wedding-planning.md
└── 2024/
    └── venue-selection-guide.md
```

**Schema (.sitepins/schema/blog.json):**

```json
{
  "name": "Blog Post",
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
      "label": "Author",
      "default": "Pike & West"
    },
    {
      "name": "image",
      "type": "text",
      "label": "Featured Image",
      "required": true
    },
    {
      "name": "categories",
      "type": "array",
      "label": "Categories",
      "items": { "type": "text" }
    }
  ]
}
```

**Hugo template (layouts/\_default/single.html):**

```go-html-template
{{ define "main" }}
  <article>
    <h1>{{ .Title }}</h1>
    <meta itemprop="datePublished" content="{{ .Date.Format "2006-01-02" }}">
    <meta itemprop="author" content="{{ .Params.author | default "Pike & West" }}">

    {{ with .Params.image }}
      <img src="{{ . }}" alt="{{ $.Params.image_alt }}" loading="lazy">
    {{ end }}

    {{ .Content }}
  </article>
{{ end }}
```

### Pattern 2: Data File Management

**File structure:**

```text
data/
├── hero.yaml
├── events.yaml
├── about.yaml
└── testimonials.yaml
```

**hero.yaml:**

```yaml
hero:
  enabled: true
  title_line_1: "Pike"
  title_line_2: "&"
  title_line_3: "West"
  tagline: "Art and Life. Life and Art. Life as Art."
  image: "images/hero/venue-exterior.jpg"
  image_alt: "Pike & West venue exterior"
  cta:
    text: "Book a Tour"
    url: "/contact"
```

**Hugo template:**

```go-html-template
{{ if .Site.Data.hero.hero.enabled }}
  <section class="hero">
    <h1>
      {{ .Site.Data.hero.hero.title_line_1 }}<br>
      {{ .Site.Data.hero.hero.title_line_2 }}<br>
      {{ .Site.Data.hero.hero.title_line_3 }}
    </h1>
    <p>{{ .Site.Data.hero.hero.tagline }}</p>

    {{ with .Site.Data.hero.hero.cta }}
      <a href="{{ .url }}" class="btn btn--primary">{{ .text }}</a>
    {{ end }}
  </section>
{{ end }}
```

**Edit in Sitepins:**

1. Open `data/hero.yaml` in CMS
2. Edit hero content directly
3. Preview changes in real-time
4. Commit to Git

### Pattern 3: Multi-Section Page

**Front matter with sections toggle:**

```yaml
---
title: "Home"
layout: "home"
sections:
  hero: true
  venue_gallery: true
  events: true
  about: true
  cta_banner: true
---
```

**Hugo template (layouts/home/single.html):**

```go-html-template
{{ define "main" }}
  {{ if .Params.sections.hero }}
    {{ partial "sections/hero.html" . }}
  {{ end }}

  {{ if .Params.sections.venue_gallery }}
    {{ partial "sections/venue-gallery.html" . }}
  {{ end }}

  {{ if .Params.sections.events }}
    {{ partial "sections/events.html" . }}
  {{ end }}

  {{ if .Params.sections.about }}
    {{ partial "sections/about.html" . }}
  {{ end }}

  {{ if .Params.sections.cta_banner }}
    {{ partial "sections/cta-banner.html" . }}
  {{ end }}
{{ end }}
```

**Schema for easy editing:**

```json
{
  "name": "Home Page",
  "template": [
    {
      "name": "sections",
      "type": "object",
      "label": "Page Sections",
      "fields": [
        { "name": "hero", "type": "boolean", "label": "Hero Section" },
        { "name": "venue_gallery", "type": "boolean", "label": "Venue Gallery" },
        { "name": "events", "type": "boolean", "label": "Events Section" },
        { "name": "about", "type": "boolean", "label": "About Section" },
        { "name": "cta_banner", "type": "boolean", "label": "CTA Banner" }
      ]
    }
  ]
}
```

### Pattern 4: Structured Content with Arrays

**Event listings with array of events:**

```yaml
---
title: "Upcoming Events"
events:
  - title: "Sarah & Michael's Wedding"
    date: 2025-06-15
    guest_count: 150
    event_type: "wedding"
    image: "images/events/wedding-june.jpg"

  - title: "Summer Corporate Retreat"
    date: 2025-07-22
    guest_count: 200
    event_type: "corporate"
    image: "images/events/corporate-july.jpg"
---
```

**Hugo template:**

```go-html-template
{{ range .Params.events }}
  <div class="event-card">
    <h3>{{ .title }}</h3>
    <p>{{ .date | dateFormat "January 2, 2006" }}</p>
    <p>{{ .guest_count }} guests • {{ .event_type | title }}</p>
    <img src="{{ .image }}" alt="{{ .title }}">
  </div>
{{ end }}
```

**Schema for array editing:**

```json
{
  "name": "events",
  "type": "array",
  "label": "Events",
  "items": {
    "type": "object",
    "fields": [
      { "name": "title", "type": "text", "label": "Event Title" },
      { "name": "date", "type": "date", "label": "Date" },
      { "name": "guest_count", "type": "number", "label": "Guest Count" },
      { "name": "event_type", "type": "select",
        "options": [
          { "value": "wedding", "label": "Wedding" },
          { "value": "corporate", "label": "Corporate" }
        ]
      },
      { "name": "image", "type": "text", "label": "Image" }
    ]
  }
}
```

---

## Best Practices & Tips

### Content Organization Best Practices

1. **Use Consistent Naming:**
   - File names: `kebab-case` (e.g., `winter-wedding-planning.md`)
   - Data keys: `snake_case` (e.g., `guest_count`)
   - Folders: lowercase (e.g., `content/blog/`, `data/`, `static/images/`)

2. **Folder Hierarchy:**
   - Organize by content type: `blog/`, `events/`, `pages/`
   - Within blog: organize by year: `blog/2025/`, `blog/2024/`
   - Keep flat when <50 files per folder

3. **Data File Structure:**
   - One primary object per data file
   - Flatten complex nested structures for easier CMS editing
   - Group related data together

4. **Image Organization:**

   ```
   static/images/
   ├── hero/          # Homepage hero
   ├── venue/         # Venue photography
   ├── events/        # Event-specific
   ├── blog/          # Blog featured images
   └── brand/         # Logos, icons
   ```

### Schema Design Best Practices

1. **Use Descriptive Labels:**

   ```json
   {
     "name": "title",
     "label": "Post Title (50-100 chars)",
     "help": "Main headline. Keep under 100 characters for SEO."
   }
   ```

2. **Set Meaningful Defaults:**

   ```json
   {
     "name": "author",
     "default": "Pike & West",
     "help": "Defaults to Pike & West if blank"
   }
   ```

3. **Use Select for Controlled Values:**

   ```json
   {
     "name": "event_type",
     "type": "select",
     "options": [
       { "value": "wedding", "label": "Wedding" },
       { "value": "corporate", "label": "Corporate Event" }
     ]
   }
   ```

4. **Include Validation:**

   ```json
   {
     "name": "email",
     "type": "text",
     "pattern": "^[^@]+@[^@]+\\.[^@]+$",
     "help": "Valid email address required"
   }
   ```

### SEO Best Practices

1. **Meta Descriptions:**
   - Required field in schema
   - 150-160 characters
   - Include target keyword
   - Use AI tool for suggestions

2. **Image Alt Text:**
   - Required field for all images
   - Descriptive, not keyword-stuffed
   - Use AI tool for consistency

3. **URL Slugs:**
   - Filename becomes URL slug
   - Use kebab-case
   - Keep URLs short and descriptive
   - Avoid changing URLs (maintain redirects)

4. **Schema Markup:**

   ```yaml
   ---
   title: "Pike & West - Event Venue"
   description: "Premium event venue in Germantown, TN for weddings and corporate events"
   schema:
     type: "EventVenue"
     priceRange: "$$$$"
   ---
   ```

### Performance Best Practices

1. **Image Optimization:**
   - Resize before upload (max 1920px width)
   - Use WebP format when possible
   - Compress JPEG/PNG files
   - Use responsive images in Hugo:

     ```go-html-template
     {{ $img := resources.GetMatch "images/venue/main.jpg" }}
     {{ $webp := $img.Resize "1200x webp" }}
     <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
     ```

2. **Content Structure:**
   - Use shortcodes for repeated content
   - Break long content into sections
   - Use headings hierarchy (H1 → H2 → H3)

3. **Git Commit Frequency:**
   - Regular commits improve version history
   - Avoid massive commits with many changes
   - Use clear commit messages via Sitepins settings

### Workflow Best Practices

1. **Draft Before Publishing:**
   - Set `draft: true` in schema default
   - Review in preview before committing
   - Use branch workflows for approval

2. **Preview Testing:**
   - Enable preview deployments
   - Test on multiple devices
   - Check links before publishing

3. **Content Review:**
   - Spell check before committing
   - Verify all links work
   - Check image alt text
   - Test shortcodes

4. **Scheduled Publishing:**
   - Use front matter `date` field
   - Set `draft: true` for future content
   - Configure GitHub Actions to auto-publish

### Troubleshooting Common Issues

| Issue                  | Solution                                  |
|------------------------|-------------------------------------------|
| Schema not appearing   | Verify file path matches folder structure |
| Changes not showing    | Check preview URL configuration           |
| Images not uploading   | Verify media folder path and permissions  |
| Snippets not inserting | Check snippet shortcode syntax            |
| AI tools not working   | Verify OpenAI API key in GitHub Secrets   |
| Commits not appearing  | Check Git branch configuration            |

### Integration Checklist

- [ ] `.sitepins.json` created with content/media/data paths
- [ ] Schemas created for each content type
- [ ] Snippets created for common shortcodes
- [ ] Sidebar sections configured
- [ ] Preview URL configured (Hugo dev server)
- [ ] OpenAI API key stored in GitHub Secrets
- [ ] User roles assigned
- [ ] Team trained on CMS workflow
- [ ] Backup strategy documented
- [ ] Publishing workflow documented

---

## Resources & References

### Official Documentation

- **[Sitepins Website](https://sitepins.com/)**
- **[Sitepins Documentation](https://docs.sitepins.com/)**
- **[Sitepins Developer Docs](https://developer.sitepins.com/)**
- **[Sitepins GitHub](https://github.com/sitepins)**

### Hugo Integration

- **[Hugo Documentation](https://gohugo.io/documentation/)**
- **[Hugo Pipes SCSS](https://gohugo.io/hugo-pipes/scss-sass/)**
- **[Hugo Shortcodes](https://gohugo.io/content-management/shortcodes/)**
- **[Hugo Data Files](https://gohugo.io/templates/data-templates/)**

### Related Tools

- **[ImageKit](https://imagekit.io/)** - Image CDN and optimization
- **[Cloudinary](https://cloudinary.com/)** - Media management platform
- **[OpenAI API](https://platform.openai.com/)** - AI content generation

### Community

- **[Hugo Discourse](https://discourse.gohugo.io/)** - Hugo community discussion
- **[GitHub Discussions](https://github.com/sitepins/sitepins/discussions)** - Sitepins community
- **[Jamstack Community Slack](https://jamstack.org/)** - Static site generator community

---

## Summary Table: All Configuration Options

| Component   | Key Settings                            | Example                                |
|-------------|-----------------------------------------|----------------------------------------|
| **Content** | root, fmType, ignorePatterns            | `content/`, `yaml`, `**/draft/**`      |
| **Media**   | root, uploadPath, cdnUrl, maxFileSize   | `static/images/`, `/images/`, null, 50 |
| **Editor**  | isRawMode, theme, fontSize, lineNumbers | false, light, 14, true                 |
| **Preview** | enabled, url, deployPreview             | true, `http://localhost:1313`, true    |
| **Git**     | provider, branch, commitMessages        | github, main, `content: add {file}`    |
| **AI**      | enabled, openaiApiKey, model, maxTokens | true, `${OPENAI_API_KEY}`, gpt-4, 2000 |
| **Sidebar** | sections, showFileCount, collapsed      | Array of section objects, true, false  |

---

## Quick Start: Next Steps for Pike & West

1. **Register Sitepins Account**
   - Visit <https://sitepins.com/>
   - Connect GitHub repository
   - Grant permissions

2. **Create .sitepins.json**

   ```json
   {
     "content": { "root": "content" },
     "media": { "root": "static/images" },
     "data": { "root": "data" }
   }
   ```

3. **Create Content Schemas**
   - `.sitepins/schema/blog.json` for blog posts
   - `.sitepins/schema/pages.json` for static pages
   - `.sitepins/schema/events.json` for events (if applicable)

4. **Create Content Snippets**
   - `.sitepins/snippet/contact-cta.json`
   - `.sitepins/snippet/pull-quote.json`
   - `.sitepins/snippet/image-gallery.json`

5. **Configure Editor**
   - Set preview URL to `http://localhost:1313`
   - Configure sidebar sections
   - Invite team members with appropriate roles

6. **Set Up AI (Optional)**
   - Store `OPENAI_API_KEY` in GitHub Secrets
   - Configure in `.sitepins.json`

7. **Test Workflow**
   - Create test blog post
   - Verify changes commit to Git
   - Check preview deployment
   - Review content in live site

---

**Document Version:** 1.0
**Last Updated:** 2026-01-23
**Maintained By:** Pike & West Development Team
