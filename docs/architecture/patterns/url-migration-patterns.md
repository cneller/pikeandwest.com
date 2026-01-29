# URL Migration Patterns

Operational reference for reorganizing URLs on Hugo + Cloudflare Pages.

---

## Quick Reference

### Cloudflare `_redirects` File

| Property                | Value                            |
|-------------------------|----------------------------------|
| Location                | `static/_redirects`              |
| Format                  | `source destination [status]`    |
| Static redirects limit  | 2,000                            |
| Dynamic redirects limit | 100 (with `*` or `:placeholder`) |
| Max characters per rule | 1,000                            |

### Hugo Aliases (Client-Side Fallback)

- Add `aliases:` array in front matter
- Creates HTML files with `<meta http-equiv="refresh">`
- Includes `rel="canonical"` for SEO
- Use as fallback, not primary redirect method

---

## Cloudflare `_redirects` Syntax

### Basic Redirects

```text
# Static redirect (exact match)
/old-page /new-page 301

# Without status code (defaults to 302)
/temp-page /other-page
```

### Splat Patterns (Wildcards)

```text
# Match anything after /old-blog/
/old-blog/* /articles/:splat 301

# Example: /old-blog/2024/my-post → /articles/2024/my-post
```

### Placeholders

```text
# Named segment matching
/users/:username /profiles/:username 301

# Example: /users/john → /profiles/john
```

### Order Matters

```text
# Specific rules BEFORE wildcards
/blog/featured-post /highlights/featured 301
/blog/* /articles/:splat 301
```

---

## Hugo Aliases

### Front Matter Syntax

```yaml
---
title: "My New Post"
aliases:
  - /posts/old-post-name
  - /blog/2023/my-old-url
  - /archive/legacy-slug
---
```

### When to Use

- **Use aliases** for backward compatibility during transitions
- **Prefer `_redirects`** for production (server-side, faster)
- **Combine both** for belt-and-suspenders approach

---

## Pre-Migration Checklist

Before changing any URLs:

- [ ] Export current URL list: `grep -o 'loc>[^<]*' public/sitemap.xml | sed 's/loc>//'`
- [ ] Create redirect mapping spreadsheet (old URL → new URL)
- [ ] Count internal links to each URL: `grep -rn '/target-path' content/ | wc -l`
- [ ] Check if page is indexed: `scripts/gsc/check-url.sh "https://pikeandwest.com/path/"`
- [ ] Note page creation date: `git log --follow --format="%ai" --diff-filter=A -- path/to/file.md | tail -1`
- [ ] Backup current state: `git stash` or commit current work

---

## Implementation Steps

### Step 1: Add Redirects

Edit `static/_redirects`:

```text
# Added YYYY-MM-DD: Restructured blog to articles
/blog/old-post/ /articles/old-post/ 301
/blog/another-post/ /articles/another-post/ 301
```

### Step 2: Update Internal Links

Find all references:

```bash
# Markdown links
grep -rn '\](/blog/old-post' content/

# HTML href in templates
grep -rn 'href="/blog/old-post' layouts/

# Shortcodes
grep -rn '/blog/old-post' layouts/shortcodes/

# JavaScript
grep -rn '/blog/old-post' assets/js/

# SCSS (rare but possible)
grep -rn '/blog/old-post' assets/scss/
```

Update each file to use the new URL directly (don't rely on redirects for internal links).

### Step 3: Move Content Files

```bash
# Rename/move the content file
git mv content/blog/old-post/ content/articles/old-post/

# Or update front matter slug
# In content/blog/old-post/index.md:
# url: /articles/old-post/
```

### Step 4: Add Hugo Alias (Optional Fallback)

In the moved content file:

```yaml
---
title: "Post Title"
aliases:
  - /blog/old-post/
---
```

### Step 5: Build and Test Locally

```bash
hugo server

# Test redirect (in another terminal)
curl -I http://localhost:1313/blog/old-post/
# Should show redirect to /articles/old-post/
```

---

## Post-Migration Verification

### Test Redirects

```bash
# Single URL
curl -I https://pikeandwest.com/old-path/
# Look for: HTTP/2 301 and location: /new-path/

# Follow redirect chain
curl -IL https://pikeandwest.com/old-path/
# Should end at 200 OK
```

### Check for Redirect Chains

```bash
# Should be exactly 2 responses (301 → 200), not more
curl -IL https://pikeandwest.com/old-path/ 2>&1 | grep -E "^HTTP|^location"
```

### Submit to Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Submit updated sitemap: Sitemaps → Add new sitemap → `sitemap.xml`
3. Use URL Inspection tool on old URLs to verify redirect detected

### Monitor for Issues

Weekly for first month:

- [ ] Check Search Console Index Coverage for errors
- [ ] Monitor 404 errors in server logs / analytics
- [ ] Verify rankings haven't dropped significantly

---

## Timeline Recommendations

| Redirect Type        | Keep Active            |
|----------------------|------------------------|
| Standard pages       | Minimum 1 year         |
| High-traffic pages   | 2-3 years or permanent |
| Pages with backlinks | Permanent              |

**Why:** Google needs time to discover redirects, update index, and transfer ranking signals. Removing redirects too early causes 404s for bookmarks and cached search results.

---

## Common Pitfalls

### Redirect Chains

**Problem:** A → B → C wastes crawl budget and loses link equity.

```text
# Bad
/page-v1 /page-v2 301
/page-v2 /page-v3 301

# Good: Point everything to final destination
/page-v1 /page-v3 301
/page-v2 /page-v3 301
```

### Redirect Loops

**Problem:** A → B → A causes infinite loop.

**Prevention:** Always verify redirects don't form cycles before deploying.

### Not Updating Internal Links

**Problem:** Internal links through redirects slow down crawling and user experience.

**Solution:** After adding redirects, grep for all internal references and update them to point directly to new URLs.

### Forgetting Embedded Content

**Problem:** Images, CSS, JS at old paths return 404.

**Solution:** Include asset URLs in redirect mapping, or use relative paths in content.

### Losing Query Parameters

**Problem:** `/search?q=term` redirects to `/search` without the query.

**Note:** Cloudflare `_redirects` preserves query strings by default for static redirects.

### Redirecting to Homepage

**Problem:** Redirecting unrelated pages to `/` destroys page-specific rankings.

**Solution:** Always redirect to the most relevant replacement page, or return 410 Gone for truly removed content.

---

## Bulk Migration Pattern

For restructuring entire sections (e.g., `/blog/*` → `/articles/*`):

### 1. Use Splat Redirect

```text
/blog/* /articles/:splat 301
```

### 2. Move Content Directory

```bash
git mv content/blog/ content/articles/
```

### 3. Update Config (if section-specific)

Check `config/_default/hugo.toml` for section-specific settings.

### 4. Update Menus

Check `config/_default/menus.toml` for navigation links.

### 5. Update Templates

Check `layouts/` for hardcoded section references.

---

## Related Resources

- [Cloudflare Pages Redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Hugo URL Management](https://gohugo.io/content-management/urls/)
- [Google: Site Moves with URL Changes](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
- [Sitemap Architect Agent](../../../.claude/agents/sitemap-architect.md) - Automated analysis tool
