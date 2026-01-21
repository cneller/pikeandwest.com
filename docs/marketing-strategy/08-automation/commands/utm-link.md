# Command: /utm-link

> Generate a properly formatted tracked link with UTM parameters.

## Usage

```bash
/utm-link [url] [source] [campaign]
```

**Examples:**

```bash
/utm-link https://pikeandwest.com/contact instagram spring-wedding-2025
/utm-link https://pikeandwest.com/blog/venue-guide facebook blog-promo
/utm-link /contact email february-newsletter
```

## Purpose

This command generates tracked URLs that:

- Follow Pike & West UTM conventions
- Ensure consistent parameter naming
- Enable accurate attribution in analytics
- Provide copy-ready links for marketing use

## What It Does

### Step 1: Parameter Validation

- Validates URL format
- Checks source against approved values
- Validates campaign naming pattern

### Step 2: Medium Detection

- Automatically assigns utm_medium based on source:
  - instagram, facebook, linkedin → `social`
  - google → `cpc` (or `organic` if specified)
  - email → `email`
  - gbp → `organic`

### Step 3: URL Generation

- Constructs full URL with parameters
- URL-encodes special characters
- Validates final URL format

### Step 4: Output

- Provides full tracked URL
- Offers shortened version option
- Notes analytics location

## Example Input/Output

**Input:**

```bash
/utm-link https://pikeandwest.com/contact instagram wedding-season-2025
```

**Output:**

```markdown
# UTM Link Generated

**Destination:** https://pikeandwest.com/contact

**Parameters:**
| Parameter    | Value               |
|--------------|---------------------|
| utm_source   | instagram           |
| utm_medium   | social              |
| utm_campaign | wedding-season-2025 |

**Full URL:**
```

<https://pikeandwest.com/contact?utm_source=instagram&utm_medium=social&utm_campaign=wedding-season-2025>

```text

**With Content Tag (optional):**
```

<https://pikeandwest.com/contact?utm_source=instagram&utm_medium=social&utm_campaign=wedding-season-2025&utm_content=bio-link>

```text

**Analytics Location:**
In GA4: Acquisition → Traffic acquisition
Filter: Source = instagram, Campaign = wedding-season-2025

**Copy-Ready:**
`https://pikeandwest.com/contact?utm_source=instagram&utm_medium=social&utm_campaign=wedding-season-2025`
```

## Configuration

### Command File Location

```text
.claude/commands/utm-link.md
```

### Command Definition

```yaml
---
name: utm-link
description: Generate tracked link with UTM parameters
arguments:
  - name: url
    description: Destination URL (full or relative path)
    required: true
  - name: source
    description: Traffic source (instagram, facebook, email, etc.)
    required: true
  - name: campaign
    description: Campaign name (lowercase, hyphens)
    required: true
---

# /utm-link Command

When invoked:
1. Validate URL format
2. Validate source against approved list
3. Auto-assign medium based on source
4. Validate campaign naming
5. Generate complete URL
6. Provide copy-ready output
```

## Options

| Option      | Description                    | Default |
|-------------|--------------------------------|---------|
| `--medium`  | Override auto-detected medium  | Auto    |
| `--content` | Add utm_content tag            | None    |
| `--term`    | Add utm_term (for paid search) | None    |

**Examples with options:**

```bash
/utm-link /contact google spring-ads --medium cpc --term wedding+venue

/utm-link /blog/guide instagram blog-promo --content carousel-slide-1
```

## Approved Sources

| Source           | Auto-Medium | Use For                                      |
|------------------|-------------|----------------------------------------------|
| `instagram`      | social      | Organic IG posts, bio link                   |
| `facebook`       | social      | Organic FB posts                             |
| `linkedin`       | social      | LinkedIn posts                               |
| `pinterest`      | social      | Pinterest pins                               |
| `email`          | email       | Email campaigns                              |
| `google`         | cpc         | Google Ads (use --medium organic for search) |
| `gbp`            | organic     | Google Business Profile                      |
| `direct-mail`    | print       | Physical mailers                             |
| `partner-[name]` | referral    | Partner promotions                           |

## Campaign Naming Patterns

| Pattern                   | Example                     | Use For            |
|---------------------------|-----------------------------|--------------------|
| `[year]-[season]-[topic]` | `2025-spring-wedding-promo` | Seasonal campaigns |
| `[year]-[month]-[topic]`  | `2025-02-valentines`        | Monthly campaigns  |
| `blog-[topic]`            | `blog-venue-guide`          | Blog promotion     |
| `evergreen-[topic]`       | `evergreen-tour-booking`    | Ongoing links      |
| `event-[name]`            | `event-gallery-opening`     | Specific events    |

## Quick Reference

### Common Links

```bash
# Instagram bio - evergreen
/utm-link /contact instagram evergreen-tour-booking --content bio-link

# Facebook post - blog promo
/utm-link /blog/wedding-guide facebook blog-wedding-guide

# Email newsletter - monthly
/utm-link /contact email newsletter-2025-02 --content header-cta

# Google Business Profile
/utm-link /contact gbp evergreen-local

# Partner referral
/utm-link /contact partner-memphis-magazine spring-2025-ad
```

## Related Commands

- [/social-from-blog](./social-from-blog.md) - Includes tracked links automatically

## Validation Errors

The command will warn about:

- Invalid URL format
- Unapproved source values
- Campaign names with spaces (should use hyphens)
- Missing required parameters
- URLs already containing UTM parameters
