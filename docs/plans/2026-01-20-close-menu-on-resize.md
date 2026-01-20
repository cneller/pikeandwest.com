# Close Hamburger Menu on Viewport Resize Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automatically close the hamburger menu when the viewport is resized past the mobile breakpoint (767px).

**Architecture:** Add a resize event listener that closes the menu when viewport width exceeds 767px. Use `matchMedia` for performance (fires once at threshold crossing, not on every resize pixel).

**Tech Stack:** Vanilla JavaScript, CSS media query matching

---

## Problem Statement

**Current behavior:**

1. User opens hamburger menu on mobile (≤767px)
2. User resizes window to desktop (>767px)
3. Menu is hidden by CSS but state remains open (`is-open` class, `aria-expanded="true"`)
4. User resizes back to mobile
5. Menu appears still open - unexpected and jarring UX

**Expected behavior:**

- Menu should automatically close when viewport crosses the 767px threshold
- When user returns to mobile view, menu should be in closed state

---

## Task 1: Add resize listener with matchMedia

**Files:**

- Modify: `assets/js/main.js:11-61` (inside `initMobileNav` function)

**Step 1: Add matchMedia listener after existing event listeners**

Add this code block after the Escape key listener (around line 60, before the closing `}` of `initMobileNav`):

```javascript
  // Close menu when viewport expands past mobile breakpoint
  const mobileBreakpoint = window.matchMedia('(max-width: 767px)');

  function handleBreakpointChange(e) {
    // If we crossed INTO desktop (breakpoint no longer matches)
    if (!e.matches) {
      closeMenu();
    }
  }

  // Modern browsers
  if (mobileBreakpoint.addEventListener) {
    mobileBreakpoint.addEventListener('change', handleBreakpointChange);
  } else {
    // Legacy Safari (iOS < 14)
    mobileBreakpoint.addListener(handleBreakpointChange);
  }
```

**Step 2: Run Hugo server and test**

Run: `hugo server -D`

**Step 3: Test resize behavior**

1. Open browser at 375px viewport
2. Click hamburger to open menu
3. Slowly resize window width past 767px
4. Verify: Menu closes automatically when crossing 768px
5. Resize back to 375px
6. Verify: Menu is closed (not still open)

**Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "fix(header): close hamburger menu when viewport expands past breakpoint"
```

---

## Task 2: Verify no duplicate listeners

**Files:**

- Review: `assets/js/main.js`

**Step 1: Verify matchMedia usage is correct**

Confirm:

- `matchMedia` is created once inside the function
- Event listener is added once (not in a loop or re-called)
- The listener correctly checks `!e.matches` (fires when leaving mobile, not entering)

**Step 2: Test edge cases**

1. Rapidly resize back and forth across 767px threshold
2. Verify: No console errors, menu state stays consistent
3. Open menu, resize to desktop, resize back, click hamburger
4. Verify: Hamburger toggles correctly (not stuck)

**Step 3: Test legacy browser fallback (optional)**

If testing on iOS Safari < 14:

- Verify `addListener` fallback works

---

## Summary

| Task | Description                    | Files     |
|------|--------------------------------|-----------|
| 1    | Add matchMedia resize listener | `main.js` |
| 2    | Verify edge cases              | N/A       |

## Technical Notes

**Why `matchMedia` instead of `resize` event?**

- `resize` fires on every pixel change (performance heavy)
- `matchMedia('change')` fires only when crossing the threshold (efficient)
- Matches CSS media query behavior exactly

**Breakpoint value:**

- `767px` matches `$breakpoint-md` from `_variables.scss`
- This is the point where hamburger becomes visible/hidden via CSS

**Browser support:**

- `addEventListener('change')` - Chrome 39+, Firefox 55+, Safari 14+
- `addListener` (deprecated) - Fallback for Safari 13 and earlier
