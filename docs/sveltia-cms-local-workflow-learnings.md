# Sveltia CMS Local Workflow Learnings

> Comprehensive notes from debugging the Sveltia CMS local repository workflow, diagnosing a git worktree incompatibility, and contributing a fix upstream.

**Date:** 2026-01-28
**Related Issue:** [sveltia/sveltia-cms#604](https://github.com/sveltia/sveltia-cms/issues/604)
**Related PR:** [sveltia/sveltia-cms#605](https://github.com/sveltia/sveltia-cms/pull/605)

---

## Table of Contents

- [How the Local Repository Workflow Works](#how-the-local-repository-workflow-works)
- [The `local_backend` Config Option](#the-local_backend-config-option)
- [Browser Compatibility](#browser-compatibility)
- [Resetting File System Access Permissions](#resetting-file-system-access-permissions)
- [Git Worktree Incompatibility](#git-worktree-incompatibility)
- [Diagnosing the TypeMismatchError](#diagnosing-the-typemismatcherror)
- [The Fix](#the-fix)
- [Testing a Patched Build Locally](#testing-a-patched-build-locally)
- [Contributing to Sveltia CMS](#contributing-to-sveltia-cms)
- [Issue and PR Best Practices](#issue-and-pr-best-practices)
- [Key Takeaways](#key-takeaways)

---

## How the Local Repository Workflow Works

Sveltia CMS does **not** use a proxy server like Decap CMS (`decap-server` or `netlify-cms-proxy-server`). Instead, it uses the browser's **File System Access API** to read and write files directly on disk.

### The Flow

1. Run your local dev server (e.g., `hugo server -D`)
2. Open `http://localhost:<port>/admin/` in Chrome or Edge
3. Click "Work with Local Repository"
4. The browser's native directory picker appears
5. Select the project root directory (must contain `.git`)
6. Sveltia CMS validates the selection by checking for `.git`
7. If valid, the directory handle is cached in **IndexedDB** for future sessions
8. Files are read/written directly through the browser API

### What It Does NOT Do

- No Git operations (no commit, push, pull, fetch)
- No live reload after saving (manual browser refresh needed)
- No proxy server communication
- No background syncing with remote

You must use a separate Git client for all version control operations.

### Relevant Source Code

The core logic lives in:

- `src/lib/services/backends/fs/local.js` -- `getRootDirHandle()` function
- `src/lib/services/user/auth.js` -- `signInManually()` and `logError()` functions
- `src/lib/components/entrance/sign-in.svelte` -- UI button and environment checks

---

## The `local_backend` Config Option

**Sveltia CMS ignores the `local_backend` config option entirely.** This is a Decap/Netlify CMS concept that configured the proxy server connection.

- If you have `local_backend: true` in your config from a Decap CMS migration, it's harmless but unnecessary -- remove it
- No configuration is needed for local development in Sveltia CMS
- The local workflow is detected automatically when running on `localhost` or `127.0.0.1`

---

## Browser Compatibility

The File System Access API is only available in Chromium-based browsers:

| Browser       | Supported | Notes                                    |
|---------------|-----------|------------------------------------------|
| Chrome        | Yes       | Full support                             |
| Edge          | Yes       | Full support                             |
| Brave         | Partial   | Sveltia shows a warning; may have issues |
| Firefox       | No        | API not implemented                      |
| Safari        | No        | API not implemented                      |
| Safari (Test) | Limited   | Test backend only; doesn't save locally  |

The CMS checks for `localhost` context and `showDirectoryPicker` API availability before showing the "Work with Local Repository" button.

---

## Resetting File System Access Permissions

The browser caches the directory handle in IndexedDB. If you select the wrong folder or encounter a stale handle, you need to clear this state.

### Method 1: Chrome DevTools (Preferred)

1. Open DevTools (F12) > **Application** tab
2. Left sidebar > **Storage**
3. Click **"Clear site data"**
4. Reload the page

### Method 2: Site Settings

1. Click the lock/tune icon in the address bar
2. Look for "File editing" or file system permission
3. Reset to "Ask"
4. Reload the page

### Method 3: Nuclear Option

1. Navigate to `chrome://settings/content/all`
2. Find your localhost entry
3. Click "Delete data"
4. This removes all stored data for that origin

### Why the Handle Gets Stuck

The `FileSystemDirectoryHandle` is persisted in IndexedDB (key: `root_dir_handle`). When the selected directory is later moved, renamed, or the handle becomes invalid, the CMS tries to use the stale handle before falling back to the picker. If the handle validation itself throws an unexpected error, the fallback doesn't trigger.

---

## Git Worktree Incompatibility

### The Problem

In a standard Git repository, `.git` is a **directory** containing the repository database. In a **git worktree** (created with `git worktree add`), `.git` is a **file** containing a pointer to the main repository:

```text
gitdir: /path/to/main/repo/.git/worktrees/<name>
```

Sveltia CMS validates the selected directory by calling:

```javascript
await handle.getDirectoryHandle('.git');
```

This throws a `TypeMismatchError` when `.git` exists but is a file, because `getDirectoryHandle()` expects a directory entry. The error is not handled by the auth error handler, which only catches `NotFoundError` and `AbortError`.

### How to Identify a Worktree

```bash
# In the project root, check if .git is a file or directory:
ls -la .git

# File (worktree):
# -rw-r--r--  1 user  95 Jan 24 09:30 .git

# Directory (standard repo):
# drwxr-xr-x  15 user  480 Jan 28 10:00 .git

# If it's a file, view the pointer:
cat .git
# gitdir: /path/to/main/repo/.git/worktrees/<name>
```

### Workaround

Until the fix is merged upstream, use one of:

1. **Use the main repository** -- open the admin against the main repo directory (not the worktree), checking out the desired branch there
2. **Use a standalone clone** instead of a worktree, so `.git` is a real directory
3. **Use a patched local build** -- see [Testing a Patched Build Locally](#testing-a-patched-build-locally)

---

## Diagnosing the TypeMismatchError

### Console Error

```csharp
TypeMismatchError: The path supplied exists, but was not an entry of requested type. undefined
    overrideMethod @ installHook.js:1
    iv             @ auth.js:69
    j0             @ auth.js:253
    await in j0
    onclick        @ sign-in.svelte:62
```

### What the Error Means

The File System Access API throws `TypeMismatchError` in two scenarios:

| Call                       | Expected | Found | Result            |
|----------------------------|----------|-------|-------------------|
| `getDirectoryHandle(name)` | Dir      | File  | TypeMismatchError |
| `getFileHandle(name)`      | File     | Dir   | TypeMismatchError |

In our case, `getDirectoryHandle('.git')` found a file (the worktree pointer), not a directory.

### Error Handler Gap

The error handler in `auth.js:51-65` only catches:

- `NotFoundError` -- shows "not a repository root directory"
- `AbortError` -- shows "picker was dismissed"

`TypeMismatchError` falls through to the generic "unexpected error" message, giving no useful feedback to the user.

---

## The Fix

### Code Change

File: `src/lib/services/backends/fs/local.js`, lines 95-97

**Before:**

```javascript
if (handle) {
  // This will throw `NotFoundError` when it's not a project root directory
  await handle.getDirectoryHandle('.git');
  // If it looks fine, cache the directory handle
  await rootDirHandleDB?.set(ROOT_DIR_HANDLE_KEY, handle);
}
```

**After:**

```javascript
if (handle) {
  // Verify this is a project root by checking for `.git`. In a standard repository, `.git` is
  // a directory. In a git worktree, `.git` is a file containing a `gitdir:` pointer to the
  // main repository. Both are valid repository roots.
  try {
    await handle.getDirectoryHandle('.git');
  } catch (/** @type {any} */ ex) {
    if (ex.name === 'TypeMismatchError') {
      // `.git` exists but is a file (git worktree), which is still a valid repo root
      await handle.getFileHandle('.git');
    } else {
      throw ex;
    }
  }
  // If it looks fine, cache the directory handle
  await rootDirHandleDB?.set(ROOT_DIR_HANDLE_KEY, handle);
}
```

### Behavior Matrix

| Scenario                          | Before                    | After                       |
|-----------------------------------|---------------------------|-----------------------------|
| Standard repo (`.git` dir)        | Works                     | Works (no change)           |
| Worktree (`.git` file)            | Crashes                   | Works                       |
| No `.git` at all                  | NotFoundError             | NotFoundError (no change)   |
| `.git` is something else entirely | TypeMismatchError (crash) | NotFoundError (clean error) |

### Test Results

All 32 existing tests in `local.test.js` pass, including pre-existing worktree test cases. The full suite of 5,162 tests across 195 files passes with zero regressions.

---

## Testing a Patched Build Locally

To test the fix against the Pike & West site before the upstream PR is merged:

### Step 1: Build the Patched CMS

```bash
# Use the correct Node version (Sveltia CMS requires Node 25)
cd ~/Projects/sveltia-cms
nvm use
pnpm install
pnpm build
```

Output: `package/dist/sveltia-cms.js`

### Step 2: Copy to the Hugo Site

```bash
cp ~/Projects/sveltia-cms/package/dist/sveltia-cms.js \
   ~/Projects/pikeandwest.com-sveltia-cms/static/admin/sveltia-cms.js
```

### Step 3: Point the Admin Page at the Local Build

Edit `static/admin/index.html`:

```html
<!-- TEMP: local patched build for worktree testing -->
<script src="/admin/sveltia-cms.js" type="module"></script>
```

Instead of:

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
```

### Step 4: Test

1. Start Hugo: `hugo server -D`
2. Open `http://localhost:1313/admin/` in Chrome
3. Click "Work with Local Repository"
4. Select the worktree root directory
5. Verify it accepts the directory without crashing

### Step 5: Clean Up

After testing, revert the changes:

1. Restore `static/admin/index.html` to use the CDN URL
2. Delete `static/admin/sveltia-cms.js`
3. Do **not** commit these temporary files

---

## Contributing to Sveltia CMS

### Contribution Policy (as of January 2026)

From [CONTRIBUTING.md](https://github.com/sveltia/sveltia-cms/blob/main/CONTRIBUTING.md):

> Pull requests will not be accepted for the time being, except for trivial changes such as fixing a typo, style, etc. Please file issues instead. We plan to create contributor documents after the 2.0 release.

### What This Means

- **File issues** for bugs and feature requests
- **PRs for code changes** are generally not accepted (limited review resources, ongoing codebase upgrades)
- **Trivial PRs** (typos, style fixes) may be accepted
- **Reference implementations** can be submitted as PRs with a note acknowledging the policy
- Contributor documentation is planned after v2.0 (mid-2026)

### How We Handled It

1. Filed issue [#604](https://github.com/sveltia/sveltia-cms/issues/604) with full reproduction steps and root cause analysis
2. Submitted PR [#605](https://github.com/sveltia/sveltia-cms/pull/605) as a reference implementation
3. Added a prominent note at the top of the PR acknowledging their contribution policy
4. Cross-linked the issue and PR (see next section)

---

## Issue and PR Best Practices

### Cross-Linking Issues and PRs

When you file both an issue and a PR for the same problem:

1. **PR body:** Include `Fixes #<issue-number>` -- GitHub auto-links and auto-closes the issue on merge
2. **Issue comment:** Add a comment pointing to the PR as a reference implementation
3. **Commit message:** Include `Fixes #<issue-number>` in the commit message body

### Clean Diffs for OSS Contributions

Linters and formatters can reformat untouched lines, creating noise in your diff. For open source contributions:

- **Only change the lines you need to change** -- don't let auto-formatters rewrite the entire file
- **Use `sed` or manual edits** if your editor's save hooks reformat on save
- **Review the diff before committing** with `git diff` to catch unintended reformatting
- **Single-hunk diffs** are ideal for bug fixes -- they're easier to review and less likely to conflict

In our case, the editor's linter reformatted `REPOSITORY_PROPS`, ternary expressions, and `init()` -- none of which were related to the fix. We reset and applied the change via `sed` to produce a clean single-hunk diff.

### Bug Report Structure

For a good upstream bug report:

1. **Description** -- what the bug is
2. **Steps to Reproduce** -- exact steps to trigger it
3. **Expected Behavior** -- what should happen
4. **Actual Behavior** -- what actually happens (include console errors)
5. **Root Cause** -- if you've identified it, explain the technical cause
6. **Suggested Fix** -- optional but helpful, especially with code
7. **Environment** -- browser, OS, CMS version

---

## Key Takeaways

1. **Sveltia CMS local workflow uses the File System Access API**, not a proxy server. No `local_backend` config needed.

2. **Git worktrees are incompatible** with Sveltia CMS's `.git` directory check. The check uses `getDirectoryHandle('.git')` which throws `TypeMismatchError` when `.git` is a file.

3. **Browser permissions for the File System Access API** are cached in IndexedDB. Clearing site data in DevTools resets them.

4. **Always check CONTRIBUTING.md** before submitting a PR to an open source project. Sveltia CMS explicitly does not accept code PRs during the current phase.

5. **Cross-link issues and PRs** using `Fixes #<number>` in the PR body and a comment on the issue pointing to the PR.

6. **Watch for linter noise** in OSS contributions. Use tools that don't auto-format untouched lines, or apply changes via `sed`/`git` to keep diffs minimal.

7. **Test patched builds locally** by building from source and swapping the CDN URL in `index.html` for a local path. Remember to revert before committing.

8. **File System Access API error types:**
   - `NotFoundError` -- entry doesn't exist
   - `TypeMismatchError` -- entry exists but is wrong type (file vs directory)
   - `AbortError` -- user cancelled the picker
   - `NotAllowedError` -- permission denied
   - `SecurityError` -- CSP or security policy blocking

---

## References

- [Sveltia CMS GitHub](https://github.com/sveltia/sveltia-cms)
- [Sveltia CMS CONTRIBUTING.md](https://github.com/sveltia/sveltia-cms/blob/main/CONTRIBUTING.md)
- [File System Access API -- Chrome Developers](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access)
- [FileSystemDirectoryHandle.getDirectoryHandle() -- MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryHandle/getDirectoryHandle)
- [git-worktree Documentation](https://git-scm.com/docs/git-worktree)
- [Issue #604 -- TypeMismatchError in worktrees](https://github.com/sveltia/sveltia-cms/issues/604)
- [PR #605 -- Fix for worktree support](https://github.com/sveltia/sveltia-cms/pull/605)
- [Issue #384 -- Request for default repo location](https://github.com/sveltia/sveltia-cms/issues/384)
- [Discussion #101 -- WSL2 local repo issues](https://github.com/sveltia/sveltia-cms/discussions/101)
