# Kafka / Redpanda

Blog CMS publishes domain events after successful MongoDB writes. **Redpanda** provides a Kafka-compatible broker with lower resource use than a full Kafka cluster on a small host.

Application code uses **Spring Kafka** (`spring-kafka`). Pointing `KAFKA_BOOTSTRAP_SERVERS` at Apache Kafka or a managed service later does not require code changes.

## Flow

1. `blog-service` persists the post.
2. With `AUDIT_ENABLED=true`, it calls audit-service over HTTP.
3. With `KAFKA_ENABLED=true`, it publishes JSON to topic **`blog.domain.events`**.
4. `audit-service` consumes the topic and appends to MongoDB database **`audit`**.

## Enable on a running stack

```bash
cd deploy/prereqs
docker compose --profile kafka up -d redpanda
```

In `deploy/.env`:

```bash
KAFKA_ENABLED=true
KAFKA_BOOTSTRAP_SERVERS=redpanda:9092
```

Redeploy applications:

```bash
cd deploy && ./scripts/deploy.sh
```

Default in `.env.example` is `KAFKA_ENABLED=false` so the stack runs without a broker.

## Event payload

```json
{
  "eventId": "uuid",
  "tenantId": "blog-cms",
  "eventType": "post.published",
  "actorId": "user-id",
  "resourceId": "post-id",
  "correlationId": "from-gateway-header",
  "title": "...",
  "status": "PUBLISHED",
  "slug": "..."
}
```

## Topic and event types

| Topic | Key | Notes |
|-------|-----|--------|
| `blog.domain.events` | `tenantId` | Single partition is sufficient for development |

| eventType | When |
|-----------|------|
| `post.published` | Post status becomes published |
| `post.updated` | Post content or metadata updated |
| `post.deleted` | Post removed |

Auth login events are **not** published from this repository; auth remains REST/JWT only.

## Resource notes

| Host RAM | Guidance |
|----------|----------|
| ~2 GB | Run Redpanda only when testing events; stop the profile when idle |
| 4 GB+ | Redpanda with `mem_limit: 512m` alongside the REST stack is reasonable |

Single-node Redpanda is for development and demos; production would use a managed or multi-broker cluster.
