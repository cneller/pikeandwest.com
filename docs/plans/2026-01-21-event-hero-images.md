# Event Hero Images & Front Matter CMS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add hero images to event pages (matching blog style) with front matter fields editable via Front Matter CMS sidebar in VS Code.

**Architecture:** Reuse existing `blog-hero` SCSS styles by creating a shared `.page-hero` class. Add `image` and `image_alt` front matter fields to event content. Configure Front Matter CMS with `frontmatter.json` for visual editing in VS Code sidebar.

**Tech Stack:** Hugo, SCSS, Front Matter CMS (VS Code extension), Go templates

---

## Summary of Changes

| File                          | Action | Purpose                                       |
|-------------------------------|--------|-----------------------------------------------|
| `assets/scss/_page-hero.scss` | Create | Shared hero styles (extracted from blog-hero) |
| `assets/scss/_blog-hero.scss` | Modify | Extend page-hero, keep blog-specific meta     |
| `assets/scss/main.scss`       | Modify | Import page-hero before blog-hero             |
| `layouts/events/single.html`  | Modify | Add hero section with image support           |
| `content/events/*.md`         | Modify | Add image/image_alt to all 6 event files      |
| `frontmatter.json`            | Create | Front Matter CMS configuration                |
| `archetypes/events.md`        | Create | Template for new event pages                  |

---

## Task 1: Create Shared Page Hero Styles

**Files:**

- Create: `assets/scss/_page-hero.scss`

**Step 1: Create the page-hero partial**

Create file `assets/scss/_page-hero.scss`:

```scss
// =========================
// Page Hero Section
// =========================
// Shared hero styles for content pages (blog, events)
// Full-bleed background image with overlay and centered title

.page-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  min-height: 300px;
  max-height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;

  // Dark overlay for text readability
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }

  // Bottom gradient for breadcrumb contrast
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 40%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.5) 0%,
      transparent 100%
    );
    z-index: 1;
    pointer-events: none;
  }

  // Tablet
  @media (max-width: $breakpoint-lg) {
    height: 35vh;
    min-height: 250px;
  }

  // Mobile - let hero expand to fit content naturally
  @media (max-width: $breakpoint-md) {
    height: auto;
    min-height: 200px;
  }

  // Mobile portrait
  @media (max-width: $breakpoint-sm) {
    min-height: 180px;
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: $spacing-xl $spacing-lg;

    @media (max-width: $breakpoint-md) {
      padding: $spacing-lg $spacing-md;
      width: 100%;
    }

    @media (max-width: $breakpoint-sm) {
      padding: $spacing-md;
    }
  }

  &__title {
    font-family: $font-display;
    font-size: 2.5rem;
    font-weight: $font-weight-regular;
    line-height: 1.15;
    letter-spacing: 0.1em;
    color: $color-cream;
    margin: 0;
    text-transform: uppercase;
    text-wrap: balance;

    @media (min-width: $breakpoint-xl) {
      font-size: 3rem;
    }

    @media (max-width: $breakpoint-md) {
      font-size: 1.5rem;
      letter-spacing: 0.05em;
      max-width: 90%;
      margin: 0 auto;
    }

    @media (max-width: $breakpoint-sm) {
      font-size: 1.35rem;
    }
  }
}
```

**Step 2: Verify file created**

Run: `head -20 assets/scss/_page-hero.scss`
Expected: Shows mixin header and first styles

**Step 3: Commit**

```bash
git add assets/scss/_page-hero.scss
git commit -m "feat(scss): add shared page-hero styles for content pages"
```

---

## Task 2: Refactor Blog Hero to Extend Page Hero

**Files:**

- Modify: `assets/scss/_blog-hero.scss`

**Step 1: Replace blog-hero with extension of page-hero**

Replace entire content of `assets/scss/_blog-hero.scss` with:

```scss
// =========================
// Blog Hero Section
// =========================
// Extends page-hero with blog-specific meta (date, author)

.blog-hero {
  @extend .page-hero;

  // Blog-specific: meta information below title
  &__content {
    @extend .page-hero__content;
  }

  &__title {
    @extend .page-hero__title;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    margin-top: $spacing-sm;
    font-family: $font-secondary;
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__author {
    &::before {
      content: '|';
      margin-right: $spacing-md;
    }
  }
}
```

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Commit**

```bash
git add assets/scss/_blog-hero.scss
git commit -m "refactor(blog): extend page-hero for blog-specific styling"
```

---

## Task 3: Import Page Hero in Main Stylesheet

**Files:**

- Modify: `assets/scss/main.scss`

**Step 1: Add import before blog-hero**

In `assets/scss/main.scss`, find:

```scss
@import 'blog-hero';
```

Change to:

```scss
@import 'page-hero';
@import 'blog-hero';
```

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Visual verification - check blog hero still works**

Run: `hugo server -D &`
Then open: <http://localhost:1313/blog/corporate-event-planning-tips-2026/>
Verify: Blog hero displays correctly with image and meta

**Step 4: Stop server and commit**

```bash
pkill -f "hugo server" || true
git add assets/scss/main.scss
git commit -m "feat(scss): import page-hero before blog-hero"
```

---

## Task 4: Update Event Single Template with Hero

**Files:**

- Modify: `layouts/events/single.html`

**Step 1: Replace template with hero support**

Replace entire content of `layouts/events/single.html` with:

```go-html-template
{{ define "main" }}
{{/*
  Single Event Page Template

  Purpose: Displays individual event type pages (weddings, birthdays, etc.)
  with hero image, breadcrumb, content, and CTA.

  Context: . = Page (event content page)
*/}}

{{/* Event Hero - Use page's featured image or fallback to venue image */}}
{{ $heroImage := "" }}
{{ with .Params.image }}
  {{ $heroImage = resources.Get . }}
{{ end }}
{{ if not $heroImage }}
  {{/* Default fallback image for events */}}
  {{ $heroImage = resources.Get "images/venue/venue-01-interior.jpeg" }}
{{ end }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{/* Convert to WebP for smaller file size */}}
  {{ $heroBg = ($heroImage.Resize "1920x webp q85").RelPermalink }}
{{ end }}

<section class="page-hero" style="background-image: url('{{ $heroBg }}');">
  <div class="page-hero__content">
    <h1 class="page-hero__title">{{ .Title }}</h1>
  </div>
</section>

{{/* Breadcrumb Navigation */}}
{{ partial "breadcrumb.html" (dict "Page" . "accentBar" true) }}

{{/* Event Content */}}
<article class="event-page section">
  <div class="container">
    <div class="event-page__content content">
      {{ .Content }}
    </div>

    {{/* CTA Section */}}
    <div class="event-page__cta">
      <a href="/contact/" class="btn btn-primary">Schedule a Tour</a>
    </div>
  </div>
</article>
{{ end }}
```

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Commit**

```bash
git add layouts/events/single.html
git commit -m "feat(events): add hero image support to single pages"
```

---

## Task 5: Add Image Fields to Event Content Files

**Files:**

- Modify: `content/events/weddings.md`
- Modify: `content/events/corporate-events.md`
- Modify: `content/events/birthday-parties.md`
- Modify: `content/events/baby-showers.md`
- Modify: `content/events/private-parties.md`
- Modify: `content/events/dance-events.md`

**Step 1: Update weddings.md front matter**

Add after `icon:` line:

```yaml
image: "images/venue/venue-04-wedding.jpg"
image_alt: "Elegant wedding reception setup at Pike & West venue"
```

**Step 2: Update corporate-events.md front matter**

Add after `icon:` line:

```yaml
image: "images/venue/venue-01-interior.jpeg"
image_alt: "Pike & West interior space perfect for corporate events"
```

**Step 3: Update birthday-parties.md front matter**

Add after `icon:` line:

```yaml
image: "images/venue/venue-05-dancefloor.jpg"
image_alt: "Dance floor and celebration space at Pike & West"
```

**Step 4: Update baby-showers.md front matter**

Add after `icon:` line:

```yaml
image: "images/venue/venue-06-soft-seating.jpg"
image_alt: "Comfortable seating area at Pike & West for intimate gatherings"
```

**Step 5: Update private-parties.md front matter**

Add after `icon:` line:

```yaml
image: "images/venue/venue-07-bar.jpg"
image_alt: "Bar area at Pike & West perfect for private parties"
```

**Step 6: Update dance-events.md front matter**

Add after `icon:` line:

```yaml
image: "images/venue/venue-08-disco-background.jpg"
image_alt: "Dance floor with ambient lighting at Pike & West"
```

**Step 7: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 8: Visual verification - check event heroes render**

Run: `hugo server -D &`
Check these pages:

- <http://localhost:1313/events/weddings/>
- <http://localhost:1313/events/corporate-events/>
- <http://localhost:1313/events/birthday-parties/>

Verify: Each shows hero image with dark overlay and title

**Step 9: Stop server and commit**

```bash
pkill -f "hugo server" || true
git add content/events/
git commit -m "feat(events): add hero images to all event pages"
```

---

## Task 6: Create Front Matter CMS Configuration

**Files:**

- Create: `frontmatter.json`

**Step 1: Create frontmatter.json in project root**

Create file `frontmatter.json`:

```json
{
  "$schema": "https://frontmatter.codes/frontmatter.schema.json",
  "frontMatter.framework.id": "hugo",
  "frontMatter.content.publicFolder": "static",
  "frontMatter.content.pageFolders": [
    {
      "title": "Blog Posts",
      "path": "[[workspace]]/content/blog",
      "contentTypes": ["blog"]
    },
    {
      "title": "Events",
      "path": "[[workspace]]/content/events",
      "contentTypes": ["event"]
    }
  ],
  "frontMatter.taxonomy.contentTypes": [
    {
      "name": "blog",
      "pageBundle": false,
      "fields": [
        {
          "title": "Title",
          "name": "title",
          "type": "string",
          "required": true
        },
        {
          "title": "Description",
          "name": "description",
          "type": "string",
          "required": true
        },
        {
          "title": "Date",
          "name": "date",
          "type": "datetime",
          "required": true
        },
        {
          "title": "Draft",
          "name": "draft",
          "type": "boolean",
          "default": false
        },
        {
          "title": "Author",
          "name": "author",
          "type": "string",
          "default": "Pike & West"
        },
        {
          "title": "Hero Image",
          "name": "image",
          "type": "image",
          "required": false
        },
        {
          "title": "Image Alt Text",
          "name": "image_alt",
          "type": "string",
          "required": false
        },
        {
          "title": "Categories",
          "name": "categories",
          "type": "categories"
        },
        {
          "title": "Tags",
          "name": "tags",
          "type": "tags"
        },
        {
          "title": "Keywords",
          "name": "keywords",
          "type": "list"
        }
      ]
    },
    {
      "name": "event",
      "pageBundle": false,
      "fields": [
        {
          "title": "Title",
          "name": "title",
          "type": "string",
          "required": true
        },
        {
          "title": "Description",
          "name": "description",
          "type": "string",
          "required": true
        },
        {
          "title": "Event Type",
          "name": "eventType",
          "type": "string",
          "required": true
        },
        {
          "title": "Icon",
          "name": "icon",
          "type": "string",
          "description": "Icon filename (e.g., icon-wedding-rings.png)"
        },
        {
          "title": "Hero Image",
          "name": "image",
          "type": "image",
          "required": false
        },
        {
          "title": "Image Alt Text",
          "name": "image_alt",
          "type": "string",
          "required": false
        }
      ]
    }
  ],
  "frontMatter.taxonomy.categories": [
    "Weddings",
    "Corporate Events",
    "Birthday Parties",
    "Baby Showers",
    "Private Parties",
    "Dance Events",
    "Event Planning",
    "Venue Tips"
  ],
  "frontMatter.taxonomy.tags": [
    "wedding",
    "corporate",
    "birthday",
    "baby shower",
    "private party",
    "dance",
    "planning tips",
    "venue tips",
    "event planning"
  ],
  "frontMatter.media.contentTypes": [
    {
      "name": "venue-images",
      "directory": "[[workspace]]/assets/images/venue",
      "mimeTypes": ["image/jpeg", "image/png", "image/webp"]
    }
  ]
}
```

**Step 2: Verify JSON is valid**

Run: `cat frontmatter.json | python3 -m json.tool > /dev/null && echo "Valid JSON"`
Expected: "Valid JSON"

**Step 3: Commit**

```bash
git add frontmatter.json
git commit -m "feat: add Front Matter CMS configuration for VS Code editing"
```

---

## Task 7: Create Event Archetype

**Files:**

- Create: `archetypes/events.md`

**Step 1: Create event archetype**

Create file `archetypes/events.md`:

```markdown
---
title: "{{ replace .Name "-" " " | title }} at Pike & West"
description: "Host your {{ lower .Name | replace "-" " " }} at Pike & West, Germantown's premier art gallery and event venue."
type: "events"
eventType: "{{ .Name }}"
icon: "icon-placeholder.png"
image: "images/venue/venue-01-interior.jpeg"
image_alt: "Pike & West venue interior"
---

## Your {{ replace .Name "-" " " | title }} at Pike & West

Write your introduction here.

### What We Offer

- Feature 1
- Feature 2
- Feature 3

### Contact Us

Contact us to schedule a tour and learn more.
```

**Step 2: Test archetype works**

Run: `hugo new events/test-event.md`
Then: `cat content/events/test-event.md`
Expected: Shows generated content with front matter

**Step 3: Remove test file**

Run: `rm content/events/test-event.md`

**Step 4: Commit**

```bash
git add archetypes/events.md
git commit -m "feat: add event archetype for new event pages"
```

---

## Task 8: Final Verification

**Files:**

- None (verification only)

**Step 1: Run Hugo build with full optimization**

Run: `hugo --gc --minify 2>&1 | tail -10`
Expected: Build completes successfully

**Step 2: Visual spot-check all event pages**

Start server: `hugo server -D &`

Check these pages and verify hero images:

1. <http://localhost:1313/events/weddings/> - venue-04-wedding.jpg
2. <http://localhost:1313/events/corporate-events/> - venue-01-interior.jpeg
3. <http://localhost:1313/events/birthday-parties/> - venue-05-dancefloor.jpg
4. <http://localhost:1313/events/baby-showers/> - venue-06-soft-seating.jpg
5. <http://localhost:1313/events/private-parties/> - venue-07-bar.jpg
6. <http://localhost:1313/events/dance-events/> - venue-08-disco-background.jpg

Verify for each:

- Hero image displays with dark overlay
- Title is readable (cream color, centered)
- Breadcrumb appears below hero
- Content displays correctly

**Step 3: Verify blog still works**

Check: <http://localhost:1313/blog/corporate-event-planning-tips-2026/>
Verify: Blog hero with date/author meta still displays correctly

**Step 4: Stop server**

```bash
pkill -f "hugo server" || true
```

---

## Task 9: Update Documentation

**Files:**

- Modify: `docs/next-steps.md`

**Step 1: Add completed work to changelog**

Add entry to the Changelog section in `docs/next-steps.md`:

```markdown
### 2026-01-21 (continued)
- Added hero images to event pages with front matter support
- Created shared `_page-hero.scss` styles (extracted from blog-hero)
- Refactored blog-hero to extend page-hero
- Configured Front Matter CMS (`frontmatter.json`) for VS Code sidebar editing
- Created event archetype for new event pages
- Event pages now match blog visual hierarchy
```

**Step 2: Commit documentation update**

```bash
git add docs/next-steps.md
git commit -m "docs: update next-steps with event hero implementation"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `_page-hero.scss` exists with shared hero styles
- [ ] `_blog-hero.scss` extends page-hero
- [ ] All 6 event pages have hero images in front matter
- [ ] Event heroes display correctly with dark overlay
- [ ] Blog heroes still work with date/author meta
- [ ] `frontmatter.json` is valid JSON
- [ ] Front Matter CMS shows image picker in VS Code sidebar
- [ ] Event archetype generates correct front matter
- [ ] Hugo builds without errors

---

## Front Matter CMS Usage

After implementation, to edit event images in VS Code:

1. Install "Front Matter" extension in VS Code
2. Open any event `.md` file
3. Click the Front Matter icon in the sidebar (or press `Cmd+Shift+P` → "Front Matter: Open Dashboard")
4. The "Hero Image" field shows an image picker
5. Click to browse/select images from `assets/images/venue/`
6. Save the file - front matter is automatically updated

---

## Rollback Instructions

If issues arise, revert to previous state:

```bash
git log --oneline -15  # Find commit before changes
git revert HEAD~N..HEAD  # Revert N commits
```
