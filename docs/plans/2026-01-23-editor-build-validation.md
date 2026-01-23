# Editor Build Validation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a build validation step to editor agents that verifies Hugo builds successfully after edits, with auto-fix for common errors.

**Architecture:** Add Bash tool access to blog-editor, then add a "Step 5: Verify Build" section to both blog-editor and page-editor agents. This step runs `hugo`, parses any errors, attempts to fix common issues (unclosed shortcodes, YAML errors), and reports failures clearly.

**Tech Stack:** Claude Code agents (markdown), Hugo CLI, Bash

---

## Task 1: Add Bash to blog-editor allowed-tools

**Files:**

- Modify: `.claude/agents/blog-editor.md:12-17`

**Step 1: Add Bash to the allowed-tools list**

Change:

```yaml
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
```

To:

```yaml
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
```

**Step 2: Verify the change**

Run: `grep -A6 "allowed-tools:" .claude/agents/blog-editor.md`

Expected output should include `- Bash`

**Step 3: Commit**

```bash
git add .claude/agents/blog-editor.md
git commit -m "feat(blog-editor): add Bash tool for build validation"
```

---

## Task 2: Add Verify Build section to blog-editor

**Files:**

- Modify: `.claude/agents/blog-editor.md` (insert after line ~280, after Step 4: Validate)

**Step 1: Insert the new section**

After the "Step 4: Validate" section (ends around line 280 with the checklist), before the "Brand Voice Guidelines" section, insert:

````markdown
### Step 5: Verify Build

After completing all edits, verify the site still renders correctly.

**Run Hugo:**

```bash
hugo 2>&1
````

**If build succeeds (exit code 0):** Continue to Content Index Updates.

**If build fails:** Parse the error and attempt to fix.

#### Common Fixable Errors

| Error Contains                | Likely Cause                | Fix                                                     |
|-------------------------------|-----------------------------|---------------------------------------------------------|
| `failed to extract shortcode` | Unclosed shortcode          | Find and add closing tag: `{{</* /shortcode-name */>}}` |
| `shortcode "xyz" not found`   | Typo in shortcode name      | Check against valid shortcodes listed above             |
| `front matter: yaml:`         | Invalid YAML syntax         | Fix quotes, colons, or indentation in front matter      |
| `duplicate key`               | Repeated front matter field | Remove the duplicate field                              |

#### Fix Attempt Process

1. **Identify the file and line** from the error message
2. **Read that section** of the file to understand the context
3. **Apply the fix** based on the pattern table above
4. **Run `hugo` again** to verify the fix worked

**If fix succeeds:** Log "Auto-fixed: [description]" and continue.

**If fix fails or error is not in the table:**

- Report the full error message to the user
- Mark the task as **incomplete**
- Do NOT update the content index for this file
- Say: "The build is failing. Please review the error and fix manually, or run `hugo` to see full details."

**Important:** Only attempt ONE fix per error. Do not loop.

---

````text

**Step 2: Verify the section was added**

Run: `grep -n "Step 5: Verify Build" .claude/agents/blog-editor.md`

Expected: Shows line number where section was added

**Step 3: Verify Hugo command is present**

Run: `grep -n "hugo 2>&1" .claude/agents/blog-editor.md`

Expected: Shows line number within the new section

**Step 4: Commit**

```bash
git add .claude/agents/blog-editor.md
git commit -m "feat(blog-editor): add build validation step with auto-fix"
````

---

## Task 3: Add Verify Build section to page-editor

**Files:**

- Modify: `.claude/agents/page-editor.md` (insert before "Content Index Updates" section, around line 85)

**Step 1: Insert the new section**

Before the "## Content Index Updates" section (line 86), insert:

````markdown
## Verify Build

After completing all edits, verify the site still renders correctly.

**Run Hugo:**

```bash
hugo 2>&1
````

**If build succeeds (exit code 0):** Continue to Content Index Updates.

**If build fails:** Parse the error and attempt to fix.

### Common Fixable Errors

| Error Contains                | Likely Cause                | Fix                                 |
|-------------------------------|-----------------------------|-------------------------------------|
| `failed to extract shortcode` | Unclosed shortcode          | Find and add closing tag            |
| `shortcode "xyz" not found`   | Typo in shortcode name      | Check against valid Hugo shortcodes |
| `front matter: yaml:`         | Invalid YAML syntax         | Fix quotes, colons, or indentation  |
| `duplicate key`               | Repeated front matter field | Remove the duplicate                |

### Fix Attempt Process

1. **Identify the file and line** from the error message
2. **Read that section** of the file
3. **Apply the fix** based on the pattern table
4. **Run `hugo` again** to verify

**If fix succeeds:** Log "Auto-fixed: [description]" and continue.

**If fix fails or error is not fixable:**

- Report the full error message
- Mark the task as **incomplete**
- Do NOT update the content index
- Say: "The build is failing. Please review the error."

**Important:** Only ONE fix attempt. Do not loop.

---

````text

**Step 2: Remove redundant checklist item**

In the Quality Checklist section (around line 126), the item `- [ ] **Hugo build passes** (`hugo --quiet` exits without errors)` is now covered by the dedicated section. Keep it as a reminder but simplify:

Change:
```markdown
- [ ] **Hugo build passes** (`hugo --quiet` exits without errors)
````

To:

```markdown
- [ ] Hugo build verified (Step: Verify Build)
```

**Step 3: Verify the section was added**

Run: `grep -n "Verify Build" .claude/agents/page-editor.md`

Expected: Shows line numbers for section header and checklist reference

**Step 4: Commit**

```bash
git add .claude/agents/page-editor.md
git commit -m "feat(page-editor): add detailed build validation section"
```

---

## Task 4: Test the validation flow

**Files:**

- Read: `.claude/agents/blog-editor.md`
- Read: `.claude/agents/page-editor.md`

**Step 1: Verify blog-editor structure**

Run: `grep -n "^### Step\|^## " .claude/agents/blog-editor.md | head -20`

Expected: Shows Step 1 through Step 5, then Brand Voice Guidelines, then Content Index Updates

**Step 2: Verify page-editor structure**

Run: `grep -n "^## " .claude/agents/page-editor.md`

Expected: Shows sections in order: ...SEO Requirements, Verify Build, Content Index Updates, Quality Checklist

**Step 3: Manual validation - create a broken file and verify Hugo fails**

Create a test file with an unclosed shortcode:

```bash
echo '---
title: "Test"
---
{{< tip >}}
Unclosed shortcode
' > content/blog/test-broken.md
```

Run: `hugo 2>&1 | grep -i "error\|failed"`

Expected: Error message about unclosed shortcode or extraction failure

**Step 4: Clean up test file**

```bash
rm content/blog/test-broken.md
```

**Step 5: Verify Hugo builds cleanly**

Run: `hugo 2>&1 | tail -5`

Expected: Build succeeds, shows page count

**Step 6: Final commit**

```bash
git log --oneline -3
```

Expected: Shows 3 commits for this feature

---

## Summary

| Task | Description                             | Commit                                                       |
|------|-----------------------------------------|--------------------------------------------------------------|
| 1    | Add Bash to blog-editor allowed-tools   | `feat(blog-editor): add Bash tool for build validation`      |
| 2    | Add Verify Build section to blog-editor | `feat(blog-editor): add build validation step with auto-fix` |
| 3    | Add Verify Build section to page-editor | `feat(page-editor): add detailed build validation section`   |
| 4    | Test the validation flow                | (no commit, verification only)                               |

**Total: 4 tasks, 3 commits**
