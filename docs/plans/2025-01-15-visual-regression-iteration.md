# Pike & West Visual Regression Iteration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use backstopjs-visual-regression skill throughout this plan. Follow the iterative workflow: test -> analyze -> fix -> repeat.

**Goal:** Achieve pixel-perfect visual parity between the live Webflow site (pikeandwest.com) and the local Hugo port by iteratively fixing CSS differences.

**Architecture:** Run BackstopJS tests, analyze diff reports, extract exact CSS values from reference site using Playwright, apply fixes to SCSS files, rebuild Hugo, repeat until all scenarios show < 1% diff.

**Tech Stack:** BackstopJS, Hugo, SCSS, Playwright browser tools

---

## Pre-Iteration Setup

**Files:**

- Verify: `backstop.json` (already configured)
- Verify: `backstop_data/bitmaps_reference/` (already captured)

**Step 1: Start Hugo server**

```bash
hugo server -D
```

Expected: Server running at <http://localhost:1313/>

**Step 2: Run initial BackstopJS test**

```bash
npx backstop test
```

Expected: Exit code 1 with mismatch errors (this is expected - we're starting the iteration)

**Step 3: Open HTML report**

```bash
open backstop_data/html_report/index.html
```

Expected: Report shows 12 scenarios (4 pages x 3 viewports) with diff percentages

---

## Task 1: Fix Homepage Desktop Layout

**Files:**

- Analyze: `backstop_data/html_report/index.html` (Homepage - Hero, desktop viewport)
- Modify: `assets/scss/_hero.scss`
- Modify: `assets/scss/_header.scss`
- Modify: `assets/scss/_variables.scss`

**Step 1: Analyze the diff**

Open the BackstopJS report and examine "Homepage - Hero" at desktop viewport.

- Note the diff percentage
- Identify pink areas (mismatches)
- Categorize issues: layout, typography, spacing, colors

**Step 2: Inspect reference site with Playwright**

Navigate to <https://pikeandwest.com/> and use browser_snapshot to capture the accessibility tree.

Extract key CSS values:

- Container max-width
- Header height and padding
- Hero section dimensions
- Font sizes and weights

**Step 3: Apply layout fixes**

Edit `assets/scss/_variables.scss` with extracted values:

```scss
// Container
$container-max-width: [extracted value];

// Header
$header-height: [extracted value];
$header-padding: [extracted value];
```

**Step 4: Rebuild and test**

```bash
hugo --gc --minify && npx backstop test
```

**Step 5: Compare diff percentage**

Open report and note improvement. Target: reduce diff by at least 10%.

---

## Task 2: Fix Homepage Desktop Typography

**Files:**

- Analyze: `backstop_data/html_report/index.html`
- Modify: `assets/scss/_typography.scss`
- Modify: `assets/scss/_hero.scss`

**Step 1: Analyze typography diffs**

Look for "text smear" patterns in diff (fuzzy pink where text appears).

**Step 2: Extract exact font values from reference**

Use Playwright to inspect:

- H1 font-size, font-weight, line-height, letter-spacing
- Body font-size, line-height
- Navigation font properties

**Step 3: Apply typography fixes**

```scss
// In _typography.scss
h1 {
  font-family: 'Oswald', sans-serif;
  font-size: [extracted]px;
  font-weight: [extracted];
  line-height: [extracted];
  letter-spacing: [extracted]px;
}
```

**Step 4: Rebuild and test**

```bash
hugo --gc --minify && npx backstop test
```

**Step 5: Compare diff percentage**

Target: Homepage desktop now < 10% diff.

---

## Task 3: Fix Homepage Desktop Spacing & Colors

**Files:**

- Modify: `assets/scss/_hero.scss`
- Modify: `assets/scss/_buttons.scss`
- Modify: `assets/scss/_variables.scss`

**Step 1: Analyze remaining diffs**

Identify:

- Margin/padding differences
- Background colors
- Button styling

**Step 2: Extract spacing values**

Use Playwright to get computed styles for:

- Section padding
- Element margins
- Button padding

**Step 3: Apply spacing and color fixes**

```scss
// In _variables.scss
$color-gold: #[extracted];
$color-cream: #[extracted];

// In _hero.scss
.hero {
  padding: [extracted]px [extracted]px;
}
```

**Step 4: Rebuild and test**

```bash
hugo --gc --minify && npx backstop test
```

**Step 5: Verify desktop homepage passes**

Target: Homepage - Hero (desktop) < 1% diff.

---

## Task 4: Fix Homepage Tablet & Mobile

**Files:**

- Modify: `assets/scss/_hero.scss`
- Modify: `assets/scss/_header.scss`
- Modify: `assets/scss/_responsive.scss` (create if needed)

**Step 1: Analyze tablet and mobile diffs**

Check "Homepage - Hero" at tablet (768px) and mobile (375px) viewports.

**Step 2: Extract responsive breakpoint values**

Use Playwright with browser_resize to inspect at different widths.

**Step 3: Apply responsive fixes**

```scss
// In _hero.scss
.hero {
  // Desktop styles...

  @media (max-width: 768px) {
    padding: [tablet value];
    // tablet-specific fixes
  }

  @media (max-width: 375px) {
    padding: [mobile value];
    // mobile-specific fixes
  }
}
```

**Step 4: Rebuild and test**

```bash
hugo --gc --minify && npx backstop test
```

**Step 5: Verify all homepage viewports pass**

Target: All 3 Homepage - Hero scenarios < 1% diff.

---

## Task 5: Fix Homepage Full Page

**Files:**

- Modify: `assets/scss/_about.scss`
- Modify: `assets/scss/_events.scss`
- Modify: `assets/scss/_gallery.scss`
- Modify: `assets/scss/_cta-banner.scss`

**Step 1: Analyze full page diffs**

Check "Homepage - Full Page" scenarios at all viewports.

**Step 2: Section-by-section fixes**

For each section with high diff:

1. Inspect reference with Playwright
2. Extract exact CSS values
3. Apply fixes to corresponding SCSS file
4. Rebuild and verify improvement

**Step 3: Iterate until passing**

Target: All 3 Homepage - Full Page scenarios < 1% diff.

---

## Task 6: Fix Contact Page

**Files:**

- Modify: `assets/scss/_contact.scss`
- Modify: `assets/scss/_forms.scss`

**Step 1: Analyze Contact Page diffs**

Note: iframes are hidden via `hideSelectors` in backstop.json.

**Step 2: Fix contact page layout**

Extract and apply:

- Two-column grid layout
- Contact info styling
- Map placeholder dimensions

**Step 3: Rebuild and test**

```bash
hugo --gc --minify && npx backstop test
```

Target: All 3 Contact Page scenarios < 1% diff.

---

## Task 7: Fix Gallery Application Page

**Files:**

- Modify: `assets/scss/_forms.scss`
- Modify: `assets/scss/_contact.scss` (shared layout)

**Step 1: Analyze Gallery Application diffs**

Similar structure to Contact page.

**Step 2: Apply fixes**

**Step 3: Rebuild and test**

Target: All 3 Gallery Application scenarios < 1% diff.

---

## Task 8: Final Verification

**Step 1: Run full test suite**

```bash
npx backstop test
```

Expected: Exit code 0 (all tests pass)

**Step 2: Verify all scenarios**

| Scenario             | Mobile | Tablet | Desktop |
|----------------------|--------|--------|---------|
| Homepage - Hero      | < 1%   | < 1%   | < 1%    |
| Homepage - Full Page | < 1%   | < 1%   | < 1%    |
| Contact Page         | < 1%   | < 1%   | < 1%    |
| Gallery Application  | < 1%   | < 1%   | < 1%    |

**Step 3: Approve as new baseline (optional)**

If satisfied with visual parity:

```bash
npx backstop approve
```

This copies test screenshots to reference folder for future regression testing.

---

## Iteration Log Template

Track progress as you work:

```markdown
## Iteration Log

### Run 1: Initial State
- Homepage Hero Desktop: XX%
- Homepage Hero Tablet: XX%
- Homepage Hero Mobile: XX%
- (continue for all scenarios)

### Run 2: After Layout Fixes
- Homepage Hero Desktop: XX% (was XX%)
- ...

### Run N: Final
- All scenarios: < 1%
```

---

## Summary

This plan follows the BackstopJS visual regression skill workflow:

1. **Test** - Run `npx backstop test`
2. **Analyze** - Open HTML report, identify diff patterns
3. **Fix** - Extract exact CSS from reference, apply to SCSS
4. **Repeat** - Rebuild Hugo, re-test, iterate

Priority order: Layout -> Typography -> Spacing -> Colors -> Details

Target: All 12 scenarios (4 pages x 3 viewports) showing < 1% diff.
