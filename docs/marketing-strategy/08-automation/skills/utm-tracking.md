# Skill: UTM Tracking

> Auto-activates when discussing UTM parameters to load naming conventions and campaign structure.

## Purpose

This skill ensures consistent UTM parameter usage across all Pike & West marketing channels. It loads established naming conventions so tracked links are properly attributed and analytics remain clean and actionable.

## Activation Triggers

The skill activates when:

- Mentioning UTM parameters or tracking
- Creating links for marketing campaigns
- Discussing analytics attribution
- Setting up email or social media campaigns
- Mentioning "campaign tracking", "link tracking", "source tracking"

## What It Loads

### UTM Parameter Conventions

```yaml
utm_source:
  description: "Where the traffic originates"
  format: lowercase, no spaces
  values:
    - instagram
    - facebook
    - google
    - email
    - linkedin
    - pinterest
    - gbp              # Google Business Profile
    - direct-mail
    - partner-[name]   # e.g., partner-memphis-magazine

utm_medium:
  description: "The marketing medium/channel"
  format: lowercase, no spaces
  values:
    - social           # Organic social posts
    - paid-social      # Paid social ads
    - cpc              # Cost per click (Google Ads)
    - email            # Email campaigns
    - referral         # Partner referrals
    - display          # Display advertising
    - print            # Print materials with QR codes

utm_campaign:
  description: "The specific campaign or promotion"
  format: lowercase, hyphens, date-prefix for time-bound
  patterns:
    - "[year]-[season]-[topic]"      # e.g., 2025-spring-wedding-promo
    - "[year]-[month]-[topic]"       # e.g., 2025-02-valentines
    - "[event-type]-[descriptor]"    # e.g., wedding-inspiration
    - "evergreen-[topic]"            # e.g., evergreen-venue-tour

utm_content:
  description: "Differentiates similar content/links"
  format: lowercase, hyphens
  usage: Optional - use when A/B testing or multiple links
  examples:
    - header-cta
    - footer-link
    - image-1
    - carousel-slide-3

utm_term:
  description: "Paid search keywords"
  format: lowercase, plus signs for spaces
  usage: Primarily for Google Ads
  examples:
    - wedding+venue+germantown
    - corporate+event+memphis
```

### Campaign Naming Structure

```yaml
campaign_templates:
  seasonal_promo:
    pattern: "[year]-[season]-[offer]"
    examples:
      - "2025-spring-wedding-special"
      - "2025-holiday-corporate-booking"

  content_campaigns:
    pattern: "[content-type]-[topic]"
    examples:
      - "blog-wedding-planning-tips"
      - "guide-corporate-events"

  event_campaigns:
    pattern: "[year]-[event-name]"
    examples:
      - "2025-art-exhibition-opening"
      - "2025-annual-showcase"

  evergreen:
    pattern: "evergreen-[topic]"
    examples:
      - "evergreen-tour-booking"
      - "evergreen-general-inquiry"
```

### Channel-Specific Defaults

```yaml
instagram:
  utm_source: instagram
  utm_medium: social
  link_placement: bio only (use Linktree or similar)

instagram_ads:
  utm_source: instagram
  utm_medium: paid-social

facebook:
  utm_source: facebook
  utm_medium: social

facebook_ads:
  utm_source: facebook
  utm_medium: paid-social

email_newsletter:
  utm_source: email
  utm_medium: email
  utm_campaign: newsletter-[year]-[month]

google_ads:
  utm_source: google
  utm_medium: cpc
  utm_term: [keyword]

google_business_profile:
  utm_source: gbp
  utm_medium: organic
```

## Behavior

When activated, the skill:

1. **Identifies Channel** - Determines source and medium from context
2. **Loads Conventions** - Applies Pike & West naming standards
3. **Validates Parameters** - Checks for proper formatting
4. **Generates URL** - Creates complete tracked URL
5. **Documents Usage** - Notes where/when the link will be used

## Example Session

**User:** I need a tracked link for our Instagram bio pointing to the contact page for our spring wedding promotion.

**Claude (with skill active):**

```markdown
**UTM Link for Instagram Bio - Spring Wedding Promo**

**Parameters:**
- utm_source: `instagram`
- utm_medium: `social`
- utm_campaign: `2025-spring-wedding-promo`
- utm_content: `bio-link` (optional, helps identify bio vs. story)

**Generated URL:**
```

<https://pikeandwest.com/contact?utm_source=instagram&utm_medium=social&utm_campaign=2025-spring-wedding-promo&utm_content=bio-link>

```text

**Shortened (for bio display):**
Consider using Bitly or Linktree to track clicks and simplify the URL.

**Analytics Note:**
In GA4, this traffic will appear under:
- Acquisition > Traffic acquisition
- Filter by: Source = instagram, Campaign = 2025-spring-wedding-promo

**Recommended Duration:**
Update bio link when campaign ends (recommend: March 1 - May 31, 2025)
```

## Configuration

### Skill File Location

```text
.claude/skills/utm-tracking/
├── SKILL.md              # Main skill definition
├── conventions.yaml      # Naming conventions
└── templates/
    └── common-links.md   # Pre-built common link templates
```

### SKILL.md Structure

```markdown
# UTM Tracking Skill

## Activation
- Keywords: UTM, tracking, campaign link, tracked link
- Keywords: analytics, attribution, source, medium

## Context Files
- Load: `docs/marketing-strategy/07-utm-tracking/conventions.md`

## Instructions
When creating tracked links:
1. Identify traffic source (where link will be placed)
2. Apply correct utm_source and utm_medium
3. Use appropriate campaign naming pattern
4. Add utm_content if multiple links in same placement
5. Generate complete URL and validate format
```

## Integration Points

### With Other Skills

- **social-media-posting**: Ensures social links are properly tracked
- **marketing-content-creation**: Blog CTAs use tracked links

### With Commands

- **`/utm-link`**: Primary command for generating tracked URLs
- **`/social-from-blog`**: Includes tracked links in generated posts

## Common Link Templates

### Evergreen Links

```text
# Instagram Bio - General
https://pikeandwest.com/contact?utm_source=instagram&utm_medium=social&utm_campaign=evergreen-tour-booking&utm_content=bio-link

# Facebook Page Button
https://pikeandwest.com/contact?utm_source=facebook&utm_medium=social&utm_campaign=evergreen-inquiry&utm_content=page-button

# Google Business Profile
https://pikeandwest.com/contact?utm_source=gbp&utm_medium=organic&utm_campaign=evergreen-local-search
```

### Email Templates

```text
# Monthly Newsletter - Header CTA
?utm_source=email&utm_medium=email&utm_campaign=newsletter-2025-[month]&utm_content=header-cta

# Monthly Newsletter - Footer
?utm_source=email&utm_medium=email&utm_campaign=newsletter-2025-[month]&utm_content=footer-link
```

## Validation Rules

- [ ] All parameters are lowercase
- [ ] No spaces (use hyphens or plus signs)
- [ ] utm_source matches approved values
- [ ] utm_medium matches channel type
- [ ] utm_campaign follows naming pattern
- [ ] URL encodes special characters properly
- [ ] Destination URL is valid and live
