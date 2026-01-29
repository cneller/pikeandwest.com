# CMS Image Path Audit

Complete inventory of every image path across all content and data files, cross-referenced against the CMS config and best practices.

Last updated: 2026-01-28

---

## Key Architecture Context

Before auditing, understand how this site consumes image paths:

1. **Images live in `static/images/`** (where Sveltia CMS manages them via `media_folder`)
2. **Hugo module mount** in `config/_default/hugo.toml` bridges `static/images` into `assets/images`
3. **All templates use `resources.Get()`** to load images, then `.RelPermalink` for output
4. **Templates never use raw front matter paths as `src` attributes** -- they always pass through Hugo's asset pipeline
5. `resources.Get()` normalizes paths, so both `images/venue/photo.jpg` and `/images/venue/photo.jpg` resolve correctly

This means `public_folder` doesn't control what browsers see -- it controls the input string passed to `resources.Get()`. Both leading-`/` and no-leading-`/` conventions work functionally.

---

## Complete Image Path Inventory

### Data Files (7 files, 25 paths)

#### `data/hero.yaml` -- 2 paths

| Line | Field              | Stored Path                           | Leading `/` |
|------|--------------------|---------------------------------------|-------------|
| 17   | `background_image` | `images/hero/venue-exterior-tall.jpg` | No          |
| 20   | `foreground_image` | `images/hero/venue-exterior.jpg`      | No          |

#### `data/cta_banner.yaml` -- 1 path

| Line | Field              | Stored Path                                  | Leading `/` |
|------|--------------------|----------------------------------------------|-------------|
| 9    | `background_image` | `images/venue/venue-08-disco-background.jpg` | No          |

#### `data/venue_gallery.yaml` -- 10 paths

| Line | Field           | Stored Path                                  | Leading `/` |
|------|-----------------|----------------------------------------------|-------------|
| 8    | `images[0].src` | `images/venue/venue-01-interior.jpeg`        | No          |
| 12   | `images[1].src` | `images/venue/venue-02-foyer.png`            | No          |
| 14   | `images[2].src` | `images/venue/venue-03-lower-patio.jpg`      | No          |
| 16   | `images[3].src` | `images/venue/venue-04-wedding.jpg`          | No          |
| 18   | `images[4].src` | `images/venue/venue-05-dancefloor.jpg`       | No          |
| 20   | `images[5].src` | `images/venue/venue-06-soft-seating.jpg`     | No          |
| 22   | `images[6].src` | `images/venue/venue-07-bar.jpg`              | No          |
| 24   | `images[7].src` | `images/venue/venue-08-disco-background.jpg` | No          |
| 26   | `images[8].src` | `images/venue/venue-09-table-chairs.png`     | No          |
| 28   | `images[9].src` | `images/venue/venue-10-seating-area.png`     | No          |

#### `data/about.yaml` -- 2 paths

| Line | Field                 | Stored Path                         | Leading `/` |
|------|-----------------------|-------------------------------------|-------------|
| 25   | `blocks[0].image.src` | `images/about/team-eden-lyndal.jpg` | No          |
| 48   | `blocks[1].image.src` | `images/about/event-party-bw.jpg`   | No          |

#### `data/events.yaml` -- 6 paths

| Line | Field           | Stored Path                           | Leading `/` |
|------|-----------------|---------------------------------------|-------------|
| 9    | `types[0].icon` | `images/icons/icon-wedding-rings.png` | No          |
| 12   | `types[1].icon` | `images/icons/icon-champagne.png`     | No          |
| 15   | `types[2].icon` | `images/icons/icon-badge.png`         | No          |
| 18   | `types[3].icon` | `images/icons/icon-cake.png`          | No          |
| 21   | `types[4].icon` | `images/icons/icon-disco-ball.png`    | No          |
| 24   | `types[5].icon` | `images/icons/icon-rattle.png`        | No          |

#### `data/workshops.yaml` -- 3 paths

| Line | Field              | Stored Path                        | Leading `/` |
|------|--------------------|------------------------------------|-------------|
| 19   | `features[0].icon` | `images/icons/icon-palette.svg`    | No          |
| 24   | `features[1].icon` | `images/icons/icon-instructor.svg` | No          |
| 29   | `features[2].icon` | `images/icons/icon-supplies.svg`   | No          |

#### `data/error404.yaml` -- 1 path

| Line | Field              | Stored Path                                  | Leading `/` |
|------|--------------------|----------------------------------------------|-------------|
| 28   | `background_image` | `images/venue/venue-08-disco-background.jpg` | No          |

**Data file summary: 25 paths, 0 with leading `/`. 100% consistent.**

---

### Content Files -- Events (6 files, 12 paths)

#### `content/events/weddings.md`

| Line | Field   | Stored Path                           | Leading `/` |
|------|---------|---------------------------------------|-------------|
| 6    | `icon`  | `images/icons/icon-wedding-rings.png` | No          |
| 7    | `image` | `/images/venue/venue-04-wedding.jpg`  | **Yes**     |

#### `content/events/corporate-events.md`

| Line | Field   | Stored Path                            | Leading `/` |
|------|---------|----------------------------------------|-------------|
| 6    | `icon`  | `images/icons/icon-badge.png`          | No          |
| 7    | `image` | `/images/venue/venue-01-interior.jpeg` | **Yes**     |

#### `content/events/birthday-parties.md`

| Line | Field   | Stored Path                             | Leading `/` |
|------|---------|-----------------------------------------|-------------|
| 6    | `icon`  | `images/icons/icon-cake.png`            | No          |
| 7    | `image` | `/images/venue/venue-05-dancefloor.jpg` | **Yes**     |

#### `content/events/baby-showers.md`

| Line | Field   | Stored Path                               | Leading `/` |
|------|---------|-------------------------------------------|-------------|
| 6    | `icon`  | `images/icons/icon-rattle.png`            | No          |
| 7    | `image` | `/images/venue/venue-06-soft-seating.jpg` | **Yes**     |

#### `content/events/private-parties.md`

| Line | Field   | Stored Path                       | Leading `/` |
|------|---------|-----------------------------------|-------------|
| 6    | `icon`  | `images/icons/icon-champagne.png` | No          |
| 7    | `image` | `/images/venue/venue-07-bar.jpg`  | **Yes**     |

#### `content/events/dance-events.md`

| Line | Field   | Stored Path                                   | Leading `/` |
|------|---------|-----------------------------------------------|-------------|
| 6    | `icon`  | `images/icons/icon-disco-ball.png`            | No          |
| 7    | `image` | `/images/venue/venue-08-disco-background.jpg` | **Yes**     |

**Events summary: 12 paths total. 6 `icon` paths without `/`, 6 `image` paths with `/`. Split matches the CMS config: `icon` has `public_folder: images/icons` (no `/`), `image` has `public_folder: /images/venue` (with `/`).**

---

### Content Files -- Static Pages (4 files, 4 paths)

#### `content/_index.md`

| Line | Field   | Stored Path                      | Leading `/` |
|------|---------|----------------------------------|-------------|
| 12   | `image` | `images/hero/venue-exterior.jpg` | No          |

#### `content/about.md`

| Line | Field      | Stored Path                         | Leading `/` |
|------|------------|-------------------------------------|-------------|
| 13   | `og_image` | `images/about/team-eden-lyndal.jpg` | No          |

#### `content/contact.md`

| Line | Field      | Stored Path                      | Leading `/` |
|------|------------|----------------------------------|-------------|
| 15   | `og_image` | `images/hero/venue-exterior.jpg` | No          |

#### `content/gallery-application.md`

| Line | Field      | Stored Path                           | Leading `/` |
|------|------------|---------------------------------------|-------------|
| 13   | `og_image` | `images/venue/venue-01-interior.jpeg` | No          |

#### `content/workshops.md`

| Line | Field      | Stored Path                           | Leading `/` |
|------|------------|---------------------------------------|-------------|
| 15   | `og_image` | `images/venue/venue-01-interior.jpeg` | No          |

**Static pages summary: 5 paths, 0 with leading `/`. 100% consistent.**

---

### Content Files -- Blog (7 files, 7 paths)

#### `content/blog/_index.md`

| Line | Field   | Stored Path                              | Leading `/` | Type         |
|------|---------|------------------------------------------|-------------|--------------|
| 14   | `image` | `images/venue/venue-06-soft-seating.jpg` | No          | Shared venue |

#### `content/blog/welcome-to-pike-and-west/index.md`

| Line | Field   | Stored Path     | Leading `/` | Type        |
|------|---------|-----------------|-------------|-------------|
| 5    | `image` | `IMG_9248.jpeg` | No          | Page bundle |

#### `content/blog/valentines-day-love-in-all-forms/index.md`

| Line | Field   | Stored Path               | Leading `/` | Type        |
|------|---------|---------------------------|-------------|-------------|
| 21   | `image` | `valentines-day-hero.jpg` | No          | Page bundle |

#### `content/blog/milestone-birthday-new-year/index.md`

| Line | Field   | Stored Path                   | Leading `/` | Type        |
|------|---------|-------------------------------|-------------|-------------|
| 19   | `image` | `milestone-birthday-hero.png` | No          | Page bundle |

#### `content/blog/holiday-anniversary-celebrations/index.md`

| Line | Field   | Stored Path                            | Leading `/` | Type         |
|------|---------|----------------------------------------|-------------|--------------|
| 9    | `image` | `images/venue/venue-05-dancefloor.jpg` | No          | Shared venue |

#### `content/blog/corporate-event-planning-tips-2026/index.md`

| Line | Field   | Stored Path                            | Leading `/` | Type         |
|------|---------|----------------------------------------|-------------|--------------|
| 9    | `image` | `images/venue/venue-05-dancefloor.jpg` | No          | Shared venue |

#### `content/blog/fall-baby-shower-inspiration/index.md`

| Line | Field   | Stored Path                        | Leading `/` | Type         |
|------|---------|------------------------------------|-------------|--------------|
| 19   | `image` | `/images/venue/venue-02-foyer.png` | **Yes**     | Shared venue |

**Blog summary: 7 paths. 3 page bundle (correct, no `/`). 3 shared venue without `/`. 1 shared venue with `/` (outlier).**

---

## Cross-Reference Summary

### Total Inventory

| Category       | Files  | Paths  | With `/` | Without `/` | Convention Match      |
|----------------|--------|--------|----------|-------------|-----------------------|
| Data files     | 7      | 25     | 0        | 25          | 100%                  |
| Events content | 6      | 12     | 6        | 6           | 100% (split by field) |
| Static pages   | 5      | 5      | 0        | 5           | 100%                  |
| Blog content   | 7      | 7      | 1        | 6           | **86% (1 outlier)**   |
| **Total**      | **25** | **49** | **7**    | **42**      | --                    |

### Leading `/` Breakdown

| Paths WITH leading `/` (7 total)             | Source                                                 |
|----------------------------------------------|--------------------------------------------------------|
| 6 event `image` fields                       | CMS config: `public_folder: /images/venue`             |
| 1 blog post (`fall-baby-shower-inspiration`) | Outlier -- likely edited with older config or manually |

| Paths WITHOUT leading `/` (42 total) | Source                                                       |
|--------------------------------------|--------------------------------------------------------------|
| 25 data file paths                   | CMS singletons: all use `public_folder: images/...` (no `/`) |
| 6 event `icon` fields                | CMS config: `public_folder: images/icons` (no `/`)           |
| 5 static page paths                  | Manually set or CMS with no-`/` convention                   |
| 3 blog page bundle paths             | Entry-relative (no prefix)                                   |
| 3 blog shared venue paths            | CMS config: `public_folder: images/venue` (no `/`)           |

### CMS Config vs. Actual Content Consistency

| CMS Field              | `public_folder` | Expected Convention | Actual Content                                   | Match       |
|------------------------|-----------------|---------------------|--------------------------------------------------|-------------|
| Blog: Featured Image   | `images/venue`  | No `/`              | 3 of 4 shared paths: no `/`. 1 outlier with `/`. | **Partial** |
| Events: Icon           | `images/icons`  | No `/`              | 6 of 6: no `/`                                   | Yes         |
| Events: Hero Image     | `/images/venue` | With `/`            | 6 of 6: with `/`                                 | Yes         |
| Hero: Background       | `images/hero`   | No `/`              | 1 of 1: no `/`                                   | Yes         |
| Hero: Foreground       | `images/hero`   | No `/`              | 1 of 1: no `/`                                   | Yes         |
| CTA Banner: Background | `images/venue`  | No `/`              | 1 of 1: no `/`                                   | Yes         |
| About: Image           | `images/about`  | No `/`              | 2 of 2: no `/`                                   | Yes         |
| Events Grid: Icon      | `images/icons`  | No `/`              | 6 of 6: no `/`                                   | Yes         |
| Workshops: Icon        | `images/icons`  | No `/`              | 3 of 3: no `/`                                   | Yes         |
| Venue Gallery: Image   | `images/venue`  | No `/`              | 10 of 10: no `/`                                 | Yes         |
| 404: Background        | `images/venue`  | No `/`              | 1 of 1: no `/`                                   | Yes         |

**Result: 14 of 15 CMS fields produce content that matches their config. The 1 outlier (`fall-baby-shower-inspiration`) was likely created before the blog `public_folder` was changed, or was edited manually.**

---

## Cross-Reference: Matrix Document Consistency

Verified against [cms-media-folder-matrix.md](./cms-media-folder-matrix.md):

| Matrix Claim                                                 | Verified                                    |
|--------------------------------------------------------------|---------------------------------------------|
| Global: `static/images` / `/images`                          | Yes -- matches `config.yml`                 |
| Blog collection: `''` / `''`                                 | Yes -- matches `config.yml`                 |
| Blog Featured Image: `/static/images/venue` / `images/venue` | Yes -- matches `config.yml`                 |
| Events collection: not set (inherits global)                 | Yes -- matches `config.yml` after removal   |
| Events Icon: `/static/images/icons` / `images/icons`         | Yes -- matches `config.yml`                 |
| Events Hero Image: `/static/images/venue` / `/images/venue`  | Yes -- matches `config.yml`                 |
| All 8 singleton fields                                       | Yes -- all match `config.yml`               |
| `public_folder` consistency audit table                      | Yes -- matches actual content file analysis |

---

## Cross-Reference: Best Practices Document Consistency

Verified against [cms-media-folder-best-practices.md](./cms-media-folder-best-practices.md):

| Best Practice                                   | This Site's Status                                                                                           | Notes                                                    |
|-------------------------------------------------|--------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| BP1: Set both settings explicitly               | **Partial** -- Events collection has no explicit settings (inherits global)                                  | Intentional: removed to fix asset picker tab suppression |
| BP2: Absolute field-level paths for shared dirs | **Yes** -- all field `media_folder` values use `/static/images/...`                                          | Correct                                                  |
| BP3: Field != collection `media_folder`         | **Yes** -- Blog: `''` vs `/static/images/venue`. Events: inherited `static/images` vs `/static/images/venue` | Fixed earlier today                                      |
| BP4: Entry-relative for page bundles            | **Yes** -- Blog: `media_folder: ''`, `public_folder: ''`                                                     | Correct                                                  |
| BP5: Consistent `public_folder` convention      | **No** -- 13 fields use no-`/`, 2 fields use `/`                                                             | Events Hero Image is the outlier                         |
| BP6: Organize by content purpose                | **Yes** -- `about/`, `hero/`, `icons/`, `venue/` etc.                                                        | Correct                                                  |
| BP7: Document media architecture                | **Yes** -- matrix document exists                                                                            | Correct                                                  |

**Important nuance not in the best practices doc:** This site uses `resources.Get()` via a Hugo module mount, not direct `<img src>` from front matter. This means BP5's recommendation to use leading `/` for shared images is based on the standard Hugo pattern (`<img src="{{ .Params.image }}">`), but this site's template architecture makes both conventions work equally well. The consistency issue is cosmetic, not functional.

---

## Validation Plan

Systematic walkthrough of every section in [cms-media-folder-best-practices.md](./cms-media-folder-best-practices.md), validating this site's compliance.

### Phase 1: Configuration Audit

| Step | Best Practices Section               | Validation Task                                                                                     | Files to Check                                          |
|------|--------------------------------------|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| 1.1  | "How the Two Settings Work Together" | Verify global `media_folder` strips to `public_folder` correctly                                    | `static/admin/config.yml` (lines 37-38)                 |
| 1.2  | "Configuration Hierarchy"            | Map every field to its effective `media_folder`/`public_folder` after cascade resolution            | `static/admin/config.yml` (full), cross-ref with matrix |
| 1.3  | "Path Resolution Rules"              | Verify every `media_folder` path resolves to an existing directory                                  | `static/images/` subdirectories                         |
| 1.4  | "Path Resolution Rules"              | Verify every `public_folder` produces paths that `resources.Get()` can resolve via the module mount | `config/_default/hugo.toml` (mount config), templates   |

### Phase 2: Asset Picker Audit

| Step | Best Practices Section | Validation Task                                              | Files to Check              |
|------|------------------------|--------------------------------------------------------------|-----------------------------|
| 2.1  | "Asset Picker Tabs"    | Verify Blog: field != collection `media_folder`              | `config.yml` blog section   |
| 2.2  | "Asset Picker Tabs"    | Verify Events: field != collection `media_folder`            | `config.yml` events section |
| 2.3  | "Asset Picker Tabs"    | Test in CMS: Blog entry image picker shows 3 tabs            | Browser: `/admin/`          |
| 2.4  | "Asset Picker Tabs"    | Test in CMS: Events `_index` image picker shows venue photos | Browser: `/admin/`          |
| 2.5  | "Asset Picker Tabs"    | Test in CMS: Events entry icon picker shows icons            | Browser: `/admin/`          |

### Phase 3: Content Path Audit

| Step | Best Practices Section               | Validation Task                                               | Files to Check                                                       |
|------|--------------------------------------|---------------------------------------------------------------|----------------------------------------------------------------------|
| 3.1  | "Hugo Front Matter Path Consumption" | Verify all 25 data file paths resolve via `resources.Get()`   | All 7 data files, templates                                          |
| 3.2  | "Hugo Front Matter Path Consumption" | Verify all 6 event icon paths resolve                         | `content/events/*.md`, `layouts/events/list.html`                    |
| 3.3  | "Hugo Front Matter Path Consumption" | Verify all 6 event image paths resolve (with `/`)             | `content/events/*.md`, `layouts/events/single.html`                  |
| 3.4  | "Hugo Front Matter Path Consumption" | Verify blog page bundle paths resolve                         | `content/blog/*/index.md`, `layouts/blog/single.html`                |
| 3.5  | "Hugo Front Matter Path Consumption" | Verify blog shared venue paths resolve (mixed `/` convention) | `content/blog/*/index.md`                                            |
| 3.6  | "Hugo Front Matter Path Consumption" | Verify `og_image` paths resolve                               | `content/about.md`, `contact.md`, etc., `layouts/partials/head.html` |

### Phase 4: Best Practice Compliance

| Step | Best Practice                  | Action Required                                                                                                                                       | Priority       |
|------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| 4.1  | BP1: Explicit settings         | No action -- Events inherits global intentionally                                                                                                     | N/A            |
| 4.2  | BP2: Absolute field paths      | No action -- already compliant                                                                                                                        | N/A            |
| 4.3  | BP3: Field != collection       | No action -- fixed earlier today                                                                                                                      | N/A            |
| 4.4  | BP4: Entry-relative bundles    | No action -- already compliant                                                                                                                        | N/A            |
| 4.5  | BP5: Consistent `/` convention | **Decision needed:** Standardize Events Hero `public_folder` to `images/venue` (no `/`) to match 13 other fields, OR standardize all to `/images/...` | Low (cosmetic) |
| 4.6  | BP5: Fix outlier blog post     | Fix `fall-baby-shower-inspiration` path from `/images/venue/...` to `images/venue/...`                                                                | Low (cosmetic) |
| 4.7  | BP6: Directory organization    | No action -- already compliant                                                                                                                        | N/A            |
| 4.8  | BP7: Documentation             | No action -- matrix and best practices docs exist                                                                                                     | N/A            |

### Phase 5: Pitfall Check

| Step | Pitfall                                    | Status                                                               | Evidence                    |
|------|--------------------------------------------|----------------------------------------------------------------------|-----------------------------|
| 5.1  | Empty Field Assets tab                     | **Fixed** -- Events collection `media_folder` removed earlier today  | `config.yml` events section |
| 5.2  | Hugo can't find image                      | **Clear** -- module mount bridges `static/images` to assets          | `hugo.toml` mount config    |
| 5.3  | Relative `public_folder` wrong paths       | **Not applicable** -- templates use `resources.Get()`, not raw `src` | All layout templates        |
| 5.4  | Default `public_folder` includes `static/` | **Clear** -- global `public_folder: /images` is explicit             | `config.yml` line 38        |
| 5.5  | Historical absolute path bug               | **Not applicable** -- using Sveltia CMS                              | N/A                         |
| 5.6  | Page bundle images in picker               | **Clear** -- blog collection uses `media_folder: ''`                 | `config.yml` blog section   |
| 5.7  | Preview vs production divergence           | **Needs verification** -- test in CMS preview                        | Browser: `/admin/`          |

### Phase 6: Update Best Practices Doc

| Step | Update                                                        | Reason                                                                                                                 |
|------|---------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| 6.1  | Add "Pattern D: Module Mount" section                         | This site uses `static/images` mounted to `assets/images`, which is not covered by Patterns A-C                        |
| 6.2  | Add note to BP5 about `resources.Get()` normalization         | When templates use `resources.Get()`, both `/` and no-`/` conventions work, making BP5 cosmetic rather than functional |
| 6.3  | Add Hugo module mount to "How the Two Settings Work Together" | The mount is critical infrastructure that makes the whole system work                                                  |
