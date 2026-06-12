# Optional all-in-one local stack

Single Compose file for a one-command laptop demo. Builds auth from [auth-service](https://github.com/mc44/auth-service) plus all blog CMS services.

**Not for VPS.** Production uses [0-deploy/README.md](../../README.md) with separate auth and blog deploys.

## 3. Run

Clone and layout per [auth-service README](https://github.com/mc44/auth-service/blob/main/README.md), then from this repo root:

```bash
docker compose -f 0-deploy/optional/all-in-one/docker-compose.yml up --build -d
```

## 4. Verify

```bash
curl -s http://localhost:8080/actuator/health
curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"tenantId":"blog-cms","email":"user@example.com","password":"change-me"}'
```

Do **not** use this if auth and blog Mongo are already running on 8081/27018 — you would bind conflicting ports.
