# Appendix — Deferred topics

Features in [SYSTEM_DESIGN.md](../../SYSTEM_DESIGN.md) and [docs/ROADMAP.md](../ROADMAP.md) not yet in the learning path. Complete modules 00–09 first.

## R5 — Notifications (sync MVP)

Email or in-app hooks on publish — not wired in blog-service today.

## R7 — WebSockets / realtime

Live editor or publish notifications — frontend uses HTTP only today.

## R8 — Observability stack

Prometheus, Grafana, Loki, Zipkin — correlation IDs exist; full tracing not deployed.

## R9 — CI/CD hardening

Image publish exists; scripted VPS deploy is still roadmap. Production: [0-deploy/README.md](../../0-deploy/README.md).

## RabbitMQ

Deferred in favor of HTTP audit + optional Kafka. Do not add to Phase 1 VPS.

## Full auth-service tutorial

Implementation detail lives in **[auth-service](https://github.com/mc44/auth-service)**. Blog curriculum: [02 — Auth sibling repo](./02-auth-sibling-repo.md).

When you implement a deferred item, extend [appendix-code-map.md](./appendix-code-map.md) — do not revive old `upgrade-r*` filenames.
