#!/usr/bin/env bash
# Semantic commit grouping hook
# Encourages batching related changes and warns about commit fragmentation

set -e

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# On git commit: remind to group semantically
if echo "$COMMAND" | grep -qE '^git\s+commit'; then
	# Check what's being staged
	STAGED_FILES=$(git diff --cached --name-only 2>/dev/null | head -20 || echo "")

	if [ -n "$STAGED_FILES" ]; then
		# Count file types being committed
		SCSS_COUNT=$(echo "$STAGED_FILES" | grep -c '\.scss$' || echo 0)
		HTML_COUNT=$(echo "$STAGED_FILES" | grep -c '\.html$' || echo 0)
		MD_COUNT=$(echo "$STAGED_FILES" | grep -c '\.md$' || echo 0)
		JS_COUNT=$(echo "$STAGED_FILES" | grep -c '\.js$' || echo 0)

		cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "SEMANTIC COMMIT CHECK\n\nStaged files: ${SCSS_COUNT} SCSS, ${HTML_COUNT} HTML, ${MD_COUNT} MD, ${JS_COUNT} JS\n\nBefore committing, verify this is a complete semantic unit:\n\n[ ] Feature complete? Include ALL files for this feature (template + styles + content)\n[ ] Related changes grouped? Don't split tightly-coupled edits across commits\n[ ] Nothing missing? Check for unstaged files that belong with this change\n\nCommit types: feat | fix | refactor | docs | style | chore | test\nFormat: type(scope): description\n\nIf more files belong with this change, stage them first."
  }
}
EOF
	fi
fi

# On git push: analyze recent commits for fragmentation
if echo "$COMMAND" | grep -qE '^git\s+push'; then
	# Get commits ahead of remote
	BRANCH=$(git branch --show-current 2>/dev/null || echo "")
	if [ -n "$BRANCH" ]; then
		REMOTE_BRANCH="origin/$BRANCH"
		COMMITS_AHEAD=$(git rev-list --count "$REMOTE_BRANCH..HEAD" 2>/dev/null || echo "0")

		if [ "$COMMITS_AHEAD" -gt 3 ]; then
			# Check for potential squash candidates (same type/scope)
			RECENT_MSGS=$(git log --oneline "$REMOTE_BRANCH..HEAD" 2>/dev/null | head -10 || echo "")

			cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "PRE-PUSH COMMIT REVIEW\n\nPushing $COMMITS_AHEAD commits. Recent:\n$RECENT_MSGS\n\nConsider before pushing:\n\n[ ] Could any commits be squashed? (e.g., fix + fix for same feature)\n[ ] Are commit messages semantic? (feat/fix/refactor/docs/style/chore)\n[ ] Would interactive rebase improve history? git rebase -i $REMOTE_BRANCH\n\nClean history = easier reviews and debugging. Skip if commits are already well-organized."
  }
}
EOF
		fi
	fi
fi

exit 0
