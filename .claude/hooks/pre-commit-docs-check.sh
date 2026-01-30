#!/usr/bin/env bash
# Pre-commit documentation check hook
# BLOCKS git commit/push until documentation checklist is reviewed
#
# Uses permissionDecision: "deny" to prevent the commit from executing.
# Claude must acknowledge the checklist and re-run the commit.

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
    "permissionDecision": "deny",
    "permissionDecisionReason": "PRE-COMMIT DOCUMENTATION CHECK\n\nReview changes against project documentation before committing:\n\n[ ] ADR Check: Did changes involve architectural decisions (CSS patterns, layout approaches, tool choices)?\n    -> If yes: Create docs/architecture/decisions/ADR-XXX-*.md\n\n[ ] Pattern Extraction: Any reusable code patterns worth documenting?\n    -> If yes: Update docs/architecture/patterns/*.md\n\n[ ] CLAUDE.md Sync: If new ADR created, update Architecture Decisions table\n\n[ ] Next Steps: Add any new tasks discovered during implementation\n    -> Update docs/next-steps.md\n\n[ ] Changelog: Move completed items from next-steps to changelog\n    -> Update docs/CHANGELOG.md\n\nTo proceed: Review the checklist above, address any items, then re-run the commit.\nTo skip: If only fixing typos/comments/trivial changes, re-run with acknowledgment."
  }
}
EOF
fi

exit 0
