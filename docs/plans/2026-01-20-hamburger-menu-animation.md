# Hamburger Menu Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add smooth slide-down animation for mobile nav menu that matches Webflow's polished UX.

**Architecture:** Replace current `display: none/flex` toggle with CSS transform-based animation using `max-height` and `opacity`. Add `prefers-reduced-motion` support for accessibility. Keep JavaScript minimal - it only toggles classes.

**Tech Stack:** SCSS, vanilla JavaScript (existing), CSS transforms

---

## Current State Analysis

**What exists:**

- Hamburger icon X animation already works (`_header.scss:67-78`)
- JavaScript toggle logic exists (`main.js:11-30`)
- Full-width buttons in mobile menu already added (`_header.scss:103-107`)

**Problem:**

- Nav uses `display: none/flex` which cannot be animated
- Menu appears/disappears instantly without transition

**Solution:**

- Use `max-height`, `opacity`, and `visibility` for animatable show/hide
- Use `transform` for GPU-accelerated performance
- Respect `prefers-reduced-motion` for accessibility

---

## Task 1: Replace display toggle with animatable properties

**Files:**

- Modify: `assets/scss/_header.scss:87-108`

**Step 1: Update mobile nav base styles for animation**

Replace this code block in `_header.scss` (lines 87-108):

```scss
// Mobile (767px and below)
@media (max-width: $breakpoint-md) {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  flex-direction: column;
  background-color: $color-white;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  gap: $spacing-sm;

  &.is-open {
    display: flex;
  }

  // Full-width buttons in mobile menu
  .header__link {
    width: 100%;
    text-align: center;
  }
}
```

With this new code:

```scss
// Mobile (767px and below)
@media (max-width: $breakpoint-md) {
  // Use flex always, control visibility with other properties
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  flex-direction: column;
  background-color: $color-white;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  gap: $spacing-sm;

  // Animation properties - closed state
  max-height: 0;
  opacity: 0;
  visibility: hidden;
  overflow: hidden;
  transition:
    max-height 0.3s ease-out,
    opacity 0.3s ease-out,
    visibility 0.3s ease-out,
    padding 0.3s ease-out;

  &.is-open {
    // Open state
    max-height: 300px; // Enough for menu items
    opacity: 1;
    visibility: visible;
    padding: 20px;
  }

  // Full-width buttons in mobile menu
  .header__link {
    width: 100%;
    text-align: center;
  }
}
```

**Step 2: Run Hugo server and test**

Run: `hugo server -D`
Expected: Server starts, navigate to mobile viewport (≤767px)

**Step 3: Test animation manually**

1. Open browser DevTools
2. Set viewport to 375px width
3. Click hamburger button
4. Verify: Menu slides down smoothly over 0.3s
5. Click hamburger again
6. Verify: Menu slides up smoothly

**Step 4: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(header): add slide-down animation for mobile nav menu"
```

---

## Task 2: Add accessibility - prefers-reduced-motion support

**Files:**

- Modify: `assets/scss/_header.scss` (add after mobile nav block, around line 115)

**Step 1: Add reduced motion media query**

Add this code block after the mobile nav `@media` block:

```scss
// Accessibility: Reduce motion for users who prefer it
@media (prefers-reduced-motion: reduce) {
  .header__nav {
    transition: none;
  }

  .header__hamburger-line {
    transition: none;
  }
}
```

**Step 2: Test reduced motion**

1. In Chrome DevTools, open Rendering tab (Cmd+Shift+P → "Show Rendering")
2. Enable "Emulate CSS media feature prefers-reduced-motion: reduce"
3. Toggle hamburger menu
4. Verify: Menu appears/disappears instantly without animation
5. Disable the emulation
6. Verify: Animation works again

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "a11y(header): respect prefers-reduced-motion for menu animation"
```

---

## Task 3: Enhance hamburger icon animation timing

**Files:**

- Modify: `assets/scss/_header.scss:62-65`

**Step 1: Update hamburger line transitions with easing**

Replace the transition in `&__hamburger-line` (lines 62-65):

```scss
transition:
  transform 0.3s,
  opacity 0.3s;
```

With enhanced easing:

```scss
transition:
  transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
  opacity 0.2s ease-out;
```

**Step 2: Test hamburger icon animation**

1. Open browser at mobile viewport
2. Click hamburger
3. Verify: Lines smoothly rotate into X with subtle easing
4. Click again
5. Verify: X smoothly returns to hamburger

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "style(header): enhance hamburger icon animation easing"
```

---

## Task 4: Close menu when clicking outside

**Files:**

- Modify: `assets/js/main.js:11-30`

**Step 1: Update initMobileNav function**

Replace the existing `initMobileNav` function:

```javascript
// Mobile Navigation
function initMobileNav() {
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isOpen);
    nav.classList.toggle('is-open', !isOpen);
  });

  // Close menu when clicking a link
  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    });
  });
}
```

With this enhanced version:

```javascript
// Mobile Navigation
function initMobileNav() {
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.querySelector('.header__nav');

  if (!hamburger || !nav) return;

  function closeMenu() {
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }

  function openMenu() {
    hamburger.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
  }

  function toggleMenu() {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when clicking a link
  nav.querySelectorAll('.header__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    if (isOpen && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      closeMenu();
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      hamburger.focus(); // Return focus to hamburger for accessibility
    }
  });
}
```

**Step 2: Test click-outside behavior**

1. Open browser at mobile viewport
2. Click hamburger to open menu
3. Click anywhere outside menu (on page content)
4. Verify: Menu closes with animation

**Step 3: Test Escape key behavior**

1. Open menu with hamburger
2. Press Escape key
3. Verify: Menu closes and focus returns to hamburger button

**Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "feat(header): close mobile menu on outside click and Escape key"
```

---

## Task 5: Final testing and visual verification

**Files:**

- None (testing only)

**Step 1: Run Hugo server**

Run: `hugo server -D`

**Step 2: Test at all mobile breakpoints**

Test each viewport:

- 479px (mobile portrait)
- 767px (mobile landscape)
- 768px (should NOT show hamburger)

For each mobile viewport, verify:

- [ ] Hamburger icon visible
- [ ] Menu hidden by default
- [ ] Click hamburger → menu slides down smoothly
- [ ] Click hamburger again → menu slides up smoothly
- [ ] Click outside → menu closes
- [ ] Press Escape → menu closes
- [ ] Click nav link → menu closes
- [ ] Full-width buttons in menu

**Step 3: Test accessibility**

1. Enable prefers-reduced-motion in DevTools
2. Verify menu toggles instantly (no animation)
3. Test with keyboard only (Tab, Enter, Escape)

**Step 4: Run lint and build**

Run: `npm run lint && hugo --gc --minify`
Expected: No errors

---

## Summary

| Task | Description                                     | Files          |
|------|-------------------------------------------------|----------------|
| 1    | Replace display toggle with animated max-height | `_header.scss` |
| 2    | Add prefers-reduced-motion support              | `_header.scss` |
| 3    | Enhance hamburger icon easing                   | `_header.scss` |
| 4    | Add click-outside and Escape key close          | `main.js`      |
| 5    | Final testing at all breakpoints                | N/A            |

## Sources

- [Epic Web Dev - Hamburger Menu Animation](https://www.epicweb.dev/tips/hamburger-menu-animation)
- [Bits and Pieces - Animate Hamburger Menu](https://blog.bitsrc.io/animate-a-mobile-hamburger-bar-menu-using-css-and-just-a-hint-of-javascript-f31f928eb992)
- [Alvaro Trigo - CSS Hamburger Menu Examples](https://alvarotrigo.com/blog/hamburger-menu-css/)
- [CSS3 Shapes - Hamburger Icon Toggle](https://css3shapes.com/animating-a-hamburger-menu-icon-toggle/)
