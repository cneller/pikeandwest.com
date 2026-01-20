# Hero Section Mobile Audit (375px Viewport)

**Date:** 2026-01-20
**Viewport:** 375px (iPhone SE / standard mobile)
**Screenshot:** `.playwright-mcp/audit-hero-mobile.png`

---

## 1. Current State Analysis

### What I Observe

Looking at the mobile screenshot at 375px viewport width:

1. **Hero Height:** The hero section takes up approximately 50% of the viewport height (50vh), which is correct per Webflow specs

2. **Title Text:** "GERMANTOWN'S PREMIER ART GALLERY & VENUE" appears in cream color, uppercase
   - Font appears to be Le Mores Collection Serif
   - Currently at 16px (per `_hero.scss` line 178)
   - Text is centered and legible

3. **Tagline:** "ART AND LIFE. LIFE AND ART. LIFE AS ART." in cream
   - Multi-line, uppercase, centered
   - Currently at 12px (per `_hero.scss` line 224 for tagline)
   - Adequate line height, readable

4. **CTA Button:** "SCHEDULE A TOUR"
   - Cream background (#fff7e1) with dark text
   - Appears to have default 9px 16px padding
   - Font size approximately 16px (base `.btn` size)
   - Touch target may be undersized for mobile (needs 44x44px minimum)

5. **Background Image:** Venue building with centered door/walkway
   - Image positioned using `calc(50% - 80px) 70%` per line 161
   - Good focal point visibility with text overlay

6. **Spacing Issues:**
   - Content padding is only 10px (line 174)
   - Very tight margins overall
   - Title margin-bottom is only 5px (line 180)
   - CTA margin-top is only 10px (line 185)

---

## 2. Webflow Reference Values

### Base Desktop Styles (pikeandwest.webflow.css)

```css
/* Line 1283-1303: .hero-header-section base */
.hero-header-section {
  z-index: 1;
  height: 75vh;
  min-height: 50vh;
  max-height: 81vh;
  display: grid;
  grid-template-rows: 3fr 1fr;
  grid-template-columns: 1fr 1fr;
}

/* Line 1314-1322: .h1-crm-les-mores (title) */
.h1-crm-les-mores {
  color: #fff7e1;
  letter-spacing: .1em;
  margin-top: 40px;
  margin-bottom: 0;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 32px;
  line-height: 1.25em;
}

/* Line 1328-1335: .hero-subheader-1 (tagline) */
.hero-subheader-1 {
  color: #fff7e1;
  letter-spacing: .15em;
  text-transform: uppercase;
  margin-top: 15px;
  font-size: 22px;
  line-height: 1.5;
}

/* Line 1341-1354: .button-1-pw-black (CTA button) */
.button-1-pw-black {
  color: #fff7e1;
  text-align: center;
  letter-spacing: .15em;
  text-transform: uppercase;
  background-color: #434345;
  margin-top: 20px;
  padding: 9px 16px;
  font-family: Raleway Variablefont Wght, sans-serif;
}
```

### 767px Breakpoint (max-width: 767px)

```css
/* Line 3300-3306: .hero-header-section */
.hero-header-section {
  grid-template-rows: .5fr .5fr;
  grid-template-columns: .5fr .5fr;
  height: 50vh;
  min-height: 25vh;
  max-height: 50vh;
}

/* Line 3337-3339: .hero-subheader-1 */
.hero-subheader-1 {
  font-size: 16px;
}

/* Line 3345-3347: .button-1-pw-black */
.button-1-pw-black {
  font-size: 13px;
}

/* Line 3356-3365: .div-block (content wrapper) */
.div-block {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50vh;
  margin-left: 0;
  padding-left: 0;
  display: flex;
}
```

### 479px Breakpoint (max-width: 479px)

```css
/* Line 3696-3705: .hero-header-section */
.hero-header-section {
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  flex-direction: column;
  grid-template-rows: 2fr;
  display: block;
}

/* Line 3720-3725: .h1-crm-les-mores.mobile */
.h1-crm-les-mores.mobile {
  color: var(--pw-black);
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
}

/* Line 3727-3732: .hero-subheader-1 */
.hero-subheader-1 {
  align-self: flex-start;
  max-width: 325px;
  margin-left: 0;
  font-size: 12px;
}

/* Line 3742-3745: .button-1-pw-black */
.button-1-pw-black {
  align-self: center;
  font-size: 11px;
}

/* Line 3751-3754: .button-1-pw-black.mobile.vertical */
.button-1-pw-black.mobile.vertical {
  margin-top: 10px;
  padding: 7px 13px;
}

/* Line 3767-3775: .div-block */
.div-block {
  flex-flow: column wrap;
  place-content: center;
  align-items: center;
  margin-top: 0;
  margin-left: 0;
  padding-left: 0;
  display: flex;
}
```

---

## 3. Specific Issues Found

### Issue 1: Title Font Size Too Small

- **File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`
- **Line:** 178
- **Current:** `font-size: 16px`
- **Webflow Reference:** 16px at 479px, but this is paired with a 18-24px title at 767px
- **Problem:** While 16px matches Webflow's mobile portrait, the visual hierarchy suffers. The title should be the most prominent element.

### Issue 2: Button Touch Target Too Small

- **File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_buttons.scss`
- **Line:** 8
- **Current:** `padding: 9px 16px` (no mobile override)
- **Webflow Reference:** At 479px, uses `padding: 7px 13px` (even smaller!)
- **Problem:** Neither meets the 44x44px minimum touch target for accessibility. With 11px font + 7px padding = ~25px height.

### Issue 3: Insufficient Content Padding

- **File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`
- **Line:** 174
- **Current:** `padding: 10px`
- **Problem:** 10px padding is too tight on mobile. Content feels cramped against edges.

### Issue 4: Tight Vertical Spacing

- **File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`
- **Lines:** 180, 185
- **Current:**
  - `margin-bottom: 5px` on title
  - `margin-top: 10px` on CTA
- **Problem:** Elements feel cramped together. No visual breathing room.

### Issue 5: Tagline Font Size

- **File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`
- **Line:** 224
- **Current:** `font-size: 12px` (via `.tagline` at 479px)
- **Webflow Reference:** 12px at 479px matches
- **Problem:** While it matches Webflow, 12px is at the edge of comfortable mobile readability for decorative text.

### Issue 6: Button Font Size Mismatch

- **File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_buttons.scss`
- **No mobile breakpoint override exists**
- **Current:** 16px (base `.btn` size)
- **Webflow Reference:** 13px at 767px, 11px at 479px
- **Problem:** Button font is significantly larger than Webflow reference. While more readable, it creates inconsistency.

---

## 4. Recommended Changes

### 4.1 Improve Button Touch Target (Priority: High - Accessibility)

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_buttons.scss`

Add mobile-specific styles to ensure minimum 44x44px touch target:

```scss
// Add after line 36 in _buttons.scss
// Mobile touch target optimization
@media (max-width: 767px) {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 20px; // Increased padding for touch
  font-size: 13px; // Match Webflow 767px
}

@media (max-width: 479px) {
  padding: 12px 18px; // Slightly reduced horizontal, maintain vertical
  font-size: 12px; // Compromise between Webflow 11px and readability
}
```

### 4.2 Increase Content Padding (Priority: High - Visual Polish)

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`

Update line 174:

```scss
// Change from:
padding: 10px;

// To:
padding: 20px 16px;
```

### 4.3 Improve Vertical Spacing (Priority: Medium - Visual Hierarchy)

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`

Update the 479px breakpoint (lines 177-186):

```scss
// Current (line 177-186)
&__title {
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 5px;
  text-align: center;
}

&__cta {
  margin-top: 10px;
}

// Recommended
&__title {
  font-size: 18px; // Slightly larger for better hierarchy
  margin-top: 0;
  margin-bottom: 12px; // More breathing room
  text-align: center;
  line-height: 1.3; // Tighter line height for 2-line title
}

&__cta {
  margin-top: 16px; // More visual separation
}
```

### 4.4 Tagline Spacing Adjustment (Priority: Low)

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`

The tagline styles are in a separate `.tagline` class. Consider adding:

```scss
// In .tagline styles, 479px breakpoint
@media (max-width: $breakpoint-sm) {
  font-size: 12px; // Keep matching Webflow
  line-height: 1.6; // Slightly increased for readability
  letter-spacing: 0.12em; // Slightly reduced to prevent overflow
  margin-top: 12px; // Consistent with other spacing
}
```

### 4.5 Complete Recommended 479px Breakpoint (Full Replacement)

Replace lines 152-187 in `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_hero.scss`:

```scss
// ===== BREAKPOINT: 479px (Mobile Portrait) =====
@media (max-width: $breakpoint-sm) {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 50vh;
  min-height: 25vh;
  max-height: 50vh;
  padding-top: 15px;
  background-position: calc(50% - 80px) 70%;

  &__image {
    display: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0;
    padding: 20px 16px; // Increased from 10px
  }

  &__title {
    font-size: 18px; // Increased from 16px for hierarchy
    margin-top: 0;
    margin-bottom: 12px; // Increased from 5px
    text-align: center;
    line-height: 1.3;
  }

  &__cta {
    margin-top: 16px; // Increased from 10px
  }
}
```

---

## 5. Summary of Changes

| Element                   | Current  | Recommended | Rationale                      |
|---------------------------|----------|-------------|--------------------------------|
| Content padding           | 10px     | 20px 16px   | More breathing room on mobile  |
| Title font-size           | 16px     | 18px        | Better visual hierarchy        |
| Title margin-bottom       | 5px      | 12px        | Reduce cramped feeling         |
| CTA margin-top            | 10px     | 16px        | Better visual separation       |
| Button min-height         | none     | 44px        | Accessibility (touch target)   |
| Button padding (mobile)   | 9px 16px | 12px 18px   | Meet touch target requirements |
| Button font-size (mobile) | 16px     | 12-13px     | Closer to Webflow reference    |

---

## 6. Design Philosophy Notes

### What Would Make This More Professional

1. **Consistent Spacing System:** Use 8px increments (8, 16, 24, 32) throughout for visual consistency

2. **Touch-First Design:** All interactive elements should be 44x44px minimum - this is an Apple Human Interface Guideline requirement

3. **Visual Breathing Room:** Mobile screens are small, but cramped layouts feel cheap. Adequate padding signals quality.

4. **Typography Scale:** The jump from 18px title to 12px tagline is steep. Consider 18px / 14px or 16px / 13px ratios.

5. **Contrast Testing:** Cream text on the building image - verify contrast ratio meets WCAG AA (4.5:1 for normal text)

### Webflow vs. Better Mobile UX

Webflow's mobile values (11px button font, 7px padding) prioritize fitting content over accessibility. A luxury venue brand should prioritize:

- Comfortable reading experience
- Confident tap targets
- Elegant spacing

It's acceptable to deviate from Webflow's exact values when those values compromise the user experience.
