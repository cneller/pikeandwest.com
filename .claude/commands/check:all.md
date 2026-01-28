---
description: Run all site health checks and produce a unified dashboard
allowed-tools: Read, Glob, Grep, Task, Bash
---

# /check:all Command

Unified dashboard that orchestrates all three check commands and produces a
single summary.

## Purpose

Run all three health checks in parallel and compile results into a single
dashboard showing overall site health, per-check summaries, and the top issues
across all checks.

## Workflow

### Phase 1: Run All Checks in Parallel

Launch all three checks simultaneously using the Task tool:

1. **`/check:config`** (CMS config health)
   - Verifies Sveltia CMS config matches Hugo templates
   - Checks collection schemas, field definitions, archetypes

2. **`/check:seo`** (content SEO/links/freshness)
   - Audits content files for SEO completeness
   - Checks broken links, stale content, front matter integrity

3. **`/check:editorial`** (brand voice/shortcodes/styling)
   - Evaluates editorial quality across blog posts
   - Checks brand voice, pull quotes, dividers, shortcode usage

**Important:** Launch all three as parallel Task tool calls in a single message.

### Phase 2: Compile Dashboard

After all checks complete, aggregate results into a unified report.

### Phase 3: Present Results

```text
# Site Health Dashboard

## Overall Grade: [A/B/C/D/F]

### Config Health (check:config)
- Status: [HEALTHY | NEEDS ATTENTION | CRITICAL]
- Collections: X/Y defined
- Errors: X | Warnings: Y

### Content SEO (check:seo)
- Average score: XX/100
- Pages checked: X
- Errors: X | Warnings: Y

### Editorial Quality (check:editorial)
- Average score: XX/100
- Posts audited: X
- Issues: X high | Y medium | Z low

---

### Top 5 Issues Across All Checks
1. [source] issue description -- fix
2. [source] issue description -- fix
3. [source] issue description -- fix
4. [source] issue description -- fix
5. [source] issue description -- fix

### Run Individual Reports
- `/check:config` for full CMS config details
- `/check:seo` for per-page SEO scorecards
- `/check:editorial` for editorial styling analysis
```

## Grading Rubric

| Grade | Criteria                                                       |
|-------|----------------------------------------------------------------|
| A     | Config HEALTHY, SEO avg 85+, Editorial avg 85+                 |
| B     | Config HEALTHY, SEO avg 70+, Editorial avg 70+                 |
| C     | Config NEEDS ATTENTION or SEO avg 50-69 or Editorial avg 50-69 |
| D     | Config CRITICAL or SEO avg < 50 or Editorial avg < 50          |
| F     | Multiple checks at CRITICAL/below 50                           |

## Notes

- This command orchestrates the other three check commands
- Individual checks can still be run independently for detailed reports
- Use this for a quick overall health assessment
- The grade reflects the weakest area, not the average
