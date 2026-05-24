# 11 - Upgrade R8-R9: Observability and Deploy Hardening

Roadmap alignment: `R8` and `R9` in `docs/ROADMAP.md`

## Objective and architecture delta

Make the system operable and deployable with confidence:

- observability profile (metrics, logs, traces)
- CI/CD hardening for multi-service image publishing and scoped deploy
- practical deployment runbook with rollback awareness

## Entry criteria

- `10-upgrade-r7-realtime-updates.md` completed
- core services and async/realtime flows working end to end
- baseline reliability checks already practiced

## Step-by-step implementation order

1. Define minimum operational signals:
   - API latency/error rate
   - queue lag/processing failures
   - service health and restart patterns
2. Add observability stack profile:
   - Prometheus + Grafana
   - Loki for logs
   - Zipkin or OTLP-compatible tracing
3. Ensure correlation-aware telemetry from gateway through services.
4. Create at least one dashboard per major concern:
   - traffic and errors
   - async worker health
   - realtime delivery indicators
5. Extend CI/CD workflows for per-service image publishing.
6. Add scripted deploy steps for VPS rollout and health validation.
7. Define rollback decision points and operational checklist.

## Commands to run

Baseline stack:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Once observability profile exists, run with explicit profile/override (example):

```bash
docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.observability.yml up --build
```

Validate service health after deploy:

```bash
curl -i http://localhost:8080/actuator/health
```

## Verification checklist

- dashboards render actionable system health signals
- logs and traces can follow one request across components
- CI pipeline builds only impacted services where possible
- deployment procedure includes post-deploy health checks

## Failure injection drill

Drill: simulate degraded dependency or bad release.

Expected:

- observability stack surfaces degradation quickly
- rollback procedure is executed with clear decision criteria
- post-rollback health returns to expected baseline

Recovery task:

- document timeline, root cause, and mitigation actions

## Definition of done

- observability stack is live and useful for troubleshooting
- CI/CD can publish and deploy with scoped operations
- rollback runbook exists and is tested at least once
- operational documentation is clear enough for another engineer to execute

## Portfolio evidence checklist

- dashboard screenshots (latency, errors, queue health)
- trace screenshot across gateway and at least one downstream service
- sample CI run showing targeted builds
- deployment/rollback runbook excerpt

## Upskill prompt

Write a brief postmortem from your failure drill focused on detection speed, diagnosis quality, and prevention actions.
