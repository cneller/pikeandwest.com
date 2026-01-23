---
description: Generate complete blog post draft with Hugo front matter and SEO optimization
allowed-tools: Read, Glob, Grep, Write, WebSearch, Task
arguments:
  - name: topic
    description: The blog post topic or title
    required: true
---

# /blog-draft Command

Generate a publication-ready blog post draft for Pike & West with Hugo front matter.

**IMPORTANT:** After generating the initial content, delegate to the `blog-editor` agent
for editorial styling. The agent handles all formatting decisions.

## When Invoked with `$ARGUMENTS.topic`

### Phase 1: Content Generation (This Command)

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

4. **Write Initial Content**
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

5. **SEO Validation**
   Verify:
   - Primary keyword in title, H1, first 100 words
   - Meta description 150-160 characters
   - Proper heading hierarchy (no skipped levels)
   - 2-4 internal links included
   - Image alt text specified

### Phase 2: Editorial Styling (Delegate to Agent)

After writing the initial content, invoke the `blog-editor` agent to apply:
- Pull quotes (1-2 per 1000 words)
- Section dividers (2-3 per article)
- Content-appropriate elements (tip boxes, fact boxes, timelines, etc.)

The agent contains all editorial styling logic, shortcode reference, and quality checklists.

```
Use the blog-editor agent to apply editorial styling to the new blog post.
```

## Output

Write the complete draft to: `content/blog/[generated-slug].md`

Report:
- File location created
- Word count
- Target persona
- Primary keyword
- Internal links included
- Editorial styling applied (via agent)
- Reminder that `draft: true` is set

## Brand Voice Quick Reference

**Words that resonate:** Curated, bespoke, intentional, intimate, meaningful, authentic, artistic, gallery, contemporary, Memphis, local, community

**Words to avoid:** Cheap, budget, deal, traditional (overused), party (use "celebration"), generic "venue" (vary with "gallery", "space", "setting")

**Tone:** Sophisticated but warm, confident but not pretentious, helpful not salesy, inspiring and aspirational

## SEO Checklist

- [ ] Hugo front matter complete and valid YAML
- [ ] Title includes primary keyword (50-60 chars)
- [ ] Meta description 150-160 characters
- [ ] Primary keyword in first 100 words
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] 2+ internal links included
- [ ] CTA present in conclusion
- [ ] Brand voice consistent
- [ ] Art/gallery angle emphasized

**Editorial styling validation is handled by the blog-editor agent.**
