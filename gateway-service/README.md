# gateway-service

Spring Cloud Gateway on port **8080**. All browser and API clients should call the gateway, not individual services directly.

Validates JWTs (shared `AUTH_JWT_SECRET` with auth-service) and forwards identity headers to downstream services:

| Header | Source |
|--------|--------|
| `X-User-Id` | JWT `sub` |
| `X-Tenant-Id` | JWT tenant claim |
| `X-Correlation-Id` | Incoming request or generated |

## Upstream routes

| Gateway path | Upstream (default) | Service |
|--------------|-------------------|---------|
| `/auth/**` | `http://auth-service:8081` | auth-service (sibling repo) |
| `/blog/**` | `http://blog-service:8082` | blog-service |
| `/media/**` | `http://media-service:8083` | media-service |
| `/audit/**` | `http://audit-service:8084` | audit-service |

Override upstreams with environment variables: `AUTH_SERVICE_URL`, `BLOG_SERVICE_URL`, `MEDIA_SERVICE_URL`, `AUDIT_SERVICE_URL`.

### Gateway-owned endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/hello` | Public | Smoke test |
| GET | `/actuator/health` | Public | Health |
| GET | `/protected/example` | JWT required | Sample protected route |

---

## Downstream API map (via gateway)

Paths below are the **public URL** on port 8080. Upstream services use the same path prefix.

### Auth (`/auth/**` → auth-service)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/login` | Public | Login; body: `tenantId`, `email`, `password` |
| POST | `/auth/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Public | Revoke refresh token |

Auth API details: [auth-service docs](https://github.com/mc44/auth-service) (sibling clone: `../auth-service/docs/GATEWAY_INTEGRATION.md`).

### Blog (`/blog/**` → blog-service)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/blog/posts` | Public | List posts; query `status`, `authorId` |
| GET | `/blog/posts/{id}` | Public | Get one post |
| POST | `/blog/posts` | JWT | Create post |
| PUT | `/blog/posts/{id}` | JWT | Update post |
| PATCH | `/blog/posts/{id}/status` | JWT | Change status (e.g. publish) |
| DELETE | `/blog/posts/{id}` | JWT | Delete post |
| GET | `/blog/categories` | Public | List categories |
| POST | `/blog/categories` | JWT | Create category |
| GET | `/blog/tags` | Public | List tags |
| POST | `/blog/tags` | JWT | Create tag |

### Media (`/media/**` → media-service)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/media/upload` | JWT | Multipart image upload |
| GET | `/media/{publicId}` | Public | Resolve media metadata |

### Audit (`/audit/**` → audit-service)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/audit/events` | JWT | List recent audit events (`limit` query param) |
| POST | `/audit/events` | Not required at gateway | Append event (blog-service calls directly on the Docker network in deploy) |

---

## Security rules (gateway)

Configured in `SecurityConfig`:

- **Public:** `/hello`, `/actuator/**`, `/auth/**`
- **Public reads:** `GET /blog/**`, `GET /media/**` (except upload)
- **JWT required:** `POST /media/upload`; all `POST`, `PUT`, `PATCH`, `DELETE` on `/blog/**`; `GET /audit/**`

Send `Authorization: Bearer <accessToken>` for protected routes.

---

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `AUTH_SERVICE_URL` | `http://auth-service:8081` | Auth upstream |
| `BLOG_SERVICE_URL` | `http://blog-service:8082` | Blog upstream |
| `MEDIA_SERVICE_URL` | `http://media-service:8083` | Media upstream |
| `AUDIT_SERVICE_URL` | `http://audit-service:8084` | Audit upstream |
| `AUTH_JWT_SECRET` | — | **Required**; must match auth-service |
| `BLOG_TENANT_ID` | `blog-cms` | Default tenant for JWT validation context |

CORS allows `http://localhost:3000` for the Next.js dev server.

---

## Run locally (JVM)

Prerequisites: auth on **8081**, blog/media/audit on **8082–8084**, matching `AUTH_JWT_SECRET`.

```bash
cp config/localhost.properties.example config/localhost.properties
# Edit AUTH_JWT_SECRET if needed
mvn spring-boot:run
```

- Health: http://localhost:8080/actuator/health  
- Smoke: http://localhost:8080/hello  

## Run in Docker

Started by [deploy/scripts/deploy.sh](../deploy/scripts/deploy.sh). See [deploy/README.md](../deploy/README.md).
