# 07 — Audit service

## Goal

Audit trail in Mongo `audit`, HTTP ingest from blog-service, reads via gateway.

## Prerequisites

[04 — Blog service](./04-blog-service.md) — publish a post first.

## Concepts

**Write path:** blog → `POST http://audit-service:8084/audit/events` directly (not via gateway).

**Read path:** browser → gateway `GET /audit/events` (JWT required).

**Fail-open:** audit down → blog publish still succeeds; warning logged.

## Hands-on

```bash
curl -s 'http://localhost:8080/audit/events?limit=5' \
  -H "Authorization: Bearer $TOKEN"

mongosh "mongodb://127.0.0.1:27018/audit" --eval 'db.audit_events.find().sort({occurredAt:-1}).limit(3).pretty()'
```

## Verify

Audit API returns events with `post.published` (or similar). Mongo `audit_events` has matching rows.

## Checkpoint

1. Which database holds audit rows?
2. Does blog require the gateway to write audit events?
3. What happens if audit-service is stopped during publish?
4. Is `POST /audit/events` public on the gateway?
5. What resource type is stored for blog events?

## Next

[08 — Kafka and Redpanda](./08-kafka-redpanda.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Audit
