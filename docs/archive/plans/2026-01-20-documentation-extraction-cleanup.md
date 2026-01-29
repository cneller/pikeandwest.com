# Documentation Extraction & Cleanup Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract institutional knowledge from completed plans before deletion, creating permanent documentation in CLAUDE.md and docs/architecture/.

**Architecture:** Two-tier documentation - quick reference in CLAUDE.md, detailed ADRs and patterns in docs/architecture/.

---

## Phase 1: Create Documentation Infrastructure

### Task 1.1: Create Directory Structure

**Files:**

- Create: `docs/architecture/decisions/`
- Create: `docs/architecture/patterns/`
- Create: `docs/architecture/decisions/_template.md`

**Step 1: Create directories**

```bash
mkdir -p docs/architecture/decisions docs/architecture/patterns
```

**Step 2: Create ADR template**

Create `docs/architecture/decisions/_template.md`:

```markdown
# ADR-XXX: [Title]

**Status:** Accepted
**Date:** YYYY-MM-DD
**Supersedes:** (if applicable)

## Context

What problem were we solving? What constraints existed?

## Decision

What did we choose to do?

## Consequences

- **Positive:** Benefits gained
- **Negative:** Tradeoffs accepted
- **Neutral:** Side effects

## Implementation Notes

Key code patterns or gotchas discovered during implementation.
```

**Step 3: Commit**

```bash
git add docs/architecture/
git commit -m "docs: create architecture documentation structure"
```

---

## Phase 2: Extract Knowledge from Completed Plans

### Task 2.1: Create ADR-001 Sticky Header

**Source:** `docs/plans/2026-01-19-sticky-header-migration.md`

**Files:**

- Create: `docs/architecture/decisions/ADR-001-sticky-header.md`

**Step 1: Create ADR-001**

Create `docs/architecture/decisions/ADR-001-sticky-header.md`:

````markdown
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
````

**Files changed:**

- `_header.scss`: `position: fixed` → `position: sticky`
- `_base.scss`: Removed `padding-top: $header-height` from main
- `_hero.scss`: Removed `margin-top: -$header-height`
- `_blog-hero.scss`: Removed `margin-top: -$header-height`

````text

**Step 2: Commit**

```bash
git add docs/architecture/decisions/ADR-001-sticky-header.md
git commit -m "docs: add ADR-001 sticky header decision"
````

---

### Task 2.2: Create ADR-002 Hamburger Animations

**Source:** `docs/plans/2026-01-20-hamburger-*.md` (5 files)

**Files:**

- Create: `docs/architecture/decisions/ADR-002-hamburger-animations.md`

**Step 1: Create ADR-002**

Create `docs/architecture/decisions/ADR-002-hamburger-animations.md`:

````markdown
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
````

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

````text

**Step 2: Commit**

```bash
git add docs/architecture/decisions/ADR-002-hamburger-animations.md
git commit -m "docs: add ADR-002 hamburger animations decision"
````

---

### Task 2.3: Create ADR-003 Hero Layout

**Source:** `docs/plans/2026-01-20-hero-webflow-parity.md`

**Files:**

- Create: `docs/architecture/decisions/ADR-003-hero-layout.md`

**Step 1: Create ADR-003**

Create `docs/architecture/decisions/ADR-003-hero-layout.md`:

````markdown
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
````

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

````text

**Step 2: Commit**

```bash
git add docs/architecture/decisions/ADR-003-hero-layout.md
git commit -m "docs: add ADR-003 hero layout decision"
````

---

### Task 2.4: Create ADR-004 Responsive Breakpoints

**Source:** `docs/plans/2026-01-19-header-hamburger-breakpoint.md`

**Files:**

- Create: `docs/architecture/decisions/ADR-004-responsive-breakpoints.md`

**Step 1: Create ADR-004**

Create `docs/architecture/decisions/ADR-004-responsive-breakpoints.md`:

````markdown
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
````

### Usage Patterns

```scss
// Mobile-first (min-width) - styles apply at breakpoint and above
@media (min-width: $breakpoint-xl) { /* 1280px+ */ }

// Desktop-first (max-width) - styles apply at breakpoint and below
@media (max-width: $breakpoint-lg) { /* 991px and below */ }
```

````text

**Step 2: Commit**

```bash
git add docs/architecture/decisions/ADR-004-responsive-breakpoints.md
git commit -m "docs: add ADR-004 responsive breakpoints decision"
````

---

### Task 2.5: Create Animation Patterns Doc

**Source:** Hamburger plans

**Files:**

- Create: `docs/architecture/patterns/animation-patterns.md`

**Step 1: Create animation patterns**

Create `docs/architecture/patterns/animation-patterns.md`:

````markdown
# Animation Patterns

Reusable animation techniques used throughout Pike & West.

## Elastic Easing

For playful, luxury-feeling animations:

```scss
$easing-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);

// Usage
transition: transform 0.4s $easing-elastic;
````

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

````text

**Step 2: Commit**

```bash
git add docs/architecture/patterns/animation-patterns.md
git commit -m "docs: add animation patterns reference"
````

---

### Task 2.6: Create SCSS Organization Pattern Doc

**Source:** `docs/plans/2025-01-15-hugo-migration.md`

**Files:**

- Create: `docs/architecture/patterns/scss-organization.md`

**Step 1: Create SCSS organization doc**

Create `docs/architecture/patterns/scss-organization.md`:

```markdown
# SCSS Organization

How SCSS is structured in Pike & West Hugo theme.

## File Structure

```

assets/scss/
├── main.scss # Entry point, imports all partials
├── \_variables.scss # Design tokens (colors, fonts, spacing)
├── \_base.scss # Reset, body, container, utilities
├── \_typography.scss # Heading styles, text utilities
├── \_buttons.scss # Button variants
├── \_animations.scss # Keyframes, animation utilities
├── \_header.scss # Header, nav, hamburger
├── \_footer.scss # Footer layout
├── \_hero.scss # Homepage hero
├── \_gallery.scss # Venue gallery carousel
├── \_events.scss # Event types grid
├── \_about.scss # About section
├── \_cta-banner.scss # CTA banner section
├── \_contact.scss # Contact page
├── \_forms.scss # Form embeds
└── \_utilities.scss # Spacing, display utilities

````python

## Import Order

In `main.scss`:

```scss
// 1. Variables first (no CSS output)
@import 'variables';

// 2. Base styles
@import 'base';

// 3. Typography
@import 'typography';

// 4. Components (alphabetical)
@import 'about';
@import 'animations';
@import 'buttons';
@import 'contact';
@import 'cta-banner';
@import 'events';
@import 'footer';
@import 'forms';
@import 'gallery';
@import 'header';
@import 'hero';

// 5. Utilities last (highest specificity)
@import 'utilities';
````

## Variable Naming

```scss
// Colors: $color-{name}
$color-gold: #AA6E0B;
$color-cream: #FFF7E1;
$color-black: #000000;

// Spacing: $spacing-{size}
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;

// Breakpoints: $breakpoint-{size}
$breakpoint-sm: 479px;
$breakpoint-md: 767px;
$breakpoint-lg: 991px;

// Z-index: $z-index-{element}
$z-index-header: 200;
$z-index-modal: 300;
```

## BEM Naming

Use BEM for component classes:

```scss
.block {}
.block__element {}
.block__element--modifier {}

// Example
.header {}
.header__logo {}
.header__nav {}
.header__link {}
.header__link--primary {}
```

## Breakpoint Usage

```scss
// Desktop-first (most common for this project)
.element {
  font-size: 2rem; // Desktop default

  @media (max-width: $breakpoint-lg) {
    font-size: 1.5rem; // Tablet
  }

  @media (max-width: $breakpoint-md) {
    font-size: 1.25rem; // Mobile
  }
}
```

````text

**Step 2: Commit**

```bash
git add docs/architecture/patterns/scss-organization.md
git commit -m "docs: add SCSS organization pattern reference"
````

---

## Phase 3: Update CLAUDE.md

### Task 3.1: Add Architecture Decisions Table

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Add Architecture Decisions section after "Responsive Breakpoints"**

Find the "Responsive Breakpoints" section (around line 70) and add after the usage patterns code block:

```markdown
## Architecture Decisions

Key decisions made during development. Full details in `docs/architecture/decisions/`.

| Decision             | Choice             | Rationale                                                                                                                                        |
|----------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| Header positioning   | `position: sticky` | Eliminates padding/margin offset hacks ([ADR-001](docs/architecture/decisions/ADR-001-sticky-header.md))                                         |
| Hamburger animation  | 3D Y-axis flip     | Luxury brand feel; elastic easing `cubic-bezier(0.68, -0.6, 0.32, 1.6)` ([ADR-002](docs/architecture/decisions/ADR-002-hamburger-animations.md)) |
| Hamburger breakpoint | 991px              | Webflow alignment; nav buttons visible on tablets ([ADR-004](docs/architecture/decisions/ADR-004-responsive-breakpoints.md))                     |
| Hero height          | 75vh/65vh/60vh     | Shows content peek below fold; Webflow parity ([ADR-003](docs/architecture/decisions/ADR-003-hero-layout.md))                                    |
| Breakpoints          | Webflow-aligned    | 479/767/991/1280/1920px for pixel-perfect parity ([ADR-004](docs/architecture/decisions/ADR-004-responsive-breakpoints.md))                      |
```

**Step 2: Add Implementation Patterns section**

Add after Architecture Decisions:

````markdown
## Implementation Patterns

Quick reference for common patterns. Full details in `docs/architecture/patterns/`.

### 3D CSS Animation

```scss
.container { perspective: 200px; }
.child {
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
.child.open { transform: rotateY(180deg); }
````

### Sticky Header

```scss
.header {
  position: sticky;
  top: 0;
  z-index: $z-index-header;
}
// No offset hacks needed on content
```

See also: [Animation Patterns](docs/architecture/patterns/animation-patterns.md) | [SCSS Organization](docs/architecture/patterns/scss-organization.md)

````text

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add architecture decisions and patterns to CLAUDE.md"
````

---

## Phase 4: Execute Cleanup

### Task 4.1: Delete Completed Plan Files

After documentation extraction is complete, delete these files:

**Hamburger Plans (5 files):**

```bash
rm docs/plans/2026-01-20-hamburger-3d-flip.md
rm docs/plans/2026-01-20-hamburger-enhanced-animations.md
rm docs/plans/2026-01-20-hamburger-menu-animation.md
rm docs/plans/2026-01-19-header-hamburger-breakpoint.md
rm docs/plans/2026-01-20-close-menu-on-resize.md
```

**Hero/Header Plans (2 files):**

```bash
rm docs/plans/2026-01-20-hero-webflow-parity.md
rm docs/plans/2026-01-19-sticky-header-migration.md
```

**Legacy Infrastructure Plans (4 files):**

```bash
rm docs/plans/2025-01-15-backstopjs-visual-regression-skill.md
rm docs/plans/2025-01-15-hugo-migration.md
rm docs/plans/2025-01-15-visual-regression-iteration.md
rm docs/plans/2025-01-16-cloudflare-pages-github-actions.md
```

**Early January Plans (6 files):**

```bash
rm docs/plans/2026-01-15-style-comparison-design.md
rm docs/plans/2026-01-16-data-file-migration.md
rm docs/plans/2026-01-16-homepage-style-sync.md
rm docs/plans/2026-01-16-webflow-scss-audit-alignment.md
rm docs/plans/2026-01-16-sitepins-cms-preparation.md
rm docs/plans/2026-01-19-webflow-mcp-hugo-migration.md
```

**Commit:**

```bash
git add -A
git commit -m "chore: remove completed plan files (knowledge extracted to docs/architecture/)"
```

### Task 4.2: Delete Cleanup Audit File

```bash
rm docs/cleanup-audit-2026-01-20.md
git add -A
git commit -m "chore: remove cleanup audit file"
```

---

## Summary

| Phase                   | Tasks   | Output                                     |
|-------------------------|---------|--------------------------------------------|
| 1. Infrastructure       | 1 task  | `docs/architecture/` structure             |
| 2. Knowledge Extraction | 6 tasks | 4 ADRs + 2 pattern docs                    |
| 3. CLAUDE.md Update     | 1 task  | Architecture Decisions + Patterns sections |
| 4. Cleanup              | 2 tasks | 17 files deleted                           |

**Total: 10 tasks**
