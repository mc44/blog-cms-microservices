# 0-deploy

Docker Compose deploy for the blog CMS stack: Mongo prereqs, application images, and scripts. Auth runs from **[auth-service](https://github.com/mc44/auth-service)** (separate repo).

Local quickstart: [README.md](../README.md).

## 1. Clone

Assumes this repo is cloned. Deploy auth first: [auth-service deploy/README.md](https://github.com/mc44/auth-service/blob/main/deploy/README.md). Auth must be running on network `auth-platform` before `./scripts/deploy.sh`.

## 2. Configure

```bash
cd 0-deploy
cp .env.example .env
chmod 600 .env
```

| Variable | Purpose |
|----------|---------|
| `AUTH_SERVICE_URL` | Auth on `auth-platform` (e.g. `http://auth-service:8081`) |
| `AUTH_JWT_SECRET` | **Same as [auth-service](https://github.com/mc44/auth-service/blob/main/deploy/.env.example)** |
| `BLOG_TENANT_ID` | Login tenant; must exist in auth |
| `NEXT_PUBLIC_GATEWAY_URL` | Public gateway URL for frontend build |
| `CLOUDINARY_*` | Optional; omit for in-memory media dev |
| `KAFKA_ENABLED` | `false` by default; see [docs/kafka.md](../docs/kafka.md) |

Copy `AUTH_JWT_SECRET` from your auth server's env into this file.

## 3. Run / Deploy

### Local

```bash
./scripts/check-ports.sh prereqs
cd prereqs && docker compose up -d mongo && cd ..

chmod +x scripts/deploy.sh scripts/check-ports.sh
./scripts/deploy.sh
```

Requires networks **`auth-platform`** (auth) and **`cms-internal`** (mongo).

### Server (VPS)

1. Deploy [auth-service](https://github.com/mc44/auth-service) ([deploy/README.md](https://github.com/mc44/auth-service/blob/main/deploy/README.md)); verify `curl -s http://127.0.0.1:8081/actuator/health`
2. Start blog Mongo: `cd prereqs && docker compose up -d mongo`
3. Configure `0-deploy/.env` with production URLs
4. `./scripts/deploy.sh`

### Redeploy after git pull

`git pull` then `./scripts/deploy.sh`. Full pull/redeploy order (auth + env checks): root [README.md](../README.md) FAQ.

### Optional: all-in-one local stack

Single compose including auth build: [optional/all-in-one/README.md](./optional/all-in-one/README.md). Requires auth repo cloned per [auth-service README](https://github.com/mc44/auth-service/blob/main/README.md). Not for VPS.

## 4. Verify

```bash
./scripts/check-ports.sh all

curl -s http://localhost:8080/actuator/health
curl -s http://localhost:8080/hello

docker compose ps
# gateway, blog-service, media-service, audit-service, frontend → Up
```

Login and UI smoke test: root [README.md](../README.md) §4.

## Ports

| Port | Service |
|------|---------|
| 27018 | MongoDB (`blog` + `audit` DBs) |
| 8080 | gateway |
| 8082 | blog-service |
| 8083 | media-service |
| 8084 | audit-service |
| 3000 | frontend |

Auth uses **27017** and **8081** in [auth-service](https://github.com/mc44/auth-service) — do not bind those here.

## Related

- Mongo prereqs: [prereqs/README.md](./prereqs/README.md)
- Gateway routes: [1-gateway-service/README.md](../1-gateway-service/README.md)
- Learning: [docs/learning/01-deploy.md](../docs/learning/01-deploy.md)
