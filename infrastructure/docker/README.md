# Docker — all-in-one local stack

Single Compose file that starts MongoDB, Redis, auth-service (sibling build), gateway, blog, media, audit, and optionally the frontend stack pieces.

Use this when you want one command and have **auth-service** cloned next to this repo:

```text
parent/
├── auth-service/
└── blog-cms-microservices/
```

From the **repository root**:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

## Services

| Compose service | Port | Notes |
|-----------------|------|--------|
| mongo | 27017 | Shared instance; DBs `auth`, `blog`, `audit` |
| redis | 6379 | |
| auth-service | 8081 | Built from `../../../auth-service` |
| gateway | 8080 | Routes `/auth`, `/blog`, `/media`, `/audit` |
| blog-service | 8082 | |
| media-service | 8083 | |
| audit-service | 8084 | |

List running containers:

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

## Smoke checks

```bash
curl -s http://localhost:8080/actuator/health
curl -s http://localhost:8080/hello

curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"tenantId":"blog-cms","email":"user@example.com","password":"change-me"}'
```

## When not to use this file

On a VPS, use the split deploy path instead:

1. [deploy/prereqs](../../deploy/prereqs/README.md) — blog Mongo  
2. [deploy/](../../deploy/README.md) — applications  

That matches production: auth in its own repo, blog stack separate.

## Split-stack local testing

If auth and blog Mongo are already running (your usual test setup), follow the root [README.md](../../README.md) and [deploy/scripts/deploy.sh](../../deploy/scripts/deploy.sh) — do not start a second Mongo on 27017.
