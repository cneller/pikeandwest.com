# Content Prioritization

> Systematic approach to deciding which content to create first based on strategic value, timing, and resource availability.

## Prioritization Scoring Algorithm

Each content piece is scored on a 100-point scale across four dimensions:

### Scoring Dimensions

| Dimension           | Weight | Description                            |
|---------------------|--------|----------------------------------------|
| Seasonal Relevance  | 30 pts | Timing alignment with planning windows |
| Persona Gap         | 25 pts | Filling underserved audience segments  |
| Funnel Gap          | 25 pts | Balancing content across buyer journey |
| Keyword Opportunity | 20 pts | SEO potential and competition          |

### Seasonal Relevance (30 points)

Score based on how well content aligns with current planning windows:

| Timing                           | Score | Example                                  |
|----------------------------------|-------|------------------------------------------|
| Publish now, event in 2-4 months | 30    | Prom content in January for April events |
| Publish now, event in 1-2 months | 20    | Graduation content in late April         |
| Publish now, event in 4-6 months | 15    | Fall content in early spring             |
| Evergreen, no time pressure      | 10    | General planning guides                  |
| Off-season for topic             | 5     | Holiday content in June                  |

### Persona Gap (25 points)

Score based on underrepresentation in current content library:

| Content Coverage       | Score | Threshold  |
|------------------------|-------|------------|
| No content for persona | 25    | 0 posts    |
| Minimal content        | 20    | 1-2 posts  |
| Light coverage         | 15    | 3-5 posts  |
| Moderate coverage      | 10    | 6-10 posts |
| Strong coverage        | 5     | 10+ posts  |

**Target content mix by persona:**

| Persona      | Target % | Priority Boost |
|--------------|----------|----------------|
| Birthday     | 25%      | High if < 20%  |
| Anniversary  | 15%      | High if < 10%  |
| Corporate    | 15%      | High if < 10%  |
| Graduation   | 12%      | High if < 8%   |
| Prom         | 10%      | High if < 6%   |
| Baby Shower  | 8%       | Medium if < 5% |
| Holiday      | 8%       | Seasonal only  |
| Family/Other | 7%       | Low priority   |

### Funnel Gap (25 points)

Score based on underrepresentation at each funnel stage:

| Funnel Balance  | Score | Condition                   |
|-----------------|-------|-----------------------------|
| Critical gap    | 25    | Stage has < 15% of content  |
| Significant gap | 20    | Stage has 15-25% of content |
| Moderate gap    | 15    | Stage has 25-35% of content |
| Slight gap      | 10    | Stage has 35-45% of content |
| On target       | 5     | Stage has 40-50% of content |

**Target content mix by funnel stage:**

| Stage         | Target % | Content Types                            |
|---------------|----------|------------------------------------------|
| Awareness     | 40%      | Inspiration, local guides, trends        |
| Consideration | 40%      | Planning guides, checklists, comparisons |
| Decision      | 20%      | Social proof, venue tours, testimonials  |

### Keyword Opportunity (20 points)

Score based on SEO research:

| Opportunity Level                 | Score | Criteria                      |
|-----------------------------------|-------|-------------------------------|
| High volume, low competition      | 20    | 500+ searches/mo, KD < 30     |
| Medium volume, low competition    | 15    | 100-500 searches/mo, KD < 30  |
| High volume, medium competition   | 12    | 500+ searches/mo, KD 30-50    |
| Low volume, low competition       | 10    | 50-100 searches/mo, KD < 30   |
| Medium volume, medium competition | 8     | 100-500 searches/mo, KD 30-50 |
| Any volume, high competition      | 5     | KD > 50                       |

## Priority Tiers

Based on total score:

| Tier       | Score Range | Action                       |
|------------|-------------|------------------------------|
| A - Urgent | 80-100      | Create this week             |
| B - High   | 65-79       | Create this month            |
| C - Medium | 50-64       | Queue for next month         |
| D - Low    | 35-49       | Backlog, revisit quarterly   |
| E - Defer  | < 35        | Archive, reconsider annually |

## Seasonal Publishing Calendar

Content should be published ahead of event planning timelines:

### Q1 (January - March)

| Publish Month | Event Window     | Priority Topics                      |
|---------------|------------------|--------------------------------------|
| January       | April-May events | Prom, Spring graduations, Easter     |
| February      | May-June events  | Graduation parties, Summer birthdays |
| March         | June-July events | Summer celebrations, July 4th        |

### Q2 (April - June)

| Publish Month | Event Window             | Priority Topics                  |
|---------------|--------------------------|----------------------------------|
| April         | July-August events       | Summer birthdays, Back-to-school |
| May           | August-September events  | Fall weddings, Labor Day         |
| June          | September-October events | Fall celebrations, Halloween     |

### Q3 (July - September)

| Publish Month | Event Window             | Priority Topics                   |
|---------------|--------------------------|-----------------------------------|
| July          | October-November events  | Fall birthdays, Thanksgiving      |
| August        | November-December events | Holiday parties, Corporate events |
| September     | December-January events  | Holiday celebrations, New Year's  |

### Q4 (October - December)

| Publish Month | Event Window            | Priority Topics                   |
|---------------|-------------------------|-----------------------------------|
| October       | January-February events | Winter celebrations, Valentine's  |
| November      | February-March events   | Spring events, Anniversary season |
| December      | March-April events      | Easter, Spring birthdays, Prom    |

## /content-queue Command

Generate a prioritized content queue based on current content library and scoring algorithm.

### Usage

```bash
/content-queue [options]

Options:
  --weeks <n>      Number of weeks to plan (default: 8)
  --min-score <n>  Minimum score threshold (default: 50)
  --persona <name> Filter by specific persona
  --funnel <stage> Filter by funnel stage
  --audit          Include current content audit summary
```

### Output

The command generates:

1. **Priority Queue** - Ranked list of recommended topics with scores
2. **Gap Analysis** - Current persona and funnel distribution vs. targets
3. **Seasonal Alerts** - Time-sensitive content that needs immediate attention
4. **Calendar View** - Suggested publishing schedule for the planning period

### Example Output

```markdown
## Content Queue (Next 8 Weeks)

### Priority A - Create This Week
1. Prom Send-Off Party Guide (Score: 92)
   - Seasonal: 30 | Persona Gap: 25 | Funnel: 20 | Keyword: 17
   - Deadline: Publish by Jan 31 for April proms

2. Graduation Party Planning Checklist (Score: 85)
   - Seasonal: 25 | Persona Gap: 22 | Funnel: 20 | Keyword: 18

### Gap Analysis
- Prom persona: 2% (target 10%) - CRITICAL
- Decision stage: 8% (target 20%) - CRITICAL
- Corporate persona: 5% (target 15%) - HIGH

### Seasonal Alerts
- Prom content: 6 weeks until optimal publish window closes
- Easter content: 8 weeks until event
```

## /content-audit Command

Analyze existing content library against strategic targets.

### Usage

```bash
/content-audit [options]

Options:
  --format <type>  Output format: summary, detailed, csv (default: summary)
  --by <dimension> Group by: persona, funnel, pillar, season (default: all)
  --gaps-only      Show only underperforming areas
```

### Output

The command generates:

1. **Distribution Report** - Content counts by persona, funnel, pillar
2. **Gap Identification** - Areas below target thresholds
3. **Performance Summary** - Top/bottom performing content by traffic
4. **Recommendations** - Specific content suggestions to address gaps

### Example Output

```markdown
## Content Audit Summary

### By Persona
| Persona     | Count | % of Total | Target % | Status    |
|-------------|-------|------------|----------|-----------|
| Birthday    | 12    | 30%        | 25%      | On Target |
| Anniversary | 4     | 10%        | 15%      | GAP       |
| Prom        | 1     | 2.5%       | 10%      | CRITICAL  |
| Corporate   | 2     | 5%         | 15%      | CRITICAL  |
| Graduation  | 3     | 7.5%       | 12%      | GAP       |
| Baby Shower | 4     | 10%        | 8%       | On Target |

### Recommendations
1. Create 4 corporate event posts (currently 10% below target)
2. Create 3 prom posts before February (seasonal urgency)
3. Add 2 anniversary planning guides
```

## Content Scoring Worksheet

Use this worksheet when evaluating new content ideas:

```markdown
## Content Scoring: [Title]

### Basic Info
- Topic:
- Target Persona:
- Funnel Stage:
- Content Pillar:
- Primary Keyword:

### Scoring

#### Seasonal Relevance (max 30)
- Event timing from publish date:
- Score: __/30

#### Persona Gap (max 25)
- Current persona content count:
- Score: __/25

#### Funnel Gap (max 25)
- Current stage percentage:
- Score: __/25

#### Keyword Opportunity (max 20)
- Monthly search volume:
- Keyword difficulty:
- Score: __/20

### Total Score: __/100
### Priority Tier: [ ]

### Notes
-
```

## Batch Prioritization Process

When prioritizing multiple content ideas:

1. **List all candidates** from [blog-topics.md](./blog-topics.md)
2. **Score each** using the worksheet above
3. **Rank by total score** within each priority tier
4. **Apply seasonal adjustments** for time-sensitive content
5. **Confirm resource availability** for top priorities
6. **Assign to content calendar** with realistic deadlines
7. **Create content briefs** for approved topics
