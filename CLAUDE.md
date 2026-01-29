# Pike & West - Website

**See [README.md](README.md) for quick start, badges, and contributor overview.**

This document contains detailed development guidelines, design system specifications, and AI assistant context for working on this project.

---

## Project Overview

**Target State:** Hugo static site with custom theme
**Business:** Art gallery and event venue in Germantown, TN (weddings, corporate events, parties)

## Design System

### Brand Identity

- **Tagline:** "Art and Life. Life and Art. Life as Art."
- **Style:** Minimalist luxury, sophisticated, upscale
- **Imagery:** High-quality venue photography, elegant event shots

### Color Palette

| Color    | Hex       | CSS Variable | Usage                        |
|----------|-----------|--------------|------------------------------|
| PW Black | `#434345` | --pw-black   | Primary text, headers        |
| PW Gold  | `#aa6e0b` | --pw-gold    | Accents, buttons, highlights |
| PW Cream | `#fff7e1` | --pw-cream   | Backgrounds, cards           |
| White    | `white`   | --white      | Base background              |
| Black    | `black`   | --black      | Pure black accents           |

### Typography

```scss
// Primary Font - Headlines (Adobe Fonts / Typekit)
$font-headline: "le-mores-collection", serif;
// Typekit Kit ID: jxr6fkv

// Secondary Font - Body Text (Google Fonts)
$font-body: "Montserrat", sans-serif;
$font-weights-body: (300, 400, 500, 600);

// Tertiary Font - Navigation/Buttons (Google Fonts)
$font-nav: "Oswald", sans-serif;
$font-weights-nav: (200, 300, 400, 500, 600, 700);

// Font Loading
// 1. Adobe Fonts (Typekit): <script src="https://use.typekit.net/jxr6fkv.js"></script>
// 2. Google Fonts via WebFont.js for Montserrat + Oswald
```

### Spacing Scale

```scss
$spacing: (
  xs: 0.25rem,
  // 4px
  sm: 0.5rem,
  // 8px
  md: 1rem,
  // 16px
  lg: 1.5rem,
  // 24px
  xl: 2rem,
  // 32px
  2xl: 3rem,
  // 48px
  3xl: 4rem, // 64px
);
```

### Responsive Breakpoints

| Variable          | Value  | Description      |
|-------------------|--------|------------------|
| `$breakpoint-sm`  | 479px  | Mobile portrait  |
| `$breakpoint-md`  | 767px  | Mobile landscape |
| `$breakpoint-lg`  | 991px  | Tablet           |
| `$breakpoint-xl`  | 1280px | Large desktop    |
| `$breakpoint-2xl` | 1920px | Ultra-wide       |

**Usage patterns:**

```scss
// Mobile-first (min-width) - styles apply at breakpoint and above
@media (min-width: $breakpoint-xl) {
  /* 1280px+ */
}

// Desktop-first (max-width) - styles apply at breakpoint and below
@media (max-width: $breakpoint-lg) {
  /* 991px and below */
}

// For min-width at standard breakpoints, add 1px
@media (min-width: $breakpoint-md + 1) {
  /* 768px+ */
}
```

**Header behavior:**

- Full nav buttons: 768px and above (tablets, desktops)
- Hamburger menu: 991px and below (tablet/mobile)

## CTA Language System

The site uses distinct CTA language to differentiate between venue rentals and workshop attendance:

| User Intent       | CTA Language      | Where Used                            |
|-------------------|-------------------|---------------------------------------|
| Rent the venue    | "Host Your Event" | Header (primary), Event types, Footer |
| See the space     | "Book a Tour"     | Hero, CTA banner                      |
| Attend a workshop | "Workshops"       | Header (secondary), Footer            |
| Teach a workshop  | "Get in Touch"    | Workshops page secondary CTA          |

**Key CTAs by location:**

| Location                | CTA             | Links To      |
|-------------------------|-----------------|---------------|
| Header (outline button) | Workshops       | `/workshops/` |
| Header (gold button)    | Host Your Event | `/contact/`   |
| Hero section            | BOOK A TOUR     | `/contact/`   |
| Event types section     | HOST YOUR EVENT | `/contact/`   |
| CTA banner              | Book a Tour     | `/contact/`   |
| Footer                  | Host an Event   | `/contact/`   |
| Footer                  | Workshops       | `/workshops/` |

See [Workshops Plan](docs/plans/2026-01-23-workshops-classes-feature.md) for full implementation details.

## Implementation Patterns

Quick reference for common patterns. Full details in `docs/architecture/patterns/`.

### PhotoSwipe Lightbox

Site uses PhotoSwipe 5 for image galleries. Loaded via CDN with dynamic ES module imports.

**Enable on any gallery container:**

```html
<div data-pswp-gallery="unique-name">
  <a href="/full.jpg" data-pswp-width="1600" data-pswp-height="1200">
    <img src="/thumb.jpg" alt="Description" />
  </a>
</div>
```

**Hugo template pattern** (with image processing):

```go-html-template
{{ $full := $image.Resize "1600x webp q90" }}
<a href="{{ $full.RelPermalink }}"
   data-pswp-width="{{ $full.Width }}"
   data-pswp-height="{{ $full.Height }}">
  <img src="{{ $thumb.RelPermalink }}" alt="{{ $alt }}">
</a>
```

**Blog post shortcode:**

```markdown
{{</* gallery name="event-name" cols="3" */>}}
![Alt text](image.jpg)
![Another image](image2.jpg)
{{</* /gallery */>}}
```

**Parameters:**

- `name`: Gallery group name (images navigate together)
- `cols`: Grid columns (2, 3, or 4; default 3)

See also: [Animation Patterns](docs/architecture/patterns/animation-patterns.md) | [SCSS Organization](docs/architecture/patterns/scss-organization.md)

## Blog Post Styling

The blog supports magazine-style visual enhancements for engaging, professional content. Full documentation in `.claude/agents/blog-editor.md`.

### Required Elements (Every Post)

| Element          | Implementation               | Notes                                   |
|------------------|------------------------------|-----------------------------------------|
| Drop cap         | Automatic on first paragraph | Uses `::first-letter` for accessibility |
| Pull quotes      | `{{</* pull-quote */>}}`     | 1-2 per 1000 words                      |
| Section dividers | `{{</* divider */>}}`        | 2-3 per article                         |

### Taxonomy (Categories vs Tags)

**Categories** = Event type (1 per post). Maps to persona.

| Category         | Persona                      |
|------------------|------------------------------|
| Birthdays        | Michelle (Milestone Mom)     |
| Baby Showers     | Jasmine (Joyful Auntie)      |
| Anniversaries    | Diana (Devoted Wife)         |
| Corporate Events | Victoria (VP of Events)      |
| Graduations      | Grace (Proud Graduate's Mom) |
| Celebrations     | General (prom, engagement)   |
| Weddings         | Bride/Planner                |
| News             | All (meta)                   |

**Tags** = Descriptive metadata (3-6 per post).

| Tag Group    | Examples                                            |
|--------------|-----------------------------------------------------|
| Event Detail | `milestone birthday`, `prom send-off`, `sprinkle`   |
| Planning     | `planning tips`, `checklist`, `behind the scenes`   |
| Theme        | `boho`, `elegant`, `romantic`, `intimate gathering` |
| Seasonal     | `spring`, `winter`, `holidays`, `valentines day`    |
| Audience     | `families`, `couples`, `teens`, `professionals`     |
| Location     | `germantown`, `memphis`                             |

See `data/blog_taxonomy.yaml` for full list and persona mappings.

### All Available Shortcodes

#### Drop Caps

Automatic on first paragraph. Disable with `{.no-drop-cap}` or add manually with `{.drop-cap}`.

#### Pull Quotes

```markdown
{{</* pull-quote */>}}Highlighted quote{{</* /pull-quote */>}}
{{</* pull-quote author="Name" */>}}Quote with attribution{{</* /pull-quote */>}}
{{</* pull-quote position="right" */>}}Floated right{{</* /pull-quote */>}}
```

#### Section Dividers

```markdown
{{</* divider */>}} <!-- Gold diamond (default) -->
{{</* divider style="line" */>}} <!-- Gradient gold line -->
{{</* divider style="flourish" */>}} <!-- Fading lines -->
```

#### Standfirst (Intro Summary)

```markdown
{{</* standfirst */>}}
Bold intro paragraph bridging headline and body copy.
{{</* /standfirst */>}}
```

#### Kicker (Category Label)

```markdown
{{</* kicker */>}}Planning Tips{{</* /kicker */>}}
```

#### Tip Box

```markdown
{{</* tip */>}}Planning advice here.{{</* /tip */>}}
{{</* tip title="Insider Tip" */>}}Custom title.{{</* /tip */>}}
```

#### Fact Box

```markdown
{{</* fact-box title="At a Glance" */>}}

- **Capacity:** 150 seated
- **Square Feet:** 4,500
  {{</* /fact-box */>}}

{{</* fact-box title="Details" position="right" */>}}
Floated sidebar version.
{{</* /fact-box */>}}
```

#### Key Takeaways

```markdown
{{</* key-takeaways */>}}

- Main point one
- Main point two
  {{</* /key-takeaways */>}}
```

#### Timeline

```markdown
{{</* timeline title="Planning Timeline" */>}}

- **12-18 months:** Book venue
- **9-12 months:** Send save-the-dates
  {{</* /timeline */>}}
```

#### Sidebar Quote (Testimonial)

```markdown
{{</* sidebar-quote author="Sarah M." event="Wedding, Oct 2025" */>}}
Pike & West made our day magical.
{{</* /sidebar-quote */>}}
```

#### Numbered List (Styled Steps)

```markdown
{{</* numbered-list title="How to Book" */>}}

1. Choose your date
2. Schedule a tour
3. Review options
   {{</* /numbered-list */>}}
```

#### Image Gallery

```markdown
{{</* gallery name="unique-name" cols="3" */>}}
![Alt text](image1.jpg)
![Alt text](image2.jpg)
{{</* /gallery */>}}
```

Opens in PhotoSwipe lightbox with swipe/zoom.

### When to Use Each Feature

| Feature       | Best Used For                   |
|---------------|---------------------------------|
| Drop caps     | Article opening (automatic)     |
| Pull quotes   | Key insights, emotional moments |
| Dividers      | Major topic transitions         |
| Standfirst    | Long articles needing summary   |
| Kicker        | Categorized content             |
| Tip box       | Planning advice, pro tips       |
| Fact box      | Venue specs, quick stats        |
| Key takeaways | End of long articles            |
| Timeline      | Planning guides, milestones     |
| Sidebar quote | Client testimonials             |
| Numbered list | Step-by-step instructions       |

### Blog Editor Agent (Auto-Delegated)

**The blog-editor agent is automatically invoked when working with `content/blog/*/index.md` files (page bundles).** It handles all editorial styling decisions and ensures consistent formatting across posts.

Located at `.claude/agents/blog-editor.md`, the agent:

- Applies required elements (drop caps, pull quotes, dividers)
- Selects content-appropriate elements (tip boxes, fact boxes, timelines, etc.)
- Validates against the quality checklist
- Ensures brand voice consistency

**Commands delegate to this agent:**

- `/content:draft` -> Phase 2 delegates styling to agent
- `/check:editorial` -> Phase 2 delegates evaluation to agent

The agent contains all editorial styling logic, so even if commands are forgotten, the agent will apply correct formatting when editing blog content.

### Sveltia Schema Manager Agent

**The sveltia-schema-manager agent analyzes Hugo templates and generates Sveltia CMS schemas.** It is invoked by `/check:config` and `/site:schema` commands.

Located at `.claude/agents/sveltia-schema-manager.md`, the agent:

- Reads Hugo templates to extract expected front matter fields
- Samples existing content to identify field usage patterns
- Compares against Sveltia CMS config (`static/admin/config.yml`)
- Produces gap analysis with severity levels (error/warning/info)
- Generates corrected schema YAML with proper widgets, SEO fields, and field ordering

**Read-only:** Returns schema + gap report. Does not write to config directly.

**Related skill:** `sveltia-hugo-maintenance` (auto-activates for CMS config, front matter, data files, menus, navigation)

## Mandatory Content Agent Delegation

**CRITICAL:** When editing Pike & West content, you MUST delegate to the appropriate agent:

| Content Location          | Required Agent           | Trigger                                       |
|---------------------------|--------------------------|-----------------------------------------------|
| `content/blog/*/index.md` | `blog-editor`            | Any create, edit, review, or audit task       |
| `content/events/*.md`     | `page-editor`            | Any create, edit, or update task              |
| `content/*.md` (non-blog) | `page-editor`            | Any static page modifications                 |
| `static/admin/config.yml` | `sveltia-schema-manager` | Schema generation, config audit, gap analysis |

**How to delegate:**

1. Use the Task tool with `subagent_type` set to the agent name
2. Provide the file path and task description
3. The agent will handle formatting, brand voice, and content index updates

**DO NOT** edit content files directly without delegating to the appropriate agent.
This ensures consistent editorial quality and proper content index maintenance.

### Analysis Documents

- **[Next Steps](docs/next-steps.md)** - Current project status and upcoming work (keep updated)
- **[Analytics Strategy](docs/analytics/README.md)** - GTM/GA4 configuration and cross-domain tracking
- **[Architecture Decisions](docs/architecture/decisions/)** - ADRs for key technical decisions
- **[Implementation Patterns](docs/architecture/patterns/)** - Reusable code patterns
- **[DNS Configuration](docs/infrastructure/dns-configuration.md)** - Hugo & Cloudflare Pages setup

## Site Structure

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

### Git Commit Strategy

Use grouped, semantic commits. A hook (`.claude/hooks/semantic-commit-check.sh`) enforces this:

- **On commit**: Analyzes staged files, reminds to include all related changes
- **On push**: Reviews commit count, suggests squashing if fragmented

**Quick reference:**

| Commit Type  | Scope Example                 |
|--------------|-------------------------------|
| `feat(hero)` | All files for hero feature    |
| `fix(nav)`   | Bug fix + related adjustments |
| `docs`       | Batch related doc updates     |

Group template + styles + content for the same feature. Don't split tightly-coupled changes.

### Partial Template Standards

```go-html-template
{{/* partials/example.html */}}
{{/*
  Purpose: Brief description of what this partial does
  Context: What data this partial expects (. = Page, dict, etc.)
  Usage: {{ partial "example.html" . }}
*/}}
```

### Image Storage and Hugo Assets Pipeline

Images live in `static/images/` (not `assets/images/`) so that Sveltia CMS can
access them directly. A Hugo module mount in `config/_default/hugo.toml` maps
them into the assets pipeline:

```toml
[[module.mounts]]
  source = "static/images"
  target = "assets/images"
```

This means `resources.Get "images/venue/photo.jpg"` works even though the file
is physically at `static/images/venue/photo.jpg`. All image processing
(`Resize`, WebP conversion, etc.) requires this pipeline — files accessed only
via `/images/...` URL paths bypass Hugo's asset processing entirely.

**Front matter image paths** use a leading slash (`/images/venue/photo.jpg`)
because Sveltia CMS generates paths relative to the site root. Hugo's
`resources.Get` strips the leading slash when resolving against the mount.

**Singleton data files** (e.g., `data/hero.yaml`, `data/about.yaml`) also require
leading slashes for image paths. Without them, Sveltia CMS cannot resolve
previews since data files have no parent content file to be relative to. The CMS
config `public_folder` must use `/images/...` for singletons.

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

## External Integrations

### Analytics & Tracking

```toml
# config/_default/params.toml
[analytics]
  googleTagManager = "GTM-XXXXXX"
```

### Social Media & Contact Information

Contact and social data are stored in `data/site_settings.yaml` (editable via Sveltia CMS singleton).
Templates access this via `.Site.Data.site_settings.contact` and `.Site.Data.site_settings.social`.

```yaml
# data/site_settings.yaml
contact:
  phone: "901.206.5575"
  email: "events@pikeandwest.com"
  address: "2277 West Street"
  city: "Germantown"
  state: "TN"
  zip: "38138"
  hours: "Available by appointment only.<br>Call or email to reserve a tour."
  googleMapsUrl: "https://maps.app.goo.gl/7fNG7K7BEPQKpNzs8"
social:
  instagram: "https://www.instagram.com/pikeandwest/"
  facebook: "https://www.facebook.com/pikeandwest"
  twitter: "pikeandwest"
```

## Testing Requirements

### Performance Targets

| Metric                   | Target  |
|--------------------------|---------|
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

### Preview Deployments

Cloudflare Pages preview deployments are triggered by **pull requests**, not branch pushes alone. A PR must be opened for a preview URL to be generated.

### CI/CD Pipeline

Deployments are handled by **GitHub Actions**, not Cloudflare's GitHub integration directly.

**Workflow:** `.github/workflows/ci.yml`

1. Hugo builds the site
2. Artifacts uploaded to GitHub
3. Wrangler deploys to Cloudflare Pages

**Common Issues:**

| Issue                                 | Cause                       | Fix                                                                                                                                                     |
|---------------------------------------|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Artifact storage quota has been hit` | GitHub Actions storage full | Delete old artifacts at github.com/cneller/pikeandwest.com/actions → "..." → "Delete all workflow runs", wait 6-12 hours for recalculation, then re-run |
| Deployment not triggering             | CI failed silently          | Check `gh run list` and `gh run view <id> --log-failed`                                                                                                 |
| Lighthouse skipped                    | CI build failed             | Fix CI first, Lighthouse runs on `workflow_run` trigger                                                                                                 |

**Re-run failed CI:**

```bash
gh run list --limit 5          # Find failed run ID
gh run rerun <run-id>          # Re-run it
gh run watch <run-id>          # Watch progress
```

### Sveltia CMS Source Code

The Sveltia CMS source is cloned locally for investigating CMS behavior and contributing fixes:

- **Repo:** `~/Projects/sveltia-cms` (clone of `sveltia/sveltia-cms`)
- **Use for:** Debugging widget behavior, understanding config options, tracing image path handling, submitting PRs for bugs or enhancements

When investigating CMS issues (e.g., image previews not showing, field behavior), read the source code directly rather than guessing. For bugs or small enhancements, submit PRs upstream.

### Sveltia CMS Auth Worker

GitHub OAuth for the CMS admin panel runs on a separate Cloudflare Worker:

- **Worker:** `sveltia-cms-auth` on the Pike + West (2277) account
- **Custom domain:** `auth.pikeandwest.com`
- **Repo:** `~/Projects/sveltia-cms-auth` (clone of `sveltia/sveltia-cms-auth`)
- **Secrets:** `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (set via `wrangler secret put`)
- **GitHub OAuth App:** "Pike & West CMS" at github.com/settings/developers
- **Callback URL:** `https://auth.pikeandwest.com/callback`

### Domain Configuration

See **[DNS Configuration](docs/infrastructure/dns-configuration.md)** for current and target DNS setup.

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

```text

```
