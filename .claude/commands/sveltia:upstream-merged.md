---
description: Clean up after Sveltia CMS PR is merged or fix is released upstream
allowed-tools: Bash, Read, Edit, Write, Glob
---

Clean up local patched builds and branches after your Sveltia CMS contribution
is merged upstream or the fix is included in a new release.

**Arguments:** Optional PR number (e.g., `/sveltia:upstream-merged 607`). If not
provided, will auto-detect merged PRs.

## Step 1: Identify What Was Merged

### If PR number provided

```bash
gh pr view <PR_NUMBER> --repo sveltia/sveltia-cms \
  --json state,mergedAt,title,headRefName \
  | jq -r '"PR #\(.title)\nState: \(.state)\nMerged: \(.mergedAt // "NOT MERGED")\nBranch: \(.headRefName)"'
```

### If auto-detecting

```bash
# Find recently merged PRs
gh pr list --repo sveltia/sveltia-cms --author cneller --state merged --limit 5 \
  --json number,title,mergedAt,headRefName \
  | jq -r '.[] | "PR #\(.number): \(.title)\n  Merged: \(.mergedAt)\n  Branch: \(.headRefName)\n"'
```

**Identify the branch name** from the merged PR for cleanup in Step 4.

## Step 2: Verify Fix Is In a Release

**CRITICAL:** The CDN won't have the fix until it's in a release. Check this first.

```bash
# Get latest release info
gh release view --repo sveltia/sveltia-cms \
  --json tagName,publishedAt,body \
  | jq -r '"Release: \(.tagName)\nPublished: \(.publishedAt)\n\nNotes:\n\(.body)"'
```

**Check if PR is mentioned in release notes** or if the release was published
after the PR merge date.

```bash
# Compare dates
echo "=== Timeline Check ==="
gh pr view <PR_NUMBER> --repo sveltia/sveltia-cms --json mergedAt | jq -r '.mergedAt'
gh release view --repo sveltia/sveltia-cms --json publishedAt | jq -r '.publishedAt'
```

**STOP HERE if the fix is not yet in a release.** Inform the user:

> The PR was merged but not yet released. Continue using the patched build until
> a new version is published. Run `/sveltia:pr-status` periodically to check.

## Step 3: Update Pike & West to Use CDN

```bash
cd ~/Projects/pikeandwest.com
```

### Check current state

```bash
# Is there a local patched build?
if [ -f static/admin/sveltia-cms.js ]; then
  echo "Local patched build exists - will be removed"
  ls -la static/admin/sveltia-cms.js
else
  echo "Already using CDN - no local build to remove"
fi

# Current script tag
echo ""
echo "Current index.html script reference:"
grep -n "sveltia-cms" static/admin/index.html
```

### Update index.html

Edit `static/admin/index.html` to use the CDN version.

**Replace:**

```html
<script src="/admin/sveltia-cms.js" type="module"></script>
```

**With:**

```html
<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script>
```

**Also remove** any comments mentioning "TEMP", "patched build", or "local build".

## Step 4: Delete Local Patched Build

```bash
cd ~/Projects/pikeandwest.com

# Remove the patched build file
rm -f static/admin/sveltia-cms.js

# Verify it's gone
ls static/admin/
```

## Step 5: Clean Up Feature Branch

```bash
cd ~/Projects/sveltia-cms

# Show current branches
git branch -vv | grep -E "(fix/|main)"

# The branch name from Step 1 (e.g., fix/asset-picker-shared-media-folder)
BRANCH_NAME="fix/<name-from-step-1>"

# Switch to main first
git checkout main

# Delete local branch (use -D if not fully merged)
git branch -d $BRANCH_NAME

# Delete remote branch on your fork
git push origin --delete $BRANCH_NAME

# Update main to match upstream
git fetch upstream
git merge --ff-only upstream/main
git push origin main

# Verify clean state
git branch -vv
```

## Step 6: Verify CMS Still Works

```bash
cd ~/Projects/pikeandwest.com

# Start Hugo dev server in background
hugo server &
HUGO_PID=$!
sleep 3

echo "Hugo server running at http://localhost:1313"
echo "Opening CMS admin..."
open http://localhost:1313/admin/
```

**Manual verification checklist:**

- [ ] CMS loads without console errors
- [ ] Can log in / access content
- [ ] Can browse assets (Field Assets tab shows images)
- [ ] The original bug that prompted the fix is resolved
- [ ] No regressions in other CMS functionality

```bash
# Stop Hugo server when done
kill $HUGO_PID 2>/dev/null
```

## Step 7: Commit the Cleanup

```bash
cd ~/Projects/pikeandwest.com

# Stage the changes
git add static/admin/index.html
git add -u static/admin/  # catches deleted files

# Check what will be committed
git status

# Get the version for the commit message
VERSION=$(gh release view --repo sveltia/sveltia-cms --json tagName -q '.tagName')

# Commit
git commit -m "chore: switch to upstream Sveltia CMS $VERSION

Removes patched local build now that fix is in upstream release.
Related: sveltia/sveltia-cms#<PR_NUMBER>"
```

## Step 8: Clean Up Documentation (If Any)

Check if there are any local documentation files related to the fix:

```bash
cd ~/Projects/sveltia-cms

# Check for PR documentation files
ls -la PR-*.md 2>/dev/null

# Remove if present (these were for your reference only)
rm -f PR-*.md
```

## Summary Report

Present final status to the user:

```text
## Cleanup Complete

### What Was Done
- [x] Verified fix included in upstream $VERSION
- [x] Updated index.html to use CDN
- [x] Deleted local patched build (static/admin/sveltia-cms.js)
- [x] Cleaned up feature branch: fix/<name>
- [x] Updated fork's main to match upstream
- [x] Verified CMS functionality
- [x] Committed changes to Pike & West

### Current State
- Pike & West: Using official Sveltia CMS $VERSION via CDN
- Your fork: Clean, synced with upstream
- Open submissions: <N PRs, M issues remaining>

### Next Steps
- Push the commit if ready: `git push`
- Monitor any remaining open submissions with `/sveltia:pr-status`
```
