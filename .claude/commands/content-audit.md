---
description: Review existing content against strategy, SEO requirements, and brand guidelines using parallel sub-agents
allowed-tools: Read, Glob, Grep, Task, TodoWrite
arguments:
  - name: path
    description: Specific file or directory to audit (optional, defaults to all blog content)
    required: false
---

# /content-audit Command

Map-reduce content audit for Pike & West blog posts. Spawns parallel sub-agents
for each piece of content, then aggregates results for cross-article analysis.

---

## Prime Directives

**The audit exists to answer these questions:**

### 1. Is Each Post Discoverable? (SEO)

- Can search engines understand what this post is about?
- Will it appear for relevant searches?
- Does it have proper metadata for rich snippets?

### 2. Does Each Post Convert? (Brand & CTA)

- Does it sound like Pike & West (sophisticated, warm, art-focused)?
- Does it guide readers toward booking a tour or contacting us?
- Does it avoid language that cheapens the brand?

### 3. Is Each Post Engaging? (Editorial Styling)

- Does it use visual breaks to prevent reader fatigue?
- Are key insights highlighted for scanners?
- Does it look like premium magazine content?

### 4. Is the Content Portfolio Healthy? (Cross-Article)

- Are we competing with ourselves for keywords?
- Are there content gaps in our coverage?
- Is traffic spread across posts or concentrated?
- Are all areas of content kept fresh?

---

## Execution Flow

### Phase 1: Content Discovery

1. Scan for blog posts:

   ```
   content/blog/*.md (excluding _index.md)
   ```

   Or use provided path argument.

2. Create inventory with basic metadata:
   - File path
   - Title (from front matter)
   - Date and lastmod
   - Word count (approximate)

3. Report: "Found X posts to audit. Launching parallel analysis..."

### Phase 2: Map (Parallel Sub-Agents)

For EACH post, launch the `content-auditor` agent with this prompt:

```text
Audit this blog post and return STRUCTURED DATA for aggregation.

File: [filepath]

You MUST return your analysis in the EXACT JSON format specified in your
instructions. This data will be parsed programmatically for cross-article
analysis.

Focus on:
1. SEO signals and keyword targeting
2. Brand voice compliance
3. Editorial styling completeness
4. Freshness and accuracy
5. Technical quality

Return the structured audit result.
```

**Important:** Launch ALL sub-agents in parallel using multiple Task tool calls
in a single message. Do not wait for one to complete before starting the next.

### Phase 3: Reduce (Aggregation & Cross-Analysis)

After all sub-agents complete, aggregate results and perform cross-article analysis:

#### 3.1 Individual Aggregation

- Collect all audit results
- Sort by score (lowest first for priority)
- Calculate overall portfolio health score

#### 3.2 Keyword Cannibalization Detection

Using the `primary_keyword` and `secondary_keywords` from each result:

- Group posts by similar keywords
- Flag when 2+ posts target the same primary keyword
- Flag when a secondary keyword appears as another post's primary
- Recommend: merge, differentiate, or redirect

#### 3.3 Topic Overlap Analysis

Using the `topic_summary` from each result:

- Identify posts covering similar topics
- Flag potential content consolidation opportunities
- Check if topics are sufficiently differentiated

#### 3.4 Internal Link Health

Using the `internal_links_out` from each result:

- Build a link graph
- Identify orphan posts (no inbound links)
- Identify link hoarders (too many links to one post)
- Identify missing obvious links between related content

#### 3.5 Content Freshness Distribution

Using dates and freshness scores:

- Identify stale content areas
- Check if seasonal content is updated
- Flag posts that need refreshing

#### 3.6 Editorial Consistency

Using editorial styling scores:

- Calculate average styling completeness
- Identify posts that look inconsistent with the rest
- Flag posts dragging down visual quality

---

## Output Format

```markdown
# Pike & West Content Audit Report

**Audit Date:** [date]
**Posts Analyzed:** [count]
**Portfolio Health Score:** [score]/100

---

## Executive Summary

| Metric                  | Value    | Status   |
|-------------------------|----------|----------|
| Average Post Score      | XX/100   | [🟢🟡🔴] |
| SEO Health              | XX/100   | [🟢🟡🔴] |
| Brand Voice             | XX/100   | [🟢🟡🔴] |
| Editorial Styling       | XX/100   | [🟢🟡🔴] |
| Keyword Cannibalization | X issues | [🟢🟡🔴] |
| Content Gaps            | X areas  | [🟢🟡🔴] |

---

## Critical Issues (Fix This Week)

### Keyword Cannibalization
[Posts competing for the same keywords with recommendations]

### Posts Below 50 Score
[Specific issues and fixes for each]

---

## Cross-Article Findings

### Topic Overlap
[Posts covering similar ground, with recommendations]

### Internal Linking Issues
- **Orphan posts:** [posts with no inbound links]
- **Under-linked:** [posts that should link to each other]

### Freshness Concerns
[Posts that need updating, grouped by urgency]

---

## Individual Post Scores

| Post    | Score | SEO | Voice | Style | Fresh | Issues  |
|---------|-------|-----|-------|-------|-------|---------|
| [title] | XX    | X   | X     | X     | X     | [count] |
| ...     | XX    | X   | X     | X     | X     | [count] |

---

## High Priority (Fix This Month)

[Posts scoring 50-70 with specific issues]

---

## Quick Wins

[Easy fixes across multiple posts that improve scores significantly]

---

## Recommended Update Schedule

| Week | Post   | Action                        | Priority |
|------|--------|-------------------------------|----------|
| 1    | [post] | [fix keyword cannibalization] | Critical |
| 1    | [post] | [add editorial styling]       | High     |
| 2    | [post] | [refresh stale content]       | Medium   |
| ...  | ...    | ...                           | ...      |

---

## Content Gap Analysis

### Missing Topics
Based on existing coverage, consider creating content for:
- [topic suggestion based on gaps]
- [seasonal content missing]

### Underserved Keywords
Keywords mentioned but not targeted as primary:
- [keyword] → could be its own post
```

---

## Technical Notes

### Sub-Agent Configuration

- **Model:** haiku (fast, cost-effective)
- **Tools:** Read, Glob, Grep (read-only)
- **Parallelism:** All agents launch simultaneously

### Error Handling

- If a sub-agent fails, note the failure and continue with others
- Include failed posts in final report with "audit failed" status
- Suggest manual review for failed audits

### Performance

- With 6 posts: ~10-15 seconds total
- With 20 posts: ~20-30 seconds total
- Sub-agents run in parallel, so time scales with slowest agent, not count
