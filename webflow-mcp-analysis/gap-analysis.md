# Pike & West: Webflow to Hugo Gap Analysis

**Generated:** 2026-01-20
**Source:** Webflow MCP Designer API extraction + audit subagents

## Executive Summary

The Hugo implementation is well-aligned with the Webflow source in most areas. The primary gaps requiring attention are:

1. **HIGH PRIORITY:** Header hamburger menu breakpoint (767px vs 991px)
2. **HIGH PRIORITY:** Missing Oswald font
3. **MEDIUM:** Ultra-wide (1920px+) responsive styles incomplete
4. **LOW:** Minor typography variant classes not ported

## Gap Categories

### 1. Responsive Breakpoints

| Issue                    | Webflow | Hugo    | Priority | File           |
|--------------------------|---------|---------|----------|----------------|
| Hamburger menu trigger   | 991px   | 767px   | **HIGH** | `_header.scss` |
| Nav font-size at 1920px+ | 16px    | 12px    | MEDIUM   | `_header.scss` |
| Logo width at 1920px+    | 20%/25% | Not set | LOW      | `_header.scss` |
| Hero title at 1920px+    | 60px    | Not set | LOW      | `_hero.scss`   |

**Fix Required:**

```scss
// _header.scss - Change hamburger breakpoint
&__hamburger {
  @media (max-width: $breakpoint-lg) { // Changed from $breakpoint-md
    display: flex;
  }
}

&__nav {
  @media (max-width: $breakpoint-lg) { // Changed from $breakpoint-md
    display: none;
  }
}
```

### 2. Typography

| Issue              | Webflow               | Hugo              | Priority | File               |
|--------------------|-----------------------|-------------------|----------|--------------------|
| Oswald font        | Loaded via WebFont.js | Not loaded        | **HIGH** | `head.html`        |
| Playfair Display   | Not used              | Loaded (wasteful) | MEDIUM   | `head.html`        |
| Montserrat weights | 100-900               | 300-600 only      | LOW      | `head.html`        |
| `.paragraph-tiny`  | 12px/20px             | `.text-sm` (14px) | LOW      | `_typography.scss` |
| `.paragraph-light` | opacity: 0.6          | Missing           | LOW      | `_typography.scss` |

**Fix Required:**

```html
<!-- Replace Playfair Display with Oswald in head.html -->
<link
  href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Oswald:wght@200;300;400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap"
  rel="stylesheet"
/>
```

```scss
// Add to _variables.scss
$font-accent: 'Oswald', sans-serif;
```

### 3. Color Variables

| Issue              | Status  | Notes                          |
|--------------------|---------|--------------------------------|
| PW Black (#434345) | ALIGNED | Hugo uses `$color-medium-gray` |
| PW Gold (#aa6e0b)  | ALIGNED | Hugo uses `$color-gold`        |
| PW Cream (#fff7e1) | ALIGNED | Hugo uses `$color-cream`       |

**No fixes required** - Hugo SCSS colors match Webflow exactly.

### 4. Custom Code

| Component     | Webflow        | Hugo                 | Status                |
|---------------|----------------|----------------------|-----------------------|
| GTM Container | GTM-P8XR8C5S   | GTM-P8XR8C5S         | ALIGNED               |
| Typekit       | jxr6fkv        | Self-hosted Le Mores | ALIGNED (better)      |
| WebFont.js    | Used for fonts | Not used             | OK (link tags better) |

**No fixes required** - Hugo approach is equivalent or improved.

### 5. Assets

| Category     | Webflow Count | Notes               |
|--------------|---------------|---------------------|
| Total Assets | 79            | All catalogued      |
| SVG Icons    | 14            | UI elements, arrows |
| Brand PNGs   | 5             | Logos, favicon      |
| Event Icons  | 6             | Category icons      |
| Venue Photos | 19+           | JPEG photography    |

**Recommendation:** Verify all venue photos are present in Hugo `static/images/`.

## Priority Fix List

### High Priority (Do First)

1. **Fix hamburger breakpoint** - Change from `$breakpoint-md` (767px) to `$breakpoint-lg` (991px)
   - File: `assets/scss/_header.scss`
   - Lines: ~52-54, ~103-110

2. **Add Oswald font** - Replace Playfair Display in Google Fonts URL
   - File: `layouts/partials/head.html`
   - Line: ~48

3. **Add $font-accent variable** - For Oswald usage
   - File: `assets/scss/_variables.scss`
   - Line: ~25

### Medium Priority

4. **Add ultra-wide nav styling** - 16px font at 1920px+
   - File: `assets/scss/_header.scss`
   - Add media query for `$breakpoint-2xl`

5. **Add paragraph variant classes** - `.paragraph-tiny`, `.paragraph-light`
   - File: `assets/scss/_typography.scss`
   - Add after line 80

### Low Priority

6. **Expand Montserrat weights** (if needed for specific content)
7. **Add hero ultra-wide styles** (60px title at 1920px+)
8. **Verify all venue images migrated**

## Audit Report Locations

| Audit          | Location                                         |
|----------------|--------------------------------------------------|
| SCSS Variables | `docs/audits/2026-01-20-scss-variables-audit.md` |
| Breakpoints    | `docs/audits/2026-01-20-breakpoints-audit.md`    |
| Typography     | `docs/audits/2026-01-20-typography-audit.md`     |

## Webflow MCP Extraction Files

| Data               | Location                                           |
|--------------------|----------------------------------------------------|
| Site Configuration | `webflow-mcp-analysis/site/configuration.md`       |
| Page Inventory     | `webflow-mcp-analysis/pages/inventory.md`          |
| Design Variables   | `webflow-mcp-analysis/styles/design-variables.md`  |
| All Styles (raw)   | `webflow-mcp-analysis/styles/all-classes-raw.json` |
| Homepage Elements  | `webflow-mcp-analysis/elements/homepage-raw.json`  |
| Asset Inventory    | `webflow-mcp-analysis/assets/inventory.md`         |
| Custom Code        | `webflow-mcp-analysis/custom-code/`                |

## Next Steps

1. Apply HIGH priority fixes
2. Run visual regression test (BackstopJS)
3. Apply MEDIUM priority fixes as needed
4. Verify mobile/tablet hamburger menu behavior
5. Test at 1920px+ viewport for ultra-wide styling
