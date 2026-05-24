#!/usr/bin/env bash
set -euo pipefail

die() { echo "check-ports: $*" >&2; exit 1; }

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
failed=0
for p in "${PORTS[@]}"; do
  check_one "$p" || failed=1
done

if [[ "$failed" -ne 0 ]]; then
  echo
  die "Resolve port conflicts before continuing. Auth uses 8081 and 27017 from the auth-service repo — do not collide with this stack."
fi
