# ADR-002: Hamburger Menu Animations

**Status:** Accepted
**Date:** 2026-01-20

## Context

The hamburger menu needed animations that:

1. Match the luxury brand aesthetic
2. Provide clear visual feedback on state change
3. Feel polished and intentional, not generic

## Decision

Implement a multi-layered animation system:

1. **Hover state (closed):** Staggered spread + line growth + subtle glow
2. **Open transition:** 3D Y-axis flip + squeeze-to-center + rotate-to-X
3. **Color change:** Gray → Gold on open state
4. **Hover state (open):** X lines grow slightly + color darkens

## Consequences

- **Positive:** Distinctive, memorable interaction
- **Positive:** Clear state communication to users
- **Positive:** Matches luxury brand positioning
- **Negative:** More complex CSS than simple hamburger
- **Negative:** Requires `prefers-reduced-motion` handling
- **Neutral:** Animation duration ~0.4s feels responsive

## Implementation Notes

### 3D Flip Technique

```scss
// Container provides depth perception
.header__hamburger {
  perspective: 200px;
}

// Inner element preserves 3D space
.header__hamburger-inner {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}

// Open state adds Y-axis rotation
.header__hamburger[aria-expanded='true'] .header__hamburger-inner {
  transform: translate(-50%, -50%) rotateY(180deg);
}
```

### Elastic Easing

`cubic-bezier(0.68, -0.6, 0.32, 1.6)` - Creates overshoot effect:

- `-0.6` pulls back before forward motion
- `1.6` overshoots target then settles

### Stagger Timing

```scss
// Top bar moves first (0s delay)
&::before {
  transition: top 0.15s ease, transform 0.25s ease 0.12s;
}

// Bottom bar follows (0.05s delay on spread)
&::after {
  transition: bottom 0.15s ease 0.05s, transform 0.25s ease 0.12s;
}
```

### Color Values

- Closed state: `$color-medium-gray` (#434345)
- Open state: `$color-gold` (#AA6E0B)
- Hover glow: `drop-shadow(0 0 3px rgba($color-gold, 0.4))`

### Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  .header__hamburger-inner,
  .header__hamburger-inner::before,
  .header__hamburger-inner::after {
    transition: none;
  }
}
```
