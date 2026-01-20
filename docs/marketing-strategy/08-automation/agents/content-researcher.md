# Agent: Content Researcher

> Autonomous agent that researches competitors, identifies content gaps, and suggests strategic content angles.

## Purpose

The Content Researcher agent performs deep competitive analysis and content gap identification that would take hours of manual research. It operates autonomously to:

- Analyze competitor content strategies
- Identify topics competitors rank for that Pike & West doesn't
- Find content gaps in the market
- Suggest unique angles and differentiators
- Provide data-driven content recommendations

## When to Use

Run this agent:

- **Quarterly** - Full competitive landscape review
- **Before major campaigns** - Identify positioning opportunities
- **When traffic drops** - Find content gaps causing losses
- **New competitor emerges** - Assess their content strategy

## How It Works

### Phase 1: Competitor Identification

The agent identifies and catalogs competitors:

```yaml
direct_competitors:
  - name: "The Cadre Building"
    url: cadrebuilding.com
    type: Event venue, downtown Memphis

  - name: "The Dixon Gallery"
    url: dixon.org
    type: Art venue with event space

  - name: "Memphis Brooks Museum"
    url: brooksmuseum.org
    type: Museum with event rentals

indirect_competitors:
  - name: "409 South Main"
    type: Industrial event space

  - name: "The Atrium at Overton Square"
    type: Urban event venue
```

### Phase 2: Content Audit

For each competitor, the agent analyzes:

- Blog/content frequency
- Topics covered
- Keyword targeting
- Content formats (guides, lists, stories)
- Engagement indicators

### Phase 3: Gap Analysis

Compares competitor coverage to Pike & West:

- Topics competitors cover that we don't
- Keywords they rank for that we don't target
- Content formats we're not using
- Angles unique to Pike & West

### Phase 4: Opportunity Scoring

Ranks opportunities by:

- Search volume potential
- Competition difficulty
- Pike & West differentiator alignment
- Business impact

### Phase 5: Recommendations

Delivers actionable content recommendations with:

- Topic suggestions
- Unique angle for Pike & West
- Keyword targets
- Estimated effort

## Example Output

````markdown
# Content Research Report: Q1 2025

**Agent Run Date:** January 15, 2025
**Competitors Analyzed:** 8
**Content Pieces Reviewed:** 347
**Opportunities Identified:** 23

---

## Executive Summary

Pike & West has strong content coverage in wedding-focused topics but
significant gaps in corporate event content compared to competitors.
The art gallery angle is underutilized as a differentiator.

**Key Finding:** No Memphis-area competitor owns the "art gallery wedding"
niche in content. This is Pike & West's biggest opportunity.

---

## Competitor Content Overview

### The Cadre Building
**Content Strength:** 7/10
**Publishing Frequency:** 2-3 posts/month

**Strong Topics:**
- Downtown Memphis event planning
- Historic venue features
- Corporate event case studies

**Weak Topics:**
- Wedding planning content
- Local vendor spotlights
- Behind-the-scenes content

---

### The Dixon Gallery
**Content Strength:** 5/10
**Publishing Frequency:** 1 post/month

**Strong Topics:**
- Art exhibition announcements
- Artist features
- Museum events

**Weak Topics:**
- Wedding/event content
- Practical planning guides
- SEO-optimized content

---

## Content Gap Analysis

### High-Value Gaps (Competitors Own, We Don't)

| Topic                              | Competitor | Search Volume | Pike & West Angle            |
|------------------------------------|------------|---------------|------------------------------|
| "Memphis corporate retreat venues" | Cadre      | 480/mo        | Art-infused retreats         |
| "Downtown Memphis wedding"         | Multiple   | 1.2K/mo       | Germantown alternative angle |
| "Private event space Memphis"      | 409 South  | 590/mo        | Gallery intimacy             |

### Unclaimed Opportunities (No Competitor Owns)

| Topic                              | Search Volume | Difficulty | Pike & West Fit |
|------------------------------------|---------------|------------|-----------------|
| "Art gallery wedding Memphis"      | 210/mo        | 28         | Perfect         |
| "Intimate wedding venue Tennessee" | 390/mo        | 35         | Strong          |
| "Contemporary art event space"     | 170/mo        | 22         | Perfect         |
| "Germantown event venue"           | 140/mo        | 24         | Strong          |

---

## Differentiation Opportunities

### Pike & West Unique Angles

1. **Art as Experience**
   - No competitor positions art as integral to events
   - Opportunity: "Your wedding guests won't just attend, they'll experience"
   - Content series: "Art-Inspired Events"

2. **Germantown Luxury**
   - Most competitors are downtown or midtown
   - Opportunity: Suburban sophistication positioning
   - Content: "Why Germantown's Most Discerning Hosts Choose Pike & West"

3. **Gallery Intimacy**
   - Large venues dominate content
   - Opportunity: Own the "intimate" conversation
   - Content series: "Perfectly Intimate" celebrations

---

## Recommended Content Plan

### Immediate Opportunities (Next 30 Days)

1. **"Art Gallery Wedding Memphis: The Complete Guide"**
   - Search volume: 210/mo
   - Competition: Low
   - Estimated rank time: 2-3 months
   - Effort: Deep dive (2,000 words)

2. **"Why Choose Germantown for Your Wedding Venue"**
   - Search volume: 140/mo (local intent)
   - Competition: Very low
   - Estimated rank time: 1-2 months
   - Effort: Standard (1,200 words)

3. **"Corporate Retreat Ideas That Inspire Creativity"**
   - Search volume: 720/mo
   - Competition: Medium
   - Pike & West angle: Art-driven creativity
   - Effort: Deep dive (2,000 words)

### Medium-Term (60-90 Days)

4. **"Intimate Wedding Venues Tennessee"** (location page)
5. **"Art and Wine Events Memphis"** (positions for non-wedding)
6. **"Private Gallery Rental Memphis"** (corporate focus)

### Content Series Recommendations

**"Behind the Art" Series**
- Monthly feature on gallery artwork
- Ties art to event possibilities
- Differentiates from all competitors

**"Memphis Venues Compared" Series**
- Honest comparison content
- Captures comparison searches
- Positions Pike & West strengths

---

## Competitor Weaknesses to Exploit

| Competitor     | Weakness                | Our Opportunity              |
|----------------|-------------------------|------------------------------|
| Cadre Building | No intimate option      | Own "intimate" keyword space |
| Dixon Gallery  | Poor SEO/modern content | Outrank on art venue terms   |
| Brooks Museum  | Corporate feeling       | Emphasize boutique warmth    |
| 409 South Main | No art angle            | Art + industrial contrast    |

---

## Technical Recommendations

1. **Schema Markup Gap**
   - Most competitors lack event venue schema
   - Implement: EventVenue, LocalBusiness, FAQPage

2. **Local SEO Opportunity**
   - Germantown-specific content is thin market-wide
   - Create Germantown landing page

3. **Content Freshness**
   - Most competitor content is stale (12+ months)
   - Regular updates will signal relevance to Google

---

## Next Steps

```bash
# Generate outline for top opportunity
/blog-outline "Art Gallery Wedding Memphis Complete Guide"

# Check current content against gaps
/content-audit

# Update content queue with new priorities
/content-queue
````

---

_Report generated by Content Researcher Agent. Next scheduled run: April 2025_

````text

## Configuration

### Agent File Location

```text
.claude/agents/content-researcher/
├── AGENT.md              # Agent definition
├── competitors.yaml      # Competitor list
└── prompts/
    ├── analyze.md        # Analysis prompts
    └── report.md         # Report template
````

### AGENT.md Structure

```markdown
# Content Researcher Agent

## Model
Use: claude-opus-4-5-20251101 (complex analysis task)

## Tools
- WebSearch (competitor research)
- WebFetch (content analysis)
- Read (local file analysis)
- Write (report generation)

## Workflow
1. Load competitor list from competitors.yaml
2. For each competitor:
   - Analyze content/blog section
   - Identify topics and keywords
   - Assess content quality
3. Compare to Pike & West content inventory
4. Score opportunities
5. Generate report

## Output
Save report to: docs/marketing-strategy/03-seo/content-research-[date].md
```

## Running the Agent

```bash
# Full research run
claude agent content-researcher

# Focused on specific competitor
claude agent content-researcher --focus "The Cadre Building"

# Quick gap check (no full report)
claude agent content-researcher --quick
```

## Agent Parameters

| Parameter       | Description                      | Default |
|-----------------|----------------------------------|---------|
| `--competitors` | Number of competitors to analyze | 5       |
| `--focus`       | Focus on specific competitor     | None    |
| `--quick`       | Skip detailed analysis           | false   |
| `--output`      | Custom output location           | Auto    |

## Scheduling

Recommended schedule:

- **Full run:** Quarterly (January, April, July, October)
- **Quick check:** Monthly
- **Ad-hoc:** When planning major content initiatives

## Related Tools

- [keyword-researcher](./keyword-researcher.md) - Pairs with this for keyword data
- [/content-queue](../commands/content-queue.md) - Uses research output
- [/content-audit](../commands/content-audit.md) - Compares against findings
