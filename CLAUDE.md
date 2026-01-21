# Pike & West - Hugo Migration Project

> Converting pikeandwest.com from Webflow to Hugo while preserving the elegant, luxury aesthetic.

**See [README.md](README.md) for quick start, badges, and contributor overview.**

This document contains detailed development guidelines, design system specifications, and AI assistant context for working on this project.

---

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

> **Verified via Webflow MCP extraction on 2026-01-20**

| Color    | Hex       | CSS Variable | Usage                        |
|----------|-----------|--------------|------------------------------|
| PW Black | `#434345` | --pw-black   | Primary text, headers        |
| PW Gold  | `#aa6e0b` | --pw-gold    | Accents, buttons, highlights |
| PW Cream | `#fff7e1` | --pw-cream   | Backgrounds, cards           |
| White    | `white`   | --white      | Base background              |
| Black    | `black`   | --black      | Pure black accents           |

### Typography

> **Verified via Webflow MCP extraction on 2026-01-20**

```scss
// Primary Font - Headlines (Adobe Fonts / Typekit)
$font-headline: 'le-mores-collection', serif;
// Typekit Kit ID: jxr6fkv

// Secondary Font - Body Text (Google Fonts)
$font-body: 'Montserrat', sans-serif;
$font-weights-body: (300, 400, 500, 600);

// Tertiary Font - Navigation/Buttons (Google Fonts)
$font-nav: 'Oswald', sans-serif;
$font-weights-nav: (200, 300, 400, 500, 600, 700);

// Font Loading
// 1. Adobe Fonts (Typekit): <script src="https://use.typekit.net/jxr6fkv.js"></script>
// 2. Google Fonts via WebFont.js for Montserrat + Oswald
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
- Hamburger menu: 991px and below (tablet/mobile)

## Architecture Decisions

Key decisions made during development. Full details in `docs/architecture/decisions/`.

| Decision             | Choice             | Rationale                                                                                                                                        |
|----------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Header positioning   | `position: sticky` | Eliminates padding/margin offset hacks ([ADR-001](docs/architecture/decisions/ADR-001-sticky-header.md))                                         |
| Hamburger animation  | 3D Y-axis flip     | Luxury brand feel; elastic easing `cubic-bezier(0.68, -0.6, 0.32, 1.6)` ([ADR-002](docs/architecture/decisions/ADR-002-hamburger-animations.md)) |
| Hamburger breakpoint | 991px              | Webflow alignment; nav buttons visible on tablets ([ADR-004](docs/architecture/decisions/ADR-004-responsive-breakpoints.md))                     |
| Hero height          | 75vh/65vh/60vh     | Shows content peek below fold; Webflow parity ([ADR-003](docs/architecture/decisions/ADR-003-hero-layout.md))                                    |
| Breakpoints          | Webflow-aligned    | 479/767/991/1280/1920px for pixel-perfect parity ([ADR-004](docs/architecture/decisions/ADR-004-responsive-breakpoints.md))                      |

## Implementation Patterns

Quick reference for common patterns. Full details in `docs/architecture/patterns/`.

### 3D CSS Animation

```scss
.container { perspective: 200px; }
.child {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
.child.open { transform: rotateY(180deg); }
```

### Sticky Header

```scss
.header {
  position: sticky;
  top: 0;
  z-index: $z-index-header;
}
// No offset hacks needed on content
```

See also: [Animation Patterns](docs/architecture/patterns/animation-patterns.md) | [SCSS Organization](docs/architecture/patterns/scss-organization.md)

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

- **[Next Steps](docs/next-steps.md)** - Current project status and upcoming work (keep updated)
- **[Analytics Strategy](docs/analytics/README.md)** - GTM/GA4 configuration and cross-domain tracking
- **[CSS Mapping](docs/webflow-to-hugo-css-mapping.md)** - Webflow class → Hugo SCSS mapping
- **[Site Analysis](docs/site-analysis/current-site-documentation.md)** - Original site documentation
- **[Architecture Decisions](docs/architecture/decisions/)** - ADRs for key technical decisions
- **[Implementation Patterns](docs/architecture/patterns/)** - Reusable code patterns

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

### Lighthouse CI & Troubleshooting

Lighthouse runs automatically on PRs via GitHub Actions. Each page is tested separately.

**Quick check PR scores:**

```bash
# View all checks for a PR (shows pass/fail status)
gh pr checks <PR_NUMBER>

# Example output shows Performance / Home, Performance / Blog, etc.
```

**Find detailed Lighthouse reports:**

```bash
# Get the run ID from pr checks, then view logs
gh run view <RUN_ID> --log | grep -A 50 "Lighthouse"

# Look for lines like:
# "Open the report at https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/..."
```

**Report URLs are in the format:**
`https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/<timestamp>-<id>.report.html`

**Common SEO issues to check in reports:**

- Missing meta descriptions
- Images without alt text
- Tap targets too small (mobile)
- Links not crawlable
- robots.txt blocking

**Configuration:** See `lighthouserc.json` for assertion thresholds and tested URLs.

**Cloudflare Pages preview vs production:**

- Preview deployments have `x-robots-tag: noindex` header (Cloudflare protection)
- This causes `is-crawlable` audit to fail on PRs (69% SEO score)
- Production deployments don't have this header (100% SEO score)
- The workflow passes `is-preview: true` for PRs, which sets `LHCI_ASSERT__ASSERTIONS__IS_CRAWLABLE=off`
- Production runs keep the check enabled to catch real crawlability issues

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

## Project Status & Next Steps

**Current project status and upcoming work is tracked in [docs/next-steps.md](docs/next-steps.md).**

**IMPORTANT:** Keep `docs/next-steps.md` up to date:

- Update the "Current Status" table when project phases change
- Move completed tasks from checklists to the Changelog
- Add new tasks discovered during development
- Update "Last Updated" date when making changes
- Link to relevant documentation for new features

## Architecture Documentation Maintenance

**When to create a new ADR** (`docs/architecture/decisions/ADR-XXX-*.md`):

- Making a significant technical decision (positioning, animation approach, breakpoints)
- Choosing between multiple valid approaches
- Decisions that future developers might question "why did we do it this way?"
- Changes that affect multiple files or components

**When to update Implementation Patterns** (`docs/architecture/patterns/`):

- Discovering a reusable code pattern worth preserving
- Refining an existing pattern based on learnings
- Adding new animation techniques, SCSS conventions, or Hugo template patterns

**When to update CLAUDE.md Architecture Decisions table**:

- After creating any new ADR, add a row summarizing the decision
- Keep the table as a quick-reference index to full ADRs

**ADR Naming Convention:** `ADR-XXX-short-description.md` (e.g., `ADR-005-gallery-carousel.md`)

## Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Theme Development Best Practices](https://discourse.gohugo.io/t/best-practices-for-theme-development-hugo-modules/30568)
- [New Template System (v0.146.0)](https://gohugo.io/templates/new-templatesystem-overview/)
- [Hugo Partial Templates](https://cloudcannon.com/tutorials/hugo-beginner-tutorial/hugo-partials/)
- [Building Hugo Themes with Go Templates](https://dasroot.net/posts/2025/12/building-hugo-themes-with-go-templates/)
