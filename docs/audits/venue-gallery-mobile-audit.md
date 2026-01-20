# Venue Gallery Mobile Audit

**Date:** 2026-01-20
**Viewport Tested:** 375px (iPhone SE / standard mobile)
**Screenshot Reference:** `.playwright-mcp/audit-venue-gallery-mobile.png`

---

## 1. Current State Analysis

### Visual Observations from Screenshot

The screenshot at 375px viewport reveals:

1. **Section Header ("OUR VENUE")**
   - Title is properly styled with Le Mores Collection font
   - Subtitle "Want to see more? Follow us on Instagram." displays correctly
   - Text is centered as expected

2. **Image Carousel**
   - Images display with rounded corners (8px border-radius)
   - Aspect ratio appears to be 4:3 (current SCSS) but Webflow uses 1:1 (square)
   - Primary image visible with partial peek of next slide
   - Images are well-contained within the viewport

3. **Arrow Navigation**
   - Circular white buttons positioned on left/right of carousel
   - Arrows appear at approximately 56px diameter
   - Position overlaps images appropriately

4. **Dot Navigation (PRIMARY ISSUE)**
   - Dots are visible below the carousel
   - **Excessive vertical gap between images and dots** (~64px or more)
   - 11 dots visible (matching slide count)
   - Active dot shows gold color correctly
   - Dot spacing (gap) between individual dots appears appropriate

5. **Section Below**
   - CTA banner "THE PERFECT PLACE FOR YOUR NEXT..." visible
   - No overlap issues between sections

---

## 2. Webflow Reference Values

### Core Gallery Structure

```css
/* pikeandwest.webflow.css - Line 2206 */
.gallery17_slider {
  background-color: #0000;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-bottom: 4rem;  /* 64px - creates space for nav dots */
  position: relative;
}

/* Line 3504 - Mobile landscape (767px) */
.gallery17_slider {
  padding-bottom: 3rem;  /* 48px at 767px */
}
```

### Slide Padding

```css
/* pikeandwest.webflow.css - Line 2194 */
.gallery17_slide {
  padding-left: 1rem;   /* 16px */
  padding-right: 1rem;  /* 16px */
}

/* Line 3499 - Mobile landscape (767px) */
.gallery17_slide {
  padding-left: .75rem;   /* 12px */
  padding-right: .75rem;  /* 12px */
}
```

### Image Styling

```css
/* pikeandwest.webflow.css - Line 2199 */
.gallery17_image {
  aspect-ratio: 1;       /* SQUARE - not 4:3! */
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```

### Dot Navigation (Webflow Framework)

```css
/* webflow.css - Line 947 */
.w-slider-nav {
  position: absolute;
  z-index: 2;
  top: auto;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  padding-top: 10px;
  height: 40px;         /* Container height for dots */
  text-align: center;
}

/* webflow.css - Line 983 */
.w-slider-dot {
  position: relative;
  display: inline-block;
  width: 1em;           /* ~16px at default font-size */
  height: 1em;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  margin: 0 3px 0.5em;  /* 3px horizontal, 0.5em bottom */
  transition: background-color 100ms, color 100ms;
}
```

### Custom Slide Nav Override

```css
/* pikeandwest.webflow.css - Line 2292 */
.gallery17_slide-nav {
  height: 1.75rem;      /* 28px - custom height */
  font-size: .5rem;     /* 8px - affects em-based dot sizing */
}
```

### Section Padding

```css
/* pikeandwest.webflow.css - Line 2189 */
.padding-section-large {
  padding-top: 1.75rem;     /* 28px */
  padding-bottom: 1.75rem;  /* 28px */
}
```

### Arrow Sizing

```css
/* pikeandwest.webflow.css - Line 2224 */
.gallery17_arrow {
  border-radius: 100%;
  width: 3.5rem;        /* 56px */
  height: 3.5rem;
}

/* Line 3019 - Tablet (991px) */
.gallery17_arrow {
  width: 3rem;          /* 48px */
  height: 3rem;
}
```

---

## 3. Specific Issues Found

### Issue 1: Excessive Space Between Images and Dot Navigation (HIGH PRIORITY)

**Current Hugo Implementation:**

```scss
/* _gallery.scss - Line 41 */
&__track {
  display: flex;
  gap: $spacing-md;
  transition: transform $transition-slow;
  padding-bottom: 64px; // Webflow: 4rem
}

/* _gallery.scss - Line 79-83 */
&__nav {
  display: flex;
  justify-content: center;
  gap: $spacing-sm;
  margin-top: $spacing-xl;  /* 32px ADDITIONAL margin! */
}
```

**Problem:** The dots have BOTH:

1. `padding-bottom: 64px` on the track (correct - matches Webflow)
2. `margin-top: 32px` on the nav (INCORRECT - adds extra space)

**Webflow Approach:** The `.w-slider-nav` is positioned absolutely at `bottom: 0` within the slider, fitting within the `padding-bottom` space. No additional margin is added.

**Total Spacing:**

- Hugo: 64px (track padding) + 32px (nav margin) = **96px gap**
- Webflow: 64px (contained within padding-bottom) = **64px gap**

At mobile (767px):

- Hugo: 48px (track padding) + 32px (nav margin) = **80px gap**
- Webflow: 48px (padding-bottom) = **48px gap**

### Issue 2: Image Aspect Ratio Mismatch

**Current Hugo:**

```scss
/* _gallery.scss - Line 64 */
&__image {
  aspect-ratio: 4/3;  /* Rectangular */
}
```

**Webflow:**

```css
.gallery17_image {
  aspect-ratio: 1;    /* Square */
}
```

**Impact:** Images appear as rectangles in Hugo vs. squares in Webflow.

### Issue 3: Dot Sizing Inconsistency

**Current Hugo:**

```scss
/* _gallery.scss - Line 87-88 */
&__nav-btn {
  width: 12px;
  height: 12px;
}
```

**Webflow:**

```css
.w-slider-dot {
  width: 1em;   /* With gallery17_slide-nav font-size: 0.5rem = 8px */
  height: 1em;
}
```

**Impact:** Hugo dots are 12px vs. Webflow's 8px dots.

### Issue 4: Navigation Container Structure

**Current Hugo:** `.venue-gallery__nav` is a static flex container with margin spacing.

**Webflow:** `.w-slider-nav` is absolutely positioned within the slider, sitting in the padding-bottom area.

---

## 4. Recommended Changes

### Fix 1: Remove Nav Margin and Use Absolute Positioning (Primary Fix)

```scss
/* _gallery.scss - Update &__carousel */
&__carousel {
  position: relative;
  overflow: hidden;
  padding-bottom: 64px; // Move padding here to contain nav

  @media (max-width: $breakpoint-md) {
    padding-bottom: 48px; // 3rem at mobile
  }
}

/* Update &__track - Remove bottom padding */
&__track {
  display: flex;
  gap: $spacing-md;
  transition: transform $transition-slow;
  // Remove: padding-bottom: 64px;
}

/* Update &__nav - Use absolute positioning like Webflow */
&__nav {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px; // Webflow uses 3px margin on each side = 6px gap
  height: 28px; // Webflow: gallery17_slide-nav height: 1.75rem
  padding-top: 10px; // Webflow: w-slider-nav padding-top
  // Remove: margin-top: $spacing-xl;
}
```

### Fix 2: Match Dot Sizing

```scss
/* _gallery.scss - Update &__nav-btn */
&__nav-btn {
  width: 8px;  // Webflow: 1em at 0.5rem font-size
  height: 8px;
  border-radius: 50%;
  background-color: rgba($color-black, 0.2);
  border: none;
  cursor: pointer;
  transition: background-color $transition-fast;

  &--active,
  &:hover {
    background-color: $color-gold;
  }
}
```

### Fix 3: Match Image Aspect Ratio (Optional - Design Decision)

```scss
/* _gallery.scss - Update &__image */
&__image {
  width: 100%;
  aspect-ratio: 1; // Match Webflow square images
  object-fit: cover;
  // ... rest of styles
}
```

**Note:** This is a design decision. The 4:3 ratio may have been intentionally chosen for Hugo. Verify with stakeholder before changing.

### Fix 4: Mobile-Specific Track Padding Removal

```scss
/* _gallery.scss - Update mobile media query */
@media (max-width: $breakpoint-md) {
  .venue-gallery__track {
    // Remove this line if padding moved to carousel:
    // padding-bottom: 48px;
  }
}
```

---

## 5. Quick Fix Summary

**Minimum viable fix to address the spacing issue:**

```scss
// In &__nav section of _gallery.scss
&__nav {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 0; // Changed from $spacing-xl (32px)
  // Optionally reduce further if still too much space
}
```

**More comprehensive fix using absolute positioning:**

```scss
&__carousel {
  position: relative;
  overflow: hidden;
  padding-bottom: 48px; // Reduced from track, contains nav

  @media (max-width: $breakpoint-md) {
    padding-bottom: 36px;
  }
}

&__track {
  display: flex;
  gap: $spacing-md;
  transition: transform $transition-slow;
  // Remove padding-bottom entirely
}

&__nav {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

&__nav-btn {
  width: 8px;
  height: 8px;
  // ... rest unchanged
}
```

---

## 6. Files to Modify

| File                         | Changes                                                       |
|------------------------------|---------------------------------------------------------------|
| `/assets/scss/_gallery.scss` | Remove nav margin, adjust carousel padding, update dot sizing |

---

## 7. Testing Checklist

After implementing fixes:

- [ ] Dots are positioned closer to images (within ~16px)
- [ ] Dots remain centered horizontally
- [ ] Active dot gold color still works
- [ ] Dot click/tap targets are still adequate (recommend min 44px touch target)
- [ ] Arrow buttons still positioned correctly
- [ ] No overlap between gallery and CTA section below
- [ ] Test at 375px, 414px, 390px viewports
- [ ] Test at tablet (768px) and desktop (1024px+) to ensure changes don't break larger screens
