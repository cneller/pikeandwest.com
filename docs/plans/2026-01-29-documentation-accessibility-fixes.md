# Documentation & Accessibility Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix outdated typography documentation in CLAUDE.md, resolve blog card accessibility issues, standardize image path conventions in archetypes, and document the Hugo Pipes image processing approach in a new ADR.

**Architecture:** Documentation-first approach. Update CLAUDE.md to match actual SCSS variables, fix accessibility attributes in 3 template files, update 2 archetypes for path consistency, and create ADR-006 documenting the image processing pattern.

**Tech Stack:** Markdown (documentation), Hugo Go templates (accessibility fixes), SCSS reference (typography audit)

---

## Task 1: Update CLAUDE.md Typography Section

**Files:**

- Modify: `CLAUDE.md:32-50`

**Step 1: Replace the Typography section**

Find lines 32-50 (the Typography subsection) and replace with:

````scss
### Typography

```scss
// Display Font - Headlines h1/h2 (Self-hosted)
$font-display: 'Le Mores Collection Serif', serif;

// Primary Font - Navigation, Buttons, h3+ (Self-hosted)
$font-primary: 'Raleway', sans-serif;

// Secondary Font - Body Text (Google Fonts)
$font-secondary: 'Montserrat', sans-serif;
$font-weights: (300, 400, 500, 600);

// Font Loading
// 1. Self-hosted: Le Mores Collection Serif (subset), Raleway Variable
//    - Preloaded in head.html from /fonts/ directory
// 2. Google Fonts: Montserrat (loaded via stylesheet link)
````

**Step 2: Verify the change**

Run: `grep -A15 "^### Typography" CLAUDE.md`

Expected output should show `$font-display`, `$font-primary`, `$font-secondary` (not `$font-headline`, `$font-body`, `$font-nav`).

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update typography section to match actual SCSS variables

- Replace $font-headline with $font-display (Le Mores Collection Serif)
- Replace $font-nav with $font-primary (Raleway, not Oswald)
- Replace $font-body with $font-secondary (Montserrat)
- Update font loading notes to reflect self-hosted fonts"
```

---

## Task 2: Fix Blog Card Accessibility in blog/list.html

**Files:**

- Modify: `layouts/blog/list.html:28`

**Step 1: Update the link overlay attributes**

Find line 28:

```html
<a href="{{ $page.RelPermalink }}" class="blog-card__link-overlay" aria-label="Read {{ $page.Title }}"></a>
```

Replace with:

```html
<a href="{{ $page.RelPermalink }}" class="blog-card__link-overlay" aria-hidden="true" tabindex="-1"></a>
```

**Step 2: Verify the change**

Run: `grep "blog-card__link-overlay" layouts/blog/list.html`

Expected output should show `aria-hidden="true" tabindex="-1"` (not `aria-label`).

**Step 3: Commit**

```bash
git add layouts/blog/list.html
git commit -m "fix(a11y): remove duplicate tab stop from blog card overlay

Replace aria-label with aria-hidden and tabindex=-1 to prevent
screen readers from announcing the card twice. The visible title
link already provides the accessible name."
```

---

## Task 3: Fix Blog Card Accessibility in \_default/term.html

**Files:**

- Modify: `layouts/_default/term.html:30`

**Step 1: Update the link overlay attributes**

Find line 30:

```html
<a href="{{ $page.RelPermalink }}" class="blog-card__link-overlay" aria-label="Read {{ $page.Title }}"></a>
```

Replace with:

```html
<a href="{{ $page.RelPermalink }}" class="blog-card__link-overlay" aria-hidden="true" tabindex="-1"></a>
```

**Step 2: Verify the change**

Run: `grep "blog-card__link-overlay" layouts/_default/term.html`

Expected: `aria-hidden="true" tabindex="-1"`

**Step 3: Commit**

```bash
git add layouts/_default/term.html
git commit -m "fix(a11y): remove duplicate tab stop from term page blog cards"
```

---

## Task 4: Fix Blog Card Accessibility in categories/term.html

**Files:**

- Modify: `layouts/categories/term.html:51`

**Step 1: Update the link overlay attributes**

Find line 51:

```html
<a href="{{ $page.RelPermalink }}" class="blog-card__link-overlay" aria-label="Read {{ $page.Title }}"></a>
```

Replace with:

```html
<a href="{{ $page.RelPermalink }}" class="blog-card__link-overlay" aria-hidden="true" tabindex="-1"></a>
```

**Step 2: Verify the change**

Run: `grep "blog-card__link-overlay" layouts/categories/term.html`

Expected: `aria-hidden="true" tabindex="-1"`

**Step 3: Commit**

```bash
git add layouts/categories/term.html
git commit -m "fix(a11y): remove duplicate tab stop from category page blog cards"
```

---

## Task 5: Update Blog Archetype Image Path

**Files:**

- Modify: `archetypes/blog.md:10-11`

**Step 1: Update image field to use leading slash**

Find lines 10-11:

```yaml
image: ""
  # Image path from assets/images/, e.g.: images/photos/venue-01-interior.jpeg
```

Replace with:

```yaml
image: ""
  # Image path with leading slash, e.g.: /images/photos/venue-01-interior.jpeg
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" archetypes/blog.md | head -2`

Expected: Comment should show `/images/photos/` (with leading slash).

**Step 3: Commit**

```bash
git add archetypes/blog.md
git commit -m "docs(archetype): update blog image path example to use leading slash"
```

---

## Task 6: Update Events Archetype Image Path

**Files:**

- Modify: `archetypes/events.md:7`

**Step 1: Update image field to use leading slash**

Find line 7:

```yaml
image: "images/photos/venue-01-interior.jpeg"
```

Replace with:

```yaml
image: "/images/photos/venue-01-interior.jpeg"
```

**Step 2: Verify the change**

Run: `grep "^image:" archetypes/events.md`

Expected: `image: "/images/photos/venue-01-interior.jpeg"` (with leading slash).

**Step 3: Commit**

```bash
git add archetypes/events.md
git commit -m "docs(archetype): update events image path to use leading slash"
```

---

## Task 7: Create ADR-006-image-processing.md

**Files:**

- Create: `docs/architecture/decisions/ADR-006-image-processing.md`

**Step 1: Create the ADR file**

````markdown
# ADR-006: Hugo Pipes Image Processing

**Status:** Accepted
**Date:** 2026-01-29

## Context

The site needs consistent image handling for:

1. Responsive images with multiple sizes
2. WebP format conversion for performance
3. Processing images from both `static/` and page bundles
4. CMS compatibility with Sveltia CMS media library

Hugo Pipes (`resources.Get`, `.Resize`, etc.) provides built-in image processing, but requires images in the assets pipeline.

## Decision

Use Hugo module mounts to map `static/images/` into the assets pipeline, enabling Hugo Pipes processing for all site images.

### Module Mount Configuration

In `config/_default/hugo.toml`:

```toml
[[module.mounts]]
  source = "static/images"
  target = "assets/images"
````

This allows:

- CMS to write to `static/images/` (standard Hugo static files)
- Templates to use `resources.Get "images/..."` for processing
- Both paths resolve to the same physical files

### Front Matter Path Convention

Use **leading slash** for image paths in front matter:

```yaml
image: "/images/photos/venue-01-interior.jpeg"
```

- Leading slash indicates absolute path from site root
- Matches Sveltia CMS `public_folder` configuration
- Consistent across all content types (blog, events, pages)

### Template Pattern

```go-html-template
{{/* Load image from front matter */}}
{{ $imagePath := .Params.image | default "/images/photos/fallback.jpg" }}
{{ $imagePath = strings.TrimPrefix "/" $imagePath }}
{{ $image := resources.Get $imagePath }}

{{/* Process with Hugo Pipes */}}
{{ if $image }}
  {{ $webp := $image.Resize "800x webp q85" }}
  {{ $jpg := $image.Resize "800x jpg q85" }}
  <picture>
    <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
    <img src="{{ $jpg.RelPermalink }}" alt="{{ .Params.image_alt }}" loading="lazy">
  </picture>
{{ end }}
```

### Page Bundle Images

For blog posts using page bundles, check both locations:

```go-html-template
{{ $img := .Resources.GetMatch .Params.image }}
{{ if not $img }}
  {{ $img = resources.Get (strings.TrimPrefix "/" .Params.image) }}
{{ end }}
```

## Consequences

- **Positive:** All images processed through Hugo Pipes (WebP, responsive sizes)
- **Positive:** Single image directory for CMS and templates
- **Positive:** Consistent path convention across content types
- **Positive:** Page bundles and shared images both work
- **Negative:** Module mount adds indirection (may confuse new developers)
- **Neutral:** Leading slash requires `strings.TrimPrefix` in some templates

## References

- [Hugo Image Processing](https://gohugo.io/content-management/image-processing/)
- [Hugo Module Mounts](https://gohugo.io/hugo-modules/configuration/#module-configuration-mounts)
- `docs/cms-media-configuration.md` - CMS media library setup

````text

**Step 2: Verify the file exists**

Run: `ls docs/architecture/decisions/ADR-006-image-processing.md`

Expected: File path displayed (no error).

**Step 3: Commit**

```bash
git add docs/architecture/decisions/ADR-006-image-processing.md
git commit -m "docs(adr): add ADR-006 documenting Hugo Pipes image processing

Documents module mount strategy, path conventions, and template
patterns for image processing across the site."
````

---

## Task 8: Verify All Changes

**Step 1: Run Hugo build to verify no errors**

Run: `hugo --gc`

Expected: Build succeeds with no errors.

**Step 2: Check for any remaining aria-label issues**

Run: `grep -r "aria-label.*Read" layouts/`

Expected: No output (all instances replaced).

**Step 3: Final commit summary**

Run: `git log --oneline -7`

Expected: 7 commits for this implementation.

---

## Summary

| Task | File                         | Change                 |
|------|------------------------------|------------------------|
| 1    | CLAUDE.md                    | Update typography docs |
| 2    | layouts/blog/list.html       | Fix a11y overlay       |
| 3    | layouts/\_default/term.html  | Fix a11y overlay       |
| 4    | layouts/categories/term.html | Fix a11y overlay       |
| 5    | archetypes/blog.md           | Leading slash path     |
| 6    | archetypes/events.md         | Leading slash path     |
| 7    | ADR-006-image-processing.md  | Create new ADR         |
| 8    | —                            | Verify build           |
