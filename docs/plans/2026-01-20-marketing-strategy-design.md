# Pike & West Marketing Strategy Design

> Comprehensive marketing strategy to achieve 50% revenue growth through content-driven awareness, local SEO dominance, and targeted persona marketing.

**Created:** 2026-01-20
**Status:** Complete

## Goal

50% revenue increase over 2025 through:

- More awareness/attention via digital content
- Higher SEO rankings
- More social media activity
- Content positioning Pike & West as local event planning experts

## Approach

**AI-Assisted In-House Content Creation**

- Use Claude and other AI tools to draft content
- Human review for brand voice and local flavor
- Systematic workflows via Claude Code skills, commands, and agents

## Target Personas

| Short Name    | Full Name                    | Planning Lead Time |
|---------------|------------------------------|--------------------|
| `birthday`    | Michelle - The Milestone Mom | 1-3 months         |
| `anniversary` | The Anniversary Celebrator   | 2-4 months         |
| `prom`        | The Prom Parent              | 2-4 weeks          |
| `corporate`   | The Corporate Event Planner  | 3-12 months        |
| `graduation`  | The Graduation Host          | 1-3 months         |
| `baby-shower` | The Baby Shower Organizer    | 1-2 months         |

**Key Demographics:**

- Almost always women planning the events
- Middle-aged or older (35-65)
- Germantown, Collierville, East Memphis area
- Household income $100K+
- African American families tend to celebrate milestones bigger

## Content Pillars

1. **Planning Guides** (35%) - How-to content, checklists, timelines
2. **Inspiration** (25%) - Ideas, themes, visual content
3. **Local Expertise** (20%) - Germantown vendors, Memphis event scene
4. **Behind the Scenes** (10%) - Venue features, team stories
5. **Social Proof** (10%) - Testimonials, event highlights

## Channels

| Channel                 | Role                    | Audience                 |
|-------------------------|-------------------------|--------------------------|
| Instagram               | Inspiration & Discovery | Younger planners (25-45) |
| Facebook                | Community & Trust       | Older planners (40-60)   |
| Google Business Profile | Conversion & Local SEO  | High-intent searchers    |
| Blog                    | SEO & Authority         | All personas             |

## Hugo Integration

### Blog Front Matter Schema

```yaml
title: ""
date:
description: ""
keywords:
  primary: ""
  secondary: ""  # comma-delimited
personas: ""  # comma-delimited: birthday, anniversary, prom, corporate, graduation, baby-shower
event_types: ""
funnel_stage: ""  # awareness | consideration | decision
pillar: ""
topics: ""
season: ""
social:
  instagram: false
  facebook: false
  gbp: false
  email: false
related: ""
cta: ""
```

### Hugo Taxonomies

```toml
[taxonomies]
  persona = "personas"
  event_type = "event_types"
  topic = "topics"
  pillar = "pillars"
  funnel_stage = "funnel_stages"
```

## UTM Conventions

| Parameter      | Convention                                |
|----------------|-------------------------------------------|
| `utm_source`   | instagram, facebook, gbp, email, google   |
| `utm_medium`   | social, organic, email, referral, cpc     |
| `utm_campaign` | blog-[slug], seasonal-[season], evergreen |
| `utm_content`  | bio-link, post, story, carousel, reel     |

## Claude Code Automation

### Skills (auto-activate)

- `marketing-content-creation` - Loads persona context, brand voice
- `social-media-posting` - Platform specs, hashtags
- `seo-optimization` - Keyword research, Hugo SEO patterns
- `utm-tracking` - UTM conventions

### Commands (user-invoked)

- `/blog-draft [topic]` - Generate complete draft
- `/blog-outline [topic]` - Create structured outline
- `/social-from-blog [file]` - Generate social posts
- `/content-queue` - Prioritized content recommendations
- `/content-audit` - Review content against strategy
- `/utm-link [url] [source] [campaign]` - Generate tracked link
- `/persona [name]` - Load persona context

### Agents (autonomous)

- `content-researcher` - Research competitors, find gaps
- `keyword-researcher` - Analyze trends, suggest opportunities

## Content Prioritization

Scoring algorithm:

```text
SCORE = (Seasonal Relevance × 3)
      + (Persona Gap × 2)
      + (Funnel Gap × 2)
      + (Keyword Opportunity × 1)
      - (Recently Published Penalty)
```

Content published based on:

- Planning lead times by persona
- Seasonal event calendar
- Target content mix by persona and funnel stage

## Deliverables Created

```text
docs/marketing-strategy/
├── README.md                        # Master strategy overview
├── 01-personas/                     # 7 files
├── 02-seasonal-calendar/            # 2 files
├── 03-seo-strategy/                 # 4 files
├── 04-content-strategy/             # 8 files
├── 05-social-media/                 # 4 files
├── 06-utm-tracking/                 # 3 files
├── 07-measurement/                  # 3 files
├── 08-automation/                   # 14 files
└── playbooks/                       # 5 files

Total: 51 markdown files
```

## Next Steps

1. Review generated content for accuracy and brand voice
2. Fill in baseline metrics in KPIs document
3. Implement Hugo taxonomies for content organization
4. Create actual Claude Code skills/commands from documentation
5. Begin content production using the playbooks
