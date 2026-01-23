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
