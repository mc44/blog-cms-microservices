# Deploy (server)

Run from a git clone on the host. Images are built on the machine with Docker Compose. **auth-service** is deployed from its own repository first.

For **local testing** with auth and Mongo already running, use the root [README.md](../README.md).

## Prerequisites

- Docker Engine and Compose v2
- **auth-service** running on network `auth-platform` (port **8081** on the host)
- Git clone of this repository

## Ports (blog-cms)

| Port | Service |
|------|---------|
| 27018 | MongoDB (`blog` + `audit` databases) |
| 6380 | Redis (optional profile) |
| 8080 | gateway |
| 8082 | blog-service |
| 8083 | media-service |
| 8084 | audit-service |
| 3000 | frontend |

Auth uses **27017** and **8081** in the auth repo — do not bind those on the blog stack.

Check ports before starting:

```bash
chmod +x deploy/scripts/check-ports.sh
./deploy/scripts/check-ports.sh prereqs   # before Mongo
./deploy/scripts/check-ports.sh apps      # before applications
./deploy/scripts/check-ports.sh all
```

## Step 1 — Auth-service

Deploy from the auth-service clone (sibling: `../auth-service/deploy/README.md` or your auth GitHub repo).

Copy `AUTH_JWT_SECRET` from auth `deploy/.env` into this repo’s `deploy/.env`.

Verify:

```bash
curl -s http://127.0.0.1:8081/actuator/health
```

## Step 2 — Blog MongoDB

```bash
./deploy/scripts/check-ports.sh prereqs
cd deploy/prereqs
docker compose up -d mongo
# optional:
docker compose --profile redis up -d redis
```

Details: [prereqs/README.md](prereqs/README.md).

## Step 3 — Applications

```bash
cd deploy
cp .env.example .env
chmod 600 .env
```

| Variable | Purpose |
|----------|---------|
| `AUTH_SERVICE_URL` | Auth container URL on `auth-platform` (e.g. `http://auth-service:8081`) |
| `AUTH_JWT_SECRET` | Same as auth-service |
| `BLOG_TENANT_ID` | Tenant used at login; must exist in auth |
| `NEXT_PUBLIC_GATEWAY_URL` | Public gateway URL for the frontend build |

`BLOG_TENANT_ID` must match a tenant in auth (align with auth `AUTH_SEED_TENANT_ID` on first boot if you use seeding).

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

Requires networks **`auth-platform`** and **`cms-internal`**.

## Containers started by deploy.sh

| Service | Host port |
|---------|-----------|
| gateway | 8080 |
| blog-service | 8082 |
| media-service | 8083 |
| audit-service | 8084 |
| frontend | 3000 |

## Architecture

```text
auth-service repo                 blog-cms repo
┌─────────────────┐              ┌────────────────────┐
│ auth-platform   │              │ cms-internal       │
│  mongo (auth)   │              │  mongo (blog)      │
│  auth :8081     │◄─────────────│  gateway :8080     │
└─────────────────┘              │  blog, media,      │
                                 │  audit, frontend   │
                                 └────────────────────┘
```

## Redeploy after git pull

```bash
cd deploy
git pull
./scripts/deploy.sh
```

Prereq Mongo is unchanged unless `deploy/prereqs` was modified.

## Gateway and auth integration

Sibling doc: `../auth-service/docs/GATEWAY_INTEGRATION.md`  
Route map: [gateway-service/README.md](../gateway-service/README.md)

## Kafka / Redpanda (optional)

```bash
cd deploy/prereqs
docker compose --profile kafka up -d redpanda
```

Set `KAFKA_ENABLED=true` in `deploy/.env`, then rerun `./scripts/deploy.sh`. See [docs/kafka.md](../docs/kafka.md).

## CI/CD (images)

GitHub Actions can build and push images ([.github/workflows/publish.yml](../.github/workflows/publish.yml)). Auth images are built from the auth-service repository, not this one.
