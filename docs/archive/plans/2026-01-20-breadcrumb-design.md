# Design: Blog Breadcrumb Navigation

**Date:** 2026-01-20
**Status:** Approved

## Summary

Add breadcrumb navigation to blog listing and blog detail pages for improved user orientation, accessibility, and SEO.

## Design Decisions

| Decision        | Choice                    | Rationale                                             |
|-----------------|---------------------------|-------------------------------------------------------|
| Visual style    | Minimal text links        | Matches luxury minimalist aesthetic                   |
| Position        | Below hero, above content | Keeps hero clean, visible when reading                |
| Mobile behavior | Always visible            | Simple hierarchy (max 3 levels), valuable orientation |
| Current page    | Included, not linked      | Accessibility standard, full context                  |

## Breadcrumb Paths

| Page                    | Breadcrumb                 |
|-------------------------|----------------------------|
| Blog listing (`/blog/`) | Home / Blog                |
| Blog post               | Home / Blog / [Post Title] |

## HTML Structure

```html
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol class="breadcrumb__list">
    <li class="breadcrumb__item">
      <a href="/" class="breadcrumb__link">Home</a>
    </li>
    <li class="breadcrumb__item">
      <a href="/blog/" class="breadcrumb__link">Blog</a>
    </li>
    <li class="breadcrumb__item">
      <span class="breadcrumb__current" aria-current="page">Post Title</span>
    </li>
  </ol>
</nav>
```

### Accessibility Features

- `<nav>` landmark with `aria-label="Breadcrumb"`
- Ordered list (`<ol>`) for semantic hierarchy
- `aria-current="page"` on current item
- CSS separators (not in markup) so screen readers don't announce them

## Visual Styling

**File:** `assets/scss/_breadcrumb.scss`

```scss
.breadcrumb {
  padding: $spacing-md 0;
  font-family: $font-secondary; // Montserrat
  font-size: $font-size-sm; // 14px
  color: $color-text-light; // #434345

  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: $spacing-sm;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &__item {
    display: flex;
    align-items: center;

    // Separator via CSS pseudo-element
    &:not(:last-child)::after {
      content: '/';
      margin-left: $spacing-sm;
      color: rgba($color-text-light, 0.5);
    }
  }

  &__link {
    color: $color-text-light;
    text-decoration: none;
    transition: color $transition-fast;

    &:hover {
      color: $color-gold; // PW Gold accent on hover
    }
  }

  &__current {
    color: $color-text; // Slightly darker for current page
  }
}
```

## SEO Structured Data

**File:** `layouts/partials/breadcrumb-schema.html`

JSON-LD BreadcrumbList schema added to page `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://pikeandwest.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://pikeandwest.com/blog/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Post Title Here"
    }
  ]
}
```

**Notes:**

- Last item omits `item` URL (current page convention)
- Benefits: search engines understand hierarchy, desktop search result display, improved crawlability

## Hugo Implementation

### Files to Create

| File                                      | Purpose                     |
|-------------------------------------------|-----------------------------|
| `layouts/partials/breadcrumb.html`        | Visual breadcrumb component |
| `layouts/partials/breadcrumb-schema.html` | JSON-LD structured data     |
| `assets/scss/_breadcrumb.scss`            | Styles                      |

### Template Logic

```go-html-template
{{- $items := slice (dict "name" "Home" "url" "/") -}}

{{- if .Section -}}
  {{- $sectionTitle := .Section | humanize | title -}}
  {{- $items = $items | append (dict "name" $sectionTitle "url" (printf "/%s/" .Section)) -}}
{{- end -}}

{{- if not .IsHome -}}
  {{- if not (eq .Kind "section") -}}
    {{- $items = $items | append (dict "name" .Title "url" "") -}}
  {{- end -}}
{{- end -}}
```

### Integration Points

| File                         | Change                                                             |
|------------------------------|--------------------------------------------------------------------|
| `layouts/blog/list.html`     | Add `{{ partial "breadcrumb.html" . }}` after page header          |
| `layouts/blog/single.html`   | Add `{{ partial "breadcrumb.html" . }}` after `.blog-hero` section |
| `layouts/partials/head.html` | Add `{{ partial "breadcrumb-schema.html" . }}` for blog pages      |
| `assets/scss/main.scss`      | Import `_breadcrumb.scss`                                          |

## References

- [SEO Breadcrumbs Guide - Search Engine Land](https://searchengineland.com/guide/seo-breadcrumbs)
- [Breadcrumbs for Accessibility - Accessibly](https://accessiblyapp.com/blog/breadcrumbs-accessibility/)
- [Google's Jan 2025 Breadcrumb Update](https://vocal.media/education/mobile-seo-alert-google-s-breadcrumb-update-january-2025)
- [ARIA Breadcrumb Pattern - Aditus](https://www.aditus.io/patterns/breadcrumbs/)
