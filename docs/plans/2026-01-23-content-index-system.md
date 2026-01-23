# Content Index System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a unified content index that enables cross-linking assistance, topic cluster planning, and automated auditing across all site pages.

**Architecture:** A single YAML index file (`data/content-index.yaml`) serves as the source of truth for all content metadata. A shared skill (`content-editing`) provides common knowledge to specialized agents (`blog-editor`, `page-editor`, `content-auditor`). Agents maintain the index as a side effect of their primary work.

**Tech Stack:** YAML data files, Claude Code agents/skills, Hugo data templates

---

## Task Overview

| Task | Component       | Description                                                          |
|------|-----------------|----------------------------------------------------------------------|
| 1    | Index Schema    | Create `data/content-index.yaml` with full schema                    |
| 2    | Definitions     | Populate taxonomy definitions (personas, event types, funnel stages) |
| 3    | Page Entries    | Create entries for all 20 existing pages                             |
| 4    | Topic Clusters  | Define cluster relationships and content gaps                        |
| 5    | Shared Skill    | Create `content-editing` skill with shared knowledge                 |
| 6    | Blog Editor     | Update `blog-editor.md` to inherit skill and update index            |
| 7    | Page Editor     | Create `page-editor.md` agent                                        |
| 8    | Content Auditor | Update `content-auditor.md` to update index                          |
| 9    | Audit Command   | Update `/content-audit` command for new architecture                 |
| 10   | Validation      | Test the system end-to-end                                           |

---

## Task 1: Create Index Schema

**Files:**

- Create: `data/content-index.yaml`

**Step 1: Create the index file with metadata and empty sections**

```yaml
# Pike & West Content Index
# Maintained by content editing agents
# Last manual edit should be rare - agents keep this updated

# === INDEX METADATA ===
meta:
  version: "1.0"
  schema_version: "1.0"
  last_updated: "2026-01-23"
  last_full_audit: null
  updated_by: manual

  stats:
    total_pages: 0
    blog_posts: 0
    event_pages: 0
    static_pages: 0
    orphan_pages: 0
    avg_audit_score: 0
    content_gaps: 0
    clusters_defined: 0

# === TAXONOMY DEFINITIONS ===
definitions:
  personas: {}
  event_types: {}
  funnel_stages: {}
  content_goals: {}
  search_intents: {}

# === TOPIC CLUSTERS ===
clusters: {}

# === PAGE ENTRIES ===
pages: {}
```

**Step 2: Verify file is valid YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/content-index.yaml'))"`
Expected: No output (success)

**Step 3: Commit**

```bash
git add data/content-index.yaml
git commit -m "feat: create content index schema skeleton"
```

---

## Task 2: Populate Taxonomy Definitions

**Files:**

- Modify: `data/content-index.yaml`

**Step 1: Add persona definitions**

Replace the `definitions.personas: {}` section with:

```yaml
  personas:
    bride:
      name: "Bride"
      description: "Planning their wedding, primary decision maker"
    groom:
      name: "Groom"
      description: "Planning their wedding, often secondary decision maker"
    wedding-planner:
      name: "Wedding Planner"
      description: "Professional planner coordinating for clients"
    corporate-planner:
      name: "Corporate Planner"
      description: "HR, office manager, or executive assistant planning business events"
    executive:
      name: "Executive"
      description: "C-suite or decision maker approving venues and budgets"
    parent:
      name: "Parent"
      description: "Planning children's birthdays, baby showers, graduations"
    host:
      name: "Party Host"
      description: "Planning private parties, anniversaries, celebrations"
    artist:
      name: "Artist"
      description: "Interested in gallery exhibitions or applications"
```

**Step 2: Add event type definitions**

Replace the `definitions.event_types: {}` section with:

```yaml
  event_types:
    wedding:
      name: "Wedding"
      page: /events/weddings
    corporate:
      name: "Corporate Event"
      page: /events/corporate-events
      includes:
        - holiday-party
        - team-building
        - conference
    birthday:
      name: "Birthday Party"
      page: /events/birthday-parties
    baby-shower:
      name: "Baby Shower"
      page: /events/baby-showers
    anniversary:
      name: "Anniversary Party"
      page: null  # Content gap - needs dedicated page
    private-party:
      name: "Private Party"
      page: /events/private-parties
    dance:
      name: "Dance Event"
      page: /events/dance-events
```

**Step 3: Add funnel stages, content goals, and search intents**

Replace remaining empty definitions:

```yaml
  funnel_stages:
    tofu:
      name: "Top of Funnel"
      description: "Awareness - inspiration, ideas, general info"
    mofu:
      name: "Middle of Funnel"
      description: "Consideration - comparisons, planning guides, specifics"
    bofu:
      name: "Bottom of Funnel"
      description: "Decision - pricing, booking, tours, testimonials"

  content_goals:
    awareness:
      name: "Awareness"
      description: "Introduce Pike & West to new audiences"
    traffic:
      name: "Traffic"
      description: "Drive organic search traffic"
    leads:
      name: "Leads"
      description: "Capture contact information"
    conversion:
      name: "Conversion"
      description: "Drive tour bookings and inquiries"

  search_intents:
    informational:
      name: "Informational"
      description: "User wants to learn something"
    navigational:
      name: "Navigational"
      description: "User looking for specific page/brand"
    commercial:
      name: "Commercial"
      description: "User researching before purchase"
    transactional:
      name: "Transactional"
      description: "User ready to take action"
```

**Step 4: Verify YAML is still valid**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/content-index.yaml'))"`
Expected: No output (success)

**Step 5: Commit**

```bash
git add data/content-index.yaml
git commit -m "feat: add taxonomy definitions to content index"
```

---

## Task 3: Create Page Entries

**Files:**

- Modify: `data/content-index.yaml`

**Step 1: Add blog post entries**

Add to the `pages:` section. Here's the template for one entry (repeat for all 6 blog posts):

```yaml
  /blog/corporate-event-planning-tips-2026:
    # === BASIC METADATA ===
    title: "Corporate Event Planning Tips for 2026"
    type: blog
    status: published

    # === SEO & KEYWORDS ===
    primary_keyword: "corporate event planning"
    secondary_keywords:
      - "business events Memphis"
      - "corporate venue"
      - "team building events"
    search_intent: informational
    keyword_difficulty: medium

    # === TOPIC & TAXONOMY ===
    topic_summary: "Guide to planning corporate events at Pike & West including team building, meetings, and celebrations."
    cluster: corporate
    funnel_stage: mofu
    content_goal: traffic
    entities:
      - Pike & West
      - Memphis
      - Germantown

    # === TARGET AUDIENCE ===
    personas:
      - corporate-planner
      - executive
    personas_primary: corporate-planner
    event_types:
      - corporate
    event_types_primary: corporate

    # === CONTENT CHARACTERISTICS ===
    word_count: 0  # To be filled by auditor
    target_word_count: 1500
    evergreen: true
    seasonal_relevance: []
    cta_type: tour-booking
    cta_destination: /contact

    # === EDITORIAL ELEMENTS ===
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
    drop_cap: true
    has_cta: false

    # === IMAGES ===
    images:
      count: 0
      hero_image: false
      all_have_alt: true
      images_list: []

    # === LINKING ===
    links_out: []
    links_in: []
    links_recommended: []
    orphan: false

    # === AUDIT & LIFECYCLE ===
    author: ""
    created: null
    last_modified: null
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

**Step 2: Add remaining blog posts**

Add entries for:

- `/blog/holiday-anniversary-celebrations`
- `/blog/milestone-birthday-new-year`
- `/blog/fall-baby-shower-inspiration`
- `/blog/welcome-to-pike-and-west`
- `/blog/valentines-day-love-in-all-forms`

Use the same template, adjusting:

- `title`, `primary_keyword`, `secondary_keywords`
- `topic_summary`, `cluster`
- `personas`, `event_types`

**Step 3: Add event page entries**

Add entries for:

- `/events/weddings`
- `/events/corporate-events`
- `/events/birthday-parties`
- `/events/baby-showers`
- `/events/private-parties`
- `/events/dance-events`

Use `type: event-page` and adjust fields accordingly.

**Step 4: Add static page entries**

Add entries for:

- `/` (homepage)
- `/about`
- `/contact`
- `/gallery-application`
- `/accessibility`
- `/privacy`
- `/blog` (blog index)
- `/events` (events index)

Use `type: static-page` and simpler metadata (many fields can be null).

**Step 5: Update stats in meta section**

```yaml
meta:
  stats:
    total_pages: 20
    blog_posts: 6
    event_pages: 6
    static_pages: 8
    orphan_pages: 0
    avg_audit_score: 0
    content_gaps: 7
    clusters_defined: 0
```

**Step 6: Verify YAML is valid**

Run: `python3 -c "import yaml; d=yaml.safe_load(open('data/content-index.yaml')); print(f'Pages: {len(d[\"pages\"])}')"`
Expected: `Pages: 20`

**Step 7: Commit**

```bash
git add data/content-index.yaml
git commit -m "feat: add all page entries to content index"
```

---

## Task 4: Define Topic Clusters

**Files:**

- Modify: `data/content-index.yaml`

**Step 1: Add wedding cluster**

Replace `clusters: {}` with:

```yaml
clusters:
  weddings:
    name: "Weddings at Pike & West"
    description: "Everything about hosting weddings at our venue"
    pillar_page: /events/weddings

    cluster_pages:
      - /blog/welcome-to-pike-and-west
      - /blog/valentines-day-love-in-all-forms

    planned_content:
      - title: "Wedding Planning Timeline: 12 Months to Your Big Day"
        primary_keyword: "wedding planning timeline"
        funnel_stage: mofu
        priority: high
      - title: "Memphis Wedding Venue Comparison Guide"
        primary_keyword: "Memphis wedding venues"
        funnel_stage: mofu
        priority: medium
      - title: "Intimate Wedding Ideas for Small Guest Lists"
        primary_keyword: "intimate wedding venue"
        funnel_stage: tofu
        priority: medium

    target_keywords:
      - "wedding venue Memphis"
      - "wedding venue Germantown TN"
      - "art gallery wedding"
      - "intimate wedding venue"

    linking_rules:
      - "All cluster pages MUST link to pillar: /events/weddings"
      - "All cluster pages SHOULD link to: /contact"
      - "Cluster pages SHOULD cross-link to related posts"
```

**Step 2: Add corporate cluster**

```yaml
  corporate:
    name: "Corporate Events"
    description: "Business events, team building, holiday parties"
    pillar_page: /events/corporate-events

    cluster_pages:
      - /blog/corporate-event-planning-tips-2026

    planned_content:
      - title: "Team Building Event Ideas That Actually Work"
        primary_keyword: "team building events Memphis"
        funnel_stage: tofu
        priority: high
      - title: "Holiday Party Planning Guide for Memphis Companies"
        primary_keyword: "corporate holiday party venue"
        funnel_stage: mofu
        priority: high
        seasonal: Q4

    target_keywords:
      - "corporate event venue Memphis"
      - "team building venue"
      - "holiday party venue Memphis"

    linking_rules:
      - "All cluster pages MUST link to pillar: /events/corporate-events"
      - "All cluster pages SHOULD link to: /contact"
```

**Step 3: Add celebrations cluster**

```yaml
  celebrations:
    name: "Life Celebrations"
    description: "Birthdays, anniversaries, baby showers, milestones"
    pillar_page: /events/private-parties

    cluster_pages:
      - /events/birthday-parties
      - /events/baby-showers
      - /blog/milestone-birthday-new-year
      - /blog/holiday-anniversary-celebrations
      - /blog/fall-baby-shower-inspiration

    planned_content:
      - title: "Anniversary Party Ideas: Celebrating Milestone Years"
        primary_keyword: "anniversary party venue"
        funnel_stage: tofu
        priority: high
        creates_page: /events/anniversary-parties

    target_keywords:
      - "birthday party venue Memphis"
      - "baby shower venue"
      - "anniversary party venue"
      - "milestone celebration venue"

    linking_rules:
      - "All cluster pages MUST link to pillar: /events/private-parties"
      - "Birthday content should cross-link with milestone content"
```

**Step 4: Update meta stats**

```yaml
  stats:
    clusters_defined: 3
    content_gaps: 6  # Count of all planned_content items
```

**Step 5: Verify and commit**

Run: `python3 -c "import yaml; d=yaml.safe_load(open('data/content-index.yaml')); print(f'Clusters: {len(d[\"clusters\"])}')"`
Expected: `Clusters: 3`

```bash
git add data/content-index.yaml
git commit -m "feat: define topic clusters with content gaps"
```

---

## Task 5: Create Shared Content-Editing Skill

**Files:**

- Create: `.claude/skills/content-editing/SKILL.md`

**Step 1: Create the skill directory**

Run: `mkdir -p .claude/skills/content-editing`

**Step 2: Create the skill file**

````markdown
---
name: content-editing
description: >
  Shared knowledge for all Pike & West content editing and auditing agents.
  Covers brand voice, SEO standards, cross-linking rules, and content index
  management. Inherited by blog-editor, page-editor, and content-auditor.
---

# Pike & West Content Editing Standards

This skill provides shared knowledge for all content editing agents.

## Content Index

All content metadata is stored in `data/content-index.yaml`. When editing content,
you MUST update the corresponding page entry in the index.

### Reading the Index

```yaml
# Load with:
# index = yaml.safe_load(open('data/content-index.yaml'))
# page = index['pages']['/blog/example-post']
````

### Updating the Index

After editing any content file, update its index entry:

- `last_modified`: Current date
- `word_count`: Actual count
- `links_out`: All internal links in the content
- `shortcodes`: Count of each shortcode used
- `images`: Count and alt text status

Always update `meta.last_updated` and `meta.updated_by` with your agent name.

---

## Brand Voice Guidelines

### Tone

- Sophisticated but warm
- Confident but not pretentious
- Helpful, not salesy
- Inspiring, aspirational

### Words That Resonate

- Curated, bespoke, intentional
- Intimate, meaningful, authentic
- Artistic, gallery, contemporary
- Memphis, local, community

### Words to Avoid

- Cheap, budget, deal
- Traditional, classic, timeless (overused)
- "Party" → use "celebration", "gathering"
- Generic "venue" → vary with "gallery", "space", "setting"

### Standard CTA

End content with:

```markdown
[Schedule a tour](/contact/) to see our space and start planning your event.
Call us at 901.206.5575 or visit our contact page to get started.
```

---

## SEO Standards

### Title Tags

- 50-60 characters
- Include primary keyword
- Brand at end: "... | Pike & West"

### Meta Descriptions

- 150-160 characters
- Include primary keyword
- Compelling, action-oriented

### Heading Structure

- One H1 per page (the title)
- H2 for major sections
- H3 for subsections
- Never skip levels (H1 → H3)

### Internal Linking

- 2-4 internal links per post minimum
- Always link to `/contact` for tour booking
- Link to relevant event type page
- Cross-link related blog posts

---

## Cross-Linking Rules

### Finding Link Opportunities

1. Check `data/content-index.yaml` for:
   - Pages in the same `cluster`
   - Pages targeting related `event_types`
   - Pages targeting same `personas`

2. Check `links_recommended` field for suggested links

3. Use `topic_summary` to find semantically related content

### Adding Links

When adding internal links:

1. Use descriptive anchor text (not "click here")
2. Link naturally within content flow
3. Update `links_out` in the page's index entry
4. Check if destination page should link back (update `links_recommended`)

### Orphan Prevention

Before finishing any edit, verify:

- The page links OUT to at least 2 other pages
- The page has at least 1 link IN from another page
- If orphaned, add link from a related page

---

## Persona Reference

When writing, consider which personas the content serves:

| Persona           | Motivations                          | Content Needs                     |
|-------------------|--------------------------------------|-----------------------------------|
| bride             | Dream wedding, unique venue          | Inspiration, planning guides      |
| corporate-planner | Impress stakeholders, easy logistics | Capacity, catering, AV            |
| parent            | Memorable milestone                  | Age-appropriate options, packages |
| host              | Elegant gathering, art setting       | Ambiance, gallery features        |

---

## Event Type Reference

| Event Type    | Key Pages                | Content Themes                       |
|---------------|--------------------------|--------------------------------------|
| wedding       | /events/weddings         | Romance, elegance, gallery backdrop  |
| corporate     | /events/corporate-events | Professional, team building, holiday |
| birthday      | /events/birthday-parties | Milestones, celebration, memories    |
| baby-shower   | /events/baby-showers     | Intimate, joyful, unique             |
| anniversary   | (gap - needs page)       | Milestone years, renewal             |
| private-party | /events/private-parties  | Versatile, gathering, art            |
| dance         | /events/dance-events     | Movement, music, space               |

````text

**Step 3: Verify file exists**

Run: `ls -la .claude/skills/content-editing/SKILL.md`
Expected: File listed

**Step 4: Commit**

```bash
git add .claude/skills/content-editing/
git commit -m "feat: create shared content-editing skill"
````

---

## Task 6: Update Blog Editor Agent

**Files:**

- Modify: `.claude/agents/blog-editor.md`

**Step 1: Update frontmatter to inherit skill**

Update the frontmatter:

```yaml
---
name: blog-editor
description: >
  Use this agent when creating, editing, or reviewing Pike & West blog posts.
  Automatically applies magazine-style editorial formatting including drop caps,
  pull quotes, section dividers, tip boxes, fact boxes, timelines, and other
  visual enhancements. Ensures brand voice consistency and accessibility.
  Updates content index after every edit.
model: claude-opus-4-5-20251101
inherits:
  - content-editing
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---
```

**Step 2: Add index update section**

Add this section before the "Quality Checklist" section:

````markdown
---

## Content Index Updates

After EVERY blog post edit, you MUST update `data/content-index.yaml`:

### Fields to Update

```yaml
/blog/[post-slug]:
  # Always update these:
  last_modified: [today's date]
  word_count: [actual count]

  # Update if changed:
  links_out: [list all internal links]
  shortcodes:
    pull-quote: [count]
    divider: [count]
    tip: [count]
    fact-box: [count]
    timeline: [count]
    sidebar-quote: [count]
    numbered-list: [count]
    standfirst: [count]
    kicker: [count]
    key-takeaways: [count]
  images:
    count: [count]
    hero_image: [true/false]
    all_have_alt: [true/false]
  drop_cap: [true if first para eligible]
  has_cta: [true if ends with CTA]
````

### Update Process

1. Read current index: `data/content-index.yaml`
2. Find the page entry for this blog post
3. Update the fields listed above
4. Update `meta.last_updated` to today
5. Update `meta.updated_by` to "blog-editor"
6. Write the updated index back

````text

**Step 3: Commit**

```bash
git add .claude/agents/blog-editor.md
git commit -m "feat: update blog-editor to inherit skill and update index"
````

---

## Task 7: Create Page Editor Agent

**Files:**

- Create: `.claude/agents/page-editor.md`

**Step 1: Create the agent file**

````markdown
---
name: page-editor
description: >
  Use this agent when creating or editing Pike & West event pages and static pages.
  Ensures proper structure, SEO optimization, and brand voice for non-blog content.
  Updates content index after every edit.
model: claude-opus-4-5-20251101
inherits:
  - content-editing
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
---

# Page Editor Agent

You are the Pike & West page editor, responsible for maintaining event pages
and static pages with consistent quality and SEO optimization.

## When to Activate

Use this agent when editing:
- Event pages (`content/events/*.md`)
- Static pages (`content/*.md` except blog)
- Homepage (`content/_index.md`)

## Page Types and Requirements

### Event Pages (`/events/*`)

Each event page should include:

1. **Hero Section**
   - Compelling headline
   - Brief tagline
   - Hero image with alt text

2. **Overview**
   - 2-3 paragraphs describing the event type
   - Why Pike & West is ideal for this event
   - Art/gallery angle

3. **Features/Amenities**
   - Capacity information
   - Available spaces
   - Catering options
   - AV/tech capabilities

4. **Call to Action**
   - Tour booking CTA
   - Contact information

### Static Pages

| Page                | Requirements                               |
|---------------------|--------------------------------------------|
| Homepage            | Hero, event types grid, about preview, CTA |
| About               | Story, team, art focus, gallery info       |
| Contact             | Address, phone, hours, form, map           |
| Gallery Application | Artist info, submission process            |

---

## SEO Requirements for Pages

### Event Pages
- Title: "[Event Type] at Pike & West | Memphis Venue"
- Meta: 150-160 chars describing the event experience
- H1: Event type name
- Include primary keyword 2-3 times naturally

### Internal Linking
- Link to `/contact` for tour booking
- Link to related blog posts in the same cluster
- Link to other relevant event types

---

## Content Index Updates

After EVERY page edit, update `data/content-index.yaml`:

```yaml
/events/[page-slug]:
  last_modified: [today]
  word_count: [count]
  links_out: [all internal links]
  images:
    count: [count]
    hero_image: [true/false]
    all_have_alt: [true/false]
  has_cta: [true/false]
  cta_type: [tour-booking/contact/none]
  cta_destination: [link target]
````

Update `meta.last_updated` and `meta.updated_by: "page-editor"`.

---

## Quality Checklist

Before completing any page edit:

### Content Quality

- [ ] Title tag optimized (50-60 chars with keyword)
- [ ] Meta description compelling (150-160 chars)
- [ ] Heading hierarchy correct (H1 → H2 → H3)
- [ ] Brand voice consistent
- [ ] Art/gallery angle present

### Technical

- [ ] All images have alt text
- [ ] Internal links working
- [ ] CTA present and linked to /contact
- [ ] Front matter valid YAML

### Index

- [ ] Content index entry updated
- [ ] links_out accurate
- [ ] All metadata current

````text

**Step 2: Commit**

```bash
git add .claude/agents/page-editor.md
git commit -m "feat: create page-editor agent"
````

---

## Task 8: Update Content Auditor Agent

**Files:**

- Modify: `.claude/agents/content-auditor.md`

**Step 1: Update frontmatter**

```yaml
---
name: content-auditor
description: >
  Audit a single page and return STRUCTURED JSON DATA for aggregation.
  Used by /content-audit command in map-reduce pattern. Returns data needed
  for both individual scoring AND cross-article analysis. Updates content
  index with audit results.
model: haiku
inherits:
  - content-editing
allowed-tools:
  - Read
  - Edit
  - Glob
  - Grep
---
```

**Step 2: Add index update section**

Add after the "Output Format" section:

````markdown
---

## Content Index Updates

After completing the audit, you MUST update `data/content-index.yaml`:

### Fields to Update

```yaml
/path/to/page:
  # Audit results
  last_audited: [today]
  next_review: [today + 6 months]
  audit_score: [total score]
  audit_scores:
    seo: [score]
    brand_voice: [score]
    editorial: [score]
    freshness: [score]
    technical: [score]
  issues_count: [count of issues]

  # Content analysis (fill if empty or changed)
  word_count: [actual count]
  primary_keyword: [detected keyword]
  secondary_keywords: [detected keywords]
  topic_summary: [one sentence summary]
  links_out: [all internal links found]
  shortcodes: [counts of each shortcode]
  images:
    count: [count]
    hero_image: [true/false]
    all_have_alt: [true/false]

  # Recommendations
  links_recommended: [suggested links to add]
  shortcodes_recommended: [suggested shortcodes]
````

### Orphan Detection

After updating `links_out`, recalculate `links_in` for all pages:

1. For each page, `links_in` = all other pages whose `links_out` contains this page
2. Set `orphan: true` if `links_in` is empty (except for homepage)

### Update Process

1. Read current index
2. Update the audited page's entry
3. Recalculate `links_in` for affected pages
4. Update `meta.last_updated` and `meta.updated_by: "content-auditor"`
5. Write updated index

````text

**Step 3: Commit**

```bash
git add .claude/agents/content-auditor.md
git commit -m "feat: update content-auditor to update index"
````

---

## Task 9: Update Content Audit Command

**Files:**

- Modify: `.claude/commands/content-audit.md`

**Step 1: Add index integration to Phase 3**

Update the "Phase 3: Reduce" section to include:

````markdown
### Phase 3: Reduce (Aggregation & Cross-Analysis)

After all sub-agents complete:

#### 3.0 Update Content Index

Before generating the report, ensure all sub-agent results are written to
`data/content-index.yaml`. Each sub-agent should have updated its page entry.

Then update aggregated fields:

```yaml
meta:
  last_full_audit: [today]
  stats:
    avg_audit_score: [calculate from all pages]
    orphan_pages: [count pages where orphan: true]
````

#### 3.1 Individual Aggregation

[existing content...]

````text

**Step 2: Add index-based cross-analysis**

Update section 3.2-3.6 to reference the index:

```markdown
#### 3.2 Keyword Cannibalization Detection

Query the index for keyword conflicts:
```python
# Pseudocode
for page in index['pages']:
    primary = page['primary_keyword']
    for other in index['pages']:
        if other['primary_keyword'] == primary and other != page:
            # Flag cannibalization
````

#### 3.4 Internal Link Health

Build link graph from index:

```python
for page in index['pages']:
    for link in page['links_out']:
        # Add edge: page -> link
    if not page['links_in']:
        page['orphan'] = True
```

````text

**Step 3: Commit**

```bash
git add .claude/commands/content-audit.md
git commit -m "feat: integrate content index into audit command"
````

---

## Task 10: Validate System End-to-End

**Files:**

- Read: `data/content-index.yaml`
- Read: `.claude/skills/content-editing/SKILL.md`
- Read: `.claude/agents/blog-editor.md`
- Read: `.claude/agents/page-editor.md`
- Read: `.claude/agents/content-auditor.md`

**Step 1: Validate YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/content-index.yaml')); print('Index: OK')"`
Expected: `Index: OK`

**Step 2: Validate all files exist**

Run: `ls -la .claude/skills/content-editing/SKILL.md .claude/agents/blog-editor.md .claude/agents/page-editor.md .claude/agents/content-auditor.md`
Expected: All 4 files listed

**Step 3: Run a test audit on one post**

Manually invoke the content-auditor on one blog post to verify:

1. It reads the post
2. It produces valid JSON output
3. It updates the content index

**Step 4: Verify index was updated**

Run: `python3 -c "import yaml; d=yaml.safe_load(open('data/content-index.yaml')); print(d['meta']['last_updated'])"`
Expected: Today's date

**Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete content index system implementation"
```

---

## Summary

After completing all tasks, you will have:

1. **Content Index** (`data/content-index.yaml`)
   - Full metadata for all 20 pages
   - Taxonomy definitions (personas, events, funnels)
   - Topic cluster definitions with content gaps
   - Audit scores and cross-linking data

2. **Shared Skill** (`.claude/skills/content-editing/SKILL.md`)
   - Brand voice guidelines
   - SEO standards
   - Cross-linking rules
   - Index management instructions

3. **Specialized Agents**
   - `blog-editor` - editorial styling + index updates
   - `page-editor` - page structure + index updates
   - `content-auditor` - scoring + index updates

4. **Updated Command**
   - `/content-audit` - map-reduce with index integration

The system is self-maintaining: every time an agent touches content, the index gets updated as a side effect.
