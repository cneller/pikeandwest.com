# Style Comparison Tool Design

## Overview

A computed styles extraction tool for comparing CSS between the Webflow export and Hugo site during the Pike & West migration. Uses Playwright to extract actual rendered values and report differences.

## Architecture

### Components

1. **Dual Local Servers**
   - Hugo: `localhost:1313` (existing dev server)
   - Webflow: `localhost:8080` (static file server via `serve`)

2. **Element Mapping Configuration** (`scripts/style-comparison/mapping.yaml`)
   - Maps Hugo selectors to Webflow selectors by section/role
   - Defines which CSS property sets to compare per element
   - Supports multiple pages

3. **Comparison Script** (`scripts/style-comparison/compare-styles.js`)
   - Loads mapping configuration
   - Opens both sites in Playwright
   - Extracts computed styles for mapped elements
   - Normalizes values (colors to hex, fonts to lowercase)
   - Generates console output and JSON report

### Property Sets

```yaml
typography: font-family, font-size, font-weight, line-height, letter-spacing, text-transform, color
spacing: padding-*, margin-*
layout: display, flex-direction, justify-content, align-items, gap, max-width, width
visual: background-color, border, border-radius, box-shadow
```

## Usage

```bash
# Terminal 1: Hugo server (if not running)
hugo server

# Terminal 2: Webflow export server
npm run serve:webflow

# Terminal 3: Run comparison
npm run compare:styles
```

## Output

Console shows per-element comparison with match/mismatch status:

```text
✓ nav-button-primary
  Hugo: .header__link--primary
  Webflow: .navbar-button-gold
  All 19 properties match

✗ hero-tagline
  Hugo: .hero__tagline
  Webflow: .hero-subheader-1
  Differences:
    font-family:
      Webflow: Montserrat, sans-serif
      Hugo:    Raleway, sans-serif
```

JSON report saved to `scripts/style-comparison/comparison-report.json`.

## Initial Findings (2026-01-15)

From the first comparison run:

| Matches | Differences | Errors |
|---------|-------------|--------|
| 3       | 25          | 0      |

### Key Style Discrepancies

1. **Typography**
   - Hero tagline: Webflow uses Montserrat 22px/400, Hugo uses Raleway 18px/300
   - Event labels: Webflow uses Le Mores Serif, Hugo uses Raleway
   - About subtitle: Different font families and sizes

2. **Button Styles**
   - Hero CTA: Webflow uses filled cream, Hugo uses outline
   - CTA banner button: Inverted color scheme

3. **Text Transform**
   - Section headings: Webflow uses normal case, Hugo uses uppercase

4. **Section Padding**
   - Webflow sections have 0px padding (containers handle it)
   - Hugo sections have 64px vertical padding

5. **Footer**
   - Different padding approach
   - Logo size: 50px vs 30px
   - Link styling differs significantly

## Extending the Tool

### Add New Elements

Edit `scripts/style-comparison/mapping.yaml`:

```yaml
- role: "new-element"
  hugo: ".hugo-selector"
  webflow: ".webflow-selector"
  properties: [typography, visual]
```

### Add Responsive Breakpoints

Modify `compare-styles.js` to test multiple viewport sizes:

```javascript
const viewports = [
  { width: 1440, height: 900, name: 'desktop' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 375, height: 812, name: 'mobile' },
];
```

### Add More Pages

Add entries to `pages` array in mapping.yaml with `path` and `webflow_path`.

## Files

```text
scripts/style-comparison/
├── mapping.yaml           # Element mapping configuration
├── compare-styles.js      # Playwright comparison script
└── comparison-report.json # Generated JSON report (gitignored)

webflow-export/            # Extracted Webflow export
├── css/
│   ├── normalize.css
│   ├── webflow.css
│   └── pikeandwest.webflow.css
├── index.html
├── contact.html
├── images/
└── fonts/
```
