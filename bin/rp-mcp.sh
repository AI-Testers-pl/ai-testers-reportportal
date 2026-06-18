#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$HERE")"

if [ -f "$ROOT/.env" ]; then
  set -a
  . "$ROOT/.env"
  set +a
fi

export RP_API_TOKEN="${REPORT_PORTAL_API_KEY:-}"
export RP_PROJECT="${REPORT_PORTAL_PROJECT:-}"
export RP_HOST="${REPORT_PORTAL_MCP_HOST:-http://host.docker.internal:8080}"

if [ -z "$RP_API_TOKEN" ] || [ -z "$RP_PROJECT" ]; then
  echo "rp-mcp.sh: REPORT_PORTAL_API_KEY or REPORT_PORTAL_PROJECT missing from $ROOT/.env" >&2
  exit 1
fi

exec docker run -i --rm \
  -e RP_API_TOKEN \
  -e RP_HOST \
  -e RP_PROJECT \
  reportportal/mcp-server
