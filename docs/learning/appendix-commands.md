# Appendix — Command reference

Curl, mongosh, and docker log commands. Deploy steps: [01-deploy.md](./01-deploy.md) and [0-deploy/README.md](../../0-deploy/README.md).

Assumes repository root and stack running.

## Auth and JWT

```bash
export TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"tenantId":"blog-cms","email":"user@example.com","password":"change-me"}' \
  | jq -r '.accessToken')
echo "$TOKEN"
```

Protected call without token (expect **401**):

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:8080/blog/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"x","content":"y","status":"DRAFT","mediaRefs":[]}'
```

## Health

```bash
curl -s http://localhost:8080/actuator/health
curl -s http://localhost:8080/hello
```

## Blog API (via gateway)

```bash
curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"CLI post","content":"Body","status":"DRAFT","mediaRefs":[]}'

curl -s -X PATCH "http://localhost:8080/blog/posts/POST_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"status":"PUBLISHED"}'

curl -s 'http://localhost:8080/blog/posts?status=PUBLISHED'
```

With correlation id:

```bash
curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'X-Correlation-Id: learn-cli-001' \
  -H 'Content-Type: application/json' \
  -d '{"title":"Traced","content":"Body","status":"DRAFT","mediaRefs":[]}'
```

## Media upload

```bash
curl -s -X POST http://localhost:8080/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F 'file=@/path/to/image.jpg'
```

## Audit

```bash
curl -s 'http://localhost:8080/audit/events?limit=10' \
  -H "Authorization: Bearer $TOKEN"
```

## Mongo (host port 27018)

```bash
mongosh "mongodb://127.0.0.1:27018/blog" --eval 'db.posts.find().limit(3).pretty()'
mongosh "mongodb://127.0.0.1:27018/audit" --eval 'db.audit_events.find().sort({occurredAt:-1}).limit(5).pretty()'
```

## Logs

```bash
cd 0-deploy
docker compose logs -f gateway
docker compose --env-file 0-deploy/.env -f 0-deploy/docker-compose.yml logs -f blog-service audit-service
docker compose --env-file 0-deploy/.env -f 0-deploy/docker-compose.yml ps
```

Restart one service:

```bash
docker compose --env-file 0-deploy/.env -f 0-deploy/docker-compose.yml restart blog-service
```

## Frontend dev

```bash
cd 3-frontend
npm install
export NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
npm run dev
```

## Gateway JVM debug

```bash
cd 1-gateway-service
cp config/localhost.properties.example config/localhost.properties
mvn spring-boot:run
```

## Troubleshooting

```bash
./0-deploy/scripts/check-ports.sh all
lsof -i :8080
docker ps -a
```

## Related

- [01 — Deploy](./01-deploy.md)
- [08 — Kafka](./08-kafka-redpanda.md)
- [docs/kafka.md](../kafka.md)
