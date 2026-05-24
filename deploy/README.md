# Deploy blog-cms on a server

Run from a **git clone** on the VPS. Application images are **built on the server** with Docker Compose. Auth runs from a **separate** `auth-service` clone — deploy that first.

## Prerequisites

- Docker Engine and Docker Compose v2
- Auth-service already running (network **`auth-platform`**, port **8081**)
- Git clone of this repository, e.g. `~/blog-cms` or `~/operations-workflow`

```bash
git clone https://github.com/<you>/<blog-cms-repo>.git
cd <repo>
```

## Check host ports

Blog-cms uses these **host** ports (auth uses **27017** and **8081** in its own repo — do not overlap):

| Port | Service |
|------|---------|
| 27018 | Blog MongoDB |
| 6380 | Blog Redis (optional) |
| 8080 | Gateway |
| 8082 | blog-service |
| 8083 | media-service |
| 8084 | audit-service |
| 3000 | frontend |

```bash
chmod +x deploy/scripts/check-ports.sh

./deploy/scripts/check-ports.sh prereqs    # before blog Mongo
./deploy/scripts/check-ports.sh apps       # before gateway stack (also run by deploy.sh)
./deploy/scripts/check-ports.sh all        # prereqs + apps
```

**Manual check:**

```bash
ss -tlnp | grep -E ':(27018|8080|8082|8083|8084|3000)\b'
```

If **8081** is in use, that is usually auth-service (expected after Step 1). If deploy fails, something else may be bound to the same port as in the table above — stop it or change the host side in `deploy/prereqs/docker-compose.yml` or `deploy/docker-compose.yml`.

### Step 1 — Auth-service (separate clone)

Clone and follow **only** the auth-service deploy guide:

**Sibling repo:** `../auth-service/deploy/README.md` (after moving auth out of this tree) or your auth GitHub repo deploy docs.

That starts auth Mongo, then the `auth-service` container.

Copy **`AUTH_JWT_SECRET`** from auth `deploy/.env` — you need the same value here.

Confirm:

```bash
curl -s http://127.0.0.1:8081/actuator/health
```

### Step 2 — Blog MongoDB (and optional Redis)

```bash
./deploy/scripts/check-ports.sh prereqs

cd deploy/prereqs
docker compose -f docker-compose.yml up -d mongo
# optional:
docker compose -f docker-compose.yml --profile redis up -d redis
```

[prereqs/README.md](prereqs/README.md) — blog database only (`blog`), host port **27018**, network **`cms-internal`**.

### Step 3 — Configure and start applications

```bash
cd deploy
cp .env.example .env
chmod 600 .env
```

| Variable | Purpose |
|----------|---------|
| `AUTH_SERVICE_URL` | e.g. `http://auth-service:8081` (gateway must join `auth-platform`) |
| `AUTH_JWT_SECRET` | **Same** as auth-service `deploy/.env` |
| `BLOG_TENANT_ID` | Tenant id sent on login and in JWT checks — **must exist in auth** |

**Tenant alignment:** `BLOG_TENANT_ID` must match a tenant registered in auth. Easiest path: set auth `AUTH_SEED_TENANT_ID` to the same value (e.g. `blog-cms`) before first auth startup, or use that tenant id when logging in. See auth deploy README — *What `AUTH_SEED_TENANT_ID` is for*.

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

`deploy.sh` runs `docker compose up -d --build` for gateway, blog-service, media-service, and frontend (no registry required).

Requires Docker network **`auth-platform`** (created when auth infrastructure starts).

## Containers in this repo

| Service | Port (host) |
|---------|-------------|
| gateway | 8080 |
| blog-service | 8082 |
| media-service | 8083 |
| audit-service | 8084 |
| frontend | 3000 |

## Architecture

```
auth-service repo              blog-cms repo (this)
┌──────────────────┐           ┌───────────────────┐
│ auth-platform    │           │ cms-internal      │
│  mongo (auth)    │           │  mongo (blog)     │
│  auth-service    │◄──────────│  gateway          │
└──────────────────┘           │  blog, media,     │
                               │  audit, frontend  │
                               └───────────────────┘
```

## Redeploy after `git pull`

```bash
cd deploy
git pull
./scripts/deploy.sh
```

Prereq Mongo is not rebuilt unless you change `deploy/prereqs`.

## Gateway ↔ auth

[../auth-service/docs/GATEWAY_INTEGRATION.md](../auth-service/docs/GATEWAY_INTEGRATION.md)

## Local all-in-one (monorepo dev)

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Single-machine development only; production should use the step order above.

## Kafka / Redpanda (optional)

```bash
cd deploy/prereqs
docker compose -f docker-compose.yml --profile kafka up -d redpanda
```

Set `KAFKA_ENABLED=true` in `deploy/.env` and redeploy apps. See [docs/kafka.md](../docs/kafka.md).

---

## Pending: CI/CD (GitHub Actions + GHCR)

Not required for clone-and-build on the VPS. Planned later:

1. **GitHub Actions** on `main`: build gateway, blog-service, media-service, frontend; push to **GHCR** with tags `:<git-sha>` and optionally `:latest`.
2. **Optional VPS job**: SSH, set `*_IMAGE_TAG` in `deploy/.env`, `docker compose pull` + `up -d`.
3. **Gate deploy** with a repo variable (e.g. `VPS_DEPLOY_ENABLED`) so public repos do not auto-deploy on every push until you opt in.
4. **Auth images** deploy from the **auth-service** repo workflow, not this repo.

Workflow stub: [.github/workflows/publish.yml](../.github/workflows/publish.yml) (build/push today; optional `deploy-vps` job exists but is off unless configured).
