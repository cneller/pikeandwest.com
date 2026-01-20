# Typography Audit: Webflow vs Hugo Implementation

**Date:** 2026-01-20
**Scope:** Font families, font loading, and type scale comparison

---

## 1. Fonts Comparison

### 1.1 Font Families

| Purpose                        | Webflow (Source)                                  | Hugo (Current)                          | Status      |
|--------------------------------|---------------------------------------------------|-----------------------------------------|-------------|
| Display/Headlines (h1, h2)     | Le Mores Collection Serif (Typekit + self-hosted) | Le Mores Collection Serif (self-hosted) | MATCH       |
| Navigation/Buttons             | Raleway Variablefont Wght                         | Raleway                                 | MATCH       |
| Body Text                      | Montserrat                                        | Montserrat                              | MATCH       |
| Secondary (nav menu text-f-13) | Oswald (weight 300)                               | Not implemented                         | DISCREPANCY |

### 1.2 Font Weights Comparison

| Font                      | Webflow Weights              | Hugo Weights       | Status                           |
|---------------------------|------------------------------|--------------------|----------------------------------|
| Montserrat                | 100-900 (all + italics)      | 300, 400, 500, 600 | PARTIAL (Hugo has fewer weights) |
| Oswald                    | 200, 300, 400, 500, 600, 700 | Not loaded         | MISSING                          |
| Raleway                   | Variable (100-900)           | Variable (100-900) | MATCH                            |
| Le Mores Collection Serif | 400                          | 400                | MATCH                            |

---

## 2. Font Loading Method Comparison

### 2.1 Webflow Approach

**Source:** `/webflow-mcp-analysis/custom-code/site-head.html`

```html
<!-- Google Fonts via WebFont.js -->
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
<script>
  WebFont.load({
    google: {
      families: [
        'Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic',
        'Oswald:200,300,400,500,600,700',
      ],
    },
  });
</script>

<!-- Adobe Fonts (Typekit) - Le Mores Collection -->
<script src="https://use.typekit.net/jxr6fkv.js"></script>
<script>try { Typekit.load(); } catch (e) {}</script>
```

**Characteristics:**

- Uses WebFont.js for async Google Fonts loading
- Adobe Typekit for Le Mores Collection Serif (kit ID: jxr6fkv)
- All Montserrat weights (100-900) loaded
- All Oswald weights (200-700) loaded

### 2.2 Hugo Approach

**Source:** `/layouts/partials/head.html` (lines 44-50)

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

**Source:** `/assets/scss/_fonts.scss` (lines 1-29)

```scss
@font-face {
  font-family: 'Le Mores Collection Serif';
  src: url('/fonts/Le-Mores-Collection-Serif.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Raleway';
  src: url('/fonts/Raleway-VariableFont_wght.ttf') format('truetype');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

**Characteristics:**

- Uses standard `<link>` tags with preconnect (better than WebFont.js for modern browsers)
- Self-hosted Le Mores Collection Serif (no Typekit dependency)
- Self-hosted Raleway variable font
- Google Fonts for Montserrat only (limited weights: 300, 400, 500, 600)
- Includes unused Playfair Display (not in Webflow)
- Missing Oswald font entirely

---

## 3. Type Scale Comparison

### 3.1 Body Text

| Property    | Webflow                  | Hugo                           | Status |
|-------------|--------------------------|--------------------------------|--------|
| font-family | `Montserrat, sans-serif` | `$font-secondary` (Montserrat) | MATCH  |
| font-size   | 16px                     | `$font-size-base` (16px)       | MATCH  |
| font-weight | 400                      | `$font-weight-regular` (400)   | MATCH  |
| line-height | 28px                     | 28px                           | MATCH  |
| color       | #1a1b1f                  | `$color-text` (#1a1b1f)        | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 61-67
**Hugo Source:** `_base.scss` lines 16-27

### 3.2 Headings

#### H1

| Property      | Webflow                                 | Hugo                           | Status |
|---------------|-----------------------------------------|--------------------------------|--------|
| font-family   | `Le Mores Collection Serif, sans-serif` | `$font-display`                | MATCH  |
| font-size     | 36px                                    | 36px                           | MATCH  |
| font-weight   | 400                                     | `$font-weight-regular` (400)   | MATCH  |
| line-height   | 62px                                    | 62px                           | MATCH  |
| color         | #434345                                 | `$color-medium-gray` (#434345) | MATCH  |
| margin-top    | 20px                                    | 20px                           | MATCH  |
| margin-bottom | 15px                                    | 15px                           | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 69-77
**Hugo Source:** `_typography.scss` lines 7-16

#### H2

| Property      | Webflow                                 | Hugo                         | Status |
|---------------|-----------------------------------------|------------------------------|--------|
| font-family   | `Le Mores Collection Serif, sans-serif` | `$font-display`              | MATCH  |
| font-size     | 36px                                    | 36px                         | MATCH  |
| font-weight   | 400                                     | `$font-weight-regular` (400) | MATCH  |
| line-height   | 50px                                    | 50px                         | MATCH  |
| text-align    | center                                  | center                       | MATCH  |
| margin-top    | 10px                                    | 10px                         | MATCH  |
| margin-bottom | 10px                                    | 10px                         | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 79-87
**Hugo Source:** `_typography.scss` lines 18-27

#### H3

| Property       | Webflow                                 | Hugo                       | Status |
|----------------|-----------------------------------------|----------------------------|--------|
| font-family    | `Raleway Variablefont Wght, sans-serif` | `$font-primary` (Raleway)  | MATCH  |
| font-size      | 18px                                    | 18px                       | MATCH  |
| font-weight    | 300                                     | `$font-weight-light` (300) | MATCH  |
| line-height    | 46px                                    | 46px                       | MATCH  |
| letter-spacing | 0.15em                                  | 0.15em                     | MATCH  |
| text-transform | uppercase                               | uppercase                  | MATCH  |
| color          | #fff7e1                                 | `$color-cream` (#fff7e1)   | MATCH  |
| margin-top     | 10px                                    | 10px                       | MATCH  |
| margin-bottom  | 10px                                    | 10px                       | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 89-99
**Hugo Source:** `_typography.scss` lines 29-40

#### H4

| Property      | Webflow                | Hugo                         | Status |
|---------------|------------------------|------------------------------|--------|
| font-family   | Inherited (Montserrat) | Inherited                    | MATCH  |
| font-size     | 24px                   | 24px                         | MATCH  |
| font-weight   | 400                    | `$font-weight-regular` (400) | MATCH  |
| line-height   | 38px                   | 38px                         | MATCH  |
| margin-top    | 10px                   | 10px                         | MATCH  |
| margin-bottom | 10px                   | 10px                         | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 101-107
**Hugo Source:** `_typography.scss` lines 42-49

#### H5

| Property      | Webflow                | Hugo                        | Status |
|---------------|------------------------|-----------------------------|--------|
| font-family   | Inherited (Montserrat) | Inherited                   | MATCH  |
| font-size     | 20px                   | 20px                        | MATCH  |
| font-weight   | 500                    | `$font-weight-medium` (500) | MATCH  |
| line-height   | 34px                   | 34px                        | MATCH  |
| margin-top    | 10px                   | 10px                        | MATCH  |
| margin-bottom | 10px                   | 10px                        | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 109-115
**Hugo Source:** `_typography.scss` lines 51-58

#### H6

| Property      | Webflow                | Hugo                        | Status |
|---------------|------------------------|-----------------------------|--------|
| font-family   | Inherited (Montserrat) | Inherited                   | MATCH  |
| font-size     | 16px                   | 16px                        | MATCH  |
| font-weight   | 500                    | `$font-weight-medium` (500) | MATCH  |
| line-height   | 28px                   | 28px                        | MATCH  |
| margin-top    | 10px                   | 10px                        | MATCH  |
| margin-bottom | 10px                   | 10px                        | MATCH  |

**Webflow Source:** `pikeandwest.webflow.css` lines 117-123
**Hugo Source:** `_typography.scss` lines 60-67

### 3.3 Navigation Items

| Property            | Webflow                                 | Hugo                        | Status      |
|---------------------|-----------------------------------------|-----------------------------|-------------|
| font-family         | `Raleway Variablefont Wght, sans-serif` | `$font-primary` (Raleway)   | MATCH       |
| font-size (desktop) | 12px                                    | 12px                        | MATCH       |
| font-size (1920px+) | 16px                                    | Not implemented             | DISCREPANCY |
| font-weight         | 500                                     | `$font-weight-medium` (500) | MATCH       |
| letter-spacing      | 0.1em                                   | 0.1em                       | MATCH       |
| text-transform      | uppercase                               | uppercase                   | MATCH       |
| line-height         | 20px                                    | 20px                        | MATCH       |

**Webflow Source:** `pikeandwest.webflow.css` lines 585-600, 2516-2518
**Hugo Source:** `_header.scss` lines 106-116

### 3.4 Paragraph Variants

| Variant             | Webflow               | Hugo              | Status                        |
|---------------------|-----------------------|-------------------|-------------------------------|
| `.paragraph-tiny`   | 12px / 20px           | `.text-sm` (14px) | DISCREPANCY                   |
| `.paragraph-bigger` | 20px / 34px           | `.text-lg` (20px) | PARTIAL (line-height differs) |
| `.paragraph-small`  | 14px / 26px           | `.text-sm` (14px) | PARTIAL (line-height differs) |
| `.paragraph-light`  | opacity: 0.6, #434345 | Not implemented   | MISSING                       |

**Webflow Source:** `pikeandwest.webflow.css` lines 319-340, 478-483, 532-541
**Hugo Source:** `_typography.scss` lines 70-80

---

## 4. Discrepancies Summary

### 4.1 Critical Issues

| Issue                      | Webflow               | Hugo       | File:Line      | Impact                                  |
|----------------------------|-----------------------|------------|----------------|-----------------------------------------|
| Missing Oswald font        | Loaded via WebFont.js | Not loaded | `head.html:48` | `.text-f-13` class broken               |
| Missing Montserrat weights | 100-900               | 300-600    | `head.html:48` | Some bold/light variants may not render |
| Unused Playfair Display    | Not used              | Loaded     | `head.html:48` | Unnecessary bandwidth                   |

### 4.2 Minor Issues

| Issue                    | Webflow | Hugo         | File:Line                | Impact                         |
|--------------------------|---------|--------------|--------------------------|--------------------------------|
| Nav font-size at 1920px+ | 16px    | 12px         | `_header.scss:108`       | Nav text smaller on ultra-wide |
| `.paragraph-tiny` size   | 12px    | 14px         | `_typography.scss:71`    | Slightly larger tiny text      |
| Paragraph line-heights   | Various | Not matching | `_typography.scss:70-80` | Subtle spacing differences     |
| `.paragraph-light` class | Defined | Missing      | N/A                      | Opacity styling unavailable    |

---

## 5. Recommended Fixes

### 5.1 High Priority

#### Fix 1: Add Oswald Font

**File:** `/layouts/partials/head.html` line 48

**Current:**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

**Recommended:**

```html
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Oswald:wght@200;300;400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

**Rationale:** Oswald is used for `.text-f-13` class in Webflow.

#### Fix 2: Remove Unused Playfair Display

**File:** `/layouts/partials/head.html` line 48

Remove `family=Playfair+Display:wght@400;500;600;700` from the Google Fonts URL - it's not used in the Webflow source.

#### Fix 3: Add Oswald to Variables

**File:** `/assets/scss/_variables.scss` line 25

**Add:**

```scss
$font-accent: 'Oswald', sans-serif; // Used for .text-f-13 elements
```

### 5.2 Medium Priority

#### Fix 4: Add Navigation Font Size for Ultra-Wide

**File:** `/assets/scss/_header.scss`

**Add after line 150:**

```scss
// Ultra-wide responsive (min-width: 1920px)
@media (min-width: $breakpoint-2xl) {
  .header {
    &__link {
      font-size: 16px; // Webflow: .navigation-item at 1920px
    }
  }
}
```

#### Fix 5: Add Missing Paragraph Variants

**File:** `/assets/scss/_typography.scss`

**Add after line 80:**

```scss
// Paragraph variants (Webflow exact values)
.paragraph-tiny {
  font-size: 12px;  // Webflow: 12px
  line-height: 20px; // Webflow: 20px
}

.paragraph-bigger {
  font-size: 20px;  // Webflow: 20px
  font-weight: $font-weight-regular;
  line-height: 34px; // Webflow: 34px
  margin-bottom: 10px;
}

.paragraph-small {
  font-size: 14px;  // Webflow: 14px
  line-height: 26px; // Webflow: 26px
}

.paragraph-light {
  opacity: 0.6;
  color: $color-medium-gray; // #434345
  text-align: left;
  letter-spacing: 0;
}

.paragraph-bigger.cc-bigger-light {
  @extend .paragraph-bigger;
  @extend .paragraph-light;
  font-family: $font-primary; // Raleway
}
```

### 5.3 Low Priority

#### Fix 6: Expand Montserrat Weights (Optional)

If any content uses extreme weights (100-200, 700-900), update Google Fonts URL:

**File:** `/layouts/partials/head.html` line 48

```html
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&..."
  rel="stylesheet"
/>
```

**Note:** Only add weights that are actually used to minimize bandwidth.

---

## 6. Self-Hosted Fonts Status

| Font                      | Location                                             | Format            | Status |
|---------------------------|------------------------------------------------------|-------------------|--------|
| Le Mores Collection Serif | `/static/fonts/Le-Mores-Collection-Serif.ttf`        | TrueType          | OK     |
| Raleway Variable          | `/static/fonts/Raleway-VariableFont_wght.ttf`        | TrueType Variable | OK     |
| Raleway Italic Variable   | `/static/fonts/Raleway-Italic-VariableFont_wght.ttf` | TrueType Variable | OK     |

**Note:** Self-hosted fonts are correctly configured. The `@font-face` declarations in `_fonts.scss` match the files in `/static/fonts/`.

---

## 7. Conclusion

The Hugo typography implementation closely matches Webflow with **all heading styles (h1-h6) and body text properly aligned**. The main gaps are:

1. **Oswald font missing** - Required for `.text-f-13` navigation elements
2. **Unused Playfair Display loaded** - Should be removed
3. **Ultra-wide nav font size** - Missing 16px at 1920px+
4. **Paragraph variant classes** - Several Webflow-specific classes not ported

The recommended fixes are straightforward and should resolve all typography discrepancies.
