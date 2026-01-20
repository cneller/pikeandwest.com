# UTM Tracking Strategy

> Measuring content ROI through consistent UTM parameter tracking.

## Overview

UTM (Urchin Tracking Module) parameters are essential for understanding where Pike & West's website traffic originates and which marketing efforts drive the most valuable visitors. Without consistent UTM tracking, all organic social traffic appears as a single "Social" bucket in GA4, making it impossible to determine which posts, campaigns, or content types generate inquiries and bookings.

## Why UTM Tracking Matters

### Attribution Clarity

- **Without UTMs**: "500 visitors came from Instagram this month"
- **With UTMs**: "200 visitors came from our bio link, 150 from wedding inspiration posts, 100 from stories, and 50 from reels"

### Content ROI Measurement

- Identify which blog posts drive the most traffic when shared
- Compare performance across distribution channels (Instagram vs Facebook vs Email)
- Understand which content formats (carousels, reels, stories) generate engagement

### Campaign Performance

- Track seasonal campaigns (holiday parties, prom season, graduation)
- Measure promotional offers and their conversion impact
- A/B test different messaging approaches

### Budget Allocation

- Direct marketing spend toward channels that convert
- Justify organic social investment with concrete data
- Identify underperforming channels for optimization or elimination

## Quick Links

- [UTM Conventions](./utm-conventions.md) - Standard naming conventions and templates
- [Hugo Implementation](./hugo-utm-implementation.md) - Shortcodes, partials, and data files

## Related Documentation

- [Measurement Framework](../07-measurement/README.md) - Overall analytics strategy
- [Analytics Strategy](../../analytics/README.md) - GTM/GA4 configuration

## Getting Started

1. Review the [UTM Conventions](./utm-conventions.md) for naming standards
2. Implement the Hugo [tracked-link shortcode](./hugo-utm-implementation.md#shortcode-tracked-link)
3. Use the `/utm-link` command for quick link generation
4. Create GA4 reports following the [reporting guide](./hugo-utm-implementation.md#ga4-reporting)
