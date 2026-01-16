# Sitepins CMS Preparation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract hardcoded content from Hugo templates into editable data files and front matter, enabling Sitepins CMS to manage all site content.

**Architecture:** Create YAML data files for each homepage section (hero, about, venue-gallery). Update partials to read from data files instead of hardcoded content. Sitepins auto-detects content schemas from these files.

**Tech Stack:** Hugo data files (YAML), Go templates, existing SCSS (no changes needed)

---

## Current State Analysis

**Good (already CMS-ready):**

- `data/events.yaml` - Event types grid reads from data file
- `config/_default/params.toml` - Contact info, social links, analytics
- `config/_default/menus.toml` - Navigation menus

**Needs Extraction (hardcoded in templates):**

- `layouts/partials/hero.html` - Title, tagline, CTA text/link, background image path
- `layouts/partials/about.html` - Two content blocks with headings, paragraphs, images, CTAs
- `layouts/partials/venue-gallery.html` - Heading, subtext

---

### Task 1: Create Hero Section Data File

**Files:**

- Create: `data/hero.yaml`
- Modify: `layouts/partials/hero.html`

**Step 1: Create the data file**

Create `data/hero.yaml`:

```yaml
# Hero section content for homepage
# Edit this file to update the hero section

title_line1: "Germantown's Premier"
title_line2: "ART GALLERY & VENUE"
tagline:
  - "ART AND LIFE."
  - "LIFE AND ART."
  - "LIFE AS ART."
cta:
  text: "SCHEDULE A TOUR"
  link: "/contact/"
background_image: "images/hero/venue-exterior.jpg"
```

**Step 2: Verify file created**

Run: `cat data/hero.yaml`
Expected: YAML content displayed

**Step 3: Update hero partial to read from data file**

Replace entire contents of `layouts/partials/hero.html` with:

```go-html-template
{{- $hero := site.Data.hero -}}
{{- $heroImage := resources.Get $hero.background_image -}}
{{- $heroBg := "" -}}
{{- if $heroImage -}}
  {{- $heroBg = ($heroImage.Resize "1920x q85").RelPermalink -}}
{{- end -}}

<section class="hero" style="background-image: url('{{ $heroBg }}');">
  <div class="hero__content">
    <h1 class="hero__title">{{ $hero.title_line1 }}<br>{{ $hero.title_line2 | safeHTML }}</h1>
    <div class="hero__tagline tagline">
      {{- range $i, $line := $hero.tagline -}}
        {{- if $i }}<br>{{ end -}}
        {{ $line | safeHTML }}
      {{- end -}}
    </div>
    <div class="hero__cta">
      <a href="{{ $hero.cta.link }}" class="btn btn-secondary">{{ $hero.cta.text }}</a>
    </div>
  </div>
</section>
```

**Step 4: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 5: Visual verification**

Run: `hugo server -D`
Expected: Hero section renders identically to before

**Step 6: Commit**

```bash
git add data/hero.yaml layouts/partials/hero.html
git commit -m "refactor: extract hero content to data file for CMS"
```

---

### Task 2: Create About Section Data File

**Files:**

- Create: `data/about.yaml`
- Modify: `layouts/partials/about.html`

**Step 1: Create the data file**

Create `data/about.yaml`:

```yaml
# About section content for homepage
# Edit this file to update the about section

heading: "About Us"

blocks:
  - id: "who-we-are"
    subtitle: "Who we are"
    paragraphs:
      - "Nestled in the heart of Germantown, Tennessee, Pike & West is an unique art gallery and venue. Our team specializes in creating unforgettable experiences. Established in 2023, we are a family-owned and operated business dedicated to transforming dreams into reality."
      - "With over six years of experience in the event industry, our venue coordinator, Eden Neller, and event coordinator, Lyndal Brumley, share a passion for realizing your vision. They are experts at planning and executing every detail, ensuring that your event is everything you've ever imagined."
    cta:
      text: "SCHEDULE A TOUR"
      link: "/contact/"
    image:
      src: "images/about/team-eden-lyndal.jpg"
      alt: "Lyndal Brumley and Eden Neller, Pike & West team members"
    reverse: false

  - id: "what-we-do"
    subtitle: "What we do"
    paragraphs:
      - "Whether you're planning an art show, an intimate wedding, a milestone celebration, a corporate party, or a social gathering, Pike & West is the perfect space to accommodate your needs. Our modern venue space is a breath of fresh air and includes a dreamy multi-story patio space."
      - "We pride ourselves on going above and beyond to provide exceptional service and create a seamless experience for our clients. Our team is committed to ensuring that your event is everything you've ever dreamed of, from the initial consultation to the final farewell."
    cta:
      text: "CONTACT US"
      link: "/contact/"
    image:
      src: "images/about/event-party-bw.jpg"
      alt: "Guests enjoying an event at Pike & West"
    reverse: true
```

**Step 2: Verify file created**

Run: `cat data/about.yaml`
Expected: YAML content displayed

**Step 3: Update about partial to read from data file**

Replace entire contents of `layouts/partials/about.html` with:

```go-html-template
{{- $about := site.Data.about -}}

<section class="about section">
  <div class="container">
    <h1 class="about__heading">{{ $about.heading }}</h1>

    {{ range $about.blocks }}
    <div class="about__block{{ if .reverse }} about__block--reverse{{ end }}">
      <div class="about__content">
        <h2 class="about__subtitle">{{ .subtitle }}</h2>
        <div class="about__text">
          {{ range .paragraphs }}
          <p>{{ . }}</p>
          {{ end }}
        </div>
        <a href="{{ .cta.link }}" class="btn btn-dark">{{ .cta.text }}</a>
      </div>
      <div class="about__image">
        {{ $img := resources.Get .image.src }}
        {{ if $img }}
          {{ $resized := $img.Resize "800x q85" }}
          <img
            src="{{ $resized.RelPermalink }}"
            alt="{{ .image.alt }}"
            loading="lazy"
          />
        {{ end }}
      </div>
    </div>
    {{ end }}
  </div>
</section>
```

**Step 4: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 5: Visual verification**

Run: `hugo server -D`
Expected: About section renders identically to before

**Step 6: Commit**

```bash
git add data/about.yaml layouts/partials/about.html
git commit -m "refactor: extract about content to data file for CMS"
```

---

### Task 3: Create Venue Gallery Data File

**Files:**

- Create: `data/venue-gallery.yaml`
- Modify: `layouts/partials/venue-gallery.html`

**Step 1: Create the data file**

Create `data/venue-gallery.yaml`:

```yaml
# Venue gallery section content for homepage
# Edit this file to update the venue gallery section

heading: "OUR VENUE"
subtext: "Want to see more? Follow us on Instagram."

# Images are auto-loaded from assets/images/venue/
# To control order or add captions, list them explicitly:
# images:
#   - src: "images/venue/photo1.jpg"
#     alt: "Description of photo 1"
```

**Step 2: Verify file created**

Run: `cat data/venue-gallery.yaml`
Expected: YAML content displayed

**Step 3: Update venue-gallery partial to read from data file**

Update the heading and subtext in `layouts/partials/venue-gallery.html`:

Find and replace lines 4-6:

```html
    <h2 class="venue-gallery__heading">OUR VENUE</h2>
    <p class="venue-gallery__subtext">
      Want to see more? Follow us on Instagram.
    </p>
```

Replace with:

```go-html-template
    <h2 class="venue-gallery__heading">{{ site.Data.venue_gallery.heading }}</h2>
    <p class="venue-gallery__subtext">{{ site.Data.venue_gallery.subtext }}</p>
```

Note: Hugo converts `venue-gallery.yaml` to `venue_gallery` (underscores) in `site.Data`.

**Step 4: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 5: Visual verification**

Run: `hugo server -D`
Expected: Venue gallery section renders identically to before

**Step 6: Commit**

```bash
git add data/venue-gallery.yaml layouts/partials/venue-gallery.html
git commit -m "refactor: extract venue gallery content to data file for CMS"
```

---

### Task 4: Enhance Homepage Front Matter

**Files:**

- Modify: `content/_index.md`

**Step 1: Update homepage front matter with SEO and layout options**

Replace entire contents of `content/_index.md` with:

```yaml
---
title: "Pike & West | Germantown Gallery and Event Venue"
description: "Pike & West is Germantown's premier art gallery and event venue. Host your wedding, corporate event, birthday, or private party in our elegant space."
# Open Graph / Social sharing
og_image: "images/hero/venue-exterior.jpg"
og_type: "website"
# Page sections (for future CMS toggle controls)
sections:
  hero: true
  venue_gallery: true
  events: true
  about: true
---
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add content/_index.md
git commit -m "refactor: enhance homepage front matter for CMS"
```

---

### Task 5: Enhance Contact Page Front Matter

**Files:**

- Modify: `content/contact.md`

**Step 1: Update contact page front matter**

Replace entire contents of `content/contact.md` with:

```yaml
---
title: "Contact Us"
description: "Schedule a tour or contact Pike & West for your next event. Located at 2277 West Street, Germantown, TN."
layout: "contact"
type: "page"
# SEO
og_image: "images/hero/venue-exterior.jpg"
# Page sections
sections:
  contact_form: true
  find_us: true
---
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add content/contact.md
git commit -m "refactor: enhance contact page front matter for CMS"
```

---

### Task 6: Enhance Gallery Application Front Matter

**Files:**

- Modify: `content/gallery-application.md`

**Step 1: Update gallery application page front matter**

Replace entire contents of `content/gallery-application.md` with:

```yaml
---
title: "Gallery Application"
description: "Apply to exhibit your artwork at Pike & West gallery in Germantown, TN."
layout: "gallery-application"
type: "page"
# SEO
og_image: "images/hero/venue-exterior.jpg"
---
```

**Step 2: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add content/gallery-application.md
git commit -m "refactor: enhance gallery application front matter for CMS"
```

---

### Task 7: Add CTA Banner Data File

**Files:**

- Create: `data/cta-banner.yaml`
- Modify: `layouts/partials/cta-banner.html`

**Step 1: Read current CTA banner partial**

Run: `cat layouts/partials/cta-banner.html`
Expected: View current hardcoded content

**Step 2: Create the data file**

Create `data/cta-banner.yaml`:

```yaml
# CTA Banner content
# Edit this file to update the call-to-action banner

heading: "Ready to create your perfect event?"
cta:
  text: "SCHEDULE A TOUR"
  link: "/contact/"
```

**Step 3: Update cta-banner partial to read from data file**

Update `layouts/partials/cta-banner.html` to use data file (exact changes depend on current content - read first, then update to use `site.Data.cta_banner`).

**Step 4: Build and verify no errors**

Run: `hugo --gc`
Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add data/cta-banner.yaml layouts/partials/cta-banner.html
git commit -m "refactor: extract CTA banner content to data file for CMS"
```

---

### Task 8: Final Verification and Documentation

**Files:**

- Read: All data files created

**Step 1: List all data files**

Run: `ls -la data/`
Expected: See `hero.yaml`, `about.yaml`, `venue-gallery.yaml`, `events.yaml`, `cta-banner.yaml`

**Step 2: Full production build test**

Run: `hugo --gc --minify`
Expected: Build succeeds with no warnings

**Step 3: Visual regression check**

Run: `hugo server -D` and manually compare all sections
Expected: Site looks identical to before changes

**Step 4: Final commit with summary**

```bash
git add .
git commit -m "feat: complete Sitepins CMS preparation

- Extract hero content to data/hero.yaml
- Extract about content to data/about.yaml
- Extract venue gallery content to data/venue-gallery.yaml
- Extract CTA banner content to data/cta-banner.yaml
- Enhance front matter in all content files
- All templates now read from data files

Ready for Sitepins CMS connection."
```

---

## Sitepins Connection (Post-Implementation)

After implementing this plan:

1. Go to [sitepins.com](https://sitepins.com)
2. Connect your GitHub repository
3. Select `content/` and `data/` as content folders
4. Select `static/images/` and `assets/images/` as media folders
5. Sitepins will auto-detect the YAML schemas

**Editable via Sitepins:**

- `data/hero.yaml` - Hero section
- `data/about.yaml` - About section
- `data/events.yaml` - Event types grid
- `data/venue-gallery.yaml` - Gallery heading
- `data/cta-banner.yaml` - CTA banner
- `content/*.md` - Page metadata
- `config/_default/params.toml` - Site settings
