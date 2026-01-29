# Image Directory Reorganization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reorganize image directories for better usability in Sveltia CMS image browser, consolidating scattered images into logical groups.

**Architecture:** Rename/move directories, update all file references (Hugo templates, content front matter, data files, Sveltia CMS config). No code logic changes—purely path updates.

**Tech Stack:** Hugo static site, Sveltia CMS, YAML/TOML config files

---

## Directory Mapping

| Old Path                | New Path                       | Contents                                        |
|-------------------------|--------------------------------|-------------------------------------------------|
| `static/images/hero/`   | `static/images/homepage-hero/` | 2 homepage hero images                          |
| `static/images/venue/`  | `static/images/photos/`        | All general photos (venue + about + og-default) |
| `static/images/about/`  | `static/images/photos/`        | Merged into photos                              |
| `static/images/logo/`   | `static/images/brand/`         | Logos + social icons                            |
| `static/images/social/` | `static/images/brand/`         | Merged into brand                               |
| `static/images/icons/`  | `static/images/icons/`         | Unchanged                                       |
| (new)                   | `static/images/categories/`    | Blog category taxonomy images                   |

---

### Task 1: Create New Directory Structure

**Files:**

- Create: `static/images/homepage-hero/` (rename from hero)
- Create: `static/images/photos/` (consolidate venue + about)
- Create: `static/images/brand/` (rename from logo, add social)
- Create: `static/images/categories/` (new, empty)

**Step 1: Rename hero → homepage-hero**

```bash
git mv static/images/hero static/images/homepage-hero
```

**Step 2: Rename logo → brand**

```bash
git mv static/images/logo static/images/brand
```

**Step 3: Rename venue → photos**

```bash
git mv static/images/venue static/images/photos
```

**Step 4: Move about images into photos**

```bash
git mv static/images/about/team-eden-lyndal.jpg static/images/photos/
git mv static/images/about/event-party-bw.jpg static/images/photos/
rmdir static/images/about
```

**Step 5: Move social icons into brand**

```bash
git mv static/images/social/icon-facebook.png static/images/brand/
git mv static/images/social/icon-instagram.png static/images/brand/
rmdir static/images/social
```

**Step 6: Move og-default.jpg into photos**

```bash
git mv static/images/og-default.jpg static/images/photos/
```

**Step 7: Create categories directory with .gitkeep**

```bash
mkdir -p static/images/categories
touch static/images/categories/.gitkeep
```

**Step 8: Verify new structure**

```bash
ls -la static/images/
# Expected: blog, brand, categories, homepage-hero, icons, photos
```

**Step 9: Commit directory changes**

```bash
git add -A static/images/
git commit -m "refactor(images): reorganize directory structure

- hero → homepage-hero (more specific naming)
- logo + social → brand (consolidate identity assets)
- venue + about + og-default → photos (single general gallery)
- Add categories/ for blog taxonomy images"
```

---

### Task 2: Update Hugo Templates

**Files:**

- Modify: `layouts/partials/header.html`
- Modify: `layouts/partials/footer.html`
- Modify: `layouts/partials/head.html`
- Modify: `layouts/partials/structured-data.html`
- Modify: `layouts/blog/list.html`
- Modify: `layouts/blog/single.html`
- Modify: `layouts/events/single.html`
- Modify: `layouts/events/list.html`
- Modify: `layouts/page/workshops.html`
- Modify: `layouts/_default/term.html`
- Modify: `layouts/_default/taxonomy.html`

**Step 1: Update header.html**

Change line 4:

```go-html-template
{{ $logo := resources.Get "images/brand/pike-west-logo-horizontal.png" }}
```

**Step 2: Update footer.html**

Change line 21:

```go-html-template
{{ $logo := resources.Get "images/brand/pike-west-logomark.png" }}
```

**Step 3: Update head.html**

Change line 194:

```go-html-template
{{- $heroImage = resources.Get "images/photos/venue-06-soft-seating.jpg" -}}
```

**Step 4: Update structured-data.html**

Change line 10:

```go-html-template
"url": "{{ "images/brand/pike-west-logo-horizontal.png" | absURL }}",
```

Change line 74-75:

```go-html-template
"{{ "images/photos/pike-west-exterior.jpg" | absURL }}",
"{{ "images/photos/pike-west-gallery.jpg" | absURL }}"
```

Change line 173:

```go-html-template
"url": "{{ "images/brand/pike-west-logo-horizontal.png" | absURL }}",
```

**Step 5: Update blog/list.html**

Change line 3:

```go-html-template
{{ $heroPath := .Params.image | default "images/photos/venue-06-soft-seating.jpg" }}
```

**Step 6: Update blog/single.html**

Change line 12:

```go-html-template
{{ $heroImage = resources.Get "images/photos/venue-06-soft-seating.jpg" }}
```

**Step 7: Update events/single.html**

Change line 18:

```go-html-template
{{ $heroImage = resources.Get "images/photos/venue-01-interior.jpeg" }}
```

**Step 8: Update events/list.html**

Change line 17:

```go-html-template
{{ $heroImage = resources.Get "images/photos/venue-01-interior.jpeg" }}
```

**Step 9: Update page/workshops.html**

Change line 11:

```go-html-template
"image": "{{ (resources.Get "images/homepage-hero/venue-exterior.jpg").Permalink }}",
```

**Step 10: Update \_default/term.html**

Change line 8:

```go-html-template
{{ $heroImage := resources.Get "images/photos/venue-06-soft-seating.jpg" }}
```

**Step 11: Update \_default/taxonomy.html**

Change line 8:

```go-html-template
{{ $heroImage := resources.Get "images/photos/venue-06-soft-seating.jpg" }}
```

**Step 12: Verify Hugo build succeeds**

```bash
hugo --gc
# Expected: No errors about missing images
```

**Step 13: Commit template updates**

```bash
git add layouts/
git commit -m "refactor(templates): update image paths for new directory structure

- logo → brand
- venue → photos
- hero → homepage-hero"
```

---

### Task 3: Update Content Front Matter

**Files:**

- Modify: `content/_index.md`
- Modify: `content/blog/_index.md`
- Modify: `content/contact.md`
- Modify: `content/about.md`
- Modify: `content/workshops.md`
- Modify: `content/gallery-application.md`
- Modify: `content/events/_index.md`
- Modify: `content/events/*.md` (6 files)
- Modify: `content/blog/*/index.md` (2 files)

**Step 1: Update content/\_index.md**

Change `image:` from `/images/hero/venue-exterior.jpg` to `/images/homepage-hero/venue-exterior.jpg`

**Step 2: Update content/blog/\_index.md**

Change `image:` from `/images/venue/IMG_9271.jpeg` to `/images/photos/IMG_9271.jpeg`

**Step 3: Update content/contact.md**

Change `og_image:` from `/images/hero/venue-exterior.jpg` to `/images/homepage-hero/venue-exterior.jpg`

**Step 4: Update content/about.md**

Change `og_image:` from `/images/about/team-eden-lyndal.jpg` to `/images/photos/team-eden-lyndal.jpg`

**Step 5: Update content/workshops.md**

Change `og_image:` from `/images/venue/venue-01-interior.jpeg` to `/images/photos/venue-01-interior.jpeg`

**Step 6: Update content/gallery-application.md**

Change `og_image:` from `images/venue/venue-01-interior.jpeg` to `images/photos/venue-01-interior.jpeg`

**Step 7: Update content/events/\_index.md**

Change `image:` from `/images/venue/venue-06-soft-seating.jpg` to `/images/photos/venue-06-soft-seating.jpg`

**Step 8: Update content/events/birthday-parties.md**

Change `image:` from `/images/venue/IMG_9271.jpeg` to `/images/photos/IMG_9271.jpeg`

**Step 9: Update content/events/weddings.md**

Change `image:` from `/images/venue/venue-04-wedding.jpg` to `/images/photos/venue-04-wedding.jpg`

**Step 10: Update content/events/corporate-events.md**

Change `image:` from `/images/venue/venue-01-interior.jpeg` to `/images/photos/venue-01-interior.jpeg`

**Step 11: Update content/events/private-parties.md**

Change `image:` from `/images/venue/venue-07-bar.jpg` to `/images/photos/venue-07-bar.jpg`

**Step 12: Update content/events/dance-events.md**

Change `image:` from `/images/venue/venue-08-disco-background.jpg` to `/images/photos/venue-08-disco-background.jpg`

**Step 13: Update content/events/baby-showers.md**

Change `image:` from `/images/venue/venue-06-soft-seating.jpg` to `/images/photos/venue-06-soft-seating.jpg`

**Step 14: Update content/blog/fall-baby-shower-inspiration/index.md**

Change `image:` from `/images/venue/venue-02-foyer.png` to `/images/photos/venue-02-foyer.png`

**Step 15: Update content/blog/winter-birthday-celebration-guide/index.md**

Change `image:` from `/images/venue/venue-08-disco-background.jpg` to `/images/photos/venue-08-disco-background.jpg`

**Step 16: Verify Hugo build**

```bash
hugo --gc
# Expected: No errors
```

**Step 17: Commit content updates**

```bash
git add content/
git commit -m "refactor(content): update image paths in front matter

- venue → photos
- hero → homepage-hero
- about → photos"
```

---

### Task 4: Update Data Files

**Files:**

- Modify: `data/hero.yaml`
- Modify: `data/about.yaml`
- Modify: `data/venue_gallery.yaml`
- Modify: `data/cta_banner.yaml`
- Modify: `data/error404.yaml`
- Modify: `data/content-index.yaml`

**Step 1: Update data/hero.yaml**

Change line 17:

```yaml
background_image: "/images/homepage-hero/venue-exterior-tall.jpg"
```

Change line 20:

```yaml
foreground_image: "/images/homepage-hero/venue-exterior.jpg"
```

**Step 2: Update data/about.yaml**

Change line 18:

```yaml
      src: /images/photos/team-eden-lyndal.jpg
```

Change line 40:

```yaml
      src: /images/photos/event-party-bw.jpg
```

**Step 3: Update data/venue_gallery.yaml**

Replace all `/images/venue/` with `/images/photos/`:

- Line 8: `/images/photos/venue-01-interior.jpeg`
- Line 12: `/images/photos/venue-02-foyer.png`
- Line 14: `/images/photos/venue-03-lower-patio.jpg`
- Line 16: `/images/photos/venue-04-wedding.jpg`
- Line 18: `/images/photos/venue-05-dancefloor.jpg`
- Line 20: `/images/photos/venue-06-soft-seating.jpg`
- Line 22: `/images/photos/venue-07-bar.jpg`
- Line 24: `/images/photos/venue-08-disco-background.jpg`
- Line 26: `/images/photos/venue-09-table-chairs.png`
- Line 28: `/images/photos/venue-10-seating-area.png`

**Step 4: Update data/cta_banner.yaml**

Change line 9:

```yaml
background_image: "/images/photos/venue-08-disco-background.jpg"
```

**Step 5: Update data/error404.yaml**

Change line 28:

```yaml
background_image: "/images/photos/venue-08-disco-background.jpg"
```

**Step 6: Update data/content-index.yaml**

Search and replace all occurrences:

- `images/venue/` → `images/photos/`
- `images/hero/` → `images/homepage-hero/`
- `images/about/` → `images/photos/`

**Step 7: Verify Hugo build**

```bash
hugo --gc
# Expected: No errors
```

**Step 8: Commit data file updates**

```bash
git add data/
git commit -m "refactor(data): update image paths in YAML data files

- venue → photos
- hero → homepage-hero
- about → photos"
```

---

### Task 5: Update Sveltia CMS Config

**Files:**

- Modify: `static/admin/config.yml`

**Step 1: Update global media_folder comment (no change needed, points to static/images)**

**Step 2: Update blog collection image fields (lines 90-91, 122-123)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 3: Update events collection image fields (lines 262-263, 307-308)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 4: Update pages collection - home hero (lines 361-362)**

```yaml
media_folder: /static/images/homepage-hero
public_folder: /images/homepage-hero
```

**Step 5: Update pages collection - about og_image (lines 408-409)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 6: Update pages collection - contact og_image (lines 435-436)**

```yaml
media_folder: /static/images/homepage-hero
public_folder: /images/homepage-hero
```

**Step 7: Update pages collection - workshops og_image (lines 462-463)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 8: Update hero singleton (lines 613-614, 619-620)**

```yaml
media_folder: /static/images/homepage-hero
public_folder: /images/homepage-hero
```

**Step 9: Update cta_banner singleton (lines 649-650)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 10: Update about_data singleton (lines 691-692)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 11: Update venue_gallery singleton (lines 797-798)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 12: Update error404 singleton (lines 854-855)**

```yaml
media_folder: /static/images/photos
public_folder: /images/photos
```

**Step 13: Verify YAML syntax**

```bash
python3 -c "import yaml; yaml.safe_load(open('static/admin/config.yml'))"
# Expected: No errors
```

**Step 14: Commit CMS config updates**

```bash
git add static/admin/config.yml
git commit -m "refactor(cms): update Sveltia media_folder paths

- venue → photos
- hero → homepage-hero
- about → photos"
```

---

### Task 6: Update Documentation

**Files:**

- Modify: `CLAUDE.md`

**Step 1: Update Image Storage section**

Find the "Image Storage and Hugo Assets Pipeline" section and update examples:

```markdown
### Image Storage and Hugo Assets Pipeline

Images live in `static/images/` (not `assets/images/`) so that Sveltia CMS can
access them directly. A Hugo module mount in `config/_default/hugo.toml` maps
them into the assets pipeline:

...

This means `resources.Get "images/photos/photo.jpg"` works even though the file
is physically at `static/images/photos/photo.jpg`.

**Front matter image paths** use a leading slash (`/images/photos/photo.jpg`)
```

**Step 2: Update any other venue/hero/about references in CLAUDE.md**

Search and update examples that reference old paths.

**Step 3: Commit documentation updates**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with new image directory structure"
```

---

### Task 7: Final Verification

**Step 1: Run full Hugo build**

```bash
hugo --gc --minify
# Expected: Build succeeds with no warnings about missing images
```

**Step 2: Start dev server and verify homepage**

```bash
hugo server -D
# Visit http://localhost:1313
# Verify: Hero images load, logo in header/footer, venue gallery works
```

**Step 3: Verify CMS media browser**

```bash
# Visit http://localhost:1313/admin/
# Open Media Library
# Verify: photos/, homepage-hero/, brand/, icons/, categories/ folders visible
```

**Step 4: Verify image picker in CMS**

```bash
# Edit a blog post
# Click image picker
# Verify: Opens to /photos/ folder
```

**Step 5: Run git status to confirm clean state**

```bash
git status
# Expected: nothing to commit, working tree clean
```

---

## Rollback Plan

If issues discovered after deployment:

```bash
git revert HEAD~6..HEAD  # Revert all 6 commits
# Or restore from backup branch created before starting
```

---

## Post-Implementation Notes

- Blog images remain in page bundles (no change)
- `/categories/` folder is empty and ready for future taxonomy images
- All CMS image pickers now point to consolidated folders
- Run BackstopJS visual regression after deployment to verify no visual breakage
