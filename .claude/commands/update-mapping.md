---
description: Update CSS mapping document with new findings
allowed-tools: Read, Edit, Bash
---

Update `docs/webflow-to-hugo-css-mapping.md` with current visual regression findings and CSS comparisons.

## Step 1: Read Current Mapping

Read the existing mapping document:
@docs/webflow-to-hugo-css-mapping.md

## Step 2: Check for Recent BackstopJS Results

Look for latest test results:
!`ls -la /Users/colinneller/Projects/pikeandwest.com/backstop_data/html_report/ 2>/dev/null | head -10`

## Step 3: Gather Current State

For each section in the mapping:

1. Check if SCSS file has been modified recently
2. Note any fixes applied since last update
3. Identify remaining discrepancies

## Step 4: Update Document Sections

Update these sections as needed:

### Visual Regression Test Results

- Update date
- Update mismatch percentages
- Update pass/fail counts

### Quick Reference: Values to Check/Fix

- Mark fixed items
- Add newly discovered issues
- Update priority levels

### Files to Update

- Check off completed files
- Add new files if needed

## Step 5: Add New Findings

If there are new CSS comparisons to document:

- Add to Component Mapping section
- Include Webflow values and Hugo equivalents
- Note any outstanding differences

## Step 6: Format and Save

Ensure document follows existing format:

- Tables are properly aligned
- Code blocks use correct syntax highlighting
- Sections are in logical order

## Step 7: Confirm Changes

Show summary of changes made:

- Sections updated
- New entries added
- Items marked complete

Ask user to review changes.
