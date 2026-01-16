# BackstopJS Visual Regression Skill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a global Claude Code skill for iterative visual regression testing with BackstopJS - the workflow of running tests, analyzing diffs, making CSS/template changes, and repeating until pixel-perfect match.

**Architecture:** A SKILL.md file with supporting workflow guides. The skill will be auto-activated when working with BackstopJS configs, visual regression testing, or site migration projects. It follows the iterative loop: test → analyze → fix → repeat.

**Tech Stack:** BackstopJS, Hugo/static site generators, CSS/SCSS, Playwright browser tools for visual inspection

---

## Task 1: Create Skill Directory Structure

**Files:**

- Create: `~/.claude/skills/backstopjs-visual-regression/SKILL.md`

**Step 1: Create the skill directory**

```bash
mkdir -p ~/.claude/skills/backstopjs-visual-regression
```

**Step 2: Verify directory exists**

Run: `ls -la ~/.claude/skills/backstopjs-visual-regression`
Expected: Empty directory listing

**Step 3: Commit**

```bash
cd ~/.claude/skills && git add backstopjs-visual-regression && git commit -m "feat: create backstopjs-visual-regression skill directory"
```

---

## Task 2: Write Core SKILL.md File

**Files:**

- Create: `~/.claude/skills/backstopjs-visual-regression/SKILL.md`

**Step 1: Write the skill file**

````markdown
---
name: backstopjs-visual-regression
description: |
  Iterative visual regression testing with BackstopJS for site migrations and CSS refinement.
  Activates when: running BackstopJS tests, analyzing visual diffs, fixing CSS mismatches,
  migrating sites between platforms (Webflow to Hugo, etc.), or achieving pixel-perfect matches.
  NOT for: E2E functional testing, unit tests, or non-visual testing.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - mcp__plugin_playwright_playwright__browser_navigate
  - mcp__plugin_playwright_playwright__browser_snapshot
  - mcp__plugin_playwright_playwright__browser_take_screenshot
---

# BackstopJS Visual Regression Testing

Iterative workflow for achieving pixel-perfect visual parity between reference and test sites.

## Quick Reference

- **Iterative Loop**: See [iterative-workflow.md](iterative-workflow.md)
- **Diff Analysis**: See [analyzing-diffs.md](analyzing-diffs.md)
- **Common Fixes**: See [common-css-fixes.md](common-css-fixes.md)

## Core Workflow: Test → Analyze → Fix → Repeat

### Phase 1: Capture Reference (One-Time)

```bash
# Capture screenshots from the reference site (e.g., live Webflow)
npx backstop reference
````

This captures the "golden" screenshots that represent the target design.

### Phase 2: Iterative Testing Loop

```bash
# 1. Run comparison test
npx backstop test

# 2. Open HTML report to analyze diffs
open backstop_data/html_report/index.html

# 3. Make CSS/template fixes based on diff analysis

# 4. Rebuild site (Hugo example)
hugo --gc --minify

# 5. Repeat from step 1 until all tests pass
```

## Configuration Best Practices

### Optimal backstop.json Structure

```json
{
  "id": "project-name",
  "viewports": [
    { "label": "mobile", "width": 375, "height": 812 },
    { "label": "tablet", "width": 768, "height": 1024 },
    { "label": "desktop", "width": 1440, "height": 900 }
  ],
  "scenarios": [
    {
      "label": "Page Name - Section",
      "url": "http://localhost:1313/page/",
      "referenceUrl": "https://live-site.com/page/",
      "delay": 2000,
      "selectors": ["document"],
      "misMatchThreshold": 0.5,
      "requireSameDimensions": false,
      "hideSelectors": ["iframe", ".dynamic-content"]
    }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "html_report": "backstop_data/html_report"
  },
  "engine": "puppeteer",
  "asyncCaptureLimit": 5
}
```

### Key Configuration Tips

1. **`requireSameDimensions: false`** - Essential for comparing sites with different content lengths
2. **`misMatchThreshold: 0.5`** - Start strict (0.5%), loosen only if needed for dynamic content
3. **`hideSelectors`** - Hide iframes, ads, dynamic timestamps that cause false failures
4. **`delay: 2000`** - Allow fonts and images to load (increase for heavy pages)

## Diff Analysis Strategy

### Priority Order for Fixes

1. **Layout/Structure** (highest impact)
   - Grid/flexbox issues
   - Container widths
   - Margin/padding differences

2. **Typography**
   - Font family mismatches
   - Font weight differences
   - Line height variations
   - Letter spacing

3. **Colors & Backgrounds**
   - Background colors
   - Text colors
   - Border colors

4. **Spacing & Sizing**
   - Element dimensions
   - Margins and padding
   - Gap properties

5. **Details** (lowest priority)
   - Border radius
   - Shadows
   - Transitions

### Reading the Diff Report

The HTML report shows three images per scenario:

- **Reference**: Target design (what we want)
- **Test**: Current build (what we have)
- **Diff**: Pink/magenta highlights show mismatches

**Interpret diff percentages:**

- `0-1%`: Minor differences (often acceptable)
- `1-5%`: Noticeable issues (should fix)
- `5-20%`: Significant differences (layout/typography issues)
- `20%+`: Major structural problems

## Common CSS Fix Patterns

### Font Differences

```scss
// Problem: Font not matching
// Check: Is the correct font loading?
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap');

// Check: Is font-weight correct?
h1 {
  font-family: 'Oswald', sans-serif;
  font-weight: 500;  // Not 400, not 600
}
```

### Spacing Issues

```scss
// Use DevTools to extract exact values from reference
.section {
  padding: 48px 24px;  // Exact values, not approximations
  margin-bottom: 32px;
}
```

### Layout Differences

```scss
// Match the exact layout model
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;  // Not margin on children
}
```

## Iterative Workflow Checklist

When running the iterative loop, follow this checklist:

- [ ] Run `backstop test` and note the diff percentage
- [ ] Open HTML report: `open backstop_data/html_report/index.html`
- [ ] Identify the highest-impact difference (layout > typography > colors)
- [ ] Use Playwright browser tools to inspect both sites side-by-side
- [ ] Extract exact CSS values from reference site using DevTools
- [ ] Apply fix to SCSS/CSS files
- [ ] Rebuild site (`hugo` or equivalent)
- [ ] Re-run `backstop test` to verify improvement
- [ ] Repeat until diff percentage is acceptable (<1% for most cases)

## Using Playwright for Side-by-Side Comparison

When analyzing diffs, use Playwright to inspect both sites:

```text
# Navigate to reference site
mcp__plugin_playwright_playwright__browser_navigate to https://live-site.com

# Take snapshot to see computed styles
mcp__plugin_playwright_playwright__browser_snapshot

# Compare with local site
mcp__plugin_playwright_playwright__browser_navigate to http://localhost:1313

# Screenshot specific elements for comparison
mcp__plugin_playwright_playwright__browser_take_screenshot
```

## Approval Workflow

When satisfied with visual parity:

```bash
# Approve current test screenshots as new reference
npx backstop approve

# This copies test screenshots to reference folder
# Use when intentionally changing the design
```

## Avoiding Flaky Tests

1. **Increase delays** for pages with web fonts or lazy-loaded images
2. **Hide dynamic content** (timestamps, user-generated, ads)
3. **Use `requireSameDimensions: false`** when content length varies
4. **Disable animations** in onReady script:

```javascript
// backstop_data/engine_scripts/puppet/onReady.js
module.exports = async (page) => {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
    `
  });
};
```

## CI Integration

```yaml
# .github/workflows/visual-regression.yml
name: Visual Regression

on: [pull_request]

jobs:
  backstop:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build  # Build your site
      - run: npm run serve &  # Start server in background
      - run: npx backstop test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: backstop-report
          path: backstop_data/html_report/
```

## Troubleshooting

| Issue                        | Solution                                      |
|------------------------------|-----------------------------------------------|
| Test times out               | Increase `delay` in scenario config           |
| Fonts don't match            | Check font import, weights, and fallbacks     |
| Layout shifts                | Check container widths, flexbox/grid settings |
| High diff % on similar pages | Hide dynamic content with `hideSelectors`     |
| Reference capture fails      | Check `referenceUrl` is accessible            |

````text

**Step 2: Verify file was created**

Run: `head -50 ~/.claude/skills/backstopjs-visual-regression/SKILL.md`
Expected: First 50 lines of the skill file

**Step 3: Commit**

```bash
cd ~/.claude/skills && git add backstopjs-visual-regression/SKILL.md && git commit -m "feat: add core BackstopJS visual regression skill"
````

---

## Task 3: Create Iterative Workflow Guide

**Files:**

- Create: `~/.claude/skills/backstopjs-visual-regression/iterative-workflow.md`

**Step 1: Write the workflow guide**

```markdown
# Iterative Visual Regression Workflow

Step-by-step guide for the test-analyze-fix-repeat loop.

## The Loop

```

┌─────────────────────────────────────────┐
│ │
│ ┌──────────┐ │
│ │ backstop │ │
│ │ test │ │
│ └────┬─────┘ │
│ │ │
│ ▼ │
│ ┌──────────┐ Pass? │
│ │ Analyze │────────────► Done! │
│ │ Diffs │ │
│ └────┬─────┘ │
│ │ Fail │
│ ▼ │
│ ┌──────────┐ │
│ │ Identify │ │
│ │ Root CSS │ │
│ └────┬─────┘ │
│ │ │
│ ▼ │
│ ┌──────────┐ │
│ │ Apply │ │
│ │ Fix │ │
│ └────┬─────┘ │
│ │ │
│ ▼ │
│ ┌──────────┐ │
│ │ Rebuild │ │
│ │ Site │ │
│ └────┬─────┘ │
│ │ │
│ └───────────────────────────────┘

````text

## Step 1: Run Test

```bash
npx backstop test
````

Note the exit code:

- Exit 0: All tests pass (done!)
- Exit 1: Mismatch errors found (continue to analysis)

## Step 2: Open Report

```bash
# macOS
open backstop_data/html_report/index.html

# Linux
xdg-open backstop_data/html_report/index.html

# Or navigate in browser to:
# file:///path/to/project/backstop_data/html_report/index.html
```

## Step 3: Analyze Each Failing Scenario

For each failed test:

1. **Look at the diff image** - Pink areas show mismatches
2. **Compare reference vs test** - What's different?
3. **Identify the CSS property** - Layout? Typography? Spacing?
4. **Prioritize by impact** - Fix layout issues before color tweaks

## Step 4: Extract Exact Values

Use browser DevTools on the reference site:

1. Open reference URL in browser
2. Right-click element → Inspect
3. Copy exact CSS values (don't approximate!)
4. Note computed values, not just declared ones

### Using Playwright for Inspection

```text
# Open reference site
Navigate to https://reference-site.com

# Snapshot for accessibility tree
browser_snapshot

# Screenshot for visual reference
browser_take_screenshot
```

## Step 5: Apply CSS Fix

Edit your SCSS/CSS files with the extracted values:

```scss
// Be precise - copy exact values
.hero-title {
  font-size: 48px;      // Not "3rem" unless reference uses rem
  font-weight: 500;     // Not "medium" - use numeric value
  line-height: 1.2;     // Exact value from computed styles
  letter-spacing: 2px;  // Often overlooked!
}
```

## Step 6: Rebuild Site

```bash
# Hugo
hugo --gc --minify

# Next.js
npm run build

# Generic
npm run build
```

## Step 7: Repeat

Go back to Step 1 and run `backstop test` again.

Track progress by diff percentage:

- **First run**: 45% diff
- **After layout fixes**: 15% diff
- **After typography fixes**: 5% diff
- **After spacing fixes**: 0.3% diff ✓

## When to Stop

Consider visual parity achieved when:

- All scenarios show < 1% diff
- Remaining differences are acceptable (dynamic content, etc.)
- Pixel differences are not visible to human eye

## Batch vs Single-Fix Approach

**Single-Fix (Recommended for learning)**

- Fix one issue at a time
- Run test after each fix
- Understand cause and effect

**Batch-Fix (Faster for experienced)**

- Fix all issues of one type (e.g., all typography)
- Run test after batch
- Risk: harder to debug regressions

## Common Iteration Patterns

### Pattern 1: Top-Down Layout Fix

1. Fix page-level container widths
2. Fix section spacing
3. Fix component layouts
4. Fix element sizing

### Pattern 2: Component-by-Component

1. Fix header completely
2. Fix hero section
3. Fix each content section
4. Fix footer

### Pattern 3: Property-Type Sweep

1. Fix all font-family issues
2. Fix all font-size issues
3. Fix all margin/padding issues
4. Fix all color issues

````text

**Step 2: Verify file was created**

Run: `wc -l ~/.claude/skills/backstopjs-visual-regression/iterative-workflow.md`
Expected: ~150 lines

**Step 3: Commit**

```bash
cd ~/.claude/skills && git add backstopjs-visual-regression/iterative-workflow.md && git commit -m "feat: add iterative workflow guide"
````

---

## Task 4: Create Diff Analysis Guide

**Files:**

- Create: `~/.claude/skills/backstopjs-visual-regression/analyzing-diffs.md`

**Step 1: Write the diff analysis guide**

```markdown
# Analyzing BackstopJS Diff Reports

How to interpret diff images and identify root causes.

## Understanding the Report

Each scenario shows three panels:
- **REFERENCE**: The target (what we want)
- **TEST**: Current build (what we have)
- **DIFF**: Overlay showing mismatches

## Reading Diff Images

### Diff Colors
- **Magenta/Pink pixels**: Areas that differ
- **Unchanged areas**: Match between reference and test

### Diff Percentage
The percentage indicates pixel-level mismatch:

| Percentage | Interpretation              | Action                   |
|------------|-----------------------------|--------------------------|
| 0%         | Perfect match               | Done                     |
| 0.1-0.5%   | Sub-pixel differences       | Usually acceptable       |
| 0.5-2%     | Minor differences           | Review, may need fixes   |
| 2-10%      | Noticeable differences      | Needs attention          |
| 10-30%     | Significant mismatch        | Layout/typography issues |
| 30%+       | Major structural difference | Check base layout        |

## Diagnostic Techniques

### Technique 1: Squint Test
Blur your eyes when looking at the diff. Large pink areas = big problems. Scattered pink = minor issues.

### Technique 2: Edge Analysis
Pink along edges usually means:
- Size/dimension differences
- Position shifts
- Border differences

### Technique 3: Block Analysis
Large solid pink blocks usually mean:
- Background color differences
- Missing elements
- Extra elements

### Technique 4: Text Smear
Fuzzy pink where text appears means:
- Font family differences
- Font weight differences
- Font size differences
- Line height differences

## Common Diff Patterns

### Horizontal Offset
```

Reference: [ Element ]
Test: [ Element ]
↑ shifted left

```text
**Cause**: Margin, padding, or container width difference
**Fix**: Check horizontal spacing properties

### Vertical Offset
```

Reference: [Element]

Test: [Element] ← shifted down

```text
**Cause**: Margin-top, padding-top, or line-height difference
**Fix**: Check vertical spacing properties

### Size Difference
```

Reference: [ Large Element ]
Test: [Small Element]

```text
**Cause**: Width, height, font-size, or padding difference
**Fix**: Check dimension and sizing properties

### Color Shift
```

Reference: [████████] (dark)
Test: [▓▓▓▓▓▓▓▓] (lighter)

```text
**Cause**: Different color values
**Fix**: Extract exact color codes from reference

### Font Weight Difference
```

Reference: **Bold Text**
Test: Regular Text

```text
**Cause**: font-weight mismatch
**Fix**: Match exact font-weight value (400, 500, 600, 700)

## Extracting CSS Values

### From Browser DevTools

1. Open reference site in Chrome/Firefox
2. Right-click element → Inspect
3. Look at **Computed** tab (not Styles)
4. Copy exact values:
   - `font-size: 18px` (not `1.125rem` unless source uses rem)
   - `line-height: 27px` or `1.5`
   - `margin: 24px 0 16px 0` (all four values)

### From Playwright

```

## Navigate to element

browser_navigate to reference URL

## Evaluate to get computed styles

browser_evaluate:
window.getComputedStyle(document.querySelector('.target')).fontSize

````text

## Priority Matrix

When multiple things need fixing, prioritize by:

| Priority | Issue Type       | Impact               |
|----------|------------------|----------------------|
| 1        | Layout structure | Affects everything   |
| 2        | Container widths | Affects all children |
| 3        | Typography       | Highly visible       |
| 4        | Spacing          | Moderately visible   |
| 5        | Colors           | Lower visibility     |
| 6        | Borders/shadows  | Lowest visibility    |

## Documentation

As you fix issues, document what you find:

```markdown
## Diff Analysis Log

### Scenario: Homepage - Hero
- **Diff**: 23% → 5% → 0.4%
- **Issues Found**:
  1. Container max-width: 1200px vs 1140px (fixed)
  2. H1 font-weight: 700 vs 500 (fixed)
  3. Button padding: 12px 24px vs 16px 32px (fixed)
````

````text

**Step 2: Verify file was created**

Run: `wc -l ~/.claude/skills/backstopjs-visual-regression/analyzing-diffs.md`
Expected: ~140 lines

**Step 3: Commit**

```bash
cd ~/.claude/skills && git add backstopjs-visual-regression/analyzing-diffs.md && git commit -m "feat: add diff analysis guide"
````

---

### Task 5: Create Common CSS Fixes Reference

**Files:**

- Create: `~/.claude/skills/backstopjs-visual-regression/common-css-fixes.md`

**Step 1: Write the common fixes guide**

````markdown
# Common CSS Fixes for Visual Regression

Quick reference for fixing common diff patterns.

## Typography Fixes

### Font Family Not Matching

```scss
// Problem: System font showing instead of web font
// Solution: Ensure font is loaded and applied

// 1. Check import
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap');

// 2. Check application
body {
  font-family: 'Oswald', sans-serif;  // Exact name from Google Fonts
}
````

#### Font Weight Wrong

```scss
// Problem: Text appears too bold or too light
// Solution: Use exact numeric weight

// Wrong
h1 { font-weight: bold; }  // "bold" = 700, but reference might be 600

// Right
h1 { font-weight: 600; }  // Exact value from reference
```

#### Line Height Off

```scss
// Problem: Text spacing between lines different
// Solution: Match exact line-height

// Unitless (preferred - scales with font-size)
p { line-height: 1.6; }

// Or fixed (if reference uses fixed)
p { line-height: 24px; }
```

#### Letter Spacing Missing

```scss
// Problem: Text feels "tighter" or "looser"
// Solution: Check letter-spacing

h1 {
  letter-spacing: 2px;    // Positive = spread out
  // or
  letter-spacing: -0.5px; // Negative = tighter
}
```

### Layout Fixes

#### Container Width Wrong

```scss
// Problem: Content too wide or narrow
// Solution: Match max-width exactly

.container {
  max-width: 1140px;  // Not 1200px, not 1100px - exact!
  margin: 0 auto;
  padding: 0 24px;    // Don't forget horizontal padding
}
```

#### Flexbox Alignment Off

```scss
// Problem: Items not aligned correctly
// Solution: Check all flex properties

.flex-container {
  display: flex;
  justify-content: space-between;  // Or center, flex-start, etc.
  align-items: center;             // Or flex-start, stretch, etc.
  gap: 24px;                       // Modern alternative to margin
}
```

#### Grid Layout Different

```scss
// Problem: Grid columns/rows don't match
// Solution: Match grid definition exactly

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  // Or specific widths
  gap: 32px;                               // Both row and column gap
}
```

### Spacing Fixes

#### Margin Differences

```scss
// Problem: Elements too close or too far apart
// Solution: Set exact margins

.section {
  margin-top: 64px;
  margin-bottom: 48px;  // Top and bottom often differ!
}

// Or use shorthand
.element {
  margin: 24px 16px 32px 16px;  // top right bottom left
}
```

#### Padding Issues

```scss
// Problem: Content not positioned within container correctly
// Solution: Set exact padding

.card {
  padding: 32px 24px;  // vertical horizontal
}

// Or all four values
.button {
  padding: 12px 24px 14px 24px;  // top right bottom left
}
```

### Color Fixes

#### Background Color Wrong

```scss
// Problem: Background shade doesn't match
// Solution: Extract exact hex code

.hero {
  background-color: #1a1a1a;  // Not "black" - exact value!
}
```

#### Text Color Off

```scss
// Problem: Text appears different shade
// Solution: Match exact color

body {
  color: #333333;  // Not "dark gray" - exact hex
}

.muted {
  color: #666666;  // Secondary text color
}
```

#### Border Color Missing

```scss
// Problem: Borders visible in reference but not test (or vice versa)
// Solution: Add exact border definition

.card {
  border: 1px solid #e0e0e0;
  // Or just specific sides
  border-bottom: 2px solid #c9a227;
}
```

### Responsive Fixes

#### Breakpoint Differences

```scss
// Problem: Layout breaks at different screen sizes
// Solution: Match exact breakpoints

// Check reference site's breakpoints in DevTools
@media (max-width: 768px) {  // Exact value!
  .grid {
    grid-template-columns: 1fr;
  }
}
```

#### Mobile Spacing Different

```scss
// Problem: Mobile has different spacing than desktop
// Solution: Set mobile-specific values

.section {
  padding: 64px 24px;

  @media (max-width: 768px) {
    padding: 32px 16px;  // Reduced on mobile
  }
}
```

### Image and Media Fixes

#### Image Size Wrong

```scss
// Problem: Images different size than reference
// Solution: Set explicit dimensions or aspect ratio

.hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;  // Maintain aspect ratio
}

// Or use aspect ratio
.thumbnail {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
}
```

#### Image Missing

```scss
// Problem: Image appears in reference but not test
// Solution: Check image paths and ensure files exist

// In Hugo, use proper asset paths
{{ $img := resources.Get "images/hero.jpg" }}
<img src="{{ $img.RelPermalink }}" alt="Hero">
```

### Animation and Transition Fixes

#### Disable for Testing

```scss
// Problem: Animations cause diff failures
// Solution: Disable during BackstopJS captures

// In backstop onReady.js
page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  `
});
```

### Debug Checklist

When a fix doesn't work:

- [ ] Did you save the file?
- [ ] Did you rebuild the site?
- [ ] Did you clear browser cache?
- [ ] Is the CSS selector correct?
- [ ] Is the CSS property spelled correctly?
- [ ] Is the value in correct units (px, rem, %, etc.)?
- [ ] Is there a more specific selector overriding?
- [ ] Did you check the Computed tab, not just Styles?

````text

**Step 2: Verify file was created**

Run: `wc -l ~/.claude/skills/backstopjs-visual-regression/common-css-fixes.md`
Expected: ~200 lines

**Step 3: Commit**

```bash
cd ~/.claude/skills && git add backstopjs-visual-regression/common-css-fixes.md && git commit -m "feat: add common CSS fixes reference"
````

---

### Task 6: Update Global CLAUDE.md with Skill Reference

**Files:**

- Modify: `~/.claude/CLAUDE.md` (add skill to list)

**Step 1: Add skill entry to CLAUDE.md**

Find the skills section and add:

```markdown
- [BackstopJS Visual Regression](~/.claude/skills/backstopjs-visual-regression/SKILL.md) - Iterative visual regression testing, diff analysis, CSS fixes
```

**Step 2: Verify addition**

Run: `grep -n "backstopjs" ~/.claude/CLAUDE.md`
Expected: Line showing the new skill entry

**Step 3: Commit**

```bash
cd ~/.claude && git add CLAUDE.md && git commit -m "docs: add backstopjs-visual-regression skill to CLAUDE.md"
```

---

### Task 7: Test the Skill

**Files:**

- Read: `~/.claude/skills/backstopjs-visual-regression/SKILL.md`

**Step 1: Verify skill loads correctly**

Start a new Claude session and mention "BackstopJS visual regression" to confirm the skill activates.

**Step 2: Run a test iteration on Pike & West project**

```bash
cd /Users/colinneller/Projects/pikeandwest.com
npx backstop test
```

**Step 3: Verify workflow guidance activates**

Check that Claude provides guidance based on the skill content when analyzing diffs.

---

### Summary

This plan creates a global skill at `~/.claude/skills/backstopjs-visual-regression/` with:

1. **SKILL.md** - Core skill with workflow overview, configuration tips, and CLI commands
2. **iterative-workflow.md** - Step-by-step guide for the test-analyze-fix loop
3. **analyzing-diffs.md** - How to interpret diff images and identify root causes
4. **common-css-fixes.md** - Quick reference for fixing typography, layout, spacing, and color issues

The skill auto-activates when working with BackstopJS, visual regression testing, or site migration projects.
