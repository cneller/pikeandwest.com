# Command: /content-queue

> Display prioritized content recommendations based on strategy, seasonality, and gaps.

## Usage

```bash
/content-queue
```

**With filters:**

```bash
/content-queue --type blog
/content-queue --persona boutique-bride-bella
/content-queue --quarter Q2
```

## Purpose

This command analyzes Pike & West's content strategy and presents:

- Prioritized list of recommended content pieces
- Reasoning for each recommendation
- Estimated effort and impact
- Seasonal timing considerations

Use this command for:

- Weekly content planning sessions
- Identifying what to write next
- Checking content calendar alignment
- Finding gaps in coverage

## What It Does

### Step 1: Strategy Analysis

- Reviews editorial calendar for planned content
- Checks content pillars for balance
- Identifies gaps in persona coverage
- Notes seasonal opportunities

### Step 2: Opportunity Scoring

Each content idea is scored on:

- **Keyword opportunity** (search volume, difficulty)
- **Persona alignment** (primary, secondary, tertiary)
- **Seasonal relevance** (current timing)
- **Competitive gap** (what competitors lack)
- **Business priority** (revenue potential)

### Step 3: Prioritization

- Ranks opportunities by combined score
- Groups by effort level (quick win, standard, deep dive)
- Notes dependencies and prerequisites

### Step 4: Presentation

- Displays top 10-15 recommendations
- Includes key metrics for each
- Provides quick-start prompts

## Example Output

````markdown
# Pike & West Content Queue

**Generated:** February 15, 2025
**Current Season:** Wedding booking peak (Feb-April)
**Content Balance:** 60% weddings, 25% corporate, 15% art events

---

## High Priority (This Week)

### 1. "Spring Wedding Color Palettes That Pop Against Gallery Walls"
**Score:** 94/100
| Factor              | Rating                                  |
|---------------------|-----------------------------------------|
| Keyword Opportunity | High - "spring wedding colors" 2.4K/mo  |
| Persona Fit         | Primary - Boutique Bride Bella          |
| Seasonal Timing     | Perfect - Peak planning season          |
| Competitive Gap     | Most guides don't address venue context |
| Business Priority   | High - Direct booking driver            |

**Why Now:** Couples booking spring 2026 weddings are finalizing color schemes. This positions Pike & West as design-forward venue.

**Effort:** Standard (1,200-1,500 words)
**Quick Start:** `/blog-outline "spring wedding color palettes that complement gallery art"`

---

### 2. "Corporate Retreat Planning: 2025 Trends Memphis Companies Need to Know"
**Score:** 89/100
| Factor              | Rating                                       |
|---------------------|----------------------------------------------|
| Keyword Opportunity | Medium - "corporate retreat planning" 890/mo |
| Persona Fit         | Primary - Corporate Claire                   |
| Seasonal Timing     | Good - Q2 planning cycle                     |
| Competitive Gap     | No Memphis-specific guides                   |
| Business Priority   | High - Weekday revenue                       |

**Why Now:** Corporate event planners finalize Q3-Q4 budgets in Q1-Q2. Position Pike & West for consideration.

**Effort:** Deep dive (2,000+ words)
**Quick Start:** `/blog-outline "corporate retreat planning trends 2025"`

---

### 3. "What to Expect on Your Pike & West Venue Tour"
**Score:** 87/100
| Factor              | Rating                                   |
|---------------------|------------------------------------------|
| Keyword Opportunity | Low-medium - "wedding venue tour" 480/mo |
| Persona Fit         | All personas                             |
| Seasonal Timing     | Evergreen                                |
| Competitive Gap     | Most venues lack this content            |
| Business Priority   | High - Conversion content                |

**Why Now:** High-intent searchers in decision phase. Reduces friction to booking tours.

**Effort:** Quick win (800-1,000 words)
**Quick Start:** `/blog-draft "what to expect pike and west venue tour"`

---

## Medium Priority (This Month)

### 4. "Memphis Wedding Vendor Spotlight: Our Favorite Caterers"
**Score:** 82/100
- Builds partner relationships
- Local SEO benefit
- Targets couples in planning phase
**Effort:** Standard

### 5. "Art Exhibition Opening: Behind the Scenes at Pike & West"
**Score:** 78/100
- Serves Art Collector Alex persona
- Differentiates from competitor venues
- Social media amplification potential
**Effort:** Standard (with photos/video)

### 6. "Intimate Wedding Ideas: 50 Guests or Fewer"
**Score:** 76/100
- Growing micro-wedding trend
- Strong keyword opportunity
- Aligns with Pike & West's intimate setting
**Effort:** Deep dive

---

## Lower Priority (This Quarter)

### 7. "Gallery Application: What Artists Should Know"
- Serves artist community
- Low search volume but relationship building
**Effort:** Quick win

### 8. "Memphis Art Scene: Where to Go After Pike & West"
- Local content clustering
- Partnership opportunities
- Long-tail SEO
**Effort:** Standard

### 9. "Rehearsal Dinner Ideas for the Memphis Foodie Couple"
- Secondary content
- Strong local tie-in
**Effort:** Quick win

---

## Content Balance Check

| Content Pillar | Target | Current | Gap          |
|----------------|--------|---------|--------------|
| Weddings       | 50%    | 60%     | Over by 10%  |
| Corporate      | 25%    | 15%     | Under by 10% |
| Art/Culture    | 15%    | 20%     | Over by 5%   |
| Local/Memphis  | 10%    | 5%      | Under by 5%  |

**Recommendation:** Prioritize corporate and local content to balance portfolio.

---

## Seasonal Calendar Notes

- **February-April:** Peak wedding content priority
- **May-June:** Corporate Q3 planning content
- **September:** Holiday party planning content
- **January:** Annual planning/trend content

---

## Quick Actions

```bash
# Start top priority post
/blog-outline "spring wedding color palettes that complement gallery art"

# Audit existing content
/content-audit

# Check specific persona coverage
/content-queue --persona corporate-claire
````

````text

## Configuration

### Command File Location

```text
.claude/commands/content-queue.md
````

### Command Definition

```yaml
---
name: content-queue
description: Show prioritized content recommendations
arguments: []
---

# /content-queue Command

When invoked:
1. Load editorial calendar and content pillars
2. Analyze current content inventory
3. Check seasonal/timing factors
4. Score opportunities on 5 factors
5. Present prioritized recommendations
6. Include quick-start prompts
```

## Options

| Option      | Description                                  | Default |
|-------------|----------------------------------------------|---------|
| `--type`    | Filter by content type (blog, social, email) | All     |
| `--persona` | Filter by target persona                     | All     |
| `--quarter` | Show for specific quarter                    | Current |
| `--limit`   | Number of recommendations                    | 10      |

## Related Commands

- [/blog-outline](./blog-outline.md) - Start planning recommended content
- [/content-audit](./content-audit.md) - Review existing content
- [/persona](./persona.md) - Deep dive on persona needs

## Data Sources

The command analyzes:

- `docs/marketing-strategy/04-content/editorial-calendar.md`
- `docs/marketing-strategy/04-content/content-pillars.md`
- `docs/marketing-strategy/03-seo/keyword-strategy.md`
- `docs/marketing-strategy/02-personas/*.md`
- `content/blog/*.md` (existing content)
