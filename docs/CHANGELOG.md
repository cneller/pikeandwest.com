# Pike & West - Changelog

This document tracks completed work and changes to the project.

## Recent Milestones

### Blog Taxonomy Redesign (2026-01-28)

**Goal:** Align blog categories with customer personas for better content targeting.

**Changes:**

| Component       | Before                          | After                                  |
|-----------------|---------------------------------|----------------------------------------|
| Categories      | 5 mixed (event types + pillars) | 8 event-type only (maps to personas)   |
| Tags            | 19 flat options                 | 50+ organized by purpose               |
| CMS Enforcement | Multiple categories allowed     | Single category, 3-6 tags required     |
| Blog-editor     | No category guidance            | Category Selection Guide with personas |

**Plan:** `docs/plans/2026-01-28-blog-categories-redesign.md`

---

### Footer Redesign (2026-01-21)

**Goal:** Redesign footer for better SEO through internal linking to event-specific pages.

**Implementation:**

| Component     | Description                                        |
|---------------|----------------------------------------------------|
| Footer Layout | 4-column grid: Celebrate, Connect, Venue, Visit Us |
| Event Pages   | 6 new landing pages under `/events/`               |
| Schema Markup | LocalBusiness structured data for local SEO        |
| Legal Pages   | Privacy Policy and Accessibility Statement         |
| Mobile Layout | 2-column grid maintained down to 320px             |

**Files Created:**

- `content/events/*.md` - 6 event type landing pages
- `content/privacy.md` - Privacy policy
- `content/accessibility.md` - Accessibility statement
- `layouts/events/list.html` - Events section list template
- `layouts/events/single.html` - Individual event page template
- `layouts/partials/schema-local-business.html` - LocalBusiness schema
- `assets/scss/_events-list.scss` - Events list styling

**Files Modified:**

- `layouts/partials/footer.html` - Complete redesign with multi-column layout
- `assets/scss/_footer.scss` - Responsive 2-column grid (mobile), 4-column (desktop)
- `config/_default/menus.toml` - Footer navigation sections added
- `layouts/_default/baseof.html` - Schema partial included

**Mobile Responsive Strategy:**

- Desktop (992px+): 4 columns
- Tablet & Mobile: 2 columns (using `minmax(0, 1fr)` to prevent grid blowout)
- Text overflow handled with `overflow-wrap: break-word`

**Branch:** `claude/redesign-footer-seo-nXNY6`

---

## Daily Log

| Date       | Change                                                                                                                                  |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 2026-01-29 | Added BackstopJS visual regression to CI pipeline (async workflow, artifact-based reference storage, 5 pages × 3 viewports)             |
| 2026-01-27 | Deployed Sveltia CMS auth: GitHub OAuth App, Cloudflare Worker at `auth.pikeandwest.com`, tested OAuth login flow end-to-end            |
| 2026-01-27 | Cleaned GitHub Actions artifact storage (4.2 GB of accumulated Lighthouse/build artifacts)                                              |
| 2026-01-27 | Installed Sveltia CMS: admin UI, config with all collections/singletons, blog page bundles, site settings extraction                    |
| 2026-01-27 | Removed Sitepins CMS plan, Front Matter CMS config, and `.well-known/sitepins.json` (replaced by Sveltia CMS)                           |
| 2026-01-27 | Migrated blog posts to Hugo page bundles (`content/blog/*/index.md`) for co-located images                                              |
| 2026-01-27 | Extracted contact/social data from params.toml to `data/site_settings.yaml` (CMS-editable singleton)                                    |
| 2026-01-27 | Added dual resource resolution to blog templates (page bundle first, then global assets)                                                |
| 2026-01-27 | Updated Sveltia skill, agent, and 3 commands for page bundles and singletons                                                            |
| 2026-01-27 | Updated CLAUDE.md with site_settings data source pattern and page bundle paths                                                          |
| 2026-01-23 | Added workshops page with Ticket Tailor widget placeholder (`/workshops/`)                                                              |
| 2026-01-23 | Updated CTAs: "Host Your Event" (venue), "Book a Tour" (tours), "Workshops" (classes)                                                   |
| 2026-01-23 | Header nav changed: Blog → Workshops, Contact Us → Host Your Event                                                                      |
| 2026-01-23 | Footer nav changed: Contact → Host an Event, added Workshops link                                                                       |
| 2026-01-23 | Refactored blog-editor agent as authoritative source for editorial styling; commands delegate to agent                                  |
| 2026-01-23 | Expanded editorial styling: 8 new shortcodes (standfirst, kicker, tip, fact-box, key-takeaways, timeline, sidebar-quote, numbered-list) |
| 2026-01-23 | Created blog-editor agent (`.claude/agents/blog-editor.md`) for consistent formatting                                                   |
| 2026-01-23 | Updated ADR-005 with comprehensive editorial styling system (11 components total)                                                       |
| 2026-01-23 | Fixed FOUC on contact page: added full page critical CSS (shimmer, Find Us, footer)                                                     |
| 2026-01-23 | Consolidated facade/shimmer to single shimmer implementation, removed ~750 lines of dead code                                           |
| 2026-01-23 | Added pixel-perfect shimmer measurements via Playwright (docs/contact-form/README.md)                                                   |
| 2026-01-23 | Added shimmer blocks for all form elements: labels, inputs, hints, buttons, header, footer                                              |
| 2026-01-22 | Integrated editorial styling into Claude Code commands (`/blog-draft`, `/blog-outline`, `/content-audit`)                               |
| 2026-01-22 | Updated blog archetype with editorial styling examples and quick reference                                                              |
| 2026-01-22 | Added blog editorial styling: drop caps, pull quotes, decorative dividers (ADR-005)                                                     |
| 2026-01-22 | Created Hugo shortcodes: `pull-quote` and `divider` for easy content authoring                                                          |
| 2026-01-22 | Fixed Cloudflare bot detection: removed curl health-check, rely on Lighthouse Chrome (score: 90)                                        |
| 2026-01-22 | Consolidated GitHub Actions: CI workflow (Build→Validate→Deploy), async Lighthouse workflow                                             |
| 2026-01-22 | Removed Artists from main nav, reordered to Blog (left) → Contact Us (right, gold CTA)                                                  |
| 2026-01-21 | Verified canonical domain is `www.pikeandwest.com` via GSC (Playwright); updated DNS docs                                               |
| 2026-01-21 | Added hero images to event pages with front matter support (`image`, `image_alt`)                                                       |
| 2026-01-21 | Created shared `_page-hero.scss` styles, refactored blog-hero to extend it (-91 lines)                                                  |
| 2026-01-21 | Added Front Matter CMS configuration (`frontmatter.json`) for VS Code sidebar editing (removed 2026-01-27, replaced by Sveltia CMS)     |
| 2026-01-21 | Created event archetype for new event pages                                                                                             |
| 2026-01-21 | Created shared `_content-base.scss` mixin for consistent content typography                                                             |
| 2026-01-21 | Refactored blog and event pages to use content-base mixin (-94 lines total)                                                             |
| 2026-01-21 | Fixed event page text color (`$color-text` instead of `$color-text-light`)                                                              |
| 2026-01-21 | Added breadcrumb navigation to event single and list pages                                                                              |
| 2026-01-21 | Fixed hero positioning (left-align, vertical center) - flexbox layout                                                                   |
| 2026-01-21 | Resolved SEO 69 false positive - Cloudflare noindex on previews, added is-preview workflow input                                        |
| 2026-01-21 | Performance: async Google Fonts loading, synced critical.scss with \_hero.scss                                                          |
| 2026-01-21 | Added Lighthouse troubleshooting docs to CLAUDE.md                                                                                      |
| 2026-01-21 | Footer redesign with multi-column SEO layout and 6 event landing pages                                                                  |
| 2026-01-21 | Added Privacy Policy and Accessibility Statement pages                                                                                  |
| 2026-01-21 | Mobile footer changed from single-column to 2-column grid                                                                               |
| 2026-01-20 | Initial creation with analytics verification tasks                                                                                      |
| 2026-01-20 | Added beta subdomain deployment status                                                                                                  |
| 2026-01-20 | Added future enhancements from web research                                                                                             |
| 2026-01-20 | Added architecture docs (4 ADRs, 2 pattern docs)                                                                                        |
| 2026-01-20 | Added marketing strategy documentation suite                                                                                            |
| 2026-01-20 | Added pre-commit docs check hook for documentation reminders                                                                            |
| 2026-01-20 | Added 3 backdated blog posts (Oct-Dec 2025) targeting Baby Shower, Anniversary, Birthday personas                                       |
| 2026-01-20 | Added blog posts to Lighthouse performance testing matrix                                                                               |
| 2026-01-20 | Added accessible breadcrumb navigation to blog pages with JSON-LD schema                                                                |
| 2026-01-20 | SEO audit fixes merged (keywords, titles, og_image, expanded blog content)                                                              |
