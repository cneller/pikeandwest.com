# Sveltia CMS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Install and configure Sveltia CMS for the Pike & West Hugo site so non-technical editors can manage all site content through a browser-based CMS at `/admin/`.

**Architecture:** Static CMS admin page (`static/admin/`) loaded via CDN, authenticated via GitHub OAuth through a Cloudflare Worker. Blog posts migrated to Hugo page bundles for co-located images. Contact/social data extracted from `params.toml` into an editable `data/site_settings.yaml`. Existing CI/CD pipeline unchanged -- CMS commits go directly to `main`.

**Tech Stack:** Sveltia CMS v0.129+ (CDN), Hugo 0.146+, Cloudflare Pages, Cloudflare Workers (auth), GitHub OAuth

**Design Document:** This plan implements the design from the brainstorming session on 2026-01-27. See [Sveltia CMS Research](../sveltia-cms-research.md) for background.

---

## Phase 1: Site Settings Extraction

Extract contact and social data from `config/_default/params.toml` into a CMS-editable data file, then update all templates to read from the new location.

### Task 1: Create site_settings.yaml data file

**Files:**

- Create: `data/site_settings.yaml`

**Step 1: Create the data file**

```yaml
# Site Settings
# Editable via Sveltia CMS at /admin/
# Contact information and social media links

contact:
  phone: "901.206.5575"
  email: "events@pikeandwest.com"
  address: "2277 West Street"
  city: "Germantown"
  state: "TN"
  zip: "38138"
  hours: "Available by appointment only.<br>Call or email to reserve a tour."
  googleMapsUrl: "https://maps.app.goo.gl/7fNG7K7BEPQKpNzs8"

social:
  instagram: "https://www.instagram.com/pikeandwest/"
  facebook: "https://www.facebook.com/pikeandwest"
  twitter: "pikeandwest"
```

**Step 2: Verify data file loads**

Run: `cd /Users/colinneller/Projects/pikeandwest.com-sveltia-cms && hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds with no errors.

**Step 3: Commit**

```bash
git add data/site_settings.yaml
git commit -m "feat: add site_settings.yaml for CMS-editable contact and social data"
```

---

### Task 2: Update footer template to read from site_settings

**Files:**

- Modify: `layouts/partials/footer.html`

**Step 1: Replace all `.Site.Params.contact` references with `.Site.Data.site_settings.contact`**

In `layouts/partials/footer.html`, make these replacements:

| Line | Old                                         | New                                                     |
|------|---------------------------------------------|---------------------------------------------------------|
| ~69  | `{{ with .Site.Params.contact }}`           | `{{ with .Site.Data.site_settings.contact }}`           |
| ~71  | `{{ $.Site.Params.contact.googleMapsUrl }}` | `{{ $.Site.Data.site_settings.contact.googleMapsUrl }}` |
| ~80  | `{{ with .Site.Params.social.instagram }}`  | `{{ with $.Site.Data.site_settings.social.instagram }}` |
| ~93  | `{{ with .Site.Params.social.facebook }}`   | `{{ with $.Site.Data.site_settings.social.facebook }}`  |

All other references within the `{{ with }}` block (`.phone`, `.address`, `.city`, `.state`, `.zip`) work unchanged because they use the context variable.

**Step 2: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds.

**Step 3: Spot-check footer output**

Run: `hugo --gc --minify && grep -c "901.206.5575" public/index.html`
Expected: At least 1 match (phone number appears in footer).

**Step 4: Commit**

```bash
git add layouts/partials/footer.html
git commit -m "refactor: footer reads contact/social from site_settings.yaml"
```

---

### Task 3: Update contact page template

**Files:**

- Modify: `layouts/page/contact.html`

**Step 1: Replace all `.Site.Params.contact` references**

| Line   | Old                                                       | New                                                                   |
|--------|-----------------------------------------------------------|-----------------------------------------------------------------------|
| ~39    | `.Site.Params.contact.googleMapsUrl`                      | `.Site.Data.site_settings.contact.googleMapsUrl`                      |
| ~43-45 | `.Site.Params.contact.address`, `.city`, `.state`, `.zip` | `.Site.Data.site_settings.contact.address`, `.city`, `.state`, `.zip` |
| ~51    | `.Site.Params.contact.hours`                              | `.Site.Data.site_settings.contact.hours`                              |
| ~56    | `.Site.Params.contact.phone`                              | `.Site.Data.site_settings.contact.phone`                              |
| ~12    | `.Site.Params.contact.phone` (fallback)                   | `.Site.Data.site_settings.contact.phone`                              |

**Do NOT change** line ~6 (`.Site.Params.forms.contactEmbed`) -- forms config stays in params.toml.

**Step 2: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds.

**Step 3: Spot-check contact page**

Run: `grep "2277 West Street" public/contact/index.html | head -1`
Expected: Address appears in output.

**Step 4: Commit**

```bash
git add layouts/page/contact.html
git commit -m "refactor: contact page reads from site_settings.yaml"
```

---

### Task 4: Update gallery-application page template

**Files:**

- Modify: `layouts/page/gallery-application.html`

**Step 1: Replace all `.Site.Params.contact` references**

Same pattern as contact page:

| Line   | Old                                                       | New                                                                   |
|--------|-----------------------------------------------------------|-----------------------------------------------------------------------|
| ~58    | `.Site.Params.contact.googleMapsUrl`                      | `.Site.Data.site_settings.contact.googleMapsUrl`                      |
| ~62-64 | `.Site.Params.contact.address`, `.city`, `.state`, `.zip` | `.Site.Data.site_settings.contact.address`, `.city`, `.state`, `.zip` |
| ~70    | `.Site.Params.contact.hours`                              | `.Site.Data.site_settings.contact.hours`                              |
| ~75    | `.Site.Params.contact.phone`                              | `.Site.Data.site_settings.contact.phone`                              |

**Do NOT change** line ~7 (`.Site.Params.forms.galleryApplicationPlacementId`) -- stays in params.toml.

**Step 2: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds.

**Step 3: Commit**

```bash
git add layouts/page/gallery-application.html
git commit -m "refactor: gallery-application reads from site_settings.yaml"
```

---

### Task 5: Update schema templates

**Files:**

- Modify: `layouts/partials/schema-local-business.html`
- Modify: `layouts/partials/structured-data.html`

**Step 1: Update schema-local-business.html**

Replace all `.Site.Params.contact` and `.Site.Params.social` references:

| Old                              | New                                          |
|----------------------------------|----------------------------------------------|
| `.Site.Params.contact`           | `.Site.Data.site_settings.contact`           |
| `$.Site.Params.social.instagram` | `$.Site.Data.site_settings.social.instagram` |
| `$.Site.Params.social.facebook`  | `$.Site.Data.site_settings.social.facebook`  |

**Step 2: Update structured-data.html**

Replace all `.Site.Params.contact` and `.Site.Params.social` references. This file has Organization and EventVenue schema sections, both referencing contact info.

| Old                             | New                                         |
|---------------------------------|---------------------------------------------|
| `.Site.Params.contact.phone`    | `.Site.Data.site_settings.contact.phone`    |
| `.Site.Params.contact.email`    | `.Site.Data.site_settings.contact.email`    |
| `.Site.Params.contact.address`  | `.Site.Data.site_settings.contact.address`  |
| `.Site.Params.contact.city`     | `.Site.Data.site_settings.contact.city`     |
| `.Site.Params.contact.state`    | `.Site.Data.site_settings.contact.state`    |
| `.Site.Params.contact.zip`      | `.Site.Data.site_settings.contact.zip`      |
| `.Site.Params.social.instagram` | `.Site.Data.site_settings.social.instagram` |
| `.Site.Params.social.facebook`  | `.Site.Data.site_settings.social.facebook`  |

**Step 3: Update head.html**

Replace Twitter card references:

| Old                           | New                                       |
|-------------------------------|-------------------------------------------|
| `.Site.Params.social.twitter` | `.Site.Data.site_settings.social.twitter` |

**Step 4: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds.

**Step 5: Spot-check schema output**

Run: `grep -c "901.206.5575\|pikeandwest" public/index.html`
Expected: Multiple matches (phone in schema, social URLs in sameAs).

**Step 6: Commit**

```bash
git add layouts/partials/schema-local-business.html layouts/partials/structured-data.html layouts/partials/head.html
git commit -m "refactor: schema and head templates read from site_settings.yaml"
```

---

## Phase 2: Blog Page Bundle Migration

Convert all 6 blog posts from flat `.md` files to Hugo page bundles (directory + `index.md`). Move associated images into each bundle.

### Task 6: Migrate blog posts to page bundles

**Files:**

- Move: `content/blog/welcome-to-pike-and-west.md` -> `content/blog/welcome-to-pike-and-west/index.md`
- Move: `content/blog/corporate-event-planning-tips-2026.md` -> `content/blog/corporate-event-planning-tips-2026/index.md`
- Move: `content/blog/fall-baby-shower-inspiration.md` -> `content/blog/fall-baby-shower-inspiration/index.md`
- Move: `content/blog/holiday-anniversary-celebrations.md` -> `content/blog/holiday-anniversary-celebrations/index.md`
- Move: `content/blog/milestone-birthday-new-year.md` -> `content/blog/milestone-birthday-new-year/index.md`
- Move: `content/blog/valentines-day-love-in-all-forms.md` -> `content/blog/valentines-day-love-in-all-forms/index.md`
- Keep: `content/blog/_index.md` (branch bundle, stays as-is)

**Step 1: Create directories and move files**

For each of the 6 blog posts (NOT `_index.md`):

```bash
cd /Users/colinneller/Projects/pikeandwest.com-sveltia-cms
for post in welcome-to-pike-and-west corporate-event-planning-tips-2026 fall-baby-shower-inspiration holiday-anniversary-celebrations milestone-birthday-new-year valentines-day-love-in-all-forms; do
  mkdir -p "content/blog/$post"
  git mv "content/blog/$post.md" "content/blog/$post/index.md"
done
```

**Step 2: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds. Blog post URLs remain unchanged (`/blog/welcome-to-pike-and-west/` etc.).

**Step 3: Verify URLs are preserved**

Run: `find public/blog -name "index.html" | sort`
Expected: All 6 blog post directories plus the listing page.

**Step 4: Commit**

```bash
git add content/blog/
git commit -m "refactor: convert blog posts to page bundles"
```

---

### Task 7: Copy shared venue images into blog bundles

Blog posts currently reference images from `assets/images/venue/` via Hugo resources. With page bundles, we need images accessible within the bundle. However, since multiple posts share the same venue images, and these images are also used by non-blog templates (hero, gallery), we should NOT move them out of `assets/images/venue/`.

**Strategy:** Keep `assets/images/venue/` intact. Blog post image references via `resources.Get` with paths like `images/venue/venue-01-interior.jpeg` will continue to work because Hugo resolves `resources.Get` against the `assets/` directory as a fallback, even for page bundles. **No image moves needed for posts using venue images.**

**However**, two posts reference Sitepins-uploaded images that need attention:

- `milestone-birthday-new-year`: `image: media/assets/images/Screenshot 2026-01-23 at 5.57.53 PM.png`
- `valentines-day-love-in-all-forms`: `image: media/assets/images/16B8F347-7996-4B11-AF68-A7718CC8ACC1.JPG`

These files are actually at `assets/images/Screenshot 2026-01-23 at 5.57.53 PM.png` and `assets/images/16B8F347-7996-4B11-AF68-A7718CC8ACC1.JPG`. The `media/assets/images/` prefix was a Sitepins convention.

**Step 1: Copy and rename Sitepins images into their bundles**

```bash
cd /Users/colinneller/Projects/pikeandwest.com-sveltia-cms
cp "assets/images/Screenshot 2026-01-23 at 5.57.53 PM.png" "content/blog/milestone-birthday-new-year/milestone-birthday-hero.png"
cp "assets/images/16B8F347-7996-4B11-AF68-A7718CC8ACC1.JPG" "content/blog/valentines-day-love-in-all-forms/valentines-day-hero.jpg"
```

**Step 2: Update front matter image paths for these two posts**

In `content/blog/milestone-birthday-new-year/index.md`:

```yaml
image: milestone-birthday-hero.png
```

In `content/blog/valentines-day-love-in-all-forms/index.md`:

```yaml
image: valentines-day-hero.jpg
```

**Step 3: Update blog templates to support page bundle resources**

The blog templates use `resources.Get` which resolves from `assets/`. For page bundle images, we need to also check page resources. Update `layouts/blog/single.html` lines 3-6:

Old:

```go-html-template
{{ $heroImage := "" }}
{{ with .Params.image }}
  {{ $heroImage = resources.Get . }}
{{ end }}
```

New:

```go-html-template
{{ $heroImage := "" }}
{{ with .Params.image }}
  {{/* Try page bundle resource first, then global assets */}}
  {{ $heroImage = $.Resources.GetMatch . }}
  {{ if not $heroImage }}
    {{ $heroImage = resources.Get . }}
  {{ end }}
{{ end }}
```

Apply the same pattern to `layouts/blog/list.html` lines 28-30:

Old:

```go-html-template
{{ with .Params.image }}
{{ $img := resources.Get . }}
{{ if $img }}
```

New:

```go-html-template
{{ with .Params.image }}
{{ $img := $page.Resources.GetMatch . }}
{{ if not $img }}
  {{ $img = resources.Get . }}
{{ end }}
{{ if $img }}
```

**Step 4: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds.

**Step 5: Verify all blog images resolve**

Run: `hugo --gc --minify && for post in welcome-to-pike-and-west corporate-event-planning-tips-2026 fall-baby-shower-inspiration holiday-anniversary-celebrations milestone-birthday-new-year valentines-day-love-in-all-forms; do echo -n "$post: "; grep -c "blog-hero\|blog-card__image" "public/blog/$post/index.html" 2>/dev/null || echo "MISSING"; done`
Expected: Each post shows at least 1 match (hero image rendered).

**Step 6: Remove old Sitepins images from assets root**

```bash
rm "assets/images/Screenshot 2026-01-23 at 5.57.53 PM.png"
rm "assets/images/16B8F347-7996-4B11-AF68-A7718CC8ACC1.JPG"
```

**Step 7: Commit**

```bash
git add -A content/blog/ layouts/blog/ assets/images/
git commit -m "feat: migrate blog images to page bundles with dual resource resolution"
```

---

## Phase 3: CMS Installation

Create the Sveltia CMS admin interface and configuration.

### Task 8: Create admin HTML entry point

**Files:**

- Create: `static/admin/index.html`

**Step 1: Create the admin directory and entry point**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Pike & West CMS</title>
  <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
  <link href="/admin/config.yml" type="application/yaml" rel="cms-config-url" />
</head>
<body></body>
</html>
```

**Step 2: Build and verify file is in output**

Run: `hugo --gc --minify && test -f public/admin/index.html && echo "OK" || echo "MISSING"`
Expected: `OK`

**Step 3: Commit**

```bash
git add static/admin/index.html
git commit -m "feat: add Sveltia CMS admin entry point"
```

---

### Task 9: Create CMS configuration

**Files:**

- Create: `static/admin/config.yml`

**Step 1: Create the full CMS configuration**

This is the largest file in the plan. It defines all collections, singletons, fields, and media configuration.

```yaml
# yaml-language-server: $schema=https://unpkg.com/@sveltia/cms/schema/sveltia-cms.json

# ============================================================
# Backend Configuration
# ============================================================
backend:
  name: github
  repo: cneller/pikeandwest.com
  branch: main
  # base_url will be set after deploying sveltia-cms-auth Worker (Phase 6)
  # base_url: https://sveltia-cms-auth.<subdomain>.workers.dev
  commit_messages:
    create: "[cms] content: add {{collection}} '{{slug}}'"
    update: "[cms] content: update {{collection}} '{{slug}}'"
    delete: "[cms] content: delete {{collection}} '{{slug}}'"
    uploadMedia: "[cms] content: upload '{{path}}'"
    deleteMedia: "[cms] content: delete media '{{path}}'"

# ============================================================
# Site
# ============================================================
site_url: https://pikeandwest.com
display_url: https://pikeandwest.com
logo_url: /images/logo/pw-logo-full.svg

# ============================================================
# Slug
# ============================================================
slug:
  encoding: unicode
  clean_accents: true
  sanitize_replacement: "-"

# ============================================================
# Media
# ============================================================
media_folder: static/images/uploads
public_folder: /images/uploads

# ============================================================
# Collections
# ============================================================
collections:
  # ----------------------------------------------------------
  # Blog Posts (Page Bundles)
  # ----------------------------------------------------------
  - name: blog
    label: Blog Posts
    label_singular: Blog Post
    folder: content/blog
    create: true
    delete: true
    slug: "{{slug}}"
    path: "{{slug}}/index"
    media_folder: ""
    public_folder: ""
    extension: md
    format: yaml-frontmatter
    icon: article
    summary: "{{title}} ({{year}}-{{month}}-{{day}})"
    sortable_fields:
      - date
      - title
    view_filters:
      - label: Published
        field: draft
        pattern: false
      - label: Drafts
        field: draft
        pattern: true
    fields:
      - label: Title
        name: title
        widget: string
        required: true
        hint: "Keep under 70 characters for best SEO display"
      - label: Description
        name: description
        widget: text
        required: true
        hint: "150-160 characters. This appears in Google search results."
      - label: Date
        name: date
        widget: datetime
        required: true
        format: "YYYY-MM-DD"
      - label: Featured Image
        name: image
        widget: image
        required: true
        hint: "Recommended: 1200x630px. Displays as hero background on post."
      - label: Image Alt Text
        name: image_alt
        widget: string
        required: true
        hint: "Describe the image for screen readers and SEO."
      - label: Author
        name: author
        widget: string
        default: "Pike & West"
      - label: Categories
        name: categories
        widget: select
        multiple: true
        min: 1
        max: 2
        options:
          - News
          - Weddings
          - Corporate Events
          - Planning Tips
          - Behind the Scenes
        hint: "Select 1-2 categories."
      - label: Tags
        name: tags
        widget: select
        multiple: true
        options:
          - announcement
          - welcome
          - venue updates
          - weddings
          - corporate
          - parties
          - celebrations
          - planning tips
          - event planning
          - venue tips
          - checklist
          - spring
          - summer
          - fall
          - winter
          - holidays
          - germantown
          - memphis
          - tennessee
        hint: "Select relevant tags for discovery."
      - label: Keywords
        name: keywords
        widget: list
        required: false
        hint: "3-5 SEO keywords including location terms."
      - label: Draft
        name: draft
        widget: boolean
        default: false
        hint: "Turn on to save without publishing to the live site."
      - label: Body
        name: body
        widget: markdown

  # ----------------------------------------------------------
  # Event Pages
  # ----------------------------------------------------------
  - name: events
    label: Event Pages
    label_singular: Event Page
    folder: content/events
    create: false
    delete: false
    extension: md
    format: yaml-frontmatter
    icon: celebration
    summary: "{{title}}"
    fields:
      - label: Title
        name: title
        widget: string
        required: true
        hint: "Page title shown in browser tab and search results."
      - label: Description
        name: description
        widget: text
        required: true
        hint: "150-160 characters for Google search results."
      - label: Event Type
        name: eventType
        widget: select
        options:
          - wedding
          - corporate
          - birthday
          - baby-shower
          - private
          - dance
      - label: Icon
        name: icon
        widget: string
        hint: "Icon filename (e.g., icon-wedding-rings.png). Developer-managed."
      - label: Hero Image
        name: image
        widget: image
        required: true
        media_folder: /static/images/events
        public_folder: /images/events
        hint: "1200x630px recommended."
      - label: Image Alt Text
        name: image_alt
        widget: string
        required: true
        hint: "Describe the image for accessibility."
      - label: Keywords
        name: keywords
        widget: list
        required: false
        hint: "3-5 SEO keywords."
      - label: Type
        name: type
        widget: hidden
        default: "events"
      - label: Body
        name: body
        widget: markdown

  # ----------------------------------------------------------
  # Divider
  # ----------------------------------------------------------
  - divider: true

  # ----------------------------------------------------------
  # Pages (File Collection)
  # ----------------------------------------------------------
  - name: pages
    label: Pages
    icon: description
    files:
      - name: home
        label: Homepage
        file: content/_index.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
            hint: "150-160 characters for search results."
          - label: Keywords
            name: keywords
            widget: list
            required: false
          - label: "Show Hero Section"
            name: sections
            widget: object
            collapsed: true
            fields:
              - { label: Hero, name: hero, widget: boolean, default: true }
              - { label: Venue Gallery, name: venue_gallery, widget: boolean, default: true }
              - { label: Events, name: events, widget: boolean, default: true }
              - { label: About, name: about, widget: boolean, default: true }
              - { label: CTA Banner, name: cta_banner, widget: boolean, default: true }

      - name: about
        label: About
        file: content/about.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
          - label: Keywords
            name: keywords
            widget: list
            required: false
          - label: Body
            name: body
            widget: markdown

      - name: contact
        label: Contact
        file: content/contact.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
          - label: Keywords
            name: keywords
            widget: list
            required: false
          - label: Body
            name: body
            widget: markdown

      - name: workshops
        label: Workshops
        file: content/workshops.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
          - label: Keywords
            name: keywords
            widget: list
            required: false
          - label: Body
            name: body
            widget: markdown

      - name: privacy
        label: Privacy Policy
        file: content/privacy.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
            required: false
          - label: Body
            name: body
            widget: markdown

      - name: accessibility
        label: Accessibility Statement
        file: content/accessibility.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
            required: false
          - label: Body
            name: body
            widget: markdown

      - name: gallery-application
        label: Gallery Application
        file: content/gallery-application.md
        fields:
          - label: Title
            name: title
            widget: string
          - label: Description
            name: description
            widget: text
          - label: Keywords
            name: keywords
            widget: list
            required: false
          - label: Body
            name: body
            widget: markdown

  # ----------------------------------------------------------
  # Divider
  # ----------------------------------------------------------
  - divider: true

# ============================================================
# Singletons (Data Files)
# ============================================================
singletons:
  # ----------------------------------------------------------
  # Site Settings
  # ----------------------------------------------------------
  - name: site_settings
    label: Site Settings
    file: data/site_settings.yaml
    icon: settings
    fields:
      - label: Contact Information
        name: contact
        widget: object
        fields:
          - label: Phone
            name: phone
            widget: string
            hint: "Format: 901.206.5575"
          - label: Email
            name: email
            widget: string
          - label: Street Address
            name: address
            widget: string
          - label: City
            name: city
            widget: string
          - label: State
            name: state
            widget: string
          - label: ZIP Code
            name: zip
            widget: string
          - label: Hours
            name: hours
            widget: string
            hint: "Supports HTML like <br> for line breaks."
          - label: Google Maps URL
            name: googleMapsUrl
            widget: string
      - label: Social Media
        name: social
        widget: object
        fields:
          - label: Instagram URL
            name: instagram
            widget: string
            hint: "Full URL: https://www.instagram.com/pikeandwest/"
          - label: Facebook URL
            name: facebook
            widget: string
            hint: "Full URL: https://www.facebook.com/pikeandwest"
          - label: Twitter Handle
            name: twitter
            widget: string
            hint: "Handle without @: pikeandwest"

  # ----------------------------------------------------------
  # Hero Section
  # ----------------------------------------------------------
  - name: hero
    label: Hero Section
    file: data/hero.yaml
    icon: panorama
    fields:
      - label: Title Line 1
        name: title_line1
        widget: string
        hint: "First line of the hero headline."
      - label: Title Line 2
        name: title_line2
        widget: string
        hint: "Second line (displayed in large script font)."
      - label: Tagline Lines
        name: tagline
        widget: list
        hint: "Each line of the tagline displayed separately."
      - label: CTA Button
        name: cta
        widget: object
        fields:
          - { label: Button Text, name: text, widget: string }
          - { label: Button Link, name: link, widget: string }
      - label: Background Image
        name: background_image
        widget: image
        media_folder: /static/images/hero
        public_folder: images/hero
        hint: "1920x1080px. Tall image for desktop CSS background."
      - label: Foreground Image
        name: foreground_image
        widget: image
        media_folder: /static/images/hero
        public_folder: images/hero
        hint: "1920x800px. Wider image for mobile."
      - label: Image Alt Text
        name: image_alt
        widget: text

  # ----------------------------------------------------------
  # CTA Banner
  # ----------------------------------------------------------
  - name: cta_banner
    label: CTA Banner
    file: data/cta_banner.yaml
    icon: campaign
    fields:
      - label: Heading
        name: heading
        widget: string
      - label: Body Text
        name: text
        widget: text
      - label: CTA Button
        name: cta
        widget: object
        fields:
          - { label: Button Text, name: text, widget: string }
          - { label: Button Link, name: link, widget: string }
      - label: Background Image
        name: background_image
        widget: image
        media_folder: /static/images/venue
        public_folder: images/venue

  # ----------------------------------------------------------
  # About Section
  # ----------------------------------------------------------
  - name: about_data
    label: About Section
    file: data/about.yaml
    icon: info
    fields:
      - label: Heading
        name: heading
        widget: string
      - label: Content Blocks
        name: blocks
        widget: list
        fields:
          - { label: Block ID, name: id, widget: string, hint: "Unique identifier (e.g., who-we-are)." }
          - { label: Subtitle, name: subtitle, widget: string }
          - label: Paragraphs
            name: paragraphs
            widget: list
            hint: "Each paragraph is a separate list item."
          - label: CTA Button
            name: cta
            widget: object
            fields:
              - { label: Button Text, name: text, widget: string }
              - { label: Button Link, name: link, widget: string }
          - label: Image
            name: image
            widget: object
            fields:
              - label: Image File
                name: src
                widget: image
                media_folder: /static/images/about
                public_folder: images/about
              - { label: Alt Text, name: alt, widget: string }
          - label: Reverse Layout
            name: reverse
            widget: boolean
            default: false
            hint: "Swap image and text positions."

  # ----------------------------------------------------------
  # Event Types Grid
  # ----------------------------------------------------------
  - name: events_data
    label: Event Types Grid
    file: data/events.yaml
    icon: grid_view
    fields:
      - label: Heading
        name: heading
        widget: string
      - label: CTA Button Text
        name: cta_text
        widget: string
      - label: CTA Button Link
        name: cta_link
        widget: string
      - label: Event Types
        name: types
        widget: list
        fields:
          - { label: Icon Filename, name: icon, widget: string, hint: "e.g., icon-wedding-rings.png" }
          - { label: Label, name: label, widget: string }
          - { label: Link, name: link, widget: string }

  # ----------------------------------------------------------
  # Workshops Data
  # ----------------------------------------------------------
  - name: workshops_data
    label: Workshops Content
    file: data/workshops.yaml
    icon: brush
    fields:
      - label: Heading
        name: heading
        widget: string
      - label: Subheading
        name: subheading
        widget: string
      - label: Intro Section
        name: intro
        widget: object
        fields:
          - { label: Title, name: title, widget: string }
          - label: Paragraphs
            name: paragraphs
            widget: list
      - label: Features
        name: features
        widget: list
        fields:
          - { label: Icon, name: icon, widget: string, hint: "SVG filename (e.g., icon-palette.svg)" }
          - { label: Title, name: title, widget: string }
          - { label: Description, name: description, widget: text }
      - label: Host CTA
        name: host_cta
        widget: object
        fields:
          - { label: Heading, name: heading, widget: string }
          - { label: Text, name: text, widget: text }
          - { label: Button Text, name: button_text, widget: string }
          - { label: Button Link, name: button_link, widget: string }

  # ----------------------------------------------------------
  # Venue Gallery
  # ----------------------------------------------------------
  - name: venue_gallery
    label: Venue Gallery
    file: data/venue_gallery.yaml
    icon: photo_library
    fields:
      - label: Heading
        name: heading
        widget: string
      - label: Subtext
        name: subtext
        widget: string
        hint: "Displayed below the gallery carousel."

  # ----------------------------------------------------------
  # Blog Taxonomy
  # ----------------------------------------------------------
  - name: blog_taxonomy
    label: Blog Categories & Tags
    file: data/blog_taxonomy.yaml
    icon: label
    fields:
      - label: Categories
        name: categories
        widget: list
        hint: "Blog post category options. Add or remove as needed."
      - label: Tags
        name: tags
        widget: list
        hint: "Blog post tag options. Add or remove as needed."

  # ----------------------------------------------------------
  # 404 Page
  # ----------------------------------------------------------
  - name: error404
    label: 404 Error Page
    file: data/error404.yaml
    icon: error
    fields:
      - label: Headline
        name: headline
        widget: string
      - label: Tagline Lines
        name: tagline
        widget: list
      - label: Message
        name: message
        widget: text
      - label: Primary CTA
        name: cta_primary
        widget: object
        fields:
          - { label: Text, name: text, widget: string }
          - { label: Link, name: link, widget: string }
      - label: Secondary CTAs
        name: cta_secondary
        widget: list
        fields:
          - { label: Text, name: text, widget: string }
          - { label: Link, name: link, widget: string }
      - label: Background Image
        name: background_image
        widget: image
        media_folder: /static/images/venue
        public_folder: images/venue
      - label: Image Alt Text
        name: image_alt
        widget: string
```

**Step 2: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('static/admin/config.yml'))" && echo "VALID" || echo "INVALID"`
Expected: `VALID`

**Step 3: Build and verify config is in output**

Run: `hugo --gc --minify && test -f public/admin/config.yml && echo "OK" || echo "MISSING"`
Expected: `OK`

**Step 4: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat: add Sveltia CMS configuration with all collections and singletons"
```

---

### Task 10: Update \_headers for OAuth support

**Files:**

- Modify: `static/_headers`

**Step 1: Add COOP header for admin path**

Add this block to the existing `static/_headers` file, **before** the security headers section:

```text
# Sveltia CMS OAuth popup support
/admin/*
  Cross-Origin-Opener-Policy: same-origin-allow-popups
```

**Step 2: Build and verify**

Run: `hugo --gc --minify && grep -A1 "/admin" public/_headers`
Expected: Shows the COOP header.

**Step 3: Commit**

```bash
git add static/_headers
git commit -m "feat: add COOP header for Sveltia CMS OAuth popup"
```

---

### Task 11: Local CMS validation

**Files:** None (testing only)

**Step 1: Full build**

Run: `hugo --gc --minify`
Expected: Build succeeds with zero errors.

**Step 2: Start Hugo dev server**

Run: `hugo server -D`

**Step 3: Open CMS in Chrome/Edge**

Navigate to `http://localhost:1313/admin/` in Chrome or Edge. Click "Work with Local Repository" and select the project root when prompted.

**Step 4: Validate each collection loads**

Check that all of these appear in the sidebar and load without errors:

- Blog Posts (should show 6 entries)
- Event Pages (should show 6 entries)
- Pages > Homepage, About, Contact, Workshops, Privacy, Accessibility, Gallery Application
- Site Settings (should show contact and social fields)
- Hero Section, CTA Banner, About Section, Event Types Grid, Workshops Content
- Venue Gallery, Blog Categories & Tags, 404 Error Page

**Step 5: Test create blog post**

Create a test blog post. Verify:

- All fields render with labels and hints
- Image upload works (drag-drop or browse)
- Categories and tags appear as selects
- Save creates a page bundle directory with `index.md`

Delete the test post after verification.

**Step 6: Test edit a singleton**

Open Site Settings. Verify:

- Phone, email, address fields show current values
- Social media URLs show current values
- Save updates `data/site_settings.yaml`

---

## Phase 4: Cleanup

### Task 12: Remove Sitepins plan and Front Matter config

**Files:**

- Delete: `docs/sitepins-optimization-plan.md`
- Delete: `frontmatter.json`

**Step 1: Remove files**

```bash
cd /Users/colinneller/Projects/pikeandwest.com-sveltia-cms
git rm docs/sitepins-optimization-plan.md
git rm frontmatter.json
```

**Step 2: Verify no templates reference these files**

Run: `grep -r "sitepins\|frontmatter.json" layouts/ config/ 2>/dev/null | grep -v ".git"`
Expected: No output (no references).

**Step 3: Build and verify**

Run: `hugo --gc --minify 2>&1 | tail -5`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git commit -m "chore: remove Sitepins plan and Front Matter config, replaced by Sveltia CMS"
```

---

### Task 13: Update next-steps.md

**Files:**

- Modify: `docs/next-steps.md`

**Step 1: Update the Current Status table**

Add a row to the status table:

```markdown
| Sveltia CMS        | Installed | Config at static/admin/, pending auth Worker deployment |
```

**Step 2: Add to the Changelog**

Add entry at the top of the changelog:

```markdown
| 2026-01-27 | Installed Sveltia CMS: admin UI, config with all collections/singletons, blog page bundles, site settings extraction |
| 2026-01-27 | Removed Sitepins CMS plan and Front Matter CMS config (replaced by Sveltia CMS) |
| 2026-01-27 | Migrated blog posts to Hugo page bundles for co-located images |
| 2026-01-27 | Extracted contact/social data from params.toml to data/site_settings.yaml |
```

**Step 3: Commit**

```bash
git add docs/next-steps.md
git commit -m "docs: update next-steps with Sveltia CMS installation status"
```

---

## Phase 5: Claude Code Alignment

Update all Sveltia-related agents, skills, commands, and CLAUDE.md to reflect the actual implementation.

### Task 14: Audit and update Sveltia skill

**Files:**

- Modify: `.claude/skills/sveltia-hugo-maintenance/SKILL.md`

**Step 1: Review the skill against actual implementation**

The skill at `.claude/skills/sveltia-hugo-maintenance/SKILL.md` contains a content model reference, schema design patterns, and SEO standards. Compare these against:

- The actual `static/admin/config.yml` we just created
- The actual data file structures
- The actual template references

**Step 2: Update content model reference**

Ensure Domain 1 (Content Model Reference) matches our implementation:

- Blog uses page bundles now (`path: "{{slug}}/index"`)
- Site Settings singleton is new (`data/site_settings.yaml`)
- Sitepins references should be removed
- Front Matter CMS references should be removed

**Step 3: Update any references to removed files**

Search for and remove:

- References to `frontmatter.json`
- References to `docs/sitepins-optimization-plan.md`
- References to "Sitepins" as the CMS

**Step 4: Commit**

```bash
git add .claude/skills/sveltia-hugo-maintenance/SKILL.md
git commit -m "chore: update Sveltia skill to match actual implementation"
```

---

### Task 15: Audit and update Sveltia agent

**Files:**

- Modify: `.claude/agents/sveltia-schema-manager.md`

**Step 1: Review agent against implementation**

The agent at `.claude/agents/sveltia-schema-manager.md` describes collections it manages. Verify:

- Blog collection reflects page bundle structure
- Site Settings singleton is included
- Data file list matches our 9 singletons
- No references to Sitepins or Front Matter CMS

**Step 2: Update as needed**

Ensure the agent's collection list matches what's in `static/admin/config.yml`.

**Step 3: Commit**

```bash
git add .claude/agents/sveltia-schema-manager.md
git commit -m "chore: update Sveltia schema manager agent to match implementation"
```

---

### Task 16: Audit and update Sveltia commands

**Files:**

- Review: `.claude/commands/sveltia-schema.md`
- Review: `.claude/commands/sveltia-audit.md`
- Review: `.claude/commands/sveltia-health.md`

**Step 1: Verify commands reference correct file paths**

Each command should reference:

- Config at `static/admin/config.yml`
- Data files at their actual paths
- Blog as page bundles
- Site Settings as a new singleton

**Step 2: Update any stale references**

Remove references to Sitepins, Front Matter CMS, or old file paths.

**Step 3: Commit**

```bash
git add .claude/commands/
git commit -m "chore: update Sveltia commands to match implementation"
```

---

### Task 17: Update CLAUDE.md

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Update CMS references**

The CLAUDE.md has several sections referencing CMS tooling. Update:

- Remove any Sitepins or Front Matter CMS references
- Ensure the Sveltia commands table is accurate
- Ensure the mandatory content agent delegation table is accurate
- Add note about `data/site_settings.yaml` as the source for contact/social data (not `params.toml`)

**Step 2: Update the blog post styling section if needed**

Blog posts are now page bundles. If any instructions reference flat file paths like `content/blog/post-name.md`, update to `content/blog/post-name/index.md`.

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for Sveltia CMS implementation"
```

---

### Task 18: Update blog_taxonomy.yaml reference

**Files:**

- Modify: `data/blog_taxonomy.yaml`

**Step 1: Remove Sitepins reference**

Line 3 currently says: `# Sitepins editors can reference this file when creating new posts.`

Replace with: `# Managed via Sveltia CMS at /admin/ under "Blog Categories & Tags".`

**Step 2: Commit**

```bash
git add data/blog_taxonomy.yaml
git commit -m "chore: update blog taxonomy comment from Sitepins to Sveltia CMS"
```

---

### Task 19: Final validation

**Files:** None (testing only)

**Step 1: Full production build**

Run: `hugo --gc --minify`
Expected: Zero errors, zero warnings.

**Step 2: Verify all pages render**

Run: `find public -name "index.html" | wc -l`
Expected: Should match previous build count (approximately 20+ pages).

**Step 3: Verify blog URLs preserved**

Run: `for post in welcome-to-pike-and-west corporate-event-planning-tips-2026 fall-baby-shower-inspiration holiday-anniversary-celebrations milestone-birthday-new-year valentines-day-love-in-all-forms; do test -f "public/blog/$post/index.html" && echo "$post: OK" || echo "$post: MISSING"; done`
Expected: All 6 show OK.

**Step 4: Verify admin files present**

Run: `test -f public/admin/index.html && test -f public/admin/config.yml && echo "Admin OK" || echo "Admin MISSING"`
Expected: `Admin OK`

**Step 5: Verify contact info renders from new data source**

Run: `grep "901.206.5575" public/index.html public/contact/index.html | wc -l`
Expected: At least 2 (footer + contact page).

---

## Phase 6: Infrastructure & Onboarding (Human Required)

These steps require manual action and cannot be automated.

### Task 20: Push and run CI

- [ ] Push the branch to GitHub
- [ ] Verify all CI checks pass (GitHub Actions)
- [ ] Review the Cloudflare Pages preview deployment

### Task 21: Deploy auth Worker

- [ ] Clone [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)
- [ ] Run `npx wrangler login`
- [ ] Run `npx wrangler secret put GITHUB_CLIENT_ID`
- [ ] Run `npx wrangler secret put GITHUB_CLIENT_SECRET`
- [ ] Run `npx wrangler deploy`
- [ ] Note the Worker URL: `https://sveltia-cms-auth.<subdomain>.workers.dev`

### Task 22: Register GitHub OAuth App

- [ ] Go to [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers)
- [ ] Create new OAuth App:
  - Application name: `Sveltia CMS - Pike & West`
  - Homepage URL: `https://pikeandwest.com`
  - Authorization callback URL: `https://sveltia-cms-auth.<subdomain>.workers.dev/callback`
- [ ] Copy Client ID and Client Secret
- [ ] Set as Worker environment variables (Task 21)

### Task 23: Update config.yml with Worker URL

- [ ] Edit `static/admin/config.yml`
- [ ] Uncomment and set `base_url` to the Worker URL from Task 21
- [ ] Set `ALLOWED_DOMAINS` on the Worker to `pikeandwest.com`
- [ ] Commit and push

### Task 24: Add GitHub collaborators

- [ ] Create GitHub accounts for wife and assistant (if needed)
- [ ] Add as collaborators on `cneller/pikeandwest.com` repo (write access)
- [ ] Have them accept the collaborator invite

### Task 25: End-to-end test

- [ ] Visit `https://pikeandwest.com/admin/`
- [ ] Sign in with GitHub (each user)
- [ ] Edit a blog post, save, verify CI runs and site deploys
- [ ] Edit Site Settings (phone number), save, verify it appears on the live site
- [ ] Create a test blog post with image upload, verify it renders
- [ ] Delete the test post

---

## Summary

| Phase                          | Tasks       | Autonomous?              |
|--------------------------------|-------------|--------------------------|
| 1: Site Settings Extraction    | Tasks 1-5   | Yes                      |
| 2: Blog Page Bundle Migration  | Tasks 6-7   | Yes                      |
| 3: CMS Installation            | Tasks 8-11  | Yes                      |
| 4: Cleanup                     | Tasks 12-13 | Yes                      |
| 5: Claude Code Alignment       | Tasks 14-19 | Yes                      |
| 6: Infrastructure & Onboarding | Tasks 20-25 | **No -- human required** |
