---
description: Generate a properly formatted tracked link with UTM parameters
arguments:
  - name: url
    description: Destination URL (full or relative path like /contact)
    required: true
  - name: source
    description: Traffic source (instagram, facebook, email, google, gbp, etc.)
    required: true
  - name: campaign
    description: Campaign name (lowercase, hyphens, e.g., spring-wedding-2025)
    required: true
---

# /utm-link Command

Generate tracked URLs following Pike & West UTM conventions for consistent analytics.

## When Invoked with Arguments

1. **Validate Inputs**
   - Check URL format (accept relative paths like `/contact`)
   - Validate source against approved list
   - Ensure campaign uses lowercase and hyphens (no spaces)

2. **Auto-Assign Medium**
   Based on source:

   | Source      | Auto-Medium |
   |-------------|-------------|
   | instagram   | social      |
   | facebook    | social      |
   | linkedin    | social      |
   | pinterest   | social      |
   | email       | email       |
   | google      | cpc         |
   | gbp         | organic     |
   | direct-mail | print       |
   | partner-\*  | referral    |

3. **Generate URL**
   Construct full URL with parameters:

   ```
   [base-url]?utm_source=[source]&utm_medium=[medium]&utm_campaign=[campaign]
   ```

4. **Output**

   ```markdown
   # UTM Link Generated

   **Destination:** [url]

   **Parameters:**
   | Parameter    | Value      |
   |--------------|------------|
   | utm_source   | [source]   |
   | utm_medium   | [medium]   |
   | utm_campaign | [campaign] |

   **Full URL:**
   [complete URL]

   **With Content Tag (optional):**
   [URL with &utm_content=bio-link example]

   **Analytics Location:**
   In GA4: Acquisition → Traffic acquisition
   Filter: Source = [source], Campaign = [campaign]

   **Copy-Ready:**
   `[URL]`
   ```

## Approved Sources

| Source           | Auto-Medium | Use For                    |
|------------------|-------------|----------------------------|
| `instagram`      | social      | Organic IG posts, bio link |
| `facebook`       | social      | Organic FB posts           |
| `linkedin`       | social      | LinkedIn posts             |
| `pinterest`      | social      | Pinterest pins             |
| `email`          | email       | Email campaigns            |
| `google`         | cpc         | Google Ads                 |
| `gbp`            | organic     | Google Business Profile    |
| `direct-mail`    | print       | Physical mailers           |
| `partner-[name]` | referral    | Partner promotions         |

## Campaign Naming Conventions

| Pattern                   | Example                     | Use For            |
|---------------------------|-----------------------------|--------------------|
| `[year]-[season]-[topic]` | `2025-spring-wedding-promo` | Seasonal campaigns |
| `[year]-[month]-[topic]`  | `2025-02-valentines`        | Monthly campaigns  |
| `blog-[topic]`            | `blog-venue-guide`          | Blog promotion     |
| `evergreen-[topic]`       | `evergreen-tour-booking`    | Ongoing links      |
| `event-[name]`            | `event-gallery-opening`     | Specific events    |

## Common Use Cases

```bash
# Instagram bio - evergreen
/utm-link /contact instagram evergreen-tour-booking

# Facebook blog promo
/utm-link /blog/wedding-guide facebook blog-wedding-guide

# Email newsletter
/utm-link /contact email newsletter-2025-02

# Google Business Profile
/utm-link /contact gbp evergreen-local

# Partner referral
/utm-link /contact partner-memphis-magazine spring-2025-ad
```

## Validation Rules

The command will warn about:

- Invalid URL format
- Unapproved source values
- Campaign names with spaces (should use hyphens)
- URLs already containing UTM parameters
- Campaign names not following conventions

## Base URL

For Pike & West, prepend `https://pikeandwest.com` to relative paths:

- Input: `/contact`
- Output: `https://pikeandwest.com/contact?utm_source=...`
