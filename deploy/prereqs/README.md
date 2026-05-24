# Blog MongoDB and Redis

Data layer for **blog-cms** only. Authentication data stays in auth-service’s MongoDB (host port **27017**).

| Service | Image | Host port | Docker network hostname |
|---------|-------|-----------|-------------------------|
| mongo | `mongo:7` | **27018** → 27017 | `mongo` |
| redis | `redis:7-alpine` | **6380** → 6379 | `redis` (optional profile) |

Port **27018** avoids conflicting with auth Mongo on the same machine.

Logical databases on this instance:

| Database | Used by |
|----------|---------|
| `blog` | blog-service |
| `audit` | audit-service |

## Start

```bash
cd deploy/prereqs
docker compose up -d mongo
docker compose --profile redis up -d redis   # optional
```

Creates external network **`cms-internal`** (used by `deploy/docker-compose.yml`).

## Verify

```bash
docker compose ps
mongosh "mongodb://127.0.0.1:27018" --eval 'db.adminCommand({ ping: 1 })'
```

## Order with auth

1. auth-service running (`auth-platform` network exists)
2. This stack (mongo on `cms-internal`)
3. [deploy/scripts/deploy.sh](../scripts/deploy.sh) for gateway and apps

Local quick start: [README.md](../../README.md).
