---
description: Create structured outline before writing a blog post
allowed-tools: Read, Glob, Grep, WebSearch
arguments:
  - name: topic
    description: The blog post topic or title
    required: true
---

# /blog-outline Command

Create a detailed outline before writing a full blog post for Pike & West.

## When Invoked with `$ARGUMENTS.topic`

1. **Topic Research**
   - Analyze search intent for the topic (informational, commercial, transactional)
   - Identify target persona from Pike & West personas:
     - Boutique Bride Bella (weddings)
     - Corporate Claire (corporate events)
     - Social Savvy Sarah (celebrations)
     - Art Collector Alex (art events)
   - Select primary and secondary keywords
   - Check existing content at `content/blog/*.md` to avoid duplication

2. **Angle Selection**
   Propose 2-3 possible angles for the topic:
   - List pros and cons for each
   - Recommend best angle based on:
     - Pike & West differentiators (art gallery, intimate venue)
     - Keyword opportunity
     - Persona alignment
   - Explain reasoning for recommendation

3. **Structure Planning**
   Create outline with:
   - Heading hierarchy (H2, H3)
   - Word count targets per section
   - Key points to cover in each section
   - Internal linking opportunities to:
     - `/contact` (tour scheduling)
     - `/gallery` (photo opportunities)
     - Related blog posts
   - **Editorial styling placement:**
     - Pull quote candidates (key insights worth highlighting)
     - Section divider locations (between major topic shifts)

4. **SEO Planning**
   Include:
   - 3 title options (50-60 characters each)
   - Recommended title with rationale
   - Meta description (150-160 characters)
   - Keyword placement map (title, H1, first 100 words, H2s)

5. **Research Needs**
   Identify what needs to be gathered:
   - Pike & West specific examples or stories
   - Facts/statistics to include
   - Photos or assets needed

## Output Format

```markdown
# Blog Outline: [Topic]

## Overview
| Attribute          | Detail                                   |
|--------------------|------------------------------------------|
| Target Persona     | [persona]                                |
| Search Intent      | [intent]                                 |
| Primary Keyword    | [keyword] ([volume]/mo, KD [difficulty]) |
| Secondary Keywords | [list]                                   |
| Recommended Length | [words]                                  |

## Proposed Angles
1. **[Angle 1]** - [description]
   - Pros: [list]
   - Cons: [list]

[Recommended angle with reasoning]

## Outline Structure

### Introduction ([word count])
- [bullet points for content]
- **Keyword placement:** [note]

### H2: [Section Title] ([word count])
[Content notes]
- **Internal link:** [page to link]

[Continue for all sections]

### Conclusion ([word count])
- [summary points]
- CTA: [call to action]

## SEO Plan
**Title Options:**
1. [option]
2. [option]
3. [option]

**Recommended:** [choice] - [rationale]

**Meta Description (XXX chars):**
"[description]"

## Research Needed
- [ ] [item]
- [ ] [item]

## Internal Links to Include
1. [page] - [in which section]

## Editorial Styling Plan
**Pull Quotes (1-2 per 1000 words):**
1. "[quote candidate]" - after [section]
2. "[quote candidate]" - after [section]

**Section Dividers:**
- After [section] - before [section]
- After [section] - before Conclusion

## Next Step
Approve this outline and run `/blog-draft "[topic]"` to generate the full post.
```
