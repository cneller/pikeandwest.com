# Command: /persona

> Load detailed persona context into the conversation for targeted content creation.

## Usage

```bash
/persona [name]
```

**Examples:**

```bash
/persona boutique-bride-bella
/persona corporate-claire
/persona social-savvy-sarah
/persona art-collector-alex
```

## Purpose

This command loads comprehensive persona details including:

- Demographics and psychographics
- Pain points and motivations
- Content preferences
- Language and tone guidance
- Decision-making journey

Use this command to:

- Ground content creation in specific persona needs
- Review persona details before planning
- Ensure content targets the right audience
- Get persona-specific content suggestions

## What It Does

### Step 1: Persona Loading

- Retrieves full persona profile from documentation
- Loads associated keywords and topics
- Pulls content preferences and formats

### Step 2: Context Summary

- Presents key persona attributes
- Highlights current priorities
- Notes seasonal considerations

### Step 3: Content Suggestions

- Lists content topics this persona needs
- Shows gaps in current persona coverage
- Suggests content formats

## Example Input/Output

**Input:**

```bash
/persona boutique-bride-bella
```

**Output:**

````markdown
# Persona Loaded: Boutique Bride Bella

## Quick Profile

| Attribute | Detail                                 |
|-----------|----------------------------------------|
| Age Range | 28-38                                  |
| Income    | $150K+ household                       |
| Location  | Germantown, East Memphis, Collierville |
| Status    | Engaged, planning 12-18 months out     |
| Priority  | Primary persona                        |

---

## The Story

Bella is a marketing professional who values aesthetics and experiences over
traditional extravagance. She's planning a wedding that reflects her personal
style—sophisticated, Instagram-worthy, but authentically her. She wants guests
to talk about her wedding for years, not because it was expensive, but because
it was memorable and meaningful.

---

## What She's Looking For

**Must-Haves:**
- Unique venue that photographs beautifully
- Space that doesn't need heavy decoration
- Flexibility to bring her own vendors
- Intimate capacity (50-120 guests)

**Nice-to-Haves:**
- Interesting backdrop for photos
- Story to tell about the venue
- Local/Memphis connection
- Art or cultural element

**Deal-Breakers:**
- Cookie-cutter ballroom feel
- Strict vendor requirements
- Inflexible timing/rules
- Venues that feel "done before"

---

## Pain Points

1. **Venue fatigue** - Every venue looks the same after 10 tours
2. **Decoration overwhelm** - Doesn't want to fill a blank box
3. **Vendor restrictions** - Wants her favorite photographer/caterer
4. **Generic feeling** - Fears her wedding will look like everyone else's
5. **Budget pressure** - Wants unique without the "custom" price tag

---

## Decision Journey

```text
Research Phase (6-12 months out)
↓ Pinterest, Instagram, wedding blogs
↓ Searching: "unique wedding venues Memphis", "art gallery wedding"

Discovery Phase (4-8 months out)
↓ Found Pike & West on Instagram or Google
↓ Browsing website, looking at gallery

Consideration Phase (3-6 months out)
↓ Scheduling tour, comparing 3-5 venues
↓ Checking reviews, asking in wedding groups

Decision Phase (2-4 months out)
↓ Second tour with partner/family
↓ Reviewing contract, checking availability
````

---

## Content She Needs

### Currently in Research Phase

- "Unique wedding venue ideas beyond the ballroom"
- "What makes an art gallery wedding special"
- "Questions to ask on venue tours"

### Currently in Consideration Phase

- "Pike & West vs. traditional venues comparison"
- "Real weddings at Pike & West" (gallery/testimonials)
- "How to plan an intimate wedding"

### Currently in Decision Phase

- "What to expect on your Pike & West tour"
- "Pike & West wedding packages and pricing"
- "Vendor recommendations from Pike & West"

---

## Language & Tone

**Words that resonate:**

- Curated, bespoke, intentional
- Intimate, meaningful, authentic
- Artistic, gallery, contemporary
- Memphis, local, community

**Words to avoid:**

- Cheap, budget, deal
- Traditional, classic, timeless (overused)
- Party, celebration (prefer "wedding", "gathering")
- Perfect (too pressure-laden)

**Tone:**

- Sophisticated but warm
- Confident but not pretentious
- Helpful, not salesy
- Inspiring, aspirational

---

## Social Media Behavior

**Platforms:**

- Instagram (primary) - Daily browsing, saves wedding content
- Pinterest - Active boards for wedding planning
- Facebook - Less active, but in Memphis wedding groups

**Content she engages with:**

- Real wedding photos (not staged)
- Behind-the-scenes venue content
- Tips and checklists
- Local vendor spotlights

**Hashtags she follows:**

- #MemphisWedding
- #GalleryWedding
- #UniqueWedding
- #IntimateWedding

---

## Current Content Gaps for Bella

Based on content audit, Bella needs:

| Content                     | Status       | Priority |
|-----------------------------|--------------|----------|
| Real wedding gallery        | Exists       | -        |
| Venue tour guide            | Needs update | High     |
| Vendor spotlight series     | Missing      | Medium   |
| Behind-the-scenes content   | Minimal      | Medium   |
| Comparison with competitors | Missing      | Low      |

---

## Suggested Next Actions

```bash
# Create content for Bella's research phase
/blog-outline "unique wedding venue ideas Memphis"

# Update tour guide for consideration phase
/content-audit content/blog/venue-tour-guide.md

# Generate social content
/social-from-blog content/blog/art-gallery-wedding-reasons.md
```

---

_Persona context loaded. All subsequent content will be tailored for Boutique Bride Bella until session ends or another persona is loaded._

````text

## Configuration

### Command File Location

```text
.claude/commands/persona.md
````

### Command Definition

```yaml
---
name: persona
description: Load persona context for targeted content
arguments:
  - name: name
    description: Persona identifier (slug format)
    required: true
---

# /persona Command

When invoked:
1. Load full persona profile from docs/marketing-strategy/02-personas/
2. Present key attributes and story
3. Show decision journey and content needs
4. Identify content gaps for this persona
5. Suggest relevant actions

Persona remains active for session until:
- Another persona is loaded
- Session ends
- User explicitly clears context
```

## Available Personas

| Slug                   | Name                 | Priority  | Focus                |
|------------------------|----------------------|-----------|----------------------|
| `boutique-bride-bella` | Boutique Bride Bella | Primary   | Weddings             |
| `corporate-claire`     | Corporate Claire     | Primary   | Corporate events     |
| `social-savvy-sarah`   | Social Savvy Sarah   | Secondary | Celebrations/parties |
| `art-collector-alex`   | Art Collector Alex   | Tertiary  | Art events           |

## Options

| Option           | Description              | Default |
|------------------|--------------------------|---------|
| `--brief`        | Show abbreviated profile | false   |
| `--content-only` | Just show content needs  | false   |

**Examples:**

```bash
/persona boutique-bride-bella --brief
/persona corporate-claire --content-only
```

## Related Commands

- [/blog-draft](./blog-draft.md) - Create content for loaded persona
- [/content-queue](./content-queue.md) - Filter by persona
- [/content-audit](./content-audit.md) - Check persona coverage

## Session Behavior

When a persona is loaded:

1. All content commands use persona context
2. Brand voice adjusts for persona preferences
3. Keyword suggestions align with persona searches
4. CTAs reflect persona's decision stage

To clear persona context:

```bash
/persona --clear
```

Or simply load a different persona to switch context.
