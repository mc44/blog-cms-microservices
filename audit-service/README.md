# audit-service

Append-only audit trail for blog actions (publish, update, delete). MongoDB logical database: **`audit`**, collection `audit_events`.

- **Direct port:** 8084
- **Through gateway:** `http://localhost:8080/audit/...` (read via gateway only)

## API

| Method | Path | Caller | Description |
|--------|------|--------|-------------|
| POST | `/audit/events` | blog-service (internal) | Append event |
| GET | `/audit/events` | Clients via gateway (JWT) | List events; query `limit` (default 50) |

Event fields include `tenantId`, `eventType`, `eventId`, `occurredAt`, `actorId`, `resourceType`, `resourceId`, `correlationId`, and a JSON `payload`.

## Ingest paths

1. **HTTP (default):** blog-service calls `POST /audit/events` after successful writes when `AUDIT_ENABLED=true`.
2. **Kafka (optional):** when `KAFKA_ENABLED=true`, consumes topic `blog.domain.events` from Redpanda and writes the same records. HTTP ingest remains available.

See [docs/kafka.md](../docs/kafka.md).

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `AUDIT_MONGODB_URI` | `mongodb://mongo:27017` | Mongo connection |
| `AUDIT_MONGODB_DATABASE` | `audit` | Database name |
| `AUDIT_DEFAULT_TENANT_ID` | `blog-cms` | Default tenant filter |
| `KAFKA_ENABLED` | `false` | Enable Kafka consumer |
| `KAFKA_BOOTSTRAP_SERVERS` | `redpanda:9092` | Broker address |

## Run locally

```bash
export AUDIT_MONGODB_URI=mongodb://localhost:27018
export AUDIT_MONGODB_DATABASE=audit
mvn spring-boot:run
```

Example read (with gateway and login token):

```bash
curl -s "http://localhost:8080/audit/events?limit=10" \
  -H "Authorization: Bearer <access_token>"
```
