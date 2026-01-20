# ADR-001: Sticky Header Positioning

**Status:** Accepted
**Date:** 2026-01-19

## Context

The header was initially implemented with `position: fixed`, which required:

- Manual `padding-top` offset on main content
- Negative `margin-top` hacks on hero sections
- Separate offsets for homepage hero and blog hero

These hacks were fragile and required coordination across multiple SCSS files.

## Decision

Switch header from `position: fixed` to `position: sticky`.

## Consequences

- **Positive:** Header stays in document flow; no offset hacks needed
- **Positive:** Simpler CSS maintenance; single source of truth
- **Positive:** Better browser support for modern sticky positioning
- **Negative:** Hero background no longer extends behind header (acceptable tradeoff)
- **Neutral:** Same visual scroll behavior for users

## Implementation Notes

```scss
.header {
  position: sticky;
  top: 0;
  z-index: $z-index-header;
  // No padding-top offset needed on main content
  // No negative margin hacks on hero sections
}
```

**Files changed:**

- `_header.scss`: `position: fixed` → `position: sticky`
- `_base.scss`: Removed `padding-top: $header-height` from main
- `_hero.scss`: Removed `margin-top: -$header-height`
- `_blog-hero.scss`: Removed `margin-top: -$header-height`
