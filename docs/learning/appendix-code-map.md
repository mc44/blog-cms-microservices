# Appendix — Code map

Quick index: **path → responsibility → who it calls**. Use with modules 00–09.

## Deploy and config

| Path | Responsibility | Calls / used by |
|------|----------------|-----------------|
| `0-deploy/prereqs/docker-compose.yml` | Blog Mongo, optional Redpanda (`kafka` profile) | Host 27018, network `cms-internal` |
| `0-deploy/docker-compose.yml` | Gateway, blog, media, audit, frontend | Reads `0-deploy/.env` |
| `0-deploy/scripts/deploy.sh` | Build and start app stack | Docker Compose |
| `0-deploy/.env.example` | Secret and feature flags template | Copied to `0-deploy/.env` |

## Gateway (`1-gateway-service`)

| Path | Responsibility | Calls |
|------|----------------|-------|
| `config/SecurityConfig.java` | JWT validation, public vs protected routes | `AUTH_JWT_SECRET` |
| `filter/CorrelationIdGatewayFilter.java` | `X-Correlation-Id` | All proxied routes |
| `filter/UserIdForwardingGatewayFilter.java` | JWT `sub` → `X-User-Id` | Downstream writes |
| `filter/TenantIdForwardingGatewayFilter.java` | JWT `tenantId` → `X-Tenant-Id` | Tenant-scoped services |
| `application.yml` | Route URIs | `AUTH_SERVICE_URL`, etc. |

## Blog (`2-blog-service`)

| Path | Responsibility | Calls |
|------|----------------|-------|
| `api/PostController.java` | REST `/blog/posts`, taxonomy | `PostService` |
| `service/PostService.java` | CRUD, publish, revisions | Mongo `blog`, `emitPostEvent` |
| `client/AuditClient.java` | Sync audit append | `http://audit-service:8084` |
| `client/MediaValidationClient.java` | Validate `mediaRefs` | `http://media-service:8083` |
| `messaging/BlogEventPublisher.java` | Kafka publish when enabled | Redpanda topic |

## Media (`4-media-service`)

| Path | Responsibility | Calls |
|------|----------------|-------|
| Upload controller / service | Store image metadata | Cloudinary or in-memory dev store |

## Audit (`5-audit-service`)

| Path | Responsibility | Calls |
|------|----------------|-------|
| `api/AuditController.java` | HTTP append and query | `AuditEventService` |
| `kafka/BlogDomainEventConsumer.java` | Consume `blog.domain.events` | Same append path when Kafka on |

## Frontend (`3-frontend`)

| Path | Responsibility | Calls |
|------|----------------|-------|
| `src/lib/api.ts` | Gateway HTTP client | `NEXT_PUBLIC_GATEWAY_URL` |
| `src/lib/auth.ts` | Login, token storage | `POST /auth/login` |
| `src/components/post-editor.tsx` | Author UI | `updatePost`, publish status |

## Auth ([auth-service](https://github.com/mc44/auth-service))

| Path | Responsibility | Calls |
|------|----------------|-------|
| Login API | Issue JWT | Mongo `auth` |

## Cross-cutting flows

| Flow | Entry | Chain |
|------|-------|-------|
| Login | Browser → gateway | auth-service → JWT |
| Publish post | `PostService.updateStatus` | Mongo → `AuditClient` → optional Kafka |
| Public read | `GET /blog/posts` | Gateway (no JWT) → blog Mongo |
| Audit read | `GET /audit/events` | Gateway (JWT) → audit Mongo |

See [09 — End-to-end publish trace](./09-end-to-end-publish-trace.md).
