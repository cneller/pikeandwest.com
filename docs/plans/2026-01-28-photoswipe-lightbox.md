# PhotoSwipe Lightbox Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace custom lightbox with PhotoSwipe 5 for full-featured image galleries with swipe gestures, pinch-to-zoom, and keyboard navigation.

**Architecture:** Load PhotoSwipe via CDN with dynamic ES module imports. Use `data-pswp-gallery` attribute to opt-in any container as a gallery. Hugo templates compute image dimensions at build time for PhotoSwipe's sizing requirements.

**Tech Stack:** PhotoSwipe 5, Hugo image processing, ES modules, CSS variables for brand customization

---

## Task 1: Add PhotoSwipe CSS to Head

**Files:**

- Modify: `layouts/partials/head.html`

**Step 1: Add PhotoSwipe stylesheet**

Add before the closing custom styles, after the Google Fonts block:

```html
{{- /* PhotoSwipe lightbox */ -}}
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css">
```

**Step 2: Verify the change**

Run: `hugo server -D`
Expected: Site builds without errors, PhotoSwipe CSS loads (check Network tab)

**Step 3: Commit**

```bash
git add layouts/partials/head.html
git commit -m "feat(gallery): add PhotoSwipe CSS from CDN"
```

---

## Task 2: Replace initLightbox with initPhotoSwipe in main.js

**Files:**

- Modify: `assets/js/main.js`

**Step 1: Replace the initLightbox function**

Delete the entire `initLightbox()` function (lines 119-179) and replace with:

```javascript
// PhotoSwipe Gallery (replaces custom lightbox)
async function initPhotoSwipe() {
  const galleries = document.querySelectorAll('[data-pswp-gallery]');
  if (galleries.length === 0) return;

  // Dynamic import - only loads when galleries exist on page
  const { default: PhotoSwipeLightbox } = await import(
    'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.esm.min.js'
  );

  galleries.forEach((gallery) => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: gallery,
      children: 'a[data-pswp-width]',
      pswpModule: () =>
        import(
          'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.esm.min.js'
        ),
      // Luxury feel - slower, smoother animations
      showAnimationDuration: 300,
      hideAnimationDuration: 200,
      // Accessibility
      trapFocus: true,
      returnFocus: true,
      // Touch UX
      pinchToClose: true,
      closeOnVerticalDrag: true,
    });
    lightbox.init();
  });
}
```

**Step 2: Update DOMContentLoaded to call initPhotoSwipe**

Change line 8 from `initLightbox();` to `initPhotoSwipe();`

**Step 3: Verify JS syntax**

Run: `npx eslint assets/js/main.js` (if eslint configured) or check browser console
Expected: No syntax errors

**Step 4: Commit**

```bash
git add assets/js/main.js
git commit -m "feat(gallery): replace custom lightbox with PhotoSwipe initialization"
```

---

## Task 3: Update venue-gallery.html Template

**Files:**

- Modify: `layouts/partials/venue-gallery.html`

**Step 1: Add data-pswp-gallery attribute to carousel container**

Change line 6-11 from:

```html
<div
  class="venue-gallery__carousel"
  role="region"
  aria-label="Venue photo gallery"
  aria-roledescription="carousel"
>
```

To:

```html
<div
  class="venue-gallery__carousel"
  role="region"
  aria-label="Venue photo gallery"
  aria-roledescription="carousel"
  data-pswp-gallery="venue"
>
```

**Step 2: Wrap images in anchor tags with PhotoSwipe data attributes**

Replace lines 22-37 (the `<li>` content) with:

```html
<li class="venue-gallery__slide" data-index="{{ $index }}">
  <a href="{{ $fullJpg.RelPermalink }}"
     data-pswp-width="{{ $fullJpg.Width }}"
     data-pswp-height="{{ $fullJpg.Height }}"
     data-pswp-srcset="{{ $fullWebp.RelPermalink }} {{ $fullWebp.Width }}w"
     data-cropped="true">
    <picture>
      <source type="image/webp" srcset="{{ $thumbWebp.RelPermalink }}">
      <img
        src="{{ $thumbJpg.RelPermalink }}"
        alt="{{ $item.alt }}"
        class="venue-gallery__image"
        width="{{ $thumbJpg.Width }}"
        height="{{ $thumbJpg.Height }}"
        loading="lazy"
        decoding="async"
      >
    </picture>
  </a>
</li>
```

**Step 3: Remove the old lightbox HTML block**

Delete lines 81-93 (the `{{- /* Lightbox */ -}}` comment and entire `<div class="lightbox">` block).

**Step 4: Verify Hugo builds**

Run: `hugo server -D`
Expected: Site builds, homepage renders, gallery images are wrapped in links

**Step 5: Commit**

```bash
git add layouts/partials/venue-gallery.html
git commit -m "feat(gallery): update venue gallery template for PhotoSwipe"
```

---

## Task 4: Update Gallery SCSS

**Files:**

- Modify: `assets/scss/_gallery.scss`

**Step 1: Add anchor styling to venue-gallery\_\_slide**

After line 83 (closing brace of `&__slide`), but before `&__image`, add:

```scss
&__slide a {
  display: block;
  text-decoration: none;
}
```

**Step 2: Change cursor style on image**

Change line 89 from `cursor: pointer;` to `cursor: zoom-in;`

**Step 3: Remove old lightbox styles**

Delete lines 201-252 (the entire `.lightbox` block and all its nested styles).

**Step 4: Add PhotoSwipe brand customization**

At the end of the file (after removing lightbox styles), add:

```scss
// PhotoSwipe brand overrides
.pswp {
  --pswp-bg: rgba(0, 0, 0, 0.92);
  --pswp-icon-color: #{$color-white};
  --pswp-icon-color-secondary: rgba(255, 255, 255, 0.6);
}
```

**Step 5: Verify SCSS compiles**

Run: `hugo server -D`
Expected: No SCSS compilation errors, styles apply correctly

**Step 6: Commit**

```bash
git add assets/scss/_gallery.scss
git commit -m "feat(gallery): update SCSS for PhotoSwipe, remove old lightbox styles"
```

---

## Task 5: Manual Testing of PhotoSwipe Features

**Files:** None (testing only)

**Step 1: Test basic lightbox open/close**

1. Run `hugo server -D`
2. Navigate to homepage
3. Click any gallery image
4. Expected: PhotoSwipe opens with smooth animation, image displays full-size

**Step 2: Test keyboard navigation**

1. With lightbox open, press Right Arrow
2. Expected: Navigates to next image
3. Press Left Arrow
4. Expected: Navigates to previous image
5. Press Escape
6. Expected: Lightbox closes, focus returns to clicked image

**Step 3: Test touch gestures (use Chrome DevTools mobile emulation)**

1. Open DevTools > Toggle device toolbar > Select mobile device
2. Click gallery image to open lightbox
3. Swipe left/right
4. Expected: Navigates between images
5. Pinch gesture (hold Shift + drag in DevTools)
6. Expected: Zooms in/out
7. Swipe down
8. Expected: Closes lightbox

**Step 4: Test counter display**

1. Open lightbox
2. Expected: Counter shows "1 / 10" (or actual image count) in top-left

**Step 5: Verify accessibility**

1. Open lightbox
2. Press Tab
3. Expected: Focus moves through lightbox controls (close, arrows)
4. Close lightbox
5. Expected: Focus returns to the image that was clicked

**Step 6: Commit verification complete**

```bash
git commit --allow-empty -m "test: verify PhotoSwipe features manually"
```

---

## Task 6: Create Gallery Shortcode for Blog Posts

**Files:**

- Create: `layouts/shortcodes/gallery.html`

**Step 1: Create the shortcode file**

Create `layouts/shortcodes/gallery.html` with:

```html
{{/*
  Gallery shortcode for PhotoSwipe lightbox

  Usage:
    {{</* gallery name="reception" */>}}
    ![Alt text](image1.jpg)
    ![Alt text](image2.jpg)
    {{</* /gallery */>}}

  Parameters:
    - name: Gallery group name (default: "gallery")
    - cols: Number of columns 2-4 (default: "3")
*/}}
{{ $name := .Get "name" | default "gallery" }}
{{ $cols := .Get "cols" | default "3" }}
{{ $page := .Page }}

<div class="gallery gallery--cols-{{ $cols }}" data-pswp-gallery="{{ $name }}">
  {{- $inner := .Inner -}}
  {{- /* Parse markdown images from inner content */ -}}
  {{- range findRE `!\[([^\]]*)\]\(([^)]+)\)` $inner -}}
    {{- $alt := . | replaceRE `!\[([^\]]*)\]\(([^)]+)\)` "$1" -}}
    {{- $src := . | replaceRE `!\[([^\]]*)\]\(([^)]+)\)` "$2" -}}
    {{- /* Handle page bundle images (relative) and static images (absolute) */ -}}
    {{- $image := "" -}}
    {{- if hasPrefix $src "/" -}}
      {{- $image = resources.Get (strings.TrimPrefix "/" $src) -}}
    {{- else -}}
      {{- $image = $page.Resources.GetMatch $src -}}
    {{- end -}}
    {{- if $image -}}
      {{- $thumb := $image.Resize "400x webp q85" -}}
      {{- $full := $image.Resize "1600x webp q90" -}}
      <a href="{{ $full.RelPermalink }}"
         data-pswp-width="{{ $full.Width }}"
         data-pswp-height="{{ $full.Height }}">
        <img src="{{ $thumb.RelPermalink }}"
             alt="{{ $alt }}"
             width="{{ $thumb.Width }}"
             height="{{ $thumb.Height }}"
             loading="lazy"
             decoding="async">
      </a>
    {{- end -}}
  {{- end -}}
</div>
```

**Step 2: Verify shortcode syntax**

Run: `hugo server -D`
Expected: No template parsing errors

**Step 3: Commit**

```bash
git add layouts/shortcodes/gallery.html
git commit -m "feat(gallery): add gallery shortcode for blog posts"
```

---

## Task 7: Add Gallery Grid Styles

**Files:**

- Modify: `assets/scss/_gallery.scss`

**Step 1: Add gallery grid styles**

At the end of `_gallery.scss` (after the PhotoSwipe overrides), add:

```scss
// Blog post gallery grid
.gallery {
  display: grid;
  gap: $spacing-md;
  margin: $spacing-xl 0;

  &--cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }
  &--cols-3 {
    grid-template-columns: repeat(3, 1fr);
  }
  &--cols-4 {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: $breakpoint-md) {
    &--cols-3,
    &--cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: $breakpoint-sm) {
    &--cols-2,
    &--cols-3,
    &--cols-4 {
      grid-template-columns: 1fr;
    }
  }

  a {
    display: block;
    overflow: hidden;
    border-radius: 8px;
  }

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 4/3;
    object-fit: cover;
    cursor: zoom-in;
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.03);
    }
  }
}
```

**Step 2: Verify SCSS compiles**

Run: `hugo server -D`
Expected: No compilation errors

**Step 3: Commit**

```bash
git add assets/scss/_gallery.scss
git commit -m "feat(gallery): add grid styles for blog gallery shortcode"
```

---

## Task 8: Test Gallery Shortcode in Blog Post

**Files:**

- Modify: Any existing blog post with images, or create test content

**Step 1: Add gallery shortcode to a test blog post**

In any blog post with multiple images in its page bundle, add:

```markdown
{{< gallery name="test-gallery" cols="2" >}}
![First image](image1.jpg)
![Second image](image2.jpg)
{{< /gallery >}}
```

**Step 2: Test the gallery**

Run: `hugo server -D`
Navigate to the blog post
Expected:

- Images display in 2-column grid
- Clicking opens PhotoSwipe
- Can navigate between images in this gallery only (separate from venue gallery)

**Step 3: Remove test content or keep if useful**

If test content was temporary, revert. If it's a real blog post enhancement, keep it.

**Step 4: Commit (if keeping)**

```bash
git add content/blog/*/index.md
git commit -m "content: add gallery to blog post"
```

---

## Task 9: Update CLAUDE.md Documentation

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Add PhotoSwipe documentation**

Add a new section under "Implementation Patterns" (after the "Sticky Header" section, around line 85):

````markdown
### PhotoSwipe Lightbox

Site uses PhotoSwipe 5 for image galleries. Loaded via CDN with dynamic ES module imports.

**Enable on any gallery container:**
```html
<div data-pswp-gallery="unique-name">
  <a href="/full.jpg" data-pswp-width="1600" data-pswp-height="1200">
    <img src="/thumb.jpg" alt="Description">
  </a>
</div>
````

**Hugo template pattern** (with image processing):

```go-html-template
{{ $full := $image.Resize "1600x webp q90" }}
<a href="{{ $full.RelPermalink }}"
   data-pswp-width="{{ $full.Width }}"
   data-pswp-height="{{ $full.Height }}">
  <img src="{{ $thumb.RelPermalink }}" alt="{{ $alt }}">
</a>
```

**Blog post shortcode:**

```markdown
{{</* gallery name="event-name" cols="3" */>}}
![Alt text](image.jpg)
![Another image](image2.jpg)
{{</* /gallery */>}}
```

**Parameters:**

- `name`: Gallery group name (images navigate together)
- `cols`: Grid columns (2, 3, or 4; default 3)

````text

**Step 2: Update the shortcodes table in Blog Post Styling section**

Add to the "All Available Shortcodes" list (around line 175):

```markdown
#### Image Gallery

```markdown
{{</* gallery name="unique-name" cols="3" */>}}
![Alt text](image1.jpg)
![Alt text](image2.jpg)
{{</* /gallery */>}}
````

Opens in PhotoSwipe lightbox with swipe/zoom.

````text

**Step 3: Verify documentation renders**

Review the CLAUDE.md changes for clarity and accuracy.

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add PhotoSwipe lightbox usage to CLAUDE.md"
````

---

## Task 10: Final Integration Test and Production Build

**Files:** None (testing only)

**Step 1: Run production build**

```bash
hugo --gc --minify
```

Expected: Build completes without errors

**Step 2: Test production build locally**

```bash
npx serve public
```

Navigate to homepage, test:

- Gallery images load
- PhotoSwipe opens on click
- Navigation works
- Mobile gestures work (DevTools emulation)

**Step 3: Run Lighthouse audit**

In Chrome DevTools > Lighthouse > Run audit
Expected:

- Performance score maintained (no significant regression)
- Accessibility score maintained
- No new console errors

**Step 4: Final commit**

```bash
git commit --allow-empty -m "test: verify PhotoSwipe integration complete"
```

---

## Summary

| Task | Description                              | Files Changed                         |
|------|------------------------------------------|---------------------------------------|
| 1    | Add PhotoSwipe CSS                       | `layouts/partials/head.html`          |
| 2    | Replace initLightbox with initPhotoSwipe | `assets/js/main.js`                   |
| 3    | Update venue-gallery template            | `layouts/partials/venue-gallery.html` |
| 4    | Update gallery SCSS                      | `assets/scss/_gallery.scss`           |
| 5    | Manual feature testing                   | None                                  |
| 6    | Create gallery shortcode                 | `layouts/shortcodes/gallery.html`     |
| 7    | Add gallery grid styles                  | `assets/scss/_gallery.scss`           |
| 8    | Test shortcode in blog                   | Blog post content                     |
| 9    | Update documentation                     | `CLAUDE.md`                           |
| 10   | Final integration test                   | None                                  |

**Total commits:** 9-10 focused commits
**Estimated tasks:** 10 discrete tasks with clear verification steps
