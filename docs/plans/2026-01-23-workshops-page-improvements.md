# Workshops Page Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve the workshops page with art-themed icons, Event schema markup, warm/inviting copy, and content index tracking.

**Architecture:** Update data files for copy and icons, add JSON-LD schema to template, extend content index with new entry and persona definition. Icons will be AI-generated hand-drawn style illustrations.

**Tech Stack:** Hugo templates, YAML data files, JSON-LD structured data, PNG icons

---

## Task 1: Generate AI Icons

**Files:**

- Create: `assets/images/icons/icon-palette.png`
- Create: `assets/images/icons/icon-instructor.png`
- Create: `assets/images/icons/icon-supplies.png`

**Step 1: Generate palette icon**

Use an AI image generation tool to create:

- Subject: Artist palette with brushes
- Style: Hand-drawn, whimsical line art illustration
- Color: Single color - gold (#aa6e0b) or black (#434345) on transparent background
- Size: 512x512px PNG (will be resized by Hugo)

Save to: `assets/images/icons/icon-palette.png`

**Step 2: Generate instructor icon**

Use an AI image generation tool to create:

- Subject: Teacher at easel (person demonstrating painting)
- Style: Hand-drawn, whimsical line art illustration
- Color: Single color - gold (#aa6e0b) or black (#434345) on transparent background
- Size: 512x512px PNG

Save to: `assets/images/icons/icon-instructor.png`

**Step 3: Generate supplies icon**

Use an AI image generation tool to create:

- Subject: Art supplies (brushes, paint tubes, scissors arranged together)
- Style: Hand-drawn, whimsical line art illustration
- Color: Single color - gold (#aa6e0b) or black (#434345) on transparent background
- Size: 512x512px PNG

Save to: `assets/images/icons/icon-supplies.png`

**Step 4: Verify icons exist**

Run: `ls -la assets/images/icons/icon-*.png`

Expected: Three new icon files listed with reasonable file sizes (10-100KB each)

**Step 5: Commit icons**

```bash
git add assets/images/icons/icon-palette.png assets/images/icons/icon-instructor.png assets/images/icons/icon-supplies.png
git commit -m "feat(workshops): add hand-drawn art-themed icons"
```

---

## Task 2: Update Workshops Data File

**Files:**

- Modify: `data/workshops.yaml`

**Step 1: Update intro copy**

Replace the `intro` section in `data/workshops.yaml`:

```yaml
intro:
  title: "Join Us for Hands-On Creativity"
  paragraphs:
    - "Whether you've never held a paintbrush or you're a seasoned artist, our workshops welcome you to slow down, get creative, and connect with others who share your curiosity. In our gallery setting, surrounded by inspiring art, you'll discover what your hands can create."
    - "No experience needed—just an open mind. We provide all the materials, and you'll take home your own original piece to treasure or share."
```

**Step 2: Update features with new icons and descriptions**

Replace the `features` section in `data/workshops.yaml`:

```yaml
features:
  - icon: "icon-palette.png"
    title: "Social Atmosphere"
    description: "Create alongside fellow art enthusiasts in our elegant venue. Meet new friends over shared creativity in an intimate, supportive setting."
  - icon: "icon-instructor.png"
    title: "Expert Instruction"
    description: "Learn from talented local artists and instructors. Our instructors guide you step by step, so you'll feel confident from your first brushstroke."
  - icon: "icon-supplies.png"
    title: "All Materials Included"
    description: "Everything you need is provided—just bring yourself. Canvas, paints, brushes, aprons—we've got it covered. Just show up ready to create."
```

**Step 3: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/workshops.yaml'))"`

Expected: No output (successful parse, no errors)

**Step 4: Build and verify**

Run: `hugo --gc`

Expected: Build completes without errors

**Step 5: Commit data changes**

```bash
git add data/workshops.yaml
git commit -m "feat(workshops): update copy to warm/inviting tone and art-themed icons"
```

---

## Task 3: Add Event Schema Markup

**Files:**

- Modify: `layouts/page/workshops.html`

**Step 1: Add JSON-LD schema to template**

Add the following block after `{{ define "main" }}` and before the first `<section>`:

```go-html-template
{{/* Event Schema for SEO */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Creative Workshops at Pike & West",
  "description": "{{ .Description }}",
  "image": "{{ (resources.Get "images/hero/venue-exterior.jpg").Permalink }}",
  "location": {
    "@type": "Place",
    "name": "Pike & West",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2277 West Street",
      "addressLocality": "Germantown",
      "addressRegion": "TN",
      "postalCode": "38138",
      "addressCountry": "US"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Pike & West",
    "url": "{{ .Site.BaseURL }}"
  },
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "offers": {
    "@type": "Offer",
    "url": "{{ .Site.Params.ticketTailor.fallbackUrl }}",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

**Step 2: Build and verify**

Run: `hugo --gc`

Expected: Build completes without errors

**Step 3: Validate JSON-LD output**

Run: `grep -A 30 "application/ld+json" public/workshops/index.html | head -35`

Expected: JSON-LD block appears with Event schema, properly formatted

**Step 4: Commit schema changes**

```bash
git add layouts/page/workshops.html
git commit -m "feat(workshops): add Event schema markup for SEO"
```

---

## Task 4: Add Individual Persona to Content Index

**Files:**

- Modify: `data/content-index.yaml:16-42` (definitions.personas section)

**Step 1: Add individual persona definition**

Add the following entry to the `definitions.personas` section in `data/content-index.yaml`, after the `artist` persona:

```yaml
    workshop-attendee:
      name: Workshop Attendee
      description: Individual looking to attend creative workshops for personal enrichment
```

**Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/content-index.yaml'))"`

Expected: No output (successful parse)

**Step 3: Commit persona definition**

```bash
git add data/content-index.yaml
git commit -m "feat(content-index): add workshop-attendee persona definition"
```

---

## Task 5: Add Workshops Page to Content Index

**Files:**

- Modify: `data/content-index.yaml` (add to pages section, after `/events` entry around line 1629)

**Step 1: Add /workshops page entry**

Add the following entry to the `pages` section in `data/content-index.yaml`:

```yaml
  /workshops:
    title: "Workshops | Pike & West Creative Events in Germantown, TN"
    type: static-page
    status: published
    primary_keyword: creative workshops Germantown TN
    secondary_keywords:
      - art classes Memphis area
      - paint and sip Germantown
      - art workshops near me
    search_intent: commercial
    keyword_difficulty: medium
    topic_summary: >
      Creative workshops landing page featuring painting, pottery, and mixed media
      classes with Ticket Tailor integration for booking.
    cluster: null
    funnel_stage: mofu
    content_goal: leads
    entities:
      - Pike & West
      - Germantown
      - Memphis
    personas:
      - workshop-attendee
    personas_primary: workshop-attendee
    event_types: []
    event_types_primary: null
    word_count: 150
    target_word_count: 400
    evergreen: true
    seasonal_relevance: []
    cta_type: ticket-purchase
    cta_destination: https://tix.pikeandwest.com/all-tickets/pw/
    shortcodes:
      pull-quote: 0
      divider: 0
      tip: 0
      fact-box: 0
      timeline: 0
      sidebar-quote: 0
      numbered-list: 0
      standfirst: 0
      kicker: 0
      key-takeaways: 0
    shortcodes_recommended: []
    drop_cap: false
    has_cta: true
    images:
      count: 3
      hero_image: false
      all_have_alt: true
      images_list:
        - images/icons/icon-palette.png
        - images/icons/icon-instructor.png
        - images/icons/icon-supplies.png
    links_out:
      - /contact/
    links_in: []
    links_recommended:
      - /contact
      - /about
    orphan: false
    author: ""
    created: "2026-01-23"
    last_modified: "2026-01-23"
    last_audited: null
    next_review: null
    audit_score: 0
    audit_scores:
      seo: 0
      brand_voice: 0
      editorial: 0
      freshness: 0
      technical: 0
    issues_count: 0
```

**Step 2: Update meta stats**

Update the `meta.stats` section at the top of the file:

- Increment `total_pages` by 1 (20 → 21)
- Increment `static_pages` by 1 (8 → 9)

**Step 3: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/content-index.yaml'))"`

Expected: No output (successful parse)

**Step 4: Commit content index entry**

```bash
git add data/content-index.yaml
git commit -m "feat(content-index): add /workshops page entry"
```

---

## Task 6: Final Build Verification

**Files:**

- None (verification only)

**Step 1: Clean build**

Run: `hugo --gc --minify`

Expected: Build completes without errors or warnings

**Step 2: Start dev server and verify visually**

Run: `hugo server -D`

Then open: `http://localhost:1313/workshops/`

Verify:

- [ ] New icons display correctly (palette, instructor, supplies)
- [ ] Updated copy appears in intro section
- [ ] Feature descriptions show expanded text
- [ ] Ticket Tailor widget section loads

**Step 3: Verify schema in page source**

View source of `/workshops/` page and search for "application/ld+json"

Verify:

- [ ] Event schema block present
- [ ] Location shows correct address
- [ ] Ticket URL is correct

**Step 4: Run linting**

Run: `npm run lint` (if available) or `hugo --templateMetrics`

Expected: No errors

---

## Summary

| Task | Description               | Commit Message                                                            |
|------|---------------------------|---------------------------------------------------------------------------|
| 1    | Generate AI icons         | `feat(workshops): add hand-drawn art-themed icons`                        |
| 2    | Update workshops data     | `feat(workshops): update copy to warm/inviting tone and art-themed icons` |
| 3    | Add Event schema          | `feat(workshops): add Event schema markup for SEO`                        |
| 4    | Add persona definition    | `feat(content-index): add workshop-attendee persona definition`           |
| 5    | Add page to content index | `feat(content-index): add /workshops page entry`                          |
| 6    | Final verification        | (no commit)                                                               |

**Total commits:** 5
**Estimated tasks:** 6 (Task 1 requires manual AI generation step)
