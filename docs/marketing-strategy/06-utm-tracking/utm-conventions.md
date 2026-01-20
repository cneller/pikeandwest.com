# UTM Naming Conventions

> Standardized UTM parameters for consistent tracking across all Pike & West marketing channels.

## UTM Parameters

| Parameter    | Purpose                        | Convention                            | Examples                                                                             |
|--------------|--------------------------------|---------------------------------------|--------------------------------------------------------------------------------------|
| utm_source   | Where traffic comes from       | Platform or referrer name (lowercase) | `instagram`, `facebook`, `gbp`, `email`, `google`                                    |
| utm_medium   | Marketing medium type          | Channel category (lowercase)          | `social`, `organic`, `email`, `referral`, `cpc`                                      |
| utm_campaign | Campaign or content grouping   | `type-identifier` format              | `blog-wedding-venue-checklist`, `promo-summer2025`, `seasonal-holidays`, `evergreen` |
| utm_content  | Differentiates link placements | Link type or format                   | `bio-link`, `post`, `story`, `carousel`, `reel`, `page-cta`                          |
| utm_term     | Keyword (optional)             | Target keyword for SEO/PPC            | `germantown-wedding-venue`                                                           |

## Naming Rules

1. **Always lowercase** - Prevents duplicate entries in GA4
2. **Use hyphens** - Not underscores or spaces (`wedding-venue` not `wedding_venue`)
3. **Be specific** - `blog-wedding-venue-checklist` not just `blog`
4. **Be consistent** - Same content, same UTMs across team members

## Standard Templates

### Blog Post Distribution

When sharing a blog post across channels, use these UTM patterns:

#### Instagram Bio Link

```text
?utm_source=instagram&utm_medium=social&utm_campaign=blog-[slug]&utm_content=bio-link
```

Example for "Wedding Venue Checklist" post:

```text
https://pikeandwest.com/blog/wedding-venue-checklist/?utm_source=instagram&utm_medium=social&utm_campaign=blog-wedding-venue-checklist&utm_content=bio-link
```

#### Instagram Post

```text
?utm_source=instagram&utm_medium=social&utm_campaign=blog-[slug]&utm_content=post
```

#### Instagram Story

```text
?utm_source=instagram&utm_medium=social&utm_campaign=blog-[slug]&utm_content=story
```

#### Instagram Carousel

```text
?utm_source=instagram&utm_medium=social&utm_campaign=blog-[slug]&utm_content=carousel
```

#### Instagram Reel

```text
?utm_source=instagram&utm_medium=social&utm_campaign=blog-[slug]&utm_content=reel
```

#### Facebook Post

```text
?utm_source=facebook&utm_medium=social&utm_campaign=blog-[slug]&utm_content=post
```

#### Google Business Profile Post

```text
?utm_source=gbp&utm_medium=organic&utm_campaign=blog-[slug]&utm_content=post
```

#### Email Newsletter

```text
?utm_source=email&utm_medium=email&utm_campaign=blog-[slug]&utm_content=newsletter
```

### Seasonal Campaigns

For time-sensitive promotional campaigns:

#### Holiday Party Season

```text
?utm_source=[platform]&utm_medium=social&utm_campaign=seasonal-holidays-2025&utm_content=[format]
```

Instagram Story example:

```text
https://pikeandwest.com/contact/?utm_source=instagram&utm_medium=social&utm_campaign=seasonal-holidays-2025&utm_content=story
```

#### Prom Season

```text
?utm_source=[platform]&utm_medium=social&utm_campaign=seasonal-prom-2025&utm_content=[format]
```

#### Graduation Season

```text
?utm_source=[platform]&utm_medium=social&utm_campaign=seasonal-graduation-2025&utm_content=[format]
```

### Promotional Campaigns

For specific offers or promotions:

```text
?utm_source=[platform]&utm_medium=social&utm_campaign=promo-[name]&utm_content=[format]
```

Example - Summer booking special:

```text
https://pikeandwest.com/contact/?utm_source=instagram&utm_medium=social&utm_campaign=promo-summer-booking-2025&utm_content=carousel
```

### Evergreen Links

For permanent links that don't change:

#### Instagram Bio (General)

```text
?utm_source=instagram&utm_medium=social&utm_campaign=evergreen&utm_content=bio-link
```

Full URL:

```text
https://pikeandwest.com/?utm_source=instagram&utm_medium=social&utm_campaign=evergreen&utm_content=bio-link
```

#### Facebook Page CTA

```text
?utm_source=facebook&utm_medium=social&utm_campaign=evergreen&utm_content=page-cta
```

Full URL:

```text
https://pikeandwest.com/contact/?utm_source=facebook&utm_medium=social&utm_campaign=evergreen&utm_content=page-cta
```

#### Google Business Profile Website Link

```text
?utm_source=gbp&utm_medium=organic&utm_campaign=evergreen&utm_content=website-link
```

## /utm-link Command

Generate UTM links quickly using the `/utm-link` command in Claude Code.

### Usage

```text
/utm-link [url] [source] [campaign] [content]
```

### Examples

**Blog post on Instagram story:**

```text
/utm-link /blog/wedding-venue-checklist/ instagram blog-wedding-venue-checklist story
```

Output:

```text
https://pikeandwest.com/blog/wedding-venue-checklist/?utm_source=instagram&utm_medium=social&utm_campaign=blog-wedding-venue-checklist&utm_content=story
```

**Contact page for holiday campaign on Facebook:**

```text
/utm-link /contact/ facebook seasonal-holidays-2025 post
```

Output:

```text
https://pikeandwest.com/contact/?utm_source=facebook&utm_medium=social&utm_campaign=seasonal-holidays-2025&utm_content=post
```

**Homepage evergreen link for Instagram bio:**

```text
/utm-link / instagram evergreen bio-link
```

Output:

```text
https://pikeandwest.com/?utm_source=instagram&utm_medium=social&utm_campaign=evergreen&utm_content=bio-link
```

### Medium Auto-Detection

The command automatically sets `utm_medium` based on `utm_source`:

| Source    | Medium  |
|-----------|---------|
| instagram | social  |
| facebook  | social  |
| gbp       | organic |
| email     | email   |
| google    | cpc     |

## Quick Reference

### Common Source/Medium Combinations

| Source    | Medium  | Use Case                                |
|-----------|---------|-----------------------------------------|
| instagram | social  | Organic Instagram posts, stories, reels |
| facebook  | social  | Organic Facebook posts, shares          |
| gbp       | organic | Google Business Profile posts           |
| email     | email   | Newsletter, drip campaigns              |
| google    | cpc     | Google Ads campaigns                    |
| google    | organic | Rarely used (GA4 auto-detects)          |

### Campaign Prefixes

| Prefix    | Use Case                     | Example                      |
|-----------|------------------------------|------------------------------|
| blog-     | Blog post promotion          | blog-wedding-venue-checklist |
| promo-    | Limited-time offers          | promo-summer-booking-2025    |
| seasonal- | Recurring seasonal campaigns | seasonal-holidays-2025       |
| evergreen | Permanent links              | evergreen                    |

### Content Types

| Value        | Description                                 |
|--------------|---------------------------------------------|
| bio-link     | Profile/bio link in Instagram, TikTok, etc. |
| post         | Standard social media post                  |
| story        | Instagram/Facebook story                    |
| carousel     | Multi-image carousel post                   |
| reel         | Instagram Reel or short video               |
| page-cta     | CTA button on Facebook page or GBP          |
| website-link | Primary website link on profile             |
| newsletter   | Email newsletter main content               |
| signature    | Email signature link                        |
