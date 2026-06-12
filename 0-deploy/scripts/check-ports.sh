#!/usr/bin/env bash
set -euo pipefail

die() { echo "check-ports: $*" >&2; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$DEPLOY_ROOT/.." && pwd)"

load_env() {
  local env_file="$DEPLOY_ROOT/.env"
  if [[ -f "$env_file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$env_file"
    set +a
  fi
}

load_env

MONGO_HOST_PORT="${MONGO_HOST_PORT:-27018}"
REDIS_HOST_PORT="${REDIS_HOST_PORT:-6380}"
GATEWAY_HOST_PORT="${GATEWAY_HOST_PORT:-8080}"
BLOG_HOST_PORT="${BLOG_HOST_PORT:-8082}"
MEDIA_HOST_PORT="${MEDIA_HOST_PORT:-8083}"
AUDIT_HOST_PORT="${AUDIT_HOST_PORT:-8084}"
FRONTEND_HOST_PORT="${FRONTEND_HOST_PORT:-3000}"
FRONTEND_CONTAINER_PORT="${FRONTEND_CONTAINER_PORT:-3000}"

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
Host ports (from $DEPLOY_ROOT/.env — check-ports uses these values):

  MONGO_HOST_PORT=$MONGO_HOST_PORT
    Service: mongo (blog + audit data)
    Update:  $DEPLOY_ROOT/.env
             $DEPLOY_ROOT/prereqs/docker-compose.yml  →  "\${MONGO_HOST_PORT}:27017"
    Start:   docker compose --env-file $DEPLOY_ROOT/.env -f $DEPLOY_ROOT/prereqs/docker-compose.yml up -d mongo

  REDIS_HOST_PORT=$REDIS_HOST_PORT (optional profile)
    Update:  $DEPLOY_ROOT/.env
             $DEPLOY_ROOT/prereqs/docker-compose.yml  →  "\${REDIS_HOST_PORT}:6379"

  GATEWAY_HOST_PORT=$GATEWAY_HOST_PORT
    Service: gateway (public API)
    Update:  $DEPLOY_ROOT/.env
             $DEPLOY_ROOT/docker-compose.yml  →  "\${GATEWAY_HOST_PORT}:8080"
             $DEPLOY_ROOT/.env  NEXT_PUBLIC_GATEWAY_URL (public URL must use this host port)
    Container listen port 8080 only if you change the right side:
             $REPO_ROOT/1-gateway-service/src/main/resources/application.yml  server.port

  BLOG_HOST_PORT=$BLOG_HOST_PORT
    Update:  $DEPLOY_ROOT/.env
             $DEPLOY_ROOT/docker-compose.yml  →  "\${BLOG_HOST_PORT}:8082"
    Container 8082: $REPO_ROOT/2-blog-service/src/main/resources/application.yml  server.port

  MEDIA_HOST_PORT=$MEDIA_HOST_PORT
    Update:  $DEPLOY_ROOT/.env
             $DEPLOY_ROOT/docker-compose.yml  →  "\${MEDIA_HOST_PORT}:8083"
    Container 8083: $REPO_ROOT/4-media-service/src/main/resources/application.yml  server.port

  AUDIT_HOST_PORT=$AUDIT_HOST_PORT
    Update:  $DEPLOY_ROOT/.env
             $DEPLOY_ROOT/docker-compose.yml  →  "\${AUDIT_HOST_PORT}:8084"
    Container 8084: $REPO_ROOT/5-audit-service/src/main/resources/application.yml  server.port

  FRONTEND_HOST_PORT=$FRONTEND_HOST_PORT  →  container $FRONTEND_CONTAINER_PORT
    Service: Next.js UI (browser URL uses HOST port only)
    Update host:     $DEPLOY_ROOT/.env  FRONTEND_HOST_PORT
                     $DEPLOY_ROOT/docker-compose.yml  →  "\${FRONTEND_HOST_PORT}:\${FRONTEND_CONTAINER_PORT}"
    Update container: $DEPLOY_ROOT/.env  FRONTEND_CONTAINER_PORT
                      $REPO_ROOT/3-frontend/Dockerfile  ENV PORT + EXPOSE
                      $DEPLOY_ROOT/docker-compose.yml  environment PORT
    Nginx (optional): $DEPLOY_ROOT/nginx/nginx.conf.example

Reserved by auth-service (do not use here): 8081, 27017
EOF
}

print_files_for_port() {
  local port=$1
  echo "       Files to update for host port $port:"
  case "$port" in
    "$MONGO_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  MONGO_HOST_PORT"
      echo "         - $DEPLOY_ROOT/prereqs/docker-compose.yml"
      ;;
    "$REDIS_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  REDIS_HOST_PORT"
      echo "         - $DEPLOY_ROOT/prereqs/docker-compose.yml"
      ;;
    "$GATEWAY_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  GATEWAY_HOST_PORT and NEXT_PUBLIC_GATEWAY_URL"
      echo "         - $DEPLOY_ROOT/docker-compose.yml"
      ;;
    "$BLOG_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  BLOG_HOST_PORT"
      echo "         - $DEPLOY_ROOT/docker-compose.yml"
      ;;
    "$MEDIA_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  MEDIA_HOST_PORT"
      echo "         - $DEPLOY_ROOT/docker-compose.yml"
      ;;
    "$AUDIT_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  AUDIT_HOST_PORT"
      echo "         - $DEPLOY_ROOT/docker-compose.yml"
      ;;
    "$FRONTEND_HOST_PORT")
      echo "         - $DEPLOY_ROOT/.env  FRONTEND_HOST_PORT (browser URL :$FRONTEND_HOST_PORT)"
      echo "         - $DEPLOY_ROOT/docker-compose.yml  ports mapping"
      if [[ "$FRONTEND_HOST_PORT" != "$FRONTEND_CONTAINER_PORT" ]]; then
        echo "         - container port $FRONTEND_CONTAINER_PORT: $REPO_ROOT/3-frontend/Dockerfile (ENV PORT, EXPOSE)"
      fi
      ;;
    *)
      echo "         - $DEPLOY_ROOT/.env  (add a *_HOST_PORT variable)"
      echo "         - matching compose ports: in $DEPLOY_ROOT/docker-compose.yml or prereqs/"
      ;;
  esac
}

print_conflict_help() {
  cat <<EOF

Resolve port conflicts:
  1. Inspect what is listening (replace PORT):
       ss -tlnp | grep :PORT
       sudo lsof -nP -iTCP:PORT -sTCP:LISTEN
  2. Either stop the conflicting process/container, OR raise the HOST port in $DEPLOY_ROOT/.env
     (then redeploy). Compose reads \${VAR} from .env automatically when run from $DEPLOY_ROOT.
  3. Re-run: $SCRIPT_DIR/check-ports.sh all

Changing only the HOST port: edit .env + redeploy (compose already uses \${*_HOST_PORT}).
Changing the container listen port (right side): also edit the service application.yml or
3-frontend/Dockerfile ENV PORT, then rebuild images.

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
    print_files_for_port "$port"
    return 1
  fi

  name=${line%%$'\t'*}
  if expected_container "$name"; then
    echo "  OK   $port — Docker ($name)"
    return 0
  fi

  echo "  FAIL $port — Docker ($name) is using it; stop it or change the host port"
  print_files_for_port "$port"
  return 1
}

MODE="${1:-apps}"
shift || true

case "$MODE" in
  prereqs)
    PORTS=("$MONGO_HOST_PORT")
    [[ "${1:-}" == "--with-redis" ]] && PORTS=("$MONGO_HOST_PORT" "$REDIS_HOST_PORT")
    ;;
  apps)
    PORTS=("$GATEWAY_HOST_PORT" "$BLOG_HOST_PORT" "$MEDIA_HOST_PORT" "$AUDIT_HOST_PORT" "$FRONTEND_HOST_PORT")
    ;;
  all)
    PORTS=("$MONGO_HOST_PORT" "$GATEWAY_HOST_PORT" "$BLOG_HOST_PORT" "$MEDIA_HOST_PORT" "$AUDIT_HOST_PORT" "$FRONTEND_HOST_PORT")
    [[ "${1:-}" == "--with-redis" ]] && PORTS=("$MONGO_HOST_PORT" "$REDIS_HOST_PORT" "$GATEWAY_HOST_PORT" "$BLOG_HOST_PORT" "$MEDIA_HOST_PORT" "$AUDIT_HOST_PORT" "$FRONTEND_HOST_PORT")
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
