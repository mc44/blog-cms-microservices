# 04 — Blog service

## Goal

Posts CRUD, publish flow, and side effects (HTTP audit, optional Kafka).

## Prerequisites

[03 — Gateway](./03-gateway-service.md) — `$TOKEN` from login.

## Concepts

**Author:** `authorId` from gateway `X-User-Id`.

**Publish:** `PATCH /blog/posts/{id}/status` → `PUBLISHED` sets `publishedAt`, calls `emitPostEvent`:
1. `AuditClient` HTTP to audit-service (fail-open)
2. `BlogEventPublisher` to Kafka when `KAFKA_ENABLED=true`

**Media refs:** validated against media-service before save.

**Revisions:** snapshot stored on meaningful changes.

## Hands-on

```bash
curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learning post","content":"Draft body","status":"DRAFT","mediaRefs":[]}'

curl -s -X PATCH "http://localhost:8080/blog/posts/<POST_ID>/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"PUBLISHED"}'

curl -s 'http://localhost:8080/blog/posts?status=PUBLISHED'

mongosh "mongodb://127.0.0.1:27018/blog" --eval 'db.posts.find().pretty()'
```

## Verify

Publish returns **200**. Public list includes the post. Mongo `posts` collection has the document.

## Checkpoint

1. Where does `authorId` on a new post come from?
2. What runs when status changes to `PUBLISHED`?
3. Does blog-service call audit via gateway or directly?
4. What does `BlogEventPublisher` do when `kafka.enabled` is false?
5. Why validate `mediaRefs` before save?

## Next

[05 — Frontend](./05-frontend.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Blog
