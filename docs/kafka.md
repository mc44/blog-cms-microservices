# Kafka / Redpanda (blog CMS)

Blog CMS uses a **Kafka-compatible** broker (**Redpanda**) for domain events. Application code uses **Spring Kafka** — the same client API works with Apache Kafka or managed offerings.

## Flow

1. `blog-service` saves a post, then appends audit via HTTP (V1).
2. When `KAFKA_ENABLED=true`, `blog-service` also publishes JSON to topic **`blog.domain.events`**.
3. `audit-service` consumes the topic and writes to MongoDB `audit`.

## Local / VPS

```bash
cd deploy/prereqs
docker compose -f docker-compose.yml --profile kafka up -d redpanda
```

Set in `deploy/.env`:

```bash
KAFKA_ENABLED=true
KAFKA_BOOTSTRAP_SERVERS=redpanda:9092
```

Restart apps: `cd deploy && ./scripts/deploy.sh`

## Event shape

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

## Resume wording

“Event-driven blog publishing with Spring Kafka and a Kafka-compatible broker (Redpanda) on Docker Compose.”
