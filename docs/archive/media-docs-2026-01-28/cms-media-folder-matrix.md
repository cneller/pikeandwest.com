# CMS Media Folder Configuration Matrix

Complete mapping of every `media_folder` and `public_folder` setting in `static/admin/config.yml`, plus a directory inventory of all image assets.

Last updated: 2026-01-28

---

## Global Settings

| Setting         | Value           | Resolved Path    |
|-----------------|-----------------|------------------|
| `media_folder`  | `static/images` | `static/images/` |
| `public_folder` | `/images`       | `/images/`       |

These are the defaults inherited by any collection or field that does not specify its own `media_folder`/`public_folder`.

---

## Collections

### Blog Posts (`blog`) -- Folder Collection

**Collection level:**

| Setting         | Value | Behavior                                  |
|-----------------|-------|-------------------------------------------|
| `media_folder`  | `''`  | Page bundle relative (entry's own folder) |
| `public_folder` | `''`  | Relative path in front matter             |

**Index file (`content/blog/_index.md`):**

| Field      | `media_folder`         | `public_folder` | Target Directory       |
|------------|------------------------|-----------------|------------------------|
| Hero Image | `/static/images/venue` | `images/venue`  | `static/images/venue/` |

**Entry fields (individual blog posts):**

| Field          | `media_folder`         | `public_folder` | Target Directory       |
|----------------|------------------------|-----------------|------------------------|
| Featured Image | `/static/images/venue` | `images/venue`  | `static/images/venue/` |

**Asset picker behavior (blog entries):**

| Tab           | Source                                | Shows              |
|---------------|---------------------------------------|--------------------|
| Field Assets  | Field `media_folder` (venue)          | 10 venue photos    |
| Entry Assets  | Collection `media_folder` (bundle)    | Page bundle images |
| Global Assets | Global `media_folder` (static/images) | All site images    |

> Field-level differs from collection-level (`/static/images/venue` vs `''`), so all three tabs appear.

---

### Event Pages (`events`) -- Folder Collection

**Collection level:**

| Setting         | Value       | Behavior                         |
|-----------------|-------------|----------------------------------|
| `media_folder`  | _(not set)_ | Inherits global: `static/images` |
| `public_folder` | _(not set)_ | Inherits global: `/images`       |

**Index file (`content/events/_index.md`):**

| Field      | `media_folder`         | `public_folder` | Target Directory       |
|------------|------------------------|-----------------|------------------------|
| Hero Image | `/static/images/venue` | `/images/venue` | `static/images/venue/` |

**Entry fields (individual event pages):**

| Field      | `media_folder`         | `public_folder` | Target Directory       |
|------------|------------------------|-----------------|------------------------|
| Icon       | `/static/images/icons` | `images/icons`  | `static/images/icons/` |
| Hero Image | `/static/images/venue` | `/images/venue` | `static/images/venue/` |

**Asset picker behavior (events entries):**

| Tab               | Source                                | Shows           |
|-------------------|---------------------------------------|-----------------|
| Field Assets      | Field `media_folder`                  | Venue or icons  |
| Collection Assets | Collection `media_folder` (inherited) | All site images |
| Global Assets     | Global `media_folder` (static/images) | All site images |

> Field-level (`/static/images/venue`) differs from inherited collection-level (`static/images`), so Field Assets tab appears with venue photos.

---

### Pages (`pages`) -- File Collection

**No image fields.** All pages (Homepage, About, Contact, Workshops, Privacy, Accessibility, Gallery Application) use only `string`, `text`, `list`, `object`, `boolean`, and `markdown` widgets. No `media_folder` or `public_folder` settings.

Images embedded via the markdown body widget inherit the global `media_folder` (`static/images`).

---

## Singletons (Data Files)

### Hero Section (`hero`) -- `data/hero.yaml`

| Field            | `media_folder`        | `public_folder` | Target Directory      |
|------------------|-----------------------|-----------------|-----------------------|
| Background Image | `/static/images/hero` | `images/hero`   | `static/images/hero/` |
| Foreground Image | `/static/images/hero` | `images/hero`   | `static/images/hero/` |

### CTA Banner (`cta_banner`) -- `data/cta_banner.yaml`

| Field            | `media_folder`         | `public_folder` | Target Directory       |
|------------------|------------------------|-----------------|------------------------|
| Background Image | `/static/images/venue` | `images/venue`  | `static/images/venue/` |

### About Section (`about_data`) -- `data/about.yaml`

| Field              | `media_folder`         | `public_folder` | Target Directory       |
|--------------------|------------------------|-----------------|------------------------|
| blocks[].image.src | `/static/images/about` | `images/about`  | `static/images/about/` |

### Event Types Grid (`events_data`) -- `data/events.yaml`

| Field        | `media_folder`         | `public_folder` | Target Directory       |
|--------------|------------------------|-----------------|------------------------|
| types[].icon | `/static/images/icons` | `images/icons`  | `static/images/icons/` |

### Workshops Content (`workshops_data`) -- `data/workshops.yaml`

| Field           | `media_folder`         | `public_folder` | Target Directory       |
|-----------------|------------------------|-----------------|------------------------|
| features[].icon | `/static/images/icons` | `images/icons`  | `static/images/icons/` |

### Venue Gallery (`venue_gallery`) -- `data/venue_gallery.yaml`

| Field        | `media_folder`         | `public_folder` | Target Directory       |
|--------------|------------------------|-----------------|------------------------|
| images[].src | `/static/images/venue` | `images/venue`  | `static/images/venue/` |

### Blog Taxonomy (`blog_taxonomy`) -- `data/blog_taxonomy.yaml`

No image fields.

### 404 Error Page (`error404`) -- `data/error404.yaml`

| Field            | `media_folder`         | `public_folder` | Target Directory       |
|------------------|------------------------|-----------------|------------------------|
| Background Image | `/static/images/venue` | `images/venue`  | `static/images/venue/` |

---

## Directory-to-Field Cross-Reference

Which CMS fields point to each image directory:

| Directory               | Files | Referenced By                                                                                                                                                                    |
|-------------------------|-------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `static/images/`        | 1     | Global default (markdown body widgets, inherited collection default)                                                                                                             |
| `static/images/about/`  | 2     | About Section: blocks[].image.src                                                                                                                                                |
| `static/images/blog/`   | 0     | Blog collection-level (page bundles, currently empty)                                                                                                                            |
| `static/images/hero/`   | 2     | Hero Section: Background Image, Foreground Image                                                                                                                                 |
| `static/images/icons/`  | 9     | Events: Icon field, Event Types Grid: types[].icon, Workshops: features[].icon                                                                                                   |
| `static/images/logo/`   | 2     | _(not managed via CMS -- used in templates directly)_                                                                                                                            |
| `static/images/social/` | 2     | _(not managed via CMS -- used in templates directly)_                                                                                                                            |
| `static/images/venue/`  | 10    | Blog: Featured Image, Blog \_index: Hero Image, Events: Hero Image, Events \_index: Hero Image, CTA Banner: Background Image, Venue Gallery: images[].src, 404: Background Image |

---

## Directory Inventory

### `static/images/` (root)

| File             | Used By               |
|------------------|-----------------------|
| `og-default.jpg` | SEO/OG fallback image |

### `static/images/about/` (2 files)

- `event-party-bw.jpg`
- `team-eden-lyndal.jpg`

### `static/images/blog/` (0 files)

Empty. Blog posts use page bundles (`content/blog/<slug>/`) for entry-specific images.

### `static/images/hero/` (2 files)

- `venue-exterior-tall.jpg` -- Background (desktop, 1920x1080)
- `venue-exterior.jpg` -- Foreground (mobile, 1920x800)

### `static/images/icons/` (9 files)

- `icon-badge.png` -- Corporate events
- `icon-cake.png` -- Birthday parties
- `icon-champagne.png` -- Private parties
- `icon-disco-ball.png` -- Dance events
- `icon-instructor.svg` -- Workshops feature
- `icon-palette.svg` -- Workshops feature
- `icon-rattle.png` -- Baby showers
- `icon-supplies.svg` -- Workshops feature
- `icon-wedding-rings.png` -- Weddings

### `static/images/logo/` (2 files)

- `pike-west-logo-horizontal.png`
- `pike-west-logomark.png`

### `static/images/social/` (2 files)

- `icon-facebook.png`
- `icon-instagram.png`

### `static/images/venue/` (10 files)

- `venue-01-interior.jpeg`
- `venue-02-foyer.png`
- `venue-03-lower-patio.jpg`
- `venue-04-wedding.jpg`
- `venue-05-dancefloor.jpg`
- `venue-06-soft-seating.jpg`
- `venue-07-bar.jpg`
- `venue-08-disco-background.jpg`
- `venue-09-table-chairs.png`
- `venue-10-seating-area.png`

---

## `public_folder` Consistency Audit

The `public_folder` determines the path written into content files. There is an inconsistency in leading `/` usage:

| Context                        | `public_folder` | Writes path as               | Leading `/` |
|--------------------------------|-----------------|------------------------------|-------------|
| Global                         | `/images`       | `/images/filename.jpg`       | Yes         |
| Blog: Featured Image           | `images/venue`  | `images/venue/filename.jpg`  | No          |
| Blog \_index: Hero Image       | `images/venue`  | `images/venue/filename.jpg`  | No          |
| Events: Icon                   | `images/icons`  | `images/icons/filename.png`  | No          |
| **Events: Hero Image**         | `/images/venue` | `/images/venue/filename.jpg` | **Yes**     |
| **Events \_index: Hero Image** | `/images/venue` | `/images/venue/filename.jpg` | **Yes**     |
| Hero Section: Background       | `images/hero`   | `images/hero/filename.jpg`   | No          |
| Hero Section: Foreground       | `images/hero`   | `images/hero/filename.jpg`   | No          |
| CTA Banner: Background         | `images/venue`  | `images/venue/filename.jpg`  | No          |
| About Section: Image           | `images/about`  | `images/about/filename.jpg`  | No          |
| Event Types Grid: Icon         | `images/icons`  | `images/icons/filename.png`  | No          |
| Workshops: Feature Icon        | `images/icons`  | `images/icons/filename.svg`  | No          |
| Venue Gallery: Image           | `images/venue`  | `images/venue/filename.jpg`  | No          |
| 404 Page: Background           | `images/venue`  | `images/venue/filename.jpg`  | No          |

The Events collection Hero Image fields (both `_index` and regular entries) use `/images/venue` (absolute), while all other fields use `images/venue` (relative). Both work in Hugo templates, but the inconsistency means:

- Events Hero Images write: `image: "/images/venue/venue-04-wedding.jpg"`
- Blog Featured Images write: `image: "images/venue/venue-04-wedding.jpg"`

This has no functional impact (Hugo resolves both correctly), but standardizing to one convention would improve consistency.

---

## Sveltia CMS Asset Picker Tab Behavior

Sveltia CMS suppresses the **Field Assets** tab when the field-level `media_folder` is identical to the collection-level `media_folder`. To ensure all three tabs appear in the picker, the field-level and collection-level must point to different directories.

| Collection | Collection `media_folder`      | Field `media_folder`   | Tabs Distinct? |
|------------|--------------------------------|------------------------|----------------|
| Blog       | `''` (page bundle)             | `/static/images/venue` | Yes            |
| Events     | _(inherited: `static/images`)_ | `/static/images/venue` | Yes            |
