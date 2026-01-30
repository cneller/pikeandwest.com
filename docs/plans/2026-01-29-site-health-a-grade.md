# Site Health A Grade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve site health from C to A grade by fixing CMS schema errors, expanding category descriptions, and correcting image paths.

**Architecture:** Three logical commits targeting distinct issue types: (1) CMS config schema additions, (2) content SEO improvements via category descriptions, (3) image path fixes. No code changes—only YAML and Markdown edits.

**Tech Stack:** Hugo, Sveltia CMS (config.yml), Markdown front matter

---

## Task 1: Add Missing CMS Schema Fields

**Files:**

- Modify: `static/admin/config.yml:405-430` (contact page)
- Modify: `static/admin/config.yml:432-457` (workshops page)
- Modify: `static/admin/config.yml:619-640` (cta_banner singleton)
- Modify: `static/admin/config.yml:798-829` (error404 singleton)
- Modify: `data/cta_banner.yaml`

**Step 1: Add fields to Contact page schema**

In `static/admin/config.yml`, find the `pages/contact` file entry (around line 405). After the `body` field (line 430), add:

```yaml
          - label: OpenGraph Type
            name: og_type
            widget: select
            options: ['website', 'article']
            default: 'website'
            required: false
            hint: 'Type for social media previews'
          - label: Schema Configuration
            name: schema
            widget: object
            collapsed: true
            fields:
              - { label: Type, name: type, widget: string, default: 'ContactPage' }
              - { label: Main Entity, name: main_entity, widget: string, required: false }
          - label: Page Sections
            name: sections
            widget: object
            collapsed: true
            fields:
              - { label: Show Contact Form, name: contact_form, widget: boolean, default: true }
              - { label: Show Find Us Map, name: find_us, widget: boolean, default: true }
```

**Step 2: Add fields to Workshops page schema**

In `static/admin/config.yml`, find the `pages/workshops` file entry (around line 432). After the `body` field (line 457), add:

```yaml
          - label: Canonical URL
            name: canonical
            widget: string
            required: false
            hint: 'Override default URL if needed (e.g., /workshops/)'
          - label: Schema Type
            name: schema_type
            widget: select
            options: ['Event', 'WebPage', 'LocalBusiness']
            required: false
            hint: 'Structured data type for search engines'
```

**Step 3: Add image_alt to CTA Banner singleton**

In `static/admin/config.yml`, find the `singletons/cta_banner` entry (around line 619). After the `background_image` field (line 640), add:

```yaml
      - label: Image Alt Text
        name: image_alt
        widget: string
        required: false
        hint: 'Describe the background image for accessibility'
```

**Step 4: Add image_alt to Error 404 singleton**

In `static/admin/config.yml`, find the `singletons/error404` entry (around line 798). After the `background_image` field (line 828), add:

```yaml
      - label: Image Alt Text
        name: image_alt
        widget: string
        hint: 'Describe the background image for accessibility'
```

**Step 5: Add image_alt value to CTA Banner data file**

In `data/cta_banner.yaml`, add at the end:

```yaml
image_alt: "Pike & West venue interior with artistic disco lighting"
```

**Step 6: Validate CMS config syntax**

Run: `hugo server --disableFastRender`
Expected: Server starts without YAML errors

**Step 7: Commit CMS schema fixes**

```bash
git add static/admin/config.yml data/cta_banner.yaml
git commit -m "fix(cms): add missing schema fields for contact, workshops, cta banner, and 404"
```

---

## Task 2: Expand Category Descriptions (4 Main Categories)

**Files:**

- Modify: `content/categories/birthdays/_index.md`
- Modify: `content/categories/baby-showers/_index.md`
- Modify: `content/categories/corporate-events/_index.md`
- Modify: `content/categories/anniversaries/_index.md`

**Step 1: Update Birthdays category**

Replace the `description` field in `content/categories/birthdays/_index.md`:

```yaml
---
title: "Birthdays"
image: "/images/categories/birthdays-1.jpg"
description: "Birthday celebration ideas from milestone parties to intimate gatherings at Pike & West in Germantown, TN. Planning tips, themes, and inspiration for memorable birthdays of all ages at our gallery venue."
---
```

**Step 2: Update Baby Showers category**

Replace the `description` field in `content/categories/baby-showers/_index.md`:

```yaml
---
title: "Baby Showers"
image: "/images/categories/baby-showers-1.jpg"
description: "Beautiful baby shower inspiration and planning guides for celebrations at Pike & West. Discover themes, decor ideas, and venue tips for hosting an elegant shower in Germantown, TN."
---
```

**Step 3: Update Corporate Events category**

Replace the `description` field in `content/categories/corporate-events/_index.md`:

```yaml
---
title: "Corporate Events"
image: "/images/categories/corporate-events-1.jpg"
description: "Professional event planning for corporate gatherings, team building, and business meetings at Pike & West. Memphis-area venue with art gallery ambiance for distinguished company events in Germantown."
---
```

**Step 4: Update Anniversaries category**

Replace the `description` field in `content/categories/anniversaries/_index.md`:

```yaml
---
title: "Anniversaries"
image: "/images/categories/anniversaries-1.jpg"
description: "Anniversary celebration ideas and romantic venue inspiration at Pike & West gallery. Plan your milestone anniversary party in Germantown's premier art gallery and event space."
---
```

**Step 5: Commit main category updates**

```bash
git add content/categories/birthdays/_index.md content/categories/baby-showers/_index.md content/categories/corporate-events/_index.md content/categories/anniversaries/_index.md
git commit -m "content(seo): expand main category descriptions for search visibility"
```

---

## Task 3: Expand Category Descriptions (12 Templated Categories)

**Files:**

- Modify: `content/categories/bar-mitzvah/_index.md`
- Modify: `content/categories/bat-mitzvah/_index.md`
- Modify: `content/categories/daddy-daughter-dances/_index.md`
- Modify: `content/categories/engagement-parties/_index.md`
- Modify: `content/categories/family-reunions/_index.md`
- Modify: `content/categories/graduations/_index.md`
- Modify: `content/categories/holiday-parties/_index.md`
- Modify: `content/categories/prom-send-offs/_index.md`
- Modify: `content/categories/quinceanera/_index.md`
- Modify: `content/categories/retirement/_index.md`
- Modify: `content/categories/weddings/_index.md`
- Modify: `content/categories/_index.md`

**Template pattern:** `"[Event type] celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your [event] in our elegant art gallery venue near Memphis."`

**Step 1: Update Bar Mitzvah**

```yaml
description: "Bar Mitzvah celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your son's milestone in our elegant art gallery venue near Memphis."
```

**Step 2: Update Bat Mitzvah**

```yaml
description: "Bat Mitzvah celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your daughter's milestone in our elegant art gallery venue near Memphis."
```

**Step 3: Update Daddy-Daughter Dances**

```yaml
description: "Daddy-daughter dance ideas and planning inspiration at Pike & West in Germantown, TN. Host your special father-daughter event in our elegant art gallery venue near Memphis."
```

**Step 4: Update Engagement Parties**

```yaml
description: "Engagement party celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your engagement announcement in our elegant art gallery venue near Memphis."
```

**Step 5: Update Family Reunions**

```yaml
description: "Family reunion celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your family gathering in our elegant art gallery venue near Memphis."
```

**Step 6: Update Graduations**

```yaml
description: "Graduation celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your graduate's milestone party in our elegant art gallery venue near Memphis."
```

**Step 7: Update Holiday Parties**

```yaml
description: "Holiday party celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your seasonal gathering in our elegant art gallery venue near Memphis."
```

**Step 8: Update Prom Send-Offs**

```yaml
description: "Prom send-off celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your pre-prom photos and gathering in our elegant art gallery venue near Memphis."
```

**Step 9: Update Quinceañera**

```yaml
description: "Quinceañera celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your daughter's fifteenth birthday in our elegant art gallery venue near Memphis."
```

**Step 10: Update Retirement**

```yaml
description: "Retirement celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your retirement party in our elegant art gallery venue near Memphis."
```

**Step 11: Update Weddings**

```yaml
description: "Wedding celebration ideas and planning inspiration at Pike & West in Germantown, TN. Host your ceremony and reception in our elegant art gallery venue near Memphis."
```

**Step 12: Update Categories index**

In `content/categories/_index.md`, set or update description:

```yaml
description: "Browse event categories at Pike & West in Germantown, TN. Find inspiration for weddings, birthdays, corporate events, and celebrations at our art gallery venue near Memphis."
```

**Step 13: Commit templated category updates**

```bash
git add content/categories/
git commit -m "content(seo): expand templated category descriptions for search visibility"
```

---

## Task 4: Fix Image Paths

**Files:**

- Modify: `content/gallery-application.md:13`
- Modify: `content/events/_index.md:5`

**Step 1: Fix gallery-application og_image path**

In `content/gallery-application.md`, change line 13 from:

```yaml
og_image: "images/photos/venue-01-interior.jpeg"
```

To:

```yaml
og_image: "/images/photos/venue-01-interior.jpeg"
```

**Step 2: Add events index alt text**

In `content/events/_index.md`, change line 5 from:

```yaml
image_alt: ''
```

To:

```yaml
image_alt: "Pike & West gallery soft seating area for elegant events and celebrations"
```

**Step 3: Commit image path fixes**

```bash
git add content/gallery-application.md content/events/_index.md
git commit -m "fix(seo): correct image paths and add missing alt text"
```

---

## Task 5: Verify Site Health

**Step 1: Run Hugo build**

```bash
hugo --gc --minify
```

Expected: Build succeeds with no errors

**Step 2: Verify changes locally**

```bash
hugo server
```

- Check `/admin/` - CMS should load without errors
- Check `/categories/birthdays/` - Description should appear in page source meta tag
- Check `/gallery-application/` - og:image should have correct path in source

**Step 3: Run check:all (optional)**

If time permits, re-run `/check:all` to verify grade improvement.

---

## Summary

| Commit | Message                                                                           | Files |
|--------|-----------------------------------------------------------------------------------|-------|
| 1      | `fix(cms): add missing schema fields for contact, workshops, cta banner, and 404` | 2     |
| 2      | `content(seo): expand main category descriptions for search visibility`           | 4     |
| 3      | `content(seo): expand templated category descriptions for search visibility`      | 12    |
| 4      | `fix(seo): correct image paths and add missing alt text`                          | 2     |

**Expected Result:** Site health grade A (Config HEALTHY, SEO 85+, Editorial 88.6)
