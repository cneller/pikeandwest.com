#!/usr/bin/env bash
# Start Hugo development server with drafts enabled.
# Usage: ./scripts/start-server.sh [port]
#   port  Optional port number (default: 1313)

set -euo pipefail

PORT="${1:-1313}"
hugo server -D -p "$PORT"
