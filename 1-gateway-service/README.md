# gateway-service

Spring Cloud Gateway on port **8080**. Single public API entry for browser and `curl`. Validates JWTs and forwards identity headers.

Assumes repo cloned; see [README.md](../README.md).

## 2. Configure

Set in `0-deploy/.env` (Docker) or `config/localhost.properties` (JVM):

| Variable | Default | Purpose |
|----------|---------|---------|
| `AUTH_JWT_SECRET` | — | **Required**; must match [auth-service](https://github.com/mc44/auth-service/blob/main/deploy/.env.example) |
| `AUTH_SERVICE_URL` | `http://auth-service:8081` | Auth upstream |
| `BLOG_SERVICE_URL` | `http://blog-service:8082` | Blog upstream |
| `MEDIA_SERVICE_URL` | `http://media-service:8083` | Media upstream |
| `AUDIT_SERVICE_URL` | `http://audit-service:8084` | Audit upstream |
| `BLOG_TENANT_ID` | `blog-cms` | Tenant context |

Forwarded headers: `X-User-Id` (JWT `sub`), `X-Tenant-Id`, `X-Correlation-Id`.

### Routes

| Path | Upstream | Auth |
|------|----------|------|
| `/auth/**` | auth-service | Public |
| `/blog/**` | blog-service | GET public; writes JWT |
| `/media/**` | media-service | GET public; upload JWT |
| `/audit/**` | audit-service | JWT |
| `/hello`, `/actuator/**` | gateway | Public |

Blog, media, audit API detail: [2-blog-service/README.md](../2-blog-service/README.md), [4-media-service/README.md](../4-media-service/README.md), [5-audit-service/README.md](../5-audit-service/README.md).

## 3. Run

**Docker (default):** [0-deploy/scripts/deploy.sh](../0-deploy/scripts/deploy.sh)

**JVM (debug):**

```bash
cd 1-gateway-service
cp config/localhost.properties.example config/localhost.properties
# Set AUTH_JWT_SECRET; upstream URLs point at localhost:8081–8084
mvn spring-boot:run
```

Prerequisites: auth on **8081**, blog/media/audit on **8082–8084**.

## 4. Verify

```bash
curl -s http://localhost:8080/hello
# → greeting text

curl -s 'http://localhost:8080/blog/posts?status=PUBLISHED'
# → JSON array (may be empty)

curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:8080/blog/posts \
  -H 'Content-Type: application/json' -d '{"title":"x","content":"y","status":"DRAFT","mediaRefs":[]}'
# → 401
```

With token from login:

```bash
curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Test","content":"Body","status":"DRAFT","mediaRefs":[]}'
# → 201 with post id
```

## Related

- Gateway–auth–JWT FAQ: [README.md](../README.md) (FAQ section)
- Learning: [docs/learning/03-gateway-service.md](../docs/learning/03-gateway-service.md)
- Auth integration: [GATEWAY_INTEGRATION.md](https://github.com/mc44/auth-service/blob/main/docs/GATEWAY_INTEGRATION.md)
