# Webflow to Hugo CSS Mapping

Reference document for migrating Pike & West from Webflow to Hugo. All values extracted from the Webflow export (`pikeandwest.webflow.css`).

## CSS Variables (Design Tokens)

### Webflow `:root` Variables

```css
--pw-black: #434345;
--pw-gold: #aa6e0b;
--pw-cream: #fff7e1;
--white: white;
--black: black;
```

### Hugo SCSS Mapping (`_variables.scss`)

| Webflow Variable | Webflow Value | Hugo Variable        | Hugo Value | Status |
|------------------|---------------|----------------------|------------|--------|
| `--pw-black`     | `#434345`     | `$color-medium-gray` | `#434345`  | Match  |
| `--pw-gold`      | `#aa6e0b`     | `$color-gold`        | `#aa6e0b`  | Match  |
| `--pw-cream`     | `#fff7e1`     | `$color-cream`       | `#fff7e1`  | Match  |
| `--white`        | `white`       | `$color-white`       | `#ffffff`  | Match  |
| `--black`        | `black`       | `$color-black`       | `#000000`  | Match  |
| (body text)      | `#1a1b1f`     | `$color-dark-text`   | `#1a1b1f`  | Match  |

---

## Typography

### Font Families

| Purpose          | Webflow Font                | Hugo Font         | File                                         |
|------------------|-----------------------------|-------------------|----------------------------------------------|
| Display (h1, h2) | `Le Mores Collection Serif` | `$font-display`   | `static/fonts/Le-Mores-Collection-Serif.ttf` |
| UI/Buttons/Nav   | `Raleway Variablefont Wght` | `$font-primary`   | `static/fonts/Raleway-VariableFont_wght.ttf` |
| Body             | `Montserrat`                | `$font-secondary` | Google Fonts CDN                             |

### Base Typography Styles

| Element     | Webflow                  | Hugo SCSS                |
|-------------|--------------------------|--------------------------|
| **body**    |                          |                          |
| font-family | `Montserrat, sans-serif` | `$font-secondary`        |
| font-size   | `16px`                   | `$font-size-base` (1rem) |
| font-weight | `400`                    | `$font-weight-regular`   |
| line-height | `28px`                   | `1.6` (25.6px)           |
| color       | `#1a1b1f`                | `$color-text`            |

### Heading Styles

| Element | Property       | Webflow                     | Hugo                                 |
|---------|----------------|-----------------------------|--------------------------------------|
| **h1**  | font-family    | `Le Mores Collection Serif` | `$font-display`                      |
|         | font-size      | `36px`                      | `$font-size-3xl` (40px) - **ADJUST** |
|         | font-weight    | `400`                       | `$font-weight-regular`               |
|         | line-height    | `62px`                      | `1.4`                                |
|         | letter-spacing | -                           | `0.1em`                              |
| **h2**  | font-family    | `Le Mores Collection Serif` | `$font-display`                      |
|         | font-size      | `36px`                      | `$font-size-2xl` (32px) - **ADJUST** |
|         | font-weight    | `400`                       | `$font-weight-regular`               |
|         | line-height    | `50px`                      | `1.4`                                |
|         | text-align     | `center`                    | -                                    |
| **h3**  | font-family    | `Raleway Variablefont Wght` | `$font-primary`                      |
|         | font-size      | `18px`                      | `$font-size-xl` (24px) - **ADJUST**  |
|         | font-weight    | `300`                       | `$font-weight-light`                 |
|         | line-height    | `46px`                      | `1.2`                                |
|         | letter-spacing | `0.15em`                    | `0.15em`                             |
|         | text-transform | `uppercase`                 | `uppercase`                          |

---

## Layout & Spacing

### Container Widths

| Webflow Class                        | Value            | Hugo Variable          |
|--------------------------------------|------------------|------------------------|
| `.w-layout-blockcontainer` max-width | `940px`          | -                      |
| `.container-large` max-width         | `80rem` (1280px) | `$container-max-width` |

### Global Padding

| Webflow Class            | Value                                           | Hugo                 |
|--------------------------|-------------------------------------------------|----------------------|
| `.padding-global`        | `padding-left: 5%; padding-right: 5%`           | `$container-padding` |
| `.padding-section-large` | `padding-top: 1.75rem; padding-bottom: 1.75rem` | -                    |

### Breakpoints

| Webflow | Value              | Hugo Variable           |
|---------|--------------------|-------------------------|
| Medium  | `max-width: 991px` | `$breakpoint-lg: 992px` |
| Small   | `max-width: 767px` | `$breakpoint-md: 768px` |
| XSmall  | `max-width: 479px` | `$breakpoint-sm: 480px` |

---

## Component Mapping

### Navbar (`.navbar1_component`)

```scss
// Webflow
.navbar1_component {
  background-color: white;  // CSS variable resolves to white
  min-height: 4.5rem;       // 72px
  padding-left: 5%;
  padding-right: 5%;
  border-bottom: 1px solid [border-color];
  align-items: center;
  display: flex;
}

.navbar1_logo {
  max-width: 10.9375rem;    // 175px
}
```

**Hugo file:** `_header.scss`

| Property   | Webflow         | Hugo                   |
|------------|-----------------|------------------------|
| background | white           | **CHECK**              |
| height     | `4.5rem` (72px) | `$header-height: 72px` |
| padding-x  | `5%`            | -                      |

### Navbar Buttons (`.navbar-button-gold`)

```scss
// Webflow
.navbar-button-gold {
  background-color: var(--pw-gold);  // #aa6e0b
  border: 1px solid var(--pw-gold);
  color: white;
  font-family: raleway, sans-serif;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  padding: 0.75rem 1.5625rem;        // 12px 25px
}

.navbar-button-gold.is-secondary {
  background-color: white;
  color: var(--pw-gold);
  border: 1px solid var(--pw-gold);
}
```

**Hugo file:** `_buttons.scss`

---

### Hero Section (`.hero-header-section`)

```scss
// Webflow
.hero-header-section {
  height: 75vh;
  min-height: 50vh;
  max-height: 81vh;
  background-image: url('../images/PW_Header_Update2.jpg');
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}

// Mobile variant
.hero-header-section.mobile {
  grid-template-rows: 1fr 1px;
}
```

**Hugo file:** `_hero.scss`

| Property   | Webflow | Hugo                                        |
|------------|---------|---------------------------------------------|
| height     | `75vh`  | **CHECK**                                   |
| min-height | `50vh`  | -                                           |
| max-height | `81vh`  | **CHECK** - may be causing "too tall" issue |

---

### Gallery Section (`.section_gallery17`)

```scss
// Webflow
.section_gallery17 {
  overflow: hidden;
}

.gallery17_image {
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.gallery17_mask {
  width: 50%;
  overflow: visible;
}

.gallery17_slider {
  padding-bottom: 4rem;
}

.gallery17_slide {
  padding-left: 1rem;
  padding-right: 1rem;
}

.gallery17_arrow {
  border-radius: 100%;
  width: 3.5rem;
  height: 3.5rem;
}
```

**Hugo file:** `_gallery.scss`

---

### Events Section (`.event-wrap`)

```scss
// Webflow
.event-wrap {
  background-color: #434345;
  height: 50vh;
  max-height: 50vh;
}

.section-header-h2.drk-bkgrnd {
  color: #fff7e1;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.heading-3.events {
  font-family: Le Mores Collection Serif, sans-serif;
  // Event icons use Raleway for labels
}

.image.event-wrap {
  width: 50px;
  height: auto;
}
```

**Hugo file:** `_events.scss`

---

### About Section (`.section.cc-store-home-wrap`)

```scss
// Webflow
.section.cc-store-home-wrap {
  margin-left: 1.875rem;    // 30px
  margin-right: 1.875rem;
  padding-top: 1.25rem;     // 20px
}

.about-grid {
  grid-template: ". ." / 1fr 1fr;
  grid-column-gap: 20px;
  grid-row-gap: 30px;
  margin-bottom: 80px;
}

.about-grid.cc-about-2 {
  grid-template: ". ." 0.75fr / 1.25fr 1fr;
  margin-bottom: 40px;
}

.paragraph-light {
  opacity: 0.6;
  color: #434345;
  letter-spacing: 0;
}

.heading-2 {
  font-family: Le Mores Collection Serif, sans-serif;
  // "Who we are", "What we do"
}
```

**Hugo file:** `_about.scss`

---

### CTA Banner

```scss
// Webflow
.cta-heading {
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.5em;
  color: #434345;
  text-transform: none;  // NOT uppercase
}
```

**Hugo file:** `_cta-banner.scss`

---

### Footer (`.section.footer-wrap`)

```scss
// Webflow
.section.footer-wrap {
  background-color: #aa6e0b;  // Gold
  height: 150px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.footer-logo {
  // Vanilla/cream logomark
}

.footer-copyright {
  color: #fff7e1;
}

.image-2, .image-3 {  // Social icons
  width: 25px;
  height: 25px;
}
```

**Hugo file:** `_footer.scss`

---

### Buttons

#### Primary Button (`.button-1-pw-black`)

```scss
.button-1-pw-black {
  background-color: #434345;
  color: #fff7e1;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 16px;        // NOT in Webflow, check
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 9px 16px;
  margin-top: 20px;
  transition: background-color 0.2s, color 0.2s;
}

.button-1-pw-black:hover {
  color: var(--pw-cream);
}

.button-1-pw-black:active {
  background-color: var(--pw-cream);
  color: var(--pw-black);
}
```

#### Secondary Button (`.button-1-pw-cream`)

```scss
.button-1-pw-cream {
  background-color: #fff7e1;
  color: #434345;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 16px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: 20px;
}

.button-1-pw-cream.outline {
  background-color: transparent;
  color: #fff7e1;
  border: 1.5px solid #fff7e1;
}
```

**Hugo file:** `_buttons.scss`

---

## Quick Reference: Values to Check/Fix

### Immediate Issues Identified

1. **Navbar background** - Should be white, verify Hugo implementation
2. **Hero max-height** - `81vh` cap may need to match
3. **h2 font** - "OUR VENUE" should use Le Mores (now fixed with font import)
4. **Font sizes** - Several slight differences in px values

### Font Size Comparison

| Element     | Webflow | Current Hugo            | Suggested Fix  |
|-------------|---------|-------------------------|----------------|
| h1          | 36px    | 40px (`$font-size-3xl`) | Change to 36px |
| h2          | 36px    | 32px (`$font-size-2xl`) | Change to 36px |
| h3          | 18px    | 24px (`$font-size-xl`)  | Change to 18px |
| nav buttons | 12px    | ?                       | Set to 12px    |
| body        | 16px    | 16px                    | Match          |

---

## Responsive Breakpoint Overrides

Key mobile/tablet changes from Webflow:

```scss
// @media (max-width: 991px) - Tablet
.navbar1_component {
  min-height: 4rem;  // 64px
}

// @media (max-width: 767px) - Mobile Landscape

// @media (max-width: 479px) - Mobile Portrait
.hero-header-section {
  height: 50vh;
}
```

---

## Files to Update

Based on this mapping, update these Hugo SCSS files:

1. `_variables.scss` - Font sizes, add any missing tokens
2. `_header.scss` - Navbar background white, button sizes
3. `_hero.scss` - Height constraints (75vh, max 81vh)
4. `_typography.scss` - h1/h2/h3 exact sizes
5. `_buttons.scss` - Exact padding, font-size values
6. `_gallery.scss` - Slider dimensions
7. `_events.scss` - Section height, icon sizes
8. `_about.scss` - Grid gaps, paragraph opacity
9. `_footer.scss` - Height, background color

---

## Visual Regression Test Results (2026-01-16)

BackstopJS visual regression testing was run comparing Hugo (localhost:1313) against the live Webflow site (pikeandwest.com).

### Test Summary

| Scenario                 | Viewport | Mismatch % | Status |
|--------------------------|----------|------------|--------|
| Homepage - Hero          | Mobile   | 41.88%     | FAIL   |
| Homepage - Hero          | Tablet   | 44.83%     | FAIL   |
| Homepage - Hero          | Desktop  | 45.15%     | FAIL   |
| Homepage - Full Page     | Mobile   | 41.88%     | FAIL   |
| Homepage - Full Page     | Tablet   | 44.83%     | FAIL   |
| Homepage - Full Page     | Desktop  | 45.15%     | FAIL   |
| Contact Page             | Mobile   | 42.43%     | FAIL   |
| Contact Page             | Tablet   | 28.33%     | FAIL   |
| Contact Page             | Desktop  | 26.14%     | FAIL   |
| Gallery Application Page | Mobile   | 8.33%      | FAIL   |
| Gallery Application Page | Tablet   | 6.35%      | FAIL   |
| Gallery Application Page | Desktop  | 6.46%      | FAIL   |

**Result: 0 Passed / 12 Failed**

### Critical Content Discrepancies (Not CSS Issues)

These are content/template issues, not CSS styling issues:

#### 1. Gallery Section - Missing Content

- **Issue:** Hugo gallery section is missing the "OUR VENUE" heading and Instagram subtext
- **Webflow:** Shows "OUR VENUE" in Le Mores font with "Want to see more? Follow us on Instagram." subtext
- **Hugo:** Empty heading and subtext areas
- **Fix Required:** Update `data/` files or `layouts/partials/venue-gallery.html` to include heading content

#### 2. CTA Banner Section - Missing Content

- **Issue:** Hugo CTA banner at bottom of pages has no content
- **Webflow:** Shows "LET'S CELEBRATE!" heading with disco ball background image and "SCHEDULE A TOUR" button
- **Hugo:** Empty section with no background image, heading, or button
- **Fix Required:** Update homepage content or `layouts/partials/cta-banner.html` to include proper content

#### 3. Contact Page - Missing Embedded Form

- **Issue:** Hugo shows empty cream-colored placeholder where contact form should be
- **Webflow:** Has embedded contact/scheduling form (likely Calendly or similar)
- **Hugo:** Shows empty `#fff7e1` colored box
- **Fix Required:** Add form embed code to `layouts/page/contact.html`

#### 4. About Section - Image Order/Content

- **Issue:** Image arrangement differs between Hugo and Webflow
- **Webflow:** "Who we are" section shows team photo on right, "What we do" shows event photo
- **Hugo:** Similar layout but may have different image assignments
- **Fix Required:** Verify image paths in `data/` files or front matter match Webflow content

### CSS/Styling Discrepancies

#### 1. Gallery Carousel Layout

- **Issue:** Gallery carousel shows different number of visible slides
- **Webflow:** Shows 3+ partial images with offset positioning
- **Hugo:** Shows fewer images, different spacing
- **Fix Required:** Adjust `_gallery.scss` carousel width and slide positioning

#### 2. Footer Layout

- **Issue:** Footer has different vertical arrangement
- **Webflow:** Compact single-row layout with logo, link, social icons
- **Hugo:** Shows copyright text that Webflow version doesn't prominently display
- **Fix Required:** Review `_footer.scss` and `layouts/partials/footer.html` structure

#### 3. Page Height Differences

- **Issue:** Dimension differences detected across all viewports
- **Mobile:** Hugo is 977px taller than Webflow
- **Tablet:** Hugo is 555px shorter than Webflow
- **Desktop:** Nearly same height (9px difference)
- **Fix Required:** Review section heights, especially gallery and about sections

### Dimension Analysis

| Page/Viewport       | Hugo Height | Webflow Height | Difference           |
|---------------------|-------------|----------------|----------------------|
| Homepage Mobile     | +977px      | baseline       | Hugo taller          |
| Homepage Tablet     | -555px      | baseline       | Hugo shorter         |
| Homepage Desktop    | +9px        | baseline       | Nearly equal         |
| Contact Mobile      | +53px       | baseline       | Hugo slightly taller |
| Contact Tablet      | -413px      | baseline       | Hugo shorter         |
| Contact Desktop     | -218px      | baseline       | Hugo shorter         |
| Gallery App Mobile  | -1109px     | baseline       | Hugo much shorter    |
| Gallery App Tablet  | -1021px     | baseline       | Hugo much shorter    |
| Gallery App Desktop | -818px      | baseline       | Hugo shorter         |

### Priority Fixes

1. **HIGH:** Add gallery section heading content ("OUR VENUE")
2. **HIGH:** Add CTA banner content ("LET'S CELEBRATE!" with disco ball background)
3. **HIGH:** Implement contact form embed
4. **MEDIUM:** Fix gallery carousel slide visibility and spacing
5. **MEDIUM:** Align about section image placement
6. **LOW:** Fine-tune footer layout

### Next Steps

1. Update content data files to populate missing section content
2. Add contact form embed (Calendly or custom form)
3. Add CTA banner background image and content
4. Run BackstopJS again after content fixes to isolate pure CSS issues

---

_Document generated from Webflow export on 2025-01-15_
_Visual regression analysis added on 2026-01-16_
