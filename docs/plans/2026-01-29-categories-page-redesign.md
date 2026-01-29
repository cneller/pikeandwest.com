# Categories Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the basic `/categories/` taxonomy page with a visually rich, two-column layout featuring image cards with luxurious hover effects, moving to `/blog/categories/` with redirect from old URL.

**Architecture:** Hugo taxonomy templates with custom layout override for categories. Category images stored in `static/images/categories/` with front matter reference in `_index.md` files. Dynamic "Most Popular" section queries categories by post count. Empty categories shown disabled.

**Tech Stack:** Hugo taxonomy system, SCSS, stock photography from Unsplash

---

## Design Decisions Summary

| Decision         | Choice                                                               |
|------------------|----------------------------------------------------------------------|
| Layout           | Two-column: sticky sidebar + grouped image cards                     |
| Image effect     | Luxurious fade: grayscale+blur → color with gold overlay (1.2s-1.6s) |
| Sidebar hover    | Subtle 0.15rem shift, gold color on hover                            |
| Most Popular     | Dynamic top 4 by post count                                          |
| Empty categories | Show disabled with "Coming soon"                                     |
| Route            | `/blog/categories/` with redirect from `/categories/`                |
| Images           | Static stock photos, CMS-editable via front matter                   |
| Naming           | "Categories" (kept as-is)                                            |

---

## Task 1: Download Stock Photography

**Files:**

- Create: `static/images/categories/weddings-1.jpg`
- Create: `static/images/categories/weddings-2.jpg`
- Create: `static/images/categories/weddings-3.jpg`
- Create: `static/images/categories/birthdays-1.jpg`
- Create: `static/images/categories/birthdays-2.jpg`
- Create: `static/images/categories/birthdays-3.jpg`
- Create: `static/images/categories/baby-showers-1.jpg`
- Create: `static/images/categories/baby-showers-2.jpg`
- Create: `static/images/categories/baby-showers-3.jpg`
- Create: `static/images/categories/anniversaries-1.jpg`
- Create: `static/images/categories/anniversaries-2.jpg`
- Create: `static/images/categories/anniversaries-3.jpg`
- Create: `static/images/categories/bar-mitzvah-1.jpg`
- Create: `static/images/categories/bar-mitzvah-2.jpg`
- Create: `static/images/categories/bar-mitzvah-3.jpg`
- Create: `static/images/categories/bat-mitzvah-1.jpg`
- Create: `static/images/categories/bat-mitzvah-2.jpg`
- Create: `static/images/categories/bat-mitzvah-3.jpg`
- Create: `static/images/categories/quinceanera-1.jpg`
- Create: `static/images/categories/quinceanera-2.jpg`
- Create: `static/images/categories/quinceanera-3.jpg`
- Create: `static/images/categories/graduations-1.jpg`
- Create: `static/images/categories/graduations-2.jpg`
- Create: `static/images/categories/graduations-3.jpg`
- Create: `static/images/categories/daddy-daughter-dances-1.jpg`
- Create: `static/images/categories/daddy-daughter-dances-2.jpg`
- Create: `static/images/categories/daddy-daughter-dances-3.jpg`
- Create: `static/images/categories/prom-send-offs-1.jpg`
- Create: `static/images/categories/prom-send-offs-2.jpg`
- Create: `static/images/categories/prom-send-offs-3.jpg`
- Create: `static/images/categories/corporate-events-1.jpg`
- Create: `static/images/categories/corporate-events-2.jpg`
- Create: `static/images/categories/corporate-events-3.jpg`
- Create: `static/images/categories/holiday-parties-1.jpg`
- Create: `static/images/categories/holiday-parties-2.jpg`
- Create: `static/images/categories/holiday-parties-3.jpg`
- Create: `static/images/categories/retirement-1.jpg`
- Create: `static/images/categories/retirement-2.jpg`
- Create: `static/images/categories/retirement-3.jpg`
- Create: `static/images/categories/engagement-parties-1.jpg`
- Create: `static/images/categories/engagement-parties-2.jpg`
- Create: `static/images/categories/engagement-parties-3.jpg`
- Create: `static/images/categories/family-reunions-1.jpg`
- Create: `static/images/categories/family-reunions-2.jpg`
- Create: `static/images/categories/family-reunions-3.jpg`

**Step 1: Create the categories directory**

```bash
mkdir -p static/images/categories
```

**Step 2: Download stock photos from Unsplash**

Use curl to download high-quality event photography. Each category gets 3 images (we'll use `-1` as the primary).

```bash
# Weddings
curl -L "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" -o static/images/categories/weddings-1.jpg
curl -L "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80" -o static/images/categories/weddings-2.jpg
curl -L "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80" -o static/images/categories/weddings-3.jpg

# Birthdays
curl -L "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80" -o static/images/categories/birthdays-1.jpg
curl -L "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80" -o static/images/categories/birthdays-2.jpg
curl -L "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80" -o static/images/categories/birthdays-3.jpg

# Baby Showers
curl -L "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80" -o static/images/categories/baby-showers-1.jpg
curl -L "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80" -o static/images/categories/baby-showers-2.jpg
curl -L "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80" -o static/images/categories/baby-showers-3.jpg

# Anniversaries
curl -L "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800&q=80" -o static/images/categories/anniversaries-1.jpg
curl -L "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80" -o static/images/categories/anniversaries-2.jpg
curl -L "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80" -o static/images/categories/anniversaries-3.jpg

# Bar Mitzvah
curl -L "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80" -o static/images/categories/bar-mitzvah-1.jpg
curl -L "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80" -o static/images/categories/bar-mitzvah-2.jpg
curl -L "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" -o static/images/categories/bar-mitzvah-3.jpg

# Bat Mitzvah
curl -L "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=800&q=80" -o static/images/categories/bat-mitzvah-1.jpg
curl -L "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80" -o static/images/categories/bat-mitzvah-2.jpg
curl -L "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=800&q=80" -o static/images/categories/bat-mitzvah-3.jpg

# Quinceañera
curl -L "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80" -o static/images/categories/quinceanera-1.jpg
curl -L "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800&q=80" -o static/images/categories/quinceanera-2.jpg
curl -L "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80" -o static/images/categories/quinceanera-3.jpg

# Graduations
curl -L "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80" -o static/images/categories/graduations-1.jpg
curl -L "https://images.unsplash.com/photo-1627556704302-624286467c65?w=800&q=80" -o static/images/categories/graduations-2.jpg
curl -L "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80" -o static/images/categories/graduations-3.jpg

# Daddy Daughter Dances
curl -L "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80" -o static/images/categories/daddy-daughter-dances-1.jpg
curl -L "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80" -o static/images/categories/daddy-daughter-dances-2.jpg
curl -L "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80" -o static/images/categories/daddy-daughter-dances-3.jpg

# Prom Send-Offs
curl -L "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" -o static/images/categories/prom-send-offs-1.jpg
curl -L "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&q=80" -o static/images/categories/prom-send-offs-2.jpg
curl -L "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&q=80" -o static/images/categories/prom-send-offs-3.jpg

# Corporate Events
curl -L "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80" -o static/images/categories/corporate-events-1.jpg
curl -L "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" -o static/images/categories/corporate-events-2.jpg
curl -L "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80" -o static/images/categories/corporate-events-3.jpg

# Holiday Parties
curl -L "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&q=80" -o static/images/categories/holiday-parties-1.jpg
curl -L "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80" -o static/images/categories/holiday-parties-2.jpg
curl -L "https://images.unsplash.com/photo-1543934638-bd2e138430c4?w=800&q=80" -o static/images/categories/holiday-parties-3.jpg

# Retirement
curl -L "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&q=80" -o static/images/categories/retirement-1.jpg
curl -L "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" -o static/images/categories/retirement-2.jpg
curl -L "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=800&q=80" -o static/images/categories/retirement-3.jpg

# Engagement Parties
curl -L "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80" -o static/images/categories/engagement-parties-1.jpg
curl -L "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80" -o static/images/categories/engagement-parties-2.jpg
curl -L "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80" -o static/images/categories/engagement-parties-3.jpg

# Family Reunions
curl -L "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80" -o static/images/categories/family-reunions-1.jpg
curl -L "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" -o static/images/categories/family-reunions-2.jpg
curl -L "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=800&q=80" -o static/images/categories/family-reunions-3.jpg
```

**Step 3: Verify downloads**

```bash
ls -la static/images/categories/ | wc -l
# Expected: 46 (45 files + 1 directory line)
```

**Step 4: Commit**

```bash
git add static/images/categories/
git commit -m "feat(categories): add stock photography for category cards

- 3 images per category (15 categories × 3 = 45 images)
- Using -1 suffix as primary image for each
- Source: Unsplash (free for commercial use)"
```

---

## Task 2: Create Category Data File

**Files:**

- Create: `data/categories.yaml`

**Step 1: Create the categories data file**

This file defines the 15 categories with their groupings, display order, and default images.

```yaml
# data/categories.yaml
# Category metadata for the categories page redesign
# Images reference files in static/images/categories/

groups:
  - name: "Wedding & Relationship"
    slug: "wedding-relationship"
    categories:
      - name: "Weddings"
        slug: "weddings"
        image: "/images/categories/weddings-1.jpg"
      - name: "Engagement Parties"
        slug: "engagement-parties"
        image: "/images/categories/engagement-parties-1.jpg"
      - name: "Anniversaries"
        slug: "anniversaries"
        image: "/images/categories/anniversaries-1.jpg"

  - name: "Coming of Age"
    slug: "coming-of-age"
    categories:
      - name: "Bar Mitzvah"
        slug: "bar-mitzvah"
        image: "/images/categories/bar-mitzvah-1.jpg"
      - name: "Bat Mitzvah"
        slug: "bat-mitzvah"
        image: "/images/categories/bat-mitzvah-1.jpg"
      - name: "Quinceañera"
        slug: "quinceanera"
        image: "/images/categories/quinceanera-1.jpg"
      - name: "Graduations"
        slug: "graduations"
        image: "/images/categories/graduations-1.jpg"
      - name: "Birthdays"
        slug: "birthdays"
        image: "/images/categories/birthdays-1.jpg"

  - name: "Baby & Family"
    slug: "baby-family"
    categories:
      - name: "Baby Showers"
        slug: "baby-showers"
        image: "/images/categories/baby-showers-1.jpg"
      - name: "Family Reunions"
        slug: "family-reunions"
        image: "/images/categories/family-reunions-1.jpg"

  - name: "Youth & Teen"
    slug: "youth-teen"
    categories:
      - name: "Daddy Daughter Dances"
        slug: "daddy-daughter-dances"
        image: "/images/categories/daddy-daughter-dances-1.jpg"
      - name: "Prom Send-Offs"
        slug: "prom-send-offs"
        image: "/images/categories/prom-send-offs-1.jpg"

  - name: "Professional & Social"
    slug: "professional-social"
    categories:
      - name: "Corporate Events"
        slug: "corporate-events"
        image: "/images/categories/corporate-events-1.jpg"
      - name: "Holiday Parties"
        slug: "holiday-parties"
        image: "/images/categories/holiday-parties-1.jpg"
      - name: "Retirement"
        slug: "retirement"
        image: "/images/categories/retirement-1.jpg"
```

**Step 2: Commit**

```bash
git add data/categories.yaml
git commit -m "feat(categories): add category metadata with groupings

- 15 categories organized into 5 logical groups
- Each category has slug and default image path
- Used by taxonomy template for display order"
```

---

## Task 3: Create Category SCSS

**Files:**

- Create: `assets/scss/_categories.scss`
- Modify: `assets/scss/main.scss`

**Step 1: Create the categories stylesheet**

```scss
// assets/scss/_categories.scss
// Categories page with two-column layout and image cards

// =========================
// Layout
// =========================

.categories-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  max-width: $container-max-width;
  margin: 0 auto;

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: 1fr;
  }
}

// =========================
// Sidebar
// =========================

.categories-sidebar {
  background: $color-cream;
  padding: $spacing-lg $spacing-md;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  height: fit-content;
  max-height: 100vh;
  overflow-y: auto;

  @media (max-width: $breakpoint-lg) {
    display: none;
  }

  &__group-title {
    font-family: $font-primary;
    font-weight: $font-weight-regular;
    font-size: $font-size-xs;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-gold;
    margin-bottom: $spacing-sm;
    margin-top: $spacing-md;
    padding-bottom: $spacing-xs;
    border-bottom: 1px solid rgba($color-gold, 0.2);

    &:first-child {
      margin-top: 0;
    }
  }

  &__link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-xs 0;
    text-decoration: none;
    color: $color-text;
    font-size: $font-size-sm;
    transition: all 0.2s ease;

    &:hover {
      color: $color-gold;
      padding-left: 0.15rem;
    }

    &--disabled {
      color: #999;
      pointer-events: none;

      .categories-sidebar__count {
        color: #ccc;
      }
    }
  }

  &__count {
    font-size: $font-size-xs;
    color: #999;
  }
}

// =========================
// Main Content
// =========================

.categories-main {
  padding: $spacing-xl;

  @media (max-width: $breakpoint-md) {
    padding: $spacing-lg $spacing-md;
  }
}

.categories-intro {
  max-width: 650px;
  margin-bottom: $spacing-xl;

  &__title {
    font-family: $font-display;
    font-weight: $font-weight-regular;
    font-size: $font-size-2xl;
    margin-bottom: $spacing-sm;
  }

  &__text {
    font-size: $font-size-base;
    line-height: 1.6;
    color: $color-text-light;
  }
}

// =========================
// Category Groups
// =========================

.category-group {
  margin-bottom: $spacing-2xl;

  &__header {
    font-family: $font-primary;
    font-weight: $font-weight-regular;
    font-size: $font-size-sm;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-gold;
    margin-bottom: $spacing-md;
    display: flex;
    align-items: center;
    gap: $spacing-md;

    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba($color-gold, 0.25);
    }
  }
}

// =========================
// Card Grid
// =========================

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-md;

  @media (max-width: $breakpoint-xl) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: $breakpoint-lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
  }
}

// =========================
// Image Card with Luxurious Fade Effect
// =========================

.category-card {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  text-decoration: none;
  color: $color-white;
  border-radius: $border-radius-sm;
  display: block;

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0.8) brightness(0.9) saturate(1) blur(2px);
    transform: scale(1);
    transition: filter 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s,
                transform 1.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    will-change: filter, transform;
  }

  &:hover &__image {
    filter: grayscale(0) brightness(1) saturate(1.1) blur(0px);
    transform: scale(1.02);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: $spacing-md;
    background: linear-gradient(to top, rgba($color-medium-gray, 0.85) 0%, rgba($color-medium-gray, 0.2) 60%, transparent 100%);
    z-index: 1;
  }

  &__title {
    font-family: $font-display;
    font-weight: $font-weight-regular;
    font-size: $font-size-lg;
    margin-bottom: $spacing-xs;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__count {
    font-size: $font-size-xs;
    opacity: 0.9;
  }

  &__arrow {
    font-size: $font-size-base;
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover &__arrow {
    opacity: 1;
    transform: translateX(0);
  }

  // Gold overlay that fades in on hover
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba($color-gold, 0.85) 0%, rgba($color-gold, 0.25) 50%, transparent 100%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover::after {
    opacity: 1;
  }

  // Disabled state for empty categories
  &--disabled {
    pointer-events: none;

    &::before {
      content: 'Coming Soon';
      position: absolute;
      top: $spacing-sm;
      right: $spacing-sm;
      background: rgba(0, 0, 0, 0.6);
      color: $color-white;
      font-size: $font-size-xs;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      z-index: 2;
    }

    .category-card__image {
      filter: grayscale(1) brightness(0.7) blur(2px);
    }

    &:hover .category-card__image {
      filter: grayscale(1) brightness(0.7) blur(2px);
      transform: scale(1);
    }

    &:hover::after {
      opacity: 0;
    }
  }
}

// =========================
// CTA Box
// =========================

.categories-cta {
  background: $color-medium-gray;
  color: $color-white;
  padding: $spacing-xl;
  text-align: center;
  margin-top: $spacing-md;

  &__text {
    font-family: $font-display;
    font-size: $font-size-xl;
    margin-bottom: $spacing-md;
  }

  &__button {
    display: inline-block;
    background: $color-gold;
    color: $color-white;
    padding: $spacing-sm $spacing-lg;
    text-decoration: none;
    font-family: $font-primary;
    font-size: $font-size-sm;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: background $transition-base;

    &:hover {
      background: $color-white;
      color: $color-text;
    }
  }
}
```

**Step 2: Import in main.scss**

Add the import to `assets/scss/main.scss` after the other component imports:

```scss
@import 'categories';
```

**Step 3: Verify SCSS compiles**

```bash
hugo server --disableFastRender
# Check for SCSS compilation errors in terminal
# Ctrl+C to stop
```

**Step 4: Commit**

```bash
git add assets/scss/_categories.scss assets/scss/main.scss
git commit -m "feat(categories): add SCSS for categories page redesign

- Two-column layout with sticky sidebar
- Luxurious fade effect on image cards (grayscale→color, blur→sharp)
- Gold overlay transition on hover
- Disabled state for empty categories
- Responsive grid (4→3→2→1 columns)"
```

---

## Task 4: Create Categories Layout Override

**Files:**

- Create: `layouts/categories/taxonomy.html`
- Create: `layouts/categories/term.html`

**Step 1: Create the taxonomy template (categories index page)**

```html
{{/* layouts/categories/taxonomy.html */}}
{{/*
  Purpose: Display all categories with grouped image cards
  Context: /blog/categories/ page
  Data: Uses data/categories.yaml for grouping and images
*/}}
{{ define "main" }}
{{/* Hero Section */}}
{{ $heroImage := resources.Get "images/photos/venue-06-soft-seating.jpg" }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}

<section class="blog-hero" style="background-image: url('{{ $heroBg }}');">
  <div class="blog-hero__content">
    <h1 class="blog-hero__title">Browse by Category</h1>
  </div>
</section>

{{/* Breadcrumb */}}
<nav class="breadcrumb">
  <div class="container">
    <a href="/">Home</a>
    <span class="breadcrumb__separator">/</span>
    <a href="/blog/">Blog</a>
    <span class="breadcrumb__separator">/</span>
    <span>Categories</span>
  </div>
</nav>

{{/* Two-Column Layout */}}
<div class="categories-layout">
  {{/* Sidebar */}}
  <aside class="categories-sidebar">
    {{ range .Site.Data.categories.groups }}
    <h2 class="categories-sidebar__group-title">{{ .name }}</h2>
    {{ range .categories }}
      {{ $category := site.GetPage (printf "/categories/%s" .slug) }}
      {{ $postCount := 0 }}
      {{ if $category }}
        {{ $postCount = len $category.Pages }}
      {{ end }}
      <a href="{{ if gt $postCount 0 }}/blog/categories/{{ .slug }}/{{ else }}#{{ end }}"
         class="categories-sidebar__link{{ if eq $postCount 0 }} categories-sidebar__link--disabled{{ end }}">
        <span>{{ .name }}</span>
        <span class="categories-sidebar__count">{{ $postCount }}</span>
      </a>
    {{ end }}
    {{ end }}
  </aside>

  {{/* Main Content */}}
  <main class="categories-main">
    <div class="categories-intro">
      <h2 class="categories-intro__title">Find Your Inspiration</h2>
      <p class="categories-intro__text">Explore our blog posts organized by event type. Whether you're planning a wedding, milestone celebration, or corporate gathering, find real examples and planning tips from Pike & West.</p>
    </div>

    {{/* Most Popular Categories (Dynamic) */}}
    {{ $allCategories := slice }}
    {{ range .Site.Data.categories.groups }}
      {{ range .categories }}
        {{ $cat := . }}
        {{ $category := site.GetPage (printf "/categories/%s" .slug) }}
        {{ $postCount := 0 }}
        {{ if $category }}
          {{ $postCount = len $category.Pages }}
        {{ end }}
        {{ $allCategories = $allCategories | append (dict "name" .name "slug" .slug "image" .image "count" $postCount) }}
      {{ end }}
    {{ end }}

    {{/* Sort by count descending and take top 4 with posts */}}
    {{ $popular := sort $allCategories "count" "desc" }}
    {{ $popularWithPosts := slice }}
    {{ range $popular }}
      {{ if gt .count 0 }}
        {{ $popularWithPosts = $popularWithPosts | append . }}
      {{ end }}
    {{ end }}
    {{ $topFour := first 4 $popularWithPosts }}

    {{ if gt (len $topFour) 0 }}
    <section class="category-group">
      <h3 class="category-group__header">Most Popular Categories</h3>
      <div class="category-grid">
        {{ range $topFour }}
        {{ $imgPath := strings.TrimPrefix "/" .image }}
        {{ $img := resources.Get $imgPath }}
        <a href="/blog/categories/{{ .slug }}/" class="category-card">
          {{ if $img }}
          {{ $processed := $img.Resize "600x webp q80" }}
          <img src="{{ $processed.RelPermalink }}" alt="{{ .name }}" class="category-card__image" loading="lazy">
          {{ end }}
          <div class="category-card__overlay">
            <h3 class="category-card__title">{{ .name }}</h3>
            <div class="category-card__meta">
              <span class="category-card__count">{{ .count }} {{ if eq .count 1 }}post{{ else }}posts{{ end }}</span>
              <span class="category-card__arrow">&rarr;</span>
            </div>
          </div>
        </a>
        {{ end }}
      </div>
    </section>
    {{ end }}

    {{/* Grouped Categories */}}
    {{ range .Site.Data.categories.groups }}
    <section class="category-group">
      <h3 class="category-group__header">{{ .name }}</h3>
      <div class="category-grid">
        {{ range .categories }}
        {{ $category := site.GetPage (printf "/categories/%s" .slug) }}
        {{ $postCount := 0 }}
        {{ if $category }}
          {{ $postCount = len $category.Pages }}
        {{ end }}
        {{ $imgPath := strings.TrimPrefix "/" .image }}
        {{ $img := resources.Get $imgPath }}
        <a href="/blog/categories/{{ .slug }}/"
           class="category-card{{ if eq $postCount 0 }} category-card--disabled{{ end }}">
          {{ if $img }}
          {{ $processed := $img.Resize "600x webp q80" }}
          <img src="{{ $processed.RelPermalink }}" alt="{{ .name }}" class="category-card__image" loading="lazy">
          {{ end }}
          <div class="category-card__overlay">
            <h3 class="category-card__title">{{ .name }}</h3>
            <div class="category-card__meta">
              <span class="category-card__count">{{ $postCount }} {{ if eq $postCount 1 }}post{{ else }}posts{{ end }}</span>
              <span class="category-card__arrow">&rarr;</span>
            </div>
          </div>
        </a>
        {{ end }}
      </div>
    </section>
    {{ end }}

    {{/* CTA */}}
    <div class="categories-cta">
      <p class="categories-cta__text">Planning an event? We'd love to help.</p>
      <a href="/contact/" class="categories-cta__button">Book a Tour</a>
    </div>
  </main>
</div>
{{ end }}
```

**Step 2: Create the term template (individual category pages)**

```html
{{/* layouts/categories/term.html */}}
{{/*
  Purpose: Display posts in a specific category
  Context: Individual category page (e.g., /blog/categories/weddings/)
*/}}
{{ define "main" }}
{{/* Find category image from data file */}}
{{ $categoryImage := "" }}
{{ $categorySlug := .Page.Title | urlize }}
{{ range .Site.Data.categories.groups }}
  {{ range .categories }}
    {{ if eq .slug $categorySlug }}
      {{ $categoryImage = .image }}
    {{ end }}
  {{ end }}
{{ end }}

{{/* Hero */}}
{{ $heroImage := "" }}
{{ if $categoryImage }}
  {{ $imgPath := strings.TrimPrefix "/" $categoryImage }}
  {{ $heroImage = resources.Get $imgPath }}
{{ end }}
{{ if not $heroImage }}
  {{ $heroImage = resources.Get "images/photos/venue-06-soft-seating.jpg" }}
{{ end }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}

<section class="blog-hero" style="background-image: url('{{ $heroBg }}');">
  <div class="blog-hero__content">
    <h1 class="blog-hero__title">{{ .Title }}</h1>
    <p class="blog-hero__subtitle">{{ len .Pages }} {{ if eq (len .Pages) 1 }}post{{ else }}posts{{ end }}</p>
  </div>
</section>

{{/* Breadcrumb */}}
<nav class="breadcrumb">
  <div class="container">
    <a href="/">Home</a>
    <span class="breadcrumb__separator">/</span>
    <a href="/blog/">Blog</a>
    <span class="breadcrumb__separator">/</span>
    <a href="/blog/categories/">Categories</a>
    <span class="breadcrumb__separator">/</span>
    <span>{{ .Title }}</span>
  </div>
</nav>

{{/* Posts Grid */}}
<section class="blog-grid section">
  <div class="container">
    {{ if .Pages }}
    <div class="blog-grid__posts">
      {{ range .Pages.ByDate.Reverse }}
      {{ partial "blog-card.html" . }}
      {{ end }}
    </div>
    {{ else }}
    <p class="blog-grid__empty">No posts in this category yet. Check back soon!</p>
    {{ end }}
  </div>
</section>

{{/* CTA */}}
<section class="cta-banner">
  <div class="container">
    <div class="categories-cta">
      <p class="categories-cta__text">Planning an event? We'd love to help.</p>
      <a href="/contact/" class="categories-cta__button">Book a Tour</a>
    </div>
  </div>
</section>
{{ end }}
```

**Step 3: Verify templates render**

```bash
hugo server --disableFastRender
# Visit http://localhost:1313/categories/
# Check page renders without errors
# Ctrl+C to stop
```

**Step 4: Commit**

```bash
git add layouts/categories/
git commit -m "feat(categories): add custom taxonomy and term templates

- taxonomy.html: Two-column layout with sidebar and image cards
- term.html: Individual category listing with hero image
- Dynamic 'Most Popular' section based on post count
- Disabled state for categories with 0 posts"
```

---

## Task 5: Configure URL and Redirect

**Files:**

- Modify: `config/_default/hugo.toml`
- Create: `static/_redirects`

**Step 1: Update Hugo config for categories URL**

Add to `config/_default/hugo.toml`:

```toml
# Taxonomy URL configuration
[taxonomies]
  category = "categories"
  tag = "tags"

# Move categories under /blog/
[permalinks]
  [permalinks.term]
    categories = "/blog/categories/:slug/"
  [permalinks.taxonomy]
    categories = "/blog/categories/"
```

**Step 2: Create redirect for old URL**

Create `static/_redirects` (Cloudflare Pages format):

```text
# Redirect old categories URL to new location
/categories/ /blog/categories/ 301
/categories/* /blog/categories/:splat 301
```

**Step 3: Verify URLs**

```bash
hugo server --disableFastRender
# Visit http://localhost:1313/blog/categories/
# Verify categories page loads at new URL
# Visit http://localhost:1313/categories/ - should redirect (in production)
# Ctrl+C to stop
```

**Step 4: Commit**

```bash
git add config/_default/hugo.toml static/_redirects
git commit -m "feat(categories): move to /blog/categories/ with redirect

- Configure taxonomy permalinks for new URL structure
- Add 301 redirect from /categories/ to /blog/categories/
- Maintains SEO by redirecting old URLs"
```

---

## Task 6: Add Sveltia CMS Collection

**Files:**

- Modify: `static/admin/config.yml`

**Step 1: Add categories collection to CMS config**

Add this collection to `static/admin/config.yml` under the `collections:` key:

```yaml
  - name: "categories"
    label: "Categories"
    label_singular: "Category"
    folder: "content/categories"
    create: false
    delete: false
    slug: "{{slug}}"
    summary: "{{title}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Image", name: "image", widget: "image", required: false,
          media_folder: "/static/images/categories",
          public_folder: "/images/categories" }
      - { label: "Description", name: "description", widget: "text", required: false }
```

**Step 2: Verify CMS loads**

```bash
hugo server --disableFastRender
# Visit http://localhost:1313/admin/
# Check that Categories collection appears in sidebar
# Ctrl+C to stop
```

**Step 3: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat(categories): add CMS collection for category management

- Categories collection with image field
- Images stored in /static/images/categories/
- Allows updating category images via CMS"
```

---

## Task 7: Create Category Content Files

**Files:**

- Create: `content/categories/_index.md`
- Create: `content/categories/weddings/_index.md`
- Create: `content/categories/birthdays/_index.md`
- Create: `content/categories/baby-showers/_index.md`
- Create: `content/categories/anniversaries/_index.md`
- Create: `content/categories/bar-mitzvah/_index.md`
- Create: `content/categories/bat-mitzvah/_index.md`
- Create: `content/categories/quinceanera/_index.md`
- Create: `content/categories/graduations/_index.md`
- Create: `content/categories/daddy-daughter-dances/_index.md`
- Create: `content/categories/prom-send-offs/_index.md`
- Create: `content/categories/corporate-events/_index.md`
- Create: `content/categories/holiday-parties/_index.md`
- Create: `content/categories/retirement/_index.md`
- Create: `content/categories/engagement-parties/_index.md`
- Create: `content/categories/family-reunions/_index.md`

**Step 1: Create categories directory and index**

```bash
mkdir -p content/categories
```

```yaml
# content/categories/_index.md
---
title: "Categories"
description: "Browse Pike & West blog posts by event type"
---
```

**Step 2: Create individual category files**

Each category gets an `_index.md` with optional image override:

```bash
# Create all category directories
mkdir -p content/categories/{weddings,birthdays,baby-showers,anniversaries,bar-mitzvah,bat-mitzvah,quinceanera,graduations,daddy-daughter-dances,prom-send-offs,corporate-events,holiday-parties,retirement,engagement-parties,family-reunions}
```

Create each `_index.md`:

```yaml
# content/categories/weddings/_index.md
---
title: "Weddings"
image: "/images/categories/weddings-1.jpg"
description: "Wedding inspiration, planning tips, and real celebrations at Pike & West"
---
```

```yaml
# content/categories/birthdays/_index.md
---
title: "Birthdays"
image: "/images/categories/birthdays-1.jpg"
description: "Birthday party ideas from milestone celebrations to intimate gatherings"
---
```

```yaml
# content/categories/baby-showers/_index.md
---
title: "Baby Showers"
image: "/images/categories/baby-showers-1.jpg"
description: "Beautiful baby shower inspiration and planning guides"
---
```

```yaml
# content/categories/anniversaries/_index.md
---
title: "Anniversaries"
image: "/images/categories/anniversaries-1.jpg"
description: "Anniversary celebration ideas and romantic venue inspiration"
---
```

```yaml
# content/categories/bar-mitzvah/_index.md
---
title: "Bar Mitzvah"
image: "/images/categories/bar-mitzvah-1.jpg"
description: "Bar Mitzvah celebration ideas and planning resources"
---
```

```yaml
# content/categories/bat-mitzvah/_index.md
---
title: "Bat Mitzvah"
image: "/images/categories/bat-mitzvah-1.jpg"
description: "Bat Mitzvah celebration ideas and planning resources"
---
```

```yaml
# content/categories/quinceanera/_index.md
---
title: "Quinceañera"
image: "/images/categories/quinceanera-1.jpg"
description: "Quinceañera celebration inspiration and planning tips"
---
```

```yaml
# content/categories/graduations/_index.md
---
title: "Graduations"
image: "/images/categories/graduations-1.jpg"
description: "Graduation party ideas for all educational milestones"
---
```

```yaml
# content/categories/daddy-daughter-dances/_index.md
---
title: "Daddy Daughter Dances"
image: "/images/categories/daddy-daughter-dances-1.jpg"
description: "Memorable daddy daughter dance event ideas"
---
```

```yaml
# content/categories/prom-send-offs/_index.md
---
title: "Prom Send-Offs"
image: "/images/categories/prom-send-offs-1.jpg"
description: "Prom send-off party inspiration and photo opportunities"
---
```

```yaml
# content/categories/corporate-events/_index.md
---
title: "Corporate Events"
image: "/images/categories/corporate-events-1.jpg"
description: "Professional event planning for corporate gatherings and meetings"
---
```

```yaml
# content/categories/holiday-parties/_index.md
---
title: "Holiday Parties"
image: "/images/categories/holiday-parties-1.jpg"
description: "Holiday celebration ideas throughout the year"
---
```

```yaml
# content/categories/retirement/_index.md
---
title: "Retirement"
image: "/images/categories/retirement-1.jpg"
description: "Retirement celebration ideas to honor career milestones"
---
```

```yaml
# content/categories/engagement-parties/_index.md
---
title: "Engagement Parties"
image: "/images/categories/engagement-parties-1.jpg"
description: "Engagement party inspiration for newly betrothed couples"
---
```

```yaml
# content/categories/family-reunions/_index.md
---
title: "Family Reunions"
image: "/images/categories/family-reunions-1.jpg"
description: "Family reunion planning ideas and venue inspiration"
---
```

**Step 3: Verify categories render**

```bash
hugo server --disableFastRender
# Visit http://localhost:1313/blog/categories/
# Verify all 15 categories appear
# Ctrl+C to stop
```

**Step 4: Commit**

```bash
git add content/categories/
git commit -m "feat(categories): add content files for 15 categories

- Each category has _index.md with image and description
- Images editable via Sveltia CMS
- Descriptions used for SEO meta"
```

---

## Task 8: Final Testing and Cleanup

**Files:**

- Review all changes

**Step 1: Full build test**

```bash
hugo --gc --minify
# Should complete without errors
```

**Step 2: Visual verification**

```bash
hugo server
# Visit http://localhost:1313/blog/categories/
# Verify:
# - [ ] Hero image displays
# - [ ] Sidebar shows all categories with counts
# - [ ] Most Popular shows top 4 categories by post count
# - [ ] All category groups display
# - [ ] Image cards have grayscale+blur effect
# - [ ] Hover shows color, removes blur, adds gold overlay
# - [ ] Empty categories show "Coming Soon" badge
# - [ ] Clicking category card goes to listing page
# - [ ] CTA button links to contact page
```

**Step 3: Mobile responsive test**

```bash
# In browser dev tools, test at:
# - [ ] 320px (mobile)
# - [ ] 768px (tablet)
# - [ ] 1024px (small desktop)
# - [ ] 1280px+ (large desktop)
# Verify grid columns adjust appropriately
```

**Step 4: Commit and tag**

```bash
git add -A
git commit -m "feat(categories): complete categories page redesign

Summary of changes:
- New two-column layout with sticky sidebar
- 15 granular categories in 5 groups
- Luxurious image card hover effect
- Dynamic 'Most Popular' section
- Disabled state for empty categories
- URL moved to /blog/categories/ with redirect
- CMS integration for image updates
- Stock photography for all categories"
```

---

## Summary

| Task | Description                   | Files                                            |
|------|-------------------------------|--------------------------------------------------|
| 1    | Download stock photography    | 45 images in `static/images/categories/`         |
| 2    | Create category data file     | `data/categories.yaml`                           |
| 3    | Create category SCSS          | `assets/scss/_categories.scss`, `main.scss`      |
| 4    | Create layout templates       | `layouts/categories/taxonomy.html`, `term.html`  |
| 5    | Configure URL and redirect    | `config/_default/hugo.toml`, `static/_redirects` |
| 6    | Add CMS collection            | `static/admin/config.yml`                        |
| 7    | Create category content files | 16 files in `content/categories/`                |
| 8    | Final testing                 | Verification checklist                           |

**Total estimated tasks:** 8 major tasks with multiple steps each
