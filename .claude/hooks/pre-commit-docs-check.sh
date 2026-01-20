#!/usr/bin/env bash
# Pre-commit documentation check hook
# Injects a reminder for Claude to review documentation before git commit/push

set -e

# Read JSON input from stdin
INPUT=$(cat)

# Extract the command being run
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# Only trigger on git commit or git push (not other git commands)
if echo "$COMMAND" | grep -qE '^git\s+(commit|push)'; then
	cat <<'EOF'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "additionalContext": "PRE-COMMIT DOCUMENTATION CHECK\n\nBefore committing, review changes against project documentation:\n\n[ ] ADR Check: Did changes involve architectural decisions (CSS patterns, layout approaches, tool choices)?\n    -> If yes: Create docs/architecture/decisions/ADR-XXX-*.md\n\n[ ] Pattern Extraction: Any reusable code patterns worth documenting?\n    -> If yes: Update docs/architecture/patterns/*.md\n\n[ ] CLAUDE.md Sync: If new ADR created, update Architecture Decisions table\n\n[ ] Next Steps: Update docs/next-steps.md (completed items -> Changelog, add new tasks)\n\nSkip if: Only fixing typos, comments, or trivial changes."
  }
}
EOF
fi

exit 0
