# Media Library Configuration Improvements

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the Sveltia CMS media library experience by scoping asset tabs correctly, making blog Featured Image explicitly entry-relative, converting event icons to CMS-uploadable image widgets, and adding CMS-managed venue gallery with ordering and alt text.

**Architecture:** All changes target `static/admin/config.yml` (Sveltia CMS schema), Hugo data files (YAML), Hugo templates (Go HTML), and event content front matter (Markdown). No new dependencies. Hugo module mounts already map `static/images/` to `assets/images/` so `resources.Get` paths use `images/...` without the `static/` prefix.

**Tech Stack:** Hugo (Go templates), Sveltia CMS (YAML config), YAML data files

---

## Background

The Sveltia CMS "Select Image" dialog shows categorized asset tabs (Field Assets, Collection Assets, Entry Assets, Global Assets) based on `media_folder`/`public_folder` settings at global, collection, and field levels. See `docs/sveltia-cms-media-library.md` for full documentation.

Key path convention: `media_folder` uses repo paths (`/static/images/venue`), `public_folder` uses `resources.Get`-compatible paths (`images/venue`) -- no leading slash, no `static/` prefix.

---

## Task 1: Add events collection-level media_folder

**Files:**

- Modify: `static/admin/config.yml:187-196`

**Why:** Currently the events collection inherits the global `media_folder: static/images`, so editors see all site images (logos, social icons, etc.) in Global Assets. Adding a collection-level override scopes the Collection Assets tab to venue photos only.

**Step 1: Add media_folder and public_folder to the events collection**

In `static/admin/config.yml`, find the events collection definition (line 187-196):

```yaml
  - name: events
    label: Event Pages
    label_singular: Event Page
    folder: content/events
    create: false
    delete: false
    extension: md
    format: yaml-frontmatter
    icon: celebration
    summary: '{{title}}'
```

Add `media_folder` and `public_folder` after `folder`:

```yaml
  - name: events
    label: Event Pages
    label_singular: Event Page
    folder: content/events
    media_folder: /static/images/venue
    public_folder: images/venue
    create: false
    delete: false
    extension: md
    format: yaml-frontmatter
    icon: celebration
    summary: '{{title}}'
```

**Step 2: Verify locally**

Run: `hugo server -D`
Expected: Site builds without errors. No template changes needed since this only affects the CMS config, not Hugo build.

**Step 3: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat(cms): add collection-level media_folder to events for scoped asset browsing"
```

---

## Task 2: Add explicit entry-relative media_folder to blog Featured Image field

**Files:**

- Modify: `static/admin/config.yml:118-122`

**Why:** The blog collection has `media_folder: ''` at the collection level (entry-relative for page bundles), but the Featured Image field inherits this implicitly. Making it explicit prevents editors from accidentally selecting images from Global Assets, which would produce paths incompatible with the page bundle template lookup.

**Step 1: Add media_folder and public_folder to the Featured Image field**

In `static/admin/config.yml`, find the blog Featured Image field (line 118-122):

```yaml
      - label: Featured Image
        name: image
        widget: image
        required: true
        hint: 'Recommended: 1200x630px. Displays as hero background on post.'
```

Add `media_folder` and `public_folder`:

```yaml
      - label: Featured Image
        name: image
        widget: image
        required: true
        media_folder: ''
        public_folder: ''
        hint: 'Recommended: 1200x630px. Displays as hero background on post.'
```

**Step 2: Verify locally**

Run: `hugo server -D`
Expected: Site builds without errors. Existing blog posts unchanged since the field value was already implicitly entry-relative.

**Step 3: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat(cms): make blog Featured Image explicitly entry-relative"
```

---

## Task 3: Convert events icon field from select to image widget

This task has three parts: update the CMS config, update content front matter, and update templates.

**Files:**

- Modify: `static/admin/config.yml:243-254` (events icon field)
- Modify: `content/events/weddings.md` (icon front matter)
- Modify: `content/events/corporate-events.md` (icon front matter)
- Modify: `content/events/birthday-parties.md` (icon front matter)
- Modify: `content/events/baby-showers.md` (icon front matter)
- Modify: `content/events/private-parties.md` (icon front matter)
- Modify: `content/events/dance-events.md` (icon front matter)
- Modify: `data/events.yaml` (event types grid icon values)
- Modify: `data/workshops.yaml` (workshop features icon values)
- Modify: `layouts/events/list.html:36-43` (icon template)
- Modify: `layouts/partials/event-types.html:10` (icon template)
- Modify: `layouts/page/workshops.html:82` (icon template)

### Step 1: Update the CMS config icon field

In `static/admin/config.yml`, find the events icon field (line 243-254):

```yaml
      - label: Icon
        name: icon
        widget: select
        required: true
        options:
          - { label: 'Wedding Rings', value: 'icon-wedding-rings.png' }
          - { label: 'Badge / Corporate', value: 'icon-badge.png' }
          - { label: 'Birthday Cake', value: 'icon-cake.png' }
          - { label: 'Baby Rattle', value: 'icon-rattle.png' }
          - { label: 'Champagne', value: 'icon-champagne.png' }
          - { label: 'Disco Ball', value: 'icon-disco-ball.png' }
        hint: 'Event type icon displayed on the events list page.'
```

Replace with:

```yaml
      - label: Icon
        name: icon
        widget: image
        required: true
        media_folder: /static/images/icons
        public_folder: images/icons
        hint: 'Event type icon (PNG). Displayed on the events list and homepage grid.'
```

### Step 2: Update all event content front matter

The current front matter stores bare filenames (e.g., `icon: "icon-wedding-rings.png"`). The new image widget with `public_folder: images/icons` will store full paths (e.g., `icon: "images/icons/icon-wedding-rings.png"`). Update all six event files:

**`content/events/weddings.md`:** Change `icon: "icon-wedding-rings.png"` to `icon: "images/icons/icon-wedding-rings.png"`

**`content/events/corporate-events.md`:** Change `icon: "icon-badge.png"` to `icon: "images/icons/icon-badge.png"`

**`content/events/birthday-parties.md`:** Change `icon: "icon-cake.png"` to `icon: "images/icons/icon-cake.png"`

**`content/events/baby-showers.md`:** Change `icon: icon-rattle.png` to `icon: "images/icons/icon-rattle.png"`

**`content/events/private-parties.md`:** Change `icon: "icon-champagne.png"` to `icon: "images/icons/icon-champagne.png"`

**`content/events/dance-events.md`:** Change `icon: "icon-disco-ball.png"` to `icon: "images/icons/icon-disco-ball.png"`

### Step 3: Update data/events.yaml icon values

In `data/events.yaml`, update each icon entry from bare filename to full path:

```yaml
types:
  - icon: "images/icons/icon-wedding-rings.png"
    label: "Wedding"
    link: "/events/weddings/"
  - icon: "images/icons/icon-champagne.png"
    label: "Private Party"
    link: "/events/private-parties/"
  - icon: "images/icons/icon-badge.png"
    label: "Corporate Party"
    link: "/events/corporate-events/"
  - icon: "images/icons/icon-cake.png"
    label: "Birthday"
    link: "/events/birthday-parties/"
  - icon: "images/icons/icon-disco-ball.png"
    label: "Dance"
    link: "/events/dance-events/"
  - icon: "images/icons/icon-rattle.png"
    label: "Baby Shower"
    link: "/events/baby-showers/"
```

### Step 4: Update data/workshops.yaml icon values

In `data/workshops.yaml`, update each feature icon from bare filename to full path:

```yaml
features:
  - icon: "images/icons/icon-palette.svg"
    title: "Social Atmosphere"
    description: ...
  - icon: "images/icons/icon-instructor.svg"
    title: "Expert Instruction"
    description: ...
  - icon: "images/icons/icon-supplies.svg"
    title: "All Materials Included"
    description: ...
```

Keep the description values unchanged; only modify the `icon` lines.

### Step 5: Update templates to remove printf concatenation

Three templates currently do `resources.Get (printf "images/icons/%s" .icon)`. Since `.icon` now contains the full path `images/icons/filename.png`, change to `resources.Get .icon`.

**`layouts/events/list.html` line 37:**

Change:

```go-html-template
        {{ $icon := resources.Get (printf "images/icons/%s" .) }}
```

To:

```go-html-template
        {{ $icon := resources.Get . }}
```

**`layouts/partials/event-types.html` line 10:**

Change:

```go-html-template
          {{- $icon := resources.Get (printf "images/icons/%s" .icon) -}}
```

To:

```go-html-template
          {{- $icon := resources.Get .icon -}}
```

**`layouts/page/workshops.html` line 82:**

Change:

```go-html-template
          {{- $icon := resources.Get (printf "images/icons/%s" .icon) -}}
```

To:

```go-html-template
          {{- $icon := resources.Get .icon -}}
```

### Step 6: Verify locally

Run: `hugo server -D`
Expected: Site builds without errors. All event icons display correctly on:

- Homepage event types grid (`/`)
- Events list page (`/events/`)
- Individual event pages (check icon in any event page)
- Workshops page (`/workshops/`)

Visually verify that icons render at the same sizes as before.

### Step 7: Commit

```bash
git add static/admin/config.yml content/events/ data/events.yaml data/workshops.yaml layouts/events/list.html layouts/partials/event-types.html layouts/page/workshops.html
git commit -m "feat(cms): convert event icon from select to image widget with full paths"
```

---

## Task 4: Add CMS-managed venue gallery with ordering and alt text

This task replaces the auto-discovery gallery (`resources.Match "images/venue/*"`) with a CMS-managed list in the venue gallery singleton.

**Files:**

- Modify: `static/admin/config.yml:686-697` (venue_gallery singleton)
- Modify: `data/venue_gallery.yaml` (add images list with current venue photos)
- Modify: `layouts/partials/venue-gallery.html:13-37` (replace auto-discovery with data-driven loop)

### Step 1: Update the CMS config to add images list widget

In `static/admin/config.yml`, find the venue_gallery singleton (line 686-697):

```yaml
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
        hint: 'Displayed below the gallery carousel.'
```

Replace the `fields` section:

```yaml
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
        hint: 'Displayed below the gallery carousel.'
      - label: Gallery Images
        name: images
        widget: list
        label_singular: Image
        summary: '{{fields.alt}}'
        fields:
          - label: Image
            name: src
            widget: image
            media_folder: /static/images/venue
            public_folder: images/venue
          - label: Alt Text
            name: alt
            widget: string
            hint: 'Describe what is shown in this venue photo for accessibility.'
```

### Step 2: Populate data/venue_gallery.yaml with existing images

Replace the contents of `data/venue_gallery.yaml` with the current images in display order, adding descriptive alt text:

```yaml
# Venue gallery section content for homepage
# Edit this file or use the CMS to manage gallery images, order, and alt text.

heading: "OUR VENUE"
subtext: "Want to see more? Follow us on Instagram."

images:
  - src: "images/venue/venue-01-interior.jpeg"
    alt: "Pike & West interior gallery space with artwork on walls and elegant lighting"
  - src: "images/venue/venue-02-foyer.png"
    alt: "Pike & West foyer entrance with welcoming decor"
  - src: "images/venue/venue-03-lower-patio.jpg"
    alt: "Lower patio outdoor space at Pike & West"
  - src: "images/venue/venue-04-wedding.jpg"
    alt: "Wedding reception setup at Pike & West with decorated tables"
  - src: "images/venue/venue-05-dancefloor.jpg"
    alt: "Open dancefloor area at Pike & West venue"
  - src: "images/venue/venue-06-soft-seating.jpg"
    alt: "Soft seating lounge area with elegant event setup"
  - src: "images/venue/venue-07-bar.jpg"
    alt: "Bar area at Pike & West venue"
  - src: "images/venue/venue-08-disco-background.jpg"
    alt: "Pike & West venue with disco ball ambient lighting"
  - src: "images/venue/venue-09-table-chairs.png"
    alt: "Table and chairs arrangement for seated event"
  - src: "images/venue/venue-10-seating-area.png"
    alt: "Additional seating area at Pike & West"
```

### Step 3: Update the venue gallery template

In `layouts/partials/venue-gallery.html`, replace the auto-discovery block (lines 13-37) with a data-driven loop:

Replace:

```go-html-template
      <ul class="venue-gallery__track" id="gallery-track" role="list">
        {{- $images := resources.Match "images/venue/*" -}}
        {{- range $index, $image := $images -}}
          {{- /* Generate WebP and JPEG versions */ -}}
          {{- $thumbWebp := $image.Resize "600x webp q85" -}}
          {{- $thumbJpg := $image.Resize "600x jpg q85" -}}
          {{- $fullWebp := $image.Resize "1600x webp q90" -}}
          {{- $fullJpg := $image.Resize "1600x jpg q90" -}}
        <li class="venue-gallery__slide" data-index="{{ $index }}">
          <picture>
            <source type="image/webp" srcset="{{ $thumbWebp.RelPermalink }}">
            <img
              src="{{ $thumbJpg.RelPermalink }}"
              alt="Pike & West venue photo {{ add $index 1 }}"
              class="venue-gallery__image"
              width="{{ $thumbJpg.Width }}"
              height="{{ $thumbJpg.Height }}"
              loading="lazy"
              decoding="async"
              data-full="{{ $fullJpg.RelPermalink }}"
              data-full-webp="{{ $fullWebp.RelPermalink }}"
            >
          </picture>
        </li>
        {{- end -}}
      </ul>
```

With:

```go-html-template
      <ul class="venue-gallery__track" id="gallery-track" role="list">
        {{- range $index, $item := site.Data.venue_gallery.images -}}
          {{- $image := resources.Get $item.src -}}
          {{- if $image -}}
          {{- /* Generate WebP and JPEG versions */ -}}
          {{- $thumbWebp := $image.Resize "600x webp q85" -}}
          {{- $thumbJpg := $image.Resize "600x jpg q85" -}}
          {{- $fullWebp := $image.Resize "1600x webp q90" -}}
          {{- $fullJpg := $image.Resize "1600x jpg q90" -}}
        <li class="venue-gallery__slide" data-index="{{ $index }}">
          <picture>
            <source type="image/webp" srcset="{{ $thumbWebp.RelPermalink }}">
            <img
              src="{{ $thumbJpg.RelPermalink }}"
              alt="{{ $item.alt }}"
              class="venue-gallery__image"
              width="{{ $thumbJpg.Width }}"
              height="{{ $thumbJpg.Height }}"
              loading="lazy"
              decoding="async"
              data-full="{{ $fullJpg.RelPermalink }}"
              data-full-webp="{{ $fullWebp.RelPermalink }}"
            >
          </picture>
        </li>
          {{- end -}}
        {{- end -}}
      </ul>
```

Key changes:

- `resources.Match "images/venue/*"` replaced with `range site.Data.venue_gallery.images`
- `resources.Get $item.src` for each image from the data file
- `$item.alt` for CMS-managed alt text instead of generic `"Pike & West venue photo N"`
- Added `if $image` guard to handle missing images gracefully

### Step 4: Verify locally

Run: `hugo server -D`
Expected: Site builds without errors. Homepage venue gallery displays all 10 images in the same order as before, but now with descriptive alt text. Verify:

- All 10 images render in the carousel
- Lightbox still works (click an image to open full-size)
- Scroll arrows still work
- Image order matches the YAML file order

### Step 5: Commit

```bash
git add static/admin/config.yml data/venue_gallery.yaml layouts/partials/venue-gallery.html
git commit -m "feat(cms): add CMS-managed venue gallery with ordering and alt text"
```

---

## Task 5: Fix blog list hero image to read from front matter

**Files:**

- Modify: `layouts/blog/list.html:2-7`

**Why:** The blog list template hardcodes `resources.Get "images/venue/venue-06-soft-seating.jpg"` instead of reading `.Params.image`. The CMS has a Hero Image field on the blog `index_file`, but the template ignores it.

### Step 1: Update the blog list hero image lookup

In `layouts/blog/list.html`, replace lines 2-7:

```go-html-template
{{/* Blog Hero */}}
{{ $heroImage := resources.Get "images/venue/venue-06-soft-seating.jpg" }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}
```

With:

```go-html-template
{{/* Blog Hero - reads from front matter, falls back to default */}}
{{ $heroPath := .Params.image | default "images/venue/venue-06-soft-seating.jpg" }}
{{ $heroImage := resources.Get $heroPath }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}
```

This reads the `image` field from `content/blog/_index.md` front matter, falling back to the current default if the field is empty.

### Step 2: Verify the front matter path works

The blog `_index.md` currently has `image: "images/venue/venue-06-soft-seating.jpg"`. This path works with `resources.Get` because of the Hugo module mount.

Run: `hugo server -D`
Expected: Blog list page (`/blog/`) displays the same hero image as before. The visual output is identical.

### Step 3: Test with a different image

Temporarily change the `image` field in `content/blog/_index.md` to another venue photo:

```yaml
image: "images/venue/venue-04-wedding.jpg"
```

Verify the blog hero changes to the wedding photo. Then revert back to the original value.

### Step 4: Commit

```bash
git add layouts/blog/list.html
git commit -m "fix: blog list hero reads from front matter instead of hardcoded path"
```

---

## Verification Checklist

After all tasks are complete, verify end-to-end:

- [ ] `hugo server -D` builds without errors or warnings
- [ ] Homepage: venue gallery displays all 10 images with proper alt text
- [ ] Homepage: event types grid displays all 6 icons correctly
- [ ] Blog list page: hero image displays correctly
- [ ] Events list page: all event icons display correctly
- [ ] Workshops page: feature icons display correctly
- [ ] Individual event pages: hero images display correctly
- [ ] CMS admin (`/admin/`): blog post Featured Image shows Entry Assets tab
- [ ] CMS admin: events collection shows Collection Assets tab with venue photos
- [ ] CMS admin: event icon field shows Field Assets tab with icons folder
- [ ] CMS admin: venue gallery singleton shows image list with reorder capability
