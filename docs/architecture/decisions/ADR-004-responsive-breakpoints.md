# ADR-004: Responsive Breakpoints

**Status:** Accepted
**Date:** 2026-01-19

## Context

Breakpoints needed to align with Webflow export for visual parity. Webflow uses specific breakpoint values that differ from common frameworks (Bootstrap, Tailwind).

## Decision

Align breakpoints exactly with Webflow:

| Variable          | Value  | Webflow Query       | Description      |
|-------------------|--------|---------------------|------------------|
| `$breakpoint-sm`  | 479px  | `max-width: 479px`  | Mobile portrait  |
| `$breakpoint-md`  | 767px  | `max-width: 767px`  | Mobile landscape |
| `$breakpoint-lg`  | 991px  | `max-width: 991px`  | Tablet           |
| `$breakpoint-xl`  | 1280px | `min-width: 1280px` | Large desktop    |
| `$breakpoint-2xl` | 1920px | `min-width: 1920px` | Ultra-wide       |

## Consequences

- **Positive:** Pixel-perfect Webflow parity
- **Positive:** Easier CSS comparison during migration
- **Negative:** Non-standard breakpoints may confuse developers familiar with other frameworks
- **Neutral:** Breakpoints are project-specific anyway

## Implementation Notes

### Hamburger Visibility

Hamburger shows at 991px (tablet), not 767px (mobile):

```scss
.header__hamburger {
  display: none;

  @media (max-width: $breakpoint-lg) {
    display: block;
  }
}

.header__nav-buttons {
  @media (max-width: $breakpoint-lg) {
    display: none;
  }
}
```

### Usage Patterns

```scss
// Mobile-first (min-width) - styles apply at breakpoint and above
@media (min-width: $breakpoint-xl) { /* 1280px+ */ }

// Desktop-first (max-width) - styles apply at breakpoint and below
@media (max-width: $breakpoint-lg) { /* 991px and below */ }

// For min-width at standard breakpoints, add 1px
@media (min-width: $breakpoint-md + 1) { /* 768px+ */ }
```
