# 03 - Checkpoints and Skills

Use this file to validate learning, not just feature output. Complete checkpoints before moving to the next level.

## How to use checkpoints

- Mark each item as done in your own notes.
- If you cannot explain an item clearly, repeat the level.
- Prefer evidence: commands run, logs captured, and behavior verified.

---

## Level 0 checkpoint - Baseline runtime confidence

### Knowledge checks

- I can explain why Phase 1 intentionally runs only `gateway`, `mongo`, and `redis`.
- I can describe each service role in one sentence.
- I understand why Kafka and RabbitMQ are deferred to later phases.

### Practical checks

- I can bring the stack up and down reliably.
- I can verify health using `/hello` and `/actuator/health`.
- I can inspect container logs and identify startup failures.

### Skill goal

Operational habits: startup, validation, and recovery without panic.

---

## Level 1 checkpoint - Authentication and gateway security

Related playbook: [05-upgrade-r2-auth-vertical-slice.md](./05-upgrade-r2-auth-vertical-slice.md)

### Knowledge checks

- I can explain access token vs refresh token.
- I can describe why route protection belongs at gateway and service layers.
- I know the difference between `401` and `403` in my API behavior.

### Practical checks

- Protected endpoints reject requests without valid auth.
- Refresh flow rotates tokens safely.
- Invalid/expired tokens fail predictably.

### Skill goal

Security-first API design.

---

## Level 2 checkpoint - Core domain modeling

Related playbook: [06-upgrade-r3-core-domain-services.md](./06-upgrade-r3-core-domain-services.md)

### Knowledge checks

- I can explain incident lifecycle states.
- I can explain task linkage to incidents.
- I can explain correlation ID propagation purpose.

### Practical checks

- I can create, update, and query incidents and tasks through gateway routes.
- I can trace one request across logs using correlation identifiers.
- I can identify and fix one schema or validation mismatch.

### Skill goal

Reliable service contracts and domain ownership.

---

## Level 3 checkpoint - Frontend/API integration

Related playbook: [07-upgrade-r4-frontend-integration.md](./07-upgrade-r4-frontend-integration.md)

### Knowledge checks

- I can explain token usage in frontend requests.
- I can explain what frontend should do on unauthorized responses.
- I can identify where state belongs (client cache vs server).

### Practical checks

- UI login works with real backend flow.
- Incident/task views render and handle loading/error states.
- Logout or token expiry behavior is safe and understandable.

### Skill goal

Full-stack thinking with clear boundaries.

---

## Level 4 checkpoint - Notification MVP behavior

Related playbook: [08-upgrade-r5-notifications-sync-mvp.md](./08-upgrade-r5-notifications-sync-mvp.md)

### Knowledge checks

- I can explain why we start with synchronous notification behavior first.
- I can describe how this interface can evolve to queue-backed processing.

### Practical checks

- A domain action triggers a notification pathway.
- Success and failure paths are observable in logs or responses.
- At least one retry/failure scenario is tested.

### Skill goal

Designing simple systems that can evolve safely.

---

## Level 5 checkpoint - Async architecture foundations

Related playbook: [09-upgrade-r6-async-backbone.md](./09-upgrade-r6-async-backbone.md)

### Knowledge checks

- I can explain at-least-once delivery implications.
- I can explain idempotency and why it is required for consumers.
- I can explain the difference between event streaming and task queues.

### Practical checks

- Events are published and consumed correctly.
- DLQ behavior is demonstrated for a failure scenario.
- Duplicate processing does not corrupt state.

### Skill goal

Event-driven resilience and failure-aware engineering.

---

## Level 6 checkpoint - Real-time delivery

Related playbook: [10-upgrade-r7-realtime-updates.md](./10-upgrade-r7-realtime-updates.md)

### Knowledge checks

- I can explain authenticated WebSocket lifecycle concerns.
- I can explain failure modes: disconnects, stale auth, reconnect storms.

### Practical checks

- Authorized clients receive live updates.
- Unauthorized clients are blocked.
- Reconnect flow restores updates correctly.

### Skill goal

Realtime systems with secure delivery.

---

## Level 7 checkpoint - Operability and deployment confidence

Related playbook: [11-upgrade-r8-r9-observability-deploy-hardening.md](./11-upgrade-r8-r9-observability-deploy-hardening.md)

### Knowledge checks

- I can explain core SLI/SLO metrics for this platform.
- I can explain how logs, metrics, and traces complement each other.
- I can explain safe deployment and rollback basics.

### Practical checks

- I can observe request flow through dashboards/logs/traces.
- CI/CD path filtering and deployment steps are understood.
- I can perform a safe restart or targeted rollout workflow.

### Skill goal

Production-readiness and ownership mindset.

---

## Reflection prompts (after each level)

- What assumption was wrong, and how did I discover it?
- What broke first, and why?
- What signal (log/metric/trace/test) gave me the most confidence?
- What would I automate before repeating this level?

## Encouragement note

Progress in distributed systems comes from repetition and reflection. If one level feels hard, that is a strong sign you are building real engineering depth.
