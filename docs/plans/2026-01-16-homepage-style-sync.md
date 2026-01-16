# Homepage Style Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Achieve pixel-perfect visual parity between the live Webflow site (pikeandwest.com) and the Hugo site (localhost:1313) for the homepage.

**Architecture:** Systematically update SCSS files and HTML partials to match exact computed styles extracted from the Webflow production site. Each section is addressed independently, with verification via BackstopJS visual regression testing.

**Tech Stack:** Hugo, SCSS, BackstopJS, Playwright (for style extraction)

---

## Reference: Extracted Webflow Styles

### Colors (verified)

- `#434345` - medium gray (pw-black)
- `#aa6e0b` - gold
- `#fff7e1` - cream
- `#1a1b1f` - dark text

### Fonts

- **Le Mores Collection Serif** - Display headings (h1, h2, About subheads)
- **Raleway Variablefont Wght** - UI elements (nav buttons, Gallery/Events section headings)
- **Montserrat** - Body text, tagline

---

## Task 1: Fix Hero Section Button

**Files:**

- Modify: `assets/scss/_hero.scss:81-83`
- Modify: `layouts/partials/hero.html:19`

**Issue:** Hero button uses `.btn-outline` (transparent + border) but Webflow uses cream-filled button.

**Step 1: Update hero partial to use correct button class**

```html
{{/* Change from btn-outline to btn-secondary */}}
<a href="/contact/" class="btn btn-secondary">SCHEDULE A TOUR</a>
```

**Step 2: Verify button styling in `_buttons.scss`**

Button values from Webflow:

- Background: `rgb(255, 247, 225)` (#fff7e1)
- Color: `rgb(67, 67, 69)` (#434345)
- Padding: `9px 15px`
- Font-size: 16px
- Letter-spacing: 2.4px (0.15em)

Current Hugo `.btn-secondary` should match. Verify and run Hugo.

**Step 3: Rebuild and verify**

```bash
hugo server -D
```

Open <http://localhost:1313> and verify hero button is cream-filled.

---

## Task 2: Fix Gallery Section Heading

**Files:**

- Modify: `assets/scss/_gallery.scss:9-11`

**Issue:** Gallery "OUR VENUE" heading should use **Raleway** (not Le Mores), 28px, letter-spacing 4.2px.

**Step 1: Update gallery heading styles**

Add to `.venue-gallery__heading`:

```scss
&__heading {
  font-family: $font-primary; // Raleway, not $font-display
  font-size: 28px;
  font-weight: $font-weight-regular; // 400
  line-height: 32.2px;
  letter-spacing: 4.2px;
  text-align: center;
  color: $color-medium-gray;
  margin-bottom: $spacing-sm;
}
```

**Step 2: Rebuild and verify**

```bash
hugo server -D
```

---

## Task 3: Fix Gallery Arrow Size

**Files:**

- Modify: `assets/scss/_gallery.scss:88-99`

**Issue:** Gallery arrows are 40px but Webflow uses 56px (3.5rem).

**Step 1: Update arrow dimensions**

```scss
&__arrow {
  width: 56px;  // Was 40px
  height: 56px; // Was 40px
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($color-white, 0.6);
  border: none;
  border-radius: 100%; // Match Webflow
  cursor: pointer;
  pointer-events: auto;
  transition: all $transition-fast;

  &:hover {
    background-color: rgba($color-white, 0.9);
  }

  svg,
  img {
    width: 24px;  // Slightly larger for 56px button
    height: 24px;
  }
}
```

**Step 2: Rebuild and verify**

---

## Task 4: Fix Gallery Slider Padding

**Files:**

- Modify: `assets/scss/_gallery.scss` (add new rule)

**Issue:** Gallery slider needs `padding-bottom: 64px` (4rem) to match Webflow.

**Step 1: Add slider padding**

Add after `&__carousel`:

```scss
&__track {
  display: flex;
  gap: $spacing-md;
  transition: transform $transition-slow;
  padding-bottom: 64px; // Webflow: 4rem
}
```

**Step 2: Rebuild and verify**

---

## Task 5: Fix Events Section Layout

**Files:**

- Modify: `assets/scss/_events.scss:5-8`

**Issue:** Events section uses padding-based layout, but Webflow uses explicit height `50vh / max-height: 50vh`.

**Step 1: Update events section container**

```scss
.events {
  height: 50vh;
  max-height: 50vh;
  background-color: $color-medium-gray;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 5%; // Side padding only
  overflow: hidden;
```

**Step 2: Rebuild and verify**

---

## Task 6: Fix Events Icon Size

**Files:**

- Modify: `assets/scss/_events.scss:45-53`

**Issue:** Event icons are 80x80px but Webflow uses 50x50px.

**Step 1: Update icon dimensions**

```scss
&__icon {
  width: 50px;  // Was 80px
  height: 50px; // Was 80px

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
```

**Step 2: Rebuild and verify**

---

## Task 7: Fix Events Label Typography

**Files:**

- Modify: `assets/scss/_events.scss:56-63`

**Issue:** Event labels (WEDDING, DANCE, etc.) should use **Le Mores** at 15px, not Raleway.

Webflow values:

- Font: Le Mores Collection Serif
- Size: 15px
- Weight: 300
- Letter-spacing: 1.5px
- Line-height: 17.25px
- Color: cream (#fff7e1)

**Step 1: Update event label styles**

```scss
&__label {
  font-family: $font-display; // Le Mores, was $font-primary
  font-size: 15px;
  font-weight: $font-weight-light; // 300
  letter-spacing: 1.5px;
  line-height: 17.25px;
  color: $color-cream;
  text-transform: uppercase;
}
```

**Step 2: Rebuild and verify**

---

## Task 8: Fix About Section Spacing

**Files:**

- Modify: `assets/scss/_about.scss`

**Issue:** About section has wrong margins, padding, and grid gaps.

Webflow values:

- Section margin: 30px left/right
- Section padding-top: 20px
- Grid column-gap: 20px
- Grid row-gap: 30px
- Grid margin-bottom: 80px

**Step 1: Update about section styles**

```scss
.about {
  margin-left: 30px;
  margin-right: 30px;
  padding-top: 20px;
  padding-bottom: 0;

  &__heading {
    text-align: center;
    margin-bottom: 32px; // Webflow
  }

  &__block {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px 20px; // row-gap column-gap
    align-items: center;
    margin-bottom: 80px;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1fr 1fr;
    }

    &:last-child {
      margin-bottom: 40px; // Second grid has 40px
    }
```

**Step 2: Rebuild and verify**

---

## Task 9: Fix About Paragraph Opacity

**Files:**

- Modify: `assets/scss/_about.scss:53-56`

**Issue:** About section body text needs `opacity: 0.6`.

Webflow `.paragraph-light`:

- opacity: 0.6
- color: #434345
- letter-spacing: normal (0)

**Step 1: Update about text styles**

```scss
&__text {
  margin-bottom: $spacing-lg;
  line-height: 28px; // Webflow body line-height
  opacity: 0.6;
  color: $color-medium-gray;
  letter-spacing: 0;

  p {
    margin-bottom: $spacing-md;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
```

**Step 2: Rebuild and verify**

---

## Task 10: Fix CTA Banner Overlay

**Files:**

- Modify: `assets/scss/_cta-banner.scss`

**Issue:** CTA banner has dark overlay but Webflow uses light disco background without overlay.

Webflow values:

- Background: `PW_Disco_Background_White_Overlay.jpg` (already has white tint baked in)
- No CSS overlay needed
- Heading: Le Mores, 36px, line-height 54px (1.5em), color #434345, NO text-transform
- Text color: #434345 (not white/cream)

**Step 1: Update CTA banner styles**

```scss
.cta-banner {
  position: relative;
  padding: $spacing-4xl 0;
  text-align: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  // REMOVE the ::before overlay - Webflow image has white overlay baked in

  &__content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto;
  }

  &__heading {
    font-family: $font-display;
    font-size: 36px;
    font-weight: $font-weight-regular;
    line-height: 54px; // 1.5em at 36px
    color: $color-medium-gray; // #434345, not cream
    text-transform: none; // Explicitly none
    margin-bottom: $spacing-md;
  }

  &__text {
    font-family: $font-secondary;
    font-size: 16px;
    color: $color-medium-gray;
    margin-bottom: $spacing-xl;
  }
}
```

**Step 2: Rebuild and verify**

The CTA button should use `.btn-dark` (charcoal background).

---

## Task 11: Fix Footer Height and Icons

**Files:**

- Modify: `assets/scss/_footer.scss`

**Issue:** Footer needs exact 150px height and 25x25 social icons.

Webflow values:

- Height: 150px
- Padding: 20px top/bottom
- Social icons: 25x25px

**Step 1: Update footer styles**

```scss
.footer {
  background-color: $color-gold;
  height: 150px;
  padding: 20px 0;
  display: flex;
  align-items: center;

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-sm;
    text-align: center;
    width: 100%;
  }

  // ... keep other styles ...

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;  // Was 40px
    height: 25px; // Was 40px
    color: $color-white;
    transition: color $transition-fast;

    &:hover {
      color: $color-cream;
    }

    svg,
    img {
      width: 25px;  // Was 24px
      height: 25px; // Was 24px
    }
  }

  &__copyright {
    font-size: 12px;
    color: $color-cream; // #fff7e1
  }
}
```

**Step 2: Rebuild and verify**

---

## Task 12: Fix Navbar Button Styles

**Files:**

- Modify: `assets/scss/_header.scss:50-90`

**Issue:** Verify navbar buttons match Webflow exactly.

Webflow navbar buttons:

- Primary (gold): bg #aa6e0b, color white, font-size 12px, letter-spacing 1.6px (0.1rem), padding 12px 25px
- Secondary (outline): bg white, color #aa6e0b, border 1px solid #aa6e0b, padding 12px 25px

**Step 1: Verify/update header link styles**

```scss
&__link {
  font-family: $font-primary; // Raleway
  font-size: 12px;
  font-weight: $font-weight-regular;
  text-transform: uppercase;
  letter-spacing: 1.6px; // 0.1rem
  line-height: 20px;
  padding: 12px 25px;
  border: 1px solid $color-gold;
  transition: all $transition-fast;
  text-decoration: none;

  &--primary {
    background-color: $color-gold;
    color: $color-white;
    border-color: $color-gold;

    &:hover {
      background-color: darken($color-gold, 5%);
      color: $color-white;
    }
  }

  &--outline {
    background-color: $color-white;
    color: $color-gold;
    border: 1px solid $color-gold;

    &:hover {
      background-color: $color-cream;
      color: $color-gold;
    }
  }
}
```

**Step 2: Rebuild and verify**

---

## Task 13: Run BackstopJS Visual Regression Test

**Files:**

- Test: `backstop.json`

**Step 1: Ensure Hugo server is running**

```bash
hugo server -D
```

**Step 2: Run BackstopJS test**

```bash
npx backstop test
```

**Step 3: Open HTML report**

```bash
open backstop_data/html_report/index.html
```

**Step 4: Analyze remaining diffs**

Target: All homepage scenarios < 5% diff.

---

## Task 14: Iterate on Remaining Diffs

Based on BackstopJS results, identify and fix remaining visual differences.

**Priority areas:**

1. Typography (font rendering, line-heights)
2. Spacing (margins, paddings)
3. Colors (exact hex values)
4. Responsive breakpoints

**Step 1: For each diff > 1%**

1. Inspect reference vs test screenshot
2. Identify pink areas (mismatches)
3. Use Playwright to extract exact values from pikeandwest.com
4. Update corresponding SCSS
5. Rebuild and re-test

**Step 2: Approve baseline when satisfied**

```bash
npx backstop approve
```

---

## Summary Checklist

| Task | Component | Key Fix                            | Status |
|------|-----------|------------------------------------|--------|
| 1    | Hero      | Button class (outline → secondary) |        |
| 2    | Gallery   | Heading font (Le Mores → Raleway)  |        |
| 3    | Gallery   | Arrow size (40px → 56px)           |        |
| 4    | Gallery   | Slider padding-bottom (64px)       |        |
| 5    | Events    | Section height (padding → 50vh)    |        |
| 6    | Events    | Icon size (80px → 50px)            |        |
| 7    | Events    | Label font (Raleway → Le Mores)    |        |
| 8    | About     | Section margins and grid gaps      |        |
| 9    | About     | Paragraph opacity (0.6)            |        |
| 10   | CTA       | Remove overlay, fix colors         |        |
| 11   | Footer    | Height (150px), icon size (25px)   |        |
| 12   | Navbar    | Verify button padding/spacing      |        |
| 13   | Test      | Run BackstopJS                     |        |
| 14   | Iterate   | Fix remaining diffs                |        |

---

_Plan generated: 2026-01-16_
_Reference: pikeandwest.com (Webflow) → localhost:1313 (Hugo)_
