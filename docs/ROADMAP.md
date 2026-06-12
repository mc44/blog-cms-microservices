# Build roadmap

Check off milestones as you complete them (see SYSTEM_DESIGN.md for product phases).

## R0 — Repo foundation

- [x] Monorepo scaffolding (numbered folders `0-deploy`–`5-audit-service`, `docs/`, `scripts/`)
- [x] SYSTEM_DESIGN markdown + MongoDB stance + Phase 1 runtime notes
- [x] Cursor rules / `.cursorignore`
- [x] Root README + this roadmap linked

## R1 — Local runtime shell

- [x] `0-deploy/optional/all-in-one/docker-compose.yml`: MongoDB + Redis + full stack demo
- [ ] Optional NGINX config in `0-deploy/nginx`
- [x] Smoke route `/hello`, actuator health

## R2 — Auth vertical slice

- [x] `auth-service` in [mc44/auth-service](https://github.com/mc44/auth-service) (JWT + MongoDB `auth`)
- [x] Gateway: validate JWT / route protection for protected paths

## R3 — Core domain (blog CMS)

- [x] `blog-service` + `media-service` (Cloudinary) + `audit-service` + gateway routes
- [x] Blog V1 CRUD + HTTP audit on publish
- [x] Correlate logs with `X-Correlation-Id` propagation

## R4 — Frontend shell

- [x] Next.js app in `3-frontend/`
- [x] Auth UX + posts editor against gateway APIs
- [x] Landing, public posts, author pages, light-first theme (mfajardosite alignment)

## R5 — Notifications (sync MVP)

- [ ] Optional email/on-publish hooks (deferred)

## R6 — Async & real-time (Phase 2)

- [x] Redpanda Compose profile (`0-deploy/prereqs`, `--profile kafka`)
- [x] Spring Kafka producer (blog) + consumer (audit), `KAFKA_ENABLED` toggle
- [ ] RabbitMQ for notification workers (deferred)

## R7 — WebSockets

- [ ] Real-time editor or publish notifications (deferred)

## R8 — Observability (Phase 3)

- [ ] Prometheus/Grafana/Loki/Zipkin Compose profile

## R9 — CI/CD

- [x] GitHub Actions with path-filtered pipelines
- [ ] Publish images per service + scripted VPS deploy commands
