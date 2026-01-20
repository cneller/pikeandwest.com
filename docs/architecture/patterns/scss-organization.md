# SCSS Organization

How SCSS is structured in Pike & West Hugo theme.

## File Structure

```text
assets/scss/
├── main.scss           # Entry point, imports all partials
├── _variables.scss     # Design tokens (colors, fonts, spacing)
├── _base.scss          # Reset, body, container, utilities
├── _typography.scss    # Heading styles, text utilities
├── _buttons.scss       # Button variants
├── _animations.scss    # Keyframes, animation utilities
├── _header.scss        # Header, nav, hamburger
├── _footer.scss        # Footer layout
├── _hero.scss          # Homepage hero
├── _gallery.scss       # Venue gallery carousel
├── _events.scss        # Event types grid
├── _about.scss         # About section
├── _cta-banner.scss    # CTA banner section
├── _contact.scss       # Contact page
├── _forms.scss         # Form embeds
└── _utilities.scss     # Spacing, display utilities
```

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
```

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
