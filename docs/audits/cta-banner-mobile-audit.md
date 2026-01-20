# CTA Banner Mobile Audit

**Date:** 2026-01-20
**Viewport Tested:** 375px (iPhone SE)
**Screenshot:** `.playwright-mcp/audit-cta-banner-mobile.png`

## 1. Current State Analysis

### What I Observe from the Screenshot

The CTA banner section ("Let's Celebrate!") displays at mobile viewport with:

1. **Background Image**: The disco ball image is visible but appears slightly cropped. The positioning looks acceptable at 50% center.

2. **Heading ("LET'S CELEBRATE!")**:
   - Displays in the decorative Le Mores Collection font
   - Text is readable against the light/white overlayed background
   - Appears to be approximately 30px font size based on Webflow reference

3. **Subtitle Text**:
   - "Book your next event at Pike & West and create unforgettable memories!"
   - Text is visible but somewhat small
   - Good contrast against the light background

4. **CTA Button ("SCHEDULE A TOUR")**:
   - Cream/beige colored button
   - Appears centered
   - Text is uppercase with letter spacing
   - Button has adequate size for touch targets

5. **Overall Section**:
   - Height appears to be 50vh (half viewport height)
   - Content is vertically centered
   - Padding appears minimal (15px based on Webflow)

### Issues Observed

- The subtitle text readability could be improved with slightly larger font
- Button could benefit from increased visual prominence on mobile
- Section padding appears tight on mobile

---

## 2. Webflow Reference Values

### Base Styles (Desktop)

**`.section.cc-cta`** (lines 207-225):

```css
.section.cc-cta {
  object-fit: cover;
  object-position: 50% 50%;
  background-color: #43434500;
  background-image: url('../images/PW_Disco_Background_White_Overlay.jpg');
  background-position: 50%;
  background-size: cover;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  height: 50vh;
  margin-top: 1.25rem;
  margin-left: 0;
  margin-right: 0;
  padding-left: 5rem;
  padding-right: 5rem;
  display: flex;
  overflow: visible;
}
```

**`.cta-heading`** (lines 504-513):

```css
.cta-heading {
  color: #434345;
  text-transform: none;
  margin-top: 10px;
  margin-bottom: 15px;
  font-family: Le Mores Collection Serif, sans-serif;
  font-size: 36px;
  font-weight: 400;
  line-height: 1.5em;
}
```

**`.cta-text`** (lines 668-677):

```css
.cta-text {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70%;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
}
```

**`.cta-wrap`** (lines 679-687):

```css
.cta-wrap {
  text-align: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 0;
  padding-bottom: 0;
  display: flex;
}
```

**`.paragraph-bigger`** (lines 324-330):

```css
.paragraph-bigger {
  opacity: 1;
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 400;
  line-height: 34px;
}
```

**`.button.cc-jumbo-button`** (lines 365-368):

```css
.button.cc-jumbo-button {
  padding: 16px 35px;
  font-size: 14px;
  line-height: 26px;
}
```

### Tablet Breakpoint (991px)

**`.section.cc-cta`** (lines 2649-2652):

```css
.section.cc-cta {
  padding-left: 0;
  padding-right: 0;
}
```

**`.cta-wrap`** (lines 2752-2755):

```css
.cta-wrap {
  width: auto;
  padding: 80px 50px 90px;
}
```

**`.cta-text`** (lines 2748-2750):

```css
.cta-text {
  width: auto;
}
```

### Mobile Landscape Breakpoint (767px)

**`.section.cc-cta`** (lines 3157-3159):

```css
.section.cc-cta {
  padding: 15px;
}
```

**`.cta-heading`** (lines 3192-3195):

```css
.cta-heading {
  font-size: 30px;
  line-height: 52px;
}
```

**`.cta-wrap`** (lines 3205-3208):

```css
.cta-wrap {
  padding-left: 30px;
  padding-right: 30px;
}
```

**`.paragraph-bigger`** (lines 3176-3179):

```css
.paragraph-bigger {
  font-size: 16px;
  line-height: 28px;
}
```

### Mobile Portrait Breakpoint (479px)

**`.section.cc-cta`** (lines 3542-3544):

```css
.section.cc-cta {
  background-position: 50%;
}
```

**`.cta-heading`** (lines 3606-3608):

```css
.cta-heading {
  line-height: 1.5em;
}
```

**`.cta-wrap`** (lines 3627-3629):

```css
.cta-wrap {
  padding: 0 15px;
}
```

---

## 3. Specific Issues Found

### Issue 1: Missing `.cta-text` and `.cta-wrap` Structure

**Location:** `/layouts/partials/cta-banner.html`

The Hugo partial uses `.cta-banner__content` as a single wrapper, but Webflow uses a nested structure with `.cta-wrap` and `.cta-text` elements.

**Current Hugo HTML:**

```html
<div class="cta-banner__content fade-in-up">
  <h2 class="cta-banner__heading">...</h2>
  <p class="cta-banner__text">...</p>
  <a href="..." class="btn btn-secondary">...</a>
</div>
```

**Webflow structure (implied):**

```html
<div class="cta-wrap">
  <h1 class="cta-heading">...</h1>
  <div class="cta-text">
    <p class="paragraph-bigger">...</p>
  </div>
  <a class="button cc-jumbo-button cc-jumbo-white">...</a>
</div>
```

### Issue 2: Missing Responsive Text Styles

**Location:** `/assets/scss/_cta-banner.scss` (lines 43-48)

The `.cta-banner__text` styles are missing mobile breakpoint adjustments:

**Current SCSS:**

```scss
&__text {
  font-family: $font-secondary;
  font-size: 16px;
  color: $color-medium-gray;
  margin-bottom: $spacing-xl;
}
```

**Missing Webflow values:**

- Desktop: font-size 20px, line-height 34px
- Mobile (767px): font-size 16px, line-height 28px

### Issue 3: Button Not Using Jumbo Styles

**Location:** `/layouts/partials/cta-banner.html` (line 12)

The button uses `.btn .btn-secondary` but Webflow's CTA uses `.button.cc-jumbo-button.cc-jumbo-white` with different padding:

**Current button padding:** 9px 16px (from `_buttons.scss` line 8)
**Webflow jumbo button padding:** 16px 35px (line 366)

### Issue 4: Missing `margin-top` on Section

**Location:** `/assets/scss/_cta-banner.scss` (line 10)

**Current:** `margin: 0;`
**Webflow:** `margin-top: 1.25rem;` (20px)

### Issue 5: Missing `cta-wrap` Responsive Padding

**Location:** `/assets/scss/_cta-banner.scss`

The Hugo SCSS doesn't account for the `.cta-wrap` padding changes at different breakpoints:

- Desktop: `padding: 0`
- Tablet (991px): `padding: 80px 50px 90px`
- Mobile (767px): `padding-left: 30px; padding-right: 30px`
- Mobile (479px): `padding: 0 15px`

---

## 4. Recommended Changes

### 4.1 Update HTML Partial Structure

**File:** `/layouts/partials/cta-banner.html`

```html
{{- $cta := site.Data.cta_banner -}}
{{- $bgImage := resources.Get $cta.background_image -}}
{{- $bgUrl := "" -}}
{{- if $bgImage -}}
  {{- $bgUrl = ($bgImage.Resize "1920x q80").RelPermalink -}}
{{- end -}}

<section class="cta-banner" style="background-image: url('{{ $bgUrl }}');">
  <div class="cta-banner__wrap fade-in-up">
    <h2 class="cta-banner__heading">{{ $cta.heading }}</h2>
    <div class="cta-banner__text-wrap">
      <p class="cta-banner__text">{{ $cta.text }}</p>
    </div>
    <a href="{{ $cta.cta.link }}" class="btn btn-jumbo">{{ $cta.cta.text }}</a>
  </div>
</section>
```

### 4.2 Update SCSS Styles

**File:** `/assets/scss/_cta-banner.scss`

```scss
// =========================
// CTA Banner Section
// =========================
// Webflow: .section.cc-cta (lines 207-225)
// Webflow: .cta-heading (lines 504-513)
// Webflow: .cta-wrap (lines 679-687)
// Webflow: .cta-text (lines 668-677)

.cta-banner {
  position: relative;
  height: 50vh;
  margin-top: 1.25rem; // 20px - Webflow: margin-top: 1.25rem
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  padding-top: 0;
  padding-bottom: 0;
  padding-left: 5rem; // 80px - Webflow: padding-left: 5rem
  padding-right: 5rem; // 80px - Webflow: padding-right: 5rem
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch; // Webflow: align-items: stretch
  text-align: center;
  background-size: cover;
  background-position: 50%; // Webflow: background-position: 50%
  background-repeat: no-repeat;
  overflow: visible;

  // CTA Wrap - inner container
  &__wrap {
    text-align: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 0;
    padding-bottom: 0;
    display: flex;
  }

  &__heading {
    font-family: $font-display;
    font-size: 36px;
    font-weight: $font-weight-regular; // 400
    line-height: 1.5em; // 54px at 36px - Webflow uses 1.5em
    color: $color-medium-gray; // #434345
    text-transform: none;
    margin-top: 10px; // Webflow: margin-top: 10px
    margin-bottom: 15px; // Webflow: margin-bottom: 15px
  }

  // Text wrapper (Webflow: .cta-text)
  &__text-wrap {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 70%;
    margin-bottom: 0;
    margin-left: auto;
    margin-right: auto;
    display: flex;
  }

  // Paragraph text (Webflow: .paragraph-bigger)
  &__text {
    font-family: $font-secondary;
    font-size: 20px; // Webflow: 20px desktop
    font-weight: $font-weight-regular;
    line-height: 34px; // Webflow: 34px
    color: $color-medium-gray;
    margin-bottom: 10px;
  }

  // Tablet responsive (max-width: 991px)
  @media (max-width: $breakpoint-lg) {
    padding-left: 0; // Webflow: padding-left/right: 0 at 991px
    padding-right: 0;

    .cta-banner__wrap {
      width: auto;
      padding: 80px 50px 90px; // Webflow tablet padding
    }

    .cta-banner__text-wrap {
      width: auto;
    }
  }

  // Mobile landscape responsive (max-width: 767px)
  @media (max-width: $breakpoint-md) {
    padding: 15px; // Webflow: padding: 15px at 767px

    .cta-banner__heading {
      font-size: 30px; // Webflow: .cta-heading font-size: 30px
      line-height: 52px; // Webflow: line-height: 52px
    }

    .cta-banner__wrap {
      padding-left: 30px;
      padding-right: 30px;
    }

    .cta-banner__text {
      font-size: 16px; // Webflow: font-size: 16px at 767px
      line-height: 28px; // Webflow: line-height: 28px
    }
  }

  // Mobile portrait responsive (max-width: 479px)
  @media (max-width: $breakpoint-sm) {
    background-position: 50%;

    .cta-banner__heading {
      line-height: 1.5em; // Webflow: line-height: 1.5em at 479px
    }

    .cta-banner__wrap {
      padding: 0 15px; // Webflow: padding: 0 15px at 479px
    }
  }
}
```

### 4.3 Add Jumbo Button Variant

**File:** `/assets/scss/_buttons.scss`

Add after the existing button styles:

```scss
// Jumbo button (for CTA sections) - Webflow: .button.cc-jumbo-button.cc-jumbo-white
.btn-jumbo {
  background-color: $color-white;
  color: $color-black;
  opacity: 0.68;
  padding: 16px 35px; // Webflow: 16px 35px
  font-size: 14px; // Webflow: 14px
  line-height: 26px; // Webflow: 26px
  margin-top: 40px; // Webflow: margin-top: 40px
  margin-bottom: 100px; // Webflow: margin-bottom: 100px

  &:hover {
    background-color: #f1f1f1;
    opacity: 1;
  }

  &:active {
    background-color: #e1e1e1;
  }

  // Mobile (479px)
  @media (max-width: $breakpoint-sm) {
    outline-width: 0;
    position: static;
    margin-bottom: 40px; // Reduce margin on mobile
  }
}
```

---

## 5. Summary of Changes Required

| File               | Change                                                  | Priority |
|--------------------|---------------------------------------------------------|----------|
| `_cta-banner.scss` | Add `margin-top: 1.25rem` to section                    | Medium   |
| `_cta-banner.scss` | Change `align-items: center` to `align-items: stretch`  | Low      |
| `_cta-banner.scss` | Add `&__wrap` styles with responsive padding            | High     |
| `_cta-banner.scss` | Add `&__text-wrap` styles with width constraints        | Medium   |
| `_cta-banner.scss` | Update `&__text` to 20px/34px desktop, 16px/28px mobile | High     |
| `_buttons.scss`    | Add `.btn-jumbo` variant with 16px 35px padding         | High     |
| `cta-banner.html`  | Add `.cta-banner__wrap` wrapper element                 | High     |
| `cta-banner.html`  | Add `.cta-banner__text-wrap` around text                | Medium   |
| `cta-banner.html`  | Change button class to `btn btn-jumbo`                  | High     |

---

## 6. Verification Steps

After implementing changes:

1. Run Hugo dev server: `hugo server -D`
2. Open <http://localhost:1313> in browser
3. Use DevTools responsive mode at 375px width
4. Compare visually against Webflow live site
5. Run BackstopJS visual regression: `npm run backstop:test`
6. Check heading size (should be 30px at 767px, then 1.5em line-height at 479px)
7. Verify button padding matches Webflow (16px 35px)
8. Confirm text wrapping and readability
