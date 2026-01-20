---
description: Review existing content against strategy, SEO requirements, and brand guidelines
allowed-tools: Read, Glob, Grep
arguments:
  - name: path
    description: Specific file or directory to audit (optional, defaults to all blog content)
    required: false
---

# /content-audit Command

Review existing Pike & West content for SEO optimization, brand voice, and freshness.

## When Invoked

1. **Content Inventory**
   - Scan `content/blog/*.md` for all published pieces (or specific path if provided)
   - Extract metadata: dates, categories, keywords, word counts
   - Note content age and last update date

2. **SEO Analysis**
   For each piece, check:
   - Title tag optimization (50-60 chars, includes keyword)
   - Meta description quality (150-160 chars)
   - Keyword targeting (primary in title, H1, first 100 words)
   - Heading structure (proper H2/H3 hierarchy, no skipped levels)
   - Internal link count (target: 2-4 per post)
   - Image alt text presence

3. **Brand Voice Review**
   Check for:
   - "venue" overuse (should vary with "gallery", "space", "setting")
   - "party" usage (should be "celebration", "gathering")
   - Generic CTAs (should be branded: "Schedule your private tour")
   - Missing art/gallery angle
   - Tone consistency (sophisticated but warm)

4. **Freshness Check**
   Flag content that:
   - Is older than 12 months without updates
   - Contains outdated references (pricing, dates, events)
   - Has broken internal links
   - Is thin content (under 800 words)

5. **Generate Report**

## Output Format

```markdown
# Pike & West Content Audit Report

**Audit Date:** [date]
**Content Analyzed:** [count] posts
**Overall Health Score:** [score]/100

## Executive Summary
| Category         | Score  | Status   |
|------------------|--------|----------|
| SEO Optimization | XX/100 | [status] |
| Brand Voice      | XX/100 | [status] |
| Freshness        | XX/100 | [status] |
| Internal Linking | XX/100 | [status] |

## Critical Issues (Fix This Week)
[Posts scoring below 50 with specific issues and fixes]

## High Priority (Fix This Month)
[Posts scoring 50-70 with issues]

## Quick Wins (Minor Updates)
[Posts needing small fixes for significant improvement]

## Healthy Content (No Action Needed)
[Posts meeting all standards]

## Brand Voice Analysis
[Common issues with examples and fixes]

## Internal Linking Report
[Link distribution and orphan pages]

## Recommended Update Schedule
[Prioritized action plan]
```

## Scoring Criteria

### SEO (25 points)

- Title optimization: 5 pts
- Meta description: 5 pts
- Keyword placement: 5 pts
- Heading structure: 5 pts
- Internal links: 5 pts

### Brand Voice (25 points)

- Tone consistency: 10 pts
- No generic language: 10 pts
- Art/gallery angle: 5 pts

### Freshness (25 points)

- Updated within 12 months: 15 pts
- No outdated info: 10 pts

### Technical (25 points)

- Image alt text: 10 pts
- Working links: 10 pts
- Adequate length: 5 pts
