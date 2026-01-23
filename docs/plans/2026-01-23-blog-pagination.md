# Blog Pagination Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add pagination to the blog listing page (6 posts per page) and reorder the "Welcome to Pike & West" post to be the earliest/oldest post.

**Architecture:** Configure Hugo's built-in pagination (paginate: 6), update the blog list template to use `.Paginate`, add a pagination partial for navigation between pages, and adjust the welcome post date to be earliest.

**Tech Stack:** Hugo, Go templates, Hugo built-in pagination

---

## References

- [Hugo Pagination Docs](https://gohugo.io/templates/pagination/)
- [Hugo Paginate Method](https://gohugo.io/methods/page/paginate/)

## Current State

**Blog post dates (chronological):**

- 2025-11-08: holiday-anniversary-celebrations.md
- 2025-12-19: milestone-birthday-new-year.md
- 2026-01-19: welcome-to-pike-and-west.md ← needs to be EARLIEST
- 2026-01-20: corporate-event-planning-tips-2026.md
- 2026-01-20T10:00: fall-baby-shower-inspiration.md
- 2026-01-22: valentines-day-love-in-all-forms.md

**Current blog list template:** `layouts/blog/list.html` uses `{{ range .Pages.ByDate.Reverse }}` (no pagination)

---

## Tasks

### Task 1: Configure Pagination in Hugo Config

**Files:**

- Modify: `config/_default/hugo.toml`

**Step 1: Add paginate setting**

Add the following line after the `title` line (around line 4):

```toml
paginate = 6
```

**Step 2: Verify config is valid**

Run: Check Hugo server output for config errors
Expected: No errors, site rebuilds successfully

**Step 3: Commit**

```bash
git add config/_default/hugo.toml
git commit -m "config: set blog pagination to 6 posts per page"
```

---

### Task 2: Update Blog List Template for Pagination

**Files:**

- Modify: `layouts/blog/list.html`

**Step 1: Replace .Pages with .Paginate**

Change line 23 from:

```go-html-template
      {{ range .Pages.ByDate.Reverse }}
```

To:

```go-html-template
      {{ range (.Paginate (.Pages.ByDate.Reverse)).Pages }}
```

**Step 2: Add pagination partial after the grid**

After the closing `</div>` of `blog-list__grid` (around line 57), add:

```go-html-template
    {{/* Pagination */}}
    {{ template "_internal/pagination.html" . }}
```

The full section should look like:

```go-html-template
    {{ if .Pages }}
    <div class="blog-list__grid">
      {{ range (.Paginate (.Pages.ByDate.Reverse)).Pages }}
      ...existing card code...
      {{ end }}
    </div>
    {{/* Pagination */}}
    {{ template "_internal/pagination.html" . }}
    {{ else }}
```

**Step 3: Verify template compiles**

Run: Check Hugo server output
Expected: No template errors, blog list page loads

**Step 4: Commit**

```bash
git add layouts/blog/list.html
git commit -m "feat: add pagination to blog list template"
```

---

### Task 3: Style the Pagination Component

**Files:**

- Create: `assets/scss/_pagination.scss`
- Modify: `assets/scss/main.scss`

**Step 1: Create pagination styles**

Create `assets/scss/_pagination.scss`:

```scss
// =========================
// Pagination
// =========================
// Styles for Hugo's built-in pagination template

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  padding: 1rem 0;
  list-style: none;

  li {
    display: inline-block;
  }

  a,
  .page-item.active .page-link,
  .page-item.disabled .page-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem 0.75rem;
    font-family: $font-primary;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    border: 1px solid $color-gold;
    transition: all 0.2s ease;
  }

  a {
    color: $color-gold;
    background-color: transparent;

    &:hover {
      background-color: $color-gold;
      color: $color-white;
    }
  }

  .page-item {
    &.active .page-link {
      background-color: $color-gold;
      color: $color-white;
      cursor: default;
    }

    &.disabled .page-link {
      color: rgba($color-medium-gray, 0.5);
      border-color: rgba($color-medium-gray, 0.3);
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
```

**Step 2: Import pagination styles in main.scss**

Add after the `@import 'breadcrumb';` line (around line 30):

```scss
@import 'pagination';
```

**Step 3: Verify styles compile**

Run: Check Hugo server output
Expected: No SCSS errors

**Step 4: Commit**

```bash
git add assets/scss/_pagination.scss assets/scss/main.scss
git commit -m "style: add pagination component styles"
```

---

### Task 4: Move Welcome Post to Earliest Date

**Files:**

- Modify: `content/blog/welcome-to-pike-and-west.md`

**Step 1: Change the date to be earliest**

Change line 4 from:

```yaml
date: 2026-01-19
```

To:

```yaml
date: 2025-01-01
```

This makes it the oldest post (before holiday-anniversary-celebrations.md which is 2025-11-08).

**Step 2: Verify post order**

Run: `hugo list all | grep blog | sort`
Expected: welcome-to-pike-and-west.md shows with 2025-01-01 date

**Step 3: Commit**

```bash
git add content/blog/welcome-to-pike-and-west.md
git commit -m "content: move welcome post to be earliest blog post"
```

---

### Task 5: Visual Verification

**Step 1: Test blog list page**

1. Open <http://localhost:1313/blog/>
2. Verify: Shows 6 posts (if 6+ exist)
3. Verify: Pagination links appear at bottom
4. Verify: "Welcome to Pike & West" is NOT on first page (it's the oldest, shown last on final page)

**Step 2: Test pagination navigation**

1. Click page 2 link (or "Next")
2. Verify: URL changes to /blog/page/2/
3. Verify: Shows remaining posts
4. Verify: "Welcome to Pike & West" appears on final page

**Step 3: Test pagination styling**

1. Verify: Pagination links are styled with gold border
2. Verify: Active page has gold background
3. Verify: Hover state works on inactive links

---

## Rollback

If issues occur:

1. Remove `paginate = 6` from `config/_default/hugo.toml`
2. Revert blog list template: `git checkout HEAD~2 -- layouts/blog/list.html`
3. Restore welcome post date: change back to `date: 2026-01-19`

## Notes

- Hugo's built-in pagination uses Bootstrap-compatible class names (`.pagination`, `.page-item`, `.page-link`)
- With 6 posts total, you'll see all on page 1 until a 7th post is added
- The welcome post will appear last when sorting by date descending (newest first)
- Pagination URLs follow pattern: `/blog/`, `/blog/page/2/`, `/blog/page/3/`, etc.
