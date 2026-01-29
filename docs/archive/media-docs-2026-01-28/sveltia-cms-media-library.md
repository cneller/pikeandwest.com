# Sveltia CMS Media Library: Asset Categories & Configuration

> How the "Select Image" dialog determines which asset tabs appear and how to configure them.

## Overview

When you click an Image or File widget field in Sveltia CMS, the **Select Image** dialog presents assets organized into categorized tabs. Which tabs appear depends on `media_folder` and `public_folder` settings at three configuration levels: **global**, **collection**, and **field**.

This is a Sveltia CMS enhancement over Decap/Netlify CMS, which shows a single flat list of all assets.

---

## The Five Asset Categories

Sveltia CMS supports up to five tabs under "Your Site" in the Select Image dialog:

| Tab                   | Scope                            | When It Appears                                                       |
|-----------------------|----------------------------------|-----------------------------------------------------------------------|
| **Field Assets**      | Single field                     | Field defines its own `media_folder` different from collection/global |
| **Entry Assets**      | Current entry                    | Collection uses entry-relative paths (`media_folder: ''`)             |
| **File Assets**       | Single file in a file collection | File collection file has a distinct media context                     |
| **Collection Assets** | All entries in a collection      | Collection defines an absolute `media_folder` different from global   |
| **Global Assets**     | Entire site                      | Always present (uses top-level `media_folder`)                        |

Not all tabs appear at once. Sveltia CMS suppresses redundant tabs when two levels resolve to the same folder.

---

## Configuration Hierarchy

Media folder settings cascade from general to specific:

```text
Global media_folder  (always present, defined at config root)
  --> Collection media_folder  (overrides global for all fields in that collection)
    --> Field media_folder  (overrides collection/global for that specific widget)
```

Each level is optional. If omitted, the parent level's setting is inherited.

---

## How Each Tab Is Configured

### Global Assets

**Always appears.** Shows all files recursively under the top-level `media_folder`.

```yaml
# config.yml root level
media_folder: static/images
public_folder: /images
```

- `media_folder` -- repo-relative path where files are stored
- `public_folder` -- URL path used in content front matter (Hugo strips `static/` at build time)

### Collection Assets

Appears when a collection defines its own `media_folder` with an **absolute path** (starts with `/`) that differs from the global `media_folder`.

```yaml
collections:
  - name: products
    folder: content/products
    media_folder: /static/media/products   # absolute path, starts with /
    public_folder: /media/products
```

Shows all assets across all entries in that collection's designated folder.

### Entry Assets

Appears when a collection uses **entry-relative** media storage (empty string or relative path without leading `/`).

```yaml
collections:
  - name: blog
    folder: content/blog
    path: '{{slug}}/index'
    media_folder: ''       # empty string = store alongside the entry file
    public_folder: ''
```

- Shows only assets in the **current entry's directory** (e.g., `content/blog/my-post/`)
- Assets are **automatically deleted** when the entry is deleted (lifecycle tied to entry)
- Ideal for Hugo page bundles where images live alongside `index.md`

You can also use a relative subfolder name (e.g., `images`) to store entry assets in a subdirectory within the entry folder.

### Field Assets

Appears when an individual Image or File widget specifies its own `media_folder` that differs from both the collection and global levels.

```yaml
fields:
  - label: Hero Image
    name: image
    widget: image
    media_folder: /static/images/venue     # field-specific folder
    public_folder: images/venue
```

Shows only assets from that field's specific directory. This is the most narrowly scoped category.

### File Assets

Appears in the context of **file collections** (the `files` key, as opposed to `folder` collections). Each file within a file collection can have its own media context. This tab shows assets associated with that specific file's configuration.

---

## Path Resolution Rules

| Path Format                              | Resolution                        | Example                                                      |
|------------------------------------------|-----------------------------------|--------------------------------------------------------------|
| No leading `/` (global level)            | Relative to repo root             | `static/images` -> `<repo>/static/images/`                   |
| Leading `/` (collection/field)           | Relative to repo root             | `/static/images/venue` -> `<repo>/static/images/venue/`      |
| Relative path (collection level, no `/`) | Relative to collection's `folder` | `images` on `folder: content/blog` -> `content/blog/images/` |
| Empty string `''`                        | Entry-relative                    | Assets stored in the same directory as the content file      |

### Template Variables

These placeholders can be used in `media_folder` and `public_folder` values:

| Variable            | Resolves To                                                        |
|---------------------|--------------------------------------------------------------------|
| `{{media_folder}}`  | The global `media_folder` value                                    |
| `{{public_folder}}` | The global `public_folder` value                                   |
| `{{dirname}}`       | Directory name of the entry file relative to the collection folder |
| `{{filename}}`      | Entry filename without extension                                   |
| `{{extension}}`     | Entry file extension                                               |

---

## Tab Visibility Logic

A tab appears when:

1. The corresponding level has a `media_folder` configured
2. That folder resolves to a **different path** than other levels

A tab is **hidden** when:

- It would be redundant (resolves to the same folder as another tab)
- The level has no `media_folder` configured (inherits parent, so only the parent tab shows)

### Decision Flowchart

```text
Does the field have its own media_folder?
  YES --> Show "Field Assets" tab
  NO  --> inherit collection setting

Does the collection have a media_folder?
  YES, absolute path (/...) --> Show "Collection Assets" tab
  YES, empty string ('') --> Show "Entry Assets" tab
  YES, relative path --> Show "Entry Assets" tab (resolved relative to collection folder)
  NO  --> inherit global setting

Global media_folder always exists --> Show "Global Assets" tab
```

---

## Pike & West Configuration

### Global Setting

```yaml
media_folder: static/images
public_folder: /images
```

### Per-Level Overrides

| Level                      | Location    | media_folder           | public_folder  | Dialog Tab    |
|----------------------------|-------------|------------------------|----------------|---------------|
| Global                     | Root config | `static/images`        | `/images`      | Global Assets |
| Blog collection            | Collection  | `''` (empty)           | `''` (empty)   | Entry Assets  |
| Blog Hero Image            | Field       | `/static/images/venue` | `images/venue` | Field Assets  |
| Events Hero Image          | Field       | `/static/images/venue` | `images/venue` | Field Assets  |
| Hero background/foreground | Field       | `/static/images/hero`  | `images/hero`  | Field Assets  |
| CTA Banner background      | Field       | `/static/images/venue` | `images/venue` | Field Assets  |
| About section image        | Field       | `/static/images/about` | `images/about` | Field Assets  |
| 404 background             | Field       | `/static/images/venue` | `images/venue` | Field Assets  |

### What You See When Editing

| Context                    | Tabs Shown                  | Why                                                              |
|----------------------------|-----------------------------|------------------------------------------------------------------|
| Blog post Featured Image   | Entry Assets, Global Assets | Collection-level `''` creates Entry Assets; no field override    |
| Blog index_file Hero Image | Field Assets, Global Assets | Field override to `/static/images/venue`                         |
| Events Hero Image          | Field Assets, Global Assets | Field override to `/static/images/venue`; no collection override |
| Hero section Background    | Field Assets, Global Assets | Field override to `/static/images/hero`                          |
| CTA Banner Background      | Field Assets, Global Assets | Field override to `/static/images/venue`                         |
| About section Image        | Field Assets, Global Assets | Field override to `/static/images/about`                         |
| 404 Background             | Field Assets, Global Assets | Field override to `/static/images/venue`                         |

---

## External Locations & Stock Photos

In addition to "Your Site" tabs, the dialog also shows:

**External Locations:**

- **Enter URL** -- paste a direct URL to any image

**Stock Photos** (built into Sveltia CMS):

- **Pexels**
- **Pixabay**
- **Unsplash**

These are always available regardless of configuration. Stock photo integration is a Sveltia-specific feature not found in Decap/Netlify CMS.

---

## Sveltia CMS vs Decap CMS Differences

| Feature                  | Decap CMS                   | Sveltia CMS                                  |
|--------------------------|-----------------------------|----------------------------------------------|
| Asset tabs in dialog     | Single flat list            | Separate tabs per scope level                |
| Collection media folders | Supported, no special UI    | Dedicated Collection Assets tab              |
| Entry-relative media     | Supported, all assets shown | Scoped Entry Assets tab (current entry only) |
| Field-level media_folder | Supported                   | Dedicated Field Assets tab                   |
| Folder navigation        | Basic                       | Full Asset Library with folder browsing      |
| Stock photo integration  | Not built-in                | Pexels, Pixabay, Unsplash                    |
| Asset lifecycle          | Manual management           | Entry-relative assets auto-delete with entry |

---

## Common Gotchas

1. **`media_folder` vs `public_folder` mismatch** -- For Hugo, `media_folder` points to the repo path (e.g., `static/images/venue`) while `public_folder` is the built URL path (e.g., `images/venue`, without `static/`). Mismatch causes images to upload correctly but front matter paths to be wrong.

2. **Leading slash matters at collection/field level** -- `/static/images/venue` is absolute from repo root. `static/images/venue` without the slash resolves relative to the collection's `folder`, producing the wrong path.

3. **Global folder overlaps with field folders** -- If the global `media_folder` is `static/images` and a field uses `/static/images/venue`, assets in `venue/` appear in both Global Assets (as a subfolder) and Field Assets. This is expected behavior, not a bug.

4. **Empty string for page bundles** -- Setting `media_folder: ''` and `public_folder: ''` enables Hugo page bundle workflows. Assets upload alongside `index.md` and are deleted when the entry is removed.

5. **Draft assets** -- Assets uploaded to unsaved/draft entries are not displayed in the Select Image dialog. This is a known Sveltia CMS limitation.

6. **Uncategorized assets in the Asset Library** -- In the full Asset Library view (separate from the Select dialog), assets in the global `media_folder` not claimed by a collection or field appear as "Uncategorized." Manual categorization is a [planned feature (Issue #301)](https://github.com/sveltia/sveltia-cms/issues/301).

---

## References

- [Sveltia CMS Internal Media Storage](https://sveltiacms.app/en/docs/media/internal)
- [Sveltia CMS Asset Library UI](https://sveltiacms.app/en/docs/ui/asset-library)
- [Sveltia CMS GitHub Repository](https://github.com/sveltia/sveltia-cms)
- [Decap CMS Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Decap CMS Folder Collections](https://decapcms.org/docs/collection-folder/)
- [GitHub Discussion #190 - media_folder per post](https://github.com/sveltia/sveltia-cms/discussions/190)
- [GitHub Issue #301 - Manual assets folder control](https://github.com/sveltia/sveltia-cms/issues/301)
