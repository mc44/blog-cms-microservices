# audit-service

Append-only **audit trail** for blog CMS events.

## V1 (HTTP)

- `POST /audit/events` — append event (called by blog-service on publish/update/delete)
- `GET /audit/events?limit=50` — list recent events (JWT via gateway)

MongoDB logical database: **`audit`**, collection `audit_events`.

## Phase 2 (Kafka / Redpanda)

When `KAFKA_ENABLED=true`, consumes topic `blog.domain.events` from Redpanda and writes the same records. HTTP ingest remains available.

## Configuration

| Variable | Default |
|----------|---------|
| `AUDIT_MONGODB_URI` | `mongodb://mongo:27017` |
| `AUDIT_MONGODB_DATABASE` | `audit` |
| `KAFKA_ENABLED` | `false` |
| `KAFKA_BOOTSTRAP_SERVERS` | `redpanda:9092` |

Port **8084**.
