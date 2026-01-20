# Footer Mobile Audit (375px viewport)

**Date:** 2026-01-20
**Auditor:** Claude
**Viewport:** 375px (mobile portrait)
**Reference Files:**

- Screenshot: `/.playwright-mcp/audit-footer-mobile.png`
- Webflow CSS: `/webflow-export/css/pikeandwest.webflow.css`
- Hugo SCSS: `/assets/scss/_footer.scss`
- HTML Partial: `/layouts/partials/footer.html`

---

## 1. Current State Analysis

### Observed from Screenshot

The footer displays on a gold (#aa6e0b) background with:

- Pike & West fleur-de-lis logo at top
- Two navigation links: "CONTACT US" and "BLOG"
- Two social icons (Instagram and Facebook)
- Copyright text at bottom

### Current Hugo Implementation

| Element               | Current Value                             | Notes                                         |
|-----------------------|-------------------------------------------|-----------------------------------------------|
| Footer height         | `height: auto` at 479px                   | Correct                                       |
| Container padding     | `20px` left/right                         | Close to Webflow                              |
| Logo width            | `50px` in SCSS, but HTML has `width="30"` | **Mismatch**                                  |
| Nav links font-size   | `10px`                                    | Matches Webflow                               |
| Nav links line-height | `12px`                                    | Matches Webflow                               |
| Social icons          | `25x25px` base, `24x24` in HTML           | **Inconsistent**                              |
| Copyright font-size   | `11px`                                    | Close - Webflow has `8px` for mobile.vertical |
| Copyright line-height | `12px`                                    | Matches Webflow                               |
| Gap between elements  | `$spacing-md` (16px)                      | Not specific enough                           |

---

## 2. Webflow Reference Values

### Desktop Base (no breakpoint)

```css
/* Line 238-248: .section.footer-wrap */
.section.footer-wrap {
  background-color: #aa6e0b;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 150px;
  padding-top: 20px;
  padding-bottom: 20px;
}

/* Line 1440-1443: .footer-logo */
.footer-logo {
  align-self: auto;
  width: 50px;
}

/* Line 1445-1453: .footer-link */
.footer-link {
  color: #fff7e1;
  text-align: left;
  text-transform: uppercase;
  font-family: Raleway Variablefont Wght, sans-serif;
  font-size: 14px;
  text-decoration: none;
}

/* Line 1483-1488: .footer-copyright */
.footer-copyright {
  color: #fff7e1;
  text-align: center;
  margin-top: 10px;
  font-size: 11px;
}

/* Line 1490-1494: Social icons */
.image-2, .image-3 {
  align-self: center;
  width: 25px;
  height: 25px;
}

/* Line 1523-1532: .footer-wrap-1 */
.footer-wrap-1 {
  text-align: center;
  width: 100%;
  padding-top: 20px;
  padding-left: 60px;
}

/* Line 1460-1476: .footer-logo-link-block */
.footer-logo-link-block {
  grid-column-gap: 5px;
  grid-row-gap: 5px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-content: center;
  place-items: center;
}
```

### Tablet Breakpoint (@media max-width: 991px)

```css
/* Line 2943-2946 */
.footer-wrap-1 {
  padding-left: 40px;
  padding-right: 40px;
}

/* Line 2948-2954: .footer-wrap-1.mobile */
.footer-wrap-1.mobile {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 0;
  display: flex;
}
```

### Mobile Landscape (@media max-width: 767px)

```css
/* Line 3371-3373 */
.footer-link.mobile-horizontal {
  font-size: 13px;
}

/* Line 3379-3381 */
.footer-wrap-1 {
  text-align: center;
}
```

### Mobile Portrait (@media max-width: 479px)

```css
/* Line 3553-3555 */
.section.footer-wrap {
  flex-direction: column;
}

/* Line 3557-3560: .section.footer-wrap.mobile.vertical */
.section.footer-wrap.mobile.vertical {
  width: 100%;
  height: auto;
}

/* Line 3777-3780: .footer-link */
.footer-link, .footer-link.mobile {
  font-size: 10px;
  line-height: 12px;
}

/* Line 3782-3787: .footer-logo-link-block.mobile.vertical */
.footer-logo-link-block.mobile.vertical {
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  grid-template-rows: .5fr .5fr .5fr .5fr .5fr .5fr;
  grid-template-columns: 1fr;
}

/* Line 3789-3791: .footer-copyright */
.footer-copyright {
  line-height: 12px;
}

/* Line 3793-3795: .footer-copyright.mobile.vertical */
.footer-copyright.mobile.vertical {
  font-size: 8px;
}

/* Line 3797-3800: Social icons */
.image-2, .image-3 {
  width: auto;
  height: auto;
}

/* Line 3808-3815: .footer-wrap-1.mobile */
.footer-wrap-1.mobile {
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
}

/* Line 3817-3820: .footer-wrap-1.mobile.vertical */
.footer-wrap-1.mobile.vertical {
  padding-left: 10px;
  padding-right: 10px;
}
```

---

## 3. Specific Issues Found

### Issue 1: Logo Size Mismatch

**Location:** `/layouts/partials/footer.html` lines 6-11, `/assets/scss/_footer.scss` line 23

**Problem:** SCSS defines `width: 50px` but HTML hardcodes `width="30" height="30"`.

**Webflow:** Logo is `50px` width at all breakpoints (no mobile-specific reduction).

### Issue 2: Social Icons Too Small for Touch

**Location:** `/assets/scss/_footer.scss` lines 58-70

**Problem:** Social icons are 25x25px, below the recommended 44x44px minimum touch target.

**Current:**

```scss
&__social-link {
  width: 25px;
  height: 25px;
}
```

**Webflow:** Also uses 25x25px icons, but modern accessibility guidelines require larger touch targets.

### Issue 3: Nav Links Below Touch Target Size

**Location:** `/assets/scss/_footer.scss` lines 31-42, 114-117

**Problem:** At 479px, nav links are `10px` font-size with no padding/min-height, making touch targets too small.

**Current:** No explicit padding on `.footer__link` elements.

### Issue 4: Copyright Font Size Discrepancy

**Location:** `/assets/scss/_footer.scss` lines 73-78, 119-121

**Problem:** Hugo uses `11px` but Webflow's `.footer-copyright.mobile.vertical` uses `8px`.

**Current:**

```scss
&__copyright {
  font-size: 11px; // Webflow: 11px (not 14px)
}
```

**Webflow at 479px:**

```css
.footer-copyright.mobile.vertical {
  font-size: 8px;
}
```

### Issue 5: Container Padding Not Using Webflow Values

**Location:** `/assets/scss/_footer.scss` lines 109-112

**Problem:** Hugo uses `20px` padding but Webflow's `.footer-wrap-1.mobile.vertical` uses `10px`.

**Current:**

```scss
@media (max-width: $breakpoint-sm) {
  .footer__container {
    padding-left: 20px;
    padding-right: 20px;
  }
}
```

**Webflow:**

```css
.footer-wrap-1.mobile.vertical {
  padding-left: 10px;
  padding-right: 10px;
}
```

### Issue 6: Missing Grid Layout for Stacked Elements

**Location:** `/assets/scss/_footer.scss`

**Problem:** Webflow uses a grid layout with specific gap values at mobile (`grid-column-gap: 10px; grid-row-gap: 10px`). Hugo uses flexbox with generic gap.

### Issue 7: Inconsistent Element Spacing

**Location:** `/assets/scss/_footer.scss` lines 44-52

**Problem:** Using generic variables (`$spacing-md`, `$spacing-lg`) instead of Webflow's specific pixel values.

---

## 4. Recommended Changes

### Fix 1: Correct Logo Size in HTML

**File:** `/layouts/partials/footer.html`

**Change lines 6-11:**

```html
<!-- Before -->
<img
  src="{{ $resized.RelPermalink }}"
  alt="Pike & West"
  width="30"
  height="30"
/>

<!-- After -->
<img
  src="{{ $resized.RelPermalink }}"
  alt="Pike & West"
  width="50"
  height="auto"
/>
```

Also resize the source image appropriately:

```go-html-template
{{ $resized := $logo.Resize "100x" }}
```

### Fix 2: Increase Social Icon Touch Targets

**File:** `/assets/scss/_footer.scss`

**Update lines 54-71:**

```scss
&__social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  // Touch target padding while keeping icon at 25px
  min-width: 44px;
  min-height: 44px;
  width: 44px;
  height: 44px;
  color: $color-white;
  transition: color $transition-fast;

  &:hover {
    color: $color-cream;
  }

  img,
  svg {
    width: 25px; // Webflow: 25x25px visual size
    height: 25px;
  }
}
```

### Fix 3: Add Touch Target Padding to Nav Links

**File:** `/assets/scss/_footer.scss`

**Update lines 31-42:**

```scss
&__link {
  font-family: $font-primary;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: $color-cream;
  text-decoration: none;
  // Add touch-friendly padding
  padding: 12px 16px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;

  &:hover {
    color: $color-white;
  }
}
```

### Fix 4: Correct Copyright Font Size at Mobile

**File:** `/assets/scss/_footer.scss`

**Update lines 119-121:**

```scss
@media (max-width: $breakpoint-sm) {
  // ... existing styles ...

  .footer__copyright {
    font-size: 8px; // Webflow: .footer-copyright.mobile.vertical
    line-height: 12px;
  }
}
```

### Fix 5: Correct Container Padding at Mobile

**File:** `/assets/scss/_footer.scss`

**Update lines 109-112:**

```scss
@media (max-width: $breakpoint-sm) {
  // ... existing styles ...

  .footer__container {
    padding-left: 10px; // Webflow: .footer-wrap-1.mobile.vertical
    padding-right: 10px;
  }
}
```

### Fix 6: Use Webflow-Specific Gap Values

**File:** `/assets/scss/_footer.scss`

**Update lines 44-52:**

```scss
&__links {
  display: flex;
  gap: 5px; // Webflow: grid-column-gap: 5px at desktop

  @media (max-width: $breakpoint-sm) {
    gap: 10px; // Webflow: grid-column-gap: 10px at 479px
    flex-direction: column;
    align-items: center;
  }
}

&__social {
  display: flex;
  gap: 5px; // Webflow: grid-column-gap: 5px

  @media (max-width: $breakpoint-sm) {
    gap: 10px; // Webflow: grid-column-gap: 10px at 479px
  }
}
```

### Fix 7: Complete Mobile Breakpoint Rewrite

**File:** `/assets/scss/_footer.scss`

**Replace lines 104-122 with:**

```scss
// Mobile portrait responsive (max-width: 479px)
@media (max-width: $breakpoint-sm) {
  height: auto; // Webflow: .section.footer-wrap.mobile.vertical
  flex-direction: column;
  width: 100%;

  .footer__container {
    padding-left: 10px; // Webflow: .footer-wrap-1.mobile.vertical
    padding-right: 10px;
    gap: 10px; // Webflow: grid-row-gap: 10px
  }

  .footer__links {
    flex-direction: column;
    gap: 10px;
  }

  .footer__link {
    font-size: 10px; // Webflow: .footer-link at 479px
    line-height: 12px;
    // Maintain touch target with padding
    padding: 8px 12px; // Webflow: .footer-link.mobile.vertical.button-1-pw-cream
    min-height: 44px;
  }

  .footer__social {
    gap: 10px;
  }

  .footer__social-link {
    // Already has 44px min dimensions from base
  }

  .footer__copyright {
    font-size: 8px; // Webflow: .footer-copyright.mobile.vertical
    line-height: 12px;
  }
}
```

---

## 5. Accessibility Considerations

### Touch Targets (WCAG 2.5.5)

- **Minimum:** 44x44px for interactive elements
- **Current status:** Social icons (25x25px) and nav links fail this requirement
- **Recommendation:** Add padding to create 44px touch targets while maintaining visual size

### Color Contrast (WCAG 1.4.3)

- **Footer text:** #fff7e1 (cream) on #aa6e0b (gold)
- **Contrast ratio:** Approximately 3.5:1
- **Status:** Passes AA for large text (14px+), borderline for small text
- **Note:** 8px copyright text at mobile may have contrast issues

### Focus States

- **Current:** No visible focus styles defined for footer links
- **Recommendation:** Add focus-visible styles:

```scss
&__link:focus-visible,
&__social-link:focus-visible {
  outline: 2px solid $color-cream;
  outline-offset: 2px;
}
```

---

## 6. Summary of Changes

| Priority | Issue                     | Change Required              |
|----------|---------------------------|------------------------------|
| High     | Social icon touch targets | Add 44px min-width/height    |
| High     | Nav link touch targets    | Add padding for 44px targets |
| Medium   | Logo size mismatch        | Update HTML width to 50px    |
| Medium   | Container padding         | Change to 10px at 479px      |
| Low      | Copyright font size       | Change to 8px at 479px       |
| Low      | Gap values                | Use 5px/10px per Webflow     |

---

## 7. Files to Modify

1. `/assets/scss/_footer.scss` - Main style changes
2. `/layouts/partials/footer.html` - Logo size attribute fix

---

## 8. Testing Checklist

After implementing changes:

- [ ] Visual comparison at 375px viewport
- [ ] Touch target sizes verified (44px minimum)
- [ ] Logo displays at 50px width
- [ ] Nav links have adequate tap area
- [ ] Social icons have adequate tap area
- [ ] Copyright text readable at 8px
- [ ] Spacing matches Webflow reference
- [ ] Focus states visible on keyboard navigation
- [ ] Test on actual mobile device
