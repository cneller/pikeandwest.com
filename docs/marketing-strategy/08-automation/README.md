# Marketing Automation with Claude Code

> AI-powered content creation, SEO optimization, and social media management for Pike & West.

## Overview

This folder documents Claude Code tooling configured specifically for Pike & West's marketing workflows. These tools enable consistent, on-brand content creation while maintaining the luxury aesthetic and sophisticated voice that defines the Pike & West brand.

## Tooling Categories

### Skills (Auto-Activate)

Skills automatically load relevant context when you work in specific areas:

| Skill                                                                | Triggers When              | What It Loads                           |
|----------------------------------------------------------------------|----------------------------|-----------------------------------------|
| [marketing-content-creation](./skills/marketing-content-creation.md) | Working in `content/blog/` | Persona context, brand voice, templates |
| [social-media-posting](./skills/social-media-posting.md)             | Mentioning social media    | Platform specs, hashtag strategy        |
| [seo-optimization](./skills/seo-optimization.md)                     | SEO/keyword discussions    | Keyword research, competitor analysis   |
| [utm-tracking](./skills/utm-tracking.md)                             | UTM parameter work         | Naming conventions, campaign structure  |

### Commands (User-Invoked)

Commands are explicitly called with `/command-name`:

| Command                                             | Purpose                         | Usage                                 |
|-----------------------------------------------------|---------------------------------|---------------------------------------|
| [/blog-draft](./commands/blog-draft.md)             | Generate complete blog post     | `/blog-draft [topic]`                 |
| [/blog-outline](./commands/blog-outline.md)         | Create structured outline       | `/blog-outline [topic]`               |
| [/social-from-blog](./commands/social-from-blog.md) | Generate social posts from blog | `/social-from-blog [file]`            |
| [/content-queue](./commands/content-queue.md)       | Show prioritized content        | `/content-queue`                      |
| [/content-audit](./commands/content-audit.md)       | Review content against strategy | `/content-audit`                      |
| [/utm-link](./commands/utm-link.md)                 | Generate tracked link           | `/utm-link [url] [source] [campaign]` |
| [/persona](./commands/persona.md)                   | Load persona context            | `/persona [name]`                     |

### Agents (Autonomous Tasks)

Agents run complex, multi-step research tasks:

| Agent                                                | Purpose                                 | When to Use               |
|------------------------------------------------------|-----------------------------------------|---------------------------|
| [content-researcher](./agents/content-researcher.md) | Research competitors, find content gaps | Before quarterly planning |
| [keyword-researcher](./agents/keyword-researcher.md) | Analyze trends, suggest keywords        | Monthly keyword reviews   |

## Quick Start

### Creating a Blog Post

```bash
# 1. Generate outline first
/blog-outline "Germantown wedding venues comparison guide"

# 2. Review and refine outline, then generate draft
/blog-draft "Germantown wedding venues comparison guide"

# 3. Generate social media posts from the blog
/social-from-blog content/blog/germantown-wedding-venues-guide.md
```

### Checking Content Health

```bash
# View prioritized content recommendations
/content-queue

# Audit existing content against strategy
/content-audit
```

### Building Tracked Links

```bash
# Generate UTM link for Instagram bio
/utm-link https://pikeandwest.com/contact instagram wedding-season-2025
```

## Configuration

### Required Files

These files must exist for full functionality:

```text
docs/marketing-strategy/
├── 02-personas/
│   ├── social-savvy-sarah.md
│   ├── corporate-claire.md
│   ├── boutique-bride-bella.md
│   └── art-collector-alex.md
├── 03-seo/
│   ├── keyword-strategy.md
│   └── competitor-analysis.md
├── 04-content/
│   ├── editorial-calendar.md
│   └── content-pillars.md
├── 05-social-media/
│   ├── platform-strategy.md
│   └── hashtag-strategy.md
└── 07-utm-tracking/
    └── conventions.md
```

### Brand Voice Reference

All content tools reference these brand guidelines:

- **Tone:** Sophisticated, warm, aspirational
- **Voice:** Confident but not boastful, elegant but approachable
- **Avoid:** Overly casual language, hard-sell tactics, generic venue clichés
- **Embrace:** Art-inspired language, sensory descriptions, Memphis heritage

### Persona Quick Reference

| Persona              | Age   | Priority  | Key Motivator                   |
|----------------------|-------|-----------|---------------------------------|
| Boutique Bride Bella | 28-38 | Primary   | Unique, Instagram-worthy venue  |
| Corporate Claire     | 35-50 | Primary   | Professional, impressive space  |
| Social Savvy Sarah   | 25-40 | Secondary | Shareable, aesthetic events     |
| Art Collector Alex   | 45-65 | Tertiary  | Artistic integrity, exclusivity |

## Integration with Hugo

### Blog Post Workflow

1. Commands generate content in `content/blog/` with proper Hugo front matter
2. Images are placed in `static/images/blog/[post-slug]/`
3. Generated posts include required SEO fields (title, description, keywords)
4. Social posts reference the blog URL for cross-promotion

### Content Placement

```text
content/
├── blog/
│   ├── _index.md                    # Blog listing page
│   └── [generated-posts].md         # Generated blog posts
└── events/
    └── [event-type]/                # Event-specific content
```

## Maintenance

### Monthly Tasks

- [ ] Run `/content-audit` to check content health
- [ ] Review `/content-queue` for upcoming priorities
- [ ] Update keyword research with `keyword-researcher` agent

### Quarterly Tasks

- [ ] Run `content-researcher` agent for competitive analysis
- [ ] Review and update persona documents
- [ ] Audit UTM conventions for campaign alignment

## Related Documentation

- [Content Pillars](../04-content/content-pillars.md)
- [Editorial Calendar](../04-content/editorial-calendar.md)
- [SEO Strategy](../03-seo/keyword-strategy.md)
- [Social Media Strategy](../05-social-media/platform-strategy.md)
- [UTM Conventions](../07-utm-tracking/conventions.md)
