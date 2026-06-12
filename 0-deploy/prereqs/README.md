# Blog MongoDB and Redis

Data layer for **blog-cms** only. Auth Mongo stays in [auth-service](https://github.com/mc44/auth-service) (port **27017**).

| Service | Host port | Network hostname |
|---------|-----------|------------------|
| mongo | **27018** | `mongo` |
| redis | **6380** (optional profile) | `redis` |

Databases on this instance: `blog` (blog-service), `audit` (audit-service).

## 3. Run

```bash
cd 0-deploy/prereqs
docker compose up -d mongo
docker compose --profile redis up -d redis   # optional
```

Creates network **`cms-internal`**.

## 4. Verify

```bash
docker compose ps
mongosh "mongodb://127.0.0.1:27018" --eval 'db.adminCommand({ ping: 1 })'
# → { ok: 1 }
```

## Related

Deploy apps: [0-deploy/README.md](../README.md). Order: auth → mongo → `./scripts/deploy.sh`.
