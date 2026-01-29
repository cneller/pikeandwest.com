# Plan: Blog Styling Integration

**Date:** 2026-01-20
**Status:** Draft - Awaiting Approval

## Problem Summary

The blog post styling has several inconsistencies with the rest of the site:

1. **Missing list bullets** - `ul`/`ol` elements have no visible bullets/numbers
2. **Title line-height too large** - Multi-line blog titles have excessive vertical spacing
3. **Font inconsistencies** - Blog headings use different fonts than site headings
4. **Missing prose styles** - Code blocks, nested lists, hr, strong/em need attention

## Root Cause Analysis

### 1. List Styling Issue

**Location:** `assets/scss/_base.scss:50-55`

```scss
ul,
ol {
  margin: 0;
  padding: 0;
  list-style: none;  // <-- Globally removes all bullets/numbers
}
```

This is a common reset pattern (good for nav menus, footers) but it removes styling from content lists. The `_blog.scss` adds back margin/padding but never restores `list-style-type`.

**Webflow reference** (`webflow-export/css/pikeandwest.webflow.css:144-148`):

```css
ul {
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 40px;
  list-style-type: disc;
}
```

### 2. Title Line-Height Issue

**Location:** `assets/scss/_blog-hero.scss:46-65`

The `.blog-hero__title` has no explicit `line-height`. It may inherit from global `h1` which has `line-height: 62px` (fixed pixel value) - this is excessive for the 2.5-3rem font sizes used.

**Fix:** Add proportional `line-height: 1.2` or similar to `.blog-hero__title`.

### 3. Font Inconsistencies

**Current state:**

| Element            | Current Font                                | Should Be       |
|--------------------|---------------------------------------------|-----------------|
| Site h1/h2         | `$font-display` (Le Mores Collection Serif) | ✓ Correct       |
| Blog hero title    | `$font-display`                             | ✓ Correct       |
| Blog card title    | `$font-primary` (Raleway)                   | `$font-display` |
| Blog content h2/h3 | `$font-primary` (Raleway)                   | `$font-display` |

**Issue:** Blog uses Raleway for headings, but site uses Le Mores Collection Serif.

**Locations:**

- `_blog.scss:112-114` - `.blog-card__title` uses `$font-primary`
- `_blog.scss:182-188` - `.blog-post__content h2` uses `$font-primary`
- `_blog.scss:190-195` - `.blog-post__content h3` uses `$font-primary`

### 4. Missing Prose Styles

These elements need styling within `.blog-post__content`:

- `strong`, `em`, `mark`
- `code`, `pre` (inline and block code)
- Nested lists (`ul ul`, `ol ol`, `ul ol`, `ol ul`)
- `hr` (horizontal rules)
- Tables (if used)

## Implementation Plan

### Phase 1: Fix List Styling (Critical)

**File:** `assets/scss/_blog.scss`

Add list-style restoration within `.blog-post__content`:

```scss
&__content {
  // ... existing styles ...

  ul {
    list-style-type: disc;

    ul {
      list-style-type: circle;  // Nested

      ul {
        list-style-type: square;  // Double nested
      }
    }
  }

  ol {
    list-style-type: decimal;

    ol {
      list-style-type: lower-alpha;  // Nested

      ol {
        list-style-type: lower-roman;  // Double nested
      }
    }
  }
}
```

### Phase 2: Fix Title Line-Height

**File:** `assets/scss/_blog-hero.scss`

Update `.blog-hero__title`:

```scss
&__title {
  // ... existing styles ...
  line-height: 1.15;  // Add proportional line-height
}
```

### Phase 3: Fix Font Consistency

**File:** `assets/scss/_blog.scss`

Change `$font-primary` to `$font-display` for headings:

1. `.blog-card__title` (line ~112): `font-family: $font-display;`
2. `.blog-post__content h2` (line ~182): `font-family: $font-display;`
3. `.blog-post__content h3` (line ~190): `font-family: $font-display;`

### Phase 4: Add Missing Prose Styles

**File:** `assets/scss/_blog.scss`

Add these styles within `.blog-post__content`:

```scss
// Text emphasis
strong, b {
  font-weight: $font-weight-semibold;
}

em, i {
  font-style: italic;
}

mark {
  background-color: rgba($color-gold, 0.2);
  padding: 0.1em 0.2em;
}

// Inline code
code {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875em;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
}

// Code blocks
pre {
  margin: $spacing-lg 0;
  padding: $spacing-md;
  background-color: #1a1b1f;
  color: #f8f8f2;
  border-radius: $border-radius-md;
  overflow-x: auto;

  code {
    background: none;
    padding: 0;
    font-size: $font-size-sm;
    color: inherit;
  }
}

// Horizontal rule
hr {
  margin: $spacing-2xl 0;
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

// Tables (if needed)
table {
  width: 100%;
  margin: $spacing-lg 0;
  border-collapse: collapse;

  th, td {
    padding: $spacing-sm $spacing-md;
    border: 1px solid rgba(0, 0, 0, 0.1);
    text-align: left;
  }

  th {
    background-color: $color-cream;
    font-weight: $font-weight-semibold;
  }
}
```

### Phase 5: Verification

1. Run `hugo server -D` and visually inspect:
   - `/blog/corporate-event-planning-tips-2026/` (has lists)
   - `/blog/fall-baby-shower-inspiration/` (has bold text, lists)
   - Any post with multi-line title
2. Check responsive breakpoints (mobile, tablet, desktop)
3. Verify fonts match rest of site (compare h2 on homepage vs blog)
4. Run lighthouse audit for performance impact

## Files to Modify

| File                          | Changes                               |
|-------------------------------|---------------------------------------|
| `assets/scss/_blog.scss`      | List styles, font fixes, prose styles |
| `assets/scss/_blog-hero.scss` | Title line-height fix                 |

## Risk Assessment

- **Low risk:** All changes are additive/override within scoped selectors
- **No breaking changes:** Base styles remain for nav menus, footers
- **Easily reversible:** Each phase can be tested independently

## Success Criteria

- [ ] Unordered lists show disc bullets
- [ ] Ordered lists show decimal numbers
- [ ] Nested lists have appropriate bullet/number variations
- [ ] Blog titles with multiple lines have reasonable spacing (~1.15 line-height)
- [ ] Blog h2/h3 use Le Mores Collection Serif (matching site headings)
- [ ] Bold text is visibly bolder
- [ ] Code blocks have distinct styling
- [ ] Horizontal rules are visible
- [ ] All changes work at mobile/tablet/desktop breakpoints
