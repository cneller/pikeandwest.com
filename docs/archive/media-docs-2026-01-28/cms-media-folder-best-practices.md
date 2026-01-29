# CMS Media Folder Best Practices

Comprehensive reference for how `media_folder` and `public_folder` work in Sveltia CMS (and its predecessors Netlify CMS / Decap CMS), how paths resolve at every configuration level, and how front matter paths are generated and consumed by Hugo.

Last updated: 2026-01-28

---

## Table of Contents

- [How the Two Settings Work Together](#how-the-two-settings-work-together)
- [Configuration Hierarchy](#configuration-hierarchy)
- [Path Resolution Rules](#path-resolution-rules)
- [Sveltia CMS Asset Picker Tabs](#sveltia-cms-asset-picker-tabs)
- [Hugo Front Matter Path Consumption](#hugo-front-matter-path-consumption)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Sources](#sources)

---

## How the Two Settings Work Together

Every image/file widget in the CMS relies on two settings that serve distinct purposes:

| Setting         | Purpose                                            | Controls                      |
|-----------------|----------------------------------------------------|-------------------------------|
| `media_folder`  | Where the file is **stored** in the Git repository | Physical file path in repo    |
| `public_folder` | What path is **written** into the content file     | Front matter / markdown `src` |

**Example:** With `media_folder: static/images` and `public_folder: /images`, uploading `photo.jpg` results in:

- File saved to: `static/images/photo.jpg` (in the repo)
- Front matter value: `/images/photo.jpg` (in the content file)

Hugo strips the `static/` prefix at build time, so `static/images/photo.jpg` becomes `/images/photo.jpg` on the published site. This is why the two settings differ by exactly the `static/` prefix.

---

## Configuration Hierarchy

Sveltia CMS resolves `media_folder` and `public_folder` through a four-level cascade. Each level overrides the previous:

```text
1. Global (top-level config.yml)
   └── 2. Collection-level (per folder or file collection)
       └── 3. File-level (per file in file collections / singletons)
           └── 4. Field-level (per individual image/file widget)
```

### Level 1: Global

```yaml
media_folder: static/images
public_folder: /images
```

- Applies to every collection and field unless overridden.
- `public_folder` defaults to `media_folder` with a leading `/` prepended if absent.
- Leading slash is optional at this level.

### Level 2: Collection

```yaml
collections:
  - name: blog
    folder: content/blog
    media_folder: ''       # entry-relative (page bundle)
    public_folder: ''      # relative path in front matter
```

- Overrides the global settings for all fields in this collection.
- Can use absolute paths (starting with `/`) for shared directories.
- Can use relative paths or empty strings for entry-relative storage.
- **Important:** When specifying a `path` on a folder collection (e.g., `path: '{{slug}}/index'`), `media_folder` defaults to `''` (empty string).

### Level 3: File (within file collections / singletons)

```yaml
singletons:
  - name: hero
    file: data/hero.yaml
    # media_folder and public_folder can be set here
    fields:
      - label: Background Image
        name: background_image
        widget: image
```

- For file collections (`files:`) and Sveltia CMS singletons, each file entry can have its own `media_folder`/`public_folder`.
- Overrides the collection-level settings for that specific file.

### Level 4: Field

```yaml
fields:
  - label: Featured Image
    name: image
    widget: image
    media_folder: /static/images/venue
    public_folder: /images/venue
```

- Overrides all higher levels for this specific widget.
- Most granular control available.
- This is where you point individual image pickers at specific directories.

### Template Variables

At the collection, file, and field levels, you can reference higher-level values:

| Variable            | Resolves To                                    |
|---------------------|------------------------------------------------|
| `{{media_folder}}`  | Global `media_folder` value                    |
| `{{public_folder}}` | Global `public_folder` value                   |
| `{{dirname}}`       | Parent directory relative to collection folder |
| `{{filename}}`      | Entry filename without extension               |
| `{{extension}}`     | Entry file extension                           |

**Example:** Building on the global setting:

```yaml
fields:
  - label: Cover Image
    name: image
    widget: image
    media_folder: '/{{media_folder}}/covers'
    public_folder: '{{public_folder}}/covers'
```

---

## Path Resolution Rules

### Absolute vs. Relative Paths

The leading `/` character determines how paths are resolved:

| Path Format            | Type     | Resolved From         | Example                       |
|------------------------|----------|-----------------------|-------------------------------|
| `/static/images/venue` | Absolute | Repository root       | `<repo>/static/images/venue/` |
| `images`               | Relative | Collection's `folder` | `<collection-folder>/images/` |
| `''` (empty string)    | Relative | Entry's own directory | `<entry-directory>/`          |
| `./assets`             | Relative | Entry's own directory | `<entry-directory>/assets/`   |

### Rules by Configuration Level

| Level      | Absolute (`/`)                         | Relative (no `/`)               |
|------------|----------------------------------------|---------------------------------|
| Global     | Leading `/` optional; always repo-root | Always repo-root (implicit)     |
| Collection | Repo-root (override global)            | Relative to collection `folder` |
| File       | Repo-root (override collection)        | Relative to file's directory    |
| Field      | Repo-root (override all above)         | Relative to collection `folder` |

### How `public_folder` Determines Front Matter Values

When a user selects an image, the CMS writes the path to the content file by combining `public_folder` + filename:

```text
front_matter_value = public_folder + "/" + filename
```

| `public_folder` Value | Filename    | Front Matter Output                  |
|-----------------------|-------------|--------------------------------------|
| `/images/venue`       | `photo.jpg` | `/images/venue/photo.jpg` (absolute) |
| `images/venue`        | `photo.jpg` | `images/venue/photo.jpg` (relative)  |
| `` (empty)            | `photo.jpg` | `photo.jpg` (entry-relative)         |
| `./assets`            | `photo.jpg` | `./assets/photo.jpg` (explicit rel)  |

### Default `public_folder` Behavior

If `public_folder` is not specified at any level, Sveltia/Decap CMS defaults it to the `media_folder` value **with a leading `/` prepended** if one is not already present.

---

## Sveltia CMS Asset Picker Tabs

Sveltia CMS provides a multi-tabbed asset selection dialog. The tabs that appear depend on the configuration hierarchy:

### Available Tabs

| Tab                   | Shows Assets From                             |
|-----------------------|-----------------------------------------------|
| **Field Assets**      | The field-level `media_folder` directory      |
| **Entry Assets**      | The entry's own directory (for page bundles)  |
| **Collection Assets** | The collection-level `media_folder` directory |
| **Global Assets**     | The global `media_folder` directory           |

### Tab Suppression Rule

**Sveltia CMS suppresses a tab when its `media_folder` resolves to the same directory as another tab's `media_folder`.** Specifically:

- If the field-level `media_folder` equals the collection-level `media_folder`, the **Field Assets** tab is hidden.
- If the collection-level `media_folder` equals the global `media_folder`, the **Collection Assets** tab may be hidden.

This is a deduplication behavior -- identical directories produce identical file listings, so the CMS hides redundant tabs.

### Making All Tabs Appear

To ensure the Field Assets tab appears with the files you want, the field-level `media_folder` must differ from the collection-level `media_folder`:

```yaml
# WRONG: Field and collection point to the same directory
# Field Assets tab will be suppressed
collections:
  - name: events
    media_folder: /static/images/venue       # same as field
    fields:
      - name: image
        widget: image
        media_folder: /static/images/venue   # same as collection

# CORRECT: Field and collection point to different directories
# Field Assets tab appears with venue photos
collections:
  - name: events
    # inherits global (static/images) or set to a different path
    fields:
      - name: image
        widget: image
        media_folder: /static/images/venue   # different from collection
```

### Practical Tab Design Strategy

| Goal                                   | Strategy                                                 |
|----------------------------------------|----------------------------------------------------------|
| Show specific folder in Field Assets   | Set field `media_folder` to that folder                  |
| Show page bundle files in Entry Assets | Set collection `media_folder: ''`                        |
| Show all site images in Global Assets  | Keep global `media_folder` broad (e.g., `static/images`) |
| Ensure three distinct tabs             | Make field, collection, and global paths all different   |

---

## Hugo Front Matter Path Consumption

Understanding how Hugo uses the paths that the CMS writes into front matter is critical for correct configuration.

### Hugo's Image Source Locations

| Location                 | Path Type in Front Matter     | Image Processing | Template Access Method                |
|--------------------------|-------------------------------|------------------|---------------------------------------|
| `static/images/`         | Absolute: `/images/photo.jpg` | No               | Direct `<img src>` or `.Params.image` |
| `assets/images/`         | Absolute: `/images/photo.jpg` | Yes              | `resources.Get`                       |
| Page bundle (co-located) | Relative: `photo.jpg`         | Yes              | `.Resources.GetMatch`                 |

### How Hugo Resolves Front Matter Image Paths

**Absolute paths** (starting with `/`):

```yaml
# Front matter
image: "/images/venue/photo.jpg"
```

- Hugo treats this as an absolute URL from the site root.
- The file lives at `static/images/venue/photo.jpg` in the repo.
- At build time, Hugo copies `static/` contents to the site root.
- The published URL becomes `https://example.com/images/venue/photo.jpg`.
- Used directly in templates: `<img src="{{ .Params.image }}">`

**Relative paths** (no leading `/`):

```yaml
# Front matter
image: "images/venue/photo.jpg"
```

- Hugo treats this as relative to the content file's URL.
- For a page at `/blog/my-post/`, this resolves to `/blog/my-post/images/venue/photo.jpg`.
- This is usually wrong for shared images -- it implies the image is inside the page bundle.
- Works correctly for page bundles where images are co-located with content.

**Page bundle relative paths** (empty `public_folder`):

```yaml
# Front matter in content/blog/my-post/index.md
image: "photo.jpg"
```

- Hugo resolves this as a page resource in `content/blog/my-post/photo.jpg`.
- Template access: `{{ (.Resources.GetMatch .Params.image).RelPermalink }}`
- Supports image processing (resize, crop, WebP conversion).

### The Static vs. Assets Decision

| If you need...                  | Use `static/`           | Use `assets/`                  |
|---------------------------------|-------------------------|--------------------------------|
| Simple image references         | Yes                     | Overkill                       |
| Image processing (resize, WebP) | Not possible            | Yes                            |
| CMS media library integration   | Yes (standard approach) | Requires custom template logic |
| Front matter path simplicity    | `/images/photo.jpg`     | Needs template pipeline        |

**For CMS-managed images:** The standard approach is `static/` because:

1. CMS tools write paths directly to front matter.
2. Hugo serves `static/` files at the site root automatically.
3. No template processing pipeline required for basic display.
4. The path in front matter matches the published URL.

### Front Matter Path Patterns by CMS Configuration

| CMS `public_folder` | Front Matter Value        | Hugo Resolution                                        |
|---------------------|---------------------------|--------------------------------------------------------|
| `/images/venue`     | `/images/venue/photo.jpg` | Absolute from site root                                |
| `images/venue`      | `images/venue/photo.jpg`  | Relative to page URL (usually wrong for shared images) |
| `` (empty)          | `photo.jpg`               | Page bundle resource (correct for co-located files)    |

**Recommendation for Hugo + Sveltia CMS with shared images in `static/`:**

- Use absolute `public_folder` with leading `/`: `public_folder: /images/venue`
- This writes `/images/venue/photo.jpg` to front matter.
- Hugo resolves this correctly as an absolute path from the site root.
- Templates can use `{{ .Params.image }}` directly without processing.

---

## Best Practices

### 1. Always Set Both `media_folder` and `public_folder` Explicitly

Don't rely on defaults. The default `public_folder` behavior (prepending `/` to `media_folder`) works for simple cases, but explicit settings prevent surprises:

```yaml
# Explicit (preferred)
media_folder: static/images
public_folder: /images

# Implicit (default behavior, less clear)
media_folder: static/images
# public_folder defaults to /static/images -- WRONG for Hugo!
```

For Hugo specifically, the `public_folder` must strip the `static/` prefix because Hugo maps `static/` to the site root.

### 2. Use Absolute Paths at Field Level for Shared Image Directories

When multiple collections share the same image directory (e.g., venue photos used by blog posts, event pages, and the CTA banner), use absolute paths at the field level:

```yaml
fields:
  - label: Hero Image
    name: image
    widget: image
    media_folder: /static/images/venue    # absolute, repo-root
    public_folder: /images/venue           # absolute, site-root
```

This ensures:

- Uploads go to the correct shared directory.
- Front matter contains absolute paths that Hugo resolves correctly.
- The asset picker's Field Assets tab shows files from that directory.

### 3. Keep Field-Level and Collection-Level `media_folder` Different

To ensure the Sveltia CMS asset picker shows a usable Field Assets tab, the field-level `media_folder` must differ from the collection-level `media_folder`:

```yaml
collections:
  - name: events
    folder: content/events
    # DO NOT set collection-level media_folder to the same path
    # as your field-level media_folder
    fields:
      - name: icon
        widget: image
        media_folder: /static/images/icons   # specific to icons
      - name: image
        widget: image
        media_folder: /static/images/venue   # specific to venue photos
```

If the collection-level `media_folder` must be set, choose a broader path (like the global default) or a path distinct from all field-level paths.

### 4. Use Entry-Relative Paths for Page Bundles

For Hugo page bundles where images are co-located with content:

```yaml
collections:
  - name: blog
    folder: content/blog
    path: '{{slug}}/index'
    media_folder: ''        # store in entry's own folder
    public_folder: ''       # write relative path to front matter
```

This produces the structure:

```text
content/blog/my-post/
  index.md          # image: "photo.jpg"
  photo.jpg         # co-located with content
```

### 5. Use Consistent Leading `/` Convention for `public_folder`

Choose one convention and apply it consistently across all fields:

| Convention          | `public_folder` Example | Front Matter Output       | Hugo Behavior      |
|---------------------|-------------------------|---------------------------|--------------------|
| Absolute (with `/`) | `/images/venue`         | `/images/venue/photo.jpg` | Site-root absolute |
| Relative (no `/`)   | `images/venue`          | `images/venue/photo.jpg`  | Page-relative      |

**Recommendation for shared images in `static/`:** Use absolute paths with leading `/`. Hugo resolves them from the site root, which matches where `static/` files are served.

**Recommendation for page bundle images:** Use empty strings (`''`). Hugo resolves relative filenames as page resources.

### 6. Organize `media_folder` Directories by Content Purpose

Group images by how they're used, not by which collection references them:

```text
static/images/
  about/          # About section images
  hero/           # Homepage hero images
  icons/          # Event type and feature icons
  logo/           # Brand logos (not CMS-managed)
  social/         # Social media icons (not CMS-managed)
  venue/          # Venue photos (shared across many fields)
```

This keeps the CMS configuration clean because multiple fields can point to the same directory (e.g., seven different fields all use `media_folder: /static/images/venue`).

### 7. Document Your Media Architecture

Maintain a matrix document (like [cms-media-folder-matrix.md](./cms-media-folder-matrix.md)) that maps:

- Every image field to its `media_folder` and `public_folder`.
- Every directory to the fields that reference it.
- Any `public_folder` inconsistencies (leading `/` vs. no leading `/`).

This is essential for debugging asset picker issues and ensuring new fields follow established patterns.

---

## Common Pitfalls

### Pitfall 1: Field Assets Tab is Empty / Missing

**Symptom:** The Field Assets tab in the Sveltia CMS asset picker doesn't appear or shows no files.

**Cause:** The field-level `media_folder` is identical to the collection-level `media_folder`. Sveltia CMS deduplicates identical tabs.

**Fix:** Ensure the field-level and collection-level `media_folder` values are different. If the collection doesn't need its own media_folder, remove it and let it inherit from global.

### Pitfall 2: Hugo Can't Find the Image

**Symptom:** Images show as broken on the published site.

**Cause:** Mismatch between `public_folder` and Hugo's path resolution.

**Fix:** For images in `static/`:

- `media_folder` must include `static/` (e.g., `static/images/venue`)
- `public_folder` must **not** include `static/` (e.g., `/images/venue`)
- Hugo strips `static/` at build time.

### Pitfall 3: Relative `public_folder` Produces Wrong Front Matter Paths

**Symptom:** Front matter contains `images/venue/photo.jpg` (relative) instead of `/images/venue/photo.jpg` (absolute), and the image only works on certain pages.

**Cause:** `public_folder` was set without a leading `/`, making it relative to the page URL.

**Fix:** For shared images, always use a leading `/` in `public_folder`:

```yaml
public_folder: /images/venue    # absolute from site root
# NOT: images/venue             # relative to page URL
```

### Pitfall 4: `public_folder` Default Includes `static/`

**Symptom:** Front matter contains `/static/images/photo.jpg` instead of `/images/photo.jpg`.

**Cause:** `public_folder` was not set explicitly, and it defaulted to the `media_folder` value with a leading `/` prepended. Since `media_folder` is `static/images`, the default becomes `/static/images`.

**Fix:** Always set `public_folder` explicitly for Hugo sites:

```yaml
media_folder: static/images
public_folder: /images          # explicit, strips static/
```

### Pitfall 5: Collection `media_folder` with Leading `/` Was Historically Ignored

**Symptom:** Uploads go to the wrong directory in older versions of Netlify/Decap CMS.

**Cause:** In older Netlify CMS versions, collection-level `media_folder` was ignored when using absolute paths (leading `/`). This was fixed in Decap CMS via [PR #3160](https://github.com/decaporg/decap-cms/issues/3132).

**Fix:** This is resolved in current Sveltia CMS. Absolute paths at the collection level work correctly.

### Pitfall 6: Page Bundle Images Not Appearing in Asset Picker

**Symptom:** Images uploaded alongside content (in page bundles) don't show in the Select Image dialog.

**Cause:** Entry-relative media folders are scoped to the current entry. The picker initially only showed the current entry's files.

**Fix:** Sveltia CMS v0.37.0+ shows images from other entries in the same collection. Ensure you're on a recent version.

### Pitfall 7: Images Work in CMS Preview but Not Published Site

**Symptom:** The CMS preview shows the image correctly, but the built site doesn't.

**Cause:** CMS preview resolves paths relative to the repo root. The published site resolves paths relative to the site URL. If `public_folder` doesn't match Hugo's URL structure, they diverge.

**Fix:** Verify the `public_folder` path matches the URL where Hugo serves the file:

```text
Repo:         static/images/venue/photo.jpg
Hugo output:  public/images/venue/photo.jpg
Site URL:     https://example.com/images/venue/photo.jpg
public_folder: /images/venue  --> front matter: /images/venue/photo.jpg  ✓
```

---

## Quick Reference: Hugo + Sveltia CMS Configuration Patterns

### Pattern A: Shared Images in `static/` (Most Common)

For images shared across multiple pages/collections:

```yaml
# Global
media_folder: static/images
public_folder: /images

# Field-level (on each image widget)
fields:
  - name: image
    widget: image
    media_folder: /static/images/venue
    public_folder: /images/venue
```

**Front matter output:** `image: "/images/venue/photo.jpg"`
**Hugo template:** `<img src="{{ .Params.image }}">`

### Pattern B: Page Bundle Images (Entry-Relative)

For images co-located with content entries:

```yaml
# Collection-level
collections:
  - name: blog
    folder: content/blog
    path: '{{slug}}/index'
    media_folder: ''
    public_folder: ''
```

**Front matter output:** `image: "photo.jpg"`
**Hugo template:** `{{ with .Resources.GetMatch .Params.image }}...{{ end }}`

### Pattern C: Mixed (Shared + Page Bundle)

For collections that use both shared images and entry-relative images:

```yaml
collections:
  - name: blog
    folder: content/blog
    path: '{{slug}}/index'
    media_folder: ''           # collection default: page bundle
    public_folder: ''
    fields:
      - name: image            # shared venue photo
        widget: image
        media_folder: /static/images/venue
        public_folder: /images/venue
      - name: body
        widget: markdown       # inline images go to page bundle
```

**Asset picker tabs:**

- Field Assets: venue photos (from field `media_folder`)
- Entry Assets: page bundle images (from collection `media_folder`)
- Global Assets: all images (from global `media_folder`)

---

## Sources

### Sveltia CMS

- [Getting Started](https://sveltiacms.app/en/docs/start)
- [Features](https://sveltiacms.app/en/docs/features)
- [Internal Media Storage](https://sveltiacms.app/en/docs/media/internal)
- [GitHub Repository](https://github.com/sveltia/sveltia-cms)
- [Discussion #190: Can't set media_folder per post properly](https://github.com/sveltia/sveltia-cms/discussions/190)
- [Discussion #229: Nested folders in media library](https://github.com/sveltia/sveltia-cms/discussions/229)
- [Issue #301: Manual assets folder control](https://github.com/sveltia/sveltia-cms/issues/301)
- [Issue #327: Editor put wrong image path](https://github.com/sveltia/sveltia-cms/issues/327)
- [Issue #420: Directory navigation in media library](https://github.com/sveltia/sveltia-cms/issues/420)

### Decap CMS (Netlify CMS)

- [Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Folder Collections](https://decapcms.org/docs/collection-folder/)
- [File Collections](https://decapcms.org/docs/collection-file/)
- [Image Widget](https://decapcms.org/docs/widgets/image/)
- [Hugo Configuration](https://decapcms.org/docs/hugo/)
- [PR #3208: Field-level media/public folders](https://github.com/decaporg/decap-cms/pull/3208)
- [Issue #3053: Collection public_folder for absolute paths](https://github.com/decaporg/decap-cms/issues/3053)
- [Issue #3132: Collection media_folder ignored for absolute paths](https://github.com/decaporg/decap-cms/issues/3132)

### Hugo

- [Content Organization](https://gohugo.io/content-management/organization/)
- [Page Resources](https://gohugo.io/content-management/page-resources/)
- [Image Processing Guide](https://alexlakatos.com/web/2020/07/17/hugo-image-processing/)
- [Image Resource Access Guide](https://www.markusantonwolf.com/blog/guide-for-different-ways-to-access-your-image-resources/)
- [Discourse: Static folder image paths](https://discourse.gohugo.io/t/help-with-link-images-to-see-from-absolute-path-including-static/41177)
