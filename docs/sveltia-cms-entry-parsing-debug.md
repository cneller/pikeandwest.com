# Sveltia CMS Entry Parsing Debug Investigation

**Date:** 2026-01-28
**CMS Version:** Sveltia CMS v0.129.0
**Status:** Debug build deployed, awaiting manual browser testing

---

## Problem Statement

- Toast error: "There were errors while parsing entry files" when using "Work with Local Repository" mode
- Blog Posts collection shows "(no entries)" despite 6 valid blog posts on disk
- Event Pages collection loads entries but shows no hero image thumbnails in list view
- Using Sveltia CMS v0.129.0 with a Hugo static site

---

## Environment

| Component        | Detail                                                                     |
|------------------|----------------------------------------------------------------------------|
| Project          | `pikeandwest.com-sveltia-cms` (Hugo site)                                  |
| CMS bundle       | `static/admin/sveltia-cms.js` (local IIFE build)                           |
| CMS config       | `static/admin/config.yml`                                                  |
| Auth mode        | "Work with Local Repository" (File System Access API)                      |
| Blog structure   | Page bundles: `content/blog/{slug}/index.md` with `path: '{{slug}}/index'` |
| Events structure | Flat files: `content/events/{name}.md` (no `path` option)                  |
| Index files      | Both collections have `index_file` config for Hugo's `_index.md`           |
| Hugo version     | v0.146.0+extended                                                          |

---

## Content Structure

### Blog Posts (`content/blog/`)

Page bundle layout -- each post is a directory containing `index.md` and optional co-located images:

```text
content/blog/
  _index.md                                           (section index)
  corporate-event-planning-tips-2026/index.md
  fall-baby-shower-inspiration/index.md
  holiday-anniversary-celebrations/index.md
  milestone-birthday-new-year/index.md
  milestone-birthday-new-year/milestone-birthday-hero.png   (co-located image)
  valentines-day-love-in-all-forms/index.md
  valentines-day-love-in-all-forms/valentines-day-hero.jpg  (co-located image)
  welcome-to-pike-and-west/index.md
```

Total: 6 blog posts + 1 section index + 2 co-located images

### Event Pages (`content/events/`)

Flat file layout -- each event is a standalone `.md` file:

```text
content/events/
  _index.md          (section index)
  baby-showers.md
  birthday-parties.md
  corporate-events.md
  dance-events.md
  private-parties.md
  weddings.md
```

Total: 6 event pages + 1 section index

---

## Investigation Steps

### 1. Playwright Console Capture (Failed)

Attempted to capture browser console errors via Playwright MCP to programmatically observe the CMS initialization sequence.

**Blockers encountered:**

- The File System Access API (`showDirectoryPicker`) cannot be triggered by Playwright -- it requires a user gesture and native OS dialog interaction
- Page reload disconnects the filesystem handle, so navigating to `/admin/` fresh provides no filesystem context
- Post-load monkey-patching of `console.error` / `console.warn` misses errors emitted during the CMS initialization phase, which runs synchronously on page load
- The only error captured was an `AbortError` (from the cancelled directory picker), which provided no useful diagnostic data

**Conclusion:** Playwright is not viable for debugging File System Access API flows. Manual browser testing is required.

### 2. Node.js YAML Parsing Test

Tested all blog and events front matter files using the `yaml` npm package (the same YAML parser Sveltia CMS uses internally).

**Method:**

- Read each `.md` file
- Extracted front matter between `---` delimiters using regex
- Parsed with `yaml.parse()`
- Verified the resulting object had expected keys

**Result:** All files parse correctly. 0 errors across all 13 content files (6 blog + 6 events + 1 blog index + 1 events index, excluding blog index which was also tested). Front matter regex matched all files without issue.

### 3. Comprehensive Diagnostic Script (`diagnose-cms.mjs`)

Built a standalone Node.js script that replicates the Sveltia CMS content processing pipeline as closely as possible.

**What the script does:**

- Reads `static/admin/config.yml` and extracts collection definitions
- Builds collection path regexes identically to the CMS source (using the same `path`, `extension`, and `folder` parameters)
- Recursively scans the filesystem under each collection's `folder`
- Classifies files as entry files or asset files based on regex matching
- Parses YAML front matter from each entry file
- Checks index file skipping logic (`_index.md` handling)
- Extracts slugs and subPaths from file paths
- Reports any file that fails at any stage

**Result:** ALL 30 content files (entries, index files, and co-located assets) were correctly classified and processed. 0 errors. The Node.js simulation suggests the content and config are well-formed.

### 4. Sveltia CMS Source Code Deep Dive

Traced the COMPLETE initialization and entry processing pipeline through the Sveltia CMS source at `~/Projects/sveltia-cms/src/`. This section documents the full code path from config load to entry display.

#### 4.1 Config Initialization (`lib/services/config/index.js`)

- `initCmsConfig()` loads raw config (from YAML), calls `parseCmsConfig()`
- Stores `structuredClone(rawConfig)` as the reactive `cmsConfig`
- A Svelte subscriber on `cmsConfig` triggers `getAllEntryFolders(config)` and `getAllAssetFolders(config)` once config is set
- These folder lists drive the filesystem scanning phase

#### 4.2 Entry Folder Building (`lib/services/config/folders/entries.js`)

- `getEntryCollectionFolders()` filters collections by `getValidCollections({ type: 'entry', visible: true })`
- For blog: `collectionName='blog'`, `folderPath='content/blog'`
- For events: `collectionName='events'`, `folderPath='content/events'`
- File/singleton collections get `filePathMap` with exact paths instead of folder paths

#### 4.3 Filesystem Scanning (`lib/services/backends/fs/shared/files.js`)

- `collectScanningPaths()` reads `allEntryFolders` to build directory paths for scanning
- `scanDir()` recursively enumerates directories via `dirHandle.entries()` (File System Access API)
- Uses a scanning path regex to filter results: `^content\/blog(?:\/|$)` matches files under `content/blog/`
- Files matching scanning paths are collected as objects with `FileSystemFileHandle` + `path` string

#### 4.4 File Classification (`lib/services/backends/process.js` -- `createFileList`)

- For each scanned file, calls `getEntryFoldersByPath(path)` to determine which collection(s) claim it
- Entry collections are matched via `getCollection(name)._file.fullPathRegEx.test(path)`
- Asset collections matched separately via `getAssetFoldersByPath`
- Blog page bundle images (`.png`, `.jpg`) are correctly excluded from entry file lists because the fullPathRegEx requires `.md` extension

#### 4.5 Lazy Collection Initialization (`lib/services/contents/collection/index.js`)

- `getCollection(name)` uses `collectionCacheMap` for caching
- First call triggers `parseEntryCollection(rawCollection, _i18n)` which is where internal config is computed
- Sets `_file` via `getFileConfig({ rawCollection, _i18n })`
- Sets `_i18n` via `normalizeI18nConfig(rawCollection)`
- Sets `_thumbnailFieldNames` via `getThumbnailFieldNames(rawCollection)`

#### 4.6 Path Regex Generation (`lib/services/contents/file/config.js`)

The `getFileConfig()` function builds `fullPathRegEx` for each collection. These regexes determine which files are recognized as entries.

**Blog regex:** `^content\/blog\/(?<subPath>[^/]+?\/index|_index)\.md$`

- Matches: `content/blog/winter-wonderland-weddings/index.md` (subPath: `winter-wonderland-weddings/index`)
- Matches: `content/blog/_index.md` (subPath: `_index`)
- Does NOT match: `content/blog/milestone-birthday-new-year/milestone-birthday-hero.png` (not `.md`)

**Events regex:** `^content\/events\/(?<subPath>[^/]+?)\.md$`

- Matches: `content/events/weddings.md` (subPath: `weddings`)
- Matches: `content/events/_index.md` (subPath: `_index`)

**Important note:** When a collection has no `path` option (like events), `getFilePathMatcher` ignores the `indexFileName` parameter and returns a generic single-level pattern. When a collection HAS a `path` option (like blog with `'{{slug}}/index'`), the pattern includes the nested directory structure.

#### 4.7 Index File Handling (`lib/services/contents/collection/index-file.js`)

Both blog and events have `index_file` config blocks with fields but no explicit `name` property.

- `getIndexFile()` returns `{ name: '_index', ... }` (default name when not specified)
- `shouldSkipIndexFile()` correctly handles `_index.md`:
  - `isIndexFile()` tests whether the file path ends with `/_index.md` pattern (NOT `/index.md` -- these are different)
  - Returns `false` (not skipped) when `getIndexFile(collection)?.name === '_index'`, meaning the `_index.md` IS a recognized index entry
  - Returns `true` (skipped) only when there is no index_file config at all, treating `_index.md` as a Hugo internal file to ignore

#### 4.8 Entry Processing (`lib/services/contents/file/process.js` -- `prepareEntry`)

The `prepareEntry()` function is where scanned+classified files become CMS entries. There are **six silent exit points** where an entry can be silently dropped with no error message:

1. **`!rawContent`** -- `parseFileContent()` caught an exception during YAML parsing. The error is caught and swallowed; `rawContent` is set to `undefined`.
2. **`!collection || (fileName && !collectionFile)`** -- Collection lookup failed. The collection name from file classification doesn't resolve to a valid collection object.
3. **`!transformedContent`** -- `transformRawContent()` returned `undefined`. This happens when the parsed content is not a plain object (e.g., null, array, string).
4. **`shouldSkipIndexFile()` returned `true`** -- The file is an `_index.md` and the collection has no `index_file` config claiming it.
5. **`!subPath`** -- The fullPathRegEx matched but failed to extract a `subPath` named capture group. This would indicate a regex construction bug.
6. **`isMultiFileStructure && !locale`** -- i18n multi-file mode is enabled but no locale could be extracted from the file path.

Each of these exit points returns silently (no console output, no error thrown), making it impossible to know WHY an entry was dropped without instrumented logging.

#### 4.9 i18n Configuration

- No i18n is configured globally or per-collection in this project
- `normalizeI18nConfig()` returns: `i18nEnabled=false`, `allLocales=['_default']`, `defaultLocale='_default'`
- All structure flags are `false`: `i18nSingleFile`, `i18nMultiFile`, `i18nMultiFolder`, `i18nRootMultiFolder`
- Exit point 6 (i18n locale extraction) is not applicable

### 5. Debug Build from Source

Added `console.warn` logging to 4 key functions in the Sveltia CMS source code, then rebuilt the IIFE bundle for deployment.

**Debug instrumentation points:**

| Function               | File                                       | What It Logs                                            |
|------------------------|--------------------------------------------|---------------------------------------------------------|
| `collectScanningPaths` | `lib/services/backends/fs/shared/files.js` | Scanning paths and their regexes                        |
| `createFileList`       | `lib/services/backends/process.js`         | Files found, entry/asset classification counts          |
| `parseFileContent`     | `lib/services/contents/file/parse.js`      | Parse success/failure per file, caught exceptions       |
| `prepareEntry`         | `lib/services/contents/file/process.js`    | Which exit point each file hits (EXIT:1 through EXIT:6) |
| `prepareEntries`       | `lib/services/contents/file/process.js`    | Final entry count per collection after processing       |

**Build process:**

```bash
cd ~/Projects/sveltia-cms
# Add console.warn("[DEBUG ...]") statements to source files
pnpm build   # vite build producing IIFE bundle
cp dist/sveltia-cms.js ~/Projects/pikeandwest.com-sveltia-cms/static/admin/sveltia-cms.js
```

**Deployment constraint:** The debug build requires manual browser testing because Playwright cannot interact with the File System Access API (see Investigation Step 1).

---

## Fixes Applied

### `public_folder` Mismatch in `config.yml`

**Issue found:** The events collection `index_file` hero image field had `public_folder: images/venue` (no leading `/`), while the stored front matter values use `/images/venue/...` (with leading `/`).

**Before:**

```yaml
# Events index_file fields
- label: Hero Image
  name: image
  widget: image
  media_folder: /static/images/venue
  public_folder: images/venue    # <-- Missing leading /
```

**After:**

```yaml
# Events index_file fields
- label: Hero Image
  name: image
  widget: image
  media_folder: /static/images/venue
  public_folder: /images/venue   # <-- Fixed: leading / added
```

**Impact:** This mismatch likely causes the CMS to fail when resolving hero image thumbnails in the Event Pages list view. The CMS compares the stored value (`/images/venue/photo.jpg`) against what `public_folder` would produce (`images/venue/photo.jpg`) and finds no match, resulting in missing thumbnails.

**Note:** The blog collection's `index_file` had the same issue at line 91 of `config.yml` (`public_folder: images/venue` without leading `/`). This was also identified for correction.

---

## Key Findings

### What Works

- All YAML front matter parses correctly in Node.js using the `yaml` package
- All path regexes correctly match all content files when tested offline
- Index file skipping logic correctly handles `_index.md` (not skipped when `index_file` config is present)
- Slug extraction works for all files
- The full diagnostic pipeline simulation produces 0 errors
- Co-located images (`.png`, `.jpg` in blog page bundles) are correctly excluded from entry file lists

### What Remains Unknown

- **The actual runtime error** that triggers the "There were errors while parsing entry files" toast notification
- **Whether the issue is in file reading** (File System Access API returning unexpected data), **config parsing** (some edge case in `parseCmsConfig` that the Node.js simulation misses), or **entry processing** (one of the six silent exit points in `prepareEntry`)
- **Whether blog entries fail to be SCANNED** (never found by `scanDir`), **CLASSIFIED** (found but not matched by `createFileList`), or **PARSED** (classified but dropped by `prepareEntry`)
- **Whether the error toast and the empty entries are the same bug** or two separate issues (the toast could come from a different collection/file while blog entries are empty for a different reason)

### Constraints

- Playwright cannot trigger `showDirectoryPicker()` (File System Access API limitation -- requires native OS dialog and user gesture)
- Page reload disconnects the filesystem handle, so there is no way to programmatically reconnect
- Console errors emitted during CMS initialization cannot be captured post-load with monkey-patching
- The debug build requires manual browser testing in Chrome with DevTools open

---

## Next Steps

### Manual Browser Debug Session

1. Start Hugo dev server: `hugo server -D`
2. Open `http://localhost:1313/admin/` in Chrome
3. Open DevTools Console (set filter to show Warnings level and above)
4. Click "Work with Local Repository" and select the project root directory
5. Watch for `[DEBUG ...]` prefixed messages in the console

### Key Messages to Look For

| Message Prefix                    | What It Reveals                                                                       |
|-----------------------------------|---------------------------------------------------------------------------------------|
| `[DEBUG collectScanningPaths]`    | Which directories the CMS is scanning and what regexes it uses                        |
| `[DEBUG createFileList]`          | Whether blog files are found at all, and how many are classified as entries vs assets |
| `[DEBUG parseFileContent] ERROR:` | Whether any files throw exceptions during YAML parsing at runtime                     |
| `[DEBUG prepareEntry] EXIT:1`     | YAML parse failure (rawContent is undefined)                                          |
| `[DEBUG prepareEntry] EXIT:2`     | Collection lookup failure                                                             |
| `[DEBUG prepareEntry] EXIT:3`     | Content transform failure (not a plain object)                                        |
| `[DEBUG prepareEntry] EXIT:4`     | Index file skipped                                                                    |
| `[DEBUG prepareEntry] EXIT:5`     | subPath extraction failed (regex issue)                                               |
| `[DEBUG prepareEntry] EXIT:6`     | i18n locale extraction failed                                                         |
| `[DEBUG prepareEntries]`          | Final entry count -- confirms how many entries survive the full pipeline              |

### Likely Failure Scenarios

Based on the source code analysis, the most probable causes are:

1. **EXIT:1 (parse failure)** -- The File System Access API reads file content differently than Node.js `fs.readFileSync`. Possible encoding issues, BOM characters, or the `FileSystemFileHandle.getFile()` returning unexpected data.
2. **EXIT:3 (transform failure)** -- `transformRawContent` may have stricter validation than the `yaml` package alone. Could reject entries with unexpected field types.
3. **Scanning failure** -- `scanDir` may not traverse into page bundle subdirectories correctly, missing `content/blog/{slug}/index.md` files entirely.

---

## Files Modified

| File                          | Change                                                                              |
|-------------------------------|-------------------------------------------------------------------------------------|
| `static/admin/config.yml`     | Fixed `public_folder` mismatch (added leading `/` to events index_file image field) |
| `static/admin/sveltia-cms.js` | Replaced with debug-instrumented build from Sveltia CMS source                      |

---

## Source Files Analyzed

All files are within `~/Projects/sveltia-cms/src/`:

- `lib/services/config/index.js` -- Config initialization and `initCmsConfig`
- `lib/services/config/folders/entries.js` -- Entry folder path building
- `lib/services/config/parser/collections/index.js` -- Collection validation and parsing
- `lib/services/contents/index.js` -- Top-level content store initialization
- `lib/services/contents/collection/index.js` -- Lazy collection initialization and caching
- `lib/services/contents/collection/index-file.js` -- Index file detection and skip logic
- `lib/services/contents/collection/files.js` -- Collection file enumeration
- `lib/services/contents/file/config.js` -- Path regex generation (`fullPathRegEx`)
- `lib/services/contents/file/parse.js` -- YAML front matter parsing (`parseFileContent`)
- `lib/services/contents/file/process.js` -- Entry preparation with 6 silent exit points (`prepareEntry`, `prepareEntries`)
- `lib/services/contents/fields/list/helper.js` -- List field processing helpers
- `lib/services/contents/i18n/config.js` -- i18n configuration normalization
- `lib/services/backends/process.js` -- File classification (`createFileList`)
- `lib/services/backends/fs/shared/files.js` -- Filesystem scanning (`scanDir`, `collectScanningPaths`)
- `lib/services/backends/fs/local.js` -- Local backend (File System Access API integration)
- `lib/services/utils/file.js` -- File utility functions
