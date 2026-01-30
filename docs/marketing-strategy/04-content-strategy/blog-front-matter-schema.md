# Blog Front Matter Schema

> Standard front matter structure for Pike & West blog posts in Hugo.

## Complete Schema

```yaml
---
# Required Fields
title: ""                    # H1 headline, 50-60 characters for SEO
date: 2026-01-20            # Publication date (YYYY-MM-DD)
description: ""             # Meta description, 150-160 characters

# SEO & Keywords
keywords:
  primary: ""               # Single primary keyword/phrase to rank for
  secondary: ""             # Comma-delimited secondary keywords

# Audience Targeting
personas: ""                # Comma-delimited persona short names
                            # Options: birthday, anniversary, prom, corporate,
                            # graduation, baby-shower, holiday, family
event_types: ""             # Comma-delimited event types covered
                            # Options: birthday, anniversary, wedding, corporate,
                            # graduation, prom, baby-shower, holiday-party,
                            # retirement, vow-renewal, gender-reveal

# Content Classification
funnel_stage: ""            # awareness | consideration | decision
pillar: ""                  # planning-guides | inspiration | local-expertise |
                            # behind-scenes | social-proof
topics: ""                  # Comma-delimited topic tags for filtering

# Timing & Seasonality
season: ""                  # spring | summer | fall | winter | evergreen
publish_window:             # Optimal publishing window
  start: ""                 # Month to start promoting (e.g., "January")
  end: ""                   # Month to stop promoting (e.g., "April")

# Cross-Channel Distribution
social:
  instagram: false          # Suitable for Instagram adaptation
  facebook: false           # Suitable for Facebook adaptation
  gbp: false                # Suitable for Google Business Profile post
  email: false              # Include in email newsletter

# Related Content
related: ""                 # Comma-delimited slugs of related posts
cta: ""                     # Primary CTA: tour | contact | download | subscribe

# Optional Enhancement
featured_image: ""          # Relative path within page bundle (e.g., "featured.jpg")
featured_image_alt: ""      # Alt text for featured image
author: ""                  # Author name (defaults to "Pike & West Team")
reading_time: 0             # Estimated reading time in minutes (auto-calculated if 0)
schema_type: ""             # article | how-to | faq | local-business
draft: false                # Set true for unpublished drafts
---
```

## Field Definitions

### Required Fields

| Field         | Type   | Description                                  | Example                                                                                    |
|---------------|--------|----------------------------------------------|--------------------------------------------------------------------------------------------|
| `title`       | string | H1 headline, optimized for SEO (50-60 chars) | "15 Elegant 60th Birthday Party Themes"                                                    |
| `date`        | date   | Publication date in YYYY-MM-DD format        | 2026-01-20                                                                                 |
| `description` | string | Meta description (150-160 chars)             | "Discover sophisticated theme ideas for celebrating a 60th birthday at an intimate venue." |

### Keywords

| Field                | Type   | Description                         | Example                                                                   |
|----------------------|--------|-------------------------------------|---------------------------------------------------------------------------|
| `keywords.primary`   | string | Single focus keyword for SEO        | "60th birthday party themes"                                              |
| `keywords.secondary` | string | Comma-delimited supporting keywords | "milestone birthday ideas, elegant birthday party, adult birthday themes" |

### Audience Targeting

| Field         | Type   | Options                                                                                                                         | Description                                |
|---------------|--------|---------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| `personas`    | string | birthday, anniversary, prom, corporate, graduation, baby-shower, holiday, family                                                | Target audience personas (comma-delimited) |
| `event_types` | string | birthday, anniversary, wedding, corporate, graduation, prom, baby-shower, holiday-party, retirement, vow-renewal, gender-reveal | Event types covered (comma-delimited)      |

### Content Classification

| Field          | Type   | Options                                                                    | Description                                |
|----------------|--------|----------------------------------------------------------------------------|--------------------------------------------|
| `funnel_stage` | enum   | awareness, consideration, decision                                         | Where in buyer journey                     |
| `pillar`       | enum   | planning-guides, inspiration, local-expertise, behind-scenes, social-proof | Content pillar category                    |
| `topics`       | string | Any relevant tags                                                          | Topic tags for filtering (comma-delimited) |

### Timing & Seasonality

| Field                  | Type   | Options                                 | Description              |
|------------------------|--------|-----------------------------------------|--------------------------|
| `season`               | enum   | spring, summer, fall, winter, evergreen | Primary season relevance |
| `publish_window.start` | string | Month name                              | When to start promoting  |
| `publish_window.end`   | string | Month name                              | When to stop promoting   |

### Social Distribution

| Field              | Type | Default | Description                        |
|--------------------|------|---------|------------------------------------|
| `social.instagram` | bool | false   | Has visual content suitable for IG |
| `social.facebook`  | bool | false   | Suitable for FB audience           |
| `social.gbp`       | bool | false   | Good for Google Business Profile   |
| `social.email`     | bool | false   | Feature in newsletter              |

### Related Content

| Field     | Type   | Description                        | Example                                          |
|-----------|--------|------------------------------------|--------------------------------------------------|
| `related` | string | Comma-delimited post slugs         | "50th-birthday-guide, birthday-budget-breakdown" |
| `cta`     | enum   | tour, contact, download, subscribe | Primary call-to-action                           |

## Example Front Matter

### Planning Guide Example

```yaml
---
title: "The Complete Guide to Planning a 50th Birthday Party"
date: 2026-02-15
description: "Everything you need to plan an unforgettable 50th birthday celebration, from timeline and budget to venue selection and vendor coordination."

keywords:
  primary: "50th birthday party planning"
  secondary: "milestone birthday guide, 50th birthday checklist, adult birthday party planning"

personas: "birthday"
event_types: "birthday"

funnel_stage: "consideration"
pillar: "planning-guides"
topics: "planning, checklist, timeline, budget"

season: "evergreen"

social:
  instagram: false
  facebook: true
  gbp: true
  email: true

related: "birthday-budget-breakdown, surprise-party-guide"
cta: "tour"

featured_image: "blog/50th-birthday-planning.jpg"
featured_image_alt: "Elegant 50th birthday party table setting with gold accents"
schema_type: "how-to"
---
```

### Inspiration Example

```yaml
---
title: "15 Elegant 60th Birthday Party Themes for Sophisticated Celebrations"
date: 2026-03-01
description: "Discover sophisticated theme ideas perfect for celebrating a 60th birthday milestone at an intimate venue like Pike & West."

keywords:
  primary: "60th birthday party themes"
  secondary: "elegant birthday themes, sophisticated party ideas, milestone birthday decorations"

personas: "birthday"
event_types: "birthday"

funnel_stage: "awareness"
pillar: "inspiration"
topics: "themes, decor, ideas, milestone"

season: "evergreen"

social:
  instagram: true
  facebook: true
  gbp: false
  email: true

related: "50th-birthday-guide, black-gold-theme"
cta: "tour"

featured_image: "blog/60th-birthday-themes.jpg"
featured_image_alt: "Gallery wall with birthday party theme inspiration boards"
schema_type: "article"
---
```

### Local Expertise Example

```yaml
---
title: "Best Memphis Bakeries for Custom Birthday Cakes"
date: 2026-03-15
description: "Our curated list of Memphis bakeries known for stunning custom cakes perfect for milestone birthday celebrations."

keywords:
  primary: "Memphis birthday cakes"
  secondary: "custom cakes Memphis, bakeries Germantown, birthday cake vendors"

personas: "birthday, anniversary, baby-shower"
event_types: "birthday, anniversary, baby-shower"

funnel_stage: "consideration"
pillar: "local-expertise"
topics: "vendors, bakeries, cakes, Memphis"

season: "evergreen"

social:
  instagram: true
  facebook: true
  gbp: true
  email: false

related: "memphis-caterers, germantown-florists"
cta: "contact"

featured_image: "blog/memphis-bakeries.jpg"
featured_image_alt: "Elegant custom birthday cake with floral decorations"
schema_type: "local-business"
---
```

## Hugo Template Usage

### Accessing Front Matter in Templates

```go-html-template
{{/* Access primary keyword */}}
{{ .Params.keywords.primary }}

{{/* Check social distribution flags */}}
{{ if .Params.social.instagram }}
  {{/* Show Instagram-specific content */}}
{{ end }}

{{/* Loop through related posts */}}
{{ $related := split .Params.related ", " }}
{{ range $related }}
  {{ with site.GetPage (printf "/blog/%s" .) }}
    <a href="{{ .RelPermalink }}">{{ .Title }}</a>
  {{ end }}
{{ end }}

{{/* Filter posts by persona */}}
{{ range where site.RegularPages "Section" "blog" }}
  {{ if in .Params.personas "birthday" }}
    {{/* Show birthday-related posts */}}
  {{ end }}
{{ end }}
```

### CTA Partial Usage

```go-html-template
{{/* In single.html */}}
{{ partial "cta-block" (dict "type" .Params.cta "context" .) }}
```

## Validation Rules

Before publishing, verify:

1. **Title**: 50-60 characters, includes primary keyword
2. **Description**: 150-160 characters, compelling and keyword-rich
3. **Primary keyword**: Single phrase, matches search intent
4. **Personas**: At least one persona selected
5. **Funnel stage**: Matches content depth (guides = consideration, inspiration = awareness)
6. **Season**: Set to "evergreen" if not time-sensitive
7. **CTA**: Appropriate for funnel stage
8. **Related**: 2-3 related posts linked

## Schema Types

| Type             | When to Use                              |
|------------------|------------------------------------------|
| `article`        | General blog posts, inspiration, stories |
| `how-to`         | Step-by-step guides, checklists          |
| `faq`            | Q&A format posts                         |
| `local-business` | Vendor roundups, local guides            |
