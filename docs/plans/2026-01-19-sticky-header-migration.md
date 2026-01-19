# Sticky Header Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Switch site header from `position: fixed` to `position: sticky` to simplify layout and eliminate manual offset hacks.

**Architecture:** Replace fixed positioning with sticky positioning. Remove all padding/margin offsets that compensated for the fixed header. The header will naturally stay in document flow, pushing content below it.

**Tech Stack:** SCSS, Hugo

---

## Task 1: Update Header to Sticky Positioning

**Files:**

- Modify: `assets/scss/_header.scss:5-16`

**Step 1: Change position from fixed to sticky**

Replace lines 5-16 in `_header.scss`:

```scss
.header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: $z-index-header;
  background-color: $color-white;
  height: auto;
  min-height: 4.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 5%;
```

Changes:

- `position: fixed` → `position: sticky`
- Keep `top: 0` (required for sticky to work)

**Step 2: Verify build compiles**

Run: `hugo server`
Expected: No SCSS compilation errors

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "refactor(header): switch from fixed to sticky positioning"
```

---

## Task 2: Remove Main Content Padding Offset

**Files:**

- Modify: `assets/scss/_base.scss:29-32`

**Step 1: Remove padding-top from main**

Replace lines 29-32 in `_base.scss`:

```scss
// Main content - no offset needed with sticky header
main {
  // padding-top removed - sticky header stays in document flow
}
```

Or simply delete the entire `main` rule block if it only contained the padding.

**Step 2: Verify build compiles**

Run: `hugo server`
Expected: No SCSS compilation errors

**Step 3: Commit**

```bash
git add assets/scss/_base.scss
git commit -m "refactor(base): remove main padding-top offset for sticky header"
```

---

## Task 3: Remove Hero Negative Margin Hack

**Files:**

- Modify: `assets/scss/_hero.scss:9-10`

**Step 1: Remove negative margin-top from hero**

Remove lines 9-10 in `_hero.scss`:

```scss
.hero {
  position: relative;
  z-index: 1;
  // Remove: margin-top: -$header-height;
```

The hero should now read:

```scss
.hero {
  position: relative;
  z-index: 1;

  // Desktop: Webflow exact values
  height: 75vh;
```

**Step 2: Verify build compiles**

Run: `hugo server`
Expected: No SCSS compilation errors

**Step 3: Commit**

```bash
git add assets/scss/_hero.scss
git commit -m "refactor(hero): remove negative margin hack for sticky header"
```

---

## Task 4: Remove Blog Hero Negative Margin Hack

**Files:**

- Modify: `assets/scss/_blog-hero.scss:8-9`

**Step 1: Remove negative margin-top from blog-hero**

Remove lines 8-9 in `_blog-hero.scss`:

```scss
.blog-hero {
  position: relative;
  // Remove: margin-top: -$header-height;
  display: flex;
```

The blog-hero should now read:

```scss
.blog-hero {
  position: relative;
  display: flex;
  align-items: center;
```

**Step 2: Verify build compiles**

Run: `hugo server`
Expected: No SCSS compilation errors

**Step 3: Commit**

```bash
git add assets/scss/_blog-hero.scss
git commit -m "refactor(blog-hero): remove negative margin hack for sticky header"
```

---

## Task 5: Visual Verification

**Step 1: Test homepage**

Navigate to: `http://localhost:1313/`

- Header should stick to top on scroll
- Hero content should start below header (no overlap)
- Hero background should NOT extend behind header (expected with sticky)

**Step 2: Test blog pages**

Navigate to: `http://localhost:1313/blog/`

- Blog hero should start below header
- Header should stick on scroll

**Step 3: Test at mobile breakpoints**

Resize browser to 767px and 479px:

- Header should still stick correctly
- Content should not overlap

**Step 4: Final commit (if any adjustments needed)**

```bash
git add -A
git commit -m "fix(layout): adjust spacing after sticky header migration"
```

---

## Summary of Changes

| File              | Change                                         |
|-------------------|------------------------------------------------|
| `_header.scss`    | `position: fixed` → `position: sticky`         |
| `_base.scss`      | Remove `padding-top: $header-height` from main |
| `_hero.scss`      | Remove `margin-top: -$header-height`           |
| `_blog-hero.scss` | Remove `margin-top: -$header-height`           |

**Total: 4 files, ~4 lines removed/changed**
