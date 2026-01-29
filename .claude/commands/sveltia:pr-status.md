---
description: Check status of Sveltia CMS contributions and suggest next actions
allowed-tools: Bash, Read, WebFetch
---

Check the status of your open Sveltia CMS contributions and get recommended actions.

## What This Command Does

1. Lists your open PRs and issues on sveltia/sveltia-cms
2. Checks if any were recently merged or closed
3. Compares your patched build version against latest release
4. Identifies if your fixes are now in upstream
5. Detects version drift (upstream moved ahead of your patch base)
6. Suggests next actions based on current state

## Step 1: Check Your Open Submissions

```bash
# Your open PRs
gh pr list --repo sveltia/sveltia-cms --author cneller --state open \
  --json number,title,createdAt,updatedAt \
  | jq -r '.[] | "PR #\(.number): \(.title)\n  Created: \(.createdAt)\n  Updated: \(.updatedAt)\n"'

# Your open issues
gh issue list --repo sveltia/sveltia-cms --author cneller --state open \
  --json number,title,createdAt,updatedAt \
  | jq -r '.[] | "Issue #\(.number): \(.title)\n  Created: \(.createdAt)\n  Updated: \(.updatedAt)\n"'

# Recently merged PRs (last 60 days)
gh pr list --repo sveltia/sveltia-cms --author cneller --state merged --limit 5 \
  --json number,title,mergedAt \
  | jq -r '.[] | "PR #\(.number): \(.title) - Merged: \(.mergedAt)"'

# Recently closed issues
gh issue list --repo sveltia/sveltia-cms --author cneller --state closed --limit 5 \
  --json number,title,closedAt \
  | jq -r '.[] | "Issue #\(.number): \(.title) - Closed: \(.closedAt)"'
```

## Step 2: Check Version Status

```bash
cd ~/Projects/pikeandwest.com

# Check if using local patched build or CDN
if [ -f static/admin/sveltia-cms.js ]; then
  echo "Status: Using LOCAL PATCHED BUILD"
  # Try to extract version from the build
  grep -o '"version":"[^"]*"' static/admin/sveltia-cms.js | head -1 || echo "Version not found in build"
else
  echo "Status: Using CDN"
  grep "sveltia-cms" static/admin/index.html
fi
```

```bash
# Latest upstream release
gh release view --repo sveltia/sveltia-cms \
  --json tagName,publishedAt,body \
  | jq -r '"Latest Release: \(.tagName)\nPublished: \(.publishedAt)\n\nRelease Notes (excerpt):\n\(.body[0:800])..."'
```

```bash
# Your fork's state
cd ~/Projects/sveltia-cms
echo "=== Your Fork Branches ==="
git fetch upstream 2>/dev/null
git branch -vv | grep -E "(fix/|main)"

echo ""
echo "=== Commits ahead/behind upstream ==="
git rev-list --left-right --count upstream/main...main 2>/dev/null | \
  awk '{print "Behind upstream: "$1", Ahead: "$2}'
```

## Step 3: Detect Version Drift

If using a patched build, check if upstream has moved significantly ahead:

```bash
cd ~/Projects/sveltia-cms

# Get the base commit of your patch branch (if it exists)
PATCH_BRANCH=$(git branch | grep "fix/" | head -1 | tr -d ' *')
if [ -n "$PATCH_BRANCH" ]; then
  echo "Patch branch: $PATCH_BRANCH"

  # Count commits between patch base and upstream main
  PATCH_BASE=$(git merge-base $PATCH_BRANCH upstream/main)
  COMMITS_BEHIND=$(git rev-list --count $PATCH_BASE..upstream/main)

  echo "Commits since patch was created: $COMMITS_BEHIND"

  if [ "$COMMITS_BEHIND" -gt 20 ]; then
    echo "WARNING: Significant version drift detected. Consider rebasing your patch."
  fi
fi
```

## Step 4: Check for Review Comments

For each open PR, check if there are unaddressed review comments:

```bash
# Get review status for open PRs
gh pr list --repo sveltia/sveltia-cms --author cneller --state open --json number | \
  jq -r '.[].number' | while read pr; do
    echo "=== PR #$pr Review Status ==="
    gh pr view $pr --repo sveltia/sveltia-cms --json reviews,comments \
      | jq -r '"Reviews: \(.reviews | length), Comments: \(.comments | length)"'

    # Check for requested changes
    gh pr view $pr --repo sveltia/sveltia-cms --json reviewDecision \
      | jq -r '"Decision: \(.reviewDecision // "PENDING")"'
done
```

## Step 5: Determine Next Actions

Based on findings, provide recommendations:

**IMPORTANT:** Only suggest switching to CDN when ALL of these conditions are met:

1. No open PRs remain
2. No open issues remain
3. All previously merged fixes are included in the latest release

| State                                | Recommendation                                         |
|--------------------------------------|--------------------------------------------------------|
| Has open PRs or issues               | Keep using patched build until all are merged/released |
| All PRs merged AND in latest release | Run `/sveltia:upstream-merged` to switch to CDN        |
| PR open, has review comments         | Address feedback, push updates                         |
| PR open, no activity >2 weeks        | Consider adding a polite bump comment                  |
| Version drift >20 commits            | Rebase patch branch on upstream/main                   |
| Some PRs merged, others still open   | Keep patched build, note which fixes are now upstream  |
| Using CDN, no open submissions       | Nothing to do                                          |

## Step 6: Report Summary

Present a clear summary to the user:

```text
## Sveltia Contribution Status

### Open Submissions
- PR #XXX: <title>
  - Status: <open/review requested/approved>
  - Last activity: <date>
  - Action needed: <yes/no - what>

- Issue #XXX: <title>
  - Status: <open/closed>
  - Last activity: <date>

### Recently Merged/Closed
- PR #XXX: <title> - Merged <date>

### Version Status
- Pike & West: <patched v0.X.X / CDN>
- Upstream latest: v0.X.X (released <date>)
- Version drift: <N commits behind> <WARNING if >20>

### Your Fixes in Upstream
- PR #XXX: <Included in vX.X.X / Not yet released>

### Recommended Actions
<!-- Only suggest /sveltia:upstream-merged when ALL open PRs/issues are merged AND released -->
1. <Most important action>
2. <Secondary action if any>

### Ready to Switch to CDN?
- [ ] No open PRs
- [ ] No open issues
- [ ] All merged fixes included in latest release
<!-- If all boxes checked: "Run /sveltia:upstream-merged to clean up and switch to CDN" -->
<!-- Otherwise: "Keep using patched build until all contributions are upstream" -->
```
