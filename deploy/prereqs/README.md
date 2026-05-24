# Blog-cms Mongo and Redis

**Blog data only** — logical database `blog`. Authentication uses a separate **auth-service** deployment (see [../README.md](../README.md) step 1).

| Container (typical) | Image | Host port | Hostname on `cms-internal` |
|---------------------|-------|-----------|----------------------------|
| `cms-data-mongo-1` | `mongo:7` | **27018** → 27017 | `mongo` |
| `cms-data-redis-1` | `redis:7-alpine` | **6380** → 6379 | `redis` |

Port mapping avoids clashing with auth-service Mongo on host `27017` when both run on one VPS.

## VPS

```bash
cd /opt/blog-cms/deploy/prereqs
docker compose -f docker-compose.yml up -d mongo
docker compose -f docker-compose.yml --profile redis up -d redis   # optional
```

## Verify

```bash
docker compose -f docker-compose.yml ps
mongosh "mongodb://127.0.0.1:27018" --eval 'db.adminCommand({ ping: 1 })'
```

## Before starting blog apps

1. [../README.md](../README.md) step 1 — auth-service running (`auth-platform` network exists).
2. This stack (mongo on `cms-internal`).
3. [../README.md](../README.md) step 3 — gateway, blog, media, frontend.
