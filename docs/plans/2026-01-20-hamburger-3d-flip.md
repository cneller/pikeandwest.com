# Hamburger 3D Flip Effect Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a 3D Y-axis flip animation to the hamburger menu when it transforms to/from the X state.

**Architecture:** Layer a `rotateY(180deg)` transform onto the existing hamburger animation. The button container provides `perspective`, the inner element has `transform-style: preserve-3d`, and the open state adds the Y-axis rotation. The existing squeeze-then-rotate animation continues to work, now with an added depth effect.

**Tech Stack:** SCSS, CSS 3D transforms, `perspective`, `transform-style: preserve-3d`

---

## Current State

The hamburger already has these animations:

- Staggered hover spread (top bar first, bottom follows)
- Lines grow on hover (24px → 27px)
- Subtle glow on hover
- Squeeze-then-rotate with elastic overshoot
- Gold color on open state
- X lines grow on hover (24px → 26px)

## 3D Flip Approach

The flip will:

1. Rotate the entire inner element 180° on Y-axis when opening
2. Happen simultaneously with the existing squeeze-then-rotate
3. Use the same elastic easing for consistency
4. Reverse smoothly when closing

---

### Task 1: Add Perspective to Container

**Files:**

- Modify: `assets/scss/_header.scss:42-55`

**Step 1: Add perspective property to hamburger button**

Find this code (around line 42-55):

```scss
&__hamburger {
  display: none;
  position: relative;
  width: 30px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}
```

Replace with:

```scss
&__hamburger {
  display: none;
  position: relative;
  width: 30px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  // 3D flip: perspective creates depth for child transforms
  perspective: 200px;

  @media (max-width: $breakpoint-md) {
    display: block;
  }
}
```

**Step 2: Verify visually**

Run: `hugo server -D`
Test: View hamburger at mobile width (<768px)
Expected: No visual change yet (perspective alone doesn't affect appearance)

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): add perspective for 3D flip effect"
```

---

### Task 2: Enable 3D Transform Style on Inner Element

**Files:**

- Modify: `assets/scss/_header.scss:58-71`

**Step 1: Add transform-style and backface-visibility**

Find this code (around line 58-71):

```scss
&__hamburger-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 2px;
  background-color: $color-medium-gray;
  border-radius: 1px;
  transform: translate(-50%, -50%);
  // Middle bar fades out on open + glow on hover
  transition:
    background-color 0.15s ease,
    width 0.2s ease,
    filter 0.2s ease;
```

Replace with:

```scss
&__hamburger-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 2px;
  background-color: $color-medium-gray;
  border-radius: 1px;
  transform: translate(-50%, -50%);
  // 3D flip: preserve-3d allows children to exist in 3D space
  transform-style: preserve-3d;
  // Middle bar fades out on open + glow on hover + 3D flip
  transition:
    background-color 0.15s ease,
    width 0.2s ease,
    filter 0.2s ease,
    transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

**Step 2: Verify visually**

Run: `hugo server -D`
Test: View hamburger at mobile width
Expected: No visual change yet (we haven't added the rotateY)

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): enable 3D transform style on inner element"
```

---

### Task 3: Add Y-Axis Flip to Open State

**Files:**

- Modify: `assets/scss/_header.scss:124-142`

**Step 1: Add rotateY to open state transform**

Find this code (around line 124-142):

```scss
// Open state - animate to X with gold color
&__hamburger[aria-expanded='true'] {
  .header__hamburger-inner {
    // Hide middle bar only (not the whole element)
    background-color: transparent;

    &::before {
      top: 0;
      transform: translateX(-50%) rotate(45deg);
      background-color: $color-gold; // Brand accent on open
    }

    &::after {
      bottom: 0;
      transform: translateX(-50%) rotate(-45deg);
      background-color: $color-gold; // Brand accent on open
    }
  }
}
```

Replace with:

```scss
// Open state - animate to X with gold color + 3D flip
&__hamburger[aria-expanded='true'] {
  .header__hamburger-inner {
    // Hide middle bar only (not the whole element)
    background-color: transparent;
    // 3D flip on Y-axis while transforming to X
    transform: translate(-50%, -50%) rotateY(180deg);

    &::before {
      top: 0;
      transform: translateX(-50%) rotate(45deg);
      background-color: $color-gold; // Brand accent on open
    }

    &::after {
      bottom: 0;
      transform: translateX(-50%) rotate(-45deg);
      background-color: $color-gold; // Brand accent on open
    }
  }
}
```

**Step 2: Verify visually**

Run: `hugo server -D`
Test: Click hamburger to open menu
Expected:

1. Icon flips 180° on Y-axis (like turning a card)
2. Bars squeeze to center and rotate to X simultaneously
3. Color changes to gold
4. Elastic overshoot visible on the flip

**Step 3: Test close animation**

Test: Click X to close menu
Expected: Icon flips back 180° while X transforms back to hamburger

**Step 4: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): add 3D Y-axis flip on open/close"
```

---

### Task 4: Fine-Tune Timing and Easing

**Files:**

- Modify: `assets/scss/_header.scss`

**Step 1: Adjust flip timing if needed**

If the flip feels too fast or slow, adjust the duration in the inner element's transition.

Current: `transform 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6)`

Options to try:

- Slower: `transform 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)`
- Less elastic: `transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)`
- More elastic: `transform 0.4s cubic-bezier(0.68, -0.8, 0.32, 1.8)`

**Step 2: Verify reduced motion preference**

Test: Enable "Reduce motion" in OS settings
Expected: Flip animation should be disabled (existing `prefers-reduced-motion` rule should handle this)

If not working, check the reduced motion media query includes the new transform.

**Step 3: Final commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): fine-tune 3D flip timing"
```

---

### Task 5: Final Verification

**Step 1: Test complete animation sequence**

1. Load site at mobile width (<768px)
2. **Hover test (closed):**
   - Lines spread apart (staggered)
   - Lines grow (24px → 27px)
   - Subtle glow appears
3. **Click test (open):**
   - Icon flips 180° on Y-axis
   - Bars squeeze to center
   - Bars rotate to gold X with elastic overshoot
4. **Hover test (open):**
   - X lines grow (24px → 26px)
   - Color darkens slightly
5. **Click test (close):**
   - Icon flips back 180°
   - X transforms back to hamburger
   - Color returns to gray

**Step 2: Cross-browser test**

Test in:

- Chrome
- Safari
- Firefox
- Mobile Safari (iOS)

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(hamburger): complete 3D flip animation

- Perspective on container (200px)
- preserve-3d on inner element
- rotateY(180deg) on open state
- Elastic easing matches existing animations
- Respects prefers-reduced-motion"
```

---

## Summary of Changes

| Property               | Element                    | Value                                      |
|------------------------|----------------------------|--------------------------------------------|
| `perspective`          | `.header__hamburger`       | `200px`                                    |
| `transform-style`      | `.header__hamburger-inner` | `preserve-3d`                              |
| `transform` transition | `.header__hamburger-inner` | `0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6)` |
| `transform` (open)     | `.header__hamburger-inner` | `translate(-50%, -50%) rotateY(180deg)`    |

**Animation sequence on click:**

1. Y-axis flip begins (0-0.4s)
2. Squeeze to center (0-0.15s)
3. Rotate to X with elastic overshoot (0.12s-0.42s)
4. Color transition to gold (0-0.25s)
