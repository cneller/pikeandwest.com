# Hugo Partials Reference

Complete reference of all Hugo partials, their purpose, parameters, and usage locations.

**Last Updated:** 2026-01-29

---

## Quick Reference

| Partial                                                  | Purpose                    | Cached  | Used By        |
|----------------------------------------------------------|----------------------------|---------|----------------|
| [gtm-head.html](#gtm-headhtml)                           | GTM script injection       | **Yes** | baseof.html    |
| [gtm-body.html](#gtm-bodyhtml)                           | GTM noscript fallback      | **Yes** | baseof.html    |
| [header.html](#headerhtml)                               | Site navigation            | **Yes** | baseof.html    |
| [footer.html](#footerhtml)                               | Site footer                | **Yes** | baseof.html    |
| [head.html](#headhtml)                                   | Meta tags, styles, fonts   | No      | baseof.html    |
| [structured-data.html](#structured-datahtml)             | JSON-LD schemas            | No      | head.html      |
| [breadcrumb-schema.html](#breadcrumb-schemahtml)         | BreadcrumbList JSON-LD     | No      | head.html      |
| [schema-local-business.html](#schema-local-businesshtml) | LocalBusiness JSON-LD      | **Yes** | baseof.html    |
| [speculation-rules.html](#speculation-ruleshtml)         | Prefetch/prerender rules   | **Yes** | head.html      |
| [breadcrumb.html](#breadcrumbhtml)                       | Breadcrumb navigation      | No      | blog/, events/ |
| [hero.html](#herohtml)                                   | Homepage hero section      | **Yes** | index.html     |
| [cta-banner.html](#cta-bannerhtml)                       | Call-to-action banner      | **Yes** | baseof.html    |
| [venue-gallery.html](#venue-galleryhtml)                 | Photo carousel             | **Yes** | index.html     |
| [responsive-image.html](#responsive-imagehtml)           | Reusable responsive images | No      | (utility)      |
| [contact-form-shimmer.html](#contact-form-shimmerhtml)   | Form loading placeholder   | No      | contact.html   |
| [about.html](#abouthtml)                                 | About section              | **Yes** | index.html     |
| [event-types.html](#event-typeshtml)                     | Event type grid            | **Yes** | index.html     |
| [pagination.html](#paginationhtml)                       | Blog pagination            | No      | blog/list.html |
| [scripts.html](#scriptshtml)                             | JavaScript bundle          | **Yes** | baseof.html    |

---

## Dependency Tree

```text
baseof.html (BASE TEMPLATE)
├── head.html
│   ├── speculation-rules.html
│   ├── structured-data.html
│   └── breadcrumb-schema.html (blog pages only)
├── gtm-head.html
├── gtm-body.html
├── header.html (cached)
├── [main block - page content]
├── cta-banner.html (excludes contact/404)
├── footer.html (cached)
├── schema-local-business.html (cached)
└── scripts.html

index.html (HOMEPAGE)
├── hero.html
├── venue-gallery.html
├── event-types.html
└── about.html

blog/single.html
└── breadcrumb.html

blog/list.html
├── breadcrumb.html
└── pagination.html

events/single.html
└── breadcrumb.html

events/list.html
└── breadcrumb.html

page/contact.html
└── contact-form-shimmer.html
```

---

## Analytics & Tracking

### gtm-head.html

Google Tag Manager script injection for `<head>` section.

**Location:** `layouts/partials/gtm-head.html`

**Context:** Site (`.`)

**Parameters:** None (reads `site.Params.analytics.googleTagManager`)

**Called From:**

| Template               | Line | Method    |
|------------------------|------|-----------|
| `_default/baseof.html` | 5    | `partial` |

**Notes:**

- Only renders in production environment
- GTM Container ID: `GTM-P8XR8C5S`

---

### gtm-body.html

Google Tag Manager noscript fallback for `<body>` section.

**Location:** `layouts/partials/gtm-body.html`

**Context:** Site (`.`)

**Parameters:** None (reads `site.Params.analytics.googleTagManager`)

**Called From:**

| Template               | Line | Method    |
|------------------------|------|-----------|
| `_default/baseof.html` | 8    | `partial` |

**Notes:**

- Fallback for users with JavaScript disabled
- Only renders in production environment

---

## Navigation

### header.html

Site-wide header with logo, navigation menu, and CTA buttons.

**Location:** `layouts/partials/header.html`

**Context:** Site (`.`)

**Parameters:** None (reads `.Site.Menus.main`)

**Called From:**

| Template               | Line | Method          |
|------------------------|------|-----------------|
| `_default/baseof.html` | 10   | `partialCached` |

**Notes:**

- **Cached** for performance
- Responsive navigation with hamburger menu for mobile
- Primary (gold) and outline button styling for CTAs

---

### footer.html

Site-wide footer with 3-column layout (brand, navigation, contact).

**Location:** `layouts/partials/footer.html`

**Context:** Site (`.`)

**Parameters:** None (reads menus: `footer_events`, `footer_explore`, `footer_legal`)

**Called From:**

| Template               | Line | Method          |
|------------------------|------|-----------------|
| `_default/baseof.html` | 22   | `partialCached` |

**Data Dependencies:**

- `site.Data.site_settings.contact`
- `site.Data.site_settings.social`

**Notes:**

- **Cached** for performance
- Includes social icons (Instagram, Facebook)
- Contact info and copyright

---

### breadcrumb.html

Accessible breadcrumb navigation with multiple styling options.

**Location:** `layouts/partials/breadcrumb.html`

**Context:** Page (`.`) or dict with options

**Parameters:**

| Parameter       | Type | Default  | Description                        |
|-----------------|------|----------|------------------------------------|
| `Page`          | Page | required | The page context (when using dict) |
| `noContainer`   | bool | `false`  | Omit container wrapper             |
| `heroOverlay`   | bool | `false`  | Style for overlay on hero image    |
| `accentBar`     | bool | `false`  | Gold accent line above             |
| `narrowContent` | bool | `false`  | Align with narrower content width  |

**Called From:**

| Template             | Line | Parameters                               |
|----------------------|------|------------------------------------------|
| `blog/list.html`     | 17   | `accentBar: true`                        |
| `blog/single.html`   | 35   | `accentBar: true`, `narrowContent: true` |
| `events/list.html`   | 31   | `accentBar: true`                        |
| `events/single.html` | 33   | `accentBar: true`, `narrowContent: true` |

**Usage Examples:**

```go-html-template
{{/* Simple usage */}}
{{ partial "breadcrumb.html" . }}

{{/* With options */}}
{{ partial "breadcrumb.html" (dict "Page" . "accentBar" true "narrowContent" true) }}
```

---

## SEO & Structured Data

### head.html

Meta tags, fonts, stylesheets, critical CSS, and performance optimizations.

**Location:** `layouts/partials/head.html`

**Context:** Page (`.`)

**Parameters:** None

**Called From:**

| Template               | Line | Method    |
|------------------------|------|-----------|
| `_default/baseof.html` | 4    | `partial` |

**Calls Nested Partials:**

| Partial                  | Line | Condition         |
|--------------------------|------|-------------------|
| `speculation-rules.html` | 253  | Always            |
| `structured-data.html`   | 261  | Always            |
| `breadcrumb-schema.html` | 265  | Blog section only |

**Handles:**

- Critical CSS inlining
- Font preloading (Adobe Fonts, Google Fonts)
- LCP image preloading
- Pagination SEO tags (rel prev/next)
- Open Graph meta tags
- Twitter Card meta tags
- Canonical URLs

---

### structured-data.html

JSON-LD structured data for all page types.

**Location:** `layouts/partials/structured-data.html`

**Context:** Page (`.`)

**Parameters:** None

**Called From:**

| Template    | Line | Method    |
|-------------|------|-----------|
| `head.html` | 261  | `partial` |

**Schema Types Generated:**

- Organization
- EventVenue
- BlogPosting (blog pages)
- FAQPage (FAQ sections)
- WebSite
- BreadcrumbList

---

### breadcrumb-schema.html

JSON-LD BreadcrumbList schema specifically for blog pages.

**Location:** `layouts/partials/breadcrumb-schema.html`

**Context:** Page (`.`)

**Parameters:** None

**Called From:**

| Template    | Line | Condition               |
|-------------|------|-------------------------|
| `head.html` | 265  | Blog section pages only |

---

### schema-local-business.html

JSON-LD LocalBusiness/EventVenue schema for Pike & West.

**Location:** `layouts/partials/schema-local-business.html`

**Context:** Site (`.`)

**Parameters:** None

**Called From:**

| Template               | Line | Method          |
|------------------------|------|-----------------|
| `_default/baseof.html` | 25   | `partialCached` |

**Data Dependencies:**

- `site.Data.site_settings.contact`
- `site.Data.site_settings.social`

**Notes:**

- **Cached** for performance
- Includes amenities, geo coordinates, opening hours

---

### speculation-rules.html

Prefetch/prerender rules for faster page navigation (Chromium 109+).

**Location:** `layouts/partials/speculation-rules.html`

**Context:** Page (`.`)

**Parameters:** None

**Called From:**

| Template    | Line | Method    |
|-------------|------|-----------|
| `head.html` | 253  | `partial` |

**Notes:**

- Progressive enhancement
- Graceful fallback for non-Chromium browsers

---

## Homepage Sections

### hero.html

Homepage hero section with background image, foreground image, and CTA.

**Location:** `layouts/partials/hero.html`

**Context:** None (uses data files)

**Parameters:** None

**Data Dependencies:**

- `site.Data.hero`

**Called From:**

| Template     | Line | Method    |
|--------------|------|-----------|
| `index.html` | 1    | `partial` |

**Notes:**

- Responsive image srcsets
- WebP + JPEG fallback
- Does not use page context

---

### venue-gallery.html

Venue photo gallery carousel with PhotoSwipe lightbox integration.

**Location:** `layouts/partials/venue-gallery.html`

**Context:** None (uses data files)

**Parameters:** None

**Data Dependencies:**

- `site.Data.venue_gallery`

**Called From:**

| Template     | Line | Method    |
|--------------|------|-----------|
| `index.html` | 2    | `partial` |

**Notes:**

- CSS scroll-snap carousel
- PhotoSwipe for lightbox
- WebP + JPEG variants

---

### event-types.html

Grid of event type cards.

**Location:** `layouts/partials/event-types.html`

**Context:** None (uses data files)

**Parameters:** None

**Data Dependencies:**

- `site.Data.events`

**Called From:**

| Template     | Line | Method    |
|--------------|------|-----------|
| `index.html` | 2    | `partial` |

**Notes:**

- Dynamic grid layout
- Icon processing
- Links to `/contact/` or custom link per event type

---

### about.html

About section with text blocks and images.

**Location:** `layouts/partials/about.html`

**Context:** None (uses data files)

**Parameters:** None

**Data Dependencies:**

- `site.Data.about`

**Called From:**

| Template     | Line | Method    |
|--------------|------|-----------|
| `index.html` | 3    | `partial` |

**Notes:**

- Reverse layout option per block
- Responsive image handling with WebP

---

### cta-banner.html

Call-to-action banner section with background image.

**Location:** `layouts/partials/cta-banner.html`

**Context:** None (uses data files)

**Parameters:** None

**Data Dependencies:**

- `site.Data.cta_banner`

**Called From:**

| Template               | Line | Condition                      |
|------------------------|------|--------------------------------|
| `_default/baseof.html` | 19   | Excludes contact and 404 pages |

---

## Utility Partials

### responsive-image.html

Reusable responsive image partial with WebP support and lazy loading.

**Location:** `layouts/partials/responsive-image.html`

**Context:** Dict with image parameters

**Parameters:**

| Parameter       | Type     | Default                       | Description                                  |
|-----------------|----------|-------------------------------|----------------------------------------------|
| `image`         | Resource | required                      | Hugo image resource                          |
| `alt`           | string   | required                      | Alt text                                     |
| `sizes`         | string   | `"100vw"`                     | Sizes attribute for responsive images        |
| `widths`        | array    | `[400, 600, 800, 1200, 1600]` | Widths to generate                           |
| `class`         | string   | -                             | CSS class for img element                    |
| `loading`       | string   | `"lazy"`                      | `"lazy"` or `"eager"`                        |
| `fetchpriority` | string   | -                             | `"high"`, `"low"`, `"auto"` (for LCP images) |
| `quality`       | int      | `85`                          | Image quality 1-100                          |

**Usage Example:**

```go-html-template
{{ $img := resources.Get "images/photos/venue-exterior.jpg" }}
{{ partial "responsive-image.html" (dict
  "image" $img
  "alt" "Pike & West venue interior"
  "sizes" "(max-width: 768px) 100vw, 50vw"
  "widths" (slice 400 800 1200)
  "class" "venue-image"
  "loading" "eager"
  "fetchpriority" "high"
) }}
```

**Notes:**

- Currently a utility partial (not actively used in templates)
- Generates WebP + fallback formats
- Comprehensive documentation in partial file

---

### contact-form-shimmer.html

Loading placeholder for HubSpot contact form with shimmer animation.

**Location:** `layouts/partials/contact-form-shimmer.html`

**Context:** Site (`.`)

**Parameters:** None (reads `.Site.Params.forms.contactEmbed`)

**Called From:**

| Template            | Line | Context Passed |
|---------------------|------|----------------|
| `page/contact.html` | 8    | `$`            |

**Notes:**

- Pixel-perfect pulse shimmer placeholder
- Displays while HubSpot iframe loads

---

### pagination.html

Blog pagination with responsive page numbers and prev/next links.

**Location:** `layouts/partials/pagination.html`

**Context:** Page (`.`)

**Parameters:** None (uses `.Paginator`)

**Called From:**

| Template         | Line | Method    |
|------------------|------|-----------|
| `blog/list.html` | 63   | `partial` |

**Notes:**

- Responsive: hides page numbers on mobile
- Includes SEO rel attributes (prev/next)

---

### scripts.html

Load main JavaScript bundle with integrity checks.

**Location:** `layouts/partials/scripts.html`

**Context:** None

**Parameters:** None

**Called From:**

| Template               | Line | Method    |
|------------------------|------|-----------|
| `_default/baseof.html` | 27   | `partial` |

**Notes:**

- Minified and fingerprinted
- Uses SRI (Subresource Integrity)
- Defer loading for performance

---

## Data File Dependencies

Partials that read from `data/` files instead of page context:

| Partial                    | Data File                 |
|----------------------------|---------------------------|
| hero.html                  | `data/hero.yaml`          |
| cta-banner.html            | `data/cta_banner.yaml`    |
| venue-gallery.html         | `data/venue_gallery.yaml` |
| about.html                 | `data/about.yaml`         |
| event-types.html           | `data/events.yaml`        |
| footer.html                | `data/site_settings.yaml` |
| schema-local-business.html | `data/site_settings.yaml` |

---

## Caching Strategy

Twelve partials use `partialCached` for performance:

| Partial                    | Cache Key  | Reason                            |
|----------------------------|------------|-----------------------------------|
| header.html                | Site-level | Uses site.Menus only              |
| footer.html                | Site-level | Uses site.Data + menus            |
| schema-local-business.html | Site-level | Uses site.Data only               |
| gtm-head.html              | Site-level | Uses site.Params only             |
| gtm-body.html              | Site-level | Uses site.Params only             |
| scripts.html               | Site-level | Static JS bundle                  |
| speculation-rules.html     | Site-level | Static JSON                       |
| hero.html                  | Site-level | Uses site.Data.hero only          |
| venue-gallery.html         | Site-level | Uses site.Data.venue_gallery only |
| about.html                 | Site-level | Uses site.Data.about only         |
| event-types.html           | Site-level | Uses site.Data.events only        |
| cta-banner.html            | Site-level | Uses site.Data.cta_banner only    |

**Not cached (page-specific content):**

- head.html - Title, description, permalink, params, paginator
- structured-data.html - Page-specific schema (BlogPosting, BreadcrumbList)
- breadcrumb.html - Page hierarchy
- breadcrumb-schema.html - Page-specific breadcrumb JSON-LD
- pagination.html - Paginator state
- responsive-image.html - Parameterized utility
- contact-form-shimmer.html - Only used on one page
