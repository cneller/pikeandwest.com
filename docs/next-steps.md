# Pike & West - Next Steps

> **Last Updated:** 2026-01-20
> **Current Phase:** Pre-Launch Testing on beta.pikeandwest.com

This document tracks the current project state and upcoming work. Keep this file updated as tasks are completed or priorities change.

## Current Status

| Area               | Status   | Notes                                          |
|--------------------|----------|------------------------------------------------|
| Hugo Site          | Complete | All pages migrated from Webflow                |
| Staging Deployment | Active   | beta.pikeandwest.com on Cloudflare Pages       |
| GTM/GA4 Analytics  | Verified | Tracking active, cross-domain configured       |
| Production Domain  | Pending  | <www.pikeandwest.com> still on Webflow         |
| Architecture Docs  | Complete | ADRs and patterns in docs/architecture/        |
| Marketing Strategy | Complete | Comprehensive docs in docs/marketing-strategy/ |
| Claude Hooks       | Active   | Pre-commit docs check hook enabled             |

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
2. Add redirect rule: apex → www (or vice versa based on preference)
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

| Task                     | Status   | Notes                                                    |
|--------------------------|----------|----------------------------------------------------------|
| Blog section             | Active   | 5 posts published (2 current + 3 backdated Oct-Dec 2025) |
| Gallery application page | Basic    | May need form improvements                               |
| Team/About section       | Complete | Consider adding more team photos                         |
| Event type pages         | Planned  | Individual pages for weddings, corporate, etc.           |

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

## Changelog

| Date       | Change                                                                                            |
|------------|---------------------------------------------------------------------------------------------------|
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
