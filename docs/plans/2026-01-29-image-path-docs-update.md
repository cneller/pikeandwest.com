# Image Path Documentation Update Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update all active documentation files to reflect the new image directory structure from the recent reorganization.

**Architecture:** Simple find-and-replace operations across 4 files. No code changes, only documentation path updates.

**Tech Stack:** Markdown files

---

## Path Mappings

| Old Path                | New Path                       |
|-------------------------|--------------------------------|
| `images/venue/`         | `images/photos/`               |
| `images/hero/`          | `images/homepage-hero/`        |
| `images/about/`         | `images/photos/`               |
| `images/logo/`          | `images/brand/`                |
| `images/social/`        | `images/brand/`                |
| `static/images/venue/`  | `static/images/photos/`        |
| `static/images/hero/`   | `static/images/homepage-hero/` |
| `static/images/about/`  | `static/images/photos/`        |
| `static/images/logo/`   | `static/images/brand/`         |
| `static/images/social/` | `static/images/brand/`         |

---

### Task 1: Update Blog Editor Agent

**Files:**

- Modify: `.claude/agents/blog-editor.md`

**Step 1: Update front matter example (line 98)**

Change:

```yaml
image: "images/venue/venue-XX.jpeg"             # Hero image path
```

To:

```yaml
image: "images/photos/venue-XX.jpeg"            # Hero image path
```

**Step 2: Verify no other old paths remain**

```bash
grep -n "images/venue\|images/hero\|images/about\|images/logo\|images/social" .claude/agents/blog-editor.md
# Expected: No matches
```

**Step 3: Commit**

```bash
git add .claude/agents/blog-editor.md
git commit -m "docs(agent): update blog-editor image paths for new structure"
```

---

### Task 2: Update Sveltia Hugo Maintenance Skill

**Files:**

- Modify: `.claude/skills/sveltia-hugo-maintenance/SKILL.md`

**Step 1: Update Current Image Organization section (lines 496-506)**

Change:

```text
static/images/
  about/         # Team and about section photos
  blog/          # Blog post images (placeholder)
  hero/          # Homepage hero images
  icons/         # Event type and workshop icons (PNG + SVG)
  logo/          # Logo variants (horizontal, logomark)
  social/        # Social media icons
  venue/         # Venue photography (venue-01 through venue-XX)
```

To:

```text
static/images/
  blog/           # Blog post images (placeholder, page bundles preferred)
  brand/          # Logo variants and social media icons
  categories/     # Blog category taxonomy images
  homepage-hero/  # Homepage hero background/foreground images
  icons/          # Event type and workshop icons (PNG + SVG)
  photos/         # Venue and event photography (venue-01 through venue-XX)
```

**Step 2: Update Hugo module mount example (line 517)**

Change:

```go-html-template
`resources.Get "images/hero/venue-exterior.jpg"` resolves correctly for Hugo
```

To:

```go-html-template
`resources.Get "images/homepage-hero/venue-exterior.jpg"` resolves correctly for Hugo
```

**Step 3: Verify no other old paths remain**

```bash
grep -n "images/venue\|images/hero\|images/about\|images/logo\|images/social" .claude/skills/sveltia-hugo-maintenance/SKILL.md
# Expected: No matches (except in historical context or examples that still reference old patterns)
```

**Step 4: Commit**

```bash
git add .claude/skills/sveltia-hugo-maintenance/SKILL.md
git commit -m "docs(skill): update sveltia-hugo-maintenance image paths for new structure"
```

---

### Task 3: Update Partials Reference

**Files:**

- Modify: `docs/architecture/partials-reference.md`

**Step 1: Search for old paths**

```bash
grep -n "images/venue\|images/hero\|images/about\|images/logo\|images/social" docs/architecture/partials-reference.md
```

Note: This file references `data/` files rather than hardcoded image paths, so there may be no changes needed. If grep returns no matches, skip to Step 3.

**Step 2: Update any found references**

Apply the path mappings from the table above.

**Step 3: Commit (if changes were made)**

```bash
git add docs/architecture/partials-reference.md
git commit -m "docs: update partials-reference image paths for new structure"
```

---

### Task 4: Update CMS Media Configuration Guide

**Files:**

- Modify: `docs/cms-media-configuration.md`

**Step 1: Update Architecture section example (around line 48-53)**

Change:

```markdown
**Example:** With `media_folder: /static/images/venue` and `public_folder: /images/venue`:

- File saved to: `static/images/venue/photo.jpg` (in the repo)
- Front matter value: `/images/venue/photo.jpg` (in the content file)

Hugo strips the `static/` prefix at build time, so `static/images/venue/photo.jpg` becomes `/images/venue/photo.jpg` on the published site.
```

To:

```markdown
**Example:** With `media_folder: /static/images/photos` and `public_folder: /images/photos`:

- File saved to: `static/images/photos/photo.jpg` (in the repo)
- Front matter value: `/images/photos/photo.jpg` (in the content file)

Hugo strips the `static/` prefix at build time, so `static/images/photos/photo.jpg` becomes `/images/photos/photo.jpg` on the published site.
```

**Step 2: Update Hugo Module Mount example (around line 63-64)**

Change:

```markdown
This enables `resources.Get "images/venue/photo.jpg"` to find files at `static/images/venue/photo.jpg`.
```

To:

```markdown
This enables `resources.Get "images/photos/photo.jpg"` to find files at `static/images/photos/photo.jpg`.
```

**Step 3: Update Current Configuration tables (lines 101-138)**

Replace all table entries:

- `/static/images/venue` → `/static/images/photos`
- `images/venue` → `images/photos`
- `/static/images/hero` → `/static/images/homepage-hero`
- `images/hero` → `images/homepage-hero`
- `/static/images/about` → `/static/images/photos`
- `images/about` → `images/photos`

**Step 4: Update Tab Behavior table (lines 160-168)**

Change:

```markdown
| Blog post Featured Image | Field Assets (venue), Entry Assets, Global Assets |
| Blog \_index Hero Image  | Field Assets (venue), Global Assets               |
| Events Hero Image        | Field Assets (venue), Global Assets               |
| Hero Section images      | Field Assets (hero), Global Assets                |
| Venue Gallery images     | Field Assets (venue), Global Assets               |
```

To:

```markdown
| Blog post Featured Image | Field Assets (photos), Entry Assets, Global Assets |
| Blog \_index Hero Image  | Field Assets (photos), Global Assets               |
| Events Hero Image        | Field Assets (photos), Global Assets               |
| Hero Section images      | Field Assets (homepage-hero), Global Assets        |
| Venue Gallery images     | Field Assets (photos), Global Assets               |
```

**Step 5: Update Image Directory Inventory (lines 172-240)**

Replace the entire directory structure and file list sections with:

````markdown
### Directory Structure

```text
static/images/
├── blog/           # Empty (.gitkeep) - Blog page bundles use content/blog/<slug>/
├── brand/          # 4 files - Logos and social icons
├── categories/     # Empty (.gitkeep) - Blog category taxonomy images
├── homepage-hero/  # 2 files - Homepage hero images
├── icons/          # 9 files - Event type and feature icons
├── photos/         # 14 files - Venue and event photos (shared across site)
└── og-default.jpg  # In photos/ - SEO fallback image
````

### Complete File List

#### `static/images/brand/` (4 files)

| File                            | Used By                 |
|---------------------------------|-------------------------|
| `pike-west-logo-horizontal.png` | Header, structured data |
| `pike-west-logomark.png`        | Footer                  |
| `icon-facebook.png`             | Footer social links     |
| `icon-instagram.png`            | Footer social links     |

#### `static/images/homepage-hero/` (2 files)

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

#### `static/images/photos/` (14 files)

| File                            | Used By                                |
|---------------------------------|----------------------------------------|
| `event-party-bw.jpg`            | About section                          |
| `team-eden-lyndal.jpg`          | About section                          |
| `og-default.jpg`                | SEO fallback image                     |
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
| `IMG_9271.jpeg`                 | Birthday events, Blog index            |

````text

**Step 6: Update Path Conventions table (around line 258-263)**

Change:
```markdown
| Shared venue photos | `/static/images/venue` | `images/venue`  | `images/venue/photo.jpg` |
````

To:

```markdown
| Shared venue photos | `/static/images/photos` | `images/photos`  | `images/photos/photo.jpg` |
```

**Step 7: Update Template Integration examples (around lines 271-286)**

Change:

```go-html-template
{{ $imagePath := .Params.image | default "images/venue/venue-01-interior.jpeg" }}
```

To:

```go-html-template
{{ $imagePath := .Params.image | default "images/photos/venue-01-interior.jpeg" }}
```

**Step 8: Update Best Practices examples (around lines 303-333)**

Change all examples:

```yaml
media_folder: /static/images/venue
public_folder: images/venue
```

To:

```yaml
media_folder: /static/images/photos
public_folder: images/photos
```

**Step 9: Update Pitfall examples (around lines 375-378)**

Change:

```yaml
media_folder: /static/images/venue   # where it's stored
public_folder: images/venue           # what resources.Get sees
```

To:

```yaml
media_folder: /static/images/photos   # where it's stored
public_folder: images/photos           # what resources.Get sees
```

**Step 10: Update "Last updated" date (line 6)**

Change:

```markdown
**Last updated:** 2026-01-28
```

To:

```markdown
**Last updated:** 2026-01-29
```

**Step 11: Verify all old paths are updated**

```bash
grep -n "images/venue\|images/hero\|images/about\|images/logo\|images/social" docs/cms-media-configuration.md
# Expected: No matches except in "Archived Documents" section (historical references OK)
```

**Step 12: Commit**

```bash
git add docs/cms-media-configuration.md
git commit -m "docs: update cms-media-configuration for new image directory structure"
```

---

### Task 5: Final Verification

**Step 1: Search all active docs for old paths**

```bash
grep -rn "images/venue\|images/hero\|images/about\|images/logo\|images/social" \
  .claude/agents/ \
  .claude/skills/ \
  docs/architecture/ \
  docs/cms-media-configuration.md \
  --include="*.md"
```

Expected: No matches (or only matches in archived/historical context).

**Step 2: Verify git status**

```bash
git status
# Expected: Clean working tree (all changes committed)
```

**Step 3: Commit the plan file**

```bash
git add docs/plans/2026-01-29-image-path-docs-update.md
git add docs/plans/2026-01-29-image-directory-reorganization.md
git commit -m "docs(plans): add image reorganization plans"
```

---

## Summary

| Task | Files                                              | Scope                        |
|------|----------------------------------------------------|------------------------------|
| 1    | `.claude/agents/blog-editor.md`                    | 1 path reference             |
| 2    | `.claude/skills/sveltia-hugo-maintenance/SKILL.md` | Directory structure, example |
| 3    | `docs/architecture/partials-reference.md`          | Verify (may be clean)        |
| 4    | `docs/cms-media-configuration.md`                  | Extensive updates            |
| 5    | Final verification                                 | Grep checks                  |
