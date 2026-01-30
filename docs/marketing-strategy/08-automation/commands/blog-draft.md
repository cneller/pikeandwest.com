# Command: /blog-draft

> Generate a complete blog post draft with Hugo front matter, SEO optimization, and brand voice.

## Usage

```bash
/blog-draft [topic]
```

**Examples:**

```bash
/blog-draft "10 unique wedding reception ideas for art lovers"
/blog-draft "planning a corporate retreat in Memphis"
/blog-draft "why an art gallery makes the perfect wedding venue"
```

## Purpose

This command generates a publication-ready blog post draft that:

- Targets a specific persona
- Follows Pike & West brand voice
- Includes complete Hugo front matter
- Is optimized for target keywords
- Contains appropriate internal links
- Has clear calls to action

## What It Does

### Step 1: Topic Analysis

- Identifies the primary persona the content serves
- Determines search intent (informational, commercial, transactional)
- Selects primary and secondary keywords
- Checks for existing content to avoid duplication

### Step 2: Structure Generation

- Creates outline based on topic and intent
- Determines optimal post length (800-2000 words)
- Plans heading hierarchy (H2s, H3s)
- Identifies internal linking opportunities

### Step 3: Front Matter Creation

```yaml
---
title: "10 Unique Wedding Reception Ideas for Art Lovers"
description: "Discover creative wedding reception ideas that celebrate art and love. From gallery-style seating to interactive art stations, make your celebration unforgettable."
date: 2025-02-15
lastmod: 2025-02-15
draft: false
categories:
  - Weddings
tags:
  - wedding ideas
  - wedding reception
  - art wedding
  - unique venues
keywords:
  - unique wedding reception ideas
  - art gallery wedding
  - creative wedding venues Memphis
author: "Pike & West"
image: "featured.jpg"  # Relative to page bundle
imageAlt: "Elegant wedding reception in Pike & West art gallery"
---
```

### Step 4: Content Generation

- Writes engaging introduction with hook
- Develops each section with brand voice
- Includes sensory language and art references
- Adds relevant internal links
- Creates compelling conclusion with CTA

### Step 5: SEO Validation

- Verifies keyword placement (title, H1, first 100 words)
- Checks meta description length (150-160 chars)
- Confirms keyword density (1-2%)
- Validates heading structure

## Example Input/Output

**Input:**

```bash
/blog-draft "5 reasons an art gallery wedding is unforgettable"
```

**Output:**

```markdown
---
title: "5 Reasons an Art Gallery Wedding Is Unforgettable"
description: "Discover why art gallery weddings create lasting memories. From stunning backdrops to conversation-starting decor, explore what makes gallery venues extraordinary."
date: 2025-02-15
lastmod: 2025-02-15
draft: false
categories:
  - Weddings
tags:
  - art gallery wedding
  - wedding venues
  - unique wedding ideas
keywords:
  - art gallery wedding
  - unique wedding venue Memphis
  - gallery wedding venue
author: "Pike & West"
image: "featured.jpg"  # Relative to page bundle
imageAlt: "Couple exchanging vows surrounded by contemporary art at Pike & West"
---

Your wedding day deserves more than four walls and a dance floor. It deserves
a setting that sparks conversation, inspires emotion, and creates a backdrop
as unique as your love story. An art gallery wedding delivers exactly that.

At Pike & West, we've witnessed countless couples discover something magical
when they choose to celebrate surrounded by contemporary art. Here's why an
art gallery wedding creates memories that last far beyond the final dance.

## 1. Built-In Decor That Tells a Story

While other venues require extensive decoration to feel complete, an art
gallery arrives fully adorned with conversation pieces...

[Content continues with 800-1200 words total]

## Ready to See the Space?

Your love story deserves an extraordinary setting. [Schedule a private tour](/contact)
of Pike & West and discover how contemporary art can transform your wedding
celebration into an unforgettable experience.

---

*Pike & West is Germantown's premier art gallery and event venue, where life
and art intersect to create extraordinary celebrations.*
```

## Configuration

### Command File Location

```text
.claude/commands/blog-draft.md
```

### Command Definition

```yaml
---
name: blog-draft
description: Generate complete blog post draft with front matter
arguments:
  - name: topic
    description: The blog post topic or title
    required: true
---

# /blog-draft Command

When invoked, this command:

1. Load marketing-content-creation skill context
2. Load seo-optimization skill context
3. Analyze the provided topic
4. Identify target persona and keywords
5. Generate complete blog post with Hugo front matter
6. Save to content/blog/[slug].md as draft

## Output Requirements
- Complete Hugo front matter
- 800-2000 words depending on topic
- H2 and H3 heading structure
- 2-4 internal links
- Clear CTA in conclusion
- SEO-optimized throughout
```

## Options

| Option           | Description               | Default       |
|------------------|---------------------------|---------------|
| `--persona`      | Target specific persona   | Auto-detected |
| `--keywords`     | Override primary keywords | Auto-selected |
| `--length`       | Target word count         | 1000-1500     |
| `--outline-only` | Just generate outline     | false         |

**Example with options:**

```bash
/blog-draft "corporate event planning guide" --persona corporate-claire --length 2000
```

## Related Commands

- [/blog-outline](./blog-outline.md) - Generate outline before writing
- [/content-audit](./content-audit.md) - Review generated content
- [/social-from-blog](./social-from-blog.md) - Create social posts from blog

## Quality Checklist

Generated drafts should pass these checks:

- [ ] Hugo front matter is complete and valid
- [ ] Title includes primary keyword
- [ ] Meta description is 150-160 characters
- [ ] Primary keyword in first 100 words
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] 2+ internal links included
- [ ] CTA present in conclusion
- [ ] Brand voice is consistent
- [ ] No generic venue language
- [ ] Art/gallery angle emphasized
