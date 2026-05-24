# 09 - Upgrade R6: Async Backbone

Roadmap alignment: `R6` in `docs/ROADMAP.md`

## Objective and architecture delta

Introduce event-driven processing while preserving Phase 1 defaults:

- RabbitMQ workers with retry and DLQ pattern
- Kafka event publishing and consuming
- audit/analytics consumer foundations

Do not replace baseline runtime. Add async infrastructure using profiles or overrides for Phase 2.

## Entry criteria

- `08-upgrade-r5-notifications-sync-mvp.md` completed
- core sync APIs are stable and test-covered
- notification contract exists and is observable

## Step-by-step implementation order

1. Define event catalog and ownership:
   - producers: incident/task domain services
   - consumers: audit/analytics and notification workers
2. Define schema/versioning and idempotency key strategy.
3. Add RabbitMQ profile or override:
   - exchanges/queues
   - retry queue
   - DLQ
4. Add Kafka profile or managed connection settings.
5. Implement producer publishing from domain services.
6. Implement consumers with idempotent processing.
7. Add replay and duplicate-delivery tests.
8. Add operational runbook notes for retries and DLQ triage.

## Commands to run

Baseline remains:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Once Phase 2 compose profile/override exists, run it explicitly (example shape):

```bash
docker compose -f infrastructure/docker/docker-compose.yml -f infrastructure/docker/docker-compose.phase2.yml up --build
```

Use logs to verify producer/consumer behavior:

```bash
docker compose -f infrastructure/docker/docker-compose.yml logs -f
```

## Verification checklist

- events are emitted on incident/task state changes
- consumers process events and update downstream read models
- failed jobs route to retry and then DLQ as configured
- duplicate/replayed events do not corrupt state

## Failure injection drill

Drill: publish a malformed or poison message.

Expected:

- consumer rejects/fails message safely
- retry policy executes
- message lands in DLQ after retry limit
- system remains healthy for other events

Recovery task:

- inspect DLQ payload
- fix consumer/schema issue
- replay corrected event path

## Definition of done

- RabbitMQ and Kafka flow are both demonstrated in local/dev environment
- idempotent consumer behavior is proven
- DLQ and retry semantics are observable and documented
- audit/analytics ingestion path is functional for at least one event type

## Portfolio evidence checklist

- event catalog table (event name, producer, consumer, schema version)
- screenshot/log evidence of retry and DLQ flow
- short note explaining idempotency strategy
- demo script: "domain change -> event -> consumer update"

## Upskill prompt

Write one paragraph on eventual consistency tradeoffs you observed and how you communicated them to users/stakeholders.
