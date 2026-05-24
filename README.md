# Blog CMS

Microservice **blog CMS**: posts, media (Cloudinary), audit trail, and a Next.js editor. Architecture details in [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) and [docs/ROADMAP.md](./docs/ROADMAP.md).

## Repositories

| Repo | Role |
|------|------|
| **[auth-service](https://github.com/mc44/auth-service#)** (sibling clone) | Login, JWT, Mongo `auth` |
| **blog-cms** (this repo) | Gateway, blog, media, audit, frontend |

Clone both into the same parent folder for local development:

```text
parent/
├── auth-service/
└── blog-cms/    # this repository (rename from operations-workflow)
```

## Module map

| Module | Port | Responsibility |
|--------|------|----------------|
| `gateway-service` | 8080 | Routing, JWT, correlation IDs |
| `blog-service` | 8082 | Posts, drafts, publish, revisions |
| `media-service` | 8083 | Cloudinary uploads |
| `audit-service` | 8084 | Audit trail (HTTP + optional Kafka) |
| `frontend` | 3000 | Public blog + CMS UI |

## Quick start (local)

1. Start auth from sibling repo: [../auth-service/deploy/README.md](../auth-service/deploy/README.md)
2. Blog stack:

```bash
cd deploy/prereqs && docker compose up -d mongo
cd ../..
cp deploy/.env.example deploy/.env   # set AUTH_JWT_SECRET, Cloudinary optional
./deploy/scripts/deploy.sh
```

3. Frontend dev:

```bash
cd frontend && npm install && npm run dev
```

Or all-in-one (requires sibling `auth-service`):

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

## Async events (optional)

See [docs/kafka.md](docs/kafka.md) — Redpanda profile on `deploy/prereqs`, `KAFKA_ENABLED=true`.

## VPS deploy

[deploy/README.md](deploy/README.md)
