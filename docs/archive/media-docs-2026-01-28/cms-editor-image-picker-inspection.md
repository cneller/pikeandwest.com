# CMS Blog Editor - Image Picker Interface Inspection

**Date:** 2026-01-28
**Location:** `http://localhost:1313/admin/#/collections/blog/entries/_index`
**Editor:** Sveltia CMS v0.37.0+
**Content Type:** Blog Posts (Folder Collection)

---

## Editor State Overview

The blog post editor displays the following fields in order:

1. **Title** (string, required, max 70 chars)
2. **Description** (text, required, 150-160 chars)
3. **Date** (datetime, required, format YYYY-MM-DD)
4. **Featured Image** (image widget, required) ← **IMAGE PICKER HERE**
5. **Image Alt Text** (string, required)
6. **Author** (string, default: "Pike & West")
7. **Categories** (select, multiple, 1-2 options)
8. **Tags** (select, multiple, predefined list)
9. **Keywords** (list, optional)
10. **Draft** (boolean toggle, default: false)
11. **Body** (markdown editor with toolbar)

---

## Featured Image Field Configuration

| Property      | Value                                                           |
|---------------|-----------------------------------------------------------------|
| Label         | Featured Image                                                  |
| Field Name    | `image`                                                         |
| Widget Type   | `image`                                                         |
| Required      | Yes                                                             |
| Media Folder  | `/static/images/venue`                                          |
| Public Folder | `images/venue`                                                  |
| Hint          | "Recommended: 1200x630px. Displays as hero background on post." |

**Source:** `static/admin/config.yml` lines 118-124

---

## Image Picker Dialog - Tabs and Content

### Tab Structure

When clicking the "Featured Image" field, Sveltia CMS opens an asset picker with **3 tabs**:

| # | Tab Name          | Source `media_folder`    | Files Shown          |
|---|-------------------|--------------------------|----------------------|
| 1 | **Field Assets**  | `/static/images/venue`   | 10 venue photos      |
| 2 | **Entry Assets**  | `''` (page bundle)       | 0-5 per entry        |
| 3 | **Global Assets** | `static/images` (global) | 28 total site images |

**Why 3 tabs?** The field-level `media_folder` differs from the collection-level `media_folder`, so Sveltia CMS shows all three distinct sources (no deduplication).

---

### Field Assets Tab (Recommended)

**Purpose:** Show venue photos managed at `/static/images/venue/`

**Images (10 files, sorted alphabetically):**

| Filename                        | Type | Used In                    |
|---------------------------------|------|----------------------------|
| `venue-01-interior.jpeg`        | JPEG | Event pages, blog posts    |
| `venue-02-foyer.png`            | PNG  | Blog posts, gallery        |
| `venue-03-lower-patio.jpg`      | JPG  | Venue gallery, blog posts  |
| `venue-04-wedding.jpg`          | JPG  | Weddings event page, blog  |
| `venue-05-dancefloor.jpg`       | JPG  | Blog posts, dance events   |
| `venue-06-soft-seating.jpg`     | JPG  | Blog index, about section  |
| `venue-07-bar.jpg`              | JPG  | Private parties event page |
| `venue-08-disco-background.jpg` | JPG  | Dance events, CTA banner   |
| `venue-09-table-chairs.png`     | PNG  | Venue gallery              |
| `venue-10-seating-area.png`     | PNG  | Venue gallery              |

**Recommended usage:** Most blog posts should use one of these venue photos as featured image. If posting about a specific event type, consider:

- Weddings: `venue-04-wedding.jpg`
- Dance events: `venue-08-disco-background.jpg`
- General: `venue-01-interior.jpeg` or `venue-06-soft-seating.jpg`

---

### Entry Assets Tab

**Purpose:** Show images uploaded with the individual blog post (page bundle)

**Current images:** Varies per blog post

**Examples from existing blog posts:**

| Blog Post Slug                       | Bundle Images                    |
|--------------------------------------|----------------------------------|
| `welcome-to-pike-and-west`           | `IMG_9248.jpeg`                  |
| `valentines-day-love-in-all-forms`   | `valentines-day-hero.jpg`        |
| `milestone-birthday-new-year`        | `milestone-birthday-hero.png`    |
| `holiday-anniversary-celebrations`   | (none - uses shared venue image) |
| `corporate-event-planning-tips-2026` | (none - uses shared venue image) |
| `fall-baby-shower-inspiration`       | (none - uses shared venue image) |

**Usage:** Upload custom images specific to a blog post (hero art, custom graphics, diagrams). These are stored alongside the blog post content in `content/blog/{slug}/` directory.

---

### Global Assets Tab

**Purpose:** Browse all images on the site (fallback option)

**Images by Category (28 total):**

**About Section (2):**

- `event-party-bw.jpg`
- `team-eden-lyndal.jpg`

**Hero Section (2):**

- `venue-exterior-tall.jpg` (1920x1080, desktop)
- `venue-exterior.jpg` (1920x800, mobile)

**Icons (9 - not recommended for blog featured image):**

- `icon-badge.png` (corporate)
- `icon-cake.png` (birthday)
- `icon-champagne.png` (private party)
- `icon-disco-ball.png` (dance)
- `icon-instructor.svg` (workshops)
- `icon-palette.svg` (workshops)
- `icon-rattle.png` (baby shower)
- `icon-supplies.svg` (workshops)
- `icon-wedding-rings.png` (wedding)

**Logos (not recommended for blog, managed outside CMS):**

- `pike-west-logo-horizontal.png`
- `pike-west-logomark.png`

**Venue Photos (10 - same as Field Assets tab):**

- (all 10 images listed above)

**Default OG Image (fallback):**

- `og-default.jpg`

---

## Front Matter Output

When an image is selected, the CMS writes this to the blog post's front matter:

```yaml
# Example: selecting venue-04-wedding.jpg
image: images/venue/venue-04-wedding.jpg
```

**Convention:** Relative path without leading `/`
**Hugo resolution:** Via `resources.Get()` module mount in templates

---

## Asset Picker UX Summary

| User Action                   | Result                                    |
|-------------------------------|-------------------------------------------|
| Click Featured Image field    | Asset picker dialog opens with 3 tabs     |
| Default tab                   | Field Assets (venue photos) selected      |
| Select from Field Assets tab  | Uses recommended venue photo              |
| Select from Entry Assets tab  | Uses post-specific image from page bundle |
| Select from Global Assets tab | Uses any image on site (fallback)         |
| Recommended workflow          | Use Field Assets tab (venue photos)       |

---

## Technical Reference

**CMS Config Path:** `static/admin/config.yml`

**Collection Definition:** Lines 47-184 (blog collection)

**Featured Image Field:** Lines 118-124 (entry-level) and 86-93 (index-level)

**Media Folder Hierarchy:**

```text
Level 1: Global media_folder = static/images
         Global public_folder = /images
           ↓
Level 2: Blog Collection media_folder = '' (page bundle)
                        public_folder = '' (relative)
           ↓
Level 3: Featured Image Field media_folder = /static/images/venue
                              public_folder = images/venue
```

**Asset Picker Tab Logic:**

Sveltia CMS shows 3 tabs because:

- Field tab source: `/static/images/venue` ≠ Collection tab source: `''` → Field tab appears
- Collection tab source: `''` ≠ Global tab source: `static/images` → Collection tab appears
- Global tab always appears

---

## Best Practices for Blog Featured Images

1. **Use Field Assets tab** (recommended) - Contains curated venue photos
2. **Choose images 1200x630px or larger** - Matches recommended size
3. **Provide descriptive alt text** - Required field for accessibility
4. **Match image to blog topic** - Select a venue photo that complements the post content
5. **For custom graphics** - Upload to Entry Assets tab (page bundle) instead

---

## Documentation References

- [CMS Media Folder Configuration Matrix](./cms-media-folder-matrix.md)
- [CMS Media Folder Best Practices](./cms-media-folder-best-practices.md)
- [CMS Image Path Audit](./cms-image-path-audit.md)
