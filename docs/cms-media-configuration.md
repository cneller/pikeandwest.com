# CMS Media Configuration Guide

> Comprehensive reference for Sveltia CMS media configuration, image paths, and asset management for the Pike & West Hugo site.

**Last updated:** 2026-01-28

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Configuration Hierarchy](#configuration-hierarchy)
- [Current Configuration](#current-configuration)
- [Asset Picker Tabs](#asset-picker-tabs)
- [Image Directory Inventory](#image-directory-inventory)
- [Path Conventions](#path-conventions)
- [Template Integration](#template-integration)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [References](#references)

---

## Overview

This site uses Sveltia CMS for content management with images stored in `static/images/`. A Hugo module mount bridges these into the asset pipeline for processing.

### Key Architecture Points

1. **Images live in `static/images/`** - Sveltia CMS manages them via `media_folder`
2. **Hugo module mount** in `config/_default/hugo.toml` maps `static/images` to `assets/images`
3. **All templates use `resources.Get()`** to load images, then `.RelPermalink` for output
4. **Templates never use raw front matter paths as `src` attributes** - they always pass through Hugo's asset pipeline
5. `resources.Get()` normalizes paths, so both `images/venue/photo.jpg` and `/images/venue/photo.jpg` resolve correctly

---

## Architecture

### How `media_folder` and `public_folder` Work

| Setting         | Purpose                                            | Controls                      |
|-----------------|----------------------------------------------------|-------------------------------|
| `media_folder`  | Where the file is **stored** in the Git repository | Physical file path in repo    |
| `public_folder` | What path is **written** into the content file     | Front matter / markdown `src` |

**Example:** With `media_folder: /static/images/venue` and `public_folder: /images/venue`:

- File saved to: `static/images/venue/photo.jpg` (in the repo)
- Front matter value: `/images/venue/photo.jpg` (in the content file)

Hugo strips the `static/` prefix at build time, so `static/images/venue/photo.jpg` becomes `/images/venue/photo.jpg` on the published site.

### Hugo Module Mount

```toml
# config/_default/hugo.toml
[[module.mounts]]
  source = "static/images"
  target = "assets/images"
```

This enables `resources.Get "images/venue/photo.jpg"` to find files at `static/images/venue/photo.jpg`.

---

## Configuration Hierarchy

Sveltia CMS resolves `media_folder` and `public_folder` through a four-level cascade:

```text
1. Global (top-level config.yml)
   └── 2. Collection-level (per folder or file collection)
       └── 3. File-level (per file in file collections / singletons)
           └── 4. Field-level (per individual image/file widget)
```

Each level overrides the previous. Lower levels inherit from higher levels if not specified.

### Path Resolution Rules

| Path Format            | Type     | Resolved From         | Example                       |
|------------------------|----------|-----------------------|-------------------------------|
| `/static/images/venue` | Absolute | Repository root       | `<repo>/static/images/venue/` |
| `images`               | Relative | Collection's `folder` | `<collection-folder>/images/` |
| `''` (empty string)    | Relative | Entry's own directory | `<entry-directory>/`          |

---

## Current Configuration

### Global Settings

```yaml
# static/admin/config.yml
media_folder: static/images
public_folder: /images
```

### Blog Collection

| Level          | `media_folder`         | `public_folder` | Purpose                      |
|----------------|------------------------|-----------------|------------------------------|
| Collection     | `''`                   | `''`            | Page bundle (entry-relative) |
| Hero Image     | `/static/images/venue` | `images/venue`  | Shared venue photos          |
| Featured Image | `/static/images/venue` | `images/venue`  | Shared venue photos          |

### Events Collection

| Level      | `media_folder`         | `public_folder` | Purpose          |
|------------|------------------------|-----------------|------------------|
| Collection | _(inherits)_           | _(inherits)_    | Uses global      |
| Icon       | `/static/images/icons` | `/images/icons` | Event type icons |
| Hero Image | `/static/images/venue` | `/images/venue` | Venue photos     |

### Singletons (Data Files)

| Singleton     | Field              | `media_folder`         | `public_folder` |
|---------------|--------------------|------------------------|-----------------|
| Hero Section  | background_image   | `/static/images/hero`  | `images/hero`   |
| Hero Section  | foreground_image   | `/static/images/hero`  | `images/hero`   |
| CTA Banner    | background_image   | `/static/images/venue` | `images/venue`  |
| About Section | blocks[].image.src | `/static/images/about` | `images/about`  |
| Event Types   | types[].icon       | `/static/images/icons` | `/images/icons` |
| Workshops     | features[].icon    | `/static/images/icons` | `/images/icons` |
| Venue Gallery | images[].src       | `/static/images/venue` | `images/venue`  |
| 404 Page      | background_image   | `/static/images/venue` | `images/venue`  |

### Pages Collection

| Page      | Field    | `media_folder`         | `public_folder` |
|-----------|----------|------------------------|-----------------|
| Homepage  | image    | `/static/images/hero`  | `/images/hero`  |
| About     | og_image | `/static/images/about` | `/images/about` |
| Contact   | og_image | `/static/images/hero`  | `/images/hero`  |
| Workshops | og_image | `/static/images/venue` | `/images/venue` |

---

## Asset Picker Tabs

Sveltia CMS provides a multi-tabbed asset selection dialog. The tabs that appear depend on the configuration hierarchy.

### Available Tabs

| Tab                   | Shows Assets From                             |
|-----------------------|-----------------------------------------------|
| **Field Assets**      | The field-level `media_folder` directory      |
| **Entry Assets**      | The entry's own directory (for page bundles)  |
| **Collection Assets** | The collection-level `media_folder` directory |
| **Global Assets**     | The global `media_folder` directory           |

### Tab Suppression Rule

Sveltia CMS suppresses a tab when its `media_folder` resolves to the same directory as another tab's `media_folder`. To ensure distinct tabs appear, make field-level and collection-level `media_folder` values different.

### Current Tab Behavior

| Editor Context           | Tabs Shown                                        |
|--------------------------|---------------------------------------------------|
| Blog post Featured Image | Field Assets (venue), Entry Assets, Global Assets |
| Blog \_index Hero Image  | Field Assets (venue), Global Assets               |
| Events Hero Image        | Field Assets (venue), Global Assets               |
| Events Icon              | Field Assets (icons), Global Assets               |
| Hero Section images      | Field Assets (hero), Global Assets                |
| Venue Gallery images     | Field Assets (venue), Global Assets               |

---

## Image Directory Inventory

### Directory Structure

```text
static/images/
├── about/          # 2 files - About section images
├── blog/           # Empty (.gitkeep) - Blog page bundles use content/blog/<slug>/
├── hero/           # 2 files - Homepage hero images
├── icons/          # 9 files - Event type and feature icons
├── logo/           # 2 files - Brand logos (not CMS-managed)
├── social/         # 2 files - Social media icons (not CMS-managed)
├── venue/          # 11 files - Venue photos (shared across site)
└── og-default.jpg  # 1 file - SEO fallback image
```

### Complete File List

#### `static/images/about/` (2 files)

| File                   | Used By       |
|------------------------|---------------|
| `event-party-bw.jpg`   | About section |
| `team-eden-lyndal.jpg` | About section |

#### `static/images/hero/` (2 files)

| File                      | Used By                 |
|---------------------------|-------------------------|
| `venue-exterior-tall.jpg` | Homepage hero (desktop) |
| `venue-exterior.jpg`      | Homepage hero (mobile)  |

#### `static/images/icons/` (9 files)

| File                     | Used By           |
|--------------------------|-------------------|
| `icon-badge.png`         | Corporate events  |
| `icon-cake.png`          | Birthday parties  |
| `icon-champagne.png`     | Private parties   |
| `icon-disco-ball.png`    | Dance events      |
| `icon-instructor.svg`    | Workshops feature |
| `icon-palette.svg`       | Workshops feature |
| `icon-rattle.png`        | Baby showers      |
| `icon-supplies.svg`      | Workshops feature |
| `icon-wedding-rings.png` | Weddings          |

#### `static/images/venue/` (11 files)

| File                            | Used By                                |
|---------------------------------|----------------------------------------|
| `venue-01-interior.jpeg`        | Events, Gallery, Blog                  |
| `venue-02-foyer.png`            | Gallery, Blog                          |
| `venue-03-lower-patio.jpg`      | Gallery                                |
| `venue-04-wedding.jpg`          | Weddings event, Gallery, Blog          |
| `venue-05-dancefloor.jpg`       | Birthday/Dance events, Gallery, Blog   |
| `venue-06-soft-seating.jpg`     | Baby showers, Gallery, Blog index      |
| `venue-07-bar.jpg`              | Private parties, Gallery               |
| `venue-08-disco-background.jpg` | Dance events, CTA banner, 404, Gallery |
| `venue-09-table-chairs.png`     | Gallery                                |
| `venue-10-seating-area.png`     | Gallery                                |
| `IMG_9271.jpeg`                 | Available for use                      |

#### Non-CMS Managed

| Directory               | Files                                                     | Purpose      |
|-------------------------|-----------------------------------------------------------|--------------|
| `static/images/logo/`   | `pike-west-logo-horizontal.png`, `pike-west-logomark.png` | Brand logos  |
| `static/images/social/` | `icon-facebook.png`, `icon-instagram.png`                 | Social icons |
| `static/images/`        | `og-default.jpg`                                          | SEO fallback |

---

## Path Conventions

### Leading Slash Convention

The site uses mixed conventions for `public_folder`:

| Convention  | Fields Using It                                       |
|-------------|-------------------------------------------------------|
| With `/`    | Events Hero Image, Events Icon, Event Types Grid Icon |
| Without `/` | All other fields (singletons, blog, pages)            |

Both conventions work because templates use `resources.Get()` which normalizes paths. The inconsistency is cosmetic, not functional.

### Recommended Path Patterns

| Use Case            | `media_folder`         | `public_folder` | Front Matter Result      |
|---------------------|------------------------|-----------------|--------------------------|
| Shared venue photos | `/static/images/venue` | `images/venue`  | `images/venue/photo.jpg` |
| Page bundle images  | `''`                   | `''`            | `photo.jpg`              |
| Event icons         | `/static/images/icons` | `/images/icons` | `/images/icons/icon.png` |

---

## Template Integration

### Standard Image Loading Pattern

```go-html-template
{{/* Load image from front matter path */}}
{{ $image := resources.Get .Params.image }}
{{ if $image }}
  {{ $webp := $image.Resize "800x webp q85" }}
  <img src="{{ $webp.RelPermalink }}" alt="{{ .Params.image_alt }}">
{{ end }}
```

### With Fallback

```go-html-template
{{/* Load with fallback to default */}}
{{ $imagePath := .Params.image | default "images/venue/venue-01-interior.jpeg" }}
{{ $image := resources.Get $imagePath }}
```

### Page Bundle Resources

```go-html-template
{{/* For blog posts with co-located images */}}
{{ with .Resources.GetMatch .Params.image }}
  <img src="{{ .RelPermalink }}" alt="{{ $.Params.image_alt }}">
{{ end }}
```

---

## Best Practices

### 1. Always Set Both Settings Explicitly

```yaml
# Explicit (preferred)
media_folder: /static/images/venue
public_folder: images/venue

# Don't rely on defaults
```

### 2. Use Absolute Paths at Field Level for Shared Directories

```yaml
fields:
  - label: Hero Image
    name: image
    widget: image
    media_folder: /static/images/venue    # absolute, repo-root
    public_folder: images/venue            # for resources.Get
```

### 3. Keep Field and Collection `media_folder` Different

Ensures the Field Assets tab appears in the picker:

```yaml
collections:
  - name: blog
    media_folder: ''                       # entry-relative
    fields:
      - name: image
        widget: image
        media_folder: /static/images/venue # different from collection
```

### 4. Use Entry-Relative Paths for Page Bundles

```yaml
collections:
  - name: blog
    path: '{{slug}}/index'
    media_folder: ''        # store in entry's folder
    public_folder: ''       # relative path in front matter
```

### 5. Organize Directories by Content Purpose

```text
static/images/
  about/     # About section
  hero/      # Homepage hero
  icons/     # Event/feature icons
  venue/     # Shared venue photos
```

---

## Common Pitfalls

### Pitfall 1: Field Assets Tab Missing

**Symptom:** The Field Assets tab doesn't appear in the asset picker.

**Cause:** Field-level `media_folder` equals collection-level `media_folder`.

**Fix:** Ensure field and collection `media_folder` values are different.

### Pitfall 2: Images Not Found in Hugo

**Symptom:** Images show as broken on the published site.

**Cause:** `public_folder` doesn't match what `resources.Get()` expects.

**Fix:** For images in `static/`, use paths without `static/` prefix:

```yaml
media_folder: /static/images/venue   # where it's stored
public_folder: images/venue           # what resources.Get sees
```

### Pitfall 3: Default `public_folder` Includes `static/`

**Symptom:** Front matter contains `/static/images/photo.jpg`.

**Cause:** `public_folder` not set explicitly.

**Fix:** Always set `public_folder` explicitly.

### Pitfall 4: Page Bundle Images Don't Work

**Symptom:** Blog featured images that should be co-located don't resolve.

**Cause:** Using `resources.Get` instead of `.Resources.GetMatch`.

**Fix:** For page bundles, use:

```go-html-template
{{ with .Resources.GetMatch .Params.image }}
```

---

## References

### Sveltia CMS

- [Getting Started](https://sveltiacms.app/en/docs/start)
- [Internal Media Storage](https://sveltiacms.app/en/docs/media/internal)
- [GitHub Repository](https://github.com/sveltia/sveltia-cms)

### Hugo

- [Page Resources](https://gohugo.io/content-management/page-resources/)
- [Image Processing](https://gohugo.io/content-management/image-processing/)

### Project Documentation

- [Sveltia CMS Research](./sveltia-cms-research.md) - General CMS research and comparison
- [Event Hero Images Plan](./plans/2026-01-21-event-hero-images.md) - Hero image implementation
- [Media Library Improvements Plan](./plans/2026-01-28-media-library-config-improvements.md) - CMS improvements

---

## Archived Documents

The following documents were consolidated into this guide:

| Document                                | Status   | Notes                      |
|-----------------------------------------|----------|----------------------------|
| `cms-media-folder-best-practices.md`    | Archived | Core content merged here   |
| `cms-media-folder-matrix.md`            | Archived | Config tables merged here  |
| `cms-image-path-audit.md`               | Archived | Path inventory merged here |
| `cms-editor-image-picker-inspection.md` | Archived | UX info merged here        |
| `sveltia-cms-media-library.md`          | Archived | Asset tabs merged here     |

Historical/debugging documents kept separate:

- `sveltia-cms-entry-parsing-debug.md` - Technical debugging investigation
- `sveltia-cms-local-workflow-learnings.md` - Worktree compatibility fix
