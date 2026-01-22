# Canonical Domain Migration - External Updates

> Checklist of external services to update after DNS cutover.

## Completed (2026-01-21)

- [x] **GA4 Data Stream URL**
  - Updated from `https://www.pikeandwest.com/` to `https://pikeandwest.com/`
  - Property: 424998364 | Stream: 6676080268

## Immediate (Within 24 hours of go-live)

- [ ] **Google Business Profile**
  - URL: <https://business.google.com>
  - Update website URL from www to naked domain

- [ ] **Instagram Bio**
  - URL: <https://www.instagram.com/pikeandwest/>
  - Update link in bio (likely using Linktree or direct)

- [ ] **Facebook Page**
  - URL: <https://www.facebook.com/pikeandwest>
  - Update website link in About section

## Within First Week

- [ ] **TicketTailor Primary Domain**
  - Update cross-domain tracking primary domain setting
  - Reference: docs/plans/2026-01-19-tickettailor-ga4-integration.md

- [ ] **HoneyBook**
  - Verify portal.pikeandwest.com links work correctly
  - No URL change needed (subdomain unaffected)

## Verify (No Action Needed)

- [x] **Google Search Console** - Domain property covers both versions
- [x] **Cloudflare** - DNS managed, no external update needed
- [x] **GitHub** - Repository URLs unaffected
- [x] **GTM Container** - Uses GA4 Measurement ID, not URL-specific

## Notes

- The www → naked redirect is handled by Cloudflare Redirect Rules (301 permanent)
- All external links pointing to <www.pikeandwest.com> will automatically redirect
- Social media bios should be updated for consistency but redirects ensure no broken links
