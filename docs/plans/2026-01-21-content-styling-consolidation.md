# Content Styling Consolidation & Event Breadcrumbs Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unify content typography between blog posts and event pages while adding breadcrumb navigation to event single pages.

**Architecture:** Extract shared content styles into a mixin that both blog and event pages extend. Blog adds rich formatting (blockquotes, code, tables); events use base only. Add breadcrumbs to event pages using existing `accent-bar` variant for visual consistency with other content pages.

**Tech Stack:** Hugo, SCSS (Hugo Pipes), Go templates

---

## Summary of Changes

| File                             | Action | Purpose                                   |
|----------------------------------|--------|-------------------------------------------|
| `assets/scss/_content-base.scss` | Create | Shared content typography mixin           |
| `assets/scss/_blog.scss`         | Modify | Extend content base, keep rich formatting |
| `assets/scss/_events-list.scss`  | Modify | Extend content base, fix text color       |
| `assets/scss/main.scss`          | Modify | Import new content-base partial           |
| `layouts/events/single.html`     | Modify | Add breadcrumb partial                    |

---

## Task 1: Create Shared Content Base Mixin

**Files:**

- Create: `assets/scss/_content-base.scss`

**Step 1: Create the content-base partial**

Create file `assets/scss/_content-base.scss`:

```scss
// =========================
// Shared Content Base
// =========================
// Common typography and spacing for content pages (blog, events)
// Provides consistent reading experience across content types

@mixin content-base {
  max-width: 800px;
  margin: 0 auto;

  // Headings
  h2 {
    font-family: $font-display;
    font-size: $font-size-2xl;
    font-weight: $font-weight-medium;
    color: $color-text;
    margin: $spacing-2xl 0 $spacing-md;

    &:first-child {
      margin-top: 0;
    }
  }

  h3 {
    font-family: $font-display;
    font-size: $font-size-xl;
    font-weight: $font-weight-medium;
    color: $color-text;
    margin: $spacing-xl 0 $spacing-md;
  }

  // Paragraphs
  p {
    font-family: $font-secondary;
    font-size: $font-size-base;
    line-height: 1.7;
    color: $color-text;
    margin: 0 0 $spacing-md;
  }

  // Lists - consistent styling
  ul,
  ol {
    margin: 0 0 $spacing-lg;
    padding-left: $spacing-xl;
    font-family: $font-secondary;
    font-size: $font-size-base;
    line-height: 1.7;
    color: $color-text;

    li {
      margin-bottom: $spacing-sm;
    }
  }

  ul {
    list-style-type: disc;

    ul {
      list-style-type: circle;

      ul {
        list-style-type: square;
      }
    }
  }

  ol {
    list-style-type: decimal;

    ol {
      list-style-type: lower-alpha;

      ol {
        list-style-type: lower-roman;
      }
    }
  }

  // Links
  a {
    color: $color-gold;

    &:hover {
      text-decoration: underline;
    }
  }

  // Text emphasis
  strong,
  b {
    font-weight: $font-weight-semibold;
  }

  em,
  i {
    font-style: italic;
  }

  // Responsive: Mobile
  @media (max-width: $breakpoint-md) {
    h2 {
      font-size: $font-size-xl;
    }

    h3 {
      font-size: $font-size-lg;
    }
  }
}
```

**Step 2: Verify file was created correctly**

Run: `cat assets/scss/_content-base.scss | head -20`
Expected: Shows the mixin definition header and first styles

**Step 3: Commit**

```bash
git add assets/scss/_content-base.scss
git commit -m "feat(scss): add shared content-base mixin for typography"
```

---

## Task 2: Import Content Base in Main Stylesheet

**Files:**

- Modify: `assets/scss/main.scss:14` (after typography import)

**Step 1: Add import statement**

In `assets/scss/main.scss`, add import after line 14 (`@import 'typography';`):

```scss
@import 'content-base';
```

The imports section should now read:

```scss
// Components
@import 'typography';
@import 'content-base';
@import 'buttons';
```

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Commit**

```bash
git add assets/scss/main.scss
git commit -m "feat(scss): import content-base mixin"
```

---

## Task 3: Update Blog Styles to Use Content Base

**Files:**

- Modify: `assets/scss/_blog.scss:160-330` (`.blog-post__content` section)

**Step 1: Refactor blog-post\_\_content to extend mixin**

Replace the `.blog-post__content` block (lines ~178-330) with:

```scss
  &__content {
    @include content-base;
    font-family: $font-secondary;
    font-size: $font-size-md;
    line-height: 1.8;
    color: $color-text;

    // Override base spacing for blog's slightly larger text
    p {
      font-size: $font-size-md;
      line-height: 1.8;
      margin: 0 0 $spacing-lg;
    }

    // Blog-specific rich formatting
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

    mark {
      background-color: rgba($color-gold, 0.2);
      padding: 0.1em 0.2em;
    }

    // Inline code
    code {
      font-family:
        'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.875em;
      background-color: rgba(0, 0, 0, 0.05);
      padding: 0.2em 0.4em;
      border-radius: 3px;
    }

    // Code blocks
    pre {
      margin: $spacing-lg 0;
      padding: $spacing-md;
      background-color: #1a1b1f;
      color: #f8f8f2;
      border-radius: $border-radius-md;
      overflow-x: auto;

      code {
        background: none;
        padding: 0;
        font-size: $font-size-sm;
        color: inherit;
      }
    }

    // Horizontal rule
    hr {
      margin: $spacing-2xl 0;
      border: none;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    // Tables
    table {
      width: 100%;
      margin: $spacing-lg 0;
      border-collapse: collapse;

      th,
      td {
        padding: $spacing-sm $spacing-md;
        border: 1px solid rgba(0, 0, 0, 0.1);
        text-align: left;
      }

      th {
        background-color: $color-cream;
        font-weight: $font-weight-semibold;
      }
    }
  }
```

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Visual verification - check blog post renders correctly**

Run: `hugo server -D &`
Then open: <http://localhost:1313/blog/>
Verify: Blog post content maintains same styling as before

**Step 4: Stop dev server and commit**

```bash
pkill -f "hugo server" || true
git add assets/scss/_blog.scss
git commit -m "refactor(blog): use content-base mixin for typography"
```

---

## Task 4: Update Event Page Styles to Use Content Base

**Files:**

- Modify: `assets/scss/_events-list.scss:117-182` (`.event-page` section)

**Step 1: Refactor event-page\_\_content to extend mixin**

Replace the `.event-page__content` block (lines ~120-163) with:

```scss
  &__content {
    @include content-base;

    // Event pages use slightly smaller base font
    p {
      font-size: $font-size-base;
      line-height: 1.7;
    }

    // Event-specific: h3 uses primary font (not display)
    h3 {
      font-family: $font-primary;
      font-size: $font-size-lg;
      font-weight: $font-weight-semibold;
    }
  }
```

This replaces ~43 lines with ~15 lines while:

- Gaining consistent `$color-text` instead of `$color-text-light`
- Gaining nested list styling (disc → circle → square)
- Gaining link styling with gold color
- Keeping event-specific h3 styling

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Visual verification - check event page renders correctly**

Run: `hugo server -D &`
Then open: <http://localhost:1313/events/weddings/>
Verify:

- Text color is now darker (not light gray)
- Lists have proper bullet styling
- Overall typography feels consistent with blog

**Step 4: Stop dev server and commit**

```bash
pkill -f "hugo server" || true
git add assets/scss/_events-list.scss
git commit -m "refactor(events): use content-base mixin, fix text color"
```

---

## Task 5: Add Breadcrumbs to Event Single Page Template

**Files:**

- Modify: `layouts/events/single.html`

**Step 1: Add breadcrumb partial after page header**

Replace the entire file content with:

```go-html-template
{{ define "main" }}
{{/*
  Single Event Page Template

  Purpose: Displays individual event type pages (weddings, birthdays, etc.)
  with consistent styling and a clear CTA.

  Context: . = Page (event content page)
*/}}

{{/* Page Header */}}
<section class="page-header">
  <div class="container">
    <h1 class="page-header__title">{{ .Title }}</h1>
  </div>
</section>

{{/* Breadcrumb Navigation */}}
{{ partial "breadcrumb.html" (dict "Page" . "accentBar" true) }}

{{/* Event Content */}}
<article class="event-page section">
  <div class="container">
    <div class="event-page__content content">
      {{ .Content }}
    </div>

    {{/* CTA Section */}}
    <div class="event-page__cta">
      <a href="/contact/" class="btn btn-primary">Schedule a Tour</a>
    </div>
  </div>
</article>
{{ end }}
```

**Step 2: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 3: Visual verification - check breadcrumb renders**

Run: `hugo server -D &`
Then open: <http://localhost:1313/events/weddings/>
Verify:

- Breadcrumb appears below page header
- Shows: Home › Events › Weddings
- Has cream background band with gold accent line
- Links work correctly (Home → /, Events → /events/)

**Step 4: Stop dev server and commit**

```bash
pkill -f "hugo server" || true
git add layouts/events/single.html
git commit -m "feat(events): add breadcrumb navigation to single pages"
```

---

## Task 6: Add Breadcrumbs to Event List Page Template

**Files:**

- Modify: `layouts/events/list.html`

**Step 1: Read current list template**

First, check the current structure of the events list template.

**Step 2: Add breadcrumb partial after page header**

Add the breadcrumb partial after the page-header section, before the events-list section:

```go-html-template
{{/* Breadcrumb Navigation */}}
{{ partial "breadcrumb.html" (dict "Page" . "accentBar" true) }}
```

**Step 3: Verify Hugo builds without errors**

Run: `hugo --gc 2>&1 | grep -i error || echo "Build successful"`
Expected: "Build successful"

**Step 4: Visual verification - check breadcrumb renders on list page**

Run: `hugo server -D &`
Then open: <http://localhost:1313/events/>
Verify:

- Breadcrumb appears below page header
- Shows: Home › Events (Events is current, not linked)
- Styling matches single event pages

**Step 5: Stop dev server and commit**

```bash
pkill -f "hugo server" || true
git add layouts/events/list.html
git commit -m "feat(events): add breadcrumb navigation to list page"
```

---

## Task 7: Final Visual Verification and Linting

**Files:**

- None (verification only)

**Step 1: Run Hugo build with full optimization**

Run: `hugo --gc --minify 2>&1 | tail -10`
Expected: Build completes successfully with page counts

**Step 2: Run SCSS linting if available**

Run: `npm run lint:scss 2>/dev/null || echo "No SCSS linter configured"`
Expected: No errors or "No SCSS linter configured"

**Step 3: Visual spot-check all affected pages**

Start server: `hugo server -D &`

Check these pages:

1. <http://localhost:1313/events/> - Events list with breadcrumb
2. <http://localhost:1313/events/weddings/> - Single event with breadcrumb
3. <http://localhost:1313/events/corporate-events/> - Another single event
4. <http://localhost:1313/blog/> - Blog list (unchanged)
5. <http://localhost:1313/blog/art-of-event-planning-memorable-occasions/> - Blog post (verify still works)

Verify for each:

- Breadcrumbs render correctly
- Text color is consistent (not light gray on events)
- List bullets show correctly
- Links are gold colored

**Step 4: Stop server**

```bash
pkill -f "hugo server" || true
```

**Step 5: Final commit with summary**

```bash
git add -A
git status
# If any uncommitted changes, commit them:
git commit -m "chore: final cleanup for content styling consolidation" --allow-empty
```

---

## Task 8: Update Documentation

**Files:**

- Modify: `docs/next-steps.md`

**Step 1: Add completed work to changelog**

Add entry to the Changelog section in `docs/next-steps.md`:

```markdown
### 2026-01-21
- Created shared `_content-base.scss` mixin for consistent typography
- Refactored blog and event pages to use shared content base
- Fixed event page text color (was `$color-text-light`, now `$color-text`)
- Added breadcrumb navigation to event single and list pages
- Event pages now have consistent list styling with blog posts
```

**Step 2: Commit documentation update**

```bash
git add docs/next-steps.md
git commit -m "docs: update next-steps with content styling consolidation"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] `_content-base.scss` exists and defines the mixin
- [ ] `main.scss` imports content-base after typography
- [ ] Blog posts render with same styling as before
- [ ] Event pages have darker text color (not light gray)
- [ ] Event pages have proper nested list bullets
- [ ] Event single pages show breadcrumb: Home › Events › [Page Title]
- [ ] Event list page shows breadcrumb: Home › Events
- [ ] Breadcrumbs have cream background with gold accent line
- [ ] All breadcrumb links work correctly
- [ ] Hugo builds without errors
- [ ] No visual regressions on blog pages

---

## Rollback Instructions

If issues arise, revert to previous state:

```bash
git log --oneline -10  # Find commit before changes
git revert HEAD~N..HEAD  # Revert N commits
# Or hard reset (destructive):
git reset --hard <commit-hash>
```
