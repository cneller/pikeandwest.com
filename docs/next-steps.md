# Pike & West - Next Steps

> **Last Updated:** 2026-01-29
> **Current Phase:** Pre-Launch Testing on beta.pikeandwest.com

This document tracks the current project state and upcoming work. Keep this file updated as tasks are completed or priorities change.

For completed work, see [CHANGELOG.md](./CHANGELOG.md).

## Current Status

| Area               | Status   | Notes                                          |
|--------------------|----------|------------------------------------------------|
| Hugo Site          | Complete | All pages live                                 |
| Staging Deployment | Active   | beta.pikeandwest.com on Cloudflare Pages       |
| GTM/GA4 Analytics  | Verified | Tracking active, cross-domain configured       |
| Production Domain  | Active   | pikeandwest.com on Cloudflare Pages            |
| Architecture Docs  | Complete | ADRs and patterns in docs/architecture/        |
| Marketing Strategy | Complete | Comprehensive docs in docs/marketing-strategy/ |
| Sveltia CMS        | Active   | OAuth Worker deployed at auth.pikeandwest.com  |
| Event Type Pages   | Complete | 6 landing pages for SEO (/events/\*)           |

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

### Sveltia CMS

- [ ] Add GitHub collaborators (editors) - see instructions below
- [ ] Test full CMS login flow on production domain
- [ ] Verify content edits commit to `main` branch correctly

#### Adding GitHub Collaborators

For each editor who needs CMS access:

1. Go to <https://github.com/cneller/pikeandwest.com/settings/access>
2. Click **Add people**
3. Enter their GitHub username or email
4. Set role to **Write** (required for CMS commits)
5. Click **Add** - they'll receive an email invitation
6. If they don't have a GitHub account: <https://github.com/signup>
7. After they accept, they can sign in at `pikeandwest.com/admin/`

### Infrastructure

- [ ] Test GitHub Actions deployment workflow
- [ ] Verify preview URLs work for PRs
- [ ] Document rollback procedure
- [ ] Add artifact retention policy to CI workflows (see below)

#### GitHub Actions Artifact Storage

Artifacts (Lighthouse reports, `hugo-site` builds) accumulate and hit the 500 MB free tier limit. Two approaches to prevent issues:

**Option A: Keep last N artifacts (preferred).** Add a cleanup step to CI that deletes old artifacts, keeping the most recent N per type. Use `c-hive/gha-remove-artifacts` action or a custom script.

**Option B: Retention days.** Set `retention-days: 7` on all `upload-artifact` steps, or set a repo-wide default at Settings > Actions > Artifact and log retention.

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

| Task                     | Status      | Notes                                          |
|--------------------------|-------------|------------------------------------------------|
| Workshops section        | In Progress | Page structure complete, pending Ticket Tailor |
| Blog section             | Active      | 6 posts published as page bundles              |
| Gallery application page | Basic       | May need form improvements                     |

### Sveltia CMS (Priority: Medium)

| Enhancement                            | Effort | Blocked By                                                       | Notes                                                 |
|----------------------------------------|--------|------------------------------------------------------------------|-------------------------------------------------------|
| Asset browser folder navigation        | None   | [Sveltia 2.0](https://github.com/sveltia/sveltia-cms/issues/420) | Folder browsing planned upstream                      |
| Manual asset categories                | None   | [Sveltia 2.0](https://github.com/sveltia/sveltia-cms/issues/301) | Icons, logos land in "Uncategorized"                  |
| Venue gallery image management via CMS | Low    | None                                                             | Add image list widget to `venue_gallery` singleton    |
| Event page hero image previews         | Low    | None                                                             | Hero Image field shows path text instead of thumbnail |

### Technical Debt (Priority: Low)

| Item                                | Notes                                              |
|-------------------------------------|----------------------------------------------------|
| CSS custom properties               | Consider adding `:root` variables                  |
| Remove unused Playfair Display font | Loaded but not used                                |
| Image lazy loading audit            | Verify all below-fold images have `loading="lazy"` |

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
- [Architecture Decisions](./architecture/decisions/) - ADRs for key technical choices
- [Implementation Patterns](./architecture/patterns/) - Reusable code patterns
- [Marketing Strategy](./marketing-strategy/README.md) - Comprehensive marketing docs
- [Changelog](./CHANGELOG.md) - Completed work history

### External Resources

- [GA4 Cross-Domain Setup (Google)](https://support.google.com/analytics/answer/10071811?hl=en)
- [Cross-Domain Tracking Best Practices (Analytics Mania)](https://www.analyticsmania.com/post/cross-domain-tracking-in-google-analytics-4/)
- [GTM & GA4 Guide (The Gray Company)](https://thegray.company/blog/cross-domain-tracking-guide)
- [Server-Side Tagging Guide](https://usercentrics.com/guides/smarter-tagging-with-google-tag-manager/cross-domain-tracking/)
