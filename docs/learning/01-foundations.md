# 01 - Foundations: Minimum Runnable Setup

This level gets you to a running baseline with the current Phase 1 architecture:

- `gateway-service` (as Compose service `gateway`)
- `mongo`
- `redis`

No Kafka or RabbitMQ yet. That is intentional for a stable starting point.

## Why this matters

A good microservices engineer knows how to start simple, verify assumptions, and grow architecture in controlled steps. This foundation is your operating baseline for every future level.

## Prerequisites

From your machine:

- Docker is installed and running.
- Docker Compose v2 is available via `docker compose`.
- Ports `8080`, `27017`, and `6379` are free.
- You are in the repository root.

## Step-by-step setup

### Step 1: Move to the repository root

```bash
cd /path/to/blog-cms-microservices
```

### Step 2: Configure secrets (Docker deploy path)

For the full blog stack, use `deploy/.env` (copy from `deploy/.env.example`). Do not commit `.env` or `.env.local`.

For this learning step (all-in-one compose under `infrastructure/docker/`), defaults in compose are enough unless you override JWT vars via shell or a **local, gitignored** env file.

### Step 3: Start the Phase 1 stack

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

What this does:

- pulls `mongo:7` and `redis:7-alpine` if needed
- builds `gateway-service` image from `gateway-service/Dockerfile`
- starts all three services with dependency order (`mongo` health, then `gateway`)

### Step 4: Verify containers are healthy

Open a second terminal in the repo root and run:

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

You should see `mongo`, `redis`, and `gateway` running.

### Step 5: Run smoke checks

```bash
curl -i http://localhost:8080/hello
curl -i http://localhost:8080/actuator/health
```

Expected:

- `/hello` returns a successful response
- `/actuator/health` returns health status from gateway

### Step 6: Inspect logs like an operator

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs -f gateway
```

Stop log streaming with `Ctrl+C`.

### Step 7: Stop cleanly

```bash
docker compose -f infrastructure/docker/docker-compose.yml down
```

If you also want to remove volumes for a clean reset:

```bash
docker compose -f infrastructure/docker/docker-compose.yml down -v
```

## Troubleshooting quick guide

### Port already in use

Symptom: startup fails with a bind/port error.

```bash
lsof -i :8080
lsof -i :27017
lsof -i :6379
```

Stop conflicting processes, then retry `docker compose ... up --build`.

### Gateway build fails

Symptom: Compose fails while building `gateway`.

Actions:

1. Check that `gateway-service/Dockerfile` exists.
2. Re-run with fresh build output:

```bash
docker compose -f infrastructure/docker/docker-compose.yml build --no-cache gateway
docker compose -f infrastructure/docker/docker-compose.yml up
```

### Mongo healthcheck keeps failing

Symptom: `gateway` waits because `mongo` is unhealthy.

Actions:

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs mongo
docker compose -f infrastructure/docker/docker-compose.yml restart mongo
```

## Checkpoint A: prove your understanding

You are ready for the next level when you can explain:

- why Phase 1 uses only gateway + MongoDB + Redis
- why Kafka and RabbitMQ are deferred
- what each current service is responsible for
- how to verify health without guessing

## Mini exercises (do not skip)

1. Bring the stack up from scratch without looking at this file.
2. Stop only `gateway`, restart it, and re-run smoke checks.
3. Tear everything down, bring it back up, and validate again.
4. Write a short note: "What failed first and how I diagnosed it."

## Upskill prompt

Skill to build this week: operational discipline.

If you can start, verify, observe, and recover this baseline confidently, you are already practicing production-grade habits.
