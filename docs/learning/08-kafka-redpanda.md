# 08 — Kafka and Redpanda

## Goal

Optional async audit: Redpanda broker, Spring Kafka producer/consumer, `KAFKA_ENABLED` toggle.

## Prerequisites

[07 — Audit service](./07-audit-service.md).

## Concepts

**Flow:** blog persists → HTTP audit (always if `AUDIT_ENABLED`) → Kafka publish (if enabled) → audit consumer.

**Topic:** `blog.domain.events`. **Key:** `tenantId`.

**Both paths on:** same event may appear twice in audit (use idempotent `eventId` in production).

Ops reference: [docs/kafka.md](../kafka.md).

## Hands-on

### Default (HTTP only)

`KAFKA_ENABLED=false` in `0-deploy/.env` — publish a post, confirm audit via module 07.

### Enable Redpanda

```bash
cd 0-deploy/prereqs
docker compose --profile kafka up -d redpanda
```

In `0-deploy/.env`:

```bash
KAFKA_ENABLED=true
KAFKA_BOOTSTRAP_SERVERS=redpanda:9092
```

```bash
cd 0-deploy && ./scripts/deploy.sh
```

Publish a post; check audit events and container logs.

## Verify

With Kafka on, audit events appear and blog/audit logs show send/consume messages.

## Checkpoint

1. Default value of `KAFKA_ENABLED`?
2. Which class no-ops when Kafka is disabled?
3. Topic name?
4. Why Redpanda on a small VPS?
5. Duplicate audit rows when both HTTP and Kafka are on?

## Next

[09 — End-to-end publish trace](./09-end-to-end-publish-trace.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Blog, Audit
