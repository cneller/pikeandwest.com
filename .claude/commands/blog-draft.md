---
description: Generate complete blog post draft with Hugo front matter and SEO optimization
allowed-tools: Read, Glob, Grep, Write, WebSearch
arguments:
  - name: topic
    description: The blog post topic or title
    required: true
---

# /blog-draft Command

Generate a publication-ready blog post draft for Pike & West with Hugo front matter.

## When Invoked with `$ARGUMENTS.topic`

1. **Topic Analysis**
   - Identify target persona (Boutique Bride Bella, Corporate Claire, Social Savvy Sarah, Art Collector Alex)
   - Determine search intent (informational, commercial, transactional)
   - Select primary and secondary keywords
   - Check `content/blog/*.md` for existing content to avoid duplication

2. **Structure Generation**
   - Create outline based on topic and intent
   - Determine optimal post length (800-2000 words based on topic complexity)
   - Plan heading hierarchy (H2s, H3s)
   - Identify internal linking opportunities

3. **Generate Hugo Front Matter**

   ```yaml
   ---
   title: "[SEO-optimized title, 50-60 chars]"
   description: "[Meta description, 150-160 chars]"
   date: [current date]
   lastmod: [current date]
   draft: true
   categories:
     - [Weddings|Corporate|Art & Culture|Local]
   tags:
     - [relevant tags]
   keywords:
     - [primary keyword]
     - [secondary keywords]
   author: "Pike & West"
   image: "/images/blog/[slug]/featured.jpg"
   imageAlt: "[Descriptive alt text]"
   ---
   ```

4. **Write Content**
   Apply Pike & West brand voice:
   - Sophisticated but warm tone
   - Art/gallery references where appropriate
   - Sensory language for event descriptions
   - Avoid: "venue" overuse, "party", generic CTAs

   Structure:
   - Engaging introduction with hook (include primary keyword in first 100 words)
   - H2 sections with substantive content
   - Internal links to `/contact`, `/gallery`, related blog posts
   - Conclusion with clear CTA to schedule a tour

   **Editorial Styling (REQUIRED):**
   - Drop cap: Automatic on first paragraph (no action needed)
   - Pull quotes: Include 1-2 per 1000 words using `{{</* pull-quote */>}}` shortcode
   - Section dividers: Use `{{</* divider */>}}` between major sections (2-3 per article)

   **Additional Styling (as appropriate):**
   - Tip boxes: `{{</* tip */>}}` for planning advice
   - Fact boxes: `{{</* fact-box */>}}` for venue specs, quick stats
   - Key takeaways: `{{</* key-takeaways */>}}` at end of long articles (1500+ words)
   - Timelines: `{{</* timeline */>}}` for planning guides
   - Sidebar quotes: `{{</* sidebar-quote */>}}` for testimonials
   - Numbered lists: `{{</* numbered-list */>}}` for step-by-step guides
   - Standfirst: `{{</* standfirst */>}}` for article summary intro
   - Kicker: `{{</* kicker */>}}` for category label above headline

   See `.claude/agents/blog-editor.md` for full shortcode reference.

5. **SEO Validation**
   Verify:
   - Primary keyword in title, H1, first 100 words
   - Meta description 150-160 characters
   - Proper heading hierarchy (no skipped levels)
   - 2-4 internal links included
   - Image alt text specified

## Output

Write the complete draft to: `content/blog/[generated-slug].md`

Report:

- File location created
- Word count
- Target persona
- Primary keyword
- Internal links included
- Reminder that `draft: true` is set

## Brand Voice Guidelines

**Words that resonate:**

- Curated, bespoke, intentional
- Intimate, meaningful, authentic
- Artistic, gallery, contemporary
- Memphis, local, community

**Words to avoid:**

- Cheap, budget, deal
- Traditional, classic, timeless (overused)
- Party (prefer "celebration", "gathering")
- Generic "venue" (vary with "gallery", "space", "setting")

**Tone:**

- Sophisticated but warm
- Confident but not pretentious
- Helpful, not salesy
- Inspiring, aspirational

## Quality Checklist

Before completing, verify:

- [ ] Hugo front matter is complete and valid YAML
- [ ] Title includes primary keyword
- [ ] Meta description is 150-160 characters
- [ ] Primary keyword in first 100 words
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] 2+ internal links included
- [ ] CTA present in conclusion
- [ ] Brand voice is consistent
- [ ] No generic venue language
- [ ] Art/gallery angle emphasized where appropriate

**Editorial Styling (Required):**

- [ ] Pull quotes included (1-2 per 1000 words)
- [ ] Section dividers between major sections (2-3 total)
- [ ] No `.no-drop-cap` on first paragraph (allow automatic drop cap)

**Editorial Styling (Content-Appropriate):**

- [ ] Tip boxes for planning advice (if applicable)
- [ ] Fact box for venue/event specs (if applicable)
- [ ] Key takeaways at end (for articles 1500+ words)
- [ ] Timeline for planning guides (if applicable)
- [ ] Numbered list for step-by-step content (if applicable)
