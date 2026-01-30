# Lighthouse Audit Results - 2026-01-30

## Summary

| Page     | Performance | Accessibility | Best Practices | SEO |
|----------|-------------|---------------|----------------|-----|
| Homepage | 93          | 96            | 81             | 100 |
| Blog     | 87          | 96            | 81             | 100 |
| Contact  | 75          | 96            | 59             | 100 |

**Target Scores:** Performance >= 95, all others >= 90

- **Performance:** Homepage nearly meets target (93). Blog (87) and Contact (75) need optimization.
- **Accessibility:** All pages exceed target at 96.
- **Best Practices:** All pages below target due to third-party scripts (see Issues section).
- **SEO:** All pages achieve perfect score (100).

## Core Web Vitals

### Homepage

| Metric | Value  | Target   | Status |
|--------|--------|----------|--------|
| FCP    | 788ms  | < 2000ms | PASS   |
| LCP    | 1586ms | < 3500ms | PASS   |
| CLS    | 0      | < 0.15   | PASS   |
| TBT    | 32ms   | < 500ms  | PASS   |

### Blog

| Metric | Value  | Target   | Status |
|--------|--------|----------|--------|
| FCP    | 759ms  | < 2000ms | PASS   |
| LCP    | 2281ms | < 3500ms | PASS   |
| CLS    | ~0     | < 0.15   | PASS   |
| TBT    | 18ms   | < 500ms  | PASS   |

### Contact

| Metric | Value | Target   | Status |
|--------|-------|----------|--------|
| FCP    | 514ms | < 2000ms | PASS   |
| LCP    | 592ms | < 3500ms | PASS   |
| CLS    | 0     | < 0.15   | PASS   |
| TBT    | 425ms | < 500ms  | PASS   |

**All Core Web Vitals pass on all pages.**

## Issues Found

### 1. Best Practices: Deprecated APIs (All Pages)

Cloudflare's challenge platform script (`/cdn-cgi/challenge-platform/scripts/jsd/main.js`) uses deprecated APIs:

- `SharedStorage`
- `StorageType.persistent` (deprecated in favor of `navigator.storage`)
- `Fledge`

**Impact:** -19 points on Best Practices score
**Resolution:** This is Cloudflare-injected JavaScript for bot protection. Cannot be removed without disabling security features. No action required.

### 2. Best Practices: Third-Party Cookies (Contact Page)

Third-party cookies from embedded services:

- `geoip-js.com` (HoneyBook GeoIP)
- `m.stripe.com` (Stripe payment fraud detection)
- `support.jam.dev` (Support widget)

**Impact:** Additional -22 points on Contact page Best Practices
**Resolution:** These are from the HoneyBook booking form embed. Required for functionality.

### 3. Performance: Unused JavaScript (Contact Page)

Large unused JavaScript bundles from HoneyBook embed:

| Source                 | Wasted Bytes |
|------------------------|--------------|
| HoneyBook main.js      | 1.54 MB      |
| Forter fraud detection | 195 KB       |
| Google reCAPTCHA       | 174 KB       |

**Impact:** Significant performance penalty (75 score)
**Resolution:** HoneyBook embed cannot be optimized; it's a third-party service. Consider lazy-loading the embed or loading it only after user interaction.

### 4. Performance: Render-Blocking Resources (Blog Page)

PhotoSwipe CSS is render-blocking:

- `photoswipe@5/dist/photoswipe.css` - 298ms blocking time

**Impact:** Minor performance impact
**Resolution:** Consider async loading or inlining critical CSS.

## Recommendations

### High Priority (Would Improve Scores)

1. **Lazy-load HoneyBook embed on Contact page** - Load iframe only when user scrolls near or clicks a CTA. This would significantly improve Contact page performance.

2. **Async load PhotoSwipe CSS** - Use `media="print" onload="this.media='all'"` pattern or preload with low priority.

### Low Priority (Third-Party Limitations)

3. **Cloudflare deprecated APIs** - Monitor for Cloudflare updates. No action needed as this is security infrastructure.

4. **Third-party cookies** - These are required for HoneyBook/Stripe functionality. Document as accepted technical debt.

## Test Configuration

- **Lighthouse Version:** Latest (CLI)
- **Preset:** Desktop
- **Chrome Flags:** `--headless=new`
- **URLs Tested:**
  - `https://pikeandwest.com/`
  - `https://pikeandwest.com/blog/`
  - `https://pikeandwest.com/contact/`
- **Date:** 2026-01-30

## Conclusion

The site performs well overall:

- **Core Web Vitals:** All metrics pass on all pages
- **SEO:** Perfect scores across the board
- **Accessibility:** Strong scores at 96%
- **Performance:** Good on homepage (93), acceptable on blog (87), needs work on contact (75)
- **Best Practices:** Impacted by third-party scripts, not site code issues

The main areas for improvement are the HoneyBook embed performance impact and Cloudflare's deprecated APIs. Both are third-party concerns with limited mitigation options.
