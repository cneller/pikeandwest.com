# Hugo SEO Implementation - Pike & West

> Technical implementation guide for SEO features in the Pike & West Hugo site.

## Overview

Hugo provides excellent built-in SEO capabilities. This document covers the complete technical implementation for:

- Meta tags and Open Graph
- Structured data (Schema.org)
- Sitemap configuration
- Robots.txt
- Canonical URLs
- Content taxonomies

---

## Configuration

### config/\_default/params.toml

```toml
# Site-wide SEO settings
title = "Pike & West"
description = "Art gallery and event venue in Germantown, TN. Intimate weddings, corporate events, and private celebrations in a sophisticated gallery setting."
keywords = ["event venue", "wedding venue", "Germantown TN", "Memphis event space", "art gallery venue"]

# Default Open Graph image
images = ["images/og/default.jpg"]

# Site verification codes
[verification]
  google = "google-site-verification-code"
  bing = "bing-verification-code"

# Social media profiles
[social]
  facebook = "https://www.facebook.com/pikeandwest"
  instagram = "https://www.instagram.com/pikeandwest"
  twitter = ""

# Business information for schema
[business]
  name = "Pike & West"
  phone = "+1-901-206-5575"
  email = "info@pikeandwest.com"
  street = "2277 West Street"
  city = "Germantown"
  state = "TN"
  zip = "38138"
  country = "US"
  latitude = 35.0868
  longitude = -89.8100
  priceRange = "$$$"
  maxCapacity = 60

# Analytics
[analytics]
  googleTagManager = "GTM-XXXXXX"
```

### config/\_default/hugo.toml

```toml
# Sitemap configuration
[sitemap]
  changefreq = "weekly"
  filename = "sitemap.xml"
  priority = 0.5

# Enable robots.txt generation
enableRobotsTXT = true

# Taxonomies for SEO
[taxonomies]
  event_type = "event-types"
  persona = "personas"
  tag = "tags"

# Canonical URL settings
canonifyURLs = false
relativeURLs = false

# Output formats
[outputs]
  home = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]
  page = ["HTML"]
```

---

## Meta Tags Partial

### layouts/partials/seo.html

```go-html-template
{{/* layouts/partials/seo.html */}}
{{/*
  Purpose: Generates all SEO meta tags for the page
  Context: Expects current page context (.)
  Usage: {{ partial "seo.html" . }}
*/}}

{{/* Page-specific or fallback values */}}
{{ $title := .Title | default site.Title }}
{{ $description := .Params.description | default .Summary | default site.Params.description }}
{{ $keywords := .Params.keywords | default site.Params.keywords }}
{{ $canonical := .Permalink }}

{{/* Open Graph image handling */}}
{{ $ogImage := "" }}
{{ if .Params.image }}
  {{ $ogImage = .Params.image | absURL }}
{{ else if .Params.images }}
  {{ $ogImage = index .Params.images 0 | absURL }}
{{ else if site.Params.images }}
  {{ $ogImage = index site.Params.images 0 | absURL }}
{{ end }}

{{/* Basic meta tags */}}
<meta name="description" content="{{ $description | truncate 160 }}">
{{ with $keywords }}
<meta name="keywords" content="{{ if reflect.IsSlice . }}{{ delimit . ", " }}{{ else }}{{ . }}{{ end }}">
{{ end }}
<meta name="author" content="{{ site.Params.business.name }}">

{{/* Canonical URL */}}
<link rel="canonical" href="{{ $canonical }}">

{{/* Open Graph */}}
<meta property="og:title" content="{{ $title }}">
<meta property="og:description" content="{{ $description | truncate 200 }}">
<meta property="og:type" content="{{ if .IsHome }}website{{ else }}article{{ end }}">
<meta property="og:url" content="{{ $canonical }}">
{{ with $ogImage }}
<meta property="og:image" content="{{ . }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
{{ end }}
<meta property="og:site_name" content="{{ site.Title }}">
<meta property="og:locale" content="en_US">

{{/* Twitter Card */}}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $title }}">
<meta name="twitter:description" content="{{ $description | truncate 200 }}">
{{ with $ogImage }}
<meta name="twitter:image" content="{{ . }}">
{{ end }}

{{/* Site verification */}}
{{ with site.Params.verification.google }}
<meta name="google-site-verification" content="{{ . }}">
{{ end }}
{{ with site.Params.verification.bing }}
<meta name="msvalidate.01" content="{{ . }}">
{{ end }}

{{/* Robots directives */}}
{{ if .Params.noindex }}
<meta name="robots" content="noindex, nofollow">
{{ else }}
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
{{ end }}

{{/* Geo tags for local SEO */}}
<meta name="geo.region" content="US-TN">
<meta name="geo.placename" content="Germantown">
<meta name="geo.position" content="{{ site.Params.business.latitude }};{{ site.Params.business.longitude }}">
<meta name="ICBM" content="{{ site.Params.business.latitude }}, {{ site.Params.business.longitude }}">
```

---

## Schema Markup Partial

### layouts/partials/schema.html

```go-html-template
{{/* layouts/partials/schema.html */}}
{{/*
  Purpose: Generates JSON-LD structured data for the page
  Context: Expects current page context (.)
  Usage: {{ partial "schema.html" . }}
*/}}

{{/* LocalBusiness + EventVenue schema (appears on every page) */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "EventVenue"],
  "@id": "{{ site.BaseURL }}#organization",
  "name": "{{ site.Params.business.name }}",
  "url": "{{ site.BaseURL }}",
  "logo": "{{ "images/logo/pike-west-logo.png" | absURL }}",
  "image": "{{ "images/venue/main.jpg" | absURL }}",
  "description": "{{ site.Params.description }}",
  "telephone": "{{ site.Params.business.phone }}",
  "email": "{{ site.Params.business.email }}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{ site.Params.business.street }}",
    "addressLocality": "{{ site.Params.business.city }}",
    "addressRegion": "{{ site.Params.business.state }}",
    "postalCode": "{{ site.Params.business.zip }}",
    "addressCountry": "{{ site.Params.business.country }}"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": {{ site.Params.business.latitude }},
    "longitude": {{ site.Params.business.longitude }}
  },
  "priceRange": "{{ site.Params.business.priceRange }}",
  "maximumAttendeeCapacity": {{ site.Params.business.maxCapacity }},
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "09:00",
    "closes": "22:00"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": {{ site.Params.business.latitude }},
      "longitude": {{ site.Params.business.longitude }}
    },
    "geoRadius": "80467"
  },
  "sameAs": [
    {{ with site.Params.social.facebook }}"{{ . }}"{{ end }}
    {{ with site.Params.social.instagram }},
    "{{ . }}"{{ end }}
  ]
}
</script>

{{/* WebPage schema */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "{{ .Title }}",
  "description": "{{ .Params.description | default .Summary | default site.Params.description }}",
  "url": "{{ .Permalink }}",
  "isPartOf": {
    "@type": "WebSite",
    "@id": "{{ site.BaseURL }}#website",
    "name": "{{ site.Title }}",
    "url": "{{ site.BaseURL }}"
  },
  "about": {
    "@id": "{{ site.BaseURL }}#organization"
  }
  {{ if not .IsHome }},
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "{{ site.BaseURL }}"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "{{ .Title }}",
        "item": "{{ .Permalink }}"
      }
    ]
  }
  {{ end }}
}
</script>

{{/* FAQ Schema (if page has FAQ data) */}}
{{ with .Params.faq }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{ range $index, $item := . }}
    {{ if $index }},{{ end }}
    {
      "@type": "Question",
      "name": "{{ $item.question }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ $item.answer }}"
      }
    }
    {{ end }}
  ]
}
</script>
{{ end }}
```

### layouts/partials/schema-event.html

```go-html-template
{{/* layouts/partials/schema-event.html */}}
{{/*
  Purpose: Generates Event schema for specific events (open houses, etc.)
  Context: Expects event data
  Usage: {{ partial "schema-event.html" .Params.event }}
*/}}

{{ with . }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "{{ .name }}",
  "startDate": "{{ .startDate }}",
  "endDate": "{{ .endDate }}",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Pike & West",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "{{ site.Params.business.street }}",
      "addressLocality": "{{ site.Params.business.city }}",
      "addressRegion": "{{ site.Params.business.state }}",
      "postalCode": "{{ site.Params.business.zip }}",
      "addressCountry": "{{ site.Params.business.country }}"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Pike & West",
    "url": "{{ site.BaseURL }}"
  }
  {{ with .description }},
  "description": "{{ . }}"
  {{ end }}
  {{ with .image }},
  "image": "{{ . | absURL }}"
  {{ end }}
}
</script>
{{ end }}
```

---

## Content Front Matter SEO Fields

### Standard Page Front Matter

```yaml
---
title: "Small Wedding Venue in Germantown, TN"
description: "Pike & West offers an intimate art gallery wedding venue in Germantown. Perfect for micro weddings and elopements up to 60 guests."
keywords:
  - small wedding venue Germantown
  - intimate wedding Memphis
  - micro wedding venue Tennessee
  - art gallery wedding
image: "images/weddings/ceremony-setup.jpg"
images:
  - "images/weddings/ceremony-setup.jpg"
  - "images/weddings/reception-detail.jpg"

# SEO controls
noindex: false
canonical: ""  # Override canonical URL if needed

# Taxonomies (for category pages)
event_types:
  - weddings
personas:
  - intimate-elegance-seekers
tags:
  - micro-wedding
  - elopement
  - intimate-venue

# Optional FAQ for FAQ schema
faq:
  - question: "How many guests can Pike & West accommodate?"
    answer: "Pike & West comfortably hosts events up to 60 guests, making it ideal for intimate weddings and small celebrations."
  - question: "Is Pike & West available for elopements?"
    answer: "Yes! We love hosting elopements and micro weddings. Our gallery space provides an elegant backdrop for couples seeking an intimate celebration."
---
```

### Event Type Page Front Matter

```yaml
---
title: "Wedding Venue"
description: "Intimate wedding venue in Germantown, TN. Art gallery setting perfect for micro weddings, elopements, and rehearsal dinners up to 60 guests."
type: "event-type"
layout: "single"
weight: 1

# SEO
keywords:
  - wedding venue Germantown TN
  - small wedding venue Memphis
  - intimate wedding venue
  - art gallery wedding
  - micro wedding venue
image: "images/weddings/og-image.jpg"

# Page-specific settings
gallery:
  - "images/weddings/ceremony.jpg"
  - "images/weddings/reception.jpg"
  - "images/weddings/details.jpg"

# Persona mapping (for internal linking strategy)
personas:
  - intimate-elegance-seekers
---
```

---

## Taxonomy Configuration

### config/\_default/hugo.toml

```toml
[taxonomies]
  event_type = "event-types"
  persona = "personas"
  tag = "tags"
```

### content/event-types/\_index.md

```yaml
---
title: "Event Types"
description: "Explore the types of events Pike & West hosts: weddings, corporate events, private parties, and milestone celebrations."
---
```

### content/personas/\_index.md

```yaml
---
title: "Event Planning Resources"
description: "Event planning guides and resources for couples, families, and corporate planners."
noindex: true  # Don't index taxonomy list pages
---
```

---

## Sitemap Configuration

### layouts/\_default/sitemap.xml (custom if needed)

Hugo generates `sitemap.xml` automatically. To customize priority:

```go-html-template
{{/* layouts/_default/sitemap.xml */}}
{{ printf "<?xml version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\"?>" | safeHTML }}
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  {{ range .Data.Pages }}
  {{ if not .Params.noindex }}
  <url>
    <loc>{{ .Permalink }}</loc>
    {{ if not .Lastmod.IsZero }}
    <lastmod>{{ safeHTML ( .Lastmod.Format "2006-01-02T15:04:05-07:00" ) }}</lastmod>
    {{ end }}
    <changefreq>{{ with .Params.sitemap_changefreq }}{{ . }}{{ else }}weekly{{ end }}</changefreq>
    <priority>{{ with .Params.sitemap_priority }}{{ . }}{{ else }}{{ if .IsHome }}1.0{{ else if eq .Type "event-types" }}0.8{{ else }}0.5{{ end }}{{ end }}</priority>
  </url>
  {{ end }}
  {{ end }}
</urlset>
```

### Front Matter Sitemap Overrides

```yaml
---
title: "Homepage"
sitemap_priority: 1.0
sitemap_changefreq: "daily"
---
```

---

## Robots.txt

### layouts/robots.txt

```go-html-template
{{/* layouts/robots.txt */}}
User-agent: *
Allow: /

# Disallow admin/draft pages
Disallow: /admin/
Disallow: /drafts/

# Sitemap location
Sitemap: {{ "sitemap.xml" | absURL }}

# Host directive (optional, helps with canonical)
Host: {{ site.BaseURL }}
```

---

## Integration in Base Template

### layouts/\_default/baseof.html

```go-html-template
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>{{ if .IsHome }}{{ site.Title }} - Art Gallery & Event Venue in Germantown, TN{{ else }}{{ .Title }} | {{ site.Title }}{{ end }}</title>

  {{/* SEO meta tags */}}
  {{ partial "seo.html" . }}

  {{/* Preconnect for performance */}}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://use.typekit.net">

  {{/* Favicon */}}
  <link rel="icon" href="{{ "favicon.ico" | relURL }}">
  <link rel="apple-touch-icon" href="{{ "apple-touch-icon.png" | relURL }}">

  {{/* CSS */}}
  {{ $scss := resources.Get "scss/main.scss" | toCSS | minify | fingerprint }}
  <link rel="stylesheet" href="{{ $scss.RelPermalink }}" integrity="{{ $scss.Data.Integrity }}">

  {{/* Schema markup */}}
  {{ partial "schema.html" . }}

  {{/* GTM Head */}}
  {{ partial "gtm-head.html" . }}
</head>
<body>
  {{/* GTM Body */}}
  {{ partial "gtm-body.html" . }}

  {{ partial "header.html" . }}

  <main>
    {{ block "main" . }}{{ end }}
  </main>

  {{ partial "footer.html" . }}

  {{/* JavaScript */}}
  {{ $js := resources.Get "js/main.js" | minify | fingerprint }}
  <script src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}" defer></script>
</body>
</html>
```

---

## SEO Checklist for New Content

When creating new pages:

- [ ] Set unique, keyword-rich `title` (50-60 characters)
- [ ] Write compelling `description` (150-160 characters)
- [ ] Add relevant `keywords` array
- [ ] Set `image` for Open Graph
- [ ] Assign appropriate `event_types` taxonomy
- [ ] Map to relevant `personas`
- [ ] Add `faq` if applicable
- [ ] Check canonical URL is correct
- [ ] Verify page renders in sitemap

---

## Testing & Validation

### Tools for Validation

1. **Schema Markup Validator**
   - <https://validator.schema.org/>
   - Test JSON-LD output

2. **Google Rich Results Test**
   - <https://search.google.com/test/rich-results>
   - Verify eligibility for rich snippets

3. **Facebook Sharing Debugger**
   - <https://developers.facebook.com/tools/debug/>
   - Test Open Graph tags

4. **Twitter Card Validator**
   - <https://cards-dev.twitter.com/validator>
   - Test Twitter card rendering

5. **Google Search Console**
   - Submit sitemap
   - Monitor indexing issues
   - Track search performance

### Local Testing Commands

```bash
# Build site and check for issues
hugo --templateMetrics --templateMetricsHints

# Serve locally and test
hugo server -D

# Generate production build
hugo --gc --minify

# Validate HTML output
# Use W3C validator on public/ files
```

---

## Related Documents

- [SEO Strategy Overview](./README.md)
- [Keyword Research](./keyword-research.md)
- [Local SEO Checklist](./local-seo-checklist.md)
- [Analytics Strategy](../../analytics/README.md)
