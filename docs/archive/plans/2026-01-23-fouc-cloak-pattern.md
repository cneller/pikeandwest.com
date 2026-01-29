# FOUC Prevention Cloak Pattern Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate flash of unstyled content (FOUC) when navigating between pages by hiding all content except header until async-loaded CSS is ready, and slim down critical.scss by removing now-unnecessary duplicate styles.

**Architecture:** Use CSS cloak pattern - critical.scss (inlined) hides everything except header with `display: none`, then main.scss (async loaded) reveals it. Since content is hidden, we can remove ~800 lines of duplicate styles from critical.scss that already exist in the component files.

**Tech Stack:** Hugo, SCSS, CSS cloak pattern

---

## Background

The site uses async CSS loading for performance (preload + onload swap). This causes FOUC when navigating because content renders before main.css loads. The cloak pattern hides unstyled content until styles are ready.

**References:**

- [DEV Community: How to get rid of FOUC](https://dev.to/fbnlsr/how-to-get-rid-of-the-flash-of-unstyled-content-5e7)
- [JavaScript in Plain English: Stop FOUC with CSS Tricks](https://javascript.plainenglish.io/stop-the-flash-of-unstyled-content-fouc-with-css-tricks-1e69608ede2f)
- [Master CSS: Preventing FOUC](https://rc.css.master.co/guide/flash-of-unstyled-content)

## Current State

- `assets/scss/critical.scss` - 1074 lines, inlined in `<head>`, contains duplicate styles for header, hero, contact, footer
- `assets/scss/main.scss` - Imports component files (`_header.scss`, `_footer.scss`, `_hero.scss`, `_contact.scss`, etc.)
- `layouts/_default/baseof.html` - Structure: header → main → cta-banner → footer

## What to Keep in critical.scss

After refactor, critical.scss should only contain:

1. **Font-face declarations** (lines 9-28) - Needed for text rendering
2. **Variables** (lines 30-42) - Used by header styles
3. **Base reset** (lines 44-72) - box-sizing, html, body, img
4. **Header styles** (lines 74-211) - Only visible element during load
5. **Cloak rule** (new) - Hides everything else

## What to Remove from critical.scss

These are duplicates of styles already in component files:

- Hero styles (lines 213-312) → exists in `_hero.scss`
- Tagline styles (lines 314-336) → exists in `_hero.scss`
- Button styles (lines 338-357) → exists in `_buttons.scss`
- Container/Section styles (lines 366-380) → exists in `_base.scss`
- Section title styles (lines 382-393) → exists in `_typography.scss`
- Contact form styles (lines 395-409) → exists in `_contact.scss`
- Contact shimmer styles (lines 411-584) → exists in `_contact.scss`
- Find Us styles (lines 586-689) → exists in `_contact.scss`
- Footer styles (lines 691-1073) → exists in `_footer.scss`

---

## Tasks

### Task 1: Slim Down critical.scss

**Files:**

- Modify: `assets/scss/critical.scss`

**Step 1: Delete everything after header styles**

Remove lines 213-1073 (hero, tagline, buttons, contact, footer - all duplicates).

Keep only:

- Lines 1-211 (comments, font-face, variables, base reset, header)

**Step 2: Add cloak rule at the end**

Add the following after the header styles:

```scss
// =========================
// FOUC Prevention Cloak
// =========================
// Hide all content except header until main.css loads.
// Only the header is styled above; everything else loads with main.css.

main,
.cta-banner,
.footer {
  display: none;
}
```

**Step 3: Verify critical.scss compiles**

Run: Check Hugo server output for SCSS errors
Expected: No compilation errors

**Step 4: Commit**

```bash
git add assets/scss/critical.scss
git commit -m "refactor: slim critical.scss, add FOUC cloak

Remove ~800 lines of duplicate styles (hero, contact, footer)
that already exist in component files. Add cloak rule to hide
content until main.css loads asynchronously."
```

---

### Task 2: Add Reveal Rule to Main CSS

**Files:**

- Modify: `assets/scss/main.scss`

**Step 1: Add reveal rule after imports**

Add after line 11 (`@import 'base';`):

```scss
// =========================
// FOUC Prevention Reveal
// =========================
// Override cloak from critical.scss when main styles load.

main,
.cta-banner,
.footer {
  display: block;
}
```

**Step 2: Verify main.scss compiles**

Run: Check Hugo server output
Expected: No SCSS compilation errors

**Step 3: Commit**

```bash
git add assets/scss/main.scss
git commit -m "feat: add FOUC reveal rule to main.scss"
```

---

### Task 3: Visual Verification

**Step 1: Test homepage load**

1. Hard refresh <http://localhost:1313/>
2. Observe: Header appears immediately, content appears after (no flash of unstyled content)

**Step 2: Test page navigation**

1. Navigate: Home → Contact → Blog → Home
2. Expected: No FOUC between page loads, content hidden then styled

**Step 3: Test slow network**

1. DevTools → Network → Throttle to "Slow 3G"
2. Hard refresh
3. Expected: Header visible, content hidden, then content appears fully styled

**Step 4: Verify no visual regressions**

1. Compare each page to ensure styles match before/after
2. Check: Header, hero, footer, contact form, blog pages

---

## Rollback

If issues occur:

1. Restore critical.scss from git: `git checkout HEAD~1 -- assets/scss/critical.scss`
2. Remove reveal rule from main.scss

## Size Reduction

- **Before:** ~1074 lines in critical.scss (inlined in every page)
- **After:** ~230 lines in critical.scss
- **Savings:** ~800 lines of CSS not inlined in HTML = smaller HTML payload

## Notes

- The cloak pattern is well-established for FOUC prevention
- Header remains visible because it's the only styled element in critical.scss
- If JS is disabled, the noscript fallback loads main.css synchronously, revealing content
- This also improves page size since we're not inlining 800+ lines of duplicate CSS
