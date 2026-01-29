# Granular Blog Categories Taxonomy

> **Status:** PLANNING
> **Created:** 2026-01-29
> **Goal:** Expand blog categories to be specific and granular (Bar Mitzvah, Quinceañera, Daddy Daughter Dances, Prom Send-Offs, etc.), redesign category pages to match events page styling, and link event pages to their related category pages.

## Design Summary

### Core Insight

People don't host "private parties" or "celebrations" - they host **specific occasions**. The taxonomy should reflect how people actually search and think about their events.

### Architecture

```text
/events/weddings/           → Venue rental info for weddings
    ↓ links to
/categories/weddings/       → All wedding-related blog posts

/events/private-parties/    → Catch-all venue page (may be deprecated)
    ↓ links to multiple categories
/categories/bar-mitzvah/    → Bar Mitzvah blog posts
/categories/quinceañera/    → Quinceañera blog posts
/categories/prom-send-offs/ → Prom send-off blog posts
```

### New Category Taxonomy (Granular)

| Category                | Slug                      | Replaces/Adds                           |
|-------------------------|---------------------------|-----------------------------------------|
| Weddings                | `weddings`                | Keep                                    |
| Corporate Events        | `corporate-events`        | Keep                                    |
| Birthdays               | `birthdays`               | Keep (covers milestone, sweet 16, 50th) |
| Baby Showers            | `baby-showers`            | Keep                                    |
| Anniversaries           | `anniversaries`           | Keep                                    |
| Graduations             | `graduations`             | Keep                                    |
| Bar Mitzvah             | `bar-mitzvah`             | **NEW**                                 |
| Bat Mitzvah             | `bat-mitzvah`             | **NEW**                                 |
| Quinceañera             | `quinceanera`             | **NEW** (from Dance Events)             |
| Daddy Daughter Dances   | `daddy-daughter-dances`   | **NEW** (from Dance Events)             |
| Prom Send-Offs          | `prom-send-offs`          | **NEW** (from Dance Events)             |
| Holiday Parties         | `holiday-parties`         | **NEW** (from Private Parties)          |
| Engagement Parties      | `engagement-parties`      | **NEW** (from Private Parties)          |
| Retirement Celebrations | `retirement-celebrations` | **NEW** (from Private Parties)          |
| Family Reunions         | `family-reunions`         | **NEW** (from Private Parties)          |

**Removed:**

- `Celebrations` (too generic - replaced by specific categories)
- `News` (meta category - can use tags instead, or keep if needed for announcements)

**Total: 15 categories** (up from 8)

---

## Implementation Tasks

### Phase 1: Update Taxonomy Configuration

#### Task 1.1: Update blog_taxonomy.yaml

**File:** `data/blog_taxonomy.yaml`

**Changes:**

- Replace current 8 categories with new 15-category list
- Add comments grouping categories by type
- Keep existing tags (they complement categories)

**New content:**

```yaml
# Blog Taxonomy Reference
# Categories are SPECIFIC EVENT TYPES for granular SEO and content discovery.
# Tags describe content format and cross-cutting topics.

categories:
  # Wedding & Relationship
  - Weddings
  - Engagement Parties
  - Anniversaries

  # Coming of Age / Milestones
  - Bar Mitzvah
  - Bat Mitzvah
  - Quinceañera
  - Graduations
  - Birthdays

  # Baby & Family
  - Baby Showers
  - Family Reunions

  # Youth & Teen Events
  - Daddy Daughter Dances
  - Prom Send-Offs

  # Professional & Social
  - Corporate Events
  - Holiday Parties
  - Retirement Celebrations

tags:
  # (keep existing tags unchanged)
```

**Verification:**

```bash
python3 -c "import yaml; yaml.safe_load(open('data/blog_taxonomy.yaml'))" && echo "Valid YAML"
```

---

#### Task 1.2: Update Sveltia CMS config.yml

**File:** `static/admin/config.yml` (lines ~134-147)

**Changes:**

- Update categories widget options to match new taxonomy
- Group options with comments for CMS editor clarity

**Find:**

```yaml
      - label: Category
        name: categories
        widget: select
        multiple: false
        options:
          - Weddings
          - Corporate Events
          - Birthdays
          - Baby Showers
          - Anniversaries
          - Graduations
          - Celebrations
          - News
        hint: 'Event type this content is about. Select exactly 1.'
```

**Replace with:**

```yaml
      - label: Category
        name: categories
        widget: select
        multiple: false
        options:
          # Wedding & Relationship
          - Weddings
          - Engagement Parties
          - Anniversaries
          # Coming of Age / Milestones
          - Bar Mitzvah
          - Bat Mitzvah
          - Quinceañera
          - Graduations
          - Birthdays
          # Baby & Family
          - Baby Showers
          - Family Reunions
          # Youth & Teen Events
          - Daddy Daughter Dances
          - Prom Send-Offs
          # Professional & Social
          - Corporate Events
          - Holiday Parties
          - Retirement Celebrations
        hint: 'Specific event type. Choose the most precise category.'
```

**Verification:**

```bash
hugo --quiet && echo "Build passed"
```

---

#### Task 1.3: Update existing blog posts with new categories

**Files:** `content/blog/*/index.md` (7 files)

**Mapping for existing posts:**

| Post                               | Current Category | New Category      | Action                  |
|------------------------------------|------------------|-------------------|-------------------------|
| welcome-to-pike-and-west           | News             | (remove or keep?) | TBD - discuss with user |
| valentines-day-love-in-all-forms   | Celebrations     | Holiday Parties   | Update                  |
| corporate-event-planning-tips-2026 | Corporate Events | Corporate Events  | Keep                    |
| fall-baby-shower-inspiration       | Baby Showers     | Baby Showers      | Keep                    |
| holiday-anniversary-celebrations   | Anniversaries    | Anniversaries     | Keep                    |
| milestone-birthday-new-year        | Birthdays        | Birthdays         | Keep                    |
| winter-birthday-celebration-guide  | Birthdays        | Birthdays         | Keep                    |

**Note:** Only 2 posts need category updates. The "News" post decision should be made by user.

---

### Phase 2: Redesign Category Page Styling

#### Task 2.1: Create new taxonomy.html template matching events list design

**File:** `layouts/_default/taxonomy.html`

**Current:** Basic card grid with title + post count
**Target:** Match `layouts/events/list.html` design with:

- Icon support (optional, can default)
- Better card styling with hover effects
- Intro text area
- CTA section at bottom

**New template:**

```html
{{/*
  Purpose: Display list of all terms in a taxonomy (categories/tags)
  Context: Taxonomy page (e.g., /categories/)
  Design: Matches events list page styling
*/}}
{{ define "main" }}

{{/* Hero Section */}}
{{ $heroImage := resources.Get "images/venue/venue-06-soft-seating.jpg" }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x webp q85").RelPermalink }}
{{ end }}

<section class="page-hero" style="background-image: url('{{ $heroBg }}');">
  <div class="page-hero__content">
    <h1 class="page-hero__title">{{ .Title }}</h1>
  </div>
</section>

{{/* Breadcrumb */}}
{{ partial "breadcrumb.html" (dict "Page" . "accentBar" true) }}

{{/* Category Grid - Events List Style */}}
<section class="events-list section">
  <div class="container">
    <div class="events-list__intro content">
      <p>Explore our blog posts by event type. Find inspiration, planning tips, and real celebrations for your next occasion.</p>
    </div>

    {{ if .Pages }}
    <div class="events-list__grid">
      {{ range .Pages.ByTitle }}
      {{ $categoryData := index site.Data.category_meta .Title }}
      <a href="{{ .RelPermalink }}" class="events-list__card">
        {{ with $categoryData.icon }}
        {{ $icon := resources.Get . }}
        {{ if $icon }}
        <div class="events-list__icon">
          <img src="{{ $icon.RelPermalink }}" alt="" width="48" height="48" loading="lazy" />
        </div>
        {{ end }}
        {{ end }}
        <h2 class="events-list__title">{{ .Title }}</h2>
        <p class="events-list__excerpt">{{ len .Pages }} {{ if eq (len .Pages) 1 }}post{{ else }}posts{{ end }}</p>
        <span class="events-list__link">View Posts</span>
      </a>
      {{ end }}
    </div>
    {{ else }}
    <p class="events-list__empty">No categories found.</p>
    {{ end }}

    {{/* CTA */}}
    <div class="events-list__cta">
      <p>Planning an event? We'd love to help.</p>
      <a href="/contact/" class="btn btn-primary">Book a Tour</a>
    </div>
  </div>
</section>
{{ end }}
```

**Note:** This reuses the existing `.events-list` SCSS classes - no new CSS needed.

---

#### Task 2.2: Create category metadata data file

**File:** `data/category_meta.yaml` (NEW)

**Purpose:** Store icons and descriptions for each category (used by taxonomy template)

```yaml
# Category metadata for taxonomy pages
# Icons should exist in static/images/icons/

Weddings:
  icon: /images/icons/icon-wedding-rings.png
  description: Wedding planning inspiration and real celebrations

Engagement Parties:
  icon: /images/icons/icon-champagne.png
  description: Engagement celebration ideas and planning tips

Anniversaries:
  icon: /images/icons/icon-champagne.png
  description: Anniversary celebration inspiration

Bar Mitzvah:
  icon: /images/icons/icon-star.png
  description: Bar Mitzvah celebration planning and inspiration

Bat Mitzvah:
  icon: /images/icons/icon-star.png
  description: Bat Mitzvah celebration planning and inspiration

Quinceañera:
  icon: /images/icons/icon-crown.png
  description: Quinceañera celebration planning and inspiration

Graduations:
  icon: /images/icons/icon-graduation.png
  description: Graduation party planning and celebration ideas

Birthdays:
  icon: /images/icons/icon-cake.png
  description: Birthday party inspiration for all ages

Baby Showers:
  icon: /images/icons/icon-baby.png
  description: Baby shower planning and celebration ideas

Family Reunions:
  icon: /images/icons/icon-family.png
  description: Family reunion planning and venue inspiration

Daddy Daughter Dances:
  icon: /images/icons/icon-dance.png
  description: Daddy daughter dance event planning

Prom Send-Offs:
  icon: /images/icons/icon-prom.png
  description: Prom send-off party ideas and inspiration

Corporate Events:
  icon: /images/icons/icon-briefcase.png
  description: Corporate event planning and team building ideas

Holiday Parties:
  icon: /images/icons/icon-holiday.png
  description: Holiday party planning and seasonal celebration ideas

Retirement Celebrations:
  icon: /images/icons/icon-champagne.png
  description: Retirement party planning and celebration inspiration
```

---

#### Task 2.3: Create/source missing icons

**Directory:** `static/images/icons/`

**Existing icons (from events pages):**

- `icon-wedding-rings.png`
- `icon-champagne.png`
- `icon-cake.png` (need to verify)
- `icon-baby.png` (need to verify)
- `icon-briefcase.png` (need to verify)
- `icon-disco-ball.png`

**New icons needed:**

- `icon-star.png` (Bar/Bat Mitzvah)
- `icon-crown.png` (Quinceañera)
- `icon-graduation.png` (Graduations)
- `icon-family.png` (Family Reunions)
- `icon-dance.png` (Daddy Daughter Dances)
- `icon-prom.png` (Prom Send-Offs)
- `icon-holiday.png` (Holiday Parties)

**Options:**

1. Use existing similar icons temporarily
2. Source from same icon set as current icons
3. Use SVG icons from Heroicons or similar

---

### Phase 3: Link Event Pages to Category Pages

#### Task 3.1: Add category links to event pages

**Files:** `content/events/*.md` (6 files)

**Pattern:** Add a section at the bottom of each event page linking to related blog categories.

**Example for `content/events/weddings.md`:**

Add before the final CTA:

```markdown
### Wedding Inspiration from Our Blog

Browse our latest wedding-related posts for planning tips, real celebrations, and venue inspiration:

- [Wedding Posts](/categories/weddings/)
- [Engagement Party Ideas](/categories/engagement-parties/)
```

**Example for `content/events/private-parties.md`:**

```markdown
### Celebration Inspiration from Our Blog

Find ideas for your specific celebration:

- [Anniversary Celebrations](/categories/anniversaries/)
- [Birthday Party Ideas](/categories/birthdays/)
- [Retirement Celebrations](/categories/retirement-celebrations/)
- [Family Reunions](/categories/family-reunions/)
- [Holiday Parties](/categories/holiday-parties/)
```

**Example for `content/events/dance-events.md`:**

```markdown
### Dance Event Inspiration

- [Quinceañera Ideas](/categories/quinceanera/)
- [Daddy Daughter Dances](/categories/daddy-daughter-dances/)
- [Prom Send-Offs](/categories/prom-send-offs/)
```

---

#### Task 3.2: Update term.html template for better single-category pages

**File:** `layouts/_default/term.html`

**Changes:**

- Add breadcrumb navigation
- Add intro text from category_meta.yaml
- Add link back to related event page (if applicable)
- Match overall site styling better

---

### Phase 4: Update Documentation

#### Task 4.1: Update CLAUDE.md taxonomy section

**File:** `CLAUDE.md`

**Changes:**

- Update the category table with new 15 categories
- Add note about granular category philosophy
- Update examples

---

#### Task 4.2: Update blog-editor agent

**File:** `.claude/agents/blog-editor.md`

**Changes:**

- Update Category Selection Guide with new categories
- Add guidance on choosing specific vs. general categories

---

## Open Questions for User

Before finalizing the plan:

1. **"News" category** - Remove entirely, or keep for announcements?
   - Current post: `welcome-to-pike-and-west`
   - Options: (a) Keep News, (b) Remove and re-categorize post, (c) Use tags instead

2. **Icons** - Source new icons or use placeholders?
   - Need ~7 new icons for new categories
   - Can use existing similar icons temporarily

3. **Event page consolidation** - Should "Dance Events" and "Private Parties" pages remain as catch-alls linking to specific categories, or be deprecated/redirected?

---

## Success Criteria

- [ ] 15 categories defined in `blog_taxonomy.yaml`
- [ ] CMS config updated with same categories
- [ ] Existing blog posts use valid categories
- [ ] Category page (`/categories/`) uses events-list styling
- [ ] Category metadata file provides icons/descriptions
- [ ] Event pages link to related category pages
- [ ] Hugo builds successfully
- [ ] No broken links

---

## Rollback Plan

If issues arise:

```bash
git revert HEAD~N  # Revert commits from this plan
```

All changes are additive to templates/data files, so rollback is straightforward.
