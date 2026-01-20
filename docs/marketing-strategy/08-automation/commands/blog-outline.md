# Command: /blog-outline

> Create a structured outline before writing a full blog post.

## Usage

```bash
/blog-outline [topic]
```

**Examples:**

```bash
/blog-outline "Memphis corporate event planning checklist"
/blog-outline "wedding venue questions to ask during tours"
/blog-outline "art gallery event ideas for nonprofits"
```

## Purpose

This command creates a detailed outline that:

- Maps out the full post structure before writing
- Identifies key points for each section
- Suggests word counts per section
- Plans keyword placement
- Identifies research needs

Use this command when:

- The topic is complex and needs careful planning
- You want to review structure before committing to a draft
- Multiple stakeholders need to approve direction
- You're unsure about the best angle for the topic

## What It Does

### Step 1: Topic Research

- Analyzes search intent for the topic
- Reviews competitor content for gaps
- Identifies target persona
- Selects primary and secondary keywords

### Step 2: Angle Selection

- Proposes 2-3 possible angles for the topic
- Recommends best angle based on:
  - Pike & West differentiators
  - Keyword opportunity
  - Persona alignment

### Step 3: Structure Planning

- Creates heading hierarchy (H2, H3)
- Assigns word count targets per section
- Notes key points to cover
- Identifies internal linking opportunities

### Step 4: SEO Planning

- Maps keyword placement
- Plans meta description
- Suggests title variations

## Example Input/Output

**Input:**

```bash
/blog-outline "questions to ask when touring wedding venues"
```

**Output:**

```markdown
# Blog Outline: Questions to Ask When Touring Wedding Venues

## Overview

**Target Persona:** Boutique Bride Bella
**Search Intent:** Informational (research phase)
**Primary Keyword:** "questions to ask wedding venue" (720/mo, KD 38)
**Secondary Keywords:** "wedding venue tour checklist", "what to ask wedding venue"
**Recommended Length:** 1,500-2,000 words (comprehensive guide format)

---

## Proposed Angles

1. **Checklist Format** - Numbered list of 20+ questions organized by category
   - Pros: Highly scannable, shareable, printable
   - Cons: Less narrative, harder to differentiate

2. **Insider's Guide** - "What We Wish Every Couple Asked" from venue perspective
   - Pros: Unique angle, establishes expertise, builds trust
   - Cons: Requires more nuanced writing

3. **Red Flags Focus** - Questions that reveal venue problems
   - Pros: Clickable, protective angle
   - Cons: Slightly negative framing

**Recommended:** Angle #2 - Positions Pike & West as helpful expert, differentiates from generic lists

---

## Outline Structure

### Introduction (150 words)
- Hook: The excitement of venue tours vs. forgetting crucial questions
- Promise: Insider perspective on what truly matters
- Brief credibility: "After hundreds of tours at Pike & West..."
- **Keyword placement:** Include "wedding venue tour" in first 100 words

### H2: The Basics Everyone Asks (300 words)
- Capacity and layout
- Pricing structure
- Included amenities
- Note: Acknowledge these but transition to deeper questions
- **Internal link:** Link to contact/tour page

### H2: Questions About Flexibility (350 words)
#### H3: Vendor Freedom
- Can you bring your own caterer?
- Preferred vendor lists: requirement or suggestion?
- Pike & West angle: Our vendor-flexible approach

#### H3: Timeline Flexibility
- Setup and breakdown time
- Multi-day access for complex decor
- Day-of timeline restrictions

### H2: Questions About the Space Itself (350 words)
#### H3: The "Boring" Details That Matter
- Parking reality
- Guest flow between spaces
- Backup plans for weather (outdoor ceremonies)

#### H3: Photo Opportunities
- Best spots for portraits
- Lighting at different times of day
- Pike & West angle: Art as backdrop
- **Internal link:** Gallery/photos page

### H2: Questions They Hope You Don't Ask (350 words)
- What's NOT included?
- Recent complaints and how they were handled
- Staff turnover
- Insurance requirements
- This section builds trust by being transparent
- **Keyword placement:** Secondary keywords here

### H2: The Question That Changes Everything (200 words)
- "Can you tell me about a wedding that didn't go as planned?"
- How venues handle problems reveals character
- Pike & West angle: Stories of saving the day
- Emotional resonance moment

### Conclusion (150 words)
- Recap: Armed with right questions = confident decision
- CTA: Ready to ask us these questions? [Schedule tour]
- Soft close: "The best venues welcome tough questions"
- **Internal link:** Contact page with tour booking

---

## SEO Plan

**Title Options:**
1. "25 Questions to Ask When Touring Wedding Venues (From a Venue's Perspective)"
2. "Wedding Venue Tour Checklist: Questions Insiders Wish You'd Ask"
3. "What to Ask Wedding Venues: An Insider's Complete Guide"

**Recommended:** Option 2 - Includes keywords, unique angle in title

**Meta Description (158 chars):**
"Planning wedding venue tours? Get the insider checklist of questions that reveal what you really need to know. From flexibility to red flags—be prepared."

**Keyword Placement:**
- Title: "wedding venue tour"
- H1: "questions to ask wedding venues"
- First 100 words: "wedding venue tour"
- H2s: Natural variations
- Conclusion: Primary keyword

---

## Research Needed

- [ ] Pull 2-3 real examples of "saved the day" moments from Pike & West
- [ ] Confirm current pricing structure for accuracy
- [ ] Get quote from venue manager about common questions

---

## Internal Links to Include

1. Contact/Tour page (CTA)
2. Gallery page (photo opportunities section)
3. FAQ page if exists
4. Related blog post on wedding planning timeline

---

## Next Step

Approve this outline and run `/blog-draft "questions to ask when touring wedding venues"` to generate the full post.
```

## Configuration

### Command File Location

```text
.claude/commands/blog-outline.md
```

### Command Definition

```yaml
---
name: blog-outline
description: Create structured outline before writing
arguments:
  - name: topic
    description: The blog post topic
    required: true
---

# /blog-outline Command

When invoked:
1. Analyze topic for search intent and keyword opportunity
2. Identify target persona
3. Propose 2-3 content angles with pros/cons
4. Generate detailed outline with word counts
5. Plan SEO elements (title, meta, keywords)
6. Identify research needs and internal links
```

## Options

| Option      | Description                         | Default       |
|-------------|-------------------------------------|---------------|
| `--persona` | Target specific persona             | Auto-detected |
| `--angle`   | Skip angle selection, use specified | None          |
| `--brief`   | Shorter outline format              | false         |

## Related Commands

- [/blog-draft](./blog-draft.md) - Generate full post from outline
- [/content-queue](./content-queue.md) - Find topics to outline

## When to Use Outline vs. Draft

| Scenario                      | Use /blog-outline | Use /blog-draft |
|-------------------------------|-------------------|-----------------|
| Complex topic                 | Yes               | After outline   |
| Quick turnaround needed       | No                | Yes             |
| Need stakeholder approval     | Yes               | After outline   |
| Simple, straightforward topic | Optional          | Yes             |
| Unsure about angle            | Yes               | After outline   |
| Repurposing existing content  | No                | Yes             |
