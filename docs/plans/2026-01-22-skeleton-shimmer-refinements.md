# Skeleton Shimmer Refinements

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine skeleton shimmer to use pure shape-based placeholders with rounded corners, no borders, and shimmer bars for labels and buttons.

**Design Principles:**

- No borders on any skeleton elements (pure shapes)
- 8px border-radius on all elements (luxury-modern feel)
- Labels become small shimmer bars instead of text
- Button becomes shimmer bar matching real button dimensions
- Maintain staggered animation timing

---

## Task 1: Remove Borders and Add Border-Radius to Inputs/Selects

**Files:**

- Modify: `assets/scss/_contact.scss` (the `&__input, &__select` block around line 365-383)

**Changes:**

Replace the `&__input, &__select` block with:

```scss
&__input,
&__select {
  height: 42px;
  padding: 0 20px 0 12px;
  background: linear-gradient(
    110deg,
    $color-white 0%,
    rgba($color-cream, 0.5) 25%,
    $color-white 50%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
}
```

**Verify:** `hugo server --port 1314` - inputs should have no border, rounded corners

**Commit:** `style(contact): remove borders, add 8px radius to input skeletons`

---

## Task 2: Update Select Dropdown Arrow for Borderless Design

**Files:**

- Modify: `assets/scss/_contact.scss` (the `&__select` block around line 385-401)

**Changes:**

Update the `&__select` block - the arrow should still be visible but work with borderless design:

```scss
&__select {
  position: relative;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid rgba($color-black, 0.3);
  }
}
```

**Note:** Arrow color lightened to 30% opacity to feel more skeleton-like.

**Commit:** `style(contact): soften dropdown arrow in skeleton state`

---

## Task 3: Remove Border and Add Border-Radius to Textarea

**Files:**

- Modify: `assets/scss/_contact.scss` (the `&__textarea` block around line 404-420)

**Changes:**

Update the `&__textarea` block:

```scss
&__textarea {
  height: 180px;
  padding: 12px;
  background: linear-gradient(
    110deg,
    $color-white 0%,
    rgba($color-cream, 0.5) 25%,
    $color-white 50%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
}
```

**Commit:** `style(contact): remove border, add radius to textarea skeleton`

---

## Task 4: Convert Labels to Shimmer Bars

**Files:**

- Modify: `layouts/partials/contact-form-facade.html` - replace label text with empty spans
- Modify: `assets/scss/_contact.scss` - update label styles

**HTML Changes:**

In `contact-form-facade.html`, replace all `<label>` elements. Change from:

```html
<label class="contact-facade__label">FULL NAME</label>
```

To:

```html
<div class="contact-facade__label"></div>
```

Do this for ALL labels in the file (there are 10 labels total).

**SCSS Changes:**

Replace the `&__label` block with:

```scss
&__label {
  width: 120px; // Approximate label width
  height: 14px;
  background: linear-gradient(
    110deg,
    rgba($color-cream, 0.8) 0%,
    rgba($color-white, 0.5) 25%,
    rgba($color-cream, 0.8) 50%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  border-radius: 4px;
}
```

**Note:** Labels use 4px radius (smaller than inputs) and narrower shimmer bar.

**Commit:** `feat(contact): convert labels to shimmer bars`

---

## Task 5: Vary Label Widths for Realistic Appearance

**Files:**

- Modify: `layouts/partials/contact-form-facade.html` - add width modifier classes

**Changes:**

Add modifier classes to labels based on original text length:

```html
{{/* Row 1 */}}
<div class="contact-facade__label contact-facade__label--md"></div>  {{/* FULL NAME */}}
<div class="contact-facade__label contact-facade__label--sm"></div>  {{/* EMAIL */}}

{{/* Row 2 */}}
<div class="contact-facade__label contact-facade__label--lg"></div>  {{/* PHONE NUMBER */}}
<div class="contact-facade__label contact-facade__label--xl"></div>  {{/* HOW DID YOU HEAR ABOUT US? */}}

{{/* Row 3 */}}
<div class="contact-facade__label contact-facade__label--xl"></div>  {{/* WHAT TYPE OF EVENT ARE YOU PLANNING? */}}
<div class="contact-facade__label contact-facade__label--xl"></div>  {{/* ESTIMATED NUMBER OF GUESTS */}}

{{/* Row 4 */}}
<div class="contact-facade__label contact-facade__label--xl"></div>  {{/* WHAT DATE DO YOU HAVE IN MIND? */}}
<div class="contact-facade__label contact-facade__label--lg"></div>  {{/* IS YOUR DATE FLEXIBLE? */}}

{{/* Textarea */}}
<div class="contact-facade__label contact-facade__label--xl"></div>  {{/* TELL US ALL ABOUT YOUR EVENT */}}
```

**SCSS - add width modifiers after the `&__label` block:**

```scss
&__label {
  // ... existing styles ...

  &--sm { width: 60px; }   // EMAIL
  &--md { width: 100px; }  // FULL NAME
  &--lg { width: 160px; }  // PHONE NUMBER, IS YOUR DATE FLEXIBLE
  &--xl { width: 220px; }  // Longer labels
}
```

**Commit:** `style(contact): vary label shimmer widths for realism`

---

## Task 6: Convert Button to Shimmer

**Files:**

- Modify: `layouts/partials/contact-form-facade.html` - update button markup
- Modify: `assets/scss/_contact.scss` - update button styles

**HTML Changes:**

Replace the submit section:

```html
<div class="contact-facade__submit">
  <div class="contact-facade__button"></div>
</div>
```

**SCSS Changes:**

Find the `&__button` and `&__submit` blocks and update:

```scss
&__submit {
  margin-top: 32px;
  display: flex;
  justify-content: flex-start; // HoneyBook aligns left
}

&__button {
  width: 200px; // Approximate HoneyBook button width
  height: 50px; // Approximate HoneyBook button height
  background: linear-gradient(
    110deg,
    rgba($color-cream, 0.9) 0%,
    rgba($color-white, 0.6) 25%,
    rgba($color-cream, 0.9) 50%
  );
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
  animation-delay: 0.5s; // After all form fields
  border: none;
  border-radius: 8px;
}
```

**Commit:** `feat(contact): convert submit button to shimmer bar`

---

## Task 7: Update Reduced Motion Styles

**Files:**

- Modify: `assets/scss/_contact.scss` - update the `@media (prefers-reduced-motion)` block

**Changes:**

Update the reduced motion block to include new elements:

```scss
// Accessibility: Respect reduced motion preference
@media (prefers-reduced-motion: reduce) {
  .contact-facade__input,
  .contact-facade__select,
  .contact-facade__textarea,
  .contact-facade__label,
  .contact-facade__button {
    animation: none;
  }

  .contact-facade__input,
  .contact-facade__select,
  .contact-facade__textarea,
  .contact-facade__label,
  .contact-facade__button {
    background: rgba($color-cream, 0.7);
  }
}
```

**Commit:** `a11y(contact): update reduced motion for new shimmer elements`

---

## Final Verification

**Visual checklist:**

- [ ] All form fields have no borders
- [ ] All elements have 8px border-radius (labels 4px)
- [ ] Labels appear as small shimmer bars of varying widths
- [ ] Button appears as shimmer bar
- [ ] Staggered animation still flows naturally
- [ ] Dropdown arrows visible but subtle
- [ ] Smooth crossfade to real form still works
- [ ] Reduced motion disables all animations

**Test commands:**

```bash
hugo server --port 1314
# Navigate to http://localhost:1314/contact/
# Test reduced motion in DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion
```

---

## Summary

| Task | Description                           | Files                                       |
|------|---------------------------------------|---------------------------------------------|
| 1    | Remove borders, add radius to inputs  | `_contact.scss`                             |
| 2    | Soften dropdown arrow                 | `_contact.scss`                             |
| 3    | Remove border, add radius to textarea | `_contact.scss`                             |
| 4    | Convert labels to shimmer bars        | `_contact.scss`, `contact-form-facade.html` |
| 5    | Vary label widths                     | `_contact.scss`, `contact-form-facade.html` |
| 6    | Convert button to shimmer             | `_contact.scss`, `contact-form-facade.html` |
| 7    | Update reduced motion styles          | `_contact.scss`                             |

**Expected Result:** Clean, modern skeleton loader with pure shape-based placeholders, rounded corners, and no borders - aligned with luxury brand aesthetic.
