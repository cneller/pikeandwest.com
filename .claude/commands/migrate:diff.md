---
description: Run BackstopJS visual regression test and analyze results
allowed-tools: Bash, Read, Glob, Grep
---

Run visual regression comparison between Hugo (localhost:1313) and Webflow (pikeandwest.com).

## Step 1: Verify Hugo Dev Server

Check if Hugo dev server is running:
!`curl -s -o /dev/null -w "%{http_code}" http://localhost:1313 || echo "NOT_RUNNING"`

If not running, inform user to start with `hugo server`.

## Step 2: Run BackstopJS Test

Execute visual regression test:
!`cd /Users/colinneller/Projects/pikeandwest.com && npx backstop test 2>&1 | tail -50`

## Step 3: Analyze Results

Read the latest test results:

- Check `backstop_data/html_report/` for report files
- Parse mismatch percentages for each scenario
- Identify which sections have highest mismatch

## Step 4: Summarize Findings

Present results in format:

| Scenario | Viewport | Mismatch % | Status    |
|----------|----------|------------|-----------|
| ...      | ...      | ...        | PASS/FAIL |

## Step 5: Prioritize Fixes

Based on results:

1. List sections with highest mismatch first
2. Reference relevant SCSS files for each section
3. Suggest checking `docs/webflow-to-hugo-css-mapping.md` for known issues

## Step 6: Offer Next Steps

Ask user if they want to:

- Deep-dive on a specific section with `/migrate:compare [section]`
- Update the CSS mapping document with `/migrate:mapping`
- Open the BackstopJS HTML report in browser
