# ADR-003: Hero Section Layout

**Status:** Accepted
**Date:** 2026-01-20

## Context

The hero section needed to match Webflow's exact layout while working with Hugo's asset pipeline. Key requirements:

- Full-width background image
- Content positioned left with gradient overlay
- Responsive height that shows content peek below fold

## Decision

Use viewport-relative heights with breakpoint adjustments:

- Desktop: `75vh`
- Tablet (991px): `65vh`
- Mobile (767px): `60vh`

## Consequences

- **Positive:** Consistent content peek across devices
- **Positive:** Webflow visual parity achieved
- **Negative:** Fixed vh values may not suit all content lengths
- **Neutral:** Users see ~25% of next section on desktop

## Implementation Notes

### Height Values

```scss
.hero {
  height: 75vh;

  @media (max-width: $breakpoint-lg) {
    height: 65vh;
  }

  @media (max-width: $breakpoint-md) {
    height: 60vh;
  }
}
```

### Gradient Overlay

```scss
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    transparent 100%
  );
}
```

### Content Positioning

```scss
.hero__content {
  position: relative;
  z-index: 1;
  max-width: 600px;
  padding: 2rem;
}
```
