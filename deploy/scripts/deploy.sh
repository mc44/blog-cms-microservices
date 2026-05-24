#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  echo "Missing deploy/.env — copy from deploy/.env.example"
  exit 1
fi

# shellcheck disable=SC1091
set -a && source .env && set +a

if ! docker network inspect auth-platform >/dev/null 2>&1; then
  echo "Network auth-platform not found. Start auth-service first (auth-service/deploy/infrastructure + deploy)."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
"$SCRIPT_DIR/check-ports.sh" apps

echo "Building and starting blog-cms stack..."
docker compose -f docker-compose.yml up -d --build gateway blog-service media-service audit-service frontend

echo "Gateway: ${NEXT_PUBLIC_GATEWAY_URL:-http://localhost:8080}"
