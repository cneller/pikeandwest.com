# Canonical Domain Migration Analysis: WWW to Non-WWW

> **Created:** 2026-01-21
> **Purpose:** Evaluate feasibility and process for changing pikeandwest.com canonical domain from `www.pikeandwest.com` to `pikeandwest.com` (naked domain)

---

## Executive Summary

**Verdict: Safe to proceed with proper implementation.**

Changing from `www.pikeandwest.com` to `pikeandwest.com` will **not significantly impact your Google rankings** according to Google's own guidance. This is a relatively low-risk change when done correctly, with expected recovery time of 2-4 weeks for initial improvements and full stabilization within 4-8 weeks.

The key is following the proper migration steps outlined below.

---

## Google's Official Position

### Direct Quote from John Mueller (Google)

> "This won't cause problems with search visibility / rankings / indexing: when the canonical URL switches, it just switches. You might see a little blip, but it goes to normal very quickly."
>
> — [John Mueller on Reddit, March 2024](https://www.seroundtable.com/google-canonical-www-to-non-www-37066.html)

### When It Would Cause Issues

Mueller clarified the only scenario that causes bigger changes:

> "The only time it would cause bigger changes is if you switch canonicals to a different domain, and the domains have something different set up (e.g., country-TLD, removed from search, different crawl settings) - with a www/non-www switch it's all within the same domain and you should be fine."

### Google's Preference

> "You can use whichever you prefer. Google's systems have no preference either way."

---

## Risk Assessment

| Factor          | Risk Level    | Notes                                        |
|-----------------|---------------|----------------------------------------------|
| Rankings impact | **Low**       | Google treats www/non-www as same domain     |
| Traffic loss    | **Low**       | 301 redirects preserve 90-99% of link equity |
| Recovery time   | **4-8 weeks** | For properly implemented migrations          |
| Complexity      | **Low**       | Simpler than full domain migration           |
| Reversibility   | **High**      | Can switch back with same process            |

### What You May Experience

1. **Minor ranking fluctuations** for 1-2 weeks (normal)
2. **Search Console data** may show temporary anomalies
3. **Cached results** may show old URLs briefly
4. **No significant traffic loss** if implemented correctly

---

## Why This Is NOT a Full Domain Migration

Important distinction: Changing from `www.pikeandwest.com` to `pikeandwest.com` is **not** a domain migration in Google's eyes. Both are the same domain - just different hostnames.

| Migration Type                  | Example                             | Complexity | Change of Address Tool? |
|---------------------------------|-------------------------------------|------------|-------------------------|
| **Hostname change** (your case) | <www.example.com> → example.com     | Low        | No                      |
| Subdomain change                | blog.example.com → example.com/blog | Medium     | No                      |
| Full domain migration           | oldsite.com → newsite.com           | High       | Yes                     |

For www to non-www changes, Google explicitly says [not to use the Change of Address tool](https://support.google.com/webmasters/answer/9370220) - just use redirects and canonical tags.

---

## Implementation Checklist

### Phase 1: Pre-Migration Setup

- [ ] **Verify both properties in GSC**
  - Add `pikeandwest.com` as URL-prefix property (if not already)
  - Ensure domain property (`sc-domain:pikeandwest.com`) is verified
  - Both www and non-www should be accessible in GSC

- [ ] **Crawl current site**
  - Export all indexed URLs from current www version
  - Create redirect mapping (www URLs → non-www equivalents)
  - Document current rankings for key pages

- [ ] **Update canonical tags**
  - All pages should have `<link rel="canonical" href="https://pikeandwest.com/...">` (non-www)
  - Canonical tags must be self-referencing on the new URLs

### Phase 2: DNS & Redirect Configuration

- [ ] **Configure 301 redirects** (Critical)

  In `static/_redirects` for Cloudflare Pages:

  ```text
  # Redirect www to naked domain (301 permanent)
  https://www.pikeandwest.com/* https://pikeandwest.com/:splat 301
  ```

  Or via Cloudflare Page Rules for more control.

- [ ] **Update DNS records**
  - Both `pikeandwest.com` and `www.pikeandwest.com` should resolve
  - www should redirect to naked domain via 301

- [ ] **Verify redirect chain**
  - Ensure no redirect chains (A → B → C)
  - All old URLs should redirect directly to final destination

### Phase 3: Content & Sitemap Updates

- [ ] **Update internal links**
  - Change all internal `href` attributes to use `https://pikeandwest.com/`
  - Update any hardcoded www references in templates

- [ ] **Update sitemap**
  - Generate new sitemap with non-www URLs
  - Submit new sitemap to GSC
  - Keep old sitemap active (helps Google find redirects faster)

- [ ] **Update robots.txt**
  - Ensure `Sitemap:` directive points to new URL
  - Verify no blocking rules for new canonical URLs

### Phase 4: External Updates

- [ ] **Google Search Console**
  - Submit new sitemap
  - Use URL Inspection tool to verify new canonical is recognized
  - Monitor Coverage report for issues

- [ ] **Google Analytics / GTM**
  - Update default URL setting (if applicable)
  - Verify tracking fires correctly on new URLs

- [ ] **External services**
  - Update canonical URL in social media profiles
  - Update Google Business Profile
  - Notify any partners/directories of URL change

### Phase 5: Post-Migration Monitoring

- [ ] **Monitor for 30 days minimum**
  - Check GSC Coverage report daily for first week
  - Monitor organic traffic in GA4
  - Track keyword rankings for key terms

- [ ] **Maintain redirects**
  - Keep 301 redirects active for minimum 180 days
  - Google recommends keeping old domain active for 1 year

---

## Expected Timeline

| Timeframe | What Happens                                          |
|-----------|-------------------------------------------------------|
| Day 1-3   | Google begins discovering new canonical signals       |
| Week 1-2  | Initial re-crawling; may see ranking fluctuations     |
| Week 2-4  | Index begins updating; improvements visible           |
| Week 4-8  | Full stabilization; rankings normalized               |
| 6+ months | Safe to consider removing redirects (not recommended) |

---

## Rollback Plan

If issues occur, reverting is straightforward:

1. Change redirect direction (non-www → www instead)
2. Update canonical tags back to www version
3. Submit updated sitemap
4. Rankings should recover in 2-4 weeks

---

## Technical Implementation for Hugo/Cloudflare Pages

### Option 1: Cloudflare Pages `_redirects` file

Create `static/_redirects`:

```text
# Redirect www to naked domain
https://www.pikeandwest.com/* https://pikeandwest.com/:splat 301
```

### Option 2: Cloudflare Bulk Redirects (More Robust)

1. Go to Cloudflare Dashboard → Rules → Redirect Rules
2. Create rule:
   - **When:** Hostname equals `www.pikeandwest.com`
   - **Then:** Dynamic redirect to `https://pikeandwest.com${http.request.uri.path}`
   - **Status code:** 301

### Canonical Tag in Hugo

In `layouts/partials/head.html` or similar:

```go-html-template
<link rel="canonical" href="{{ .Permalink | replaceRE "^https://www\\." "https://" }}">
```

Or set in `config/_default/hugo.toml`:

```toml
baseURL = "https://pikeandwest.com/"
```

---

## Sources

### Google Official Documentation

- [Site Moves and Migrations](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) - Google Search Central
- [Change of Address Tool](https://support.google.com/webmasters/answer/9370220) - Search Console Help
- [Bye Bye Preferred Domain Setting](https://developers.google.com/search/blog/2019/06/bye-bye-preferred-domain-setting) - Google Search Central Blog

### Expert Analysis

- [Google Says Canonicalizing From WWW to non-WWW Won't Heavily Impact Your Rankings](https://www.seroundtable.com/google-canonical-www-to-non-www-37066.html) - Search Engine Roundtable
- [Canonicalization and SEO: A Guide for 2026](https://searchengineland.com/canonicalization-seo-448161) - Search Engine Land
- [301 Redirects Explained: How They Impact SEO](https://ahrefs.com/blog/301-redirects/) - Ahrefs
- [Site Migration SEO Guide](https://searchengineland.com/guide/ultimate-site-migration-seo-checklist) - Search Engine Land

### Recovery Timeline References

- [How Long Does An SEO Site Migration Take?](https://nav43.com/blog/how-long-does-an-seo-site-migration-take/) - NAV43
- [Site Migration Checklist](https://www.botify.com/blog/website-migration-checklist-seo) - Botify
- [SEO Migration 2025: The Complete Guide](https://www.veloxmedia.com/blog/seo-migration-2025-the-complete-guide) - VELOX Media

---

## Recommendation

**Proceed with the migration to naked domain (`pikeandwest.com`).**

The migration is low-risk when implemented correctly. Follow the checklist above, monitor closely for the first 30 days, and maintain redirects for at least 180 days.

The key success factors are:

1. Proper 301 redirects (not 302)
2. Self-referencing canonical tags on all pages
3. Updated sitemap submitted to GSC
4. Monitoring and quick response to any issues

---

## Related Documentation

- [DNS Configuration](./dns-configuration.md) - Current DNS setup and migration steps
- [Next Steps](../next-steps.md) - Pre-launch checklist
