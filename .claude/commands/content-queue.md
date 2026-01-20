---
description: Show prioritized content recommendations based on strategy, seasonality, and gaps
allowed-tools: Read, Glob, Grep
---

# /content-queue Command

Display prioritized content recommendations for Pike & West's content strategy.

## When Invoked

1. **Load Strategy Documents**
   - Read `docs/marketing-strategy/04-content-strategy/editorial-calendar.md` if it exists
   - Read `docs/marketing-strategy/04-content-strategy/content-pillars.md` if it exists
   - Read `docs/marketing-strategy/03-seo-strategy/keyword-strategy.md` if it exists

2. **Analyze Current Content**
   - Scan `content/blog/*.md` for existing posts
   - Note publish dates, categories, and personas targeted
   - Identify content balance across pillars (weddings, corporate, art/culture, local)

3. **Score Opportunities**
   For each potential content piece, evaluate:
   - **Keyword opportunity** - search volume and difficulty
   - **Persona alignment** - primary, secondary, or tertiary fit
   - **Seasonal relevance** - current timing considerations
   - **Competitive gap** - what competitors lack
   - **Business priority** - revenue potential

4. **Present Recommendations**
   Format output as:

   ```markdown
   # Pike & West Content Queue

   **Generated:** [date]
   **Current Season:** [season context]
   **Content Balance:** [current distribution]

   ## High Priority (This Week)
   [Top 3 recommendations with scores and quick-start prompts]

   ## Medium Priority (This Month)
   [Next 3-5 recommendations]

   ## Lower Priority (This Quarter)
   [Additional suggestions]

   ## Content Balance Check
   [Table showing target vs current distribution]

   ## Quick Actions
   [Commands to start recommended content]
   ```

5. **Include Quick-Start Prompts**
   For each recommendation, provide:
   - `/blog-outline "[topic]"` prompt
   - Estimated effort level (quick win, standard, deep dive)
   - Why now rationale

## Output Requirements

- Present top 10-15 recommendations
- Include scoring table for top items
- Note seasonal calendar considerations
- Provide content balance analysis
- Include quick-start commands for each recommendation
