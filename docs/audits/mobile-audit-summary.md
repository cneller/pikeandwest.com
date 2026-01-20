# Mobile Visual Audit Summary - Homepage Sections

**Date:** 2026-01-20
**Viewport:** 375px (Mobile Portrait)
**Focus:** Visual polish and spacing improvements for mobile

---

## Priority Issues Overview

### HIGH PRIORITY (User-Identified Issues)

| Section           | Issue                     | Root Cause                                          | Fix                                                  |
|-------------------|---------------------------|-----------------------------------------------------|------------------------------------------------------|
| **Venue Gallery** | Dots too far from images  | Track padding (64px) + nav margin (32px) = 96px gap | Remove `margin-top: 32px` from `.venue-gallery__nav` |
| **Event Types**   | Excessive section padding | Fixed `height: 75vh` on mobile                      | Use `height: auto` with explicit padding at 479px    |

### HIGH PRIORITY (Accessibility)

| Section    | Issue                      | Impact            | Fix                                          |
|------------|----------------------------|-------------------|----------------------------------------------|
| **Hero**   | Button touch target < 44px | Poor tap accuracy | Add `min-height: 44px`, `padding: 12px 20px` |
| **Footer** | Social icons 25x25px       | Poor tap accuracy | Add 44px wrapper with centered 25px icon     |
| **Footer** | Nav links no padding       | Poor tap accuracy | Add `padding: 12px 16px`, `min-height: 44px` |

### MEDIUM PRIORITY (Visual Polish)

| Section         | Issue                         | Current   | Recommended                            |
|-----------------|-------------------------------|-----------|----------------------------------------|
| **Hero**        | Content padding too tight     | 10px      | 20px 16px                              |
| **Hero**        | Title margin-bottom           | 5px       | 12px                                   |
| **Hero**        | CTA margin-top                | 10px      | 16px                                   |
| **Event Types** | Missing 479px breakpoint      | -         | Add with `height: auto`, 2-column grid |
| **Event Types** | Heading font-size at 479px    | 22px      | 18px                                   |
| **About**       | Body text needs mobile sizing | inherited | 13px, line-height 1.5em                |
| **CTA Banner**  | Text size at mobile           | 16px      | 16px/28px (line-height)                |
| **Footer**      | Container padding at 479px    | 20px      | 10px                                   |

### LOW PRIORITY (Fine-Tuning)

| Section           | Issue                    | Current | Recommended |
|-------------------|--------------------------|---------|-------------|
| **Venue Gallery** | Dot size                 | 12px    | 8px         |
| **Footer**        | Copyright font at 479px  | 11px    | 8px         |
| **About**         | Section heading at 479px | 32px    | 24px        |

---

## Changes by File

### `_gallery.scss`

```scss
// Remove margin-top from nav
&__nav {
  margin-top: 0; // Was $spacing-xl (32px)
  gap: 6px; // Was $spacing-sm (8px)
}

// Reduce dot size
&__nav-btn {
  width: 8px;  // Was 12px
  height: 8px;
}
```

### `_events.scss`

```scss
// Add 479px breakpoint
@media (max-width: $breakpoint-sm) {
  height: auto;
  max-height: none;
  padding-top: $spacing-lg;
  padding-bottom: $spacing-lg;

  .events__heading {
    font-size: 18px;
  }

  .events__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

### `_hero.scss`

```scss
// At 479px breakpoint
&__content {
  padding: 20px 16px; // Was 10px
}

&__title {
  margin-bottom: 12px; // Was 5px
}

&__cta {
  margin-top: 16px; // Was 10px
}
```

### `_buttons.scss`

```scss
// Add mobile touch target
@media (max-width: $breakpoint-md) {
  .btn {
    min-height: 44px;
    padding: 12px 20px;
  }
}
```

### `_footer.scss`

```scss
// Social icon touch target
&__social-link {
  min-width: 44px;
  min-height: 44px;

  img, svg {
    width: 25px;
    height: 25px;
  }
}

// Nav link touch target
&__link {
  padding: 12px 16px;
  min-height: 44px;
}

// At 479px
@media (max-width: $breakpoint-sm) {
  .footer__container {
    padding-left: 10px;
    padding-right: 10px;
  }
}
```

### `_about.scss`

```scss
// At 479px
@media (max-width: $breakpoint-sm) {
  .about__text {
    font-size: 13px;
    line-height: 1.5em;
  }

  .about__heading {
    font-size: 24px;
  }
}
```

### `_cta-banner.scss`

```scss
// At 767px
@media (max-width: $breakpoint-md) {
  .cta-banner__text {
    font-size: 16px;
    line-height: 28px;
  }
}
```

---

## Implementation Order

1. **Phase 1: User-Identified Issues** (5 min)
   - `_gallery.scss`: Remove nav margin, reduce dot size
   - `_events.scss`: Add 479px breakpoint with height: auto

2. **Phase 2: Accessibility** (10 min)
   - `_buttons.scss`: Add mobile touch targets
   - `_footer.scss`: Social icon and nav link touch targets

3. **Phase 3: Visual Polish** (15 min)
   - `_hero.scss`: Improve spacing at 479px
   - `_about.scss`: Add mobile text styles
   - `_cta-banner.scss`: Add text sizing

4. **Phase 4: Verification** (5 min)
   - Run Hugo server
   - Visual check at 375px viewport
   - Compare against Webflow live site

---

## Testing Checklist

After all changes:

- [ ] Gallery dots close to images (~48px gap max)
- [ ] Event types section compact on mobile (no excessive padding)
- [ ] All buttons have 44px min touch target
- [ ] Footer icons/links easily tappable
- [ ] Text readable at all sizes
- [ ] No horizontal scroll at 375px
- [ ] BackstopJS visual regression passes
