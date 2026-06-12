# blog-service

Posts, categories, tags, and revision snapshots. MongoDB database **`blog`**.

Assumes repo cloned; API calls go through gateway at `:8080`.

## 2. Configure

| Variable | Default | Purpose |
|----------|---------|---------|
| `BLOG_MONGODB_URI` | `mongodb://mongo:27017` | Mongo connection |
| `BLOG_MONGODB_DATABASE` | `blog` | Database name |
| `BLOG_TENANT_ID` | `blog-cms` | Tenant scope |
| `MEDIA_SERVICE_URL` | `http://media-service:8083` | Validate media refs |
| `AUDIT_SERVICE_URL` | `http://audit-service:8084` | HTTP audit ingest |
| `AUDIT_ENABLED` | `true` | Toggle HTTP audit |
| `KAFKA_ENABLED` | `false` | Toggle event publishing |

Headers from gateway: `X-User-Id`, `X-Tenant-Id`, `X-Correlation-Id`.

### API (via gateway)

| Method | Path | Auth |
|--------|------|------|
| POST/PUT/PATCH/DELETE | `/blog/posts`, `/blog/categories`, `/blog/tags` | JWT |
| GET | `/blog/posts`, `/blog/categories`, `/blog/tags` | Public |

Publish (`PATCH .../status` → `PUBLISHED`) triggers HTTP audit and optional Kafka events.

## 3. Run

**Docker:** [0-deploy/scripts/deploy.sh](../0-deploy/scripts/deploy.sh)

**JVM:**

```bash
cd 2-blog-service
export BLOG_MONGODB_URI=mongodb://localhost:27018
export BLOG_MONGODB_DATABASE=blog
export MEDIA_SERVICE_URL=http://localhost:8083
export AUDIT_SERVICE_URL=http://localhost:8084
mvn spring-boot:run
```

## 4. Verify

```bash
# Login first (see root README), then:
export TOKEN="<accessToken>"

curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"Draft","content":"Body","status":"DRAFT","mediaRefs":[]}'
# → 201, note id

curl -s -X PATCH "http://localhost:8080/blog/posts/<POST_ID>/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"PUBLISHED"}'
# → 200

curl -s 'http://localhost:8080/blog/posts?status=PUBLISHED'
# → includes published post
```

## Related

- Gateway routes: [1-gateway-service/README.md](../1-gateway-service/README.md)
- Learning: [docs/learning/04-blog-service.md](../docs/learning/04-blog-service.md)
