# 02 — Auth sibling repository

## Goal

How [auth-service](https://github.com/mc44/auth-service) issues tokens and the gateway validates them across two repos. Auth does **not** use Kafka.

## Prerequisites

Stack running ([01 — Deploy](./01-deploy.md)).

## Concepts

**Login:** `POST /auth/login` through gateway with `tenantId`, `email`, `password`.

**JWT:** signed with `AUTH_JWT_SECRET` (same on auth and gateway). Gateway forwards `sub` → `X-User-Id`, `tenantId` → `X-Tenant-Id`.

**Tenant:** `BLOG_TENANT_ID` in `0-deploy/.env` must match login tenant.

| Symptom | Likely cause |
|---------|--------------|
| 401 on blog writes | Bad/missing JWT or wrong secret |
| Login ok, tenant errors | `BLOG_TENANT_ID` mismatch |
| Cannot reach auth | auth down or `auth-platform` missing |

Auth repo docs: [deploy/README.md](https://github.com/mc44/auth-service/blob/main/deploy/README.md), [GATEWAY_INTEGRATION.md](https://github.com/mc44/auth-service/blob/main/docs/GATEWAY_INTEGRATION.md).

## Hands-on

```bash
curl -s http://localhost:8081/actuator/health

curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"tenantId":"blog-cms","email":"user@example.com","password":"change-me"}'

export TOKEN="<accessToken>"
curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Auth test","content":"Hello","status":"DRAFT","mediaRefs":[]}'
```

## Verify

Login returns `accessToken`. Protected POST returns **201** with a post id.

## Checkpoint

1. Which service creates the JWT?
2. Which service validates JWT for `/blog/**` writes?
3. What header carries user id to blog-service?
4. Is auth-service inside the blog-cms Git tree?
5. Does auth-service publish to Redpanda?

## Next

[03 — Gateway service](./03-gateway-service.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Gateway
