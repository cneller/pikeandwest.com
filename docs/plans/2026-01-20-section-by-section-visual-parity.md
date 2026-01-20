# Section-by-Section Visual Parity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Systematically compare each homepage section between pikeandwest.com (Webflow) and localhost Hugo site at all breakpoints, identify differences, and fix them.

**Architecture:** For each section, use Playwright to navigate and screenshot both sites at 4 breakpoints. Compare screenshots visually, document differences (fonts, spacing, colors, sizing), then fix SCSS/HTML. Refer to `webflow-export/css/pikeandwest.webflow.css` for exact values.

**Tech Stack:** Playwright MCP, Hugo, SCSS, Webflow CSS reference

---

## Breakpoints Reference

| Name             | Width  | Webflow Query    |
|------------------|--------|------------------|
| Desktop          | 1440px | default          |
| Tablet           | 991px  | max-width: 991px |
| Mobile Landscape | 767px  | max-width: 767px |
| Mobile Portrait  | 479px  | max-width: 479px |

## Sections Reference

| # | Section    | Hugo Partial         | SCSS File          | Webflow Class                 |
|---|------------|----------------------|--------------------|-------------------------------|
| 1 | Header     | `header.html`        | `_header.scss`     | `.navbar1_component`          |
| 2 | Hero       | `hero.html`          | `_hero.scss`       | `.hero-header-section`        |
| 3 | Our Venue  | `venue-gallery.html` | `_gallery.scss`    | `.section_gallery17`          |
| 4 | Events     | `event-types.html`   | `_events.scss`     | `.event-wrap`                 |
| 5 | About      | `about.html`         | `_about.scss`      | `.section.cc-store-home-wrap` |
| 6 | CTA Banner | `cta-banner.html`    | `_cta-banner.scss` | `.section.cc-cta`             |
| 7 | Footer     | `footer.html`        | `_footer.scss`     | `.section.footer-wrap`        |

---

### Task 1: Setup - Start Hugo Server

**Step 1: Start Hugo dev server in background**

```bash
hugo server -D --port 1313 &
```

**Step 2: Verify server is running**

```bash
curl -s http://localhost:1313 | head -5
```

Expected: HTML output from Hugo site.

---

### Task 2: Header Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.navbar1`)
- Modify: `assets/scss/_header.scss`

**Step 1: Screenshot Webflow header at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Resize to 1440x900, screenshot header element
3. Resize to 991x900, screenshot header
4. Resize to 767x900, screenshot header
5. Resize to 479x900, screenshot header

**Step 2: Screenshot Hugo header at all breakpoints**

Using Playwright MCP:

1. Navigate to `http://localhost:1313`
2. Resize to 1440x900, screenshot header element
3. Resize to 991x900, screenshot header
4. Resize to 767x900, screenshot header
5. Resize to 479x900, screenshot header

**Step 3: Compare and document differences**

For each breakpoint, check:

- Logo size and position
- Navigation link fonts (family, size, weight, spacing)
- Button styling (color, padding, border)
- Hamburger menu appearance (mobile)
- Overall height and padding

**Step 4: Fix identified differences in `_header.scss`**

Reference Webflow CSS for exact values.

**Step 5: Verify fix**

Re-screenshot Hugo header and compare.

**Step 6: Commit**

```bash
git add assets/scss/_header.scss layouts/partials/header.html
git commit -m "fix(header): match Webflow header styling at all breakpoints"
```

---

### Task 3: Hero Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.hero-header-section`, `.h1-crm-les-mores`)
- Modify: `assets/scss/_hero.scss`

**Step 1: Screenshot Webflow hero at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Scroll to top (hero visible)
3. At each breakpoint (1440, 991, 767, 479), take full viewport screenshot

**Step 2: Screenshot Hugo hero at all breakpoints**

Same process at `http://localhost:1313`

**Step 3: Compare and document differences**

Check:

- Background image positioning
- Title font (Le Mores) - family, size, weight, letter-spacing
- Tagline font (Montserrat) - family, size, weight
- CTA button styling
- Content positioning (left vs center on mobile)
- Overall section height

**Step 4: Fix identified differences in `_hero.scss`**

**Step 5: Verify fix**

**Step 6: Commit**

```bash
git add assets/scss/_hero.scss
git commit -m "fix(hero): match Webflow hero styling at all breakpoints"
```

---

### Task 4: Our Venue (Gallery) Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.gallery17`, `.h1-les-mores-blk`)
- Modify: `assets/scss/_gallery.scss`

**Step 1: Screenshot Webflow gallery at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Scroll to "OUR VENUE" section
3. At each breakpoint, screenshot the section

**Step 2: Screenshot Hugo gallery at all breakpoints**

Same process at `http://localhost:1313`

**Step 3: Compare and document differences**

Check:

- "OUR VENUE" heading font (Le Mores) - size, weight, letter-spacing, color
- Section padding top/bottom
- Slider/carousel appearance
- Arrow button styling
- Dot navigation styling
- Image aspect ratio and sizing

**Step 4: Fix identified differences in `_gallery.scss`**

**Step 5: Verify fix**

**Step 6: Commit**

```bash
git add assets/scss/_gallery.scss
git commit -m "fix(gallery): match Webflow Our Venue section styling"
```

---

### Task 5: Events Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.event-wrap`, `.section-header-h2`)
- Modify: `assets/scss/_events.scss`

**Step 1: Screenshot Webflow events at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Scroll to events section ("The perfect place for your next...")
3. At each breakpoint, screenshot the section

**Step 2: Screenshot Hugo events at all breakpoints**

Same process at `http://localhost:1313`

**Step 3: Compare and document differences**

Check:

- Section heading font - family, size, weight, color
- Background color (#434345)
- Icon grid layout (6 columns desktop, 3 mobile)
- Icon sizing
- Event type labels - font family, size, letter-spacing
- CTA button styling
- Section height (50vh desktop, 75vh mobile)

**Step 4: Fix identified differences in `_events.scss`**

**Step 5: Verify fix**

**Step 6: Commit**

```bash
git add assets/scss/_events.scss
git commit -m "fix(events): match Webflow events section styling"
```

---

### Task 6: About Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.cc-store-home-wrap`, `.heading-jumbo-small`, `.paragraph-light`)
- Modify: `assets/scss/_about.scss`, `assets/scss/_typography.scss`

**Step 1: Screenshot Webflow about at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Scroll to "ABOUT US" section
3. At each breakpoint, screenshot the full about section (includes both blocks)

**Step 2: Screenshot Hugo about at all breakpoints**

Same process at `http://localhost:1313`

**Step 3: Compare and document differences**

Check:

- "ABOUT US" main heading - font family, size, weight, letter-spacing
- "Who we are" subtitle - **CRITICAL: user noted wrong font** - should be specific font
- "What we do" subtitle - same font as "Who we are"
- Paragraph text - font family (Montserrat), size, line-height, opacity
- Image sizing and aspect ratio
- Grid layout (2 columns desktop, 1 column mobile)
- Block spacing (margin-bottom between blocks)
- CTA button styling

**Step 4: Fix identified differences**

Pay special attention to "Who we are" heading font - check Webflow CSS for `.heading-jumbo-small` or similar class.

**Step 5: Verify fix**

**Step 6: Commit**

```bash
git add assets/scss/_about.scss assets/scss/_typography.scss
git commit -m "fix(about): match Webflow about section styling, correct Who We Are font"
```

---

### Task 7: CTA Banner Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.cc-cta`, `.cta-heading`)
- Modify: `assets/scss/_cta-banner.scss`

**Step 1: Screenshot Webflow CTA at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Scroll to "Let's celebrate!" CTA section
3. At each breakpoint, screenshot the section

**Step 2: Screenshot Hugo CTA at all breakpoints**

Same process at `http://localhost:1313`

**Step 3: Compare and document differences**

Check:

- Background image positioning
- "Let's celebrate!" heading - font (Le Mores), size, color
- Subtext - font family, size
- CTA button styling
- Section height (50vh)
- Content centering

**Step 4: Fix identified differences in `_cta-banner.scss`**

**Step 5: Verify fix**

**Step 6: Commit**

```bash
git add assets/scss/_cta-banner.scss
git commit -m "fix(cta): match Webflow CTA banner styling"
```

---

### Task 8: Footer Section Comparison

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css` (search `.footer-wrap`, `.footer-link`)
- Modify: `assets/scss/_footer.scss`

**Step 1: Screenshot Webflow footer at all breakpoints**

Using Playwright MCP:

1. Navigate to `https://pikeandwest.com`
2. Scroll to footer
3. At each breakpoint, screenshot the footer

**Step 2: Screenshot Hugo footer at all breakpoints**

Same process at `http://localhost:1313`

**Step 3: Compare and document differences**

Check:

- Background color (#aa6e0b gold)
- Logo sizing
- Link fonts - family, size, letter-spacing, color
- Social icon sizing
- Copyright text - font size, color
- Overall height (150px desktop, auto mobile)
- Element spacing and alignment

**Step 4: Fix identified differences in `_footer.scss`**

**Step 5: Verify fix**

**Step 6: Commit**

```bash
git add assets/scss/_footer.scss
git commit -m "fix(footer): match Webflow footer styling"
```

---

### Task 9: Final Full-Page Comparison

**Step 1: Take full-page screenshots of both sites**

At desktop (1440px) and mobile (479px):

- Screenshot full page of pikeandwest.com
- Screenshot full page of localhost:1313

**Step 2: Visual scroll-through comparison**

Manually scroll through both sites side-by-side checking:

- Vertical rhythm consistency
- Font consistency throughout
- Color consistency
- Spacing consistency

**Step 3: Document any remaining issues**

Create list of any remaining differences for follow-up.

**Step 4: Final commit**

```bash
git add .
git commit -m "fix(visual-parity): complete section-by-section Webflow matching"
```

---

## Verification Checklist

For each section, verify:

- [ ] Fonts match (family, size, weight, letter-spacing)
- [ ] Colors match (text, background, accents)
- [ ] Spacing matches (padding, margin, gaps)
- [ ] Layout matches at all 4 breakpoints
- [ ] Interactive states match (hover, focus)

## Key Webflow CSS Classes Reference

| Element          | Webflow Class               | Key Properties                  |
|------------------|-----------------------------|---------------------------------|
| Display headings | `.h1-les-mores-blk`         | Le Mores, letter-spacing: 0.1em |
| Section headings | `.heading-jumbo-small`      | Check font-family               |
| Body text        | `.paragraph-light`          | Montserrat, opacity: 0.6        |
| Buttons          | `.btn-dark`, `.btn-outline` | Raleway, uppercase              |
| Gold color       | `--pw-gold`                 | #aa6e0b                         |
| Cream color      | `--pw-cream`                | #fff7e1                         |
| Black color      | `--pw-black`                | #434345                         |
