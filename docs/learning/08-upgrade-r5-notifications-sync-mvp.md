# 08 - Upgrade R5: Notifications Sync MVP

Roadmap alignment: `R5` in `docs/ROADMAP.md`

## Objective and architecture delta

Introduce `notification-service` with synchronous behavior first, before adding queue infrastructure.

Design target:

- stable notification contracts now
- easy migration to RabbitMQ workers in next phase

## Entry criteria

- `07-upgrade-r4-frontend-integration.md` completed
- incident/task actions available and testable
- auth and route protections are stable

## Step-by-step implementation order

1. Define notification contract (request shape and delivery result model).
2. Implement sync notification endpoint(s) in `notification-service`.
3. Trigger notifications from at least one domain action.
4. Add gateway route for notification APIs if needed.
5. Add delivery abstraction interface so queue migration is low-risk later.
6. Add tests for success and common failure scenarios.
7. Add logs for traceability (include correlation IDs where available).

## Commands to run

Keep baseline stack running:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Example endpoint test (adjust path/payload to your API):

```bash
curl -i -X POST http://localhost:8080/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"channel":"IN_APP","recipient":"oncall-user","message":"Incident escalated"}'
```

## Verification checklist

- domain action triggers notification call path
- service returns deterministic success/failure responses
- failure modes are surfaced and logged clearly
- sync contract can be reused for async producer in next level

## Failure injection drill

Drill: force notification delivery failure (invalid recipient or simulated downstream error).

Expected:

- failure response is clear and non-ambiguous
- failure is observable in logs
- caller handles failure path predictably

Recovery task:

- retry with valid payload and verify successful delivery path

## Definition of done

- notification-service is implemented and callable
- at least one core workflow triggers notifications
- tests cover success and failure behavior
- notification contract is future-proofed for async migration

## Portfolio evidence checklist

- API examples for notification trigger and response schema
- sequence diagram of domain action -> notification trigger
- logs/screenshots proving success and failure paths
- note on migration path from sync to queue-backed notifications

## Upskill prompt

List two contract decisions you made now that reduce rework when moving to RabbitMQ.
