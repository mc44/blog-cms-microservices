# blog-service

Manages posts, categories, tags, and revision snapshots. MongoDB logical database: **`blog`**.

- **Direct port:** 8082 (development and health checks)
- **Through gateway:** `http://localhost:8080/blog/...` — use this from the frontend and external clients

## API (service paths)

All routes are prefixed with `/blog`.

### Posts — `/blog/posts`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/blog/posts` | Create draft or post |
| GET | `/blog/posts` | List; query `status` (`DRAFT`, `PUBLISHED`, …), `authorId` |
| GET | `/blog/posts/{id}` | Get by id |
| PUT | `/blog/posts/{id}` | Update content, tags, media references |
| PATCH | `/blog/posts/{id}/status` | Change status (publish sets `publishedAt`) |
| DELETE | `/blog/posts/{id}` | Delete post |

### Categories — `/blog/categories`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/blog/categories` | Create category |
| GET | `/blog/categories` | List categories |

### Tags — `/blog/tags`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/blog/tags` | Create tag |
| GET | `/blog/tags` | List tags |

## Headers

When called via the gateway after login, these are set automatically:

| Header | Purpose |
|--------|---------|
| `X-Tenant-Id` | Tenant scope |
| `X-User-Id` | Author / actor |
| `X-Correlation-Id` | Request tracing |

## Side effects on publish / update / delete

When `AUDIT_ENABLED=true` (default in deploy), the service sends audit events to **audit-service** over HTTP (`AUDIT_SERVICE_URL`).

When `KAFKA_ENABLED=true`, it also publishes to topic `blog.domain.events`. See [docs/kafka.md](../docs/kafka.md).

## Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `BLOG_MONGODB_URI` | `mongodb://mongo:27017` | Mongo connection |
| `BLOG_MONGODB_DATABASE` | `blog` | Database name |
| `BLOG_TENANT_ID` | `blog-cms` | Default tenant |
| `MEDIA_SERVICE_URL` | `http://media-service:8083` | Validate media references |
| `AUDIT_SERVICE_URL` | `http://audit-service:8084` | HTTP audit ingest |
| `AUDIT_ENABLED` | `true` | Toggle HTTP audit calls |
| `KAFKA_ENABLED` | `false` | Toggle event publishing |
| `KAFKA_BOOTSTRAP_SERVERS` | `redpanda:9092` | Broker when Kafka enabled |

## Run locally

```bash
export BLOG_MONGODB_URI=mongodb://localhost:27018
export BLOG_MONGODB_DATABASE=blog
export MEDIA_SERVICE_URL=http://localhost:8083
export AUDIT_SERVICE_URL=http://localhost:8084
mvn spring-boot:run
```

Gateway route map: [gateway-service/README.md](../gateway-service/README.md).
