# Webflow to Hugo SCSS Audit & Alignment Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Systematically audit each Hugo SCSS file against the Webflow export CSS to achieve pixel-perfect style parity.

**Architecture:** Compare Webflow CSS values section-by-section with Hugo SCSS partials. Update Hugo SCSS to match exact Webflow values while maintaining clean SCSS architecture. Use BackstopJS for visual regression verification after each section.

**Tech Stack:** Hugo (SCSS via Hugo Pipes), BackstopJS for visual regression, Webflow CSS export as reference

**Reference Files:**

- Webflow Source: `webflow-export/css/pikeandwest.webflow.css`
- Hugo SCSS: `assets/scss/*.scss`
- Existing Mapping: `docs/webflow-to-hugo-css-mapping.md`

---

## Task 1: Variables & Design Tokens

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:25-31` (`:root` variables)
- Modify: `assets/scss/_variables.scss`

**Step 1: Extract Webflow CSS variables**

Webflow `:root` variables:

```css
:root {
  --pw-black: #434345;
  --pw-gold: #aa6e0b;
  --pw-cream: #fff7e1;
  --white: white;
  --black: black;
}
```

**Step 2: Verify Hugo variables match**

Check `_variables.scss` contains:

```scss
$color-medium-gray: #434345;  // --pw-black
$color-gold: #aa6e0b;         // --pw-gold
$color-cream: #fff7e1;        // --pw-cream
$color-white: #ffffff;        // --white
$color-black: #000000;        // --black
$color-dark-text: #1a1b1f;    // body color
```

**Step 3: Document any discrepancies**

Update `docs/webflow-to-hugo-css-mapping.md` if any values differ.

**Step 4: Commit if changes made**

```bash
git add assets/scss/_variables.scss docs/webflow-to-hugo-css-mapping.md
git commit -m "fix(styles): align CSS variables with Webflow export"
```

---

## Task 2: Base Typography

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:61-127` (body, h1-h6, p, a)
- Modify: `assets/scss/_base.scss`
- Modify: `assets/scss/_typography.scss`

**Step 1: Compare body styles**

Webflow:

```css
body {
  color: #1a1b1f;
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
}
```

Hugo `_base.scss` should have:

```scss
body {
  font-family: $font-secondary; // Montserrat
  font-size: 16px;              // NOT $font-size-base (1rem)
  font-weight: 400;
  line-height: 28px;            // Fixed px, not relative
  color: $color-dark-text;      // #1a1b1f
}
```

**Step 2: Compare heading styles**

Webflow h1:

```css
h1 {
  color: #434345;
  margin-top: 20px;
  margin-bottom: 15px;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 62px;
}
```

Webflow h2:

```css
h2 {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 50px;
}
```

Webflow h3:

```css
h3 {
  color: #fff7e1;
  letter-spacing: .15em;
  text-transform: uppercase;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 18px;
  font-weight: 300;
  line-height: 46px;
}
```

**Step 3: Update `_typography.scss`**

```scss
h1,
.h1 {
  color: $color-medium-gray;   // #434345
  margin-top: 20px;
  margin-bottom: 15px;
  font-family: $font-display;
  font-size: 36px;
  font-weight: 400;
  line-height: 62px;
}

h2,
.h2 {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: $font-display;
  font-size: 36px;
  font-weight: 400;
  line-height: 50px;
}

h3,
.h3 {
  color: $color-cream;         // #fff7e1
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 10px;
  margin-bottom: 10px;
  font-family: $font-primary;  // Raleway
  font-size: 18px;
  font-weight: 300;
  line-height: 46px;
}
```

**Step 4: Update `_base.scss` heading defaults**

Remove duplicate heading styles from `_base.scss` that conflict with `_typography.scss`. Keep only:

```scss
h1, h2 {
  margin: 0;
  font-family: $font-display;
}

h3, h4, h5, h6 {
  margin: 0;
  font-family: $font-primary;
}
```

**Step 5: Verify link styles**

Webflow:

```css
a {
  color: #1a1b1f;
  text-decoration: underline;
  transition: opacity .2s;
  display: block;
}

a:hover {
  color: #32343a;
}
```

**Note:** Webflow uses `display: block` on all links - this is unusual. Hugo should NOT copy this; it breaks inline links.

**Step 6: Run Hugo build to verify no SCSS errors**

```bash
hugo --gc --minify 2>&1 | head -20
```

**Step 7: Commit**

```bash
git add assets/scss/_base.scss assets/scss/_typography.scss
git commit -m "fix(typography): align h1-h3 and body styles with Webflow"
```

---

## Task 3: Header/Navigation

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:556-637` (navigation classes)
- Modify: `assets/scss/_header.scss`

**Step 1: Document Webflow navigation styles**

Key Webflow classes:

```css
.navigation {
  background-color: #fff;
  max-height: 50px;
  padding: 30px 50px;
  display: flex;
  align-items: center;
}

.navigation-item {
  color: var(--pw-black);      /* #434345 */
  letter-spacing: .1em;
  text-transform: uppercase;
  padding-top: 9px;
  padding-bottom: 9px;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  transition: color .2s;
}

.navigation-item:hover {
  opacity: .9;
  color: var(--pw-gold);       /* #aa6e0b */
}
```

**Step 2: Compare with Hugo `_header.scss`**

Current Hugo has `.header__link` for nav buttons. Need to verify:

- Font size: 12px ✓
- Letter spacing: 0.1rem ✓
- Padding: 0.75rem 1.5625rem (12px 25px)
- Font weight: 500 (not 400)

**Step 3: Update `_header.scss`**

Fix font-weight on nav links:

```scss
&__link {
  font-family: $font-primary;
  font-size: 12px;
  font-weight: 500;            // Changed from 400
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 20px;
  padding: 9px 25px;           // Webflow: 0.75rem = 12px vertical
  // ... rest unchanged
}
```

**Step 4: Run Hugo build**

```bash
hugo --gc --minify 2>&1 | head -20
```

**Step 5: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "fix(header): correct nav link font-weight to 500"
```

---

## Task 4: Hero Section

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:1283-1339` (hero classes)
- Modify: `assets/scss/_hero.scss`

**Step 1: Document Webflow hero styles**

```css
.hero-header-section {
  z-index: 1;
  background-image: url('../images/PW_Header_Update2.jpg');
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  grid-template-rows: 3fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(0, .4fr);
  height: 75vh;
  min-height: 50vh;
  max-height: 81vh;
  display: grid;
  position: relative;
}

.h1-crm-les-mores {
  color: #fff7e1;
  letter-spacing: .1em;
  margin-top: 40px;
  margin-bottom: 0;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 32px;
  line-height: 1.25em;        /* 40px */
}

.hero-subheader-1 {
  color: #fff7e1;
  letter-spacing: .15em;
  text-transform: uppercase;
  margin-top: 15px;
  font-size: 22px;
  line-height: 1.5;           /* 33px */
}

.div-block {
  margin-top: 60px;
  margin-left: auto;
  padding-top: 0;
  padding-left: 60px;
  padding-right: 0;
}
```

**Step 2: Verify Hugo `_hero.scss` matches**

Current Hugo has correct values. Verify:

- Height: 75vh ✓
- Min-height: 50vh ✓
- Max-height: 81vh ✓
- Grid structure matches ✓
- Title: 32px, line-height 40px ✓
- Tagline: 22px, letter-spacing 0.15em ✓

**Step 3: Check tagline font family**

Webflow uses default (inherits Montserrat). Hugo `_hero.scss` has:

```scss
.tagline {
  font-family: $font-secondary; // Montserrat ✓
}
```

**Step 4: Document any fixes needed**

If all values match, document in mapping file. If discrepancies found, update `_hero.scss`.

**Step 5: Commit if changes made**

```bash
git add assets/scss/_hero.scss
git commit -m "fix(hero): align hero section with Webflow export"
```

---

## Task 5: Gallery/Carousel Section

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:1853-1878` (venue slider)
- Modify: `assets/scss/_gallery.scss`

**Step 1: Document Webflow gallery styles**

```css
.our-venue-slider {
  height: 90vh;
  margin-top: 0;
  margin-bottom: 60px;
  padding-top: 20px;
}

.heading-2 {
  letter-spacing: .15em;
  text-transform: uppercase;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.15em;
}
```

**Step 2: Verify gallery heading**

Hugo `_gallery.scss`:

```scss
&__heading {
  font-family: $font-primary;   // Raleway ✓
  font-size: 28px;              // ✓
  font-weight: 400;             // Changed from $font-weight-regular
  line-height: 32.2px;          // Webflow: 1.15em = 32.2px ✓
  letter-spacing: 4.2px;        // Webflow: 0.15em = 4.2px ✓
}
```

**Step 3: Check arrow button sizes**

Webflow arrow (`.gallery17_arrow`):

```css
.gallery17_arrow {
  border-radius: 100%;
  width: 3.5rem;    /* 56px */
  height: 3.5rem;
}
```

Hugo already has 56px. ✓

**Step 4: Document any fixes**

Update `_gallery.scss` if needed.

**Step 5: Commit if changes made**

```bash
git add assets/scss/_gallery.scss
git commit -m "fix(gallery): align gallery section with Webflow"
```

---

## Task 6: Events Section

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:1886-1997` (event-wrap)
- Modify: `assets/scss/_events.scss`

**Step 1: Document Webflow event styles**

```css
.event-wrap {
  background-color: #434345;
  height: 50vh;
  max-height: 50vh;
}

.section-header-h2.drk-bkgrnd {
  color: #fff7e1;
  letter-spacing: .15em;
  text-transform: uppercase;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 28px;
  font-weight: 300;
}

.heading-3.events {
  font-size: 15px;
}

.image.event-wrap {
  width: 50px;
  height: auto;
}
```

**Step 2: Verify Hugo `_events.scss`**

Check:

- Section height: 50vh ✓
- Background: $color-medium-gray (#434345) ✓
- Heading font-weight: 300 ✓
- Event label font-size: 15px ✓
- Icon size: 50px ✓

**Step 3: Update if needed**

Current Hugo appears correct. Verify letter-spacing on heading:

```scss
&__heading {
  letter-spacing: 4.2px;  // 0.15em at 28px
}
```

**Step 4: Commit if changes made**

```bash
git add assets/scss/_events.scss
git commit -m "fix(events): align events section with Webflow"
```

---

## Task 7: About Section

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:1200-1214` (about-grid)
- Modify: `assets/scss/_about.scss`

**Step 1: Document Webflow about styles**

```css
.section.cc-store-home-wrap {
  margin-left: 1.875rem;     /* 30px */
  margin-right: 1.875rem;
  padding-top: 1.25rem;      /* 20px */
}

.about-grid {
  grid-column-gap: 20px;
  grid-row-gap: 30px;
  grid-template: ". ." / 1fr 1fr;
  margin-bottom: 80px;
}

.about-grid.cc-about-2 {
  grid-row-gap: 20px;
  grid-template: ". ." .75fr / 1.25fr 1fr;
  margin-bottom: 40px;
}

.paragraph-light {
  opacity: 0.6;
  color: #434345;
  letter-spacing: 0;
}
```

**Step 2: Verify Hugo `_about.scss`**

Check:

- Margin: 0 30px ✓
- Padding-top: 20px ✓
- Column gap: 20px ✓
- Row gap: 30px ✓
- Margin-bottom first block: 80px ✓
- Margin-bottom second block: 40px ✓
- Paragraph opacity: 0.6 ✓

**Step 3: Commit if changes made**

```bash
git add assets/scss/_about.scss
git commit -m "fix(about): align about section with Webflow"
```

---

## Task 8: CTA Banner Section

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:207-225` (section.cc-cta)
- Reference: `webflow-export/css/pikeandwest.webflow.css:504-513` (cta-heading)
- Modify: `assets/scss/_cta-banner.scss`

**Step 1: Document Webflow CTA styles**

```css
.section.cc-cta {
  background-image: url('../images/PW_Disco_Background_White_Overlay.jpg');
  background-position: 50%;
  background-size: cover;
  height: 50vh;
  margin-top: 1.25rem;       /* 20px */
  padding-left: 5rem;        /* 80px */
  padding-right: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cta-heading {
  color: #434345;
  text-transform: none;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.5em;        /* 54px */
}
```

**Step 2: Verify Hugo `_cta-banner.scss`**

Check:

- Height: 50vh (current uses padding, need to add height)
- Padding: 80px horizontal
- Heading font-size: 36px ✓
- Line-height: 54px ✓
- Color: #434345 ✓
- Text-transform: none ✓

**Step 3: Update `_cta-banner.scss`**

```scss
.cta-banner {
  height: 50vh;                    // Add fixed height
  margin-top: 20px;                // Add margin-top
  padding: 0 80px;                 // Horizontal padding only
  display: flex;
  flex-direction: column;
  justify-content: center;
  // ... rest unchanged
}
```

**Step 4: Commit**

```bash
git add assets/scss/_cta-banner.scss
git commit -m "fix(cta): add height and layout from Webflow"
```

---

## Task 9: Footer Section

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:238-258` (section.footer-wrap)
- Reference: `webflow-export/css/pikeandwest.webflow.css:1440-1494` (footer elements)
- Modify: `assets/scss/_footer.scss`

**Step 1: Document Webflow footer styles**

```css
.section.footer-wrap {
  background-color: #aa6e0b;
  height: 150px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.footer-logo {
  width: 50px;
}

.footer-link {
  color: #fff7e1;
  text-transform: uppercase;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 14px;
}

.footer-copyright {
  color: #fff7e1;
  font-size: 11px;
  margin-top: 10px;
}

.image-2, .image-3 {  /* social icons */
  width: 25px;
  height: 25px;
}
```

**Step 2: Verify Hugo `_footer.scss`**

Check:

- Height: 150px ✓
- Background: $color-gold ✓
- Padding: 20px 0 ✓
- Logo width: 50px (current: height 30px) - **NEEDS FIX**
- Link font-size: 14px ✓
- Copyright font-size: 11px (current: $font-size-sm = 14px) - **NEEDS FIX**
- Social icons: 25px ✓

**Step 3: Update `_footer.scss`**

```scss
&__logo {
  width: 50px;                 // Changed from height: 30px
  height: auto;

  img {
    width: 100%;
    height: auto;
  }
}

&__copyright {
  font-size: 11px;             // Changed from $font-size-sm (14px)
  color: $color-cream;
  margin-top: 10px;            // Add margin-top
}
```

**Step 4: Commit**

```bash
git add assets/scss/_footer.scss
git commit -m "fix(footer): correct logo width and copyright font-size"
```

---

## Task 10: Buttons

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:342-420` (button classes)
- Reference: `webflow-export/css/pikeandwest.webflow.css:1341-1376` (button-1-pw-black)
- Reference: `webflow-export/css/pikeandwest.webflow.css:1496-1521` (button-1-pw-cream)
- Modify: `assets/scss/_buttons.scss`

**Step 1: Document Webflow button styles**

```css
.button-1-pw-black {
  color: #fff7e1;
  letter-spacing: .15em;
  text-transform: uppercase;
  background-color: #434345;
  margin-top: 20px;
  padding: 9px 16px;
  font-family: Raleway Variablefont Wght, sans-serif;
  transition: background-color .2s, color .2s;
}

.button-1-pw-black:hover {
  color: var(--pw-cream);
}

.button-1-pw-black:active {
  background-color: var(--pw-cream);
  color: var(--pw-black);
}

.button-1-pw-cream {
  color: #434345;
  letter-spacing: .15em;
  text-transform: uppercase;
  background-color: #fff7e1;
  margin-top: 20px;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 16px;
}

.button-1-pw-cream.outline {
  color: #fff7e1;
  background-color: transparent;
  border: 1.5px solid #fff7e1;
}
```

**Step 2: Verify Hugo `_buttons.scss`**

Current Hugo appears to match. Verify:

- Padding: 9px 16px ✓
- Letter-spacing: 0.15em ✓
- Font-size: 16px ✓
- Transitions ✓
- Hover/active states ✓

**Step 3: Commit if changes made**

```bash
git add assets/scss/_buttons.scss
git commit -m "fix(buttons): align button styles with Webflow"
```

---

## Task 11: Responsive Breakpoints

**Files:**

- Reference: `webflow-export/css/pikeandwest.webflow.css:2648-3300` (media queries)
- Modify: `assets/scss/_variables.scss`
- Modify: Various component SCSS files

**Step 1: Document Webflow breakpoints**

```css
@media screen and (min-width: 1280px) { /* Large desktop */ }
@media screen and (min-width: 1920px) { /* Extra large */ }
@media screen and (max-width: 991px)  { /* Tablet */ }
@media screen and (max-width: 767px)  { /* Mobile landscape */ }
@media screen and (max-width: 479px)  { /* Mobile portrait */ }
```

**Step 2: Verify Hugo breakpoints**

Current Hugo `_variables.scss`:

```scss
$breakpoint-sm: 480px;   // Mobile portrait (matches 479px)
$breakpoint-md: 768px;   // Mobile landscape (matches 767px)
$breakpoint-lg: 992px;   // Tablet (matches 991px)
$breakpoint-xl: 1200px;  // Large desktop
```

These are correct (off-by-one is standard for min-width vs max-width).

**Step 3: Check key responsive overrides**

Tablet (991px):

- Navigation min-height: 4rem (64px)
- Hero grid changes

Mobile (479px):

- Hero height: 50vh
- Section margins: 15px

**Step 4: Update responsive styles if needed**

Most responsive styles are already in component files. Verify each component's media queries match Webflow.

**Step 5: Commit**

```bash
git add assets/scss/*.scss
git commit -m "fix(responsive): verify breakpoints match Webflow"
```

---

## Task 12: Visual Regression Verification

**Files:**

- Modify: `backstop.json` (if needed)

**Step 1: Run BackstopJS reference capture**

```bash
npx backstopjs reference --config=backstop.json
```

**Step 2: Run Hugo dev server**

```bash
hugo server -D &
```

**Step 3: Run BackstopJS test**

```bash
npx backstopjs test --config=backstop.json
```

**Step 4: Review visual diffs**

Open BackstopJS report and verify Hugo matches Webflow reference.

**Step 5: Document remaining discrepancies**

Update `docs/webflow-to-hugo-css-mapping.md` with any remaining issues found.

**Step 6: Commit**

```bash
git add docs/webflow-to-hugo-css-mapping.md backstop.json
git commit -m "docs: update CSS mapping with visual regression findings"
```

---

## Task 13: Final Build Verification

**Step 1: Clean build**

```bash
rm -rf public/ && hugo --gc --minify
```

**Step 2: Check for SCSS errors**

```bash
hugo 2>&1 | grep -i error
```

**Step 3: Verify CSS output size**

```bash
ls -lh public/css/
```

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(styles): complete Webflow to Hugo style alignment"
```

---

## Summary Checklist

| Section    | File                             | Status  |
|------------|----------------------------------|---------|
| Variables  | `_variables.scss`                | Pending |
| Typography | `_typography.scss`, `_base.scss` | Pending |
| Header     | `_header.scss`                   | Pending |
| Hero       | `_hero.scss`                     | Pending |
| Gallery    | `_gallery.scss`                  | Pending |
| Events     | `_events.scss`                   | Pending |
| About      | `_about.scss`                    | Pending |
| CTA Banner | `_cta-banner.scss`               | Pending |
| Footer     | `_footer.scss`                   | Pending |
| Buttons    | `_buttons.scss`                  | Pending |
| Responsive | Multiple                         | Pending |
| Visual QA  | BackstopJS                       | Pending |
