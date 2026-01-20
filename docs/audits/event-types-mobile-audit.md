# Event Types Section - Mobile Audit

**Date:** 2026-01-20
**Viewport:** 375px (mobile portrait)
**Section:** "The Perfect Place for Your Next..." (dark gray background with icons)

---

## 1. Current State Analysis

### Visual Observations from Screenshots

**Screenshot 1: audit-event-types-mobile.png (Header Area)**

- Section starts immediately after venue gallery with no gap
- Large dark gray background (#434345) with cream text
- Heading "THE PERFECT PLACE FOR YOUR NEXT..." is multiline and centered
- Excessive vertical space above the heading (appears to be ~80-100px of empty space)
- The section feels vertically oversized for mobile

**Screenshot 2: audit-event-icons-grid-mobile.png (Icon Grid)**

- Icons arranged in 2x3 grid (2 columns, 3 rows)
- Icon labels visible: WEDDING, PRIVATE PARTY, BIRTHDAY, DANCE (partial third column visible)
- Icons are cream/white colored, appear to be ~50px wide
- Spacing between icon rows feels reasonable
- "CONTACT US" CTA button positioned below grid
- Button has cream outline, matches design system
- Excessive vertical space between grid and button (~60-80px)
- Excessive space below button before section ends

---

## 2. Webflow Reference Values

### Base Styles (Desktop)

```css
/* .event-wrap - Main section container */
.event-wrap {
  background-color: #434345;
  height: 50vh;
  max-height: 50vh;
  z-index: 2;
}

/* .event-wrap-container - Inner flex container */
.event-wrap-container {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
  display: flex;
}

/* .section-header-h2.drk-bkgrnd - Heading */
.section-header-h2.drk-bkgrnd {
  color: #fff7e1;
  letter-spacing: .15em;
  text-transform: uppercase;
  font-family: Raleway, sans-serif;
  font-size: 28px;
  font-weight: 300;
}

/* .event-div-block-2.mobile - Grid container */
.event-div-block-2.mobile {
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; /* 6 columns desktop */
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: grid;
}

/* .image.event-wrap - Icon images */
.image.event-wrap {
  width: 50px;
  height: auto;
}

/* .heading-3.events - Icon labels */
.heading-3.events {
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: .1em;
  line-height: 1.15em;
}

/* .button-1-pw-cream.outline.event - CTA button */
.button-1-pw-cream.outline.event {
  margin-top: 0;
}
```

### Mobile Landscape (max-width: 767px)

```css
.event-wrap-container {
  height: 75vh;
  max-height: 75vh;
}

.section-header-h2.drk-bkgrnd.mobile {
  font-size: 22px;
  line-height: 1.5em;
}

.event-div-block-2.mobile {
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr; /* 3 columns, 2 rows */
}

.heading-3.events.mobile {
  font-size: 13px;
}
```

### Mobile Portrait (max-width: 479px)

```css
.event-wrap {
  flex-direction: column;
  justify-content: flex-start; /* KEY: Changed from center */
  align-items: center;
}

.event-wrap-container {
  height: auto; /* KEY: No fixed height */
  max-height: none;
}

.section-header-h2.drk-bkgrnd.mobile.vertical {
  padding-top: 20px; /* Explicit top padding */
  font-size: 18px;
  line-height: 1.5em;
}

.event-div-block-2.mobile {
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr 1fr; /* 2 columns, 3 rows */
  grid-column-gap: 16px;
  grid-row-gap: 16px;
}
```

---

## 3. Specific Issues Found

### Issue 1: Fixed Height Causes Excessive Padding (Line 6-7, 80-81 in \_events.scss)

**Current Hugo SCSS:**

```scss
.events {
  height: 50vh;           // Line 6
  max-height: 50vh;       // Line 7
  // ...

  @media (max-width: $breakpoint-md) {
    height: 75vh;         // Line 80
    max-height: 75vh;     // Line 81
  }
}
```

**Problem:** Using viewport height units (`vh`) on mobile forces the section to fill a percentage of the screen regardless of content. This creates excessive visual padding. At 375px viewport width with ~667px height, 75vh = ~500px which is far more than needed for the content.

**Webflow behavior at 479px:** Uses `height: auto` and `max-height: none`, allowing content to dictate height.

### Issue 2: Missing 479px Mobile Portrait Breakpoint

**Current Hugo SCSS:** Only has `@media (max-width: $breakpoint-md)` (767px)

**Webflow:** Has distinct styles at:

- 767px (tablet/mobile landscape)
- 479px (mobile portrait)

The Hugo implementation is missing the 479px breakpoint entirely, so it gets tablet styles instead of true mobile styles.

### Issue 3: Heading Font Size Too Large for Mobile Portrait

**Current (767px and below):** `font-size: 22px`
**Webflow at 479px:** `font-size: 18px`

The heading should reduce further at mobile portrait.

### Issue 4: Missing Top Padding on Heading

**Webflow at 479px:** `.section-header-h2.drk-bkgrnd.mobile.vertical { padding-top: 20px; }`
**Current Hugo:** No explicit top padding on heading at mobile

### Issue 5: Grid Layout Inconsistency

**Current Hugo at 767px:**

```scss
grid-template-columns: repeat(3, 1fr);
grid-template-rows: 1fr 1fr;
```

**Webflow at 479px:**

```scss
grid-template-columns: 1fr 1fr; // 2 columns
grid-template-rows: auto auto auto; // 3 rows
```

The Hugo grid is correct at 767px but needs to switch to 2 columns at 479px.

### Issue 6: CTA Button Spacing

**Current Hugo:** `margin-top: $spacing-lg` (24px)
**Webflow:** `margin-top: 0` on `.button-1-pw-cream.outline.event`

The grid already has `margin-bottom: 20px`, so additional margin-top on the button creates compound spacing.

---

## 4. Recommended Changes

### Change 1: Add 479px Mobile Portrait Breakpoint

Add a new media query for true mobile portrait behavior:

```scss
// Mobile portrait responsive (max-width: 479px)
@media (max-width: $breakpoint-sm) {
  height: auto; // Content-driven height
  max-height: none;
  justify-content: flex-start; // Align to top, not center

  .events__heading {
    font-size: 18px;
    padding-top: 20px;
    padding-bottom: 10px;
    margin-bottom: $spacing-lg; // Reduce from $spacing-2xl
  }

  .events__grid {
    grid-template-columns: repeat(2, 1fr); // 2 columns
    grid-template-rows: auto auto auto; // 3 rows
    gap: 16px;
    margin-bottom: $spacing-md; // 16px instead of $spacing-2xl
    padding-left: 20px;
    padding-right: 20px;
  }

  .events__cta {
    margin-top: 0;
    padding-bottom: 30px;
  }
}
```

### Change 2: Reduce Section Padding at 767px

```scss
@media (max-width: $breakpoint-md) {
  height: auto; // Changed from 75vh
  max-height: none; // Changed from 75vh
  padding-top: $spacing-xl; // 32px explicit top padding
  padding-bottom: $spacing-xl; // 32px explicit bottom padding

  .events__heading {
    font-size: 22px;
    line-height: 1.5em;
    margin-bottom: $spacing-lg; // Reduce from $spacing-2xl (48px to 24px)
  }

  .events__grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr 1fr;
    margin-bottom: $spacing-lg; // Reduce from $spacing-2xl
  }
}
```

### Change 3: Reduce Base Bottom Margin on Grid

```scss
&__grid {
  // ...existing styles...
  margin: 0 auto $spacing-lg; // Changed from $spacing-2xl
}
```

### Change 4: Remove Redundant CTA Margin

```scss
&__cta {
  margin-top: 0; // Changed from $spacing-lg
}
```

### Full Recommended \_events.scss Mobile Section

```scss
// Mobile landscape responsive (max-width: 767px)
@media (max-width: $breakpoint-md) {
  height: auto;
  max-height: none;
  padding-top: $spacing-xl;
  padding-bottom: $spacing-xl;

  .events__heading {
    font-size: 22px;
    line-height: 1.5em;
    margin-bottom: $spacing-lg;
  }

  .events__grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr 1fr;
    margin-bottom: $spacing-lg;
  }

  .events__label {
    font-size: 13px;
  }

  .events__cta {
    margin-top: 0;
  }
}

// Mobile portrait responsive (max-width: 479px)
@media (max-width: $breakpoint-sm) {
  padding-top: $spacing-lg; // 24px
  padding-bottom: $spacing-lg; // 24px

  .events__heading {
    font-size: 18px;
    padding-top: 0;
    margin-bottom: $spacing-md;
  }

  .events__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: $spacing-md;
  }

  .events__label {
    font-size: 13px;
  }

  .events__cta {
    padding-bottom: $spacing-md;
  }
}
```

---

## 5. Summary of Changes

| Property                  | Current Value | Recommended Value          | Impact                           |
|---------------------------|---------------|----------------------------|----------------------------------|
| Section height (479px)    | 75vh          | auto                       | Removes excessive vertical space |
| Section padding (479px)   | 0 5%          | 24px top/bottom + 5% sides | Consistent, compact padding      |
| Heading font-size (479px) | 22px          | 18px                       | Better mobile readability        |
| Grid columns (479px)      | 3             | 2                          | More touch-friendly icons        |
| Grid margin-bottom        | 48px          | 16-24px                    | Tighter vertical rhythm          |
| CTA margin-top            | 24px          | 0                          | Removes compound spacing         |

---

## 6. Testing Checklist

After implementing changes, verify:

- [ ] Section height adapts to content at 375px
- [ ] No excessive padding above heading
- [ ] No excessive padding below CTA button
- [ ] Icons display in 2-column grid at 375px
- [ ] Icons display in 3-column grid at 768px
- [ ] Heading readable at 18px on mobile
- [ ] Touch targets (icons) remain accessible (min 44px)
- [ ] Visual regression test passes against Webflow reference
