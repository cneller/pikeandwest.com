# Sveltia CMS Research

> Comprehensive research for implementing Sveltia CMS on the Pike & West Hugo site deployed to Cloudflare Pages.

**Last Updated:** 2026-01-27

---

## Table of Contents

- [Overview](#overview)
- [Key Facts](#key-facts)
- [Relationship to Decap CMS / Netlify CMS](#relationship-to-decap-cms--netlify-cms)
- [Features and Differentiators](#features-and-differentiators)
- [Installation and Setup for Hugo](#installation-and-setup-for-hugo)
- [Authentication Setup](#authentication-setup)
- [Configuration Reference](#configuration-reference)
- [Collection Configuration for Hugo](#collection-configuration-for-hugo)
- [Widget Types](#widget-types)
- [Media and Asset Management](#media-and-asset-management)
- [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
- [Hugo-Specific Considerations](#hugo-specific-considerations)
- [Local Development](#local-development)
- [Preview and Editorial Workflow](#preview-and-editorial-workflow)
- [Internationalization (i18n)](#internationalization-i18n)
- [Performance](#performance)
- [Known Limitations and Gotchas](#known-limitations-and-gotchas)
- [Content Modeling Best Practices](#content-modeling-best-practices)
- [Migration from Decap / Netlify CMS](#migration-from-decap--netlify-cms)
- [CMS Comparison for Hugo](#cms-comparison-for-hugo)
- [Roadmap](#roadmap)
- [Pike & West Implementation Notes](#pike--west-implementation-notes)
- [Sources](#sources)

---

## Overview

Sveltia CMS is a free, open-source, Git-based headless CMS designed as a modern successor to Netlify CMS (now Decap CMS). It is **not a fork** -- it is a complete rewrite built from scratch in Svelte, deliberately avoiding the complexity, technical debt, and bugs of Netlify/Decap CMS.

Despite being built from the ground up, Sveltia CMS is **configuration-compatible** with Netlify/Decap CMS. In many cases it serves as a drop-in replacement with a single script tag change.

## Key Facts

| Attribute          | Value                                                                   |
|--------------------|-------------------------------------------------------------------------|
| Creator/Maintainer | Kohei Yoshino (@kyoshino)                                               |
| License            | MIT                                                                     |
| Built With         | Svelte (35%) + JavaScript (65%); Lexical editor                         |
| Current Version    | v0.129.0 (January 25, 2026)                                             |
| Status             | Public Beta (production-ready for many scenarios)                       |
| GitHub Stars       | ~2,100                                                                  |
| Total Releases     | 473                                                                     |
| Total Commits      | 3,809                                                                   |
| Contributors       | 6                                                                       |
| Bundle Size        | <500 KB minified+brotli                                                 |
| GitHub Repo        | [sveltia/sveltia-cms](https://github.com/sveltia/sveltia-cms)           |
| Documentation      | [sveltiacms.app](https://sveltiacms.app)                                |
| npm Package        | `@sveltia/cms`                                                          |
| CDN URL            | `https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js`                    |
| Auth Worker        | [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) |

## Relationship to Decap CMS / Netlify CMS

When Netlify abandoned Netlify CMS in early 2022, three successors emerged:

1. **Decap CMS** -- official continuation (React-based, inherited codebase)
2. **Static CMS** -- fork (now defunct)
3. **Sveltia CMS** -- complete rewrite in Svelte (this project)

Key compatibility notes:

- The vast majority of existing `config.yml` configurations work out of the box
- 100% feature parity is explicitly **not planned** -- deprecated/legacy features will not be implemented
- 290+ issues (620+ including duplicates) from the Netlify/Decap issue tracker have been resolved
- Git Gateway, Azure, and Bitbucket backends are deliberately excluded

## Features and Differentiators

### Performance

- Bundle: <500 KB vs 1.5 MB (Decap) vs 2.6 MB (Static CMS)
- Uses GitHub/GitLab GraphQL APIs to fetch all content in a single request (Decap makes individual REST calls per entry)
- No virtual DOM overhead (Svelte vs React)
- Real-world: admin loads in ~0.3s vs ~1.5s for Decap (5x faster)

### User Experience

- Modern, clean UI with immersive dark mode (system preference detection)
- Full mobile and tablet support with responsive design
- QR code login for quick access
- Keyboard shortcuts throughout
- Drag-and-drop file uploads
- Full-text search across all collections (Ctrl+F / Cmd+F)

### Asset Management

- Full-featured Asset Library (separate from selection dialog)
- Built-in image optimizer with WebP conversion
- SVG minification via SVGO
- Stock photo integration (Pexels, Pixabay, Unsplash) -- no config needed
- Multi-file selection and drag-drop upload
- Asset metadata and usage tracking

### Content Editing

- Rich text editor built with Lexical (vs Slate in Decap)
- New widgets: Compute, KeyValue, UUID
- Variable types for conditional fields
- Entry backups (automatic while editing)
- Revert changes functionality
- Skip CI mode (save without triggering builds)

### i18n (First-Class)

- One-click AI translation (DeepL, Google Cloud Translation, Anthropic, OpenAI)
- RTL script support (Arabic, Hebrew, Persian)
- Localized entry slugs
- Easy locale switching while editing

### Developer Experience

- JSON Schema-based config validation with IDE auto-completion
- YAML, TOML, and JSON configuration formats
- Local repository workflow via File System Access API (no proxy server needed)
- Multiple config file merging for modular configuration
- `llms.txt` provided for AI coding assistants

### Security

- No unpatched XSS vulnerabilities (unlike Decap CMS)
- No proxy server requirement (smaller attack surface)
- Content Security Policy support without `unsafe-eval`
- npm package provenance enabled

---

## Installation and Setup for Hugo

### Directory Structure

```text
your-hugo-site/
  static/
    admin/
      index.html    # CMS entry point
      config.yml    # CMS configuration
```

Hugo serves `static/` at the site root, so the CMS becomes accessible at `https://yoursite.com/admin/`.

### Method A: CDN (Recommended)

Create `static/admin/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <title>Sveltia CMS</title>
  <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
  <link href="/admin/config.yml" type="application/yaml" rel="cms-config-url" />
</head>
<body></body>
</html>
```

CDN auto-updates: whenever you reload the CMS, the latest version is served via UNPKG. No build step required.

### Method B: npm Package

```bash
npm i @sveltia/cms
# or
pnpm add @sveltia/cms
```

Import and initialize:

```js
import CMS from '@sveltia/cms';
```

### Method C: Self-Hosted

Clone the repository, build, and serve the dist files from your own infrastructure.

---

## Authentication Setup

### Supported Backends

| Backend       | Auth Methods     | Notes                                |
|---------------|------------------|--------------------------------------|
| GitHub        | OAuth, PAT       | Recommended for best performance     |
| GitLab        | OAuth, PKCE, PAT | PKCE eliminates need for auth server |
| Gitea/Forgejo | OAuth, PKCE, PAT |                                      |
| Test          | N/A              | For development only                 |

**Not supported (deliberately):** Azure DevOps, Bitbucket, Git Gateway, Netlify Identity.

### Option A: Cloudflare Workers OAuth (Recommended for Teams)

This is the recommended approach for Cloudflare Pages deployment.

**Step 1: Register GitHub OAuth App**

Go to [GitHub Developer Settings > OAuth Apps > New OAuth App](https://github.com/settings/developers):

| Field                      | Value                                                       |
|----------------------------|-------------------------------------------------------------|
| Application name           | Sveltia CMS Authenticator                                   |
| Homepage URL               | `https://yoursite.com`                                      |
| Authorization callback URL | `https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev/callback` |

Save the **Client ID** and generate a **Client Secret**.

**Step 2: Deploy the Cloudflare Worker**

Use the one-click deploy from [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), or manually:

```bash
git clone https://github.com/sveltia/sveltia-cms-auth.git
cd sveltia-cms-auth
npx wrangler login
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
npx wrangler deploy
```

**Step 3: Configure Worker Environment Variables**

In Cloudflare Workers dashboard > sveltia-cms-auth > Settings > Variables:

| Variable               | Value                          | Notes                 |
|------------------------|--------------------------------|-----------------------|
| `GITHUB_CLIENT_ID`     | Your Client ID                 | Required              |
| `GITHUB_CLIENT_SECRET` | Your Client Secret             | Click "Encrypt"       |
| `ALLOWED_DOMAINS`      | `yoursite.com, *.yoursite.com` | Optional, recommended |

**Step 4: Update config.yml**

```yaml
backend:
  name: github
  repo: username/repo
  branch: main
  base_url: https://sveltia-cms-auth.<SUBDOMAIN>.workers.dev
```

### Option B: Personal Access Token (Simplest for Solo)

Generate a fine-grained PAT at [GitHub Token Settings](https://github.com/settings/tokens):

- **Repository access:** Select only your site repository
- **Permissions:** Contents (Read and write), Metadata (Read-only)
- **Expiration:** 90 days recommended

No `base_url` needed in config. When accessing the CMS, click "Sign in with GitHub" and enter your PAT. Token is stored in browser local storage only.

### Option C: Local Development (No Auth)

See [Local Development](#local-development) section below.

---

## Configuration Reference

### File Location and Format

Config lives at `static/admin/config.yml`. Supported formats: YAML, JSON, TOML.

Add JSON schema for IDE autocomplete:

```yaml
# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json
```

### Modular Configuration

Multiple config files can be merged:

```html
<link href="/admin/config-base.yml" type="application/yaml" rel="cms-config-url" />
<link href="/admin/config-collections.yml" type="application/yaml" rel="cms-config-url" />
```

### Full Config Structure

```yaml
# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json

# ============================================================
# Backend
# ============================================================
backend:
  name: github
  repo: owner/repo
  branch: main
  base_url: https://sveltia-cms-auth.<subdomain>.workers.dev
  commit_messages:
    create: "content: add {{collection}} '{{slug}}'"
    update: "content: update {{collection}} '{{slug}}'"
    delete: "content: delete {{collection}} '{{slug}}'"
    uploadMedia: "content: upload '{{path}}'"
    deleteMedia: "content: delete media '{{path}}'"

# ============================================================
# Site
# ============================================================
site_url: https://yoursite.com
display_url: https://yoursite.com
logo:
  src: /images/brand/logo.svg

# ============================================================
# Slug
# ============================================================
slug:
  encoding: unicode
  clean_accents: true
  sanitize_replacement: "-"

# ============================================================
# Media
# ============================================================
media_folder: static/images/uploads
public_folder: /images/uploads

# ============================================================
# Collections
# ============================================================
collections:
  # ... see Collection Configuration section

# ============================================================
# Singletons (Sveltia-only, alternative to file collections)
# ============================================================
singletons:
  # ... see Collection Configuration section
```

---

## Collection Configuration for Hugo

### Folder Collections (Multiple Entries)

For content types with multiple entries (blog posts, events):

```yaml
collections:
  - name: blog
    label: Blog Posts
    label_singular: Blog Post
    folder: content/blog
    create: true
    slug: "{{slug}}"
    path: "{{slug}}/index"          # Hugo page bundles
    media_folder: ""                 # Images alongside index.md
    public_folder: ""
    extension: md
    format: yaml-frontmatter
    icon: article
    summary: "{{title}} ({{year}}-{{month}}-{{day}})"
    sortable_fields:
      - date
      - title
    view_filters:
      - label: Published
        field: draft
        pattern: false
      - label: Drafts
        field: draft
        pattern: true
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Date, name: date, widget: datetime, format: "YYYY-MM-DDTHH:mm:ssZ" }
      - { label: Description, name: description, widget: text, required: false }
      - { label: Featured Image, name: image, widget: image, required: false }
      - { label: Draft, name: draft, widget: boolean, default: false }
      - { label: Tags, name: tags, widget: list, required: false }
      - { label: Body, name: body, widget: markdown }
```

### File Collections (Single Pages)

For individual pages with unique structures:

```yaml
collections:
  - name: pages
    label: Pages
    icon: description
    files:
      - name: home
        label: Homepage
        file: content/_index.md
        fields:
          - { label: Title, name: title, widget: string }
          - { label: Description, name: description, widget: text }
          - { label: Body, name: body, widget: markdown }
      - name: contact
        label: Contact Page
        file: content/contact.md
        fields:
          - { label: Title, name: title, widget: string }
          - { label: Description, name: description, widget: text }
          - { label: Body, name: body, widget: markdown }
```

### Singletons (Sveltia-Only, Simplified Data Files)

```yaml
singletons:
  - name: site_settings
    label: Site Settings
    file: data/site.yaml
    icon: settings
    fields:
      - label: Contact
        name: contact
        widget: object
        fields:
          - { label: Phone, name: phone, widget: string }
          - label: Address
            name: address
            widget: object
            fields:
              - { label: Street, name: street, widget: string }
              - { label: City, name: city, widget: string }
              - { label: State, name: state, widget: string }
              - { label: ZIP, name: zip, widget: string }
```

### Collection Dividers

Insert visual separators in the sidebar:

```yaml
collections:
  - name: blog
    label: Blog Posts
    # ...
  - divider: true
  - name: pages
    label: Pages
    # ...
```

### Collection Options Reference

| Option             | Description                                                                                                    |
|--------------------|----------------------------------------------------------------------------------------------------------------|
| `name`             | Unique identifier (required)                                                                                   |
| `label`            | Display name in CMS sidebar                                                                                    |
| `folder`           | Content directory path (folder collections)                                                                    |
| `files`            | List of file objects (file collections)                                                                        |
| `create`           | Allow creating new entries (boolean)                                                                           |
| `delete`           | Allow deleting entries (boolean, default: true)                                                                |
| `slug`             | Filename template: `{{slug}}`, `{{year}}`, `{{month}}`, `{{day}}`, `{{fields.fieldname}}`                      |
| `path`             | Entry path template (for page bundles: `{{slug}}/index`)                                                       |
| `extension`        | File extension: `md`, `yml`, `yaml`, `json`, `toml`, `html`                                                    |
| `format`           | File format: `yaml`, `toml`, `json`, `frontmatter`, `yaml-frontmatter`, `toml-frontmatter`, `json-frontmatter` |
| `media_folder`     | Per-collection media folder                                                                                    |
| `public_folder`    | Per-collection public media path                                                                               |
| `summary`          | Entry list display template                                                                                    |
| `sortable_fields`  | Fields users can sort by                                                                                       |
| `view_filters`     | Predefined filters                                                                                             |
| `view_groups`      | Predefined groupings                                                                                           |
| `icon`             | Material Symbols icon name                                                                                     |
| `yaml_quote`       | Quote string values in YAML output (boolean, Sveltia-only)                                                     |
| `identifier_field` | Field used as entry identifier (default: `title`)                                                              |
| `editor.preview`   | Enable/disable preview pane (boolean)                                                                          |

---

## Widget Types

### Standard Widgets (Decap-Compatible)

| Widget     | Description                | Key Options                                                                |
|------------|----------------------------|----------------------------------------------------------------------------|
| `string`   | Single-line text           | `default`, `pattern`, `before_input`, `after_input`, `prefix`, `suffix`    |
| `text`     | Multi-line plain text      | `default`                                                                  |
| `markdown` | Rich text editor (Lexical) | `default`, `minimal`, `buttons`, `editor_components`                       |
| `number`   | Numeric input              | `default`, `value_type` (int/float), `min`, `max`, `step`                  |
| `boolean`  | Toggle switch              | `default`                                                                  |
| `datetime` | Date and/or time picker    | `default`, `format`, `date_format`, `time_format`                          |
| `select`   | Dropdown selection         | `options`, `default`, `multiple`, `min`, `max`                             |
| `list`     | Repeatable items           | `fields`, `default`, `allow_add`, `min`, `max`, `summary`, `root`          |
| `object`   | Nested field group         | `fields`, `collapsed`, `summary`                                           |
| `relation` | Link to other entries      | `collection`, `value_field`, `search_fields`, `display_fields`, `multiple` |
| `image`    | Image upload/select        | `default`, `media_folder`, `public_folder`, `multiple`                     |
| `file`     | File upload/select         | `default`, `media_folder`, `public_folder`, `multiple`                     |
| `color`    | Color picker               | `default`, `allowInput`, `enableAlpha`                                     |
| `code`     | Syntax-highlighted editor  | `default_language`, `allow_language_selection`, `output_code_only`         |
| `hidden`   | Hidden field               | `default`                                                                  |
| `map`      | Geolocation/map            | `default`, `type` (Point/LineString/Polygon)                               |

### Sveltia-Only Widgets

| Widget     | Description                       | Key Options                                             |
|------------|-----------------------------------|---------------------------------------------------------|
| `uuid`     | Auto-generated UUID               | `prefix`, `use_b32_encoding`                            |
| `compute`  | Auto-calculated from other fields | `value` (template: `{{fields.fieldname}}`, `{{index}}`) |
| `keyvalue` | Key-value pair editor             | Tabular UI for arbitrary pairs                          |

### Enhanced Widget Features (vs Decap)

- **String/Text**: `minlength`/`maxlength` validation with character counter
- **File/Image**: `accept` option for file type filtering
- **List**: `root: true` for editing top-level arrays in data files
- **Object**: Optional objects can be manually added/removed
- **Code**: Uses Lexical/Prism (300+ languages) instead of CodeMirror

---

## Media and Asset Management

### Global Media Folder (Hugo)

```yaml
media_folder: "static/images/uploads"    # Path in Git repo
public_folder: "/images/uploads"          # URL path on built site
```

### Per-Collection Media Folders

```yaml
collections:
  - name: blog
    media_folder: /static/images/blog
    public_folder: /images/blog
```

### Hugo Page Bundle Media (Co-located Images)

```yaml
collections:
  - name: blog
    folder: content/blog
    path: "{{slug}}/index"
    media_folder: ""         # Same directory as index.md
    public_folder: ""        # Relative path in content
```

Creates: `content/blog/my-post/index.md` with images in `content/blog/my-post/`.

### Built-in Image Optimization

- Raster images (JPEG, PNG) converted to **WebP** and resized if needed
- SVG images minified using **SVGO**
- File size limits configurable via `max_file_size`

### Stock Photo Integration

Built-in access to **Pexels**, **Pixabay**, and **Unsplash** directly within the media library. No configuration needed.

---

## Cloudflare Pages Deployment

### Build Settings

| Setting                | Value                  |
|------------------------|------------------------|
| Build command          | `hugo --gc --minify`   |
| Build output directory | `public`               |
| Environment variable   | `HUGO_VERSION=0.146.0` |

### Required Headers File

Create `static/_headers` to fix OAuth popup issues:

```text
/admin/*
  Cross-Origin-Opener-Policy: same-origin-allow-popups
```

This is **required** because Sveltia CMS uses a popup window for OAuth and `same-origin` COOP blocks it.

### Deployment Checklist

1. Deploy `sveltia-cms-auth` Cloudflare Worker (separate from Pages project)
2. Register GitHub OAuth App with Worker callback URL
3. Configure Worker environment variables (Client ID, Client Secret, Allowed Domains)
4. Add `base_url` to `config.yml` backend section
5. Add `_headers` file with COOP header for `/admin/*`
6. Push to GitHub; Cloudflare Pages auto-builds

### Cost

All free tier:

- Cloudflare Pages: free for static sites
- Cloudflare Workers: 100,000 requests/day free (OAuth uses ~5-20/day)
- GitHub API: 5,000 requests/hour free
- Sveltia CMS: open source, free

---

## Hugo-Specific Considerations

### Use YAML Frontmatter, Not TOML

Sveltia CMS's TOML generation has known issues (missing `+++` delimiters, incorrect body handling). Always use:

```yaml
format: yaml-frontmatter   # In collection config
```

### Hugo \_index.md Support

Sveltia CMS has built-in support for Hugo's `_index.md` files (branch bundles), including localized variants like `_index.en.md`.

### Hugo Page Bundles

Use `path` and `media_folder` for leaf bundles:

```yaml
collections:
  - name: blog
    folder: content/blog
    path: "{{slug}}/index"
    media_folder: ""
    public_folder: ""
```

### Editing Hugo Data Files

Use singletons or file collections:

```yaml
singletons:
  - name: team
    label: Team Members
    file: data/team.yml
    fields:
      - name: members
        label: Members
        widget: list
        root: true          # Edit top-level array directly
        fields:
          - { label: Name, name: name, widget: string }
          - { label: Role, name: role, widget: string }
```

### yaml_quote Option

Set `yaml_quote: true` on a collection to ensure string values in YAML output are quoted:

```yaml
collections:
  - name: blog
    yaml_quote: true
```

### Custom Commit Messages

```yaml
backend:
  commit_messages:
    create: "content: add {{collection}} '{{slug}}'"
    update: "content: update {{collection}} '{{slug}}'"
    delete: "content: delete {{collection}} '{{slug}}'"
    uploadMedia: "content: upload '{{path}}'"
    deleteMedia: "content: delete media '{{path}}'"
```

---

## Local Development

### How It Works

Sveltia CMS uses the **File System Access API** (Chrome and Edge only) to read/write directly to local files. **No proxy server is needed** (unlike Decap CMS which requires `decap-server`).

### Setup

1. Configure the GitHub backend in `config.yml` (even a tentative repo name works)
2. Start Hugo: `hugo server -D`
3. Open `http://localhost:1313/admin/` in **Chrome or Edge**
4. Click "Work with Local Repository"
5. Select your project root directory when prompted
6. Changes save directly to local files

### Comparison with Decap Local Dev

| Aspect           | Decap CMS                 | Sveltia CMS      |
|------------------|---------------------------|------------------|
| Proxy server     | Required (`decap-server`) | Not needed       |
| Config change    | `local_backend: true`     | Nothing needed   |
| Browser support  | Any                       | Chrome/Edge only |
| Git operations   | Proxy can commit          | Manual Git only  |
| Setup complexity | npm install + config      | Zero setup       |

### Limitations

- **Chrome/Edge only** -- Firefox and Safari don't support the File System Access API
- **No automatic Git operations** -- must use a Git client manually for fetch/pull/commit/push
- **No live reload** -- manual refresh after saving

---

## Preview and Editorial Workflow

### Preview Templates

| API                                     | Status                         |
|-----------------------------------------|--------------------------------|
| `CMS.registerPreviewStyle()`            | Working                        |
| `CMS.registerPreviewTemplate()`         | Not yet -- planned before v1.0 |
| `CMS.registerEditorComponent()` preview | Not yet -- planned before v1.0 |
| Framework-specific live preview         | Will NOT be supported          |

Currently the preview pane shows raw markdown. You can use `registerPreviewStyle()` to apply your site's CSS:

```html
<script>
  CMS.registerPreviewStyle('/css/main.css');
</script>
```

### Editorial Workflow

**Status: Deferred to v2.0 (mid-2026)**

Draft -> In Review -> Ready workflow and Open Authoring are not yet supported. The maintainer wants to implement them correctly, avoiding the dozens of open issues that plague these features in Decap CMS.

**What's available now:**

- Entry backups (automatic while editing, with restore)
- Skip CI mode (save without triggering builds)
- Revert changes (all fields or specific fields)
- Delete multiple entries at once

---

## Internationalization (i18n)

Sveltia CMS was created specifically because its maintainer needed better i18n than Netlify CMS offered. i18n is deeply integrated into the architecture.

### Features

- One-click locale switching with buttons
- AI translation: DeepL, Google Cloud Translation, Anthropic, OpenAI
- RTL script support (Arabic, Hebrew, Persian)
- Localized entry slugs for `multiple_files` and `multiple_folders` structures
- Human-readable language labels
- UUID slugs for non-Latin locales
- Framework-specific i18n support for Hugo, Astro, Zola, VitePress

### Setup for AI Translation

1. Enable i18n with multiple locales in `config.yml`
2. In Sveltia CMS, click Account > Settings, paste your API key (DeepL, etc.)
3. Open any entry, use "Translate" from the three-dot menu

---

## Performance

### Bundle Size Comparison

| CMS         | Size (minified + gzipped) |
|-------------|---------------------------|
| Sveltia CMS | ~300 KB                   |
| Decap CMS   | ~1.5 MB                   |
| Static CMS  | ~2.6 MB                   |

### Real-World Metrics

| Metric                | Decap CMS | Sveltia CMS       |
|-----------------------|-----------|-------------------|
| Admin load time       | 1.5s      | 0.3s (5x faster)  |
| Entry list loading    | 3-5s      | Instant           |
| API calls per session | 100+      | 10-15 (85% fewer) |

### Performance Architecture

- GraphQL API fetches all content in one request (vs individual REST calls)
- No virtual DOM overhead (Svelte vs React)
- Lazy loading and infinite scrolling
- Local Git file caching
- No hardcoded 60-second timeout (unlike Decap)

### Scaling Limits

Git-based CMSs are best suited for small to medium projects. For sites with thousands of entries and assets, consider a more robust CMS. Among supported backends, **GitHub offers the best performance**.

---

## Known Limitations and Gotchas

### Critical Gotchas

1. **YAML Frontmatter Strictness** -- Sveltia CMS is stricter than Hugo. Only one YAML document per file. Inline `---` in body content must be escaped. Quotes must be balanced.

2. **OAuth COOP Header** -- If you get "Authentication Aborted", add `Cross-Origin-Opener-Policy: same-origin-allow-popups` to your `/admin/*` headers.

3. **TOML Generation Bugs** -- Use YAML frontmatter format with Hugo, not TOML.

4. **Local Editing: Chrome/Edge Only** -- Firefox and Safari don't support the File System Access API.

5. **No Git Operations Locally** -- Local mode doesn't commit, push, or pull. Use a Git client.

6. **HEIC Images** -- Convert HEIC to JPEG before uploading.

7. **YAML Anchors** -- Only work within the same file.

### Features NOT Supported (Current)

| Feature            | Timeline                    |
|--------------------|-----------------------------|
| Custom widgets     | Before/at v1.0 (early 2026) |
| Preview templates  | Before v1.0                 |
| Editorial workflow | v2.0 (mid-2026)             |
| Open authoring     | v2.0                        |
| Nested collections | v2.0                        |
| Custom formatters  | TBD                         |

### Features That Will NEVER Be Supported

| Feature                         | Reason                           |
|---------------------------------|----------------------------------|
| Azure/Bitbucket backends        | API performance limitations      |
| Git Gateway                     | Deprecated, slow, unmaintained   |
| Netlify Identity Widget         | Deprecated by Netlify            |
| Remark plugins                  | Incompatible with Lexical editor |
| Framework-specific live preview | Not framework-agnostic           |

---

## Content Modeling Best Practices

1. **Use YAML frontmatter** for Hugo -- most reliable format in Sveltia CMS
2. **Add JSON schema reference** at top of config for IDE validation
3. **Start simple** -- expand fields and collections as needed
4. **Use meaningful names** -- clear, descriptive names for collections and fields
5. **Use relation fields** to link content across collections
6. **Use `sortable_fields`** with default direction for intuitive entry ordering
7. **Use `view_filters`** for quick filtering (Published vs Draft)
8. **Plan for scalability** -- design content models to accommodate future changes
9. **Set `yaml_quote: true`** if your framework is strict about YAML string types
10. **Use singletons** for data files instead of file collections (simpler)

---

## Migration from Decap / Netlify CMS

### Step 1: Update Admin HTML

```html
<!-- Before (Decap CMS) -->
<script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>

<!-- After (Sveltia CMS) -->
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
```

### Step 2: Set Up Authentication

If using Git Gateway / Netlify Identity (most common), you must switch to one of:

- Cloudflare Workers OAuth (recommended)
- Personal Access Token
- GitLab/Gitea PKCE

See [Authentication Setup](#authentication-setup) for details.

### Step 3: Config Cleanup

- Remove `local_backend` property
- Remove `netlify-cms-proxy-server` or `decap-server` from dependencies
- Change `format: toml` to `format: yaml` for Hugo
- Add JSON schema reference

### Step 4: Test

- Verify all collections load
- Test media uploads
- Check mobile interface
- Try search functionality

### What Won't Migrate

- Custom React widgets
- Custom preview templates (partially available via `registerPreviewStyle`)
- Remark plugins
- Git Gateway-dependent features

---

## CMS Comparison for Hugo

| Feature                     | Sveltia CMS  |  Decap CMS  |    TinaCMS    | CloudCannon | Front Matter |
|-----------------------------|:------------:|:-----------:|:-------------:|:-----------:|:------------:|
| **Price**                   |     Free     |    Free     | Free + $29/mo |    Paid     |     Free     |
| **Open Source**             |     Yes      |     Yes     |    Partial    |     No      |     Yes      |
| **Hugo Support**            |  Excellent   |  Excellent  |   Supported   | First-class | First-class  |
| **Architecture**            | Git + Svelte | Git + React |   Git + API   | Cloud SaaS  | VS Code Ext  |
| **UI Quality**              |    Modern    |    Dated    |    Modern     |  Excellent  |   VS Code    |
| **i18n**                    | First-class  |    Basic    |    Limited    |  Supported  |   Limited    |
| **Editorial Workflow**      | Coming v2.0  |     Yes     |      Yes      |     Yes     |  Manual Git  |
| **Custom Widgets**          | Coming v1.0  |     Yes     |      Yes      |     Yes     |     Yes      |
| **Non-tech Editors**        |     Good     |    Good     |     Good      |  Excellent  |      No      |
| **Performance**             |  Excellent   | Poor-Medium |    Medium     |    Good     |  Excellent   |
| **Active Development**      | Very active  |   Stalled   |    Active     |   Active    |    Active    |
| **Decap Config Compatible** |     Yes      |     N/A     |      No       |     No      |      No      |
| **Mobile Editing**          |     Yes      |   Limited   |      No       |     Yes     |      No      |

### Recommendation for Pike & West

Sveltia CMS is the strongest choice given:

- Already on Cloudflare Pages (free OAuth worker)
- Hugo site with standard content structure
- Need for non-technical editors (client team)
- Free, open-source requirement
- Modern UX expectations

---

## Roadmap

| Version       | Timeline   | Key Features                                                                                                                                         |
|---------------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **v1.0 (GA)** | Early 2026 | First stable release. ~300 Netlify/Decap issues resolved. PKCE for GitHub. S3/R2 storage. Full config validation. Accessibility audit. Localized UI. |
| **v2.0**      | Mid 2026   | Editorial workflow. Nested collections. Manual entry sorting. Directory navigation in Asset Library.                                                 |
| **v3.0**      | Late 2026  | Multi-user support. Role-based access. Commits without Git service accounts. Post locking. Edge functions for Workers.                               |
| **Future**    | TBD        | MDX support. Theming. Offline functionality. Advanced relation fields.                                                                               |

---

## Pike & West Implementation Notes

Recommendations specific to this project:

1. **Authentication:** Deploy `sveltia-cms-auth` to Cloudflare Workers for GitHub OAuth. Already on Cloudflare, so this is zero-friction.

2. **Config format:** Use YAML frontmatter exclusively for all Hugo content.

3. **Content structure:** The existing data-driven architecture (YAML data files, consistent front matter schemas) maps cleanly to Sveltia CMS collections and singletons.

4. **Collections to define:**
   - Blog Posts (folder collection with page bundles)
   - Events (folder collection: `content/events/`)
   - Pages (file collection: homepage, contact, about, etc.)
   - Singletons: `data/hero.yaml`, `data/events.yaml`, `data/about.yaml`, `data/cta_banner.yaml`, `data/venue_gallery.yaml`, `data/site.yaml`

5. **Media handling:** Configure `media_folder` and `public_folder` to match existing image paths in `static/images/`.

6. **COOP header:** Add `static/_headers` file with `Cross-Origin-Opener-Policy: same-origin-allow-popups` for `/admin/*`.

7. **Local development:** Use Chrome/Edge to access `/admin/` locally. No proxy server needed.

8. **Commit messages:** Configure custom commit messages matching project conventions (e.g., `content: add blog '{{slug}}'`).

9. **Skip CI:** Use built-in skip-CI mode for batch content changes to avoid unnecessary builds.

10. **Existing CMS tools:** This would replace Sitepins (planned, not yet implemented) and complement Front Matter CMS (VS Code extension, already configured). Sveltia provides a browser-based editing UI that non-technical users can access.

---

## Sources

### Official Documentation

- [Sveltia CMS Official Site](https://sveltiacms.app)
- [What is Sveltia CMS?](https://sveltiacms.app/en/docs/intro)
- [Features](https://sveltiacms.app/en/docs/features)
- [Getting Started](https://sveltiacms.app/en/docs/start)
- [Content Modeling](https://sveltiacms.app/en/docs/content-modeling)
- [Successor to Netlify CMS](https://sveltiacms.app/en/docs/successor-to-netlify-cms)
- [Roadmap](https://sveltiacms.app/en/roadmap)

### GitHub Repositories

- [sveltia/sveltia-cms](https://github.com/sveltia/sveltia-cms)
- [sveltia/sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
- [@sveltia/cms on npm](https://www.npmjs.com/package/@sveltia/cms)

### Blog Posts and Reviews

- [Sveltia CMS is golden. Bye-bye TinaCMS -- Aman Bhargava](https://aman.bh/blog/2025/sveltia-cms-is-golden)
- [Why Everyone Is Switching to Sveltia -- Pavan Kumar](https://dubasipavankumar.com/blog/sveltia-cms-migration-decap-replacement/)
- [Why I Like Sveltia CMS -- Sedenko](https://sedenko.net/blog/why-i-like-sveltia-cms)
- [Integrating Sveltia CMS with Hugo -- KeeFeeRe](https://keefeere.me/blog/hugo_sveltia/)
- [Thoughts on Sveltia CMS -- Andre Franca](https://abf.li/posts/thoughts-on-sveltia-cms/)
- [Hugo CMS Setup Journey -- 0DeepResearch](https://0deepresearch.com/posts/2025-05-08-hugo-cms-setup-journey-decap-cms-sveltia-cms-on-github-pages/)
- [A Fresh Start with Sveltia CMS + i18n -- REID](https://reid.dk/en/blog/2025/10/24/a-fresh-start-astro-upgrade-sveltia-cms-internationalization/)

### Setup Guides

- [Matt Blogs IT: Sveltia CMS Setup Guide](https://mattblogsit.com/SVELTIA_CMS_SETUP/)
- [Hugolify: Sveltia CMS](https://www.hugolify.io/docs/cms/sveltia-cms/)
- [privatemaker/headless-cms Hugo Module](https://github.com/privatemaker/headless-cms)

### Comparisons

- [6 Best Decap CMS Alternatives -- Sitepins](https://sitepins.com/blog/decapcms-alternatives)
- [9 Best Git-based CMS Platforms -- LogRocket](https://blog.logrocket.com/9-best-git-based-cms-platforms/)
- [Which CMS? -- Hugo Discourse](https://discourse.gohugo.io/t/which-cms/52865)
