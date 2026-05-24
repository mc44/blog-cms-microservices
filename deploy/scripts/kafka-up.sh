#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../prereqs" && pwd)"
cd "$ROOT"

echo "Starting Redpanda (profile kafka)..."
docker compose -f docker-compose.yml --profile kafka up -d redpanda

echo "Set KAFKA_ENABLED=true in deploy/.env and redeploy apps."
