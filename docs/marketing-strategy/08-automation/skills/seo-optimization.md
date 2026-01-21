# Skill: SEO Optimization

> Auto-activates during SEO and keyword discussions to load research, competitor analysis, and optimization guidelines.

## Purpose

This skill ensures all content is optimized for search engines while maintaining Pike & West's brand voice. It loads keyword research, competitor insights, and SEO best practices specific to the event venue industry in Memphis.

## Activation Triggers

The skill activates when:

- Discussing keywords, SEO, or search rankings
- Working on meta descriptions or title tags
- Analyzing competitor content
- Optimizing existing content for search
- Mentioning "Google", "search", "ranking", "organic traffic"

## What It Loads

### Keyword Research

```yaml
primary_keywords:
  - keyword: "wedding venues Germantown TN"
    volume: 320/mo
    difficulty: 42
    intent: transactional

  - keyword: "event venue Memphis"
    volume: 880/mo
    difficulty: 58
    intent: commercial

  - keyword: "art gallery wedding venue"
    volume: 590/mo
    difficulty: 35
    intent: commercial

secondary_keywords:
  - keyword: "unique wedding venues Memphis"
    volume: 210/mo
    difficulty: 38

  - keyword: "corporate event space Memphis"
    volume: 170/mo
    difficulty: 45

  - keyword: "private event venue Germantown"
    volume: 90/mo
    difficulty: 28

long_tail_opportunities:
  - "intimate wedding venue Memphis area"
  - "art gallery corporate event Memphis"
  - "boutique wedding venue Tennessee"
  - "unique rehearsal dinner venue Germantown"
```

### Competitor Analysis

```yaml
competitors:
  - name: "The Cadre Building"
    strengths: ["historic angle", "downtown location", "strong local SEO"]
    weaknesses: ["generic venue positioning", "limited art angle"]

  - name: "The Dixon Gallery"
    strengths: ["established art credibility", "garden space"]
    weaknesses: ["dated website", "limited event focus"]

  - name: "Memphis Brooks Museum"
    strengths: ["brand recognition", "art authority"]
    weaknesses: ["corporate feel", "less intimate"]

differentiation_opportunities:
  - "Boutique intimacy vs. large institution"
  - "Contemporary art focus vs. traditional"
  - "Germantown location (affluent, suburban)"
  - "Art + event fusion positioning"
```

### On-Page SEO Guidelines

```yaml
title_tags:
  format: "[Primary Keyword] | Pike & West - [Modifier]"
  length: 50-60 characters
  examples:
    - "Wedding Venues Germantown TN | Pike & West Art Gallery"
    - "Corporate Event Space Memphis | Pike & West Venue"

meta_descriptions:
  length: 150-160 characters
  include: primary keyword, CTA, unique value prop
  examples:
    - "Discover Pike & West, Germantown's premier art gallery wedding venue. Intimate celebrations surrounded by contemporary art. Schedule your tour today."

headings:
  h1: One per page, includes primary keyword
  h2: Section headers, include secondary keywords naturally
  h3: Subsections, long-tail variations

content_structure:
  minimum_words: 800 for blog posts
  keyword_density: 1-2% for primary keyword
  internal_links: 2-4 per post
  external_links: 1-2 authoritative sources
```

## Behavior

When activated, the skill:

1. **Loads Keyword Data** - Provides relevant keywords for the topic
2. **Suggests Structure** - Recommends heading hierarchy and keyword placement
3. **Checks Competition** - Notes competitor positioning and gaps
4. **Validates Optimization** - Reviews content for SEO best practices
5. **Recommends Improvements** - Suggests specific optimization actions

## Example Session

**User:** I want to optimize our homepage for "wedding venues Germantown TN".

**Claude (with skill active):**

```markdown
**SEO Analysis for "wedding venues Germantown TN"**

**Keyword Data:**
- Search Volume: 320/month
- Difficulty: 42 (moderate)
- Intent: Transactional (ready to book tours)

**Current Competitor Landscape:**
Top 3 ranking pages are general venue directories. Opportunity to rank
with dedicated, high-quality page content.

**Optimization Recommendations:**

1. **Title Tag** (currently 68 chars - too long)
   Current: [review current]
   Suggested: "Wedding Venues Germantown TN | Pike & West Art Gallery" (54 chars)

2. **Meta Description** (158 chars)
   "Discover Germantown's most distinctive wedding venue. Pike & West
   combines contemporary art with intimate celebrations. Schedule your
   private tour today."

3. **H1 Heading**
   Include: "Germantown Wedding Venue" or "Wedding Venues in Germantown"

4. **Content Additions:**
   - Add "Germantown, TN" to location references (currently says "Memphis area")
   - Include neighborhood context (near Saddle Creek, etc.)
   - Add schema markup for EventVenue + LocalBusiness

5. **Internal Linking:**
   - Link to wedding-specific gallery page
   - Link to contact/tour booking page

**Quick Wins:**
- Update alt text on hero image: "Pike & West art gallery wedding venue Germantown TN"
- Add FAQ section with "wedding venue" questions
```

## Configuration

### Skill File Location

```text
.claude/skills/seo-optimization/
├── SKILL.md              # Main skill definition
├── keyword-research.yaml # Keyword data
├── competitors.yaml      # Competitor analysis
└── checklists/
    ├── on-page-seo.md    # On-page checklist
    └── technical-seo.md  # Technical checklist
```

### SKILL.md Structure

```markdown
# SEO Optimization Skill

## Activation
- Keywords: SEO, keyword, search, ranking, Google, organic
- Keywords: meta description, title tag, optimization

## Context Files
- Load: `docs/marketing-strategy/03-seo/keyword-strategy.md`
- Load: `docs/marketing-strategy/03-seo/competitor-analysis.md`

## Instructions
When optimizing content:
1. Identify target keyword(s) and search intent
2. Check competitor landscape for the keyword
3. Apply on-page SEO guidelines
4. Validate against checklist
5. Suggest specific improvements with examples
```

## Integration Points

### With Other Skills

- **marketing-content-creation**: Ensures blog posts are SEO-optimized
- **utm-tracking**: Tracked links for measuring organic traffic

### With Commands

- **`/blog-draft`**: Includes SEO requirements in generated content
- **`/content-audit`**: Uses SEO criteria for evaluation

### With Agents

- **keyword-researcher**: Feeds updated keyword data to this skill

## SEO Checklists

### On-Page SEO

- [ ] Title tag 50-60 characters with primary keyword
- [ ] Meta description 150-160 characters with CTA
- [ ] H1 contains primary keyword
- [ ] H2s include secondary keywords
- [ ] Primary keyword in first 100 words
- [ ] Keyword density 1-2%
- [ ] 2-4 internal links
- [ ] Image alt text includes keywords
- [ ] URL slug contains keyword

### Technical SEO

- [ ] Page loads under 3 seconds
- [ ] Mobile-friendly layout
- [ ] Schema markup implemented
- [ ] Canonical URL set
- [ ] No broken links
- [ ] Sitemap includes page
- [ ] robots.txt allows crawling

### Local SEO (Event Venue Specific)

- [ ] NAP consistent (Name, Address, Phone)
- [ ] Google Business Profile optimized
- [ ] Local keywords in content (Germantown, Memphis)
- [ ] LocalBusiness schema markup
- [ ] Embedded Google Map
