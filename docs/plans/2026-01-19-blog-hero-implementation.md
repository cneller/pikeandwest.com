# Blog Hero Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the heavy black page-header banner on blog pages with a hero-style image header that matches the site's luxury aesthetic.

**Architecture:** Create a new `.blog-hero` SCSS component reusing patterns from the homepage `.hero`. Blog list uses a static venue image; single posts use their featured image with fallback to the venue image.

**Tech Stack:** Hugo templates, SCSS, Hugo Pipes for image processing

---

## Task 1: Create Blog Hero SCSS Component

**Files:**

- Create: `assets/scss/_blog-hero.scss`
- Modify: `assets/scss/main.scss:26` (add import before `_blog.scss`)

**Step 1: Create the blog-hero SCSS file**

Create `assets/scss/_blog-hero.scss`:

```scss
// =========================
// Blog Hero Section
// =========================
// Simplified hero for blog pages, inspired by homepage hero

.blog-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40vh;
  min-height: 300px;
  max-height: 500px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  // Dark overlay for text readability
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
  }

  // Tablet
  @media (max-width: $breakpoint-lg) {
    height: 35vh;
    min-height: 250px;
  }

  // Mobile
  @media (max-width: $breakpoint-md) {
    height: 30vh;
    min-height: 200px;
  }

  &__content {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: $spacing-lg;
  }

  &__title {
    font-family: $font-display;
    font-size: 2.5rem;
    font-weight: $font-weight-regular;
    letter-spacing: 0.1em;
    color: $color-cream;
    margin: 0;
    text-transform: uppercase;

    @media (min-width: $breakpoint-xl) {
      font-size: 3rem;
    }

    @media (max-width: $breakpoint-md) {
      font-size: 2rem;
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    margin-top: $spacing-sm;
    font-family: $font-secondary;
    font-size: $font-size-sm;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__author {
    &::before {
      content: '|';
      margin-right: $spacing-md;
    }
  }
}
```

**Step 2: Add import to main.scss**

In `assets/scss/main.scss`, add the import before the blog import (line 26):

```scss
@import 'blog-hero';
@import 'blog';
```

**Step 3: Verify SCSS compiles**

Run: `hugo server`
Expected: Server starts without SCSS compilation errors

**Step 4: Commit**

```bash
git add assets/scss/_blog-hero.scss assets/scss/main.scss
git commit -m "feat(blog): add blog-hero SCSS component"
```

---

## Task 2: Update Blog List Template

**Files:**

- Modify: `layouts/blog/list.html:1-10`

**Step 1: Replace page-header with blog-hero**

Replace the entire `layouts/blog/list.html` content with:

```go-html-template
{{ define "main" }}
{{/* Blog Hero */}}
{{ $heroImage := resources.Get "images/venue/venue-06-soft-seating.jpg" }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}

<section class="blog-hero" style="background-image: url('{{ $heroBg }}');">
  <div class="blog-hero__content">
    <h1 class="blog-hero__title">{{ .Title }}</h1>
  </div>
</section>

{{/* Blog List */}}
<section class="blog-list section">
  <div class="container">
    {{ if .Pages }}
    <div class="blog-list__grid">
      {{ range .Pages.ByDate.Reverse }}
      <article class="blog-card">
        {{ with .Params.image }}
        {{ $img := resources.Get . }}
        {{ if $img }}
        {{ $resized := $img.Resize "600x400 q85" }}
        <a href="{{ $.Permalink }}" class="blog-card__image-link">
          <img
            src="{{ $resized.RelPermalink }}"
            alt="{{ $.Params.image_alt | default $.Title }}"
            class="blog-card__image"
            loading="lazy"
          />
        </a>
        {{ end }}
        {{ end }}
        <div class="blog-card__content">
          <time class="blog-card__date" datetime="{{ .Date.Format "2006-01-02" }}">
            {{ .Date.Format "January 2, 2006" }}
          </time>
          <h2 class="blog-card__title">
            <a href="{{ .Permalink }}">{{ .Title }}</a>
          </h2>
          <p class="blog-card__excerpt">
            {{ with .Description }}{{ . }}{{ else }}{{ .Summary | truncate 150 }}{{ end }}
          </p>
          <a href="{{ .Permalink }}" class="blog-card__link">Read More</a>
        </div>
      </article>
      {{ end }}
    </div>
    {{ else }}
    <p class="blog-list__empty">No blog posts yet. Check back soon!</p>
    {{ end }}
  </div>
</section>
{{ end }}
```

**Step 2: Verify in browser**

Run: `hugo server` (if not running)
Navigate to: `http://localhost:1313/blog/`
Expected: Hero image with "Blog" title, no black banner

**Step 3: Commit**

```bash
git add layouts/blog/list.html
git commit -m "feat(blog): replace page-header with hero image on list page"
```

---

## Task 3: Update Blog Single Template

**Files:**

- Modify: `layouts/blog/single.html:1-15`

**Step 1: Replace page-header with blog-hero using featured image**

Replace the entire `layouts/blog/single.html` content with:

```go-html-template
{{ define "main" }}
{{/* Blog Hero - Use post's featured image or fallback to venue image */}}
{{ $heroImage := "" }}
{{ with .Params.image }}
  {{ $heroImage = resources.Get . }}
{{ end }}
{{ if not $heroImage }}
  {{ $heroImage = resources.Get "images/venue/venue-06-soft-seating.jpg" }}
{{ end }}
{{ $heroBg := "" }}
{{ if $heroImage }}
  {{ $heroBg = ($heroImage.Resize "1920x q85").RelPermalink }}
{{ end }}

<section class="blog-hero" style="background-image: url('{{ $heroBg }}');">
  <div class="blog-hero__content">
    <h1 class="blog-hero__title">{{ .Title }}</h1>
    <div class="blog-hero__meta">
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "January 2, 2006" }}
      </time>
      {{ with .Params.author }}
      <span class="blog-hero__author">by {{ . }}</span>
      {{ end }}
    </div>
  </div>
</section>

{{/* Blog Content */}}
<article class="blog-post section">
  <div class="container">
    <div class="blog-post__content prose">
      {{ .Content }}
    </div>

    {{/* Post Navigation */}}
    <nav class="blog-post__nav">
      {{ with .PrevInSection }}
      <a href="{{ .Permalink }}" class="blog-post__nav-link blog-post__nav-link--prev">
        <span class="blog-post__nav-label">Previous</span>
        <span class="blog-post__nav-title">{{ .Title }}</span>
      </a>
      {{ end }}
      {{ with .NextInSection }}
      <a href="{{ .Permalink }}" class="blog-post__nav-link blog-post__nav-link--next">
        <span class="blog-post__nav-label">Next</span>
        <span class="blog-post__nav-title">{{ .Title }}</span>
      </a>
      {{ end }}
    </nav>

    <a href="/blog/" class="btn btn-outline">Back to Blog</a>
  </div>
</article>
{{ end }}
```

**Step 2: Verify in browser**

Navigate to: `http://localhost:1313/blog/welcome/` (or any blog post)
Expected: Hero with post's featured image (or fallback), post title, date/author meta

**Step 3: Commit**

```bash
git add layouts/blog/single.html
git commit -m "feat(blog): use featured image hero on single posts"
```

---

## Task 4: Clean Up Unused Styles

**Files:**

- Modify: `assets/scss/_blog.scss:237-254` (remove `.page-header__meta` and `.page-header__author`)

**Step 1: Remove page-header meta styles from blog SCSS**

In `assets/scss/_blog.scss`, delete lines 237-254 (the `.page-header__meta` and `.page-header__author` rules):

```scss
// DELETE THIS ENTIRE BLOCK:
// Page header meta for blog posts
.page-header__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  margin-top: $spacing-sm;
  font-family: $font-secondary;
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.8);
}

.page-header__author {
  &::before {
    content: '|';
    margin-right: $spacing-md;
  }
}
```

**Step 2: Verify no regressions**

Run: `hugo server`
Navigate to both `/blog/` and a single blog post
Expected: Both pages render correctly with hero styling

**Step 3: Commit**

```bash
git add assets/scss/_blog.scss
git commit -m "refactor(blog): remove unused page-header meta styles"
```

---

## Task 5: Final Verification

**Step 1: Test all blog pages**

- [ ] `/blog/` - List page shows hero with venue image, "Blog" title
- [ ] `/blog/welcome/` - Single post shows hero with featured image (or fallback), post title, meta
- [ ] Mobile responsive - Hero scales down appropriately at tablet/mobile breakpoints
- [ ] Text readable - Dark overlay provides sufficient contrast

**Step 2: Run production build**

Run: `hugo --gc --minify`
Expected: Build completes without errors

**Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix(blog): address any final hero adjustments"
```

---

## Summary

| Task | Description                 | Files                          |
|------|-----------------------------|--------------------------------|
| 1    | Create blog-hero SCSS       | `_blog-hero.scss`, `main.scss` |
| 2    | Update blog list template   | `layouts/blog/list.html`       |
| 3    | Update blog single template | `layouts/blog/single.html`     |
| 4    | Clean up unused styles      | `assets/scss/_blog.scss`       |
| 5    | Final verification          | N/A                            |
