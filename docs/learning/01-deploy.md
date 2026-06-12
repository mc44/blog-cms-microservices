# 01 — Deploy

## Goal

Run the blog stack: Mongo in `0-deploy/prereqs`, secrets in `0-deploy/.env`, apps via `deploy.sh`.

## Prerequisites

- Docker Compose v2
- [00 — Architecture](./00-architecture-and-repos.md)
- [auth-service](https://github.com/mc44/auth-service) running ([deploy/README.md](https://github.com/mc44/auth-service/blob/main/deploy/README.md); [02 — Auth](./02-auth-sibling-repo.md))

## Concepts

**Deploy order:**

1. auth-service → network `auth-platform`
2. `0-deploy/prereqs` → Mongo on **27018**, network `cms-internal`
3. `0-deploy/.env` → copy from `.env.example`; sync `AUTH_JWT_SECRET`
4. `./0-deploy/scripts/deploy.sh` → gateway, blog, media, audit, frontend

Secrets live only in **`0-deploy/.env`** (gitignored) — see root [README.md](../../README.md) §2.

**Optional all-in-one:** [0-deploy/optional/all-in-one/README.md](../../0-deploy/optional/all-in-one/README.md) — single laptop demo only.

Operational reference: [0-deploy/README.md](../../0-deploy/README.md) (VPS steps).

## Hands-on

From repo root — same as [README.md](../../README.md) §3:

```bash
cd 0-deploy && cp .env.example .env
# Edit .env: AUTH_JWT_SECRET must match auth-service

docker compose --env-file 0-deploy/.env -f 0-deploy/prereqs/docker-compose.yml up -d mongo

chmod +x 0-deploy/scripts/deploy.sh 0-deploy/scripts/check-ports.sh
./0-deploy/scripts/check-ports.sh all
./0-deploy/scripts/deploy.sh
```

## Verify

```bash
curl -s http://localhost:8080/actuator/health   # {"status":"UP"}
curl -s http://localhost:8080/hello             # greeting
docker compose --env-file 0-deploy/.env -f 0-deploy/docker-compose.yml ps
```

Open http://localhost:3000.

## Checkpoint

1. What file must exist before `deploy.sh` runs?
2. Which compose file creates `cms-internal`?
3. Why must `AUTH_JWT_SECRET` match between repos?
4. What happens if `auth-platform` network does not exist?
5. Where is Redpanda defined, and is it started by default?

## Next

[02 — Auth sibling repo](./02-auth-sibling-repo.md)
