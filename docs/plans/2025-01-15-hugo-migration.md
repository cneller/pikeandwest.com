# Pike & West Hugo Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate pikeandwest.com from Webflow to Hugo while preserving the exact design, functionality, and SEO.

**Architecture:** Custom Hugo theme with SCSS, data-driven content, responsive images via Hugo Pipes, and embedded HoneyBook forms. Static site deployed to Cloudflare Pages.

**Tech Stack:** Hugo Extended v0.146+, SCSS, vanilla JavaScript, Google Fonts, HoneyBook embeds, Google Maps, GTM

---

## Phase 0: Project Setup & Tooling

### Task 0.1: Initialize Hugo Project

**Files:**

- Create: `config/_default/hugo.toml`
- Create: `config/_default/params.toml`
- Create: `config/_default/menus.toml`
- Create: `config/production/hugo.toml`

**Step 1: Verify Hugo installation**

Run: `hugo version`
Expected: `hugo v0.146.0+extended` or higher

If not installed:

```bash
brew install hugo
```

**Step 2: Initialize Hugo site**

```bash
cd /Users/colinneller/Projects/pikeandwest.com
hugo new site . --force
```

**Step 3: Create base configuration**

Create `config/_default/hugo.toml`:

```toml
baseURL = "https://pikeandwest.com/"
languageCode = "en-us"
title = "Pike & West | Germantown Gallery and Event Venue"

[build]
  writeStats = true

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[outputs]
  home = ["HTML", "RSS"]

[sitemap]
  changefreq = "monthly"
  priority = 0.5
```

**Step 4: Create params configuration**

Create `config/_default/params.toml`:

```toml
description = "Pike & West is Germantown's premier art gallery and event venue. Host your wedding, corporate event, birthday, or private party in our elegant space."
author = "Pike & West"

[contact]
  phone = "901.206.5575"
  email = "events@pikeandwest.com"
  address = "2277 West Street"
  city = "Germantown"
  state = "TN"
  zip = "38138"
  hours = "Available by appointment only. Call or email to reserve a tour."
  googleMapsUrl = "https://maps.app.goo.gl/7fNG7K7BEPQKpNzs8"

[social]
  instagram = "https://www.instagram.com/pikeandwest/"
  facebook = "https://www.facebook.com/pikeandwest"

[analytics]
  googleTagManager = "" # Add GTM ID from Webflow

[forms]
  honeyBookContactEmbed = "" # Add HoneyBook embed URL
  honeyBookGalleryEmbed = "" # Add HoneyBook embed URL
```

**Step 5: Create menus configuration**

Create `config/_default/menus.toml`:

```toml
[[main]]
  name = "Contact Us"
  url = "/contact/"
  weight = 1

[[main]]
  name = "Artists"
  url = "/gallery-application/"
  weight = 2

[[footer]]
  name = "Contact Us"
  url = "/contact/"
  weight = 1
```

**Step 6: Create production config**

Create `config/production/hugo.toml`:

```toml
baseURL = "https://pikeandwest.com/"

[minify]
  minifyOutput = true
```

**Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Hugo project with configuration"
```

---

### Task 0.2: Create Directory Structure

**Files:**

- Create: `assets/scss/main.scss`
- Create: `assets/js/main.js`
- Create: `static/.gitkeep`
- Create: `data/.gitkeep`
- Create: `layouts/.gitkeep`
- Create: `content/_index.md`

**Step 1: Create asset directories**

```bash
mkdir -p assets/scss assets/js static/images/logo static/images/venue static/images/icons static/images/about data layouts/partials layouts/_default layouts/page content
```

**Step 2: Create placeholder SCSS entry**

Create `assets/scss/main.scss`:

```scss
// Pike & West Theme Styles
// =========================

// Variables
@import "variables";

// Base
@import "base";

// Components
@import "typography";
@import "buttons";
@import "header";
@import "footer";
@import "hero";
@import "gallery";
@import "events";
@import "about";
@import "cta-banner";
@import "contact";
@import "forms";

// Utilities
@import "utilities";
```

**Step 3: Create placeholder JS entry**

Create `assets/js/main.js`:

```javascript
// Pike & West Theme JavaScript
// ============================

document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initGalleryCarousel();
  initMobileNav();
});

function initGalleryCarousel() {
  // Gallery carousel initialization
}

function initMobileNav() {
  // Mobile navigation toggle
}
```

**Step 4: Create homepage content placeholder**

Create `content/_index.md`:

```markdown
---
title: "Pike & West | Germantown Gallery and Event Venue"
description: "Pike & West is Germantown's premier art gallery and event venue."
---
```

**Step 5: Commit**

```bash
git add .
git commit -m "feat: create directory structure and placeholder files"
```

---

## Phase 1: Design System (SCSS)

### Task 1.1: Create SCSS Variables

**Files:**

- Create: `assets/scss/_variables.scss`

**Step 1: Create variables file**

Create `assets/scss/_variables.scss`:

```scss
// =========================
// Pike & West Design Tokens
// =========================

// Colors
$color-black: #000000;
$color-dark-text: #1A1B1F;
$color-dark-gray: #333333;
$color-medium-gray: #434345;
$color-gold: #AA6E0B;
$color-cream: #FFF7E1;
$color-white: #FFFFFF;

// Color Aliases
$color-primary: $color-gold;
$color-secondary: $color-cream;
$color-text: $color-dark-text;
$color-text-light: $color-medium-gray;
$color-background: $color-white;

// Typography
$font-primary: 'Oswald', sans-serif;
$font-secondary: 'Montserrat', sans-serif;

// Font Weights
$font-weight-light: 300;
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

// Font Sizes
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-md: 1.125rem;   // 18px
$font-size-lg: 1.25rem;    // 20px
$font-size-xl: 1.5rem;     // 24px
$font-size-2xl: 2rem;      // 32px
$font-size-3xl: 2.5rem;    // 40px
$font-size-4xl: 3rem;      // 48px
$font-size-5xl: 4rem;      // 64px

// Spacing
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
$spacing-3xl: 4rem;     // 64px
$spacing-4xl: 6rem;     // 96px

// Breakpoints
$breakpoint-sm: 480px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;

// Container
$container-max-width: 1200px;
$container-padding: $spacing-lg;

// Transitions
$transition-fast: 150ms ease;
$transition-base: 300ms ease;
$transition-slow: 500ms ease;

// Shadows
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

// Border Radius
$border-radius-sm: 2px;
$border-radius-md: 4px;
$border-radius-lg: 8px;

// Z-index
$z-index-dropdown: 100;
$z-index-header: 200;
$z-index-modal: 300;
$z-index-lightbox: 400;
```

**Step 2: Verify SCSS compiles**

Run: `hugo server`
Expected: Server starts without SCSS errors

**Step 3: Commit**

```bash
git add assets/scss/_variables.scss
git commit -m "feat: add SCSS design token variables"
```

---

### Task 1.2: Create Base Styles

**Files:**

- Create: `assets/scss/_base.scss`

**Step 1: Create base styles**

Create `assets/scss/_base.scss`:

```scss
// =========================
// Base Styles
// =========================

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  font-family: $font-secondary;
  font-size: $font-size-base;
  font-weight: $font-weight-regular;
  line-height: 1.6;
  color: $color-text;
  background-color: $color-background;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
  transition: color $transition-fast;

  &:hover {
    color: $color-primary;
  }
}

ul, ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-family: $font-primary;
  font-weight: $font-weight-medium;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

p {
  margin: 0 0 $spacing-md;

  &:last-child {
    margin-bottom: 0;
  }
}

// Container
.container {
  width: 100%;
  max-width: $container-max-width;
  margin: 0 auto;
  padding: 0 $container-padding;
}

// Sections
.section {
  padding: $spacing-3xl 0;

  @media (min-width: $breakpoint-md) {
    padding: $spacing-4xl 0;
  }
}

// Screen reader only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

**Step 2: Commit**

```bash
git add assets/scss/_base.scss
git commit -m "feat: add base SCSS styles"
```

---

### Task 1.3: Create Typography Styles

**Files:**

- Create: `assets/scss/_typography.scss`

**Step 1: Create typography styles**

Create `assets/scss/_typography.scss`:

```scss
// =========================
// Typography
// =========================

// Headings
h1, .h1 {
  font-size: $font-size-3xl;
  letter-spacing: 0.15em;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-4xl;
  }
}

h2, .h2 {
  font-size: $font-size-2xl;
  letter-spacing: 0.12em;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-3xl;
  }
}

h3, .h3 {
  font-size: $font-size-xl;
  letter-spacing: 0.1em;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

h4, .h4 {
  font-size: $font-size-lg;
}

h5, .h5 {
  font-size: $font-size-md;
}

h6, .h6 {
  font-size: $font-size-base;
}

// Body text
.text-sm {
  font-size: $font-size-sm;
}

.text-md {
  font-size: $font-size-md;
}

.text-lg {
  font-size: $font-size-lg;
}

// Text alignment
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

// Text transforms
.uppercase {
  text-transform: uppercase;
}

.lowercase {
  text-transform: lowercase;
}

.capitalize {
  text-transform: capitalize;
}

// Font weights
.font-light {
  font-weight: $font-weight-light;
}

.font-regular {
  font-weight: $font-weight-regular;
}

.font-medium {
  font-weight: $font-weight-medium;
}

.font-semibold {
  font-weight: $font-weight-semibold;
}

.font-bold {
  font-weight: $font-weight-bold;
}

// Tagline style (for hero)
.tagline {
  font-family: $font-primary;
  font-size: $font-size-md;
  font-weight: $font-weight-light;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: $color-cream;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-lg;
  }
}
```

**Step 2: Commit**

```bash
git add assets/scss/_typography.scss
git commit -m "feat: add typography SCSS styles"
```

---

### Task 1.4: Create Button Styles

**Files:**

- Create: `assets/scss/_buttons.scss`

**Step 1: Create button styles**

Create `assets/scss/_buttons.scss`:

```scss
// =========================
// Buttons
// =========================

.btn {
  display: inline-block;
  padding: $spacing-sm $spacing-xl;
  font-family: $font-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-medium;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all $transition-base;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

// Primary button (gold filled)
.btn-primary {
  background-color: $color-gold;
  color: $color-white;
  border-color: $color-gold;

  &:hover {
    background-color: darken($color-gold, 10%);
    border-color: darken($color-gold, 10%);
    color: $color-white;
  }
}

// Secondary button (cream filled)
.btn-secondary {
  background-color: $color-cream;
  color: $color-black;
  border-color: $color-black;

  &:hover {
    background-color: $color-white;
    color: $color-black;
  }
}

// Outline button (gold outline)
.btn-outline {
  background-color: transparent;
  color: $color-gold;
  border-color: $color-gold;

  &:hover {
    background-color: $color-gold;
    color: $color-white;
  }
}

// Outline light (for dark backgrounds)
.btn-outline-light {
  background-color: transparent;
  color: $color-cream;
  border-color: $color-cream;

  &:hover {
    background-color: $color-cream;
    color: $color-black;
  }
}

// Button sizes
.btn-sm {
  padding: $spacing-xs $spacing-md;
  font-size: $font-size-xs;
}

.btn-lg {
  padding: $spacing-md $spacing-2xl;
  font-size: $font-size-base;
}
```

**Step 2: Commit**

```bash
git add assets/scss/_buttons.scss
git commit -m "feat: add button SCSS styles"
```

---

### Task 1.5: Create Remaining SCSS Partials (Placeholders)

**Files:**

- Create: `assets/scss/_header.scss`
- Create: `assets/scss/_footer.scss`
- Create: `assets/scss/_hero.scss`
- Create: `assets/scss/_gallery.scss`
- Create: `assets/scss/_events.scss`
- Create: `assets/scss/_about.scss`
- Create: `assets/scss/_cta-banner.scss`
- Create: `assets/scss/_contact.scss`
- Create: `assets/scss/_forms.scss`
- Create: `assets/scss/_utilities.scss`

**Step 1: Create header styles**

Create `assets/scss/_header.scss`:

```scss
// =========================
// Header
// =========================

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-index-header;
  background-color: $color-white;
  padding: $spacing-md 0;

  &__container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: block;
    height: 40px;

    img {
      height: 100%;
      width: auto;
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: $spacing-md;
  }

  &__link {
    font-family: $font-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: $spacing-sm $spacing-md;
    border: 2px solid transparent;
    transition: all $transition-fast;

    &:hover {
      color: $color-gold;
    }

    &--primary {
      background-color: $color-gold;
      color: $color-white;
      border-color: $color-gold;

      &:hover {
        background-color: darken($color-gold, 10%);
        color: $color-white;
      }
    }

    &--outline {
      border-color: $color-gold;
      color: $color-gold;

      &:hover {
        background-color: $color-gold;
        color: $color-white;
      }
    }
  }
}

// Header offset for fixed header
.has-fixed-header {
  padding-top: 80px;
}
```

**Step 2: Create footer styles**

Create `assets/scss/_footer.scss`:

```scss
// =========================
// Footer
// =========================

.footer {
  background-color: $color-white;
  padding: $spacing-xl 0;
  border-top: 1px solid rgba($color-black, 0.1);

  &__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-md;
    text-align: center;

    @media (min-width: $breakpoint-md) {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  &__logo {
    height: 30px;

    img {
      height: 100%;
      width: auto;
    }
  }

  &__link {
    font-family: $font-primary;
    font-size: $font-size-sm;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-gold;

    &:hover {
      color: darken($color-gold, 10%);
    }
  }

  &__social {
    display: flex;
    gap: $spacing-md;
  }

  &__social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: $color-gold;
    transition: color $transition-fast;

    &:hover {
      color: darken($color-gold, 10%);
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__copyright {
    font-size: $font-size-sm;
    color: $color-text-light;
  }
}
```

**Step 3: Create hero styles**

Create `assets/scss/_hero.scss`:

```scss
// =========================
// Hero Section
// =========================

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      rgba($color-black, 0.5) 0%,
      rgba($color-black, 0.2) 50%,
      transparent 100%
    );
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    padding: $spacing-2xl;
    color: $color-white;
  }

  &__title {
    font-size: $font-size-2xl;
    margin-bottom: $spacing-md;
    color: $color-cream;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-4xl;
    }

    span {
      display: block;
    }

    .highlight {
      color: $color-gold;
    }
  }

  &__tagline {
    margin-bottom: $spacing-xl;
  }

  &__cta {
    margin-top: $spacing-lg;
  }
}
```

**Step 4: Create gallery styles**

Create `assets/scss/_gallery.scss`:

```scss
// =========================
// Gallery/Carousel Section
// =========================

.venue-gallery {
  padding: $spacing-3xl 0;
  text-align: center;

  &__heading {
    margin-bottom: $spacing-sm;
  }

  &__subtext {
    color: $color-text-light;
    margin-bottom: $spacing-2xl;
  }

  &__carousel {
    position: relative;
    overflow: hidden;
  }

  &__track {
    display: flex;
    gap: $spacing-md;
    transition: transform $transition-slow;
  }

  &__slide {
    flex: 0 0 auto;
    width: 300px;

    @media (min-width: $breakpoint-md) {
      width: 400px;
    }
  }

  &__image {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    cursor: pointer;
    transition: transform $transition-base;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__nav {
    display: flex;
    justify-content: center;
    gap: $spacing-sm;
    margin-top: $spacing-xl;
  }

  &__nav-btn {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba($color-black, 0.2);
    border: none;
    cursor: pointer;
    transition: background-color $transition-fast;

    &--active,
    &:hover {
      background-color: $color-gold;
    }
  }

  &__arrows {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 $spacing-md;
    pointer-events: none;
  }

  &__arrow {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $color-white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    pointer-events: auto;
    box-shadow: $shadow-md;
    transition: all $transition-fast;

    &:hover {
      background-color: $color-gold;
      color: $color-white;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }
}

// Lightbox
.lightbox {
  position: fixed;
  inset: 0;
  z-index: $z-index-lightbox;
  display: none;
  align-items: center;
  justify-content: center;
  background-color: rgba($color-black, 0.9);

  &--open {
    display: flex;
  }

  &__close {
    position: absolute;
    top: $spacing-lg;
    right: $spacing-lg;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: $color-white;
    cursor: pointer;
    font-size: $font-size-2xl;
  }

  &__image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
  }
}
```

**Step 5: Create events section styles**

Create `assets/scss/_events.scss`:

```scss
// =========================
// Event Types Section
// =========================

.events {
  padding: $spacing-3xl 0;
  background-color: $color-black;
  text-align: center;

  &__heading {
    color: $color-cream;
    margin-bottom: $spacing-2xl;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
    max-width: 800px;
    margin: 0 auto $spacing-2xl;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-lg;
  }

  &__icon {
    width: 64px;
    height: 64px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__label {
    font-family: $font-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    color: $color-cream;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  &__cta {
    margin-top: $spacing-lg;
  }
}
```

**Step 6: Create about section styles**

Create `assets/scss/_about.scss`:

```scss
// =========================
// About Section
// =========================

.about {
  padding: $spacing-3xl 0;

  &__heading {
    text-align: center;
    margin-bottom: $spacing-3xl;
  }

  &__block {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
    align-items: center;
    margin-bottom: $spacing-3xl;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1fr 1fr;
    }

    &:last-child {
      margin-bottom: 0;
    }

    &--reverse {
      @media (min-width: $breakpoint-md) {
        .about__content {
          order: 2;
        }
        .about__image {
          order: 1;
        }
      }
    }
  }

  &__content {
    padding: 0 $spacing-lg;
  }

  &__subtitle {
    margin-bottom: $spacing-lg;
  }

  &__text {
    margin-bottom: $spacing-lg;
    line-height: 1.8;
  }

  &__image {
    img {
      width: 100%;
      aspect-ratio: 4/3;
      object-fit: cover;
    }
  }
}
```

**Step 7: Create CTA banner styles**

Create `assets/scss/_cta-banner.scss`:

```scss
// =========================
// CTA Banner Section
// =========================

.cta-banner {
  position: relative;
  padding: $spacing-4xl 0;
  text-align: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba($color-black, 0.6);
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    margin: 0 auto;
    color: $color-white;
  }

  &__heading {
    font-size: $font-size-2xl;
    color: $color-cream;
    margin-bottom: $spacing-md;

    @media (min-width: $breakpoint-md) {
      font-size: $font-size-3xl;
    }
  }

  &__text {
    font-size: $font-size-md;
    margin-bottom: $spacing-xl;
    color: $color-cream;
  }
}
```

**Step 8: Create contact page styles**

Create `assets/scss/_contact.scss`:

```scss
// =========================
// Contact Page
// =========================

.contact {
  padding: $spacing-3xl 0;

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-3xl;

    @media (min-width: $breakpoint-md) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__form-section {
    h1 {
      margin-bottom: $spacing-xl;
    }
  }

  &__info-section {
    h1 {
      margin-bottom: $spacing-xl;
    }
  }

  &__map {
    width: 100%;
    height: 300px;
    margin-bottom: $spacing-xl;

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__detail {
    strong {
      display: block;
      font-family: $font-primary;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: $spacing-xs;
    }

    a {
      color: $color-gold;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

**Step 9: Create forms styles**

Create `assets/scss/_forms.scss`:

```scss
// =========================
// Forms (HoneyBook Embeds)
// =========================

.form-embed {
  width: 100%;
  min-height: 500px;

  iframe {
    width: 100%;
    min-height: 500px;
    border: none;
  }
}
```

**Step 10: Create utilities**

Create `assets/scss/_utilities.scss`:

```scss
// =========================
// Utility Classes
// =========================

// Margins
.mt-0 { margin-top: 0; }
.mt-1 { margin-top: $spacing-sm; }
.mt-2 { margin-top: $spacing-md; }
.mt-3 { margin-top: $spacing-lg; }
.mt-4 { margin-top: $spacing-xl; }
.mt-5 { margin-top: $spacing-2xl; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: $spacing-sm; }
.mb-2 { margin-bottom: $spacing-md; }
.mb-3 { margin-bottom: $spacing-lg; }
.mb-4 { margin-bottom: $spacing-xl; }
.mb-5 { margin-bottom: $spacing-2xl; }

// Padding
.py-3 { padding-top: $spacing-lg; padding-bottom: $spacing-lg; }
.py-4 { padding-top: $spacing-xl; padding-bottom: $spacing-xl; }
.py-5 { padding-top: $spacing-2xl; padding-bottom: $spacing-2xl; }

// Display
.d-none { display: none; }
.d-block { display: block; }
.d-flex { display: flex; }
.d-grid { display: grid; }

// Flexbox
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.align-center { align-items: center; }
.flex-column { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.gap-1 { gap: $spacing-sm; }
.gap-2 { gap: $spacing-md; }
.gap-3 { gap: $spacing-lg; }

// Width
.w-100 { width: 100%; }
.max-w-sm { max-width: 480px; }
.max-w-md { max-width: 768px; }
.max-w-lg { max-width: 992px; }

// Visibility
@media (max-width: $breakpoint-md - 1) {
  .hide-mobile { display: none !important; }
}

@media (min-width: $breakpoint-md) {
  .hide-desktop { display: none !important; }
}
```

**Step 11: Commit all SCSS partials**

```bash
git add assets/scss/
git commit -m "feat: add all SCSS component partials"
```

---

## Phase 2: Hugo Templates

### Task 2.1: Create Base Template

**Files:**

- Create: `layouts/_default/baseof.html`

**Step 1: Create base template**

Create `layouts/_default/baseof.html`:

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode | default "en-us" }}">
<head>
  {{- partial "head.html" . -}}
</head>
<body class="has-fixed-header">
  {{- partial "header.html" . -}}

  <main>
    {{- block "main" . }}{{- end }}
  </main>

  {{- partial "cta-banner.html" . -}}
  {{- partial "footer.html" . -}}

  {{- partial "scripts.html" . -}}
</body>
</html>
```

**Step 2: Commit**

```bash
git add layouts/_default/baseof.html
git commit -m "feat: add base HTML template"
```

---

### Task 2.2: Create Head Partial

**Files:**

- Create: `layouts/partials/head.html`

**Step 1: Create head partial**

Create `layouts/partials/head.html`:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

{{/* Title */}}
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | Pike & West{{ end }}</title>

{{/* Meta Description */}}
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Site.Params.description }}{{ . }}{{ end }}{{ end }}">

{{/* Canonical URL */}}
<link rel="canonical" href="{{ .Permalink }}">

{{/* Open Graph */}}
<meta property="og:title" content="{{ .Title }}">
<meta property="og:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">
<meta property="og:url" content="{{ .Permalink }}">
<meta property="og:site_name" content="{{ .Site.Title }}">
<meta property="og:type" content="{{ if .IsHome }}website{{ else }}article{{ end }}">
{{ with .Params.image }}
<meta property="og:image" content="{{ . | absURL }}">
{{ end }}

{{/* Twitter Card */}}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ .Title }}">
<meta name="twitter:description" content="{{ with .Description }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}">

{{/* Favicon */}}
<link rel="icon" href="/favicon.ico" type="image/x-icon">

{{/* Google Fonts */}}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Oswald:wght@300;400;500;600;700&display=swap" rel="stylesheet">

{{/* Styles */}}
{{ $scss := resources.Get "scss/main.scss" }}
{{ $style := $scss | resources.ToCSS (dict "targetPath" "css/main.css" "outputStyle" "compressed") | fingerprint }}
<link rel="stylesheet" href="{{ $style.RelPermalink }}" integrity="{{ $style.Data.Integrity }}">

{{/* Google Tag Manager */}}
{{ with .Site.Params.analytics.googleTagManager }}
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','{{ . }}');</script>
{{ end }}

{{/* Structured Data */}}
{{ partial "structured-data.html" . }}
```

**Step 2: Commit**

```bash
git add layouts/partials/head.html
git commit -m "feat: add head partial with SEO and styles"
```

---

### Task 2.3: Create Header Partial

**Files:**

- Create: `layouts/partials/header.html`

**Step 1: Create header partial**

Create `layouts/partials/header.html`:

```html
<header class="header">
  <div class="container header__container">
    <a href="/" class="header__logo" aria-label="Pike & West Home">
      {{ $logo := resources.Get "images/logo/pike-west-logo.svg" }}
      {{ if $logo }}
        <img src="{{ $logo.RelPermalink }}" alt="Pike & West" width="150" height="40">
      {{ else }}
        <span style="font-family: 'Oswald', sans-serif; font-size: 1.5rem; letter-spacing: 0.1em;">PIKE & WEST</span>
      {{ end }}
    </a>

    <nav class="header__nav" aria-label="Main navigation">
      {{ range .Site.Menus.main }}
        {{ if eq .Name "Contact Us" }}
          <a href="{{ .URL }}" class="header__link header__link--primary">{{ .Name }}</a>
        {{ else }}
          <a href="{{ .URL }}" class="header__link header__link--outline">{{ .Name }}</a>
        {{ end }}
      {{ end }}
    </nav>
  </div>
</header>
```

**Step 2: Commit**

```bash
git add layouts/partials/header.html
git commit -m "feat: add header partial with navigation"
```

---

### Task 2.4: Create Footer Partial

**Files:**

- Create: `layouts/partials/footer.html`

**Step 1: Create footer partial**

Create `layouts/partials/footer.html`:

```html
<footer class="footer">
  <div class="container footer__container">
    <a href="/" class="footer__logo" aria-label="Pike & West Home">
      {{ $logo := resources.Get "images/logo/pike-west-logo.svg" }}
      {{ if $logo }}
        <img src="{{ $logo.RelPermalink }}" alt="Pike & West" width="120" height="30">
      {{ else }}
        <span style="font-family: 'Oswald', sans-serif; font-size: 1rem; letter-spacing: 0.1em;">PIKE & WEST</span>
      {{ end }}
    </a>

    <a href="/contact/" class="footer__link">Contact Us</a>

    <div class="footer__social">
      {{ with .Site.Params.social.instagram }}
      <a href="{{ . }}" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      {{ end }}

      {{ with .Site.Params.social.facebook }}
      <a href="{{ . }}" class="footer__social-link" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </a>
      {{ end }}
    </div>

    <p class="footer__copyright">
      Copyright &copy; Pike & West {{ now.Year }}. All rights reserved.
    </p>
  </div>
</footer>
```

**Step 2: Commit**

```bash
git add layouts/partials/footer.html
git commit -m "feat: add footer partial with social links"
```

---

### Task 2.5: Create Homepage Template

**Files:**

- Create: `layouts/index.html`
- Create: `layouts/partials/hero.html`
- Create: `layouts/partials/venue-gallery.html`
- Create: `layouts/partials/event-types.html`
- Create: `layouts/partials/about.html`

**Step 1: Create homepage template**

Create `layouts/index.html`:

```html
{{ define "main" }}
  {{- partial "hero.html" . -}}
  {{- partial "venue-gallery.html" . -}}
  {{- partial "event-types.html" . -}}
  {{- partial "about.html" . -}}
{{ end }}
```

**Step 2: Create hero partial**

Create `layouts/partials/hero.html`:

```html
{{ $heroImage := resources.Get "images/hero/venue-exterior.jpg" }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}

<section class="hero" style="background-image: url('{{ $heroBg }}');">
  <div class="hero__content">
    <h1 class="hero__title">
      <span>Germantown's Premier</span>
      <span class="highlight">ART GALLERY & VENUE</span>
    </h1>
    <div class="hero__tagline tagline">
      <p>ART AND LIFE.</p>
      <p>LIFE AND ART.</p>
      <p>LIFE AS ART.</p>
    </div>
    <div class="hero__cta">
      <a href="/contact/" class="btn btn-secondary">Schedule a Tour</a>
    </div>
  </div>
</section>
```

**Step 3: Create venue gallery partial**

Create `layouts/partials/venue-gallery.html`:

```html
<section class="venue-gallery section">
  <div class="container">
    <h2 class="venue-gallery__heading">Our Venue</h2>
    <p class="venue-gallery__subtext">Want to see more? Follow us on Instagram.</p>

    <div class="venue-gallery__carousel" role="region" aria-label="Venue photo gallery">
      <div class="venue-gallery__track" id="gallery-track">
        {{ $images := resources.Match "images/venue/*" }}
        {{ range $index, $image := $images }}
          {{ $resized := $image.Resize "600x q85" }}
          <div class="venue-gallery__slide" data-index="{{ $index }}">
            <img
              src="{{ $resized.RelPermalink }}"
              alt="Pike & West venue photo {{ add $index 1 }}"
              class="venue-gallery__image"
              loading="lazy"
              data-full="{{ $image.RelPermalink }}"
            >
          </div>
        {{ end }}
      </div>

      <div class="venue-gallery__arrows">
        <button class="venue-gallery__arrow venue-gallery__arrow--prev" aria-label="Previous slide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="venue-gallery__arrow venue-gallery__arrow--next" aria-label="Next slide">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="venue-gallery__nav" id="gallery-nav">
        {{ range $index, $_ := $images }}
          <button
            class="venue-gallery__nav-btn{{ if eq $index 0 }} venue-gallery__nav-btn--active{{ end }}"
            aria-label="Go to slide {{ add $index 1 }}"
            data-index="{{ $index }}"
          ></button>
        {{ end }}
      </div>
    </div>
  </div>
</section>

{{/* Lightbox */}}
<div class="lightbox" id="lightbox" aria-hidden="true">
  <button class="lightbox__close" aria-label="Close lightbox">&times;</button>
  <img src="" alt="" class="lightbox__image" id="lightbox-image">
</div>
```

**Step 4: Create event types partial**

Create `layouts/partials/event-types.html`:

```html
<section class="events section">
  <div class="container">
    <h2 class="events__heading">The perfect place for your next...</h2>

    <div class="events__grid">
      {{ $eventTypes := slice
        (dict "icon" "wedding-ring.svg" "label" "Wedding")
        (dict "icon" "champagne.svg" "label" "Private Party")
        (dict "icon" "badge.svg" "label" "Corporate Party")
        (dict "icon" "cake.svg" "label" "Birthday")
        (dict "icon" "disco-ball.svg" "label" "Dance")
        (dict "icon" "rattle.svg" "label" "Baby Shower")
      }}

      {{ range $eventTypes }}
        <div class="events__item">
          <div class="events__icon">
            {{ $icon := resources.Get (printf "images/icons/%s" .icon) }}
            {{ if $icon }}
              <img src="{{ $icon.RelPermalink }}" alt="{{ .label }} icon">
            {{ end }}
          </div>
          <span class="events__label">{{ .label }}</span>
        </div>
      {{ end }}
    </div>

    <div class="events__cta">
      <a href="/contact/" class="btn btn-outline-light">Contact Us</a>
    </div>
  </div>
</section>
```

**Step 5: Create about partial**

Create `layouts/partials/about.html`:

```html
<section class="about section">
  <div class="container">
    <h1 class="about__heading">About Us</h1>

    {{/* Who We Are */}}
    <div class="about__block">
      <div class="about__content">
        <h2 class="about__subtitle">Who we are</h2>
        <div class="about__text">
          <p>Nestled in the heart of Germantown, Tennessee, Pike & West is an unique art gallery and venue. Our team specializes in creating unforgettable experiences. Established in 2023, we are a family-owned and operated business dedicated to transforming dreams into reality.</p>
          <p>With over six years of experience in the event industry, our venue coordinator, Eden Neller, and event coordinator, Lyndal Brumley, share a passion for realizing your vision. They are experts at planning and executing every detail, ensuring that your event is everything you've ever imagined.</p>
        </div>
        <a href="/contact/" class="btn btn-secondary">Schedule a Tour</a>
      </div>
      <div class="about__image">
        {{ $teamImage := resources.Get "images/about/team.jpg" }}
        {{ if $teamImage }}
          {{ $resized := $teamImage.Resize "800x q85" }}
          <img src="{{ $resized.RelPermalink }}" alt="Lyndal Brumley and Eden Neller, Pike & West team members" loading="lazy">
        {{ end }}
      </div>
    </div>

    {{/* What We Do */}}
    <div class="about__block about__block--reverse">
      <div class="about__content">
        <h2 class="about__subtitle">What we do</h2>
        <div class="about__text">
          <p>Whether you're planning an art show, an intimate wedding, a milestone celebration, a corporate party, or a social gathering, Pike & West is the perfect space to accommodate your needs. Our modern venue space is a breath of fresh air and includes a dreamy multi-story patio space.</p>
          <p>We pride ourselves on going above and beyond to provide exceptional service and create a seamless experience for our clients. Our team is committed to ensuring that your event is everything you've ever dreamed of, from the initial consultation to the final farewell.</p>
        </div>
        <a href="/contact/" class="btn btn-outline">Contact Us</a>
      </div>
      <div class="about__image">
        {{ $eventImage := resources.Get "images/about/event-bw.jpg" }}
        {{ if $eventImage }}
          {{ $resized := $eventImage.Resize "800x q85" }}
          <img src="{{ $resized.RelPermalink }}" alt="Guests enjoying an event at Pike & West" loading="lazy">
        {{ end }}
      </div>
    </div>
  </div>
</section>
```

**Step 6: Commit all homepage templates**

```bash
git add layouts/
git commit -m "feat: add homepage template and partials"
```

---

### Task 2.6: Create CTA Banner and Scripts Partials

**Files:**

- Create: `layouts/partials/cta-banner.html`
- Create: `layouts/partials/scripts.html`
- Create: `layouts/partials/structured-data.html`

**Step 1: Create CTA banner partial**

Create `layouts/partials/cta-banner.html`:

```html
{{ $bgImage := resources.Get "images/backgrounds/disco-ball.jpg" }}
{{ $bgUrl := "" }}
{{ if $bgImage }}
  {{ $bgUrl = ($bgImage.Resize "1920x q80").RelPermalink }}
{{ end }}

<section class="cta-banner" style="background-image: url('{{ $bgUrl }}');">
  <div class="cta-banner__content">
    <h2 class="cta-banner__heading">Let's celebrate!</h2>
    <p class="cta-banner__text">Book your next event at Pike & West and create unforgettable memories!</p>
    <a href="/contact/" class="btn btn-secondary">Schedule a Tour</a>
  </div>
</section>
```

**Step 2: Create scripts partial**

Create `layouts/partials/scripts.html`:

```html
{{/* Google Tag Manager (noscript) */}}
{{ with .Site.Params.analytics.googleTagManager }}
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={{ . }}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
{{ end }}

{{/* Main JavaScript */}}
{{ $js := resources.Get "js/main.js" }}
{{ if $js }}
  {{ $jsMinified := $js | minify | fingerprint }}
  <script src="{{ $jsMinified.RelPermalink }}" integrity="{{ $jsMinified.Data.Integrity }}" defer></script>
{{ end }}
```

**Step 3: Create structured data partial**

Create `layouts/partials/structured-data.html`:

```html
{{/* LocalBusiness Schema */}}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EventVenue",
  "name": "Pike & West",
  "description": "{{ .Site.Params.description }}",
  "url": "{{ .Site.BaseURL }}",
  "telephone": "{{ .Site.Params.contact.phone }}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{ .Site.Params.contact.address }}",
    "addressLocality": "{{ .Site.Params.contact.city }}",
    "addressRegion": "{{ .Site.Params.contact.state }}",
    "postalCode": "{{ .Site.Params.contact.zip }}",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "35.0868",
    "longitude": "-89.8100"
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    "{{ .Site.Params.social.instagram }}",
    "{{ .Site.Params.social.facebook }}"
  ]
}
</script>

{{/* BreadcrumbList Schema for non-home pages */}}
{{ if not .IsHome }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{ .Site.BaseURL }}"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{ .Title }}",
      "item": "{{ .Permalink }}"
    }
  ]
}
</script>
{{ end }}
```

**Step 4: Commit**

```bash
git add layouts/partials/
git commit -m "feat: add CTA banner, scripts, and structured data partials"
```

---

### Task 2.7: Create Contact Page Template

**Files:**

- Create: `layouts/page/contact.html`
- Create: `content/contact.md`

**Step 1: Create contact page template**

Create `layouts/page/contact.html`:

```html
{{ define "main" }}
<section class="contact section">
  <div class="container">
    <div class="contact__grid">
      {{/* Contact Form */}}
      <div class="contact__form-section">
        <h1>Contact Us</h1>
        <div class="form-embed">
          {{ with .Site.Params.forms.honeyBookContactEmbed }}
          <iframe
            src="{{ . }}"
            title="Contact Form"
            loading="lazy"
          ></iframe>
          {{ else }}
          <p>Contact form coming soon. Please call us at {{ .Site.Params.contact.phone }}.</p>
          {{ end }}
        </div>
      </div>

      {{/* Find Us */}}
      <div class="contact__info-section">
        <h1>Find Us</h1>

        <div class="contact__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3264.2!2d-89.81!3d35.0868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA1JzEyLjUiTiA4OcKwNDgnMzYuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Pike & West Location"
          ></iframe>
        </div>

        <div class="contact__details">
          <div class="contact__detail">
            <strong>Our Location</strong>
            <a href="{{ .Site.Params.contact.googleMapsUrl }}" target="_blank" rel="noopener noreferrer">
              {{ .Site.Params.contact.address }}<br>
              {{ .Site.Params.contact.city }} {{ .Site.Params.contact.state }} {{ .Site.Params.contact.zip }}
            </a>
          </div>

          <div class="contact__detail">
            <strong>Hours</strong>
            <span>{{ .Site.Params.contact.hours }}</span>
          </div>

          <div class="contact__detail">
            <strong>Phone</strong>
            <span>{{ .Site.Params.contact.phone }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{{ end }}
```

**Step 2: Create contact page content**

Create `content/contact.md`:

```markdown
---
title: "Contact Us"
description: "Schedule a tour or contact Pike & West for your next event. Located at 2277 West Street, Germantown, TN."
layout: "contact"
type: "page"
---
```

**Step 3: Commit**

```bash
git add layouts/page/contact.html content/contact.md
git commit -m "feat: add contact page template and content"
```

---

### Task 2.8: Create Gallery Application Page Template

**Files:**

- Create: `layouts/page/gallery-application.html`
- Create: `content/gallery-application.md`

**Step 1: Create gallery application template**

Create `layouts/page/gallery-application.html`:

```html
{{ define "main" }}
<section class="contact section">
  <div class="container">
    <div class="contact__grid">
      {{/* Application Form */}}
      <div class="contact__form-section">
        <h1>Gallery Application</h1>
        <div class="form-embed">
          {{ with .Site.Params.forms.honeyBookGalleryEmbed }}
          <iframe
            src="{{ . }}"
            title="Gallery Application Form"
            loading="lazy"
          ></iframe>
          {{ else }}
          <p>Application form coming soon. Please email us at events@pikeandwest.com.</p>
          {{ end }}
        </div>
      </div>

      {{/* Find Us */}}
      <div class="contact__info-section">
        <h1>Find Us</h1>

        <div class="contact__map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3264.2!2d-89.81!3d35.0868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDA1JzEyLjUiTiA4OcKwNDgnMzYuMCJX!5e0!3m2!1sen!2sus!4v1234567890"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Pike & West Location"
          ></iframe>
        </div>

        <div class="contact__details">
          <div class="contact__detail">
            <strong>Our Location</strong>
            <a href="{{ .Site.Params.contact.googleMapsUrl }}" target="_blank" rel="noopener noreferrer">
              {{ .Site.Params.contact.address }}<br>
              {{ .Site.Params.contact.city }} {{ .Site.Params.contact.state }} {{ .Site.Params.contact.zip }}
            </a>
          </div>

          <div class="contact__detail">
            <strong>Hours</strong>
            <span>{{ .Site.Params.contact.hours }}</span>
          </div>

          <div class="contact__detail">
            <strong>Phone</strong>
            <span>{{ .Site.Params.contact.phone }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
{{ end }}
```

**Step 2: Create gallery application content**

Create `content/gallery-application.md`:

```markdown
---
title: "Gallery Application"
description: "Apply to exhibit your artwork at Pike & West gallery in Germantown, TN."
layout: "gallery-application"
type: "page"
---
```

**Step 3: Commit**

```bash
git add layouts/page/gallery-application.html content/gallery-application.md
git commit -m "feat: add gallery application page template and content"
```

---

## Phase 3: JavaScript & Interactivity

### Task 3.1: Implement Gallery Carousel

**Files:**

- Modify: `assets/js/main.js`

**Step 1: Implement carousel JavaScript**

Replace contents of `assets/js/main.js`:

```javascript
// Pike & West Theme JavaScript
// ============================

document.addEventListener('DOMContentLoaded', function() {
  initGalleryCarousel();
  initLightbox();
});

// Gallery Carousel
function initGalleryCarousel() {
  const track = document.getElementById('gallery-track');
  const nav = document.getElementById('gallery-nav');

  if (!track || !nav) return;

  const slides = track.querySelectorAll('.venue-gallery__slide');
  const navBtns = nav.querySelectorAll('.venue-gallery__nav-btn');
  const prevBtn = document.querySelector('.venue-gallery__arrow--prev');
  const nextBtn = document.querySelector('.venue-gallery__arrow--next');

  if (slides.length === 0) return;

  let currentIndex = 0;
  const slideWidth = slides[0].offsetWidth + 16; // Width + gap
  const visibleSlides = Math.floor(track.parentElement.offsetWidth / slideWidth);
  const maxIndex = Math.max(0, slides.length - visibleSlides);

  function goToSlide(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Update nav buttons
    navBtns.forEach((btn, i) => {
      btn.classList.toggle('venue-gallery__nav-btn--active', i === currentIndex);
    });
  }

  // Nav button clicks
  navBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => goToSlide(i));
  });

  // Arrow clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  }

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  }
}

// Lightbox
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const closeBtn = lightbox?.querySelector('.lightbox__close');

  if (!lightbox || !lightboxImage) return;

  // Open lightbox on image click
  document.querySelectorAll('.venue-gallery__image').forEach(img => {
    img.addEventListener('click', () => {
      const fullSrc = img.dataset.full || img.src;
      lightboxImage.src = fullSrc;
      lightboxImage.alt = img.alt;
      lightbox.classList.add('lightbox--open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close lightbox
  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  }

  closeBtn?.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });
}
```

**Step 2: Verify build succeeds**

Run: `hugo`
Expected: Build succeeds without errors

**Step 3: Commit**

```bash
git add assets/js/main.js
git commit -m "feat: implement gallery carousel and lightbox JavaScript"
```

---

## Phase 4: Assets & Content

### Task 4.1: Export and Organize Images from Webflow

**Files:**

- Create: `assets/images/logo/pike-west-logo.svg`
- Create: `assets/images/hero/venue-exterior.jpg`
- Create: `assets/images/venue/*.jpg` (10 images)
- Create: `assets/images/icons/*.svg` (6 icons)
- Create: `assets/images/about/team.jpg`
- Create: `assets/images/about/event-bw.jpg`
- Create: `assets/images/backgrounds/disco-ball.jpg`

**Step 1: Create asset directories**

```bash
mkdir -p assets/images/logo assets/images/hero assets/images/venue assets/images/icons assets/images/about assets/images/backgrounds
```

**Step 2: Download images from Webflow (manual)**

Instructions for manual export:

1. Open pikeandwest.com in browser
2. Right-click each image → Save Image As
3. Use browser DevTools to find high-res image URLs
4. Name files according to the structure above

**Step 3: Create placeholder files (for testing)**

```bash
touch assets/images/logo/.gitkeep
touch assets/images/hero/.gitkeep
touch assets/images/venue/.gitkeep
touch assets/images/icons/.gitkeep
touch assets/images/about/.gitkeep
touch assets/images/backgrounds/.gitkeep
```

**Step 4: Commit placeholder structure**

```bash
git add assets/images/
git commit -m "feat: add image asset directory structure"
```

---

### Task 4.2: Add HoneyBook Embed URLs

**Files:**

- Modify: `config/_default/params.toml`

**Step 1: Get HoneyBook embed URLs from Webflow**

Instructions:

1. Open pikeandwest.com/contact in browser
2. Open DevTools → Network tab
3. Filter by "honeybook"
4. Copy the iframe src URL
5. Repeat for /gallery-application

**Step 2: Update params.toml with actual URLs**

```toml
[forms]
  honeyBookContactEmbed = "https://widget.honeybook.com/widget/pike_west_contact/..." # Replace with actual
  honeyBookGalleryEmbed = "https://widget.honeybook.com/widget/pike_west_gallery/..." # Replace with actual
```

**Step 3: Commit**

```bash
git add config/_default/params.toml
git commit -m "feat: add HoneyBook form embed URLs"
```

---

### Task 4.3: Add Google Tag Manager ID

**Files:**

- Modify: `config/_default/params.toml`

**Step 1: Get GTM ID from Webflow**

Instructions:

1. Open pikeandwest.com
2. View Page Source
3. Search for "GTM-"
4. Copy the GTM container ID

**Step 2: Update params.toml**

```toml
[analytics]
  googleTagManager = "GTM-XXXXXXX" # Replace with actual ID
```

**Step 3: Commit**

```bash
git add config/_default/params.toml
git commit -m "feat: add Google Tag Manager configuration"
```

---

## Phase 5: Testing & Deployment

### Task 5.1: Local Testing

**Step 1: Start development server**

Run: `hugo server -D`
Expected: Server starts at <http://localhost:1313>

**Step 2: Visual comparison checklist**

- [ ] Header matches Webflow (logo, nav links, styling)
- [ ] Hero section matches (background, text, CTA)
- [ ] Gallery carousel works (slides, nav, lightbox)
- [ ] Event types section matches (icons, layout, colors)
- [ ] About section matches (layout, images, text)
- [ ] CTA banner matches (background, text)
- [ ] Footer matches (logo, links, social icons)
- [ ] Contact page layout matches
- [ ] Gallery application page layout matches
- [ ] Mobile responsive at 320px, 480px, 768px

**Step 3: Run production build**

Run: `hugo --gc --minify`
Expected: Build succeeds, files in `public/` directory

---

### Task 5.2: Create Cloudflare Pages Deployment

**Files:**

- Create: `.gitignore`
- Create: `netlify.toml` (optional backup)

**Step 1: Create .gitignore**

Create `.gitignore`:

```text
# Hugo build output
public/
resources/_gen/

# OS files
.DS_Store
Thumbs.db

# IDE
.idea/
.vscode/
*.swp

# Environment
.env
.env.local
```

**Step 2: Create Cloudflare Pages config (wrangler.toml)**

Create `wrangler.toml`:

```toml
name = "pikeandwest"
compatibility_date = "2024-01-01"

[site]
bucket = "./public"
```

**Step 3: Deploy to Cloudflare Pages**

```bash
# Install Wrangler if needed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create Pages project
wrangler pages project create pikeandwest

# Deploy
hugo --gc --minify && wrangler pages deploy public
```

**Step 4: Commit deployment configuration**

```bash
git add .gitignore wrangler.toml
git commit -m "feat: add deployment configuration for Cloudflare Pages"
```

---

### Task 5.3: Configure Custom Domain

**Step 1: Add custom domain in Cloudflare Pages dashboard**

Instructions:

1. Go to Cloudflare Dashboard → Pages → pikeandwest
2. Custom domains → Add custom domain
3. Enter: pikeandwest.com
4. Follow DNS verification steps

**Step 2: Update DNS records**

If domain is already on Cloudflare:

- CNAME record: @ → pikeandwest.pages.dev (proxied)
- CNAME record: www → pikeandwest.pages.dev (proxied)

**Step 3: Verify SSL certificate**

Wait for SSL certificate to provision (automatic with Cloudflare)

---

## Phase 6: Quality Assurance

### Task 6.1: Lighthouse Audit

**Step 1: Run Lighthouse on production URL**

```bash
npx lighthouse https://pikeandwest.com --output=html --output-path=./lighthouse-report.html
```

**Step 2: Verify scores**

Target scores:

- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

**Step 3: Fix any issues identified**

Common fixes:

- Add missing alt text
- Optimize images
- Add meta descriptions
- Fix heading hierarchy

---

### Task 6.2: Cross-Browser Testing

**Step 1: Test in target browsers**

- [ ] Chrome (desktop & mobile)
- [ ] Firefox (desktop)
- [ ] Safari (desktop & iOS)
- [ ] Edge (desktop)

**Step 2: Document any issues**

Create issues in GitHub for any browser-specific bugs.

---

### Task 6.3: Final SEO Verification

**Step 1: Verify structured data**

Run: Google Rich Results Test on <https://pikeandwest.com>
Expected: EventVenue schema detected, no errors

**Step 2: Verify sitemap**

Check: <https://pikeandwest.com/sitemap.xml>
Expected: All pages listed

**Step 3: Verify robots.txt**

Check: <https://pikeandwest.com/robots.txt>
Expected: Sitemap reference, no blocked pages

---

## Appendix A: MCPs to Use

| MCP            | Purpose                     | When to Use                                               |
|----------------|-----------------------------|-----------------------------------------------------------|
| **context7**   | Hugo documentation lookup   | When implementing Hugo features, checking template syntax |
| **playwright** | Visual testing, screenshots | Comparing Hugo build to Webflow, testing responsiveness   |
| **github**     | Repository management       | Creating issues, PRs, managing releases                   |

## Appendix B: Skills to Leverage

| Skill                            | Purpose                                                     |
|----------------------------------|-------------------------------------------------------------|
| `frontend-development`           | React/TypeScript patterns (component thinking for partials) |
| `playwright-testing`             | E2E tests comparing old/new sites                           |
| `infrastructure-ops`             | Cloudflare Pages deployment, GitHub Actions                 |
| `seo-specialist`                 | SEO optimization, structured data                           |
| `verification-before-completion` | Quality gates before deployment                             |
| `brainstorming`                  | Design decisions for custom components                      |
| `subagent-driven-development`    | Parallel task execution                                     |

## Appendix C: Custom Skills to Consider Building

### 1. Hugo Theme Development Skill

**Purpose:** Codify Hugo best practices for future projects

**Would include:**

- Hugo project structure standards
- Partial template patterns
- SCSS organization for Hugo
- Hugo Pipes patterns for assets
- Common partial implementations

### 2. Webflow Migration Skill

**Purpose:** Standardize Webflow → Hugo migrations

**Would include:**

- Asset extraction workflow
- Design token extraction from Webflow CSS
- Form embed migration patterns
- SEO preservation checklist

---

**Plan complete and saved to `docs/plans/2025-01-15-hugo-migration.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
