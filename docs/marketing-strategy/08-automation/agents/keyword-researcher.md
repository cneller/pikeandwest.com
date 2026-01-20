# Agent: Keyword Researcher

> Autonomous agent that analyzes search trends, identifies keyword opportunities, and updates targeting strategy.

## Purpose

The Keyword Researcher agent continuously monitors and analyzes keyword opportunities for Pike & West. It operates autonomously to:

- Track search volume and difficulty changes
- Identify emerging keyword opportunities
- Monitor competitor keyword gains/losses
- Suggest new targeting opportunities
- Update keyword strategy documentation

## When to Use

Run this agent:

- **Monthly** - Regular keyword health check
- **Seasonally** - Capture seasonal keyword trends
- **After content publishes** - Track new content performance
- **When rankings drop** - Diagnose keyword issues

## How It Works

### Phase 1: Current Keyword Audit

Reviews existing keyword targets:

```yaml
tracked_keywords:
  primary:
    - keyword: "wedding venues Germantown TN"
      current_rank: 8
      previous_rank: 12
      volume: 320/mo
      trend: improving

    - keyword: "event venue Memphis"
      current_rank: 15
      previous_rank: 14
      volume: 880/mo
      trend: declining

  secondary:
    - keyword: "art gallery wedding"
      current_rank: 4
      previous_rank: 6
      volume: 590/mo
      trend: improving
```

### Phase 2: Trend Analysis

Identifies trending and declining searches:

- Seasonal patterns
- Year-over-year changes
- Emerging related queries
- Question-based searches

### Phase 3: Opportunity Discovery

Finds new keyword opportunities:

- Related searches Pike & West doesn't target
- Long-tail variations with low competition
- Question keywords for FAQ content
- Local modifiers (neighborhoods, areas)

### Phase 4: Competitor Monitoring

Tracks competitor keyword positions:

- Keywords they've gained
- Keywords they've lost
- New content targeting specific terms
- Gaps in their strategy

### Phase 5: Strategy Update

Produces actionable recommendations:

- New keywords to target
- Existing content to optimize
- Keywords to deprioritize
- Quick wins available

## Example Output

```markdown
# Keyword Research Report: February 2025

**Agent Run Date:** February 1, 2025
**Keywords Tracked:** 47
**New Opportunities Found:** 12
**Strategy Updates Recommended:** 8

---

## Keyword Health Dashboard

### Primary Keywords (Wedding)

| Keyword                          | Volume  | Rank | Change | Status    |
|----------------------------------|---------|------|--------|-----------|
| wedding venues Germantown TN     | 320/mo  | 8    | +4     | Improving |
| unique wedding venue Memphis     | 210/mo  | 6    | +2     | Improving |
| art gallery wedding              | 590/mo  | 4    | +2     | Improving |
| intimate wedding venue Tennessee | 170/mo  | 11   | -3     | Declining |
| Memphis wedding venues           | 1.9K/mo | 24   | +1     | Stable    |

### Primary Keywords (Corporate)

| Keyword                       | Volume | Rank | Change | Status      |
|-------------------------------|--------|------|--------|-------------|
| corporate event space Memphis | 260/mo | 18   | -2     | Declining   |
| Memphis corporate retreat     | 140/mo | NR   | -      | Not ranking |
| private event venue Memphis   | 320/mo | 12   | +3     | Improving   |

### Secondary Keywords

| Keyword                   | Volume | Rank | Change | Status    |
|---------------------------|--------|------|--------|-----------|
| Germantown event venue    | 90/mo  | 3    | +1     | Strong    |
| art gallery event Memphis | 70/mo  | 2    | -      | Strong    |
| boutique wedding venue    | 480/mo | 19   | -4     | Declining |

---

## Trending Opportunities

### Rising Searches (Year-over-Year)

| Keyword                     | Volume | YoY Change | Difficulty | Recommendation  |
|-----------------------------|--------|------------|------------|-----------------|
| micro wedding venue Memphis | 170/mo | +89%       | 32         | Target now      |
| experiential wedding venue  | 390/mo | +67%       | 41         | Create content  |
| art inspired wedding        | 260/mo | +54%       | 28         | Perfect fit     |
| intimate celebration venue  | 210/mo | +43%       | 35         | Add to strategy |

### Seasonal Patterns

**Current Season (Feb-Apr):** Peak wedding planning searches
- "spring wedding venue" +156% vs. November
- "wedding venue tour" +89% vs. November
- "2025 wedding trends" peaking now

**Prepare For (May-Jul):** Corporate Q3 planning
- "corporate retreat planning" rises in May
- "team building venue Memphis" peaks June

---

## New Keyword Opportunities

### Quick Wins (Low Competition, Good Fit)

| Keyword                     | Volume | Difficulty | Current Content | Action              |
|-----------------------------|--------|------------|-----------------|---------------------|
| gallery wedding reception   | 140/mo | 24         | None            | Create new post     |
| Germantown rehearsal dinner | 50/mo  | 18         | Mentions only   | Dedicated section   |
| Memphis art event venue     | 90/mo  | 22         | Partial         | Optimize existing   |
| contemporary wedding venue  | 210/mo | 31         | None            | Add to wedding page |

### Strategic Opportunities (Higher Competition, High Value)

| Keyword                       | Volume  | Difficulty | Strategy               |
|-------------------------------|---------|------------|------------------------|
| unique wedding venues near me | 2.4K/mo | 52         | Long-term content hub  |
| corporate offsite venue       | 720/mo  | 48         | Case study content     |
| private gallery rental        | 320/mo  | 38         | Dedicated landing page |

---

## Question Keywords (FAQ/Content Ideas)

### Wedding Questions

| Question                                 | Volume  | Content Type  |
|------------------------------------------|---------|---------------|
| how to choose a wedding venue            | 1.3K/mo | Guide         |
| what questions to ask wedding venue      | 880/mo  | Checklist     |
| how much do wedding venues cost Memphis  | 170/mo  | Pricing guide |
| can you have a wedding at an art gallery | 90/mo   | Blog post     |

### Corporate Questions

| Question                        | Volume | Content Type |
|---------------------------------|--------|--------------|
| how to plan a corporate retreat | 480/mo | Guide        |
| what makes a good event venue   | 260/mo | Blog post    |
| how to book a private venue     | 140/mo | Process page |

---

## Competitor Keyword Movements

### The Cadre Building

**Gained:**
- "downtown Memphis wedding" (now rank 4)
- "historic event venue Memphis" (now rank 2)

**Lost:**
- "unique Memphis venue" (dropped from 6 to 15)

**Opportunity:** Target "unique Memphis venue" while they're weak

### The Dixon Gallery

**Gained:**
- "museum wedding Memphis" (now rank 3)

**Lost:**
- "art gallery events" (dropped off page 1)

**Opportunity:** They're not defending art gallery terms

---

## Recommended Strategy Updates

### Add to Primary Keywords

1. **"micro wedding venue Memphis"** - Rising trend, perfect fit
2. **"art gallery wedding Memphis"** - We're close to #1

### Add to Secondary Keywords

1. **"contemporary wedding venue"**
2. **"experiential event venue"**
3. **"Germantown private events"**

### Deprioritize

1. **"Memphis wedding venues"** - Too competitive, low ROI
2. **"event space rental"** - Generic, doesn't differentiate

### Content Actions

| Keyword                     | Action                | Priority |
|-----------------------------|-----------------------|----------|
| micro wedding venue Memphis | New blog post         | High     |
| gallery wedding reception   | New landing section   | High     |
| how to choose wedding venue | Optimize existing FAQ | Medium   |
| corporate retreat planning  | New guide             | Medium   |

---

## Quick Reference: Updated Keyword Targets

### Primary (Focus Resources)
```

wedding venues Germantown TN
unique wedding venue Memphis
art gallery wedding Memphis (NEW)
micro wedding venue Memphis (NEW)
corporate event space Memphis

```text

### Secondary (Opportunistic)
```

intimate wedding venue Tennessee
Germantown event venue
contemporary wedding venue (NEW)
private event venue Memphis
art gallery event Memphis

```text

### Long-Tail (Content Targets)
```

questions to ask wedding venue tour
how to plan art gallery wedding
Memphis corporate retreat ideas
Germantown rehearsal dinner venue

````text

---

## Next Scheduled Run

**Date:** March 1, 2025
**Focus:** Track ranking changes from February content

---

## Quick Actions

```bash
# Create content for top opportunity
/blog-outline "micro wedding venue Memphis complete guide"

# Update keyword strategy document
# Edit: docs/marketing-strategy/03-seo/keyword-strategy.md

# Check content gaps against new keywords
/content-audit --check keywords
````

---

_Report generated by Keyword Researcher Agent. Data sources: Google Search Console, SEMrush API, competitor analysis._

````text

## Configuration

### Agent File Location

```text
.claude/agents/keyword-researcher/
├── AGENT.md              # Agent definition
├── tracked-keywords.yaml # Current keyword list
└── prompts/
    ├── analyze.md        # Analysis prompts
    └── report.md         # Report template
````

### AGENT.md Structure

```markdown
# Keyword Researcher Agent

## Model
Use: claude-sonnet-4-20250514 (efficient for data analysis)

## Tools
- WebSearch (trend research)
- Read (local file analysis)
- Write (report generation)

## Workflow
1. Load tracked keywords from tracked-keywords.yaml
2. Research current rankings and volumes
3. Identify trending searches
4. Discover new opportunities
5. Monitor competitor movements
6. Generate report with recommendations

## Output
Save report to: docs/marketing-strategy/03-seo/keyword-report-[date].md
Update: docs/marketing-strategy/03-seo/keyword-strategy.md (if significant changes)
```

## Running the Agent

```bash
# Full keyword research run
claude agent keyword-researcher

# Focus on specific category
claude agent keyword-researcher --category wedding

# Quick ranking check only
claude agent keyword-researcher --rankings-only
```

## Agent Parameters

| Parameter         | Description                 | Default |
|-------------------|-----------------------------|---------|
| `--category`      | Focus on keyword category   | All     |
| `--rankings-only` | Skip opportunity discovery  | false   |
| `--competitors`   | Include competitor analysis | true    |
| `--output`        | Custom output location      | Auto    |

## Scheduling

Recommended schedule:

- **Full run:** Monthly (1st of month)
- **Rankings check:** Weekly
- **Trend analysis:** Quarterly (with content researcher)

## Data Sources

The agent uses:

- Google Search Console data (if connected)
- Search trend analysis
- Competitor website analysis
- Local search data

## Related Tools

- [content-researcher](./content-researcher.md) - Pairs for content strategy
- [/content-queue](../commands/content-queue.md) - Uses keyword data
- [seo-optimization skill](../skills/seo-optimization.md) - References keyword data

## Keyword Tracking File

The agent maintains `tracked-keywords.yaml`:

```yaml
# docs/marketing-strategy/03-seo/tracked-keywords.yaml

primary:
  - keyword: "wedding venues Germantown TN"
    target_page: /
    current_rank: 8
    goal_rank: 3

  - keyword: "art gallery wedding Memphis"
    target_page: /blog/art-gallery-wedding-guide/
    current_rank: 4
    goal_rank: 1

secondary:
  - keyword: "Germantown event venue"
    target_page: /
    current_rank: 3
    goal_rank: 1

long_tail:
  - keyword: "questions to ask wedding venue"
    target_page: /blog/wedding-venue-questions/
    current_rank: 11
    goal_rank: 5
```
