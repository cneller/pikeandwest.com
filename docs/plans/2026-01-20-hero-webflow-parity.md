# Hero Section Webflow Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the Hugo hero section match Webflow's implementation exactly, including dual-image strategy, responsive behavior, and CSS at all breakpoints.

**Architecture:** Webflow uses a CSS background-image (taller 1920x1080) on the section plus an `<img>` element (wider 1920x800) that shows/hides at different breakpoints. Hugo will replicate this with BEM-consistent naming while preserving exact Webflow dimensions and behaviors.

**Tech Stack:** Hugo templates, SCSS with Webflow-aligned breakpoints, Hugo image processing

---

## Background: Webflow's Dual-Image Strategy

Webflow uses **two different images**:

| Image                    | Dimensions | Aspect        | Purpose                                     |
|--------------------------|------------|---------------|---------------------------------------------|
| `PW_Header_Update2.jpg`  | 1920x1080  | 16:9 (taller) | CSS background-image - shows sky & sidewalk |
| `PW_Heading_Update3.jpg` | 1920x800   | 2.4:1 (wider) | `<img>` element - used on some breakpoints  |

### Webflow Visibility Logic

| Breakpoint        | Background Image | `<img>` Element            | Content |
|-------------------|------------------|----------------------------|---------|
| Desktop (default) | Visible (cover)  | Hidden                     | Visible |
| 1920px+           | Visible          | object-fit: fill           | Visible |
| 991px             | Visible          | object-fit: cover          | Visible |
| 767px             | Visible          | Visible, object-fit: fill  | Hidden  |
| 479px             | Visible          | Visible, object-fit: cover | Hidden  |

---

## Task 1: Copy Background Image to Hugo Assets

**Files:**

- Copy: `webflow-export/images/PW_Header_Update2.jpg` → `assets/images/hero/venue-exterior-tall.jpg`

**Step 1: Copy the taller background image**

```bash
cp webflow-export/images/PW_Header_Update2.jpg assets/images/hero/venue-exterior-tall.jpg
```

**Step 2: Verify both hero images exist**

```bash
ls -la assets/images/hero/
```

Expected output should show:

- `venue-exterior.jpg` (707KB, 1920x800)
- `venue-exterior-tall.jpg` (840KB, 1920x1080)

**Step 3: Commit**

```bash
git add assets/images/hero/venue-exterior-tall.jpg
git commit -m "assets: add taller hero background image for Webflow parity"
```

---

## Task 2: Update hero.yaml Data File

**Files:**

- Modify: `data/hero.yaml`

**Step 1: Update data file with both image references**

Replace entire contents of `data/hero.yaml`:

```yaml
# Hero section content for homepage
# Uses dual-image strategy from Webflow:
# - background_image: Taller image (1920x1080) for CSS background
# - foreground_image: Wider image (1920x800) for <img> element on mobile

title_line1: "Germantown's Premier"
title_line2: "ART GALLERY & VENUE"
tagline:
  - "ART AND LIFE."
  - "LIFE AND ART."
  - "LIFE AS ART."
cta:
  text: "SCHEDULE A TOUR"
  link: "/contact/"

# Background image (taller, 1920x1080) - used as CSS background-image
background_image: "images/hero/venue-exterior-tall.jpg"

# Foreground image (wider, 1920x800) - used as <img> element on mobile breakpoints
foreground_image: "images/hero/venue-exterior.jpg"

# Alt text for accessibility
image_alt: "Outside of Pike & West venue. A white brick, carriage house style building with black roof."
```

**Step 2: Commit**

```bash
git add data/hero.yaml
git commit -m "data: add dual-image references for hero section"
```

---

## Task 3: Update Hero HTML Template

**Files:**

- Modify: `layouts/partials/hero.html`

**Step 1: Replace hero.html with Webflow-aligned structure**

Replace entire contents of `layouts/partials/hero.html`:

```go-html-template
{{- $hero := site.Data.hero -}}

{{- /* Process background image (taller, for CSS) */ -}}
{{- $bgImage := resources.Get $hero.background_image -}}
{{- $bgUrl := "" -}}
{{- if $bgImage -}}
  {{- $bgUrl = ($bgImage.Resize "1920x q85").RelPermalink -}}
{{- end -}}

{{- /* Process foreground image (wider, for <img> element) */ -}}
{{- $fgImage := resources.Get $hero.foreground_image -}}

<section class="hero" style="background-image: url('{{ $bgUrl }}');">
  {{- /* Foreground image - hidden by default, visible on mobile breakpoints */ -}}
  {{- if $fgImage -}}
  <img
    class="hero__image"
    src="{{ ($fgImage.Resize "1920x q85").RelPermalink }}"
    srcset="{{ ($fgImage.Resize "500x q85").RelPermalink }} 500w,
            {{ ($fgImage.Resize "800x q85").RelPermalink }} 800w,
            {{ ($fgImage.Resize "1080x q85").RelPermalink }} 1080w,
            {{ ($fgImage.Resize "1600x q85").RelPermalink }} 1600w,
            {{ ($fgImage.Resize "1920x q85").RelPermalink }} 1920w"
    sizes="100vw"
    alt="{{ $hero.image_alt }}"
    loading="eager"
  >
  {{- end -}}

  {{- /* Content block */ -}}
  <div class="hero__content">
    <h1 class="hero__title">{{ $hero.title_line1 }}<br>{{ $hero.title_line2 }}</h1>
    <div class="hero__tagline tagline">
      {{- range $i, $line := $hero.tagline -}}
        {{- if $i }}<br>{{ end -}}
        {{ $line }}
      {{- end -}}
    </div>
    <div class="hero__cta">
      <a href="{{ $hero.cta.link }}" class="btn btn-secondary">{{ $hero.cta.text }}</a>
    </div>
  </div>
</section>
```

**Step 2: Verify Hugo builds without errors**

```bash
hugo --gc 2>&1 | head -20
```

Expected: No errors, successful build

**Step 3: Commit**

```bash
git add layouts/partials/hero.html
git commit -m "templates: update hero with Webflow dual-image structure"
```

---

## Task 4: Rewrite Hero SCSS - Base Styles

**Files:**

- Modify: `assets/scss/_hero.scss`

**Step 1: Replace \_hero.scss with Webflow-aligned styles**

Replace entire contents of `assets/scss/_hero.scss`:

```scss
// =========================
// Hero Section
// =========================
// Matches Webflow .hero-header-section implementation
// Uses dual-image strategy:
// - CSS background-image (taller 1920x1080) for desktop
// - <img> element (wider 1920x800) visible on mobile breakpoints

.hero {
  position: relative;
  z-index: 1;

  // ===== Desktop Default (Webflow base styles) =====
  // Height matches Webflow exactly
  height: 75vh;
  min-height: 50vh;
  max-height: 81vh;

  // Grid layout from Webflow
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 3fr 1fr;
  grid-auto-rows: minmax(0, 0.4fr);
  grid-auto-columns: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
  align-content: start;

  // Background image (taller image, 1920x1080)
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;

  // ===== Foreground Image Element =====
  // Hidden by default on desktop, shown on mobile
  &__image {
    display: none;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
  }

  // ===== Content Block =====
  // Webflow: .div-block
  &__content {
    position: relative;
    z-index: 1;
    margin-top: 60px;
    margin-left: auto;
    padding-top: 0;
    padding-left: 60px;
    padding-right: 0;
    color: $color-cream;
  }

  // ===== Title =====
  // Webflow: .h1-crm-les-mores
  &__title {
    font-family: $font-display;
    font-size: 32px;
    font-weight: $font-weight-regular;
    line-height: 1.25em;
    letter-spacing: 0.1em;
    margin-top: 40px;
    margin-bottom: 0;
    color: $color-cream;
  }

  &__cta {
    margin-top: 20px;
  }

  // ===== BREAKPOINT: 1920px+ (Ultra-wide) =====
  @media (min-width: $breakpoint-2xl) {
    height: auto;
    grid-template-rows: 0.5fr 0.5fr;
    grid-auto-rows: 0.25fr;
    justify-items: start;

    &__image {
      object-fit: fill;
    }

    &__content {
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      margin-top: 100px;
      margin-left: 50px;
      padding-top: 0;
      padding-left: 60px;
      display: flex;
    }

    &__title {
      font-size: 60px;
    }
  }

  // ===== BREAKPOINT: 991px (Tablet) =====
  @media (max-width: $breakpoint-lg) {
    grid-template-rows: 1fr;
    grid-auto-rows: 0.25fr;

    &__image {
      object-fit: cover;
    }

    &__content {
      margin-top: 0;
      padding-top: 0;
    }
  }

  // ===== BREAKPOINT: 767px (Mobile Landscape) =====
  @media (max-width: $breakpoint-md) {
    height: 50vh;
    min-height: 25vh;
    max-height: 50vh;
    grid-template-rows: 0.5fr 0.5fr;
    grid-template-columns: 0.5fr 0.5fr;

    // Show foreground image, hide content
    &__image {
      display: block;
      object-fit: fill;
      min-height: 25vh;
      max-height: 50vh;
      overflow: hidden;
    }

    &__content {
      display: none;
    }
  }

  // ===== BREAKPOINT: 479px (Mobile Portrait) =====
  @media (max-width: $breakpoint-sm) {
    display: block; // No grid
    height: 50vh;
    min-height: 25vh;
    max-height: 50vh;

    &__image {
      display: block;
      object-fit: cover;
      flex: 0 auto;
      align-self: flex-start;
      overflow: hidden;
    }

    &__content {
      display: none;
    }
  }
}

// ===== Tagline =====
// Webflow: .hero-subheader-1
.tagline {
  font-family: $font-secondary;
  font-size: 22px;
  font-weight: $font-weight-regular;
  line-height: 1.5;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: $color-cream;
  margin-top: 15px;

  // Desktop modifier (Webflow: .hero-subheader-1.desktop)
  .hero & {
    font-size: 18px;
  }

  // 1920px+
  @media (min-width: $breakpoint-2xl) {
    font-size: 24px;
  }

  // 991px (Tablet)
  @media (max-width: $breakpoint-lg) {
    font-size: 13px;
  }

  // 767px (Mobile Landscape)
  @media (max-width: $breakpoint-md) {
    font-size: 16px;
  }

  // 479px (Mobile Portrait)
  @media (max-width: $breakpoint-sm) {
    font-size: 12px;
  }
}
```

**Step 2: Verify SCSS compiles**

```bash
hugo --gc 2>&1 | head -20
```

Expected: No errors

**Step 3: Commit**

```bash
git add assets/scss/_hero.scss
git commit -m "styles: rewrite hero SCSS to match Webflow exactly"
```

---

## Task 5: Visual Verification at All Breakpoints

**Files:** None (verification only)

**Step 1: Start Hugo dev server**

```bash
hugo server -D --port 1313
```

**Step 2: Verify at each breakpoint using browser DevTools**

Open `http://localhost:1313/` and test at these widths:

| Width  | What to Check                                                 |
|--------|---------------------------------------------------------------|
| 1920px | Sky visible above roofline, sidewalk visible, content visible |
| 1280px | Sky visible, roofline clear of nav, sidewalk visible          |
| 991px  | Full image visible, content on left                           |
| 767px  | Foreground image visible, content hidden                      |
| 479px  | Foreground image visible, content hidden                      |

**Step 3: Compare against live Webflow site**

Open `https://pikeandwest.com` side-by-side at same breakpoints.

**Key checks:**

- [ ] Sky above entire roofline at all breakpoints
- [ ] Roofline never touches navigation bar
- [ ] Sidewalk visible at bottom (desktop breakpoints)
- [ ] Content hidden on mobile breakpoints (767px, 479px)
- [ ] No cream/colored gaps on sides (white background only)

---

## Task 6: Final Commit and Cleanup

**Step 1: Verify all changes**

```bash
git status
git diff --stat HEAD~4
```

**Step 2: Run full build**

```bash
hugo --gc --minify
```

Expected: Clean build with no warnings

**Step 3: Tag completion (optional)**

```bash
git tag -a hero-webflow-parity -m "Hero section now matches Webflow implementation"
```

---

## Naming Reference

| Webflow Class          | Hugo BEM Class                | Purpose                    |
|------------------------|-------------------------------|----------------------------|
| `.hero-header-section` | `.hero`                       | Section container          |
| `.image.mobile`        | `.hero__image`                | Foreground `<img>` element |
| `.div-block`           | `.hero__content`              | Content wrapper            |
| `.h1-crm-les-mores`    | `.hero__title`                | Main heading               |
| `.hero-subheader-1`    | `.hero__tagline` / `.tagline` | Tagline text               |
| `.button-1-pw-cream`   | `.btn.btn-secondary`          | CTA button                 |

---

## Troubleshooting

### Image not showing

- Verify path in `data/hero.yaml` starts with `images/` not `/images/`
- Check Hugo's `resources.Get` is finding the file

### Wrong image cropping

- Background image should be 1920x1080 (taller)
- Foreground image should be 1920x800 (wider)
- Verify correct image is referenced in each location

### Content visible on mobile

- Check `&__content { display: none; }` in 767px and 479px breakpoints
- Verify media query breakpoint values match `$breakpoint-md` and `$breakpoint-sm`

### Sky/sidewalk cropped

- This uses CSS `background-size: cover` which crops to fill
- The taller 1920x1080 image should provide enough vertical content
- If still cropped, container height may need adjustment
