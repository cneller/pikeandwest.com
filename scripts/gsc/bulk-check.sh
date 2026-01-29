#!/usr/bin/env bash
# Bulk check URLs from a file (one URL per line)
# Usage: ./bulk-check.sh urls.txt > results.jsonl
#
# Input file format:
#   https://pikeandwest.com/contact/
#   https://pikeandwest.com/gallery/
#   # Comments are ignored
#
# Output: JSON Lines format (one JSON object per line)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INPUT_FILE="${1:?Usage: $0 <urls-file>}"

if [[ ! -f "$INPUT_FILE" ]]; then
	echo "Error: File not found: $INPUT_FILE" >&2
	exit 1
fi

# Count URLs for progress
total=$(grep -cv '^#\|^$' "$INPUT_FILE" 2>/dev/null || echo "0")
current=0

while IFS= read -r url || [[ -n "$url" ]]; do
	# Skip empty lines and comments
	[[ -z "$url" || "$url" =~ ^[[:space:]]*# ]] && continue

	# Trim whitespace
	url=$(echo "$url" | xargs)

	((current++)) || true
	echo "[$current/$total] Checking: $url" >&2

	# Call single URL checker
	"$SCRIPT_DIR/check-url.sh" "$url" 2>/dev/null || {
		echo "{\"url\": \"$url\", \"error\": \"Failed to check URL\"}"
	}

	# Rate limiting: 100ms between requests
	sleep 0.1
done <"$INPUT_FILE"

echo "Done. Checked $current URLs." >&2
