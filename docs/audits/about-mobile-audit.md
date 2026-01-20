# About Section Mobile Audit (375px Viewport)

**Date:** 2026-01-20
**Viewport:** 375px (Mobile Portrait)
**Screenshot Reference:** `.playwright-mcp/audit-about-mobile.png`

---

## 1. Current State Analysis

### Visual Observations from Screenshot

The About section on mobile (375px) displays:

1. **Section Header ("ABOUT US")**: Visible at top but cut off in screenshot
2. **Subsection Header ("WHO WE ARE")**: Displayed in uppercase, centered
3. **Body Text**: Two paragraphs of light gray text, centered alignment
4. **Text Density**: Text appears readable but line spacing feels tight on mobile
5. **No Image Visible**: The associated image is either below the fold or hidden on mobile

### Current Hugo SCSS Values (from `_about.scss`)

| Property                  | Desktop Value   | Mobile 767px | Mobile 479px |
|---------------------------|-----------------|--------------|--------------|
| Section margin-left/right | 30px (1.875rem) | 15px         | 15px         |
| Section padding-top       | 20px (1.25rem)  | 20px         | 20px         |
| Subtitle font-size        | 28px            | 22px         | 15px         |
| Subtitle margin-top       | 0               | 20px         | 15px         |
| Subtitle margin-bottom    | 10px            | 15px         | 10px         |
| Block margin-bottom       | 80px            | -            | -            |
| Block row-gap             | 30px            | 20px then 0  | 0            |
| Text line-height          | 28px            | 28px         | 28px         |
| Text opacity              | 0.6             | 0.6          | 0.6          |

---

## 2. Webflow Reference Values

### Base Styles (Desktop)

```css
/* .section.cc-store-home-wrap - About section wrapper */
.section.cc-store-home-wrap {
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 0;
  margin-left: 1.875rem; /* 30px */
  margin-right: 1.875rem; /* 30px */
  padding-top: 1.25rem; /* 20px */
  display: flex;
}

/* .section-heading - "ABOUT US" */
.section-heading {
  color: #434345;
  text-align: center;
  letter-spacing: 0.1em;
  margin-top: 10px;
  margin-bottom: 20px;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 32px;
  font-weight: 400;
}

/* .heading-2 - "WHO WE ARE" / "WHAT WE DO" */
.heading-2 {
  letter-spacing: 0.15em;
  text-transform: uppercase;
  white-space: nowrap;
  margin-top: 0;
  margin-bottom: 0;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1.15em;
}

/* .heading-2.mobile.vertical - Mobile subsection header */
.heading-2.mobile.vertical {
  margin-bottom: 10px;
}

/* .paragraph-light - Body text */
.paragraph-light {
  opacity: 0.6;
  color: #434345;
  text-align: left;
  letter-spacing: 0;
}

/* .about-grid - Content block layout */
.about-grid {
  grid-column-gap: 20px;
  grid-row-gap: 30px;
  grid-template: ". ." / 1fr 1fr;
  align-items: center;
  margin-bottom: 80px;
}

/* .about-grid.cc-about-2 - Second block variant */
.about-grid.cc-about-2 {
  grid-row-gap: 20px;
  grid-template: ". ." 0.75fr / 1.25fr 1fr;
  margin-bottom: 40px;
}

/* .home-section-wrap - Content area wrapper */
.home-section-wrap {
  flex-flow: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 30px;
  display: flex;
}

/* .button-1-pw-black - CTA button */
.button-1-pw-black {
  opacity: 1;
  color: #fff7e1;
  text-align: center;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background-color: #434345;
  margin-top: 20px;
  padding: 9px 16px;
  font-family: Raleway Variablefont Wght, sans-serif;
  transition: background-color 0.2s, color 0.2s;
}
```

### Tablet Breakpoint (max-width: 991px)

```css
.about-grid {
  grid-row-gap: 20px;
  text-align: center;
  grid-template: "." "." / 1fr;
}

.about-grid.cc-about-2 {
  grid-template-columns: 1fr;
  grid-template-areas: "." ".";
}
```

### Mobile Landscape (max-width: 767px)

```css
.section.cc-home-wrap,
.section.cc-store-home-wrap {
  margin-left: 15px;
  margin-right: 15px;
}

.heading-2.mobile {
  margin-top: 20px;
  margin-bottom: 15px;
  font-size: 22px;
}
```

### Mobile Portrait (max-width: 479px)

```css
.section.cc-store-home-wrap {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;
}

.home-section-wrap {
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
}

.home-section-wrap.mobile.vertical {
  padding-bottom: 30px;
}

.section-heading {
  font-size: 24px;
}

.section-heading.mobile {
  margin-top: 15px;
  margin-bottom: 10px;
}

.heading-2 {
  font-size: 3.25em; /* This is unusual - may be relative to parent */
}

.heading-2.mobile.vertical {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 15px;
}

.paragraph-light {
  font-size: 13px;
  line-height: 1.5em;
}

.about-grid {
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.about-grid.cc-about-2.mobile {
  grid-row-gap: 0px;
}

.button-1-pw-black {
  align-self: center;
  font-size: 11px;
}

.button-1-pw-black.mobile.vertical {
  margin-top: 10px;
  padding: 7px 13px;
}
```

---

## 3. Specific Issues Found

### Issue 1: Body Text Font Size Not Reduced for Mobile

**Location:** `_about.scss` line 74-81

**Current:**

```scss
&__text {
  margin-bottom: $spacing-lg;
  opacity: 0.6;
  color: $color-medium-gray;
  letter-spacing: 0;
  line-height: 28px;
}
```

**Problem:** No responsive adjustment for mobile. Webflow uses `font-size: 13px` and `line-height: 1.5em` at 479px.

---

### Issue 2: Body Text Line Height Too Tall on Mobile

**Location:** `_about.scss` line 80

**Current:** `line-height: 28px` (fixed)

**Problem:** Webflow switches to `line-height: 1.5em` on mobile (479px), which with 13px font equals ~19.5px. Current 28px creates excessive spacing.

---

### Issue 3: Paragraph Text Alignment Not Centered

**Location:** `_about.scss` line 74-81

**Current:** No text-align specified (inherits left)

**Problem:** Webflow uses centered text at tablet/mobile breakpoints via `.about-grid { text-align: center; }` and `.home-section-wrap { align-items: center; }`. While grid applies center, explicit paragraph alignment is missing.

---

### Issue 4: Button Size Not Reduced for Mobile

**Location:** `_buttons.scss` - No mobile adjustments

**Current:** Desktop padding `9px 16px`, font-size not specified for mobile

**Webflow at 479px:**

- `font-size: 11px`
- `padding: 7px 13px` (for `.mobile.vertical` variant)
- `margin-top: 10px`
- `align-self: center`

---

### Issue 5: Content Wrapper Missing Padding Bottom

**Location:** `_about.scss` - No equivalent to `.home-section-wrap.mobile.vertical`

**Problem:** Webflow adds `padding-bottom: 30px` to content wrapper on mobile vertical for proper spacing between blocks.

---

### Issue 6: Section Heading Font Size Not Reduced

**Location:** `_about.scss` line 13-17 (heading not styled for mobile)

**Current:** Section heading uses base styles without mobile reduction.

**Webflow at 479px:** `.section-heading { font-size: 24px; }` (vs desktop 32px)

---

### Issue 7: Block Row Gap Not Zero on Mobile

**Location:** `_about.scss` line 108

**Current at 767px:** `grid-row-gap: 0;`

**Problem:** The 479px breakpoint also needs explicit `grid-row-gap: 0` and `grid-column-gap: 0` to match Webflow.

---

## 4. Recommended Changes

### Change 1: Add Mobile Text Styles

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_about.scss`

Add inside the `@media (max-width: $breakpoint-sm)` block (after line 130):

```scss
// Mobile portrait responsive (max-width: 479px)
@media (max-width: $breakpoint-sm) {
  // ... existing styles ...

  .about__text {
    font-size: 13px;
    line-height: 1.5em; // ~19.5px at 13px font
    text-align: center;

    p {
      margin-bottom: 1em; // Proportional paragraph spacing
    }
  }
}
```

---

### Change 2: Add Mobile Button Styles

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_buttons.scss`

Add at end of file (before closing):

```scss
// Mobile portrait button adjustments (max-width: 479px)
@media (max-width: 479px) {
  .btn {
    font-size: 11px;
    padding: 7px 13px;
    margin-top: 10px;
    align-self: center;
  }
}
```

---

### Change 3: Add Content Wrapper Bottom Padding

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_about.scss`

Add to the 479px media query:

```scss
.about__content {
  padding-bottom: 30px;
}
```

---

### Change 4: Add Section Heading Mobile Style

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_about.scss`

Add to the 479px media query:

```scss
.about__heading {
  font-size: 24px;
  margin-top: 15px;
  margin-bottom: 10px;
}
```

---

### Change 5: Ensure Grid Gaps Are Zero

**File:** `/Users/colinneller/Projects/pikeandwest.com/assets/scss/_about.scss`

Update the 479px media query `.about__block` or add if missing:

```scss
.about__block {
  grid-column-gap: 0;
  grid-row-gap: 0;
}
```

---

## 5. Complete Recommended SCSS Update

Replace the mobile breakpoint sections in `_about.scss`:

```scss
// Mobile landscape responsive (max-width: 767px)
@media (max-width: $breakpoint-md) {
  margin-left: 15px;
  margin-right: 15px;

  .about__block {
    grid-column-gap: 0;
    grid-row-gap: 0;
    text-align: center;
  }

  .about__subtitle {
    margin-top: 20px;
    margin-bottom: 15px;
    font-size: 22px;
  }
}

// Mobile portrait responsive (max-width: 479px)
@media (max-width: $breakpoint-sm) {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;

  .about__heading {
    font-size: 24px;
    margin-top: 15px;
    margin-bottom: 10px;
  }

  .about__block {
    grid-column-gap: 0;
    grid-row-gap: 0;
  }

  .about__content {
    padding-bottom: 30px;
  }

  .about__subtitle {
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 15px;
  }

  .about__text {
    font-size: 13px;
    line-height: 1.5em;
    text-align: center;

    p {
      margin-bottom: 1em;
    }
  }
}
```

---

## 6. Priority Order

1. **High Priority:** Text font-size and line-height (readability)
2. **High Priority:** Button sizing (touch target and visual hierarchy)
3. **Medium Priority:** Content wrapper padding (vertical rhythm)
4. **Medium Priority:** Section heading size (visual hierarchy)
5. **Low Priority:** Grid gap zeroing (already close to correct)

---

## 7. Testing Checklist

After implementing changes:

- [ ] Run BackstopJS visual regression at 375px viewport
- [ ] Verify text is readable without zooming
- [ ] Confirm button touch target is adequate (minimum 44px)
- [ ] Check vertical spacing between elements
- [ ] Compare side-by-side with live Webflow site
- [ ] Test on actual iOS device (Safari rendering)
