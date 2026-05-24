# 04 - Command Reference

This is your repeat-use command sheet for local learning and iteration.

All commands assume repository root:

```bash
cd /Users/marcfajardo/operations-workflow
```

## Phase 1 baseline commands

### Optional env file

```bash
cp .env.example .env.local
```

### Start stack

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

### Start stack in detached mode

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d --build
```

### View running services

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

### Stop and remove containers

```bash
docker compose -f infrastructure/docker/docker-compose.yml down
```

### Stop and remove containers plus volumes

```bash
docker compose -f infrastructure/docker/docker-compose.yml down -v
```

## Health and smoke checks

### Gateway hello endpoint

```bash
curl -i http://localhost:8080/hello
```

### Gateway actuator health

```bash
curl -i http://localhost:8080/actuator/health
```

### Quick port reachability checks

```bash
nc -z localhost 8080
nc -z localhost 27017
nc -z localhost 6379
```

## Logs and diagnostics

### Tail all logs

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs -f
```

### Tail gateway logs only

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs -f gateway
```

### Tail Mongo logs only

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs -f mongo
```

### Tail Redis logs only

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs -f redis
```

### Restart a single service

```bash
docker compose -f infrastructure/docker/docker-compose.yml restart gateway
```

## Build and image maintenance

### Rebuild gateway without cache

```bash
docker compose -f infrastructure/docker/docker-compose.yml build --no-cache gateway
```

### Pull latest base images

```bash
docker compose -f infrastructure/docker/docker-compose.yml pull
```

## Local troubleshooting helpers

### Check what is using a port

```bash
lsof -i :8080
lsof -i :27017
lsof -i :6379
```

### Docker container summary

```bash
docker ps -a
```

### Docker system disk usage

```bash
docker system df
```

## Frontend (when you reach Level 3)

From `frontend/`:

```bash
npm install
npm run dev
```

## Per-upgrade quick commands

### R2 Auth vertical slice (`05-upgrade-r2-auth-vertical-slice.md`)

```bash
curl -i -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"change-me"}'
```

```bash
curl -i http://localhost:8080/protected/example \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### R3 Core domain (`06-upgrade-r3-core-domain-services.md`)

```bash
curl -i -X POST http://localhost:8080/incidents \
  -H "Content-Type: application/json" \
  -H "X-Correlation-Id: demo-r3-001" \
  -d '{"title":"Database latency spike","priority":"HIGH"}'
```

```bash
curl -i -X POST http://localhost:8080/tasks \
  -H "Content-Type: application/json" \
  -H "X-Correlation-Id: demo-r3-001" \
  -d '{"incidentId":"<INCIDENT_ID>","title":"Investigate query plan","assignee":"oncall-user"}'
```

### R4 Frontend integration (`07-upgrade-r4-frontend-integration.md`)

```bash
cd frontend
npm install
npm run dev
```

### R5 Notifications sync MVP (`08-upgrade-r5-notifications-sync-mvp.md`)

```bash
curl -i -X POST http://localhost:8080/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"channel":"IN_APP","recipient":"oncall-user","message":"Incident escalated"}'
```

### R6 Async backbone (`09-upgrade-r6-async-backbone.md`)

Phase 1 default remains minimal. Enable Phase 2 via override/profile once available:

```bash
docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.phase2.yml up --build
```

### R7 Realtime updates (`10-upgrade-r7-realtime-updates.md`)

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
cd frontend
npm run dev
```

### R8-R9 Observability and deploy hardening (`11-upgrade-r8-r9-observability-deploy-hardening.md`)

Once observability override/profile exists:

```bash
docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.observability.yml up --build
```

## Daily run workflow (recommended)

```bash
docker compose -f infrastructure/docker/docker-compose.yml up -d --build
docker compose -f infrastructure/docker/docker-compose.yml ps
curl -i http://localhost:8080/actuator/health
docker compose -f infrastructure/docker/docker-compose.yml logs -f gateway
```

When done:

```bash
docker compose -f infrastructure/docker/docker-compose.yml down
```
