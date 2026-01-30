---
description: Check status of Sveltia CMS contributions and suggest next actions
allowed-tools: Bash, Read
---

Check the status of your open Sveltia CMS contributions and get recommended actions.

## Instructions

Run the commands below in order, then present results using the report template.

### 1. Fetch GitHub Data (Single GraphQL Query)

```bash
gh api graphql -f query='{
  repository(owner: "sveltia", name: "sveltia-cms") {
    latestRelease { tagName publishedAt description }
    releases(first: 5, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes { tagName publishedAt description }
    }
  }
  openPRs: search(query: "repo:sveltia/sveltia-cms author:cneller is:pr is:open", type: ISSUE, first: 10) {
    nodes { ... on PullRequest { number title createdAt updatedAt url reviewDecision comments { totalCount } } }
  }
  mergedPRs: search(query: "repo:sveltia/sveltia-cms author:cneller is:pr is:merged", type: ISSUE, first: 5) {
    nodes { ... on PullRequest { number title mergedAt url } }
  }
  openIssues: search(query: "repo:sveltia/sveltia-cms author:cneller is:issue is:open", type: ISSUE, first: 10) {
    nodes { ... on Issue { number title createdAt updatedAt url } }
  }
  closedIssues: search(query: "repo:sveltia/sveltia-cms author:cneller is:issue is:closed", type: ISSUE, first: 5) {
    nodes { ... on Issue { number title closedAt url } }
  }
}'
```

### 2. Check Local Build Status

```bash
if [ -f static/admin/sveltia-cms.js ]; then
  echo "LOCAL PATCHED BUILD"
  grep -o '"version":"[^"]*"' static/admin/sveltia-cms.js | head -1 | cut -d'"' -f4
else
  echo "CDN"
  grep -oE 'sveltia-cms@[^/"]+' static/admin/index.html | head -1
fi
```

### 3. Check Fork State (only if patched build exists)

```bash
if [ -d ~/Projects/sveltia-cms ]; then
  cd ~/Projects/sveltia-cms
  git fetch upstream 2>/dev/null
  echo "=== Branches ==="
  git branch -vv 2>/dev/null | grep -E "(fix/|main)" || echo "No fix branches"
  echo ""
  echo "=== Upstream Drift ==="
  git rev-list --left-right --count upstream/main...main 2>/dev/null | awk '{print "Behind: "$1", Ahead: "$2}' || echo "Could not determine"
fi
```

## Report Template

Present findings in this format:

```text
## Sveltia Contribution Status

### Open Submissions
[List open PRs and issues with status, last activity, and any needed action]

### Recently Merged/Closed
[List merged PRs and closed issues with dates]

### Version Status
- Pike & West: [LOCAL v0.X.X or CDN]
- Upstream latest: vX.X.X (released YYYY-MM-DD)

### Your Fixes in Upstream
[For each merged PR, check if it appears in a release description]

### Ready to Switch to CDN?
- [ ] No open PRs
- [ ] No open issues
- [ ] All merged fixes included in latest release

[If all checked: "Run /sveltia:upstream-merged to clean up"]
[Otherwise: "Keep patched build until contributions are upstream"]
```

## Decision Logic

| Condition                            | Action                         |
|--------------------------------------|--------------------------------|
| Has open PRs or issues               | Keep patched build             |
| All PRs merged AND in latest release | Run `/sveltia:upstream-merged` |
| PR has review comments               | Address feedback               |
| PR stale >2 weeks                    | Bump with polite comment       |
| Using CDN, no submissions            | Nothing to do                  |
