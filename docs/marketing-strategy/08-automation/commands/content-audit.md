# Command: /content-audit

> Review existing content against strategy, SEO requirements, and brand guidelines.

## Usage

```bash
/content-audit
```

**Audit specific content:**

```bash
/content-audit content/blog/wedding-venue-guide.md
/content-audit --type blog
/content-audit --older-than 6months
```

## Purpose

This command evaluates existing content for:

- SEO optimization gaps
- Brand voice consistency
- Outdated information
- Missing internal links
- Underperforming pieces that need updates

Use this command for:

- Quarterly content reviews
- Identifying update opportunities
- Pre-launch audits
- Improving existing content ROI

## What It Does

### Step 1: Content Inventory

- Scans content directory for all published pieces
- Catalogs metadata (dates, categories, keywords)
- Notes content age and last update

### Step 2: SEO Analysis

For each piece, checks:

- Title tag optimization
- Meta description quality
- Keyword targeting
- Heading structure
- Internal link count
- Image alt text

### Step 3: Brand Voice Review

- Scans for off-brand language
- Checks for consistent terminology
- Identifies generic venue language to replace
- Notes tone inconsistencies

### Step 4: Performance Indicators

- Flags content older than 12 months without updates
- Identifies thin content (under 800 words)
- Notes missing CTAs
- Checks for broken internal links

### Step 5: Recommendations

- Prioritizes issues by impact
- Provides specific fix suggestions
- Estimates effort for updates

## Example Output

````markdown
# Pike & West Content Audit Report

**Audit Date:** February 15, 2025
**Content Analyzed:** 24 blog posts
**Overall Health Score:** 72/100

---

## Executive Summary

| Category         | Score  | Status          |
|------------------|--------|-----------------|
| SEO Optimization | 68/100 | Needs attention |
| Brand Voice      | 85/100 | Good            |
| Freshness        | 65/100 | Updates needed  |
| Internal Linking | 70/100 | Moderate gaps   |

**Top Priority:** 5 posts need immediate attention
**Quick Wins:** 8 posts need minor updates
**Healthy:** 11 posts meeting standards

---

## Critical Issues (Fix This Week)

### 1. "Wedding Venues in Memphis" (Published: March 2024)

**URL:** `/blog/wedding-venues-memphis/`
**Health Score:** 45/100

| Issue                      | Severity | Fix                          |
|----------------------------|----------|------------------------------|
| Outdated pricing mentioned | Critical | Remove or update to current  |
| Missing meta description   | High     | Add 150-160 char description |
| Only 1 internal link       | Medium   | Add 2-3 more relevant links  |
| No CTA in conclusion       | Medium   | Add tour scheduling CTA      |

**Recommended Action:** Full rewrite - content is dated and underperforming
**Effort:** 2-3 hours

---

### 2. "Corporate Event Planning Tips" (Published: June 2024)

**URL:** `/blog/corporate-event-planning-tips/`
**Health Score:** 52/100

| Issue                          | Severity | Fix                          |
|--------------------------------|----------|------------------------------|
| Title doesn't include location | High     | Add "Memphis" to title       |
| Thin content (620 words)       | High     | Expand to 1,000+ words       |
| Generic language throughout    | Medium   | Apply brand voice guidelines |

**Brand Voice Flags:**
- "our venue" (5 occurrences) - vary with "the gallery", "our space"
- "party" (3 occurrences) - replace with "celebration", "gathering"
- Missing art/gallery angle entirely

**Recommended Action:** Expand and rebrand
**Effort:** 2 hours

---

## High Priority (Fix This Month)

### 3. "Rehearsal Dinner Ideas"
**Score:** 58/100
- Missing secondary keywords
- No images with alt text
- Last updated 14 months ago
**Effort:** 1 hour

### 4. "Art Gallery Wedding Inspiration"
**Score:** 62/100
- Meta description too long (185 chars)
- Heading hierarchy skips H3
- Could add more internal links
**Effort:** 30 minutes

### 5. "Memphis Wedding Trends 2024"
**Score:** 55/100
- Year in title is outdated
- Content needs 2025 update
- Good candidate for annual refresh
**Effort:** 1.5 hours

---

## Quick Wins (Minor Updates)

These posts need small fixes for significant improvement:

| Post                         | Issue                    | Fix Time |
|------------------------------|--------------------------|----------|
| "Unique Venue Ideas"         | Add meta description     | 5 min    |
| "Event Planning Checklist"   | Add CTA                  | 10 min   |
| "Gallery Tour Guide"         | Fix broken link          | 5 min    |
| "Wedding Photography Tips"   | Add alt text to 3 images | 10 min   |
| "Corporate Retreat Benefits" | Update internal links    | 15 min   |
| "Memphis Date Night Ideas"   | Add schema markup        | 15 min   |
| "Nonprofit Event Hosting"    | Fix heading hierarchy    | 10 min   |
| "Intimate Wedding Guide"     | Expand thin section      | 30 min   |

**Total Quick Win Time:** ~1.5 hours for 8 improvements

---

## Healthy Content (No Action Needed)

These 11 posts meet all standards:

- "5 Reasons Art Gallery Wedding Is Unforgettable" (Score: 92)
- "Wedding Venue Questions to Ask" (Score: 88)
- "Corporate Event Space Comparison" (Score: 86)
- [8 more posts...]

---

## Brand Voice Analysis

**Overall Voice Score:** 85/100

**Common Issues Found:**

| Issue             | Occurrences | Example                | Fix                                 |
|-------------------|-------------|------------------------|-------------------------------------|
| "venue" overuse   | 47          | "our venue offers"     | Vary: "gallery", "space", "setting" |
| "party" usage     | 12          | "host your party"      | Replace: "celebration", "gathering" |
| Generic CTAs      | 8           | "Contact us today"     | Brand: "Schedule your private tour" |
| Missing art angle | 4 posts     | No gallery/art mention | Add art-forward language            |

**Positive Patterns:**
- "Life as Art" tagline used effectively in 18 posts
- Sensory language present in most wedding content
- Consistent use of "Pike & West" (not "P&W" or variations)

---

## Internal Linking Report

**Average Links Per Post:** 2.3 (target: 3-4)

**Most Linked Pages:**
1. /contact - 21 links (good)
2. /gallery - 15 links (good)
3. /about - 8 links (could increase)

**Orphan Pages (no internal links pointing to them):**
- /blog/artist-application-guide/ - needs 2-3 links from related content
- /blog/memphis-art-scene-guide/ - needs links from event content

**Linking Opportunities:**
- Wedding posts should link to "Venue Tour Guide"
- Corporate posts should link to "Event Planning Checklist"
- All posts should have at least one link to /contact

---

## Recommended Update Schedule

**Week 1:**
- Fix 5 critical issues
- Complete 4 quick wins

**Week 2:**
- Fix 3 high priority issues
- Complete remaining quick wins

**Week 3:**
- Address brand voice issues across all flagged posts

**Week 4:**
- Internal linking improvements
- Final review and publish updates

---

## Quick Actions

```bash
# Audit specific post
/content-audit content/blog/wedding-venues-memphis.md

# Generate updated version of flagged post
/blog-draft "wedding venues in Memphis 2025" --update

# Check only SEO issues
/content-audit --check seo
````

````text

## Configuration

### Command File Location

```text
.claude/commands/content-audit.md
````

### Command Definition

```yaml
---
name: content-audit
description: Review content against strategy and guidelines
arguments:
  - name: path
    description: Specific file or directory to audit
    required: false
---

# /content-audit Command

When invoked:
1. Scan content directory for all posts
2. Analyze each post for SEO, voice, freshness
3. Score on multiple dimensions
4. Identify specific issues with fixes
5. Prioritize recommendations
6. Generate actionable report
```

## Options

| Option         | Description                        | Default |
|----------------|------------------------------------|---------|
| `--type`       | Content type to audit              | All     |
| `--older-than` | Filter by age                      | None    |
| `--check`      | Specific check (seo, voice, links) | All     |
| `--export`     | Export to CSV                      | false   |

## Related Commands

- [/content-queue](./content-queue.md) - Find new content to create
- [/blog-draft](./blog-draft.md) - Rewrite flagged content

## Audit Criteria

### SEO Checklist

- [ ] Title tag 50-60 characters
- [ ] Meta description 150-160 characters
- [ ] Primary keyword in H1
- [ ] Keyword in first 100 words
- [ ] 3-4 internal links
- [ ] All images have alt text
- [ ] Proper heading hierarchy

### Brand Voice Checklist

- [ ] No generic "venue" overuse
- [ ] Art/gallery angle present
- [ ] Sophisticated tone maintained
- [ ] Branded CTA language
- [ ] Sensory language included

### Freshness Checklist

- [ ] Published within 18 months OR updated within 12
- [ ] No outdated references (pricing, dates, events)
- [ ] Links all working
- [ ] Information still accurate
