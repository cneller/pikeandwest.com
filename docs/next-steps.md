# Pike & West - Next Steps

> **Last Updated:** 2026-01-23
> **Current Phase:** Pre-Launch Testing on beta.pikeandwest.com

This document tracks the current project state and upcoming work. Keep this file updated as tasks are completed or priorities change.

## Current Status

| Area               | Status   | Notes                                                        |
|--------------------|----------|--------------------------------------------------------------|
| Hugo Site          | Complete | All pages migrated from Webflow                              |
| Staging Deployment | Active   | beta.pikeandwest.com on Cloudflare Pages                     |
| GTM/GA4 Analytics  | Verified | Tracking active, cross-domain configured                     |
| Production Domain  | Active   | pikeandwest.com on Cloudflare Pages (naked domain canonical) |
| Architecture Docs  | Complete | ADRs and patterns in docs/architecture/                      |
| Marketing Strategy | Complete | Comprehensive docs in docs/marketing-strategy/               |
| Claude Hooks       | Active   | Pre-commit docs check hook enabled                           |
| Footer Redesign    | Ready    | PR #15 - Lighthouse 91% avg, ready for merge                 |
| Event Type Pages   | Complete | 6 landing pages for SEO (/events/\*)                         |

## Top Priority

### PR #15 Lighthouse Issues (Footer Redesign)

**Branch:** `claude/redesign-footer-seo-nXNY6`
**Preview:** <https://425145d4.pikeandwest.pages.dev>

**All performance issues resolved. Ready for merge.**

**Fixed Issues:**

- [x] Hero text alignment - Now left-aligned under logo and vertically centered
- [x] SEO 69 on previews - FALSE POSITIVE (Cloudflare adds `x-robots-tag: noindex` to preview URLs; production is 100%)
- [x] Render blocking fonts - Google Fonts now loads asynchronously
- [x] Critical CSS mismatch - Synced `critical.scss` with `_hero.scss` flexbox layout
- [x] Blog hero images - Converted to WebP (4.3MB PNG → 351KB WebP), added preload hints
- [x] Contact CLS - Added iframe dimensions and contain property (0.928 → 0.1)

**Current Lighthouse Scores (Average: 91%):**

| Page             | Perf   | A11y | Best Practices | SEO  |
|------------------|--------|------|----------------|------|
| Home             | 96     | 96   | 100            | 69\* |
| About            | 74\*\* | 96   | 100            | 69\* |
| Blog             | 93     | 96   | 100            | 69\* |
| Blog-Anniversary | 96     | 96   | 100            | 69\* |
| Blog-BabyShower  | 94     | 96   | 100            | 69\* |
| Blog-Birthday    | 99     | 96   | 100            | 69\* |
| Contact          | 77     | 96   | 78\*\*\*       | 69\* |
| Gallery          | 98     | 92   | 96             | 69\* |

\* SEO 69 expected on Cloudflare previews (noindex header). Production will be 100%.
\*\* About variance likely due to single Lighthouse run; metrics look fine (LCP 1s, FCP 0.3s)
\*\*\* Contact Best Practices 78% caused by third-party cookies from HoneyBook form (unavoidable)

---

## Immediate Tasks (Blocked)

These tasks are waiting on external dependencies:

### Analytics Verification

| Task                     | Blocker                        | Action When Unblocked                                     |
|--------------------------|--------------------------------|-----------------------------------------------------------|
| Test purchase event flow | No live events on TicketTailor | Complete a test purchase, verify in GA4 DebugView         |
| Check for self-referrals | Need 24-48h of GA4 data        | Review Traffic Acquisition report for tix.pikeandwest.com |
| Full cross-domain test   | No ticket links on site        | Verify `_gl` parameter appends when events are live       |

## Pre-Launch Checklist

Complete before switching production DNS:

### Analytics

- [ ] Verify purchase events track correctly (when TicketTailor has events)
- [ ] Confirm no self-referrals from tix.pikeandwest.com
- [ ] Test full user journey: homepage → ticket page → purchase
- [ ] Implement `contact_request` event for contact form

### Visual Parity

- [ ] Run BackstopJS visual regression tests against Webflow
- [ ] Fix any typography discrepancies (see [typography audit](./audits/2026-01-20-typography-audit.md))
- [ ] Verify all breakpoints match Webflow exactly
- [ ] Test all hover states and animations

### SEO

- [ ] Verify meta tags render correctly on all pages
- [ ] Confirm Open Graph images work (test with social sharing debuggers)
- [ ] Validate JSON-LD structured data
- [ ] Check canonical URLs point to production domain

### Performance

- [ ] Run Lighthouse audit, target score >95
- [ ] Verify images are optimized (WebP with fallbacks)
- [ ] Check total page size <500KB
- [ ] Test Core Web Vitals pass

### Infrastructure

- [ ] Test GitHub Actions deployment workflow
- [ ] Verify preview URLs work for PRs
- [ ] Document rollback procedure

## Launch Tasks

Execute in this order when ready to go live:

### 1. Final Verification

```bash
# Build production site
hugo --gc --minify

# Run visual regression
npm run backstop:test

# Check for broken links
hugo --templateMetrics
```

### 2. DNS Cutover

1. In Cloudflare DNS, add CNAME for `www` → `pikeandwest.pages.dev`
2. Add redirect rule: apex → www (www is canonical per GSC verification)
3. Wait for DNS propagation (up to 48h, usually faster)
4. Verify SSL certificate is active

### 3. Post-Launch Monitoring

- [ ] Monitor GA4 Realtime for first 24 hours
- [ ] Check for 404 errors in Cloudflare analytics
- [ ] Verify forms submit correctly
- [ ] Test ticket purchase flow end-to-end
- [ ] Monitor Core Web Vitals in Search Console

## Future Enhancements

### Analytics (Priority: High)

| Enhancement                                                                                                           | Effort | Value  | Notes                                   |
|-----------------------------------------------------------------------------------------------------------------------|--------|--------|-----------------------------------------|
| Contact form event tracking                                                                                           | Low    | High   | Implement `contact_request` event       |
| E-commerce enhanced measurement                                                                                       | Medium | High   | Rich purchase data in GA4               |
| Custom dimensions for event types                                                                                     | Low    | Medium | wedding, corporate, party segmentation  |
| [Server-side tagging](https://usercentrics.com/guides/smarter-tagging-with-google-tag-manager/cross-domain-tracking/) | High   | High   | Privacy-first, resilient to ad blockers |

### Integrations (Priority: Medium)

| Integration           | Purpose                           | Documentation                    |
|-----------------------|-----------------------------------|----------------------------------|
| Google Search Console | SEO monitoring, search query data | Link to GA4 property             |
| Microsoft Clarity     | Session recordings, heatmaps      | Free UX insights                 |
| HubSpot               | CRM for lead tracking             | Contact form integration         |
| UTM Convention        | Campaign tracking                 | Document standard UTM parameters |

### Content (Priority: Medium)

| Task                     | Status   | Notes                                                               |
|--------------------------|----------|---------------------------------------------------------------------|
| Blog section             | Active   | 5 posts published (2 current + 3 backdated Oct-Dec 2025)            |
| Gallery application page | Basic    | May need form improvements                                          |
| Team/About section       | Complete | Consider adding more team photos                                    |
| Event type pages         | Complete | 6 pages: weddings, corporate, birthday, baby shower, private, dance |
| Privacy Policy           | Complete | /privacy/ - basic policy page                                       |
| Accessibility Statement  | Complete | /accessibility/ - basic statement page                              |

### Technical Debt (Priority: Low)

| Item                                | Notes                                                                                           |
|-------------------------------------|-------------------------------------------------------------------------------------------------|
| CSS custom properties               | Consider adding `:root` variables per [SCSS audit](./audits/2026-01-20-scss-variables-audit.md) |
| Remove unused Playfair Display font | Loaded but not used per [typography audit](./audits/2026-01-20-typography-audit.md)             |
| Image lazy loading audit            | Verify all below-fold images have `loading="lazy"`                                              |

## Privacy Considerations

Per [GA4 cross-domain tracking best practices](https://usercentrics.com/guides/smarter-tagging-with-google-tag-manager/cross-domain-tracking/):

- [ ] Implement consent management if required (GDPR/CCPA)
- [ ] Ensure consistent consent rules across domains
- [ ] Consider server-side tagging for improved privacy compliance
- [ ] Document data collection practices in privacy policy

## Reference Links

### Project Documentation

- [Analytics Strategy](./analytics/README.md)
- [Contact Form Shimmer](./contact-form/README.md) - HubSpot form measurements and shimmer specs
- [Cross-Domain Tracking Verification](./cross-domain-tracking-verification.md)
- [CSS Mapping](./webflow-to-hugo-css-mapping.md)
- [Site Analysis](./site-analysis/current-site-documentation.md)
- [Architecture Decisions](./architecture/decisions/) - ADRs for key technical choices
- [Implementation Patterns](./architecture/patterns/) - Reusable code patterns
- [Marketing Strategy](./marketing-strategy/README.md) - Comprehensive marketing docs

### External Resources

- [GA4 Cross-Domain Setup (Google)](https://support.google.com/analytics/answer/10071811?hl=en)
- [Cross-Domain Tracking Best Practices (Analytics Mania)](https://www.analyticsmania.com/post/cross-domain-tracking-in-google-analytics-4/)
- [GTM & GA4 Guide (The Gray Company)](https://thegray.company/blog/cross-domain-tracking-guide)
- [Server-Side Tagging Guide](https://usercentrics.com/guides/smarter-tagging-with-google-tag-manager/cross-domain-tracking/)

## Recently Completed

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

## Changelog

| Date       | Change                                                                                            |
|------------|---------------------------------------------------------------------------------------------------|
| 2026-01-23 | Consolidated facade/shimmer to single shimmer implementation, removed ~750 lines of dead code     |
| 2026-01-23 | Added pixel-perfect shimmer measurements via Playwright (docs/contact-form/README.md)             |
| 2026-01-23 | Added shimmer blocks for all form elements: labels, inputs, hints, buttons, header, footer        |
| 2026-01-22 | Fixed Cloudflare bot detection: removed curl health-check, rely on Lighthouse Chrome (score: 90)  |
| 2026-01-22 | Consolidated GitHub Actions: CI workflow (Build→Validate→Deploy), async Lighthouse workflow       |
| 2026-01-22 | Removed Artists from main nav, reordered to Blog (left) → Contact Us (right, gold CTA)            |
| 2026-01-21 | Verified canonical domain is `www.pikeandwest.com` via GSC (Playwright); updated DNS docs         |
| 2026-01-21 | Added hero images to event pages with front matter support (`image`, `image_alt`)                 |
| 2026-01-21 | Created shared `_page-hero.scss` styles, refactored blog-hero to extend it (-91 lines)            |
| 2026-01-21 | Added Front Matter CMS configuration (`frontmatter.json`) for VS Code sidebar editing             |
| 2026-01-21 | Created event archetype for new event pages                                                       |
| 2026-01-21 | Created shared `_content-base.scss` mixin for consistent content typography                       |
| 2026-01-21 | Refactored blog and event pages to use content-base mixin (-94 lines total)                       |
| 2026-01-21 | Fixed event page text color (`$color-text` instead of `$color-text-light`)                        |
| 2026-01-21 | Added breadcrumb navigation to event single and list pages                                        |
| 2026-01-21 | Fixed hero positioning (left-align, vertical center) - flexbox layout                             |
| 2026-01-21 | Resolved SEO 69 false positive - Cloudflare noindex on previews, added is-preview workflow input  |
| 2026-01-21 | Performance: async Google Fonts loading, synced critical.scss with \_hero.scss                    |
| 2026-01-21 | Added Lighthouse troubleshooting docs to CLAUDE.md                                                |
| 2026-01-21 | Footer redesign with multi-column SEO layout and 6 event landing pages                            |
| 2026-01-21 | Added Privacy Policy and Accessibility Statement pages                                            |
| 2026-01-21 | Mobile footer changed from single-column to 2-column grid                                         |
| 2026-01-20 | Initial creation with analytics verification tasks                                                |
| 2026-01-20 | Added beta subdomain deployment status                                                            |
| 2026-01-20 | Added future enhancements from web research                                                       |
| 2026-01-20 | Added architecture docs (4 ADRs, 2 pattern docs)                                                  |
| 2026-01-20 | Added marketing strategy documentation suite                                                      |
| 2026-01-20 | Added pre-commit docs check hook for documentation reminders                                      |
| 2026-01-20 | SCSS visual parity refinements across all sections                                                |
| 2026-01-20 | Added 3 backdated blog posts (Oct-Dec 2025) targeting Baby Shower, Anniversary, Birthday personas |
| 2026-01-20 | Added blog posts to Lighthouse performance testing matrix                                         |
| 2026-01-20 | Added accessible breadcrumb navigation to blog pages with JSON-LD schema                          |
| 2026-01-20 | SEO audit fixes merged (keywords, titles, og_image, expanded blog content)                        |
| 2026-01-20 | Added hero text alignment as top priority (still too far left from logo)                          |
