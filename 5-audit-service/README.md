# audit-service

Append-only audit trail for blog actions. MongoDB database **`audit`**, collection `audit_events`.

Assumes repo cloned; reads via gateway, writes from blog-service internally.

## 2. Configure

| Variable | Default | Purpose |
|----------|---------|---------|
| `AUDIT_MONGODB_URI` | `mongodb://mongo:27017` | Mongo connection |
| `AUDIT_MONGODB_DATABASE` | `audit` | Database name |
| `AUDIT_DEFAULT_TENANT_ID` | `blog-cms` | Default tenant filter |
| `KAFKA_ENABLED` | `false` | Kafka consumer |
| `KAFKA_BOOTSTRAP_SERVERS` | `redpanda:9092` | Broker when enabled |

## 3. Run

**Docker:** [0-deploy/scripts/deploy.sh](../0-deploy/scripts/deploy.sh)

**JVM:**

```bash
cd 5-audit-service
export AUDIT_MONGODB_URI=mongodb://localhost:27018
export AUDIT_MONGODB_DATABASE=audit
mvn spring-boot:run
```

## 4. Verify

After publishing a post (see [2-blog-service/README.md](../2-blog-service/README.md)):

```bash
export TOKEN="<accessToken>"

curl -s "http://localhost:8080/audit/events?limit=10" \
  -H "Authorization: Bearer $TOKEN"
# → JSON array with post.published (or similar) events
```

## Ingest paths

1. **HTTP (default):** blog-service → `POST /audit/events` when `AUDIT_ENABLED=true`
2. **Kafka (optional):** consumes `blog.domain.events` when `KAFKA_ENABLED=true`. See [docs/kafka.md](../docs/kafka.md)

## Related

- Learning: [docs/learning/07-audit-service.md](../docs/learning/07-audit-service.md)
