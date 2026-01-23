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
```

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
