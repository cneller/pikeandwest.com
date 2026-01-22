# Canonical Domain Migration - Monitoring Log

> Track migration health for 30 days post-cutover.

## Cutover Date: 2026-01-21

## Daily Checks (First Week)

| Date       | GSC Coverage | Organic Traffic | Issues       |
|------------|--------------|-----------------|--------------|
| 2026-01-21 | 3 indexed    | TBD             | None - Day 1 |
| 2026-01-22 |              |                 |              |
| 2026-01-23 |              |                 |              |
| 2026-01-24 |              |                 |              |
| 2026-01-25 |              |                 |              |
| 2026-01-26 |              |                 |              |
| 2026-01-27 |              |                 |              |

## Weekly Checks (Weeks 2-4)

| Week   | Indexed Pages | Avg Position | Clicks | Issues |
|--------|---------------|--------------|--------|--------|
| Week 2 |               |              |        |        |
| Week 3 |               |              |        |        |
| Week 4 |               |              |        |        |

## Key Metrics to Watch

1. **GSC Coverage Report**
   - Indexed pages should remain stable (~7 pages)
   - "Page with redirect" count may increase temporarily

2. **Organic Traffic (GA4)**
   - Compare to previous 4 weeks
   - Minor dip (5-10%) is normal for first 1-2 weeks

3. **Keyword Rankings**
   - Track: "pike and west", "germantown event venue", "germantown wedding venue"
   - Use GSC Performance report

## Monitoring URLs

| Resource             | URL                                                                                                             |
|----------------------|-----------------------------------------------------------------------------------------------------------------|
| GSC Coverage         | <https://search.google.com/search-console/index?resource_id=sc-domain%3Apikeandwest.com>                        |
| GSC Performance      | <https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Apikeandwest.com> |
| GA4 Realtime         | <https://analytics.google.com/analytics/web/#/a300399219p424998364/admin/realtime>                              |
| Cloudflare Analytics | <https://dash.cloudflare.com/pages>                                                                             |

## Rollback Trigger

If any of these occur, consider rollback:

- [ ] Organic traffic drops >30% for 5+ consecutive days
- [ ] Indexed pages drop to 0
- [ ] Major ranking loss for brand terms

## Rollback Command

```bash
./scripts/dns-switch.sh webflow
```

## Initial State (2026-01-21)

| Metric                    | Value               | Notes                             |
|---------------------------|---------------------|-----------------------------------|
| GSC Indexed Pages         | 3                   | From GSC Overview                 |
| GSC "Not Indexed"         | 4                   | Including redirect pages          |
| GA4 Stream URL            | pikeandwest.com     | Updated today                     |
| Sitemap Status            | Submitted           | Pending first fetch               |
| www Redirect              | Active              | 301 via Cloudflare Redirect Rules |
| User-declared canonical   | pikeandwest.com     | Correct                           |
| Google-selected canonical | <www.pikeandwest.com> | Will update over time             |
