# 03 — Gateway service

## Goal

Spring Cloud Gateway as the edge: routing, JWT rules, correlation and identity headers.

## Prerequisites

[02 — Auth](./02-auth-sibling-repo.md) — valid `$TOKEN` from login.

## Concepts

**Filter order:** CorrelationId → UserId → TenantId → route predicate.

**Security (summary):**

| Pattern | Auth |
|---------|------|
| `/hello`, `/actuator/**`, `/auth/**` | Public |
| `GET /blog/**`, `GET /media/**` | Public |
| `POST /media/upload`, writes on `/blog/**` | JWT |
| `GET /audit/**` | JWT |

Gateway does not strip path prefixes. Downstream services trust `X-User-Id` / `X-Tenant-Id` on the internal network.

**JVM debug:** [1-gateway-service/README.md](../../1-gateway-service/README.md)

## Hands-on

```bash
curl -s http://localhost:8080/hello

curl -s 'http://localhost:8080/blog/posts?status=PUBLISHED'

curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:8080/blog/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"x","content":"y","status":"DRAFT","mediaRefs":[]}'

curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'X-Correlation-Id: learn-gw-001' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Gateway lab","content":"Body","status":"DRAFT","mediaRefs":[]}'
```

## Verify

Public GET succeeds without token. POST without token → **401**. POST with token → **201**.

## Checkpoint

1. Which filter sets `X-Correlation-Id` when the client omits it?
2. Can you list published posts without a JWT?
3. Which claim becomes `X-Tenant-Id`?
4. Where is `/auth/login` routed?
5. What happens if `AUTH_JWT_SECRET` differs from auth-service?

## Next

[04 — Blog service](./04-blog-service.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Gateway
