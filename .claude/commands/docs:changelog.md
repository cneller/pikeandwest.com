---
description: Sync completed items from next-steps.md to CHANGELOG.md, cleaning up completed checklists and milestones
allowed-tools: Read, Write, Edit, Glob, Grep
arguments:
  - name: milestone
    description: Optional milestone title to add as a new section in CHANGELOG.md
    required: false
  - name: dry-run
    description: If "true", show what would change without modifying files
    required: false
---

# /docs:changelog Command

Maintain documentation hygiene by moving completed work from `docs/next-steps.md`
to `docs/CHANGELOG.md`. Keeps the next-steps file focused on actionable tasks
while preserving project history in the changelog.

---

## What This Command Does

1. **Identifies completed items** in `docs/next-steps.md`:
   - Checked checkboxes (`- [x] Task description`)
   - Sections marked "Complete" or "Ready" in status tables
   - "Recently Completed" sections that should be archived
   - Entire checklists where all items are checked

2. **Moves completed work to `docs/CHANGELOG.md`**:
   - Individual tasks go to the Daily Log table
   - Major milestones get their own dated section
   - Preserves file/implementation details for significant changes

3. **Cleans up `docs/next-steps.md`**:
   - Removes fully-completed checklists
   - Removes "Recently Completed" sections after archiving
   - Updates "Last Updated" date
   - Removes items from status tables that are truly done

4. **Maintains consistency**:
   - Links between the two files
   - Date formatting (YYYY-MM-DD)
   - Table alignment

---

## Execution Flow

### Phase 1: Analysis

1. Read both files:
   - `docs/next-steps.md`
   - `docs/CHANGELOG.md`

2. Identify completed items:
   - Scan for `- [x]` checkboxes
   - Identify sections where ALL items are checked
   - Find "Recently Completed" sections
   - Check status tables for "Complete" or "Ready" items

3. Classify each completed item:
   - **Daily Log entry**: Single task, brief description
   - **Milestone section**: Multi-part feature, significant changes

4. Report findings:

   ```text
   Found:
   - X checked checkboxes
   - X fully-completed sections
   - X items ready to archive

   Classification:
   - Daily Log entries: X
   - Milestone sections: X
   ```

### Phase 2: User Confirmation (unless dry-run)

If `$ARGUMENTS.dry-run` is "true":

- Show what would be moved and removed
- Do not modify any files
- Exit after showing preview

Otherwise, show summary and proceed.

### Phase 3: Update CHANGELOG.md

1. For **milestone sections** (from "Recently Completed" or argument):
   - Add new section under "## Recent Milestones"
   - Include date, goal, changes table, files created/modified
   - Preserve technical details

2. For **daily log entries**:
   - Add rows to the "## Daily Log" table
   - Use today's date
   - Keep entries concise (one line per task)

3. Sort Daily Log entries by date (newest first).

### Phase 4: Clean Up next-steps.md

1. Remove archived "Recently Completed" sections entirely.

2. For checklists where ALL items are complete:
   - Remove the entire checklist
   - If parent section is now empty, remove section header too

3. For partially-complete checklists:
   - Remove only the checked items
   - Keep unchecked items in place

4. Update the "Last Updated" date to today.

5. Verify "For completed work, see [CHANGELOG.md](./CHANGELOG.md)" link exists.

### Phase 5: Summary Report

```text
Changelog Updated:
- Added X milestone sections
- Added X daily log entries

Next-Steps Cleaned:
- Removed X completed items
- Removed X empty sections
- Updated last modified date

Files modified:
- docs/CHANGELOG.md
- docs/next-steps.md
```

---

## File Structure Reference

### docs/next-steps.md Structure

```markdown
# Pike & West - Next Steps

> **Last Updated:** YYYY-MM-DD
> **Current Phase:** [phase description]

For completed work, see [CHANGELOG.md](./CHANGELOG.md).

## Current Status
| Area | Status | Notes |
[status table - items marked "Complete" may be removable]

## [Checklist Section]
- [ ] Pending task
- [x] Completed task (move to changelog)

## Recently Completed (if present)
### Feature Name (YYYY-MM-DD)
[detailed description - move entire section to changelog]
```

### docs/CHANGELOG.md Structure

```markdown
# Pike & West - Changelog

## Recent Milestones

### [Feature Name] (YYYY-MM-DD)
**Goal:** [one-line summary]

**Changes:**
| Component | Before | After |
[changes table]

**Files Created/Modified:**
- [file list]

---

## Daily Log

| Date       | Change                              |
|------------|-------------------------------------|
| YYYY-MM-DD | Brief description of completed task |
```

---

## Decision Rules

### When to Create a Milestone Section

Create a milestone section when the completed work:

1. Involved creating 3+ new files
2. Required changes across multiple components
3. Represents a user-facing feature
4. Has a "Recently Completed" section with details
5. Is passed as the `milestone` argument

### When to Use Daily Log

Use daily log entries for:

1. Single checkbox completions
2. Bug fixes
3. Configuration changes
4. Documentation updates
5. Simple feature additions

### What NOT to Move

Do NOT move items that are:

1. Marked complete but still have follow-up tasks
2. In "Blocked" sections (even if partially complete)
3. Part of "Launch Tasks" or "Future Enhancements" (these are planning, not tracking)

---

## Examples

### Example 1: Moving Completed Checkboxes

**Before (next-steps.md):**

```markdown
### Sveltia CMS

- [x] Create GitHub OAuth App
- [x] Deploy Cloudflare Worker
- [ ] Add GitHub collaborators
- [ ] Test CMS login flow
```

**After (next-steps.md):**

```markdown
### Sveltia CMS

- [ ] Add GitHub collaborators
- [ ] Test CMS login flow
```

**Added to CHANGELOG.md Daily Log:**

```markdown
| 2026-01-29 | Created GitHub OAuth App for Sveltia CMS |
| 2026-01-29 | Deployed Cloudflare Worker for CMS auth  |
```

### Example 2: Archiving Recently Completed Section

**Before (next-steps.md):**

```markdown
## Recently Completed

### Footer Redesign (2026-01-21)

**Goal:** Redesign footer for better SEO...
[full details]
```

**After:**

- Section removed from next-steps.md
- Full section moved to CHANGELOG.md under "## Recent Milestones"

### Example 3: Dry Run Output

```text
/docs:changelog dry-run=true

DRY RUN - No files will be modified

Would move to CHANGELOG.md:
- [Milestone] Blog Taxonomy Redesign (2026-01-28)
- [Daily Log] Deployed Sveltia CMS auth
- [Daily Log] Cleaned GitHub Actions artifact storage

Would remove from next-steps.md:
- Section: "Recently Completed" (2 milestones)
- Checkboxes: 5 completed items
- Empty section: "PR #15 Lighthouse Issues" (all done)

Run without dry-run to apply changes.
```

---

## Error Handling

1. **Missing files**: Create CHANGELOG.md if it doesn't exist
2. **Malformed markdown**: Skip problematic sections, report warnings
3. **Date parsing issues**: Use today's date as fallback
4. **Empty sections**: Remove cleanly without orphaned headers

---

## Related Commands

- `/check:editorial` - Content audit that may identify completed improvements
- `/check:all` - Full site health check

---

## Maintenance Notes

### When to Run This Command

- After completing a significant feature
- Before starting a new sprint/phase
- Weekly during active development
- Before creating PRs that reference completed work

### Best Practices

1. Run with `dry-run=true` first to preview changes
2. Use `milestone` argument for significant features
3. Commit changelog updates separately from code changes
4. Keep daily log entries concise (under 80 chars)
