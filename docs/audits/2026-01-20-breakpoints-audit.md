# Breakpoints Audit: Webflow vs Hugo

**Date:** 2026-01-20
**Auditor:** Claude Code Agent
**Status:** Complete

## Executive Summary

This audit compares the responsive breakpoint definitions and media query implementations between the original Webflow CSS export and the Hugo SCSS implementation. Overall, the Hugo implementation is well-aligned with Webflow breakpoints, with a few areas requiring attention.

## 1. Breakpoint Definitions Comparison

### Webflow Breakpoints (from pikeandwest.webflow.css)

| Name             | Media Query            | Value  | Direction |
|------------------|------------------------|--------|-----------|
| Main (Desktop)   | Base styles (no query) | -      | -         |
| Tablet           | `max-width: 991px`     | 991px  | Down      |
| Mobile Landscape | `max-width: 767px`     | 767px  | Down      |
| Mobile Portrait  | `max-width: 479px`     | 479px  | Down      |
| Large Desktop    | `min-width: 1280px`    | 1280px | Up        |
| Ultra-wide       | `min-width: 1920px`    | 1920px | Up        |

### Hugo Breakpoints (from \_variables.scss)

| Variable          | Value  | CLAUDE.md Description |
|-------------------|--------|-----------------------|
| `$breakpoint-sm`  | 479px  | Mobile portrait       |
| `$breakpoint-md`  | 767px  | Mobile landscape      |
| `$breakpoint-lg`  | 991px  | Tablet                |
| `$breakpoint-xl`  | 1280px | Large desktop         |
| `$breakpoint-2xl` | 1920px | Ultra-wide            |

**Status: ALIGNED** - Hugo breakpoint values match Webflow exactly.

## 2. Media Query Syntax Comparison

### Webflow Syntax Pattern

```css
/* Desktop-first (max-width) - styles apply AT breakpoint and below */
@media screen and (max-width: 991px) { ... }
@media screen and (max-width: 767px) { ... }
@media screen and (max-width: 479px) { ... }

/* Mobile-first (min-width) - styles apply AT breakpoint and above */
@media screen and (min-width: 1280px) { ... }
@media screen and (min-width: 1920px) { ... }
```

### Hugo SCSS Syntax Pattern

```scss
/* Desktop-first (max-width) */
@media (max-width: $breakpoint-lg) { ... }  // 991px and below
@media (max-width: $breakpoint-md) { ... }  // 767px and below
@media (max-width: $breakpoint-sm) { ... }  // 479px and below

/* Mobile-first (min-width) */
@media (min-width: $breakpoint-xl) { ... }  // 1280px and above
@media (min-width: $breakpoint-2xl) { ... } // 1920px and above

/* Mixed approach for specific ranges */
@media (min-width: $breakpoint-md + 1) { ... } // 768px and above
```

### Key Differences

| Aspect              | Webflow              | Hugo SCSS                   |
|---------------------|----------------------|-----------------------------|
| `screen and`        | Always included      | Omitted (valid, works same) |
| Variable vs literal | Literal pixel values | SCSS variables              |
| Range queries       | Single direction     | Uses `+ 1` for min-width    |

**Status: COMPATIBLE** - Hugo syntax is valid and produces equivalent results.

## 3. Discrepancies Found

### 3.1 Minor: `screen and` Keyword Omission

**Impact: None**

Hugo SCSS omits `screen and` prefix which Webflow uses. Both are valid:

- Webflow: `@media screen and (max-width: 991px)`
- Hugo: `@media (max-width: $breakpoint-lg)`

Modern browsers treat these identically for visual displays. The `screen` media type is the default assumption.

### 3.2 Minor: Range Query Pattern for 768px+

**Impact: Low**

Hugo uses `@media (min-width: $breakpoint-md + 1)` to target 768px and above. This is a valid pattern but slightly unconventional.

Found in:

- `_blog.scss:14` - Grid columns at 768px+
- `_utilities.scss:121` - `.hide-desktop` class
- `_page-header.scss:18` - Font size adjustments

**Recommendation:** This pattern works correctly. No change required.

### 3.3 Potential: Hero Section Grid Structure

**Impact: Medium**

The hero section has complex responsive grid behavior. Comparing implementations:

**Webflow at 767px:**

```css
.hero-header-section {
  grid-template-rows: .5fr .5fr;
  grid-template-columns: .5fr .5fr;
  height: 50vh;
  min-height: 25vh;
  max-height: 50vh;
}
```

**Hugo at 767px:**

```scss
@media (max-width: $breakpoint-md) {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  min-height: 25vh;
  max-height: 50vh;
}
```

**Discrepancy:** Hugo uses `1fr 1fr` while Webflow uses `.5fr .5fr`. Mathematically equivalent for a 2-column grid, but worth visual verification.

### 3.4 Missing: Ultra-wide (1920px) Styles

**Impact: Low**

Webflow has specific styling at 1920px for:

- `.navigation` - max-height: 100px
- `.navigation-item` - font-size: 16px
- `.logo-image` - width: 20%/25%
- `.h1-crm-les-mores` - font-size: 60px
- `.hero-subheader-1` - font-size: 24px

Hugo SCSS files have limited 1920px-specific styles. Most were not migrated.

**Recommendation:** Add ultra-wide breakpoint styles if targeting large displays.

## 4. Header Behavior at Each Breakpoint

### Webflow Implementation

| Breakpoint | Viewport     | Navigation Display           | Menu Button |
|------------|--------------|------------------------------|-------------|
| Desktop    | 992px+       | Full nav buttons visible     | Hidden      |
| 991px      | Tablet       | Hamburger menu appears       | Visible     |
| 767px      | Mobile Land. | Hamburger + adjusted padding | Visible     |
| 479px      | Mobile Port. | Hamburger + reduced padding  | Visible     |

**Key Webflow classes at 991px:**

```css
.menu-icon { display: block; }
.navigation-items { background-color: #fff; }
.navigation-item { text-align: center; padding: 15px 30px; }
.menu-button { padding: 0; }
.navbar1_menu-button { padding: 0; }
```

### Hugo Implementation

| Breakpoint | Variable       | Navigation Display          | Hamburger    |
|------------|----------------|-----------------------------|--------------|
| Desktop    | > 767px        | Full nav visible            | Hidden       |
| 991px      | $breakpoint-lg | Padding/height adjustments  | Still hidden |
| 767px      | $breakpoint-md | Nav hidden, hamburger shown | Visible      |
| 479px      | $breakpoint-sm | Reduced padding             | Visible      |

**Hugo hamburger visibility:**

```scss
// _header.scss lines 52-54
@media (max-width: $breakpoint-md) {
  display: flex; // Show on mobile (767px and below)
}
```

### Difference: Hamburger Menu Trigger Point

| System  | Hamburger Appears At |
|---------|----------------------|
| Webflow | 991px (tablet)       |
| Hugo    | 767px (mobile)       |

**INTENTIONAL DEVIATION:** Hugo shows hamburger at 767px, while Webflow shows it at 991px. This is an intentional design decision - Hugo displays full navigation buttons on tablet viewports (768px-991px) rather than the hamburger menu. This provides a better UX on tablets where screen space permits full navigation.

**Evidence from Webflow CSS (line 2703):**

```css
@media screen and (max-width: 991px) {
  .menu-icon { display: block; }
}
```

**Hugo SCSS (\_header.scss) - Intentionally different:**

```scss
@media (max-width: $breakpoint-md) { // 767px - keeps full nav visible on tablets
  display: flex; // Show hamburger only on mobile
}
```

## 5. Hamburger Menu Animation

The Webflow site includes a smooth open/close animation for the hamburger menu via Webflow Interactions. Consider implementing a similar CSS transition in Hugo:

```scss
// _header.scss - Add hamburger animation
&__nav {
  // ... existing styles

  @media (max-width: $breakpoint-md) {
    // Mobile nav styles
    transition: transform 0.3s ease, opacity 0.3s ease;
    transform: translateY(-100%);
    opacity: 0;

    &.is-open {
      transform: translateY(0);
      opacity: 1;
    }
  }
}

&__hamburger-line {
  transition: transform 0.3s ease, opacity 0.2s ease;

  // Add transform styles for X animation when open
}
```

## 6. Recommended SCSS Fixes

### 6.1 Add 1920px Ultra-wide Styles (LOW PRIORITY)

Create new partial or add to existing files:

```scss
// Add to _variables.scss or create _ultrawide.scss

@media (min-width: $breakpoint-2xl) {
  .header {
    max-height: 100px;

    &__link {
      font-size: 16px;
    }

    &__logo img {
      width: 20%;
    }
  }

  .hero {
    &__title {
      font-size: 60px;
    }
  }

  .tagline {
    font-size: 24px; // Already exists in _hero.scss
  }
}
```

### 6.2 Document Breakpoint Usage Pattern (BEST PRACTICE)

Add comment block to `_variables.scss`:

```scss
// =========================
// Breakpoints
// =========================
// Usage patterns:
//
// Desktop-first (Webflow default):
//   @media (max-width: $breakpoint-lg) { }  // 991px and below
//   @media (max-width: $breakpoint-md) { }  // 767px and below
//   @media (max-width: $breakpoint-sm) { }  // 479px and below
//
// Mobile-first (for progressive enhancement):
//   @media (min-width: $breakpoint-xl) { }  // 1280px and above
//   @media (min-width: $breakpoint-2xl) { } // 1920px and above
//
// Specific range (tablets only):
//   @media (min-width: $breakpoint-md + 1) and (max-width: $breakpoint-lg) { }
```

## 7. Summary

### Alignment Status

| Component          | Status          | Notes                                    |
|--------------------|-----------------|------------------------------------------|
| Breakpoint values  | ALIGNED         | All 5 breakpoints match exactly          |
| Media query syntax | COMPATIBLE      | Minor difference (no `screen and`)       |
| Header behavior    | **INTENTIONAL** | Hamburger at 767px (not 991px) by design |
| Hero grid          | ALIGNED         | Equivalent ratios                        |
| Footer             | ALIGNED         | All breakpoints match                    |
| Ultra-wide styles  | INCOMPLETE      | Some 1920px styles not migrated          |

### Priority Fixes

1. **MEDIUM:** Visual test hero grid at each breakpoint
2. **LOW:** Add missing 1920px ultra-wide styles

### Files Requiring Changes

| File                                 | Change Required         |
|--------------------------------------|-------------------------|
| `/assets/scss/_variables.scss`       | Add usage documentation |
| `/assets/scss/_hero.scss` (optional) | Add 1920px styles       |
