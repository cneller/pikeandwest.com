---
name: Visual Parity Migration
description: This skill should be used when the user asks to "match the Webflow layout", "fix visual differences", "compare Hugo to Webflow", "achieve pixel-perfect match", "debug CSS differences", "run visual regression", or mentions BackstopJS results, CSS extraction, or layout discrepancies between the source Webflow site and Hugo implementation.
---

# Visual Parity Migration

Systematic methodology for achieving pixel-perfect visual matching when migrating Pike & West from Webflow to Hugo.

## Core Workflow

Follow this 8-phase approach for systematic visual parity:

### Phase 1: Baseline Capture

1. Ensure Webflow export exists at `webflow-export/`
2. Take reference screenshots at all breakpoints (320px, 768px, 1024px, 1440px)
3. Capture all interactive states (hover, mobile nav open/closed)

### Phase 2: Visual Regression Setup

BackstopJS is configured at project root (`backstop.json`). Run comparisons:

```bash
# Run visual regression test
npx backstop test

# View results in browser
npx backstop openReport

# Update reference images after fixes
npx backstop approve
```

### Phase 3: CSS Extraction

Extract computed styles from Webflow source:

1. Open pikeandwest.com in browser DevTools
2. Use **Computed** tab to see resolved values
3. Compare against Hugo's output at localhost:1313
4. Document differences in `docs/webflow-to-hugo-css-mapping.md`

### Phase 4: Section-by-Section Matching

Work through sections in order:

| Section      | Webflow Class                 | Hugo Partial         | SCSS File          |
|--------------|-------------------------------|----------------------|--------------------|
| Header       | `.navbar1_component`          | `header.html`        | `_header.scss`     |
| Hero         | `.hero-header-section`        | `hero.html`          | `_hero.scss`       |
| Gallery      | `.section_gallery17`          | `venue-gallery.html` | `_gallery.scss`    |
| Events       | `.event-wrap`                 | `event-types.html`   | `_events.scss`     |
| About        | `.section.cc-store-home-wrap` | `about.html`         | `_about.scss`      |
| CTA          | `.cta-heading`                | `cta-banner.html`    | `_cta-banner.scss` |
| Footer       | `.section.footer-wrap`        | `footer.html`        | `_footer.scss`     |
| Contact Form | -                             | `page/contact.html`  | `_contact.scss`    |

### Phase 5: Element-by-Element Approach

For each mismatched element:

1. **Structure** - Verify HTML hierarchy matches
2. **Box model** - Check margin, padding, width, height
3. **Typography** - Font family, size, weight, line-height, letter-spacing
4. **Colors** - Background, text, borders
5. **Layout** - Flex/grid properties, alignment
6. **Effects** - Shadows, borders, transforms, transitions

### Phase 6: Responsive Verification

Test at Webflow's fixed breakpoints:

| Breakpoint       | Webflow            | Hugo Variable           |
|------------------|--------------------|-------------------------|
| Desktop          | default            | default                 |
| Tablet           | `max-width: 991px` | `$breakpoint-lg: 992px` |
| Mobile Landscape | `max-width: 767px` | `$breakpoint-md: 768px` |
| Mobile Portrait  | `max-width: 479px` | `$breakpoint-sm: 480px` |

### Phase 7: Iteration

1. Make CSS fix in Hugo SCSS file
2. Run `npx backstop test` to compare
3. Check mismatch percentage decreased
4. Repeat until section passes

### Phase 8: Documentation

Update `docs/webflow-to-hugo-css-mapping.md` with:

- Fixed values
- Remaining discrepancies
- Visual regression test results

## Key Files

| File                                         | Purpose                   |
|----------------------------------------------|---------------------------|
| `webflow-export/css/pikeandwest.webflow.css` | Source CSS reference      |
| `webflow-export/css/webflow.css`             | Webflow layout system     |
| `docs/webflow-to-hugo-css-mapping.md`        | CSS mapping documentation |
| `backstop.json`                              | Visual regression config  |
| `backstop_data/`                             | Screenshots and reports   |

## Webflow CSS Conventions

Webflow transforms classes on publish:

- Lowercase
- Spaces become underscores

Common patterns:

- **Component prefixes**: `navbar1_`, `gallery17_`, `section_`
- **State modifiers**: `.is-secondary`, `.drk-bkgrnd`
- **Layout utilities**: `.padding-global`, `.container-large`

## Tools Available

### BackstopJS (installed)

Visual regression testing with screenshot comparison.

### Playwright (installed)

Browser automation for targeted screenshots.

### CSS Extraction

Use browser DevTools Computed tab or `window.getComputedStyle()`.

## Commands

- `/visual-diff` - Run BackstopJS and analyze results
- `/compare-section [section]` - Deep-dive on specific section
- `/update-mapping` - Update CSS mapping document

## Agents

- `visual-diff-analyzer` - Analyze BackstopJS results and suggest fixes
- `section-matcher` - Extract CSS and match specific section

## Additional Resources

### Reference Files

For detailed techniques and external resources:

- **`references/techniques.md`** - CSS extraction tools, comparison methods
- **`references/resources.md`** - External articles and documentation

### Project Files

- **`docs/webflow-to-hugo-css-mapping.md`** - Current CSS mapping with test results
- **`webflow-export/`** - Extracted Webflow source files
