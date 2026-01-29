# Blog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a blog section to Pike & West website with navigation integration in header (3rd priority) and footer.

**Architecture:** Hugo section-based blog using `content/blog/` directory with list and single templates. Blog posts use markdown with frontmatter for metadata. Navigation updated via menus.toml configuration.

**Tech Stack:** Hugo templates, SCSS following existing BEM patterns, structured data for BlogPosting schema.

---

## Task 1: Create Blog Content Structure

**Files:**

- Create: `content/blog/_index.md`
- Create: `archetypes/blog.md`

**Step 1: Create blog section index**

Create `content/blog/_index.md`:

```markdown
---
title: "Blog"
description: "News, tips, and inspiration from Pike & West - Germantown's premier art gallery and event venue."
layout: "list"
type: "blog"
---
```

**Step 2: Create blog archetype for new posts**

Create `archetypes/blog.md`:

```markdown
---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
description: ""
date: {{ .Date }}
draft: true
author: "Pike & West"
categories: []
tags: []
image: ""
image_alt: ""
---

Write your blog post content here.
```

**Step 3: Commit**

```bash
git add content/blog/_index.md archetypes/blog.md
git commit -m "feat(blog): add blog content structure and archetype"
```

---

## Task 2: Create Blog List Layout

**Files:**

- Create: `layouts/blog/list.html`

**Step 1: Create blog list template**

Create `layouts/blog/list.html`:

```html
{{ define "main" }}
{{/* Page Header */}}
<section class="page-header">
  <div class="container">
    <h1 class="page-header__title">{{ .Title }}</h1>
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

**Step 2: Verify template renders**

Run: `hugo server -D`

Navigate to: `http://localhost:1313/blog/`

Expected: Page renders with "Blog" header and "No blog posts yet" message.

**Step 3: Commit**

```bash
git add layouts/blog/list.html
git commit -m "feat(blog): add blog list layout template"
```

---

## Task 3: Create Blog Single Post Layout

**Files:**

- Create: `layouts/blog/single.html`

**Step 1: Create blog single template**

Create `layouts/blog/single.html`:

```html
{{ define "main" }}
{{/* Page Header */}}
<section class="page-header">
  <div class="container">
    <h1 class="page-header__title">{{ .Title }}</h1>
    <div class="page-header__meta">
      <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "January 2, 2006" }}
      </time>
      {{ with .Params.author }}
      <span class="page-header__author">by {{ . }}</span>
      {{ end }}
    </div>
  </div>
</section>

{{/* Blog Content */}}
<article class="blog-post section">
  <div class="container">
    {{ with .Params.image }}
    {{ $img := resources.Get . }}
    {{ if $img }}
    {{ $resized := $img.Resize "1200x q85" }}
    <figure class="blog-post__featured-image">
      <img
        src="{{ $resized.RelPermalink }}"
        alt="{{ $.Params.image_alt | default $.Title }}"
      />
    </figure>
    {{ end }}
    {{ end }}

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

**Step 2: Commit**

```bash
git add layouts/blog/single.html
git commit -m "feat(blog): add blog single post layout template"
```

---

## Task 4: Create Blog SCSS Styles

**Files:**

- Create: `assets/scss/_blog.scss`
- Modify: `assets/scss/main.scss`

**Step 1: Create blog styles**

Create `assets/scss/_blog.scss`:

```scss
// =========================
// Blog Styles
// =========================

// Blog List
.blog-list {
  padding: $spacing-3xl 0;

  &__grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: $spacing-2xl;

    @media (min-width: $breakpoint-md + 1) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: $breakpoint-xl) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__empty {
    text-align: center;
    color: $color-text-light;
    font-size: $font-size-lg;
    padding: $spacing-3xl 0;
  }
}

// Blog Card
.blog-card {
  background: $color-white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: box-shadow $transition-base;

  &:hover {
    box-shadow: $shadow-lg;
  }

  &__image-link {
    display: block;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform $transition-base;

    .blog-card:hover & {
      transform: scale(1.05);
    }
  }

  &__content {
    padding: $spacing-lg;
  }

  &__date {
    display: block;
    font-family: $font-secondary;
    font-size: $font-size-sm;
    color: $color-text-light;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: $spacing-sm;
  }

  &__title {
    font-family: $font-primary;
    font-size: $font-size-xl;
    font-weight: $font-weight-medium;
    margin: 0 0 $spacing-sm;
    line-height: 1.3;

    a {
      color: $color-text;
      text-decoration: none;

      &:hover {
        color: $color-gold;
      }
    }
  }

  &__excerpt {
    font-family: $font-secondary;
    font-size: $font-size-base;
    color: $color-text-light;
    line-height: 1.6;
    margin: 0 0 $spacing-md;
  }

  &__link {
    font-family: $font-primary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: $color-gold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Blog Post (Single)
.blog-post {
  padding: $spacing-3xl 0;

  .container {
    max-width: 800px;
  }

  &__featured-image {
    margin: 0 0 $spacing-2xl;

    img {
      width: 100%;
      height: auto;
    }
  }

  &__content {
    font-family: $font-secondary;
    font-size: $font-size-md;
    line-height: 1.8;
    color: $color-text;

    h2 {
      font-family: $font-primary;
      font-size: $font-size-2xl;
      font-weight: $font-weight-medium;
      margin: $spacing-2xl 0 $spacing-md;
      color: $color-text;
    }

    h3 {
      font-family: $font-primary;
      font-size: $font-size-xl;
      font-weight: $font-weight-medium;
      margin: $spacing-xl 0 $spacing-md;
      color: $color-text;
    }

    p {
      margin: 0 0 $spacing-lg;
    }

    ul,
    ol {
      margin: 0 0 $spacing-lg;
      padding-left: $spacing-xl;
    }

    li {
      margin-bottom: $spacing-sm;
    }

    blockquote {
      margin: $spacing-xl 0;
      padding: $spacing-lg $spacing-xl;
      border-left: 4px solid $color-gold;
      background: $color-cream;
      font-style: italic;

      p:last-child {
        margin-bottom: 0;
      }
    }

    img {
      max-width: 100%;
      height: auto;
      margin: $spacing-lg 0;
    }

    a {
      color: $color-gold;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__nav {
    display: flex;
    justify-content: space-between;
    gap: $spacing-lg;
    margin: $spacing-3xl 0 $spacing-xl;
    padding-top: $spacing-xl;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  &__nav-link {
    flex: 1;
    text-decoration: none;
    color: $color-text;

    &:hover {
      color: $color-gold;
    }

    &--prev {
      text-align: left;
    }

    &--next {
      text-align: right;
    }
  }

  &__nav-label {
    display: block;
    font-family: $font-secondary;
    font-size: $font-size-sm;
    color: $color-text-light;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: $spacing-xs;
  }

  &__nav-title {
    display: block;
    font-family: $font-primary;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
  }
}

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

**Step 2: Import blog styles in main.scss**

Modify `assets/scss/main.scss` - add after `@import 'forms';`:

```scss
@import 'blog';
```

**Step 3: Verify styles compile**

Run: `hugo server -D`

Expected: No SCSS compilation errors.

**Step 4: Commit**

```bash
git add assets/scss/_blog.scss assets/scss/main.scss
git commit -m "feat(blog): add blog SCSS styles"
```

---

## Task 5: Add Blog to Navigation

**Files:**

- Modify: `config/_default/menus.toml`

**Step 1: Update menus configuration**

Replace contents of `config/_default/menus.toml`:

```toml
# Main Navigation
# "Contact Us" is primary (gold filled), others are outline style
# Weight determines order: lower = higher priority

[[main]]
  name = "Contact Us"
  url = "/contact/"
  weight = 1

[[main]]
  name = "Artists"
  url = "/gallery-application/"
  weight = 2

[[main]]
  name = "Blog"
  url = "/blog/"
  weight = 3

# Footer Navigation

[[footer]]
  name = "Contact Us"
  url = "/contact/"
  weight = 1

[[footer]]
  name = "Blog"
  url = "/blog/"
  weight = 2
```

**Step 2: Update footer template to use menu**

The footer currently hardcodes the "Contact Us" link. Modify `layouts/partials/footer.html` to replace line 24:

Change:

```html
<a href="/contact/" class="footer__link">Contact Us</a>
```

To:

```html
<div class="footer__links">
  {{ range .Site.Menus.footer }}
  <a href="{{ .URL }}" class="footer__link">{{ .Name }}</a>
  {{ end }}
</div>
```

**Step 3: Add footer links styling**

Add to `assets/scss/_footer.scss` after `&__link` block (around line 41):

```scss
&__links {
  display: flex;
  gap: $spacing-lg;
}
```

**Step 4: Verify navigation**

Run: `hugo server -D`

Check:

- Header shows: Contact Us | Artists | Blog
- Footer shows: Contact Us | Blog

**Step 5: Commit**

```bash
git add config/_default/menus.toml layouts/partials/footer.html assets/scss/_footer.scss
git commit -m "feat(blog): add blog to header and footer navigation"
```

---

## Task 6: Add Sample Blog Post

**Files:**

- Create: `content/blog/welcome-to-pike-and-west.md`
- Create: `assets/images/blog/` directory (for future images)

**Step 1: Create sample blog post**

Create `content/blog/welcome-to-pike-and-west.md`:

```markdown
---
title: "Welcome to the Pike & West Blog"
description: "Introducing our new blog where we'll share event inspiration, venue updates, and tips for planning your perfect celebration."
date: 2026-01-19
draft: false
author: "Pike & West"
categories: ["News"]
tags: ["announcement", "welcome"]
image: ""
image_alt: ""
---

We're excited to launch the Pike & West blog! This is where we'll share:

## Event Inspiration

From stunning wedding setups to creative corporate gatherings, we'll showcase the beautiful events that have taken place at our venue. Get inspired for your own celebration!

## Planning Tips

Our experienced team has helped coordinate hundreds of events. We'll share our best tips and tricks to help make your planning process smooth and stress-free.

## Venue Updates

Be the first to know about new features, seasonal decorations, and special offerings at Pike & West.

## Behind the Scenes

Get to know our team and see what goes into creating unforgettable experiences at Germantown's premier art gallery and event venue.

---

We can't wait to share more with you. In the meantime, [schedule a tour](/contact/) to see our beautiful space in person!
```

**Step 2: Create blog images directory**

```bash
mkdir -p assets/images/blog
```

**Step 3: Verify blog post renders**

Run: `hugo server`

Navigate to:

- `http://localhost:1313/blog/` - should show the post card
- `http://localhost:1313/blog/welcome-to-pike-and-west/` - should show full post

**Step 4: Commit**

```bash
git add content/blog/welcome-to-pike-and-west.md
git commit -m "feat(blog): add welcome blog post"
```

---

## Task 7: Add Blog Structured Data

**Files:**

- Modify: `layouts/partials/structured-data.html`

**Step 1: Add BlogPosting schema**

Add to `layouts/partials/structured-data.html` before the closing of the file:

```html
{{/* BlogPosting Schema for blog posts */}}
{{ if and (eq .Section "blog") .IsPage }}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ .Title }}",
  "description": "{{ .Description }}",
  "datePublished": "{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}",
  "dateModified": "{{ .Lastmod.Format "2006-01-02T15:04:05Z07:00" }}",
  "author": {
    "@type": "Organization",
    "name": "{{ .Params.author | default "Pike & West" }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Pike & West",
    "logo": {
      "@type": "ImageObject",
      "url": "{{ "images/logo/pike-west-logo-horizontal.png" | absURL }}"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{{ .Permalink }}"
  }
  {{ with .Params.image }}
  ,"image": "{{ . | absURL }}"
  {{ end }}
}
</script>
{{ end }}
```

**Step 2: Verify structured data**

Run: `hugo server`

Navigate to: `http://localhost:1313/blog/welcome-to-pike-and-west/`

View page source and verify BlogPosting JSON-LD is present.

**Step 3: Commit**

```bash
git add layouts/partials/structured-data.html
git commit -m "feat(blog): add BlogPosting structured data for SEO"
```

---

## Task 8: Final Verification and Push

**Step 1: Build production site**

```bash
hugo --gc --minify
```

Expected: No errors.

**Step 2: Visual verification**

Run: `hugo server`

Verify:

- [ ] Blog list page renders at `/blog/`
- [ ] Blog post renders at `/blog/welcome-to-pike-and-west/`
- [ ] Header shows Blog link (3rd position)
- [ ] Footer shows Blog link
- [ ] Mobile hamburger menu includes Blog
- [ ] Page header styling matches other pages
- [ ] Blog card hover effects work
- [ ] Post navigation (prev/next) renders

**Step 3: Push all commits**

```bash
git push
```

---

## Summary of Files

**Created:**

- `content/blog/_index.md` - Blog section index
- `archetypes/blog.md` - Blog post archetype
- `layouts/blog/list.html` - Blog listing template
- `layouts/blog/single.html` - Blog post template
- `assets/scss/_blog.scss` - Blog styles
- `content/blog/welcome-to-pike-and-west.md` - Sample post

**Modified:**

- `assets/scss/main.scss` - Import blog styles
- `config/_default/menus.toml` - Add Blog to navigation
- `layouts/partials/footer.html` - Use menu for links
- `assets/scss/_footer.scss` - Add footer links flex container
- `layouts/partials/structured-data.html` - Add BlogPosting schema
