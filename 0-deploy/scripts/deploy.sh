#!/usr/bin/env bash
set -euo pipefail

# Resolve script location before cd (works when invoked as ./0-deploy/scripts/deploy.sh or from scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CHECK_PORTS="$SCRIPT_DIR/check-ports.sh"

cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing 0-deploy/.env — copy from 0-deploy/.env.example"
  exit 1
fi

if [[ ! -x "$CHECK_PORTS" ]]; then
  echo "deploy.sh: check-ports script not found at: $CHECK_PORTS" >&2
  echo "Run from repo root: ./0-deploy/scripts/deploy.sh" >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a
if ! source .env; then
  echo "deploy.sh: failed to load 0-deploy/.env" >&2
  echo "Quote values with spaces or apostrophes, for example:" >&2
  echo '  NEXT_PUBLIC_SITE_BYLINE="by mfajardo"' >&2
  echo '  NEXT_PUBLIC_SITE_TAGLINE="... I'\''m learning."' >&2
  exit 1
fi
set +a

if ! docker network inspect auth-platform >/dev/null 2>&1; then
  echo "Network auth-platform not found. Start auth-service first (see auth-service deploy docs)."
  exit 1
fi

"$CHECK_PORTS" apps

echo "Building and starting blog-cms stack..."
docker compose -f docker-compose.yml up -d --build gateway blog-service media-service audit-service frontend

echo "Gateway: ${NEXT_PUBLIC_GATEWAY_URL:-http://localhost:8080}"
