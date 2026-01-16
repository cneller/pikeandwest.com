# Data File Migration for CMS Readiness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate hardcoded content from Hugo templates to data files, enabling CMS integration for non-technical editors.

**Architecture:** Create YAML data files for event types, about section content, and site-wide text. Update partials to read from data files using Hugo's `site.Data` accessor. Extend front matter schema in archetypes for blog/page CMS editing.

**Tech Stack:** Hugo data files (YAML), Hugo templating with `range` and `site.Data`, YAML front matter

---

## Task 1: Create Event Types Data File

**Files:**

- Create: `data/events.yaml`

**Step 1: Create the events data file**

Create `data/events.yaml` with the 6 event types currently hardcoded in `layouts/partials/event-types.html`:

```yaml
# Event types displayed on homepage grid
# Each event has an icon filename and display label

heading: "The perfect place for your next..."
cta_text: "CONTACT US"
cta_link: "/contact/"

types:
  - icon: "icon-wedding-rings.png"
    label: "Wedding"
  - icon: "icon-champagne.png"
    label: "Private Party"
  - icon: "icon-badge.png"
    label: "Corporate Party"
  - icon: "icon-cake.png"
    label: "Birthday"
  - icon: "icon-disco-ball.png"
    label: "Dance"
  - icon: "icon-rattle.png"
    label: "Baby Shower"
```

**Step 2: Verify file created correctly**

Run: `cat data/events.yaml`
Expected: YAML content with 6 event types displayed

**Step 3: Commit**

```bash
git add data/events.yaml
git commit -m "feat: add events data file for CMS editability"
```

---

## Task 2: Update Event Types Partial to Use Data File

**Files:**

- Modify: `layouts/partials/event-types.html`

**Step 1: Update the partial to read from data file**

Replace the entire contents of `layouts/partials/event-types.html` with:

```html
<section class="events section">
  <div class="container">
    <h2 class="events__heading">{{ site.Data.events.heading }}</h2>

    <div class="events__grid">
      {{ range site.Data.events.types }}
      <div class="events__item">
        <div class="events__icon">
          {{ $icon := resources.Get (printf "images/icons/%s" .icon) }}
          {{ if $icon }}
            {{ $resized := $icon.Resize "128x" }}
            <img src="{{ $resized.RelPermalink }}" alt="{{ .label }} icon" />
          {{ end }}
        </div>
        <span class="events__label">{{ .label }}</span>
      </div>
      {{ end }}
    </div>

    <div class="events__cta">
      <a href="{{ site.Data.events.cta_link }}" class="btn btn-outline">{{ site.Data.events.cta_text }}</a>
    </div>
  </div>
</section>
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Start dev server and visually verify**

Run: `hugo server`
Expected: Homepage displays 6 event types identical to before

**Step 4: Commit**

```bash
git add layouts/partials/event-types.html
git commit -m "refactor: event-types partial reads from data file"
```

---

## Task 3: Create About Section Data File

**Files:**

- Create: `data/about.yaml`

**Step 1: Create the about data file**

Create `data/about.yaml` with the two content blocks from `layouts/partials/about.html`:

```yaml
# About section content blocks
# Each block has title, paragraphs, image, and CTA

heading: "About Us"

blocks:
  - id: "who-we-are"
    subtitle: "Who we are"
    paragraphs:
      - "Nestled in the heart of Germantown, Tennessee, Pike & West is an unique art gallery and venue. Our team specializes in creating unforgettable experiences. Established in 2023, we are a family-owned and operated business dedicated to transforming dreams into reality."
      - "With over six years of experience in the event industry, our venue coordinator, Eden Neller, and event coordinator, Lyndal Brumley, share a passion for realizing your vision. They are experts at planning and executing every detail, ensuring that your event is everything you've ever imagined."
    cta_text: "SCHEDULE A TOUR"
    cta_link: "/contact/"
    image: "images/about/team-eden-lyndal.jpg"
    image_alt: "Lyndal Brumley and Eden Neller, Pike & West team members"
    reverse: false

  - id: "what-we-do"
    subtitle: "What we do"
    paragraphs:
      - "Whether you're planning an art show, an intimate wedding, a milestone celebration, a corporate party, or a social gathering, Pike & West is the perfect space to accommodate your needs. Our modern venue space is a breath of fresh air and includes a dreamy multi-story patio space."
      - "We pride ourselves on going above and beyond to provide exceptional service and create a seamless experience for our clients. Our team is committed to ensuring that your event is everything you've ever dreamed of, from the initial consultation to the final farewell."
    cta_text: "CONTACT US"
    cta_link: "/contact/"
    image: "images/about/event-party-bw.jpg"
    image_alt: "Guests enjoying an event at Pike & West"
    reverse: true
```

**Step 2: Verify file created correctly**

Run: `cat data/about.yaml`
Expected: YAML content with 2 content blocks displayed

**Step 3: Commit**

```bash
git add data/about.yaml
git commit -m "feat: add about section data file for CMS editability"
```

---

## Task 4: Update About Partial to Use Data File

**Files:**

- Modify: `layouts/partials/about.html`

**Step 1: Update the partial to read from data file**

Replace the entire contents of `layouts/partials/about.html` with:

```html
<section class="about section">
  <div class="container">
    <h1 class="about__heading">{{ site.Data.about.heading }}</h1>

    {{ range site.Data.about.blocks }}
    <div class="about__block{{ if .reverse }} about__block--reverse{{ end }}">
      <div class="about__content">
        <h2 class="about__subtitle">{{ .subtitle }}</h2>
        <div class="about__text">
          {{ range .paragraphs }}
          <p>{{ . }}</p>
          {{ end }}
        </div>
        <a href="{{ .cta_link }}" class="btn btn-dark">{{ .cta_text }}</a>
      </div>
      <div class="about__image">
        {{ $image := resources.Get .image }}
        {{ if $image }}
          {{ $resized := $image.Resize "800x q85" }}
          <img
            src="{{ $resized.RelPermalink }}"
            alt="{{ .image_alt }}"
            loading="lazy"
          />
        {{ end }}
      </div>
    </div>
    {{ end }}
  </div>
</section>
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Start dev server and visually verify**

Run: `hugo server`
Expected: About section displays both blocks identical to before

**Step 4: Commit**

```bash
git add layouts/partials/about.html
git commit -m "refactor: about partial reads from data file"
```

---

## Task 5: Create Hero/CTA Site Content Data File

**Files:**

- Create: `data/site-content.yaml`

**Step 1: Create the site content data file**

Create `data/site-content.yaml` for hero and CTA banner content:

```yaml
# Site-wide content blocks editable via CMS
# Hero section and CTA banners

hero:
  title_line1: "Germantown's Premier"
  title_line2: "ART GALLERY & VENUE"
  tagline:
    - "ART AND LIFE."
    - "LIFE AND ART."
    - "LIFE AS ART."
  cta_text: "SCHEDULE A TOUR"
  cta_link: "/contact/"
  background_image: "images/hero/venue-exterior.jpg"

cta_banner:
  heading: "Let's celebrate!"
  text: "Book your next event at Pike & West and create unforgettable memories!"
  cta_text: "Schedule a Tour"
  cta_link: "/contact/"
  background_image: "images/venue/venue-08-disco-background.jpg"
```

**Step 2: Verify file created correctly**

Run: `cat data/site-content.yaml`
Expected: YAML content with hero and cta_banner sections

**Step 3: Commit**

```bash
git add data/site-content.yaml
git commit -m "feat: add site-content data file for hero and CTA sections"
```

---

## Task 6: Update Hero Partial to Use Data File

**Files:**

- Modify: `layouts/partials/hero.html`

**Step 1: Update the partial to read from data file**

Replace the entire contents of `layouts/partials/hero.html` with:

```html
{{- $heroData := site.Data.site_content.hero -}}
{{- $heroImage := resources.Get $heroData.background_image -}}
{{- $heroBg := "" -}}
{{- if $heroImage -}}
  {{- $heroBg = ($heroImage.Resize "1920x q85").RelPermalink -}}
{{- end -}}

<section class="hero" style="background-image: url('{{ $heroBg }}');">
  <div class="hero__content">
    <h1 class="hero__title">{{ $heroData.title_line1 }}<br>{{ $heroData.title_line2 | replaceRE " " "&nbsp;" | safeHTML }}</h1>
    <div class="hero__tagline tagline">{{ range $i, $line := $heroData.tagline }}{{ if $i }}<br>{{ end }}{{ $line | replaceRE " " "&nbsp;" | safeHTML }}{{ end }}</div>
    <div class="hero__cta">
      <a href="{{ $heroData.cta_link }}" class="btn btn-secondary">{{ $heroData.cta_text }}</a>
    </div>
  </div>
</section>
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Start dev server and visually verify**

Run: `hugo server`
Expected: Hero section displays identical to before with non-breaking spaces preserved

**Step 4: Commit**

```bash
git add layouts/partials/hero.html
git commit -m "refactor: hero partial reads from data file"
```

---

## Task 7: Update CTA Banner Partial to Use Data File

**Files:**

- Modify: `layouts/partials/cta-banner.html`

**Step 1: Update the partial to read from data file**

Replace the entire contents of `layouts/partials/cta-banner.html` with:

```html
{{- $ctaData := site.Data.site_content.cta_banner -}}
{{- $bgImage := resources.Get $ctaData.background_image -}}
{{- $bgUrl := "" -}}
{{- if $bgImage -}}
  {{- $bgUrl = ($bgImage.Resize "1920x q80").RelPermalink -}}
{{- end -}}

<section class="cta-banner" style="background-image: url('{{ $bgUrl }}');">
  <div class="cta-banner__content">
    <h2 class="cta-banner__heading">{{ $ctaData.heading }}</h2>
    <p class="cta-banner__text">{{ $ctaData.text }}</p>
    <a href="{{ $ctaData.cta_link }}" class="btn btn-secondary">{{ $ctaData.cta_text }}</a>
  </div>
</section>
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Start dev server and visually verify**

Run: `hugo server`
Expected: CTA banner displays identical to before

**Step 4: Commit**

```bash
git add layouts/partials/cta-banner.html
git commit -m "refactor: cta-banner partial reads from data file"
```

---

## Task 8: Update Archetype for CMS-Compatible Front Matter

**Files:**

- Modify: `archetypes/default.md`

**Step 1: Update archetype to use YAML and extended schema**

Replace the entire contents of `archetypes/default.md` with:

```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
image: ""
author: "Pike & West"
tags: []
---

```

**Step 2: Verify file updated correctly**

Run: `cat archetypes/default.md`
Expected: YAML front matter with extended fields (title, description, date, lastmod, draft, image, author, tags)

**Step 3: Commit**

```bash
git add archetypes/default.md
git commit -m "feat: extend archetype with CMS-compatible front matter schema"
```

---

## Task 9: Create Blog Archetype for Future Content

**Files:**

- Create: `archetypes/blog.md`

**Step 1: Create blog-specific archetype**

Create `archetypes/blog.md` with blog-specific fields:

```yaml
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true
image: ""
author: "Pike & West"
tags: []
categories: []
featured: false
---

Write your blog post content here...
```

**Step 2: Verify file created correctly**

Run: `cat archetypes/blog.md`
Expected: YAML front matter with blog-specific fields including categories and featured

**Step 3: Commit**

```bash
git add archetypes/blog.md
git commit -m "feat: add blog archetype for future CMS content creation"
```

---

## Task 10: Final Verification and Cleanup

**Files:**

- None (verification only)

**Step 1: Run full build**

Run: `hugo --gc --minify`
Expected: Build succeeds with no errors or warnings

**Step 2: Start dev server and verify all sections**

Run: `hugo server`

Verify each section displays correctly:

- [ ] Hero section: title, tagline, CTA button
- [ ] Event types grid: 6 event types with icons
- [ ] About section: both content blocks with images
- [ ] CTA banner: heading, text, button

**Step 3: Delete extracted-assets.yaml reference file (optional)**

The `data/extracted-assets.yaml` was a reference document from Webflow export. It can be removed now that data files are in place:

Run: `rm data/extracted-assets.yaml`

**Step 4: Remove .gitkeep from data directory**

Run: `rm data/.gitkeep`

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: complete data file migration for CMS readiness"
```

---

## Summary

After completing all tasks, the project will have:

| Data File                | Content                                     |
|--------------------------|---------------------------------------------|
| `data/events.yaml`       | 6 event types with icons and labels         |
| `data/about.yaml`        | 2 about section blocks with text and images |
| `data/site-content.yaml` | Hero section and CTA banner content         |

| Updated Partial    | Change                                         |
|--------------------|------------------------------------------------|
| `event-types.html` | Reads from `site.Data.events`                  |
| `about.html`       | Reads from `site.Data.about`                   |
| `hero.html`        | Reads from `site.Data.site_content.hero`       |
| `cta-banner.html`  | Reads from `site.Data.site_content.cta_banner` |

| Archetype    | Purpose                              |
|--------------|--------------------------------------|
| `default.md` | Extended YAML schema for pages       |
| `blog.md`    | Blog-specific schema with categories |

**CMS Readiness:** ~80% (up from 30%)

**Remaining for full CMS integration:**

1. Choose CMS (CloudCannon, Sitepins, or Sveltia)
2. Create CMS configuration file
3. Set up authentication
4. Map data files to CMS collections
