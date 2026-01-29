# Auto-Trigger Content Editors Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ensure blog-editor and page-editor agents are automatically triggered whenever someone edits or creates content in `content/blog/` or `content/events/` directories.

**Architecture:** Three-layer approach: (1) Improve agent descriptions with comprehensive trigger phrases for semantic matching, (2) Add explicit delegation rules to CLAUDE.md, (3) Add PostToolUse hook that reminds Claude to use content editors when content files are modified directly.

**Tech Stack:** Claude Code agents, hooks (JSON config), shell scripts, CLAUDE.md documentation

---

## Task 1: Improve blog-editor Agent Description

**Files:**

- Modify: `.claude/agents/blog-editor.md:1-18`

**Step 1: Update the description frontmatter**

Replace the current description with a more comprehensive one that includes explicit trigger phrases Claude will match semantically:

```yaml
---
name: blog-editor
description: >
  ALWAYS use this agent for ANY task involving Pike & West blog content.
  Triggers: "write a blog post", "edit blog", "create blog article", "update blog",
  "blog draft", "new blog post", "modify blog content", "review blog", "fix blog",
  any file in content/blog/*.md. Applies magazine-style editorial formatting
  (drop caps, pull quotes, dividers, tip boxes, fact boxes, timelines).
  Ensures brand voice and updates content index after every edit.
model: claude-opus-4-5-20251101
inherits:
  - content-editing
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---
```

**Step 2: Verify the file parses correctly**

Run: `head -20 .claude/agents/blog-editor.md`
Expected: See the updated YAML frontmatter with new description

**Step 3: Commit**

```bash
git add .claude/agents/blog-editor.md
git commit -m "feat: improve blog-editor description for better auto-triggering"
```

---

## Task 2: Improve page-editor Agent Description

**Files:**

- Modify: `.claude/agents/page-editor.md:1-17`

**Step 1: Update the description frontmatter**

Replace the current description with comprehensive trigger phrases:

```yaml
---
name: page-editor
description: >
  ALWAYS use this agent for ANY task involving Pike & West event pages or static pages.
  Triggers: "edit event page", "update events", "create event page", "modify page",
  "fix page content", "update contact page", "edit about page", any file in
  content/events/*.md or content/*.md (except blog). Ensures proper structure,
  SEO optimization, and brand voice. Updates content index after every edit.
model: claude-opus-4-5-20251101
inherits:
  - content-editing
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---
```

**Step 2: Verify the file parses correctly**

Run: `head -20 .claude/agents/page-editor.md`
Expected: See the updated YAML frontmatter with new description

**Step 3: Commit**

```bash
git add .claude/agents/page-editor.md
git commit -m "feat: improve page-editor description for better auto-triggering"
```

---

## Task 3: Add Content Editor Delegation Rules to CLAUDE.md

**Files:**

- Modify: `CLAUDE.md` (add new section after "Blog Editor Agent" section, around line 305)

**Step 1: Add mandatory delegation section**

Insert after the "Blog Editor Agent (Auto-Delegated)" section:

```markdown
## Mandatory Content Agent Delegation

**CRITICAL:** When editing Pike & West content, you MUST delegate to the appropriate agent:

| Content Location          | Required Agent | Trigger                                 |
|---------------------------|----------------|-----------------------------------------|
| `content/blog/*.md`       | `blog-editor`  | Any create, edit, review, or audit task |
| `content/events/*.md`     | `page-editor`  | Any create, edit, or update task        |
| `content/*.md` (non-blog) | `page-editor`  | Any static page modifications           |

**How to delegate:**
1. Use the Task tool with `subagent_type` set to the agent name
2. Provide the file path and task description
3. The agent will handle formatting, brand voice, and content index updates

**DO NOT** edit content files directly without delegating to the appropriate agent.
This ensures consistent editorial quality and proper content index maintenance.
```

**Step 2: Verify the section was added**

Run: `grep -A 15 "Mandatory Content Agent Delegation" CLAUDE.md`
Expected: See the new section with the table

**Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add mandatory content agent delegation rules to CLAUDE.md"
```

---

## Task 4: Create Content Editor Reminder Hook Script

**Files:**

- Create: `.claude/hooks/content-editor-reminder.sh`

**Step 1: Write the hook script**

```bash
#!/bin/bash
# Reminds Claude to use content editors when modifying content files directly
# Called as PostToolUse hook for Edit|Write operations

# Read JSON input from stdin
input=$(cat)

# Extract the file path from tool_input
file_path=$(echo "$input" | jq -r '.tool_input.file_path // empty')

# Exit silently if no file path (shouldn't happen but be safe)
[ -z "$file_path" ] && exit 0

# Check if this is a content file that should use an editor agent
if echo "$file_path" | grep -qE 'content/blog/.*\.md$'; then
  echo "REMINDER: Blog content was modified. For future edits, use the blog-editor agent via Task tool to ensure proper editorial formatting and content index updates." >&2
  exit 0
elif echo "$file_path" | grep -qE 'content/events/.*\.md$'; then
  echo "REMINDER: Event page was modified. For future edits, use the page-editor agent via Task tool to ensure proper formatting and content index updates." >&2
  exit 0
elif echo "$file_path" | grep -qE 'content/[^/]+\.md$'; then
  # Top-level content files (about.md, contact.md, etc.) but not _index.md
  if ! echo "$file_path" | grep -qE '_index\.md$'; then
    echo "REMINDER: Static page was modified. For future edits, use the page-editor agent via Task tool to ensure proper formatting and content index updates." >&2
  fi
  exit 0
fi

exit 0
```

**Step 2: Make the script executable**

Run: `chmod +x .claude/hooks/content-editor-reminder.sh`
Expected: No output, exit code 0

**Step 3: Verify script runs correctly**

Run: `echo '{"tool_input":{"file_path":"content/blog/test.md"}}' | .claude/hooks/content-editor-reminder.sh`
Expected: "REMINDER: Blog content was modified..." on stderr

**Step 4: Commit**

```bash
git add .claude/hooks/content-editor-reminder.sh
git commit -m "feat: add content editor reminder hook script"
```

---

## Task 5: Register the Hook in Project Settings

**Files:**

- Modify: `.claude/settings.json`

**Step 1: Add PostToolUse hook for Edit and Write**

Update the settings to include the new hook:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/pre-commit-docs-check.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/content-editor-reminder.sh"
          }
        ]
      }
    ]
  }
}
```

**Step 2: Validate JSON syntax**

Run: `jq . .claude/settings.json`
Expected: Pretty-printed JSON with no errors

**Step 3: Commit**

```bash
git add .claude/settings.json
git commit -m "feat: register content editor reminder hook"
```

---

## Task 6: Test the Complete System

**Files:**

- None (testing only)

**Step 1: Test blog-editor auto-triggering**

In a new Claude session, ask: "Help me write a new blog post about spring weddings"

Expected: Claude should recognize this matches the blog-editor description and delegate to the agent

**Step 2: Test page-editor auto-triggering**

Ask: "Update the birthday parties event page"

Expected: Claude should recognize this matches the page-editor description and delegate to the agent

**Step 3: Test reminder hook**

If Claude directly edits a content file without using an agent, verify the reminder appears in output

Expected: See "REMINDER: Blog content was modified..." or similar message

**Step 4: Final commit with all changes**

```bash
git log --oneline -5
```

Expected: See 5 commits for the implementation

---

## Summary

After completing all tasks:

1. **Agent descriptions** include comprehensive trigger phrases for semantic matching
2. **CLAUDE.md** has explicit delegation rules as documentation
3. **PostToolUse hook** provides a reminder if content is edited directly (soft enforcement)

The hook is a "reminder" approach rather than blocking because:

- Blocking would break legitimate use cases (quick fixes, automated scripts)
- Reminders help Claude learn the pattern without being disruptive
- The improved descriptions should handle most cases proactively
