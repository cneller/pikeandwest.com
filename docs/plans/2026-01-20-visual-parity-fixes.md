# Visual Parity Migration Plan: Pike & West Homepage

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix verified visual differences between Hugo and Webflow implementations for pixel-perfect homepage parity.

**Architecture:** Update SCSS typography variables, data file casing, and menu configuration. Enhance BackstopJS infrastructure for section-level regression testing at Webflow breakpoints.

**Tech Stack:** Hugo, SCSS, BackstopJS (Puppeteer engine), YAML data files, TOML config

---

## Phase 0: BackstopJS Infrastructure

### Task 0.1: Update BackstopJS Viewports

**Files:**

- Modify: `backstop.json:4-18`

**Step 1: Update viewport widths to match Webflow breakpoints**

Replace lines 4-18 with:

```json
  "viewports": [
    {
      "label": "mobile-portrait",
      "width": 480,
      "height": 844
    },
    {
      "label": "mobile-landscape",
      "width": 768,
      "height": 480
    },
    {
      "label": "tablet",
      "width": 992,
      "height": 768
    },
    {
      "label": "desktop",
      "width": 1280,
      "height": 800
    }
  ],
```

**Step 2: Verify JSON is valid**

Run: `cat backstop.json | jq .`
Expected: Valid JSON output with new viewports

---

### Task 0.2: Add Section-Level Scenarios

**Files:**

- Modify: `backstop.json:20-61`

**Step 1: Replace scenarios array with section-specific scenarios**

Replace the entire `"scenarios": [...]` array (lines 20-61) with:

```json
  "scenarios": [
    {
      "label": "Section - Hero",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 2000,
      "selectors": [".hero"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Section - Our Venue Gallery",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 2000,
      "selectors": [".venue-gallery"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Section - Event Types",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 2000,
      "selectors": [".event-types"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Section - About",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 2000,
      "selectors": [".about"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Section - CTA Banner",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 2000,
      "selectors": [".cta-banner"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Section - Footer",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 2000,
      "selectors": ["footer"],
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    },
    {
      "label": "Homepage - Full Page",
      "url": "http://localhost:1313/",
      "referenceUrl": "https://pikeandwest.com/",
      "delay": 3000,
      "selectors": ["document"],
      "fullPage": true,
      "misMatchThreshold": 1,
      "requireSameDimensions": false
    }
  ],
```

**Step 2: Verify JSON is valid**

Run: `cat backstop.json | jq '.scenarios | length'`
Expected: `7`

---

### Task 0.3: Add BackstopJS NPM Scripts

**Files:**

- Modify: `package.json:9-15`

**Step 1: Add backstop scripts to package.json**

Replace lines 9-15 with:

```json
  "scripts": {
    "test": "echo 'No tests configured'",
    "build": "hugo --gc --minify",
    "serve": "hugo server -D",
    "serve:webflow": "npx serve webflow-export -p 8080",
    "compare:styles": "node scripts/style-comparison/compare-styles.js",
    "backstop:reference": "backstop reference --configPath=backstop.json",
    "backstop:test": "backstop test --configPath=backstop.json",
    "backstop:approve": "backstop approve --configPath=backstop.json",
    "backstop:report": "backstop openReport --configPath=backstop.json"
  },
```

**Step 2: Verify scripts added**

Run: `cat package.json | jq '.scripts | keys'`
Expected: Array containing `backstop:reference`, `backstop:test`, `backstop:approve`, `backstop:report`

---

### Task 0.4: Commit Phase 0 Changes

**Step 1: Stage and commit**

```bash
git add backstop.json package.json
git commit -m "chore(backstop): update viewports to Webflow breakpoints and add section scenarios"
```

---

## Phase 1: Typography and Content Fixes

### Task 1.1: Fix OUR VENUE Heading Font

**Files:**

- Modify: `assets/scss/_gallery.scss:15`

**Step 1: Change font-family variable**

In `assets/scss/_gallery.scss`, change line 15 from:

```scss
    font-family: $font-primary; // Raleway Variablefont Wght
```

To:

```scss
    font-family: $font-display; // Le Mores Collection Serif (Webflow .h1-les-mores-blk)
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes with no SCSS errors

---

### Task 1.2: Fix OUR VENUE Letter Spacing

**Files:**

- Modify: `assets/scss/_gallery.scss:19`

**Step 1: Change letter-spacing value**

In `assets/scss/_gallery.scss`, change line 19 from:

```scss
    letter-spacing: 0.15em; // 4.2px at 28px
```

To:

```scss
    letter-spacing: 0.1em; // Webflow .h1-les-mores-blk value
```

**Step 2: Verify build succeeds**

Run: `hugo --gc`
Expected: Build completes with no SCSS errors

---

### Task 1.3: Fix About Section Heading Case

**Files:**

- Modify: `data/about.yaml:4`

**Step 1: Change heading to uppercase**

In `data/about.yaml`, change line 4 from:

```yaml
heading: "About Us"
```

To:

```yaml
heading: "ABOUT US"
```

**Step 2: Verify data file is valid YAML**

Run: `cat data/about.yaml | head -5`
Expected: `heading: "ABOUT US"` on line 4

---

### Task 1.4: Remove Blog Footer Link

**Files:**

- Modify: `config/_default/menus.toml:27-30`

**Step 1: Delete Blog footer menu entry**

In `config/_default/menus.toml`, delete lines 27-30:

```toml
[[footer]]
  name = "Blog"
  url = "/blog/"
  weight = 2
```

The file should end after line 26.

**Step 2: Verify config is valid TOML**

Run: `hugo config | grep -A5 'footer'`
Expected: Only "Contact Us" footer link shown

---

### Task 1.5: Commit Phase 1 Changes

**Step 1: Stage and commit**

```bash
git add assets/scss/_gallery.scss data/about.yaml config/_default/menus.toml
git commit -m "fix(typography): use Le Mores font for OUR VENUE, fix letter-spacing, uppercase ABOUT US, remove Blog footer link"
```

---

## Phase 2: Visual Regression Verification

### Task 2.1: Start Hugo Dev Server

**Step 1: Start server in background**

Run: `hugo server -D &`
Expected: Server running at <http://localhost:1313/>

**Step 2: Verify server is responding**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/`
Expected: `200`

---

### Task 2.2: Generate Reference Screenshots

**Step 1: Generate Webflow reference screenshots**

Run: `npm run backstop:reference`
Expected: Reference screenshots saved to `backstop_data/bitmaps_reference/`

**Step 2: Verify reference images created**

Run: `ls backstop_data/bitmaps_reference/ | wc -l`
Expected: At least 28 images (7 scenarios x 4 viewports)

---

### Task 2.3: Run Visual Comparison Test

**Step 1: Run BackstopJS test**

Run: `npm run backstop:test`
Expected: Test results with mismatch percentages per section

**Step 2: Open report for visual inspection**

Run: `npm run backstop:report`
Expected: Browser opens with visual diff report

---

### Task 2.4: Stop Hugo Server

**Step 1: Stop the background Hugo server**

Run: `pkill -f "hugo server" || true`
Expected: Server process terminated

---

## Phase 3: Address Remaining Issues (If Needed)

Based on Phase 2 BackstopJS results, create additional tasks for sections with >1% mismatch. Common issues to check:

| Section     | Potential Issues                           |
|-------------|--------------------------------------------|
| Hero        | Button spacing, font weights               |
| Gallery     | Slide widths, arrow sizes, track padding   |
| Event Types | Grid gaps, card padding, mobile layout     |
| About       | Grid column gaps, image sizes, CTA spacing |
| CTA Banner  | Background position, text alignment        |
| Footer      | Icon sizes, link spacing, social icons     |

---

## Verification Checklist

- [ ] OUR VENUE heading uses `$font-display` (Le Mores Collection Serif)
- [ ] OUR VENUE letter-spacing is `0.1em`
- [ ] About section heading displays as "ABOUT US"
- [ ] Footer navigation has no Blog link
- [ ] BackstopJS viewports match Webflow: 480, 768, 992, 1280
- [ ] All 7 section scenarios pass with <1% mismatch
- [ ] Changes committed with descriptive messages

---

## Critical Files Reference

| File                         | Line(s) | Change                            |
|------------------------------|---------|-----------------------------------|
| `assets/scss/_gallery.scss`  | 15      | `$font-primary` → `$font-display` |
| `assets/scss/_gallery.scss`  | 19      | `0.15em` → `0.1em`                |
| `data/about.yaml`            | 4       | `"About Us"` → `"ABOUT US"`       |
| `config/_default/menus.toml` | 27-30   | Delete Blog footer entry          |
| `backstop.json`              | 4-18    | Update viewports                  |
| `backstop.json`              | 20-61   | Add section-level scenarios       |
| `package.json`               | 9-15    | Add backstop npm scripts          |
