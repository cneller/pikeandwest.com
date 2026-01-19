# Pike & West - Hugo Migration Project

> Converting pikeandwest.com from Webflow to Hugo while preserving the elegant, luxury aesthetic.

## Project Overview

**Current State:** Webflow-hosted event venue website
**Target State:** Hugo static site with custom theme
**Business:** Art gallery and event venue in Germantown, TN (weddings, corporate events, parties)

### Goals

1. Replicate current design pixel-perfectly in Hugo
2. Maintain SEO rankings during migration
3. Improve performance and eliminate Webflow hosting costs
4. Enable easy content updates without Webflow dependency

## Design System

### Brand Identity

- **Tagline:** "Art and Life. Life and Art. Life as Art."
- **Style:** Minimalist luxury, sophisticated, upscale
- **Imagery:** High-quality venue photography, elegant event shots

### Color Palette

| Color   | Hex       | Usage                        |
|---------|-----------|------------------------------|
| Black   | `#000000` | Primary text, headers, logo  |
| Gold    | `#C9A227` | Accents, buttons, highlights |
| Cream   | `#FFFDD0` | Backgrounds, cards           |
| Vanilla | `#F3E5AB` | Secondary backgrounds        |
| White   | `#FFFFFF` | Base background              |

### Typography

```scss
// Primary Font - Headlines & Navigation
$font-primary: 'Oswald', sans-serif;
$font-weights-primary: (400, 500, 700);

// Secondary Font - Body Text
$font-secondary: 'Montserrat', sans-serif;
$font-weights-secondary: (300, 400, 500, 600);

// Google Fonts Import
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Oswald:wght@400;500;700&display=swap');
```

### Spacing Scale

```scss
$spacing: (
  xs: 0.25rem,   // 4px
  sm: 0.5rem,    // 8px
  md: 1rem,      // 16px
  lg: 1.5rem,    // 24px
  xl: 2rem,      // 32px
  2xl: 3rem,     // 48px
  3xl: 4rem      // 64px
);
```

### Responsive Breakpoints

Breakpoints are aligned exactly with Webflow export values:

| Variable          | Value  | Webflow Query       | Description      |
|-------------------|--------|---------------------|------------------|
| `$breakpoint-sm`  | 479px  | `max-width: 479px`  | Mobile portrait  |
| `$breakpoint-md`  | 767px  | `max-width: 767px`  | Mobile landscape |
| `$breakpoint-lg`  | 991px  | `max-width: 991px`  | Tablet           |
| `$breakpoint-xl`  | 1280px | `min-width: 1280px` | Large desktop    |
| `$breakpoint-2xl` | 1920px | `min-width: 1920px` | Ultra-wide       |

**Usage patterns:**

```scss
// Mobile-first (min-width) - styles apply at breakpoint and above
@media (min-width: $breakpoint-xl) { /* 1280px+ */ }

// Desktop-first (max-width) - styles apply at breakpoint and below
@media (max-width: $breakpoint-lg) { /* 991px and below */ }

// For min-width at standard breakpoints, add 1px
@media (min-width: $breakpoint-md + 1) { /* 768px+ */ }
```

**Header behavior:**

- Full nav buttons: 768px and above (tablets, desktops)
- Hamburger menu: 767px and below (mobile)

## Webflow Reference

The original Webflow site export is preserved for reference during migration:

### Webflow Export Directory

```text
webflow-export/
├── index.html              # Homepage markup
├── contact.html            # Contact page
├── gallery-application.html
├── css/
│   ├── pikeandwest.webflow.css  # Main styles (inspect for exact values)
│   └── webflow.css              # Webflow framework styles
├── fonts/                  # Custom fonts (Le Mores Collection)
├── images/                 # Original images at full resolution
└── js/                     # Webflow interactions
```

### Analysis Documents

- **[CSS Mapping](docs/webflow-to-hugo-css-mapping.md)** - Webflow class → Hugo SCSS mapping
- **[Site Analysis](docs/site-analysis/current-site-documentation.md)** - Original site documentation
- **[Homepage Style Sync](docs/plans/2026-01-16-homepage-style-sync.md)** - Section-by-section sync plan
- **[SCSS Audit](docs/plans/2026-01-16-webflow-scss-audit-alignment.md)** - Breakpoint and style alignment

### Workflow for Style Matching

1. Open `webflow-export/css/pikeandwest.webflow.css` to find exact values
2. Search for Webflow class name (e.g., `.hero-header-section`)
3. Note computed values at each breakpoint (991px, 767px, 479px)
4. Compare with Hugo SCSS and adjust to match

## Site Structure

### Current Pages (Webflow)

```text
/                    # Homepage - Hero, venue gallery, event types, about, contact CTA
/contact             # Contact page - Address, phone, hours, tour scheduling
/gallery-application # Artist application page (minimal content)
```

### Proposed Hugo Structure

```text
pikeandwest.com/
├── archetypes/
│   └── default.md
├── assets/
│   ├── scss/
│   │   ├── _variables.scss      # Design tokens
│   │   ├── _typography.scss     # Font styles
│   │   ├── _buttons.scss        # CTA styling
│   │   ├── _gallery.scss        # Image galleries
│   │   ├── _forms.scss          # Contact forms
│   │   └── main.scss            # Main entry point
│   └── js/
│       └── main.js              # Minimal JS (gallery, mobile nav)
├── content/
│   ├── _index.md                # Homepage content
│   ├── contact.md               # Contact page
│   └── gallery-application.md   # Artist application
├── data/
│   ├── site.yaml                # Global site data
│   ├── team.yaml                # Team member data
│   └── events.yaml              # Event type data
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Base template
│   │   ├── single.html          # Single page template
│   │   └── list.html            # List template
│   ├── index.html               # Homepage template
│   ├── page/
│   │   ├── contact.html         # Contact page layout
│   │   └── gallery-application.html
│   └── partials/
│       ├── head.html            # Meta, fonts, styles
│       ├── header.html          # Navigation
│       ├── footer.html          # Footer with socials
│       ├── hero.html            # Homepage hero section
│       ├── venue-gallery.html   # Image carousel
│       ├── event-types.html     # Event categories grid
│       ├── about.html           # About/team section
│       ├── cta.html             # Call-to-action blocks
│       └── seo.html             # SEO meta tags
├── static/
│   ├── images/
│   │   ├── logo/                # Logo variants
│   │   ├── venue/               # Venue photos
│   │   ├── events/              # Event photos
│   │   └── team/                # Team photos
│   └── favicon.ico
├── config/
│   ├── _default/
│   │   ├── hugo.toml            # Base config
│   │   ├── params.toml          # Site parameters
│   │   └── menus.toml           # Navigation menus
│   └── production/
│       └── hugo.toml            # Production overrides
└── CLAUDE.md
```

## Development Guidelines

### Hugo Version

```bash
# Require hugo-extended for SCSS support
hugo version  # Minimum: v0.146.0+extended
```

### ALWAYS Rules

- **ALWAYS** use Hugo Pipes for SCSS compilation (not external build tools)
- **ALWAYS** use `resources.GetMatch` for images (enables processing)
- **ALWAYS** define responsive image variants with `Resize`
- **ALWAYS** use data files for repeated content (team, events)
- **ALWAYS** include proper alt text for all images
- **ALWAYS** test mobile responsive breakpoints
- **ALWAYS** validate HTML output with W3C validator
- **ALWAYS** run `hugo --gc --minify` for production builds

### NEVER Rules

- **NEVER** hardcode content in templates (use front matter or data files)
- **NEVER** use inline styles (use SCSS)
- **NEVER** commit built files in `/public` directory
- **NEVER** use JavaScript where CSS can accomplish the same effect
- **NEVER** break existing URL paths (maintain SEO)

### Partial Template Standards

```go-html-template
{{/* partials/example.html */}}
{{/*
  Purpose: Brief description of what this partial does
  Context: What data this partial expects (. = Page, dict, etc.)
  Usage: {{ partial "example.html" . }}
*/}}
```

### Image Processing

```go-html-template
{{/* Responsive image with WebP fallback */}}
{{ $img := resources.GetMatch "images/venue/main.jpg" }}
{{ $webp := $img.Resize "800x webp" }}
{{ $jpg := $img.Resize "800x jpg" }}

<picture>
  <source srcset="{{ $webp.RelPermalink }}" type="image/webp">
  <img src="{{ $jpg.RelPermalink }}" alt="Pike & West venue" loading="lazy">
</picture>
```

## Content Migration Checklist

### From Webflow

- [ ] Export all images at highest resolution
- [ ] Document all text content per section
- [ ] Capture exact CSS values (inspect in DevTools)
- [ ] Record all animations and transitions
- [ ] Note form field configurations
- [ ] Screenshot each page at mobile, tablet, desktop

### To Hugo

- [ ] Create base theme structure
- [ ] Implement design tokens (colors, fonts, spacing)
- [ ] Build header/footer partials
- [ ] Create homepage sections as partials
- [ ] Build contact page with form
- [ ] Implement image gallery component
- [ ] Add SEO meta tags
- [ ] Configure analytics (Google Tag Manager)
- [ ] Set up redirects if URLs change
- [ ] Test cross-browser compatibility

## SEO Requirements

### Meta Tags

```go-html-template
{{/* Required for each page */}}
<title>{{ .Title }} | Pike & West</title>
<meta name="description" content="{{ .Params.description }}">
<link rel="canonical" href="{{ .Permalink }}">

{{/* Open Graph */}}
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ .Params.description }}">
<meta property="og:image" content="{{ .Params.image | absURL }}">
<meta property="og:url" content="{{ .Permalink }}">

{{/* Local Business Schema */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "name": "Pike & West",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2277 West Street",
    "addressLocality": "Germantown",
    "addressRegion": "TN",
    "postalCode": "38138"
  },
  "telephone": "+1-901-206-5575"
}
</script>
```

### URL Structure

Maintain exact URL paths from Webflow:

- `/` - Homepage
- `/contact` - Contact page
- `/gallery-application` - Artist application

## External Integrations

### Analytics & Tracking

```toml
# config/_default/params.toml
[analytics]
  googleTagManager = "GTM-XXXXXX"  # Get from current Webflow site
```

### Social Media

```toml
[social]
  instagram = "https://www.instagram.com/pikeandwest/"
  facebook = "https://www.facebook.com/pikeandwest"
```

### Contact Information

```yaml
# data/site.yaml
contact:
  phone: "901.206.5575"
  address:
    street: "2277 West Street"
    city: "Germantown"
    state: "TN"
    zip: "38138"
  hours: "Available by appointment only"
  googleMapsUrl: "https://maps.google.com/..."
```

## Testing Requirements

### Visual Regression

- Compare screenshots of Hugo build vs live Webflow site
- Test at Webflow breakpoints: 375px (mobile), 768px (tablet), 992px (desktop), 1280px (large), 1920px (ultra-wide)
- Verify all hover states and animations

### Performance Targets

| Metric                   | Target  |
|--------------------------|---------|
| Lighthouse Score         | > 95    |
| First Contentful Paint   | < 1.5s  |
| Largest Contentful Paint | < 2.5s  |
| Total Page Size          | < 500KB |

### Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Deployment

### Recommended: Cloudflare Pages

```bash
# Build command
hugo --gc --minify

# Build output directory
public

# Environment variables
HUGO_VERSION=0.146.0
```

### Alternative Options

- Netlify
- Vercel
- GitHub Pages

### Domain Configuration

- Set up DNS records pointing to hosting provider
- Configure SSL certificate (automatic with CF Pages)
- Set up `www` to apex redirect

## Commands Reference

```bash
# Development server with drafts
hugo server -D

# Production build
hugo --gc --minify

# Check for broken links
hugo --templateMetrics --templateMetricsHints

# Create new content
hugo new content/page-name.md
```

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Theme Development Best Practices](https://discourse.gohugo.io/t/best-practices-for-theme-development-hugo-modules/30568)
- [New Template System (v0.146.0)](https://gohugo.io/templates/new-templatesystem-overview/)
- [Hugo Partial Templates](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/hugo-partials/)
- [Building Hugo Themes with Go Templates](https://dasroot.net/posts/2025/12/building-hugo-themes-with-go-templates/)
