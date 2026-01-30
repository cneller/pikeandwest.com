# Accessibility & Schema Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix critical accessibility and schema issues: add missing image alt text to 15 category pages, enforce required fields in CMS, add BlogPosting schema fallback image, and remove inaccurate opening hours from EventVenue schema.

**Architecture:** Content-first approach — fix existing content files first, then update CMS validation to prevent future issues, then fix schema templates. All changes are additive or corrective; no breaking changes.

**Tech Stack:** Hugo (content files), YAML (CMS config), Go templates (structured data)

---

## Task 1: Add image_alt to Anniversaries Category

**Files:**

- Modify: `content/categories/anniversaries/_index.md`

**Step 1: Edit the file to add image_alt field**

Add `image_alt` field after `image` in the front matter:

```yaml
---
title: "Anniversaries"
image: "/images/categories/anniversaries-1.jpg"
image_alt: "Elegant anniversary celebration table setting with gold accents and romantic floral centerpiece at Pike & West"
description: "Anniversary celebration ideas and romantic venue inspiration"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/anniversaries/_index.md`

Expected output:

```text
image: "/images/categories/anniversaries-1.jpg"
image_alt: "Elegant anniversary celebration table setting with gold accents and romantic floral centerpiece at Pike & West"
```

---

## Task 2: Add image_alt to Baby Showers Category

**Files:**

- Modify: `content/categories/baby-showers/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Baby Showers"
image: "/images/categories/baby-showers-1.jpg"
image_alt: "Beautifully decorated baby shower celebration with pastel balloons and gift table at Pike & West venue"
description: "Beautiful baby shower inspiration and planning guides"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/baby-showers/_index.md`

Expected: Shows `image_alt` line after `image` line.

---

## Task 3: Add image_alt to Bar Mitzvah Category

**Files:**

- Modify: `content/categories/bar-mitzvah/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Bar Mitzvah"
image: "/images/categories/bar-mitzvah-1.jpg"
image_alt: "Festive bar mitzvah celebration with traditional decorations and elegant venue setup at Pike & West"
description: "Bar Mitzvah celebration ideas and planning resources"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/bar-mitzvah/_index.md`

---

## Task 4: Add image_alt to Bat Mitzvah Category

**Files:**

- Modify: `content/categories/bat-mitzvah/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Bat Mitzvah"
image: "/images/categories/bat-mitzvah-1.jpg"
image_alt: "Elegant bat mitzvah celebration with beautiful decorations and sophisticated venue styling at Pike & West"
description: "Bat Mitzvah celebration ideas and planning resources"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/bat-mitzvah/_index.md`

---

## Task 5: Add image_alt to Birthdays Category

**Files:**

- Modify: `content/categories/birthdays/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Birthdays"
image: "/images/categories/birthdays-1.jpg"
image_alt: "Joyful birthday celebration with colorful decorations and festive atmosphere at Pike & West venue"
description: "Birthday party ideas from milestone celebrations to intimate gatherings"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/birthdays/_index.md`

---

## Task 6: Add image_alt to Corporate Events Category

**Files:**

- Modify: `content/categories/corporate-events/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Corporate Events"
image: "/images/categories/corporate-events-1.jpg"
image_alt: "Professional corporate event setup with modern styling and business atmosphere at Pike & West venue"
description: "Professional event planning for corporate gatherings and meetings"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/corporate-events/_index.md`

---

## Task 7: Add image_alt to Daddy Daughter Dances Category

**Files:**

- Modify: `content/categories/daddy-daughter-dances/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Daddy Daughter Dances"
image: "/images/categories/daddy-daughter-dances-1.jpg"
image_alt: "Heartwarming daddy daughter dance event with elegant venue decorations and dance floor at Pike & West"
description: "Memorable daddy daughter dance event ideas"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/daddy-daughter-dances/_index.md`

---

## Task 8: Add image_alt to Engagement Parties Category

**Files:**

- Modify: `content/categories/engagement-parties/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Engagement Parties"
image: "/images/categories/engagement-parties-1.jpg"
image_alt: "Romantic engagement party celebration with elegant decorations and intimate venue setting at Pike & West"
description: "Engagement party inspiration for newly betrothed couples"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/engagement-parties/_index.md`

---

## Task 9: Add image_alt to Family Reunions Category

**Files:**

- Modify: `content/categories/family-reunions/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Family Reunions"
image: "/images/categories/family-reunions-1.jpg"
image_alt: "Warm family reunion gathering with welcoming venue space and comfortable seating areas at Pike & West"
description: "Family reunion planning ideas and venue inspiration"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/family-reunions/_index.md`

---

## Task 10: Add image_alt to Graduations Category

**Files:**

- Modify: `content/categories/graduations/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Graduations"
image: "/images/categories/graduations-1.jpg"
image_alt: "Celebratory graduation party with festive decorations honoring academic achievement at Pike & West venue"
description: "Graduation party ideas for all educational milestones"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/graduations/_index.md`

---

## Task 11: Add image_alt to Holiday Parties Category

**Files:**

- Modify: `content/categories/holiday-parties/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Holiday Parties"
image: "/images/categories/holiday-parties-1.jpg"
image_alt: "Festive holiday party celebration with seasonal decorations and warm venue ambiance at Pike & West"
description: "Holiday celebration ideas throughout the year"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/holiday-parties/_index.md`

---

## Task 12: Add image_alt to Prom Send-Offs Category

**Files:**

- Modify: `content/categories/prom-send-offs/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Prom Send-Offs"
image: "/images/categories/prom-send-offs-1.jpg"
image_alt: "Elegant prom send-off gathering with photo opportunities and stylish venue backdrop at Pike & West"
description: "Prom send-off party inspiration and photo opportunities"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/prom-send-offs/_index.md`

---

## Task 13: Add image_alt to Quinceañera Category

**Files:**

- Modify: `content/categories/quinceanera/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Quinceañera"
slug: "quinceanera"
image: "/images/categories/quinceanera-1.jpg"
image_alt: "Beautiful quinceañera celebration with traditional decorations and elegant venue styling at Pike & West"
description: "Quinceañera celebration inspiration and planning tips"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/quinceanera/_index.md`

---

## Task 14: Add image_alt to Retirement Category

**Files:**

- Modify: `content/categories/retirement/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Retirement"
image: "/images/categories/retirement-1.jpg"
image_alt: "Dignified retirement celebration honoring career achievements with elegant venue setting at Pike & West"
description: "Retirement celebration ideas to honor career milestones"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/retirement/_index.md`

---

## Task 15: Add image_alt to Weddings Category

**Files:**

- Modify: `content/categories/weddings/_index.md`

**Step 1: Edit the file to add image_alt field**

```yaml
---
title: "Weddings"
image: "/images/categories/weddings-1.jpg"
image_alt: "Romantic wedding celebration with elegant floral arrangements and sophisticated venue decor at Pike & West"
description: "Wedding inspiration, planning tips, and real celebrations at Pike & West"
---
```

**Step 2: Verify the change**

Run: `grep -A1 "^image:" content/categories/weddings/_index.md`

---

## Task 16: Verify all category files have image_alt

**Step 1: Run verification command**

Run: `grep -L "image_alt" content/categories/*/_index.md`

Expected output: No files listed (empty output means all files have image_alt)

**Step 2: Count image_alt occurrences**

Run: `grep -c "image_alt" content/categories/*/_index.md | grep -v ":0$" | wc -l`

Expected output: `15` (all 15 category files have image_alt)

---

## Task 17: Add image_alt field to CMS categories schema

**Files:**

- Modify: `static/admin/config.yml:285-300`

**Step 1: Add image_alt field to categories collection**

Find the categories collection fields section (around line 285) and add the `image_alt` field after `image`:

Current (lines 285-300):

```yaml
    fields:
      - label: Title
        name: title
        widget: string
      - label: Image
        name: image
        widget: image
        required: false
        media_folder: /static/images/categories
        public_folder: /images/categories
        hint: 'Category card image. 800x600px recommended.'
      - label: Description
        name: description
        widget: text
        required: false
        hint: 'Brief description for SEO meta tags.'
```

Change to:

```yaml
    fields:
      - label: Title
        name: title
        widget: string
      - label: Image
        name: image
        widget: image
        required: false
        media_folder: /static/images/categories
        public_folder: /images/categories
        hint: 'Category card image. 800x600px recommended.'
      - label: Image Alt Text
        name: image_alt
        widget: string
        required: true
        hint: 'Describe the image for screen readers. Example: "Elegant wedding reception with floral centerpieces at Pike & West"'
      - label: Description
        name: description
        widget: text
        required: false
        hint: 'Brief description for SEO meta tags.'
```

**Step 2: Verify the change**

Run: `grep -A15 "name: categories" static/admin/config.yml | grep -A2 "image_alt"`

Expected: Shows `image_alt` field with `required: true`

---

## Task 18: Make blog index image_alt required in CMS

**Files:**

- Modify: `static/admin/config.yml:95-99`

**Step 1: Change blog index_file image_alt from required: false to required: true**

Find line 98 in the blog collection index_file section:

```yaml
          required: false
```

Change to:

```yaml
          required: true
```

**Step 2: Verify the change**

Run: `sed -n '95,100p' static/admin/config.yml`

Expected output shows `required: true` for the image_alt field.

---

## Task 19: Make events index_file image_alt required in CMS

**Files:**

- Modify: `static/admin/config.yml:206-210`

**Step 1: Change events index_file image_alt from required: false to required: true**

Find line 209 in the events collection index_file section:

```yaml
          required: false
```

Change to:

```yaml
          required: true
```

**Step 2: Verify the change**

Run: `sed -n '206,211p' static/admin/config.yml`

Expected output shows `required: true` for the image_alt field.

---

## Task 20: Make homepage image_alt required in CMS

**Files:**

- Modify: `static/admin/config.yml:353-357`

**Step 1: Change homepage image_alt from required: false to required: true**

Find around line 356 in the pages collection home file section:

```yaml
            required: false
```

Change to:

```yaml
            required: true
```

**Step 2: Verify the change**

Run: `grep -A20 "name: home" static/admin/config.yml | grep -A2 "image_alt"`

Expected: Shows `required: true` for image_alt.

---

## Task 21: Add fallback image to BlogPosting schema

**Files:**

- Modify: `layouts/partials/structured-data.html:182-195`

**Step 1: Update BlogPosting image section to include fallback**

Find the current image handling (lines 182-195):

```go-html-template
  {{- with .Params.image }}
  {{- $imageUrl := . }}
  {{- /* For page bundles, resolve relative image paths */}}
  {{- with $.Resources.GetMatch . }}
    {{- $imageUrl = .Permalink }}
  {{- else }}
    {{- $imageUrl = . | absURL }}
  {{- end }}
  ,"image": {
    "@type": "ImageObject",
    "url": "{{ $imageUrl }}",
    "caption": "{{ $.Params.image_alt | default $.Title }}"
  }
  {{- end }}
```

Replace with:

```go-html-template
  {{- $imageUrl := "" }}
  {{- $imageAlt := .Title }}
  {{- with .Params.image }}
    {{- /* For page bundles, resolve relative image paths */}}
    {{- with $.Resources.GetMatch . }}
      {{- $imageUrl = .Permalink }}
    {{- else }}
      {{- $imageUrl = . | absURL }}
    {{- end }}
    {{- $imageAlt = $.Params.image_alt | default $.Title }}
  {{- else }}
    {{- /* Fallback to default venue image when no featured image */}}
    {{- $imageUrl = "images/photos/venue-06-soft-seating.jpg" | absURL }}
    {{- $imageAlt = "Pike & West venue interior with elegant soft seating area" }}
  {{- end }}
  ,"image": {
    "@type": "ImageObject",
    "url": "{{ $imageUrl }}",
    "caption": "{{ $imageAlt }}"
  }
```

**Step 2: Verify the change**

Run: `grep -A5 "Fallback to default venue image" layouts/partials/structured-data.html`

Expected: Shows the fallback image URL and alt text.

---

## Task 22: Remove openingHoursSpecification from EventVenue schema

**Files:**

- Modify: `layouts/partials/structured-data.html:55-68`

**Step 1: Remove the inaccurate opening hours block**

Find and delete lines 55-68:

```go-html-template
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
```

The comma before `"sameAs"` on the next line should remain.

**Step 2: Verify the change**

Run: `grep -c "openingHoursSpecification" layouts/partials/structured-data.html`

Expected output: `0` (no occurrences)

---

## Task 23: Build site and verify no errors

**Step 1: Run Hugo build**

Run: `cd /Users/colinneller/Projects/pikeandwest.com && hugo --gc --minify`

Expected: Build completes without errors. Look for:

```text
                   | EN
-------------------+------
  Pages            |  XX
  Paginator pages  |   X
  Non-page files   |   X
  Static files     |  XX
  Processed images |   X
  Aliases          |   X
  Cleaned          |   X

Total in XXX ms
```

**Step 2: Verify structured data output**

Run: `grep -l "BlogPosting" public/blog/*/index.html | head -1 | xargs grep -o '"image":{[^}]*}'`

Expected: Shows image object with URL (either from post or fallback).

---

## Task 24: Commit all changes

**Step 1: Stage all modified files**

Run: `git add content/categories/ static/admin/config.yml layouts/partials/structured-data.html`

**Step 2: Verify staged files**

Run: `git status --short`

Expected output shows:

```text
M  content/categories/anniversaries/_index.md
M  content/categories/baby-showers/_index.md
M  content/categories/bar-mitzvah/_index.md
M  content/categories/bat-mitzvah/_index.md
M  content/categories/birthdays/_index.md
M  content/categories/corporate-events/_index.md
M  content/categories/daddy-daughter-dances/_index.md
M  content/categories/engagement-parties/_index.md
M  content/categories/family-reunions/_index.md
M  content/categories/graduations/_index.md
M  content/categories/holiday-parties/_index.md
M  content/categories/prom-send-offs/_index.md
M  content/categories/quinceanera/_index.md
M  content/categories/retirement/_index.md
M  content/categories/weddings/_index.md
M  layouts/partials/structured-data.html
M  static/admin/config.yml
```

**Step 3: Create commit**

Run:

```bash
git commit -m "$(cat <<'EOF'
fix(a11y): add missing image_alt to categories, enforce in CMS, fix schema

- Add image_alt front matter to all 15 category taxonomy pages
- Make image_alt required in CMS for categories, blog index, events index, homepage
- Add fallback image to BlogPosting schema when post has no featured image
- Remove inaccurate openingHoursSpecification from EventVenue schema
  (venue is appointment-only, not 24/7)

Fixes accessibility violations and improves SEO structured data accuracy.
EOF
)"
```

Expected: Commit succeeds with message shown.

---

## Summary

| Task  | Description                                         | File(s)                |
|-------|-----------------------------------------------------|------------------------|
| 1-15  | Add image_alt to each category                      | 15 `_index.md` files   |
| 16    | Verify all categories have image_alt                | verification           |
| 17    | Add image_alt field to CMS categories schema        | `config.yml`           |
| 18-20 | Make image_alt required in CMS for blog/events/home | `config.yml`           |
| 21    | Add fallback image to BlogPosting schema            | `structured-data.html` |
| 22    | Remove inaccurate opening hours                     | `structured-data.html` |
| 23    | Build and verify                                    | verification           |
| 24    | Commit all changes                                  | git                    |

**Total files modified:** 17 (15 content + 1 CMS config + 1 template)
