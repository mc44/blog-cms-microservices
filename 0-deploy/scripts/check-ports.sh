#!/usr/bin/env bash
set -euo pipefail

die() { echo "check-ports: $*" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

port_in_use() {
  local port=$1
  if command -v ss >/dev/null 2>&1; then
    ss -H -ltn "sport = :$port" 2>/dev/null | grep -q .
    return $?
  fi
  if command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1
    return $?
  fi
  die "Need ss (Linux) or lsof to check ports"
}

docker_on_port() {
  local port=$1
  docker ps --format '{{.Names}}\t{{.Ports}}' 2>/dev/null \
    | grep -E "(:|\\])${port}->" \
    | head -1 \
    || true
}

expected_container() {
  local name=$1
  [[ "$name" == cms-data-mongo-* ]] \
    || [[ "$name" == cms-data-redis-* ]] \
    || [[ "$name" == cms-apps-gateway-* ]] \
    || [[ "$name" == cms-apps-blog-service-* ]] \
    || [[ "$name" == cms-apps-media-service-* ]] \
    || [[ "$name" == cms-apps-audit-service-* ]] \
    || [[ "$name" == cms-apps-frontend-* ]]
}

print_port_map() {
  cat <<EOF
Port map (host port → service → change host binding in):
  27018  mongo (blog+audit)     $DEPLOY_ROOT/prereqs/docker-compose.yml
  6380   redis (optional)       $DEPLOY_ROOT/prereqs/docker-compose.yml
  8080   gateway                $DEPLOY_ROOT/docker-compose.yml
  8082   blog-service           $DEPLOY_ROOT/docker-compose.yml
  8083   media-service          $DEPLOY_ROOT/docker-compose.yml
  8084   audit-service          $DEPLOY_ROOT/docker-compose.yml
  3000   frontend               $DEPLOY_ROOT/docker-compose.yml + 3-frontend/Dockerfile (PORT)
Reserved by auth-service (do not bind here): 8081, 27017
If you change gateway host port, update NEXT_PUBLIC_GATEWAY_URL in 0-deploy/.env
EOF
}

print_conflict_help() {
  cat <<EOF

Resolve port conflicts:
  1. Inspect what is listening (replace PORT):
       ss -tlnp | grep :PORT
       sudo lsof -nP -iTCP:PORT -sTCP:LISTEN
  2. Stop the other process/container, OR change the HOST port (left side of "HOST:CONTAINER")
     in the compose file listed above. Example: "8080:8080" → "18080:8080"
     - Apps: $DEPLOY_ROOT/docker-compose.yml
     - Mongo/redis: $DEPLOY_ROOT/prereqs/docker-compose.yml
     Container listen ports (right side) live in each service Dockerfile EXPOSE and
     Spring application.yml (frontend: 3-frontend/Dockerfile ENV PORT, default 3000).
  3. Re-run: $SCRIPT_DIR/check-ports.sh all

Auth uses 8081 and 27017 — keep those free for auth-service, not this stack.
EOF
}

check_one() {
  local port=$1
  if ! port_in_use "$port"; then
    echo "  OK   $port — free"
    return 0
  fi

  local line name
  line=$(docker_on_port "$port")
  if [[ -z "$line" ]]; then
    echo "  FAIL $port — in use on the host (not a recognized blog-cms container)"
    echo "       Inspect: ss -tlnp | grep :$port   OR   sudo lsof -nP -iTCP:$port -sTCP:LISTEN"
    return 1
  fi

  name=${line%%$'\t'*}
  if expected_container "$name"; then
    echo "  OK   $port — Docker ($name)"
    return 0
  fi

  echo "  FAIL $port — Docker ($name) is using it; stop it or change the host port in compose"
  return 1
}

MODE="${1:-apps}"
shift || true

case "$MODE" in
  prereqs)
    PORTS=(27018)
    [[ "${1:-}" == "--with-redis" ]] && PORTS=(27018 6380)
    ;;
  apps)
    PORTS=(8080 8082 8083 8084 3000)
    ;;
  all)
    PORTS=(27018 8080 8082 8083 8084 3000)
    [[ "${1:-}" == "--with-redis" ]] && PORTS=(27018 6380 8080 8082 8083 8084 3000)
    ;;
  *)
    PORTS=("$MODE" "$@")
    ;;
esac

echo "Checking host ports: ${PORTS[*]}"
print_port_map
echo
failed=0
for p in "${PORTS[@]}"; do
  check_one "$p" || failed=1
done

if [[ "$failed" -ne 0 ]]; then
  print_conflict_help
  die "Port check failed — fix conflicts before deploy."
fi
