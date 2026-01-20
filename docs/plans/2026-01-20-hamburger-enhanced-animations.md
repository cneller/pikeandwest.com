# Hamburger Enhanced Animations Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 5 layered micro-animations to the hamburger menu for a premium, polished feel.

**Architecture:** Pure CSS animations layered onto existing hamburger styles. Each animation builds on the previous without breaking existing functionality. Uses CSS transitions with staggered timing and elastic easing.

**Tech Stack:** SCSS, CSS transitions, cubic-bezier easing functions

---

## Animations to Implement

| #  | Animation              | Description                                        |
|----|------------------------|----------------------------------------------------|
| 3  | Staggered Hover Spread | Top bar spreads first, bottom follows (50ms delay) |
| 4  | Rotation on Hover      | Slight 3° rotation before full X animation         |
| 5  | Middle Bar Shrink      | Middle bar shortens on hover (24px → 18px)         |
| 7  | Elastic Overshoot      | Enhanced spring effect on X formation              |
| 10 | Squeeze Effect         | Bars compress to center before rotating            |

---

### Task 1: Staggered Hover Spread

**Files:**

- Modify: `assets/scss/_header.scss:100-108`

**Step 1: Update hover transitions for staggered timing**

The current hover spread moves both bars simultaneously. Add transition delays so top bar moves first.

Find this code (around line 81-97):

```scss
// Top bar: staggered timing with elastic ease
&::before {
  top: -8px;
  transition:
    top 0.2s ease,
    transform 0.2s 0.12s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    background-color 0.25s ease;
}

// Bottom bar: slightly later stagger for cascading effect
&::after {
  bottom: -8px;
  transition:
    bottom 0.2s ease,
    transform 0.2s 0.15s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    background-color 0.25s ease;
}
```

Replace with:

```scss
// Top bar: moves first on hover (no delay)
&::before {
  top: -8px;
  transition:
    top 0.15s ease,
    transform 0.2s 0.12s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    background-color 0.25s ease,
    width 0.2s ease;
}

// Bottom bar: follows top with 50ms delay on hover
&::after {
  bottom: -8px;
  transition:
    bottom 0.15s 0.05s ease,
    transform 0.2s 0.15s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    background-color 0.25s ease,
    width 0.2s ease;
}
```

**Step 2: Verify visually**

Run: `hugo server -D`
Test: Hover over hamburger (mobile view or resize window to <768px)
Expected: Top bar spreads first, bottom bar follows ~50ms later

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): add staggered hover spread timing"
```

---

### Task 2: Rotation on Hover (Pre-animation)

**Files:**

- Modify: `assets/scss/_header.scss:100-108`

**Step 1: Add slight rotation to hover state**

Find this code (around line 100-108):

```scss
// Hover state - bars spread apart slightly (anticipation)
&__hamburger:hover .header__hamburger-inner {
  &::before {
    top: -9px;
  }
  &::after {
    bottom: -9px;
  }
}
```

Replace with:

```scss
// Hover state - bars spread + slight rotation (anticipation)
&__hamburger:hover .header__hamburger-inner {
  // Subtle rotation hints at upcoming animation
  transform: translate(-50%, -50%) rotate(3deg);

  &::before {
    top: -9px;
  }
  &::after {
    bottom: -9px;
  }
}
```

**Step 2: Add rotation transition to inner element**

Find this code (around line 66-68):

```scss
transform: translate(-50%, -50%);
// Middle bar fades out on open
transition: background-color 0.15s ease;
```

Replace with:

```scss
transform: translate(-50%, -50%);
// Middle bar fades out on open + rotation on hover
transition:
  background-color 0.15s ease,
  transform 0.2s ease,
  width 0.2s ease;
```

**Step 3: Verify visually**

Run: `hugo server -D`
Test: Hover over hamburger
Expected: Entire icon rotates 3° clockwise while bars spread

**Step 4: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): add subtle rotation on hover"
```

---

### Task 3: Middle Bar Shrink on Hover

**Files:**

- Modify: `assets/scss/_header.scss:100-108`

**Step 1: Add width shrink to middle bar on hover**

Find the hover state (updated in Task 2):

```scss
// Hover state - bars spread + slight rotation (anticipation)
&__hamburger:hover .header__hamburger-inner {
  // Subtle rotation hints at upcoming animation
  transform: translate(-50%, -50%) rotate(3deg);

  &::before {
    top: -9px;
  }
  &::after {
    bottom: -9px;
  }
}
```

Replace with:

```scss
// Hover state - spread + rotation + middle shrink (anticipation)
&__hamburger:hover .header__hamburger-inner {
  // Middle bar shrinks, hinting it will disappear
  width: 18px;
  // Subtle rotation hints at upcoming animation
  transform: translate(-50%, -50%) rotate(3deg);

  &::before {
    top: -9px;
  }
  &::after {
    bottom: -9px;
  }
}
```

**Step 2: Verify visually**

Run: `hugo server -D`
Test: Hover over hamburger
Expected: Middle bar shrinks from 24px to 18px while rotating and spreading

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): shrink middle bar on hover"
```

---

### Task 4: Enhanced Elastic Overshoot

**Files:**

- Modify: `assets/scss/_header.scss:81-97`

**Step 1: Increase elastic overshoot in cubic-bezier**

Current easing: `cubic-bezier(0.68, -0.3, 0.32, 1.3)` (subtle overshoot)
New easing: `cubic-bezier(0.68, -0.55, 0.32, 1.6)` (more pronounced spring)

Find the transition definitions (modified in Task 1):

```scss
// Top bar: moves first on hover (no delay)
&::before {
  top: -8px;
  transition:
    top 0.15s ease,
    transform 0.2s 0.12s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    background-color 0.25s ease,
    width 0.2s ease;
}

// Bottom bar: follows top with 50ms delay on hover
&::after {
  bottom: -8px;
  transition:
    bottom 0.15s 0.05s ease,
    transform 0.2s 0.15s cubic-bezier(0.68, -0.3, 0.32, 1.3),
    background-color 0.25s ease,
    width 0.2s ease;
}
```

Replace with:

```scss
// Top bar: moves first on hover, elastic snap on X
&::before {
  top: -8px;
  transition:
    top 0.15s ease,
    transform 0.25s 0.1s cubic-bezier(0.68, -0.55, 0.32, 1.6),
    background-color 0.25s ease,
    width 0.2s ease;
}

// Bottom bar: follows top, elastic snap on X
&::after {
  bottom: -8px;
  transition:
    bottom 0.15s 0.05s ease,
    transform 0.25s 0.12s cubic-bezier(0.68, -0.55, 0.32, 1.6),
    background-color 0.25s ease,
    width 0.2s ease;
}
```

**Step 2: Verify visually**

Run: `hugo server -D`
Test: Click hamburger to open menu
Expected: Bars overshoot rotation then spring back (more pronounced than before)

**Step 3: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): enhance elastic overshoot on X formation"
```

---

### Task 5: Squeeze Effect (Two-Phase Animation)

**Files:**

- Modify: `assets/scss/_header.scss:110-128`

**Step 1: Update open state for squeeze-then-rotate**

The squeeze effect requires bars to first move to center (top: 0, bottom: 0) before rotating. This is achieved by removing the delay on position but keeping delay on rotation.

Find the open state (around line 110-128):

```scss
// Open state - animate to X with gold color
&__hamburger[aria-expanded='true'] {
  .header__hamburger-inner {
    // Hide middle bar only (not the whole element)
    background-color: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
      background-color: $color-gold; // Brand accent on open
    }

    &::after {
      bottom: 0;
      transform: rotate(-45deg);
      background-color: $color-gold; // Brand accent on open
    }
  }
}
```

This already works correctly because:

- `top`/`bottom` transitions have NO delay (0.15s ease)
- `transform` (rotation) transitions have DELAY (0.1s/0.12s)

The bars naturally squeeze to center first, THEN rotate.

**Step 2: Fine-tune timing for more pronounced squeeze**

Update the transitions to make squeeze phase more visible:

Find (from Task 4):

```scss
// Top bar: moves first on hover, elastic snap on X
&::before {
  top: -8px;
  transition:
    top 0.15s ease,
    transform 0.25s 0.1s cubic-bezier(0.68, -0.55, 0.32, 1.6),
    background-color 0.25s ease,
    width 0.2s ease;
}

// Bottom bar: follows top, elastic snap on X
&::after {
  bottom: -8px;
  transition:
    bottom 0.15s 0.05s ease,
    transform 0.25s 0.12s cubic-bezier(0.68, -0.55, 0.32, 1.6),
    background-color 0.25s ease,
    width 0.2s ease;
}
```

Replace with (increased rotation delay for more visible squeeze):

```scss
// Top bar: squeeze first (0.15s), then rotate (after 0.15s delay)
&::before {
  top: -8px;
  transition:
    top 0.15s ease,
    transform 0.25s 0.15s cubic-bezier(0.68, -0.55, 0.32, 1.6),
    background-color 0.25s ease,
    width 0.2s ease;
}

// Bottom bar: squeeze with stagger (0.05s), then rotate (after 0.17s delay)
&::after {
  bottom: -8px;
  transition:
    bottom 0.15s 0.05s ease,
    transform 0.25s 0.17s cubic-bezier(0.68, -0.55, 0.32, 1.6),
    background-color 0.25s ease,
    width 0.2s ease;
}
```

**Step 3: Verify visually**

Run: `hugo server -D`
Test: Click hamburger to open menu
Expected:

1. Phase 1 (0-0.15s): Bars squeeze toward center
2. Phase 2 (0.15s+): Bars rotate with elastic overshoot to form X

**Step 4: Commit**

```bash
git add assets/scss/_header.scss
git commit -m "feat(hamburger): add two-phase squeeze-then-rotate animation"
```

---

### Task 6: Final Polish & Verification

**Files:**

- Review: `assets/scss/_header.scss`

**Step 1: Test complete animation sequence**

1. Load site at mobile width (<768px)
2. **Hover test:**
   - Top bar spreads first (top: -9px)
   - Bottom bar follows 50ms later (bottom: -9px)
   - Middle bar shrinks (24px → 18px)
   - Entire icon rotates 3°
3. **Click test (open):**
   - Middle bar fades out
   - Top/bottom bars squeeze to center (0.15s)
   - Bars rotate with elastic overshoot to form gold X
4. **Click test (close):**
   - Bars rotate back
   - Bars spread back to original position
   - Middle bar fades back in

**Step 2: Test reduced motion preference**

1. Enable "Reduce motion" in OS settings
2. Verify animations are disabled/instant

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat(hamburger): complete enhanced animation system

- Staggered hover spread (top first, bottom follows)
- Subtle 3° rotation on hover
- Middle bar shrinks on hover (anticipation)
- Enhanced elastic overshoot on X formation
- Two-phase squeeze-then-rotate animation"
```

---

## Summary of Changes

| Property            | Before       | After            |
|---------------------|--------------|------------------|
| Hover spread timing | Simultaneous | Staggered (50ms) |
| Hover rotation      | None         | 3° clockwise     |
| Middle bar on hover | No change    | Shrinks to 18px  |
| Elastic overshoot   | `-0.3, 1.3`  | `-0.55, 1.6`     |
| Rotation delay      | 0.12s/0.15s  | 0.15s/0.17s      |

**Total animation phases on click:**

1. Squeeze (0-0.15s)
2. Rotate with overshoot (0.15s-0.4s)
3. Settle (0.4s+)
