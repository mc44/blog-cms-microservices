# Blog CMS

Blog CMS is a multi-service application: a Spring Cloud Gateway fronts blog, media, and audit APIs, and a Next.js app provides the public site and editor. Authentication lives in a separate **[auth-service](https://github.com/mc44/auth-service)** repository.

Architecture reference: [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md). Milestones: [docs/ROADMAP.md](./docs/ROADMAP.md).

## Repository layout

| Repository | Contents |
|------------|----------|
| **auth-service** (sibling clone) | Login, JWT, MongoDB database `auth` |
| **blog-cms-microservices** (this repo) | Gateway, blog, media, audit, frontend, deploy |

```text
parent/
├── auth-service/
└── blog-cms-microservices/
```

## Services and ports

| Service | Port | Notes |
|---------|------|--------|
| gateway-service | 8080 | Single public API entry (browser and `curl`) |
| blog-service | 8082 | Posts, categories, tags |
| media-service | 8083 | Image upload (Cloudinary or dev fallback) |
| audit-service | 8084 | Audit trail |
| frontend | 3000 | Next.js UI |
| MongoDB (blog stack) | 27018 | Host port; logical DBs `blog` and `audit` |

Auth uses **8081** and Mongo **27017** in the auth-service deployment — do not reuse those ports for the blog stack.

---

## Run locally (for testing the site)

These steps assume **auth-service is already running** (reachable at `http://localhost:8081`) and **blog MongoDB is already running** (this repo’s `deploy/prereqs` Mongo on host port **27018**). If Mongo is not up yet, start it once:

```bash
cd deploy/prereqs
docker compose up -d mongo
```

### 1. Configure environment

```bash
cd deploy
cp .env.example .env
```

Edit `deploy/.env`:

| Variable | Requirement |
|----------|-------------|
| `AUTH_JWT_SECRET` | **Must match** the value in auth-service `deploy/.env` |
| `BLOG_TENANT_ID` | Must match a tenant that exists in auth (default `blog-cms` if you used auth seed defaults) |
| `AUTH_SERVICE_URL` | `http://auth-service:8081` when gateway runs in Docker on `auth-platform`; use auth’s deploy docs if your auth hostname differs |
| `NEXT_PUBLIC_GATEWAY_URL` | `http://localhost:8080` for local frontend |

Cloudinary variables are optional; without them, media-service stores uploads in memory for development.

Docker networks **`auth-platform`** (from auth deploy) and **`cms-internal`** (from blog prereqs) must exist before starting apps.

### 2. Start the blog stack

From the repository root:

```bash
chmod +x deploy/scripts/deploy.sh deploy/scripts/check-ports.sh
./deploy/scripts/deploy.sh
```

This builds and starts gateway, blog-service, media-service, audit-service, and frontend.

### 3. Start the frontend in dev mode (optional)

If you prefer hot reload instead of the Dockerized frontend:

```bash
cd frontend
npm install
export NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
npm run dev
```

Open **http://localhost:3000** (or port 3000 from Compose if you skipped this step).

### 4. Sign in and smoke-test

Default seeded user (when auth was started with its default seed):

- Email: `user@example.com`
- Password: `change-me`
- Tenant: same as `BLOG_TENANT_ID` in `deploy/.env` (e.g. `blog-cms`)

Quick checks:

```bash
curl -s http://localhost:8080/actuator/health
curl -s http://localhost:8080/hello

curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"tenantId":"blog-cms","email":"user@example.com","password":"change-me"}'
```

Then use the UI: **Login** → create a post → publish → view **Posts**.

### 5. Run gateway on the host (alternative)

If blog services run in Docker but you want the gateway under `mvn`:

```bash
cd gateway-service
cp config/localhost.properties.example config/localhost.properties
# Set AUTH_JWT_SECRET to match auth; URLs already point at localhost:8081–8084
mvn spring-boot:run
```

See [gateway-service/README.md](./gateway-service/README.md) for the full route map.

---

## Optional: Kafka / Redpanda

Event publishing is off by default (`KAFKA_ENABLED=false`). To enable: [docs/kafka.md](docs/kafka.md).

---

## Deploy on a server

Production-style steps (two clones, build on server): [deploy/README.md](deploy/README.md).

---

## Module documentation

| Path | Topic |
|------|--------|
| [gateway-service/README.md](./gateway-service/README.md) | Routes, JWT rules, headers |
| [blog-service/README.md](./blog-service/README.md) | Post and taxonomy APIs |
| [media-service/README.md](./media-service/README.md) | Uploads and Cloudinary |
| [audit-service/README.md](./audit-service/README.md) | Audit HTTP and Kafka consumer |
| [frontend/README.md](./frontend/README.md) | Next.js dev and env vars |
| [deploy/prereqs/README.md](./deploy/prereqs/README.md) | Blog MongoDB and Redis |
| [infrastructure/docker/README.md](./infrastructure/docker/README.md) | All-in-one Compose (includes auth) |
| [docs/kafka.md](docs/kafka.md) | Redpanda profile and events |
