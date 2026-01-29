---
description: Submit a bug fix to Sveltia CMS upstream (issue + PR pattern)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, WebFetch
---

Submit a bug fix or contribution to the Sveltia CMS upstream repository.

## Contribution Policy

Per [CONTRIBUTING.md](https://github.com/sveltia/sveltia-cms/blob/main/CONTRIBUTING.md):

> Pull requests will not be accepted for the time being, except for trivial
> changes such as fixing a typo, style, etc. Please file issues instead.

**Proven pattern:**

1. File an issue describing the bug and root cause
2. Open a PR as reference implementation
3. Update the issue to link to the PR

The maintainer can cherry-pick the fix or accept the PR if they consider it
trivial enough.

## Repository Setup

| Remote     | URL                                      | Purpose       |
|------------|------------------------------------------|---------------|
| `origin`   | `git@github.com:cneller/sveltia-cms.git` | Your fork     |
| `upstream` | `git@github.com:sveltia/sveltia-cms.git` | Official repo |

Local clone: `~/Projects/sveltia-cms`

## Formatting Config (Match Upstream)

The project uses these configs - ensure your editor respects them:

**`.prettierrc.yaml`:**

- `singleQuote: true` (JS), `false` (CSS/YAML)
- `trailingComma: all`
- `printWidth: 100`
- Uses `prettier-plugin-svelte`

**`.editorconfig`:**

- 2 spaces, LF line endings, UTF-8
- Trim trailing whitespace, insert final newline

**Critical:** Only run Prettier on files you're changing. Running it on
unmodified files will reformat them and pollute the diff.

## Step 0: Evaluate Whether to Submit

Before starting, ask: **Is this worth submitting upstream?**

**Good candidates:**

- Bug affects other users (not just your specific config)
- Fix is minimal and focused (1-2 files, <20 lines)
- Root cause is clear and the fix is correct
- Aligns with project direction (check recent issues/PRs for context)

**Poor candidates:**

- Workaround for your specific edge case
- Requires significant refactoring
- Changes behavior others might depend on
- Better solved by a config change on your end

**Ask yourself:**

- Would another user likely hit this bug?
- Is the maintainer likely to agree this is a bug?
- Does the fix introduce any risk of breaking other use cases?

If uncertain, file an issue first (without PR) to gauge interest.

## Step 1: Research Existing Issues and PRs

**Before submitting, verify this bug hasn't already been reported or fixed.**

```bash
# Search for related issues by keywords
gh search issues --repo sveltia/sveltia-cms "<keyword1>" --limit 20 \
  --json number,title,state | jq -r '.[] | "\(.number)\t\(.state)\t\(.title)"'

gh search issues --repo sveltia/sveltia-cms "<keyword2>" --limit 20 \
  --json number,title,state | jq -r '.[] | "\(.number)\t\(.state)\t\(.title)"'

# Search for open PRs that might address this
gh search prs --repo sveltia/sveltia-cms "<keyword>" --state open --limit 10 \
  --json number,title,state | jq -r '.[] | "\(.number)\t\(.state)\t\(.title)"'

# View promising issues in detail
gh issue view <number> --repo sveltia/sveltia-cms --json title,body,state,comments
```

**For each related issue found, determine:**

1. **Is it the same bug?** If yes, don't duplicate - comment on existing issue instead
2. **Was it supposedly fixed?** Check the fix commit to see if our scenario was covered
3. **Is it a different manifestation?** Reference it in your issue as "Related"

**Check the git history for relevant commits:**

```bash
cd ~/Projects/sveltia-cms

# Search for commits related to the affected component
git log --oneline --all --grep="<keyword>" | head -15

# If a "fix" commit exists, examine what it actually fixed
git show <commit-hash> --stat
git show <commit-hash> -p | head -100
```

**Document your findings:**

- List related issues (open and closed)
- Note which ones are duplicates vs. different scenarios
- Identify any commits that attempted to fix similar issues
- Determine if your bug is a regression, gap, or new issue

This research will strengthen your issue by showing you've done due diligence
and helps the maintainer understand how your bug relates to existing work.

## Step 2: Assess Repo State

Before syncing, check the repo state:

```bash
cd ~/Projects/sveltia-cms

# Current branch and uncommitted changes
git status
git branch --show-current

# Check for previous submissions
gh pr list --repo sveltia/sveltia-cms --author cneller --state all --limit 5
gh issue list --repo sveltia/sveltia-cms --author cneller --state all --limit 5
```

If there are uncommitted changes from a previous fix, stash them before proceeding.

## Step 3: Sync Fork with Upstream

```bash
cd ~/Projects/sveltia-cms
git fetch upstream
git stash  # if needed
git checkout main
git merge --ff-only upstream/main
git push origin main

# Verify current version
cat package.json | grep '"version"'
```

Use this version in the issue's Environment section.

## Step 4: Create Feature Branch

Branch naming: `fix/<short-description>`

```bash
git checkout -b fix/<description> main
git stash pop  # if changes were stashed in Step 2
```

## Step 5: Make the Fix

Guidelines from `.github/copilot-instructions.md`:

- **Package manager:** pnpm only (npm will cause issues)
- **Node version:** v24 (see `.nvmrc`)
- **Style:** Single quotes JS, 100 char line length, trailing commas
- **Tests:** Co-located `*.test.js` files

### Minimalism Rules

**DO:**

- Change only the lines necessary to fix the bug
- Touch 1 file if possible (2-3 max)
- Match the existing code style exactly

**DON'T:**

- Refactor surrounding code
- Add new abstractions (helper functions, utilities) unless essential
- Run formatters on files you didn't change
- "Improve" unrelated code while you're in there

### Tests

**Only add a test if:**

- It's trivially simple (< 20 lines)
- It tests the exact bug scenario
- It doesn't require mocking infrastructure changes

**Skip tests if:**

- They require extracting functions for testability
- They touch multiple test files
- They add significant review burden

The maintainer can add tests themselves if needed.

## Step 6: Verify Quality

```bash
# Lint/format ONLY the changed file(s)
pnpm exec eslint <changed-file>
pnpm exec prettier --check <changed-file>

# Run full test suite
pnpm exec vitest run  # Expect 5162+ passed, 3 skipped
```

## Step 7: Validate Minimal Diff

**STOP: Before committing, validate the diff is minimal.**

Run this validation:

```bash
cd ~/Projects/sveltia-cms

# Check diff stats - should be small
git diff --stat HEAD

# Review the actual diff line by line
git diff HEAD
```

**Validation checklist:**

- [ ] Only 1-2 files changed (3 max with test)
- [ ] Total lines changed < 20 (excluding test)
- [ ] No reformatting of existing code (no whitespace-only changes)
- [ ] No unrelated changes snuck in
- [ ] Diff is readable in < 30 seconds

If the diff includes formatting noise (Prettier rewrapped existing lines),
revert and re-apply your changes more carefully:

```bash
# Revert all changes
git checkout -- .

# Re-apply fix manually, editing only the necessary lines
```

## Step 8: Commit and Push

```bash
git add <changed-file>
git commit -m "Fix <description>

<Root cause explanation>

<What the fix does>"

git push -u origin fix/<description>
```

## Step 9: Draft Issue for Review

**STOP: Present the draft issue to the user for review before creating.**

Draft the issue content using this template, then show it to the user:

```markdown
## Bug: <Title>

### Describe the bug

<Clear description of the problem>

### Steps to reproduce

1. <Step 1>
2. <Step 2>
3. <Observe issue>

### Expected behavior

<What should happen>

### Root cause

<Technical explanation of why it happens>

### Suggested fix

<Code snippet or description>

### Environment

- Sveltia CMS version: <version>
- SSG: Hugo
- Config: <relevant config details>

### Related

<List related issues/PRs/commits from Step 1 research. Examples:>
- #XXX - <brief description of relationship>
- Commit abc1234 - <what it attempted to fix>
```

After user approval, create the issue:

```bash
gh issue create \
  --repo sveltia/sveltia-cms \
  --title "<title>" \
  --body "<approved body>"
```

Note the issue number for the next step.

## Step 10: Draft PR for Review

**STOP: Present the draft PR description to the user for review before creating.**

Draft the PR content using this template, then show it to the user:

```markdown
## Summary

<1-2 bullet points>

## Details

Addresses issue #<issue-number>.

<Brief root cause explanation if not fully covered in issue>

## Test plan

- [ ] All existing tests pass
- [ ] ESLint clean
- [ ] Prettier clean
- [ ] Manual testing confirms fix
```

After user approval, create the PR:

```bash
gh pr create \
  --repo sveltia/sveltia-cms \
  --title "Fix <short description>" \
  --body "<approved body>"
```

Note the PR number for the next step.

## Step 11: Update Issue with PR Reference

Edit the issue to add the PR link at the end of the "Suggested fix" section:

```bash
# View current issue body
gh issue view <issue-number> --repo sveltia/sveltia-cms

# Edit to add PR reference (append to body)
gh issue edit <issue-number> --repo sveltia/sveltia-cms \
  --body "<original body>

See PR #<pr-number> for reference implementation."
```

## Updating Pike & West Patched Build

While waiting for upstream merge:

```bash
cd ~/Projects/sveltia-cms
git checkout fix/<branch>
pnpm install
pnpm build
cp package/dist/sveltia-cms.js ~/Projects/pikeandwest.com/static/admin/
```

After upstream merge:

1. Update `static/admin/index.html` to use CDN:

   ```html
   <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
   ```

2. Delete local `static/admin/sveltia-cms.js`
3. Remove "TEMP" comment from index.html
