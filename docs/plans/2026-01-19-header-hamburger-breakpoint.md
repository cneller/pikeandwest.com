# Header Hamburger Breakpoint Change

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Change hamburger menu breakpoint from 479px (phones only) to 767px (mobile landscape and below)

**Architecture:** Update two media queries in `_header.scss` to use `$breakpoint-md` instead of `$breakpoint-sm`

**Tech Stack:** Hugo, SCSS

---

## Task 1: Update Hamburger Visibility Breakpoint

**Files:**

- Modify: `assets/scss/_header.scss:51`

**Step 1: Change hamburger media query**

Change line 51 from:

```scss
@media (max-width: $breakpoint-sm) {
```

To:

```scss
@media (max-width: $breakpoint-md) {
```

**Step 2: Update comment for clarity**

Change line 38 from:

```scss
// Hamburger menu button - phones only (479px and below)
```

To:

```scss
// Hamburger menu button - mobile (767px and below)
```

---

## Task 2: Update Nav Visibility Breakpoint

**Files:**

- Modify: `assets/scss/_header.scss:86`

**Step 1: Change nav media query**

Change line 86 from:

```scss
@media (max-width: $breakpoint-sm) {
```

To:

```scss
@media (max-width: $breakpoint-md) {
```

**Step 2: Update comment for clarity**

Change lines 84-85 from:

```scss
// Mobile nav - hidden by default, shown when hamburger is open
// Phones only (479px and below)
```

To:

```scss
// Mobile nav - hidden by default, shown when hamburger is open
// Mobile (767px and below)
```

---

## Task 3: Verify with Playwright

**Step 1: Test at 768px (nav buttons should show)**

```bash
# Open browser at 768px width, verify:
# - Nav buttons visible (CONTACT US, ARTISTS)
# - Hamburger hidden
```

**Step 2: Test at 767px (hamburger should show)**

```bash
# Resize to 767px, verify:
# - Hamburger visible
# - Nav buttons hidden
```

---

## Task 4: Commit

**Step 1: Stage and commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(header): change hamburger breakpoint to 767px

- Show hamburger menu on mobile landscape and below (767px)
- Show nav buttons on tablet and above (768px+)
- Matches CLAUDE.md header behavior spec"
```

---

## Summary Matrix

| Viewport  | Before (479px) | After (767px) |
|-----------|----------------|---------------|
| 768px+    | Nav buttons    | Nav buttons   |
| 480-767px | Nav buttons    | **Hamburger** |
| ≤479px    | Hamburger      | Hamburger     |
