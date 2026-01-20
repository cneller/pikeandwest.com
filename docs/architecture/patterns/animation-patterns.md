# Animation Patterns

Reusable animation techniques used throughout Pike & West.

## Elastic Easing

For playful, luxury-feeling animations:

```scss
$easing-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);

// Usage
transition: transform 0.4s $easing-elastic;
```

**How it works:**

- `-0.6`: Pulls back slightly before moving forward
- `1.6`: Overshoots target, then settles back

## 3D Transforms

For depth and dimensionality:

```scss
// Parent: create 3D context
.parent {
  perspective: 200px; // Distance from viewer
}

// Child: enable 3D positioning
.child {
  transform-style: preserve-3d;
  backface-visibility: hidden; // Optional: hide back face
}

// Animation: rotate in 3D space
.child.active {
  transform: rotateY(180deg);
}
```

## Staggered Animations

For sequential element reveals:

```scss
// Base transition on all elements
.item {
  transition: transform 0.3s ease;
}

// Stagger with nth-child delays
.item:nth-child(1) { transition-delay: 0s; }
.item:nth-child(2) { transition-delay: 0.05s; }
.item:nth-child(3) { transition-delay: 0.1s; }

// Or use CSS custom properties
.item {
  transition-delay: calc(var(--index) * 0.05s);
}
```

## Hover Glow Effect

Subtle glow on interactive elements:

```scss
.element {
  filter: drop-shadow(0 0 0 transparent);
  transition: filter 0.2s ease;

  &:hover {
    filter: drop-shadow(0 0 3px rgba($color-gold, 0.4));
  }
}
```

## Reduced Motion

Always respect user preferences:

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
