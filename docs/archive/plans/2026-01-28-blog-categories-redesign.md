# Blog Categories Redesign Implementation Plan

> **Status: COMPLETED** - Implemented 2026-01-28

**Goal:** Align blog categories with personas and content strategy, ensuring consistency across CMS, taxonomy files, and the blog-editor agent.

**Architecture:** Categories should reflect event types that map to personas, not generic content types. This enables persona-targeted content planning and simplifies the mental model for content creators.

**Tech Stack:** Hugo taxonomies, Sveltia CMS config.yml, YAML data files, Markdown agent definitions

---

## Analysis: Why Current Categories Are Wrong

### Current State (5 categories in CMS)

| Category          | Problem                                                      |
|-------------------|--------------------------------------------------------------|
| News              | ✓ OK - Meta category for announcements                       |
| Weddings          | ✓ OK - Maps to wedding personas (bride, groom, planner)      |
| Corporate Events  | ✓ OK - Maps to corporate persona (Victoria)                  |
| Planning Tips     | ✗ Not an event type - describes content TYPE, not audience   |
| Behind the Scenes | ✗ Not an event type - describes content PILLAR, not audience |

### Actual Usage (7 posts)

| Category Used    | Times | In CMS Config? |
|------------------|-------|----------------|
| Corporate Events | 1     | ✓              |
| Baby Showers     | 1     | ✗              |
| Anniversaries    | 1     | ✗              |
| Birthdays        | 2     | ✗              |
| Planning Tips    | 1     | ✓              |
| News             | 1     | ✓              |

### The Core Problem

**Categories conflate two concepts:**

1. **Event Types** (audience-based): Weddings, Birthdays, Baby Showers, Corporate Events
2. **Content Pillars** (format-based): Planning Guides, Inspiration, Behind the Scenes, Local Expertise, Social Proof

The marketing strategy already defines **5 Content Pillars** (see `docs/marketing-strategy/README.md`). Categories should NOT duplicate these.

---

## Recommended Category Taxonomy

### Categories (Event-Type Based, Maps to Personas)

| Category         | Maps to Persona(s)                      | Event Type(s)                           |
|------------------|-----------------------------------------|-----------------------------------------|
| Weddings         | Bride, Groom, Wedding Planner           | wedding                                 |
| Corporate Events | Victoria (VP of Events)                 | corporate, holiday party, team building |
| Birthdays        | Michelle (Milestone Mom)                | birthday                                |
| Baby Showers     | Jasmine (Joyful Auntie)                 | baby-shower                             |
| Anniversaries    | Diana (Devoted Wife)                    | anniversary                             |
| Graduations      | Grace (Proud Graduate's Mom)            | graduation                              |
| Celebrations     | Host persona (private parties, general) | private-party                           |
| News             | All (meta category)                     | n/a                                     |

**Total: 8 categories** (7 event-based + 1 meta)

### Why NOT Include These as Categories

| Excluded          | Reason                                                        |
|-------------------|---------------------------------------------------------------|
| Planning Tips     | This is a **content pillar**, use tags instead                |
| Behind the Scenes | This is a **content pillar**, use tags instead                |
| Inspiration       | This is a **content pillar**, use tags instead                |
| Proms             | Sub-category of Celebrations or Birthdays; too narrow for now |
| Workshops         | Not blog content - has its own page section                   |

### Tags (Content Pillar + Cross-Cutting)

Tags describe **how** content is written or **what** cross-cutting topics it covers:

**Content Pillar Tags:**

- planning-guide
- inspiration
- local-expertise
- behind-the-scenes
- social-proof

**Topic Tags (existing + additions):**

- venue-tips
- checklist
- timeline
- vendor-spotlight
- real-event
- testimonial

**Seasonal Tags (keep existing):**

- spring, summer, fall, winter, holidays

**Location Tags (keep existing):**

- germantown, memphis, tennessee

---

## Implementation Tasks

### Task 1: Update blog_taxonomy.yaml

**Files:**

- Modify: `data/blog_taxonomy.yaml`

**Step 1: Read the current file**

```bash
cat data/blog_taxonomy.yaml
```

**Step 2: Replace with new taxonomy**

```yaml
# Blog Taxonomy Reference
# Categories are EVENT-TYPE based (map to personas).
# Tags describe content format and cross-cutting topics.
# Sveltia CMS editors reference this file when creating new posts.

categories:
  # Event-type categories (map to personas)
  - Weddings           # Persona: Bride, Groom, Wedding Planner
  - Corporate Events   # Persona: Victoria (VP of Events)
  - Birthdays          # Persona: Michelle (Milestone Mom)
  - Baby Showers       # Persona: Jasmine (Joyful Auntie)
  - Anniversaries      # Persona: Diana (Devoted Wife)
  - Graduations        # Persona: Grace (Proud Graduate's Mom)
  - Celebrations       # Persona: General host (private parties)
  - News               # Meta: Announcements, updates

tags:
  # Content Pillar Tags (describes HOW the content is written)
  - planning-guide     # Actionable how-to content
  - inspiration        # Visual, aspirational content
  - local-expertise    # Memphis/Germantown knowledge
  - behind-the-scenes  # Authentic venue/team content
  - social-proof       # Testimonials, real events

  # Topic Tags
  - venue-tips
  - checklist
  - timeline
  - vendor-spotlight
  - real-event
  - testimonial
  - milestone

  # Seasonal
  - spring
  - summer
  - fall
  - winter
  - holidays

  # Location
  - germantown
  - memphis
  - tennessee
```

**Step 3: Verify file is valid YAML**

```bash
python3 -c "import yaml; yaml.safe_load(open('data/blog_taxonomy.yaml'))" && echo "Valid YAML"
```

**Step 4: Commit**

```bash
git add data/blog_taxonomy.yaml
git commit -m "refactor: align blog categories with personas and event types"
```

---

### Task 2: Update Sveltia CMS config.yml categories

**Files:**

- Modify: `static/admin/config.yml` (lines ~134-145)

**Step 1: Read the current categories section**

```bash
sed -n '134,146p' static/admin/config.yml
```

**Step 2: Update the categories widget options**

Find this block:

```yaml
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
        hint: 'Select 1-2 categories.'
```

Replace with:

```yaml
      - label: Categories
        name: categories
        widget: select
        multiple: true
        min: 1
        max: 2
        options:
          - Weddings
          - Corporate Events
          - Birthdays
          - Baby Showers
          - Anniversaries
          - Graduations
          - Celebrations
          - News
        hint: 'Select 1-2 event-type categories. Use tags for content pillars.'
```

**Step 3: Update the tags widget to include content pillar tags**

Find the tags widget (lines ~147-171) and add the content pillar tags to the options:

```yaml
      - label: Tags
        name: tags
        widget: select
        multiple: true
        options:
          # Content Pillars
          - planning-guide
          - inspiration
          - local-expertise
          - behind-the-scenes
          - social-proof
          # Topics
          - venue-tips
          - checklist
          - timeline
          - vendor-spotlight
          - real-event
          - testimonial
          - milestone
          # Seasonal
          - spring
          - summer
          - fall
          - winter
          - holidays
          # Location
          - germantown
          - memphis
          - tennessee
        hint: 'Tags for content type and cross-cutting topics.'
```

**Step 4: Verify the Hugo build still passes**

```bash
hugo --quiet && echo "Build passed"
```

**Step 5: Commit**

```bash
git add static/admin/config.yml
git commit -m "feat: update CMS categories to event-type taxonomy"
```

---

### Task 3: Update existing blog post categories

**Files:**

- Modify: `content/blog/*/index.md` (7 files)

**Step 1: List posts needing category updates**

Only "Planning Tips" and "Behind the Scenes" need remapping:

| Post                             | Current Category | New Category | Add Tag     |
|----------------------------------|------------------|--------------|-------------|
| valentines-day-love-in-all-forms | Planning Tips    | Celebrations | inspiration |

All other posts already use valid event-type categories.

**Step 2: Update the Valentine's post**

Read the file:

```bash
head -30 content/blog/valentines-day-love-in-all-forms/index.md
```

Change `categories: ["Planning Tips"]` to `categories: ["Celebrations"]` and add `inspiration` to tags.

**Step 3: Verify Hugo build**

```bash
hugo --quiet && echo "Build passed"
```

**Step 4: Commit**

```bash
git add content/blog/valentines-day-love-in-all-forms/index.md
git commit -m "refactor: update valentine's post to celebrations category"
```

---

### Task 4: Update blog-editor agent with category guidance

**Files:**

- Modify: `.claude/agents/blog-editor.md`

**Step 1: Read the front matter requirements section**

```bash
sed -n '88,106p' .claude/agents/blog-editor.md
```

**Step 2: Add category selection guidance after line 96**

Find:

```yaml
categories: ["Event Planning"]                  # One primary category
```

Replace with:

```yaml
categories: ["Birthdays"]                       # Event-type category (see below)
```

**Step 3: Add a new section after "Required Front Matter Fields" (after line ~105)**

Insert this new section:

```markdown
### Category Selection Guide

Categories are **event-type based** and map directly to personas:

| Category         | Use For Posts About                            | Target Persona               |
|------------------|------------------------------------------------|------------------------------|
| Weddings         | Wedding planning, venues, trends               | Bride, Groom, Planner        |
| Corporate Events | Company events, team building, holiday parties | Victoria (VP of Events)      |
| Birthdays        | Milestone birthdays, party planning            | Michelle (Milestone Mom)     |
| Baby Showers     | Shower planning, hosting, themes               | Jasmine (Joyful Auntie)      |
| Anniversaries    | Anniversary celebrations, vow renewals         | Diana (Devoted Wife)         |
| Graduations      | Graduation parties, achievement celebrations   | Grace (Proud Graduate's Mom) |
| Celebrations     | General parties, Valentine's, holidays         | General host persona         |
| News             | Announcements, venue updates, welcome posts    | All personas                 |

**Rules:**
- Select 1-2 categories MAX
- Always choose based on the EVENT TYPE the post relates to
- Do NOT use categories to describe content format (that's what tags are for)

**Content Pillar Tags:**

Instead of categories like "Planning Tips" or "Behind the Scenes", use these tags:

| Content Type        | Tag to Use          |
|---------------------|---------------------|
| How-to guides       | `planning-guide`    |
| Aspirational/visual | `inspiration`       |
| Local knowledge     | `local-expertise`   |
| Team/venue stories  | `behind-the-scenes` |
| Testimonials        | `social-proof`      |
```

**Step 4: Verify the agent file is valid YAML frontmatter**

```bash
head -20 .claude/agents/blog-editor.md
```

**Step 5: Commit**

```bash
git add .claude/agents/blog-editor.md
git commit -m "docs: add category selection guide to blog-editor agent"
```

---

### Task 5: Update content-index.yaml definitions

**Files:**

- Modify: `data/content-index.yaml`

**Step 1: Read the current event_types definitions**

```bash
sed -n '47,72p' data/content-index.yaml
```

**Step 2: Add graduation event type if missing**

Check if `graduation` exists in event_types. If not, add after `anniversary`:

```yaml
    graduation:
      name: Graduation Party
      page: null
      includes:
        - high-school
        - college
        - professional-degree
```

**Step 3: Add a new section for blog categories mapping**

After the `search_intents` section (~line 108), add:

```yaml
  blog_categories:
    weddings:
      name: Weddings
      maps_to_personas: [bride, groom, wedding-planner]
      maps_to_event_types: [wedding]
    corporate-events:
      name: Corporate Events
      maps_to_personas: [corporate-planner, executive]
      maps_to_event_types: [corporate]
    birthdays:
      name: Birthdays
      maps_to_personas: [parent, host]
      maps_to_event_types: [birthday]
    baby-showers:
      name: Baby Showers
      maps_to_personas: [parent, host]
      maps_to_event_types: [baby-shower]
    anniversaries:
      name: Anniversaries
      maps_to_personas: [host]
      maps_to_event_types: [anniversary]
    graduations:
      name: Graduations
      maps_to_personas: [parent]
      maps_to_event_types: [graduation]
    celebrations:
      name: Celebrations
      maps_to_personas: [host]
      maps_to_event_types: [private-party]
    news:
      name: News
      maps_to_personas: []
      maps_to_event_types: []
      is_meta: true
```

**Step 4: Verify YAML is valid**

```bash
python3 -c "import yaml; yaml.safe_load(open('data/content-index.yaml'))" && echo "Valid YAML"
```

**Step 5: Commit**

```bash
git add data/content-index.yaml
git commit -m "feat: add blog_categories mapping to content index"
```

---

### Task 6: Update CLAUDE.md documentation

**Files:**

- Modify: `CLAUDE.md` (Blog Post Styling section)

**Step 1: Find the categories mention in CLAUDE.md**

```bash
grep -n "Categories" CLAUDE.md | head -5
```

**Step 2: Update the front matter example**

Find the blog front matter example and update `categories` to show an event-type example:

```yaml
categories: ["Birthdays"]                  # Event-type category (1-2 max)
```

**Step 3: Add a note about category/tag distinction**

After the front matter example, add:

```markdown
**Category vs Tag:**
- **Categories** = Event types (Weddings, Birthdays, Baby Showers, etc.)
- **Tags** = Content format (planning-guide, inspiration, behind-the-scenes) + topics
```

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: clarify category vs tag distinction in CLAUDE.md"
```

---

### Task 7: Verify complete system consistency

**Files:**

- Read-only verification

**Step 1: Verify all category sources match**

```bash
# Extract categories from each source
echo "=== blog_taxonomy.yaml ==="
grep -A10 "^categories:" data/blog_taxonomy.yaml | grep "^\s*-"

echo ""
echo "=== config.yml (CMS) ==="
sed -n '/label: Categories/,/hint:/p' static/admin/config.yml | grep "^\s*-"

echo ""
echo "=== content-index.yaml ==="
grep -A2 "blog_categories:" data/content-index.yaml | head -20
```

**Step 2: Verify all existing posts have valid categories**

```bash
for f in content/blog/*/index.md; do
  cats=$(grep -A2 "^categories:" "$f" | grep -E "^\s*-" | sed 's/.*- //')
  echo "$(basename $(dirname $f)): $cats"
done
```

All should be one of: Weddings, Corporate Events, Birthdays, Baby Showers, Anniversaries, Graduations, Celebrations, News

**Step 3: Run Hugo build**

```bash
hugo --gc --minify && echo "Production build passed"
```

**Step 4: Final commit (if any remaining changes)**

```bash
git status
# If clean, no action needed
```

---

## Rollback Plan

If issues arise:

```bash
git revert HEAD~6..HEAD  # Revert all 6 commits from this plan
```

---

## Success Criteria

- [x] All 8 categories defined in `data/blog_taxonomy.yaml`
- [x] CMS config updated with same 8 categories
- [x] All existing blog posts use valid categories
- [x] Blog-editor agent has category selection guidance
- [x] Content-index has category-to-persona mapping
- [x] CLAUDE.md documents category/tag distinction
- [x] Hugo builds successfully
- [x] No broken links or 404s on /blog/ pages

## Implementation Summary

**Commits (12 total):**

```text
fa3016c chore(content): update content index with taxonomy tracking
3744c4e fix: simplify taxonomy structure for CMS compatibility, enforce single category
547e823 refactor(content): migrate blog posts to new tag taxonomy
ea4b35c feat(agent): add category/tag taxonomy guidance to blog-editor
ce3728c docs: clarify category vs tag distinction in CLAUDE.md
cf50d7e feat(cms): separate categories (event types) from tags (metadata)
db7d011 feat(content): redesign blog taxonomy with persona mapping
098cd3d feat: add blog_categories mapping to content index
866c35b docs: add category selection guide to blog-editor agent
55dfb25 refactor: update valentine's post to celebrations category
bc1e353 feat: update CMS categories to event-type taxonomy
afc9aeb refactor: align blog categories with personas and event types
```

**Key changes:**

- Categories now enforce single selection (`multiple: false`)
- Tags expanded to 50+ options organized by purpose
- All 7 blog posts migrated to new taxonomy
- Blog-editor agent has comprehensive category/tag guidance

---

## Post-Implementation: Content Strategy Alignment

After completing this plan, the content creation workflow becomes:

1. **Choose target persona** (from `docs/marketing-strategy/01-personas/`)
2. **Map to category** (using blog-editor agent's Category Selection Guide)
3. **Determine content pillar** (tag: planning-guide, inspiration, etc.)
4. **Write content** with persona's pain points and keywords in mind
5. **Verify category-persona alignment** before publishing

This ensures every blog post has a clear audience and purpose.
