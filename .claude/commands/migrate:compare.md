---
description: Deep-dive comparison of a specific section between Webflow and Hugo
argument-hint: [section-name]
allowed-tools: Bash, Read, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_take_screenshot
---

Perform detailed comparison of the **$ARGUMENTS** section between Webflow source and Hugo implementation.

## Valid Sections

Supported sections: hero, gallery, events, about, cta, footer, header, contact-form, contact-info

If $ARGUMENTS is not provided or invalid, list valid sections and ask user to specify.

## Section Mapping

| Section      | Webflow Class                 | Hugo Partial                          | SCSS File                      |
|--------------|-------------------------------|---------------------------------------|--------------------------------|
| header       | `.navbar1_component`          | `layouts/partials/header.html`        | `assets/scss/_header.scss`     |
| hero         | `.hero-header-section`        | `layouts/partials/hero.html`          | `assets/scss/_hero.scss`       |
| gallery      | `.section_gallery17`          | `layouts/partials/venue-gallery.html` | `assets/scss/_gallery.scss`    |
| events       | `.event-wrap`                 | `layouts/partials/event-types.html`   | `assets/scss/_events.scss`     |
| about        | `.section.cc-store-home-wrap` | `layouts/partials/about.html`         | `assets/scss/_about.scss`      |
| cta          | `.cta-heading`                | `layouts/partials/cta-banner.html`    | `assets/scss/_cta-banner.scss` |
| footer       | `.section.footer-wrap`        | `layouts/partials/footer.html`        | `assets/scss/_footer.scss`     |
| contact-form | -                             | `layouts/page/contact.html`           | `assets/scss/_contact.scss`    |
| contact-info | -                             | `layouts/page/contact.html`           | `assets/scss/_contact.scss`    |

## Step 1: Read Hugo Implementation

Read the Hugo partial and SCSS for this section.

## Step 2: Read Webflow Source CSS

Search for the Webflow class in exported CSS:

- `webflow-export/css/pikeandwest.webflow.css`

Extract all relevant styles for this section.

## Step 3: Compare Key Properties

For this section, compare:

1. **Container**: width, max-width, padding, margin
2. **Background**: color, image, position, size
3. **Typography**: font-family, size, weight, color, letter-spacing
4. **Layout**: display, flex/grid properties, gap
5. **Spacing**: padding, margin, gap between children
6. **Effects**: shadows, borders, border-radius

## Step 4: Take Screenshots (if Playwright available)

Navigate to both sites and capture section:

1. Navigate to pikeandwest.com
2. Screenshot the section
3. Navigate to localhost:1313
4. Screenshot the same section

## Step 5: Document Differences

Create a comparison table:

| Property | Webflow Value | Hugo Value | Match? |
|----------|---------------|------------|--------|
| ...      | ...           | ...        | Yes/No |

## Step 6: Suggest Fixes

For each mismatch:

1. Show the SCSS change needed
2. Reference line in SCSS file
3. Explain impact on visual output

## Step 7: Offer to Update

Ask if user wants to:

- Apply suggested fixes to SCSS files
- Update `docs/webflow-to-hugo-css-mapping.md` with findings
- Run `/migrate:diff` to verify fixes
