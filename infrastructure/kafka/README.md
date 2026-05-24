# Kafka / Redpanda

Event streaming for blog domain events. The broker runs as an optional Compose profile; application code uses Spring Kafka against a Kafka-compatible API.

**Broker compose:** [deploy/prereqs/docker-compose.yml](../../deploy/prereqs/docker-compose.yml) (`--profile kafka`)

**Enable and event schema:** [docs/kafka.md](../../docs/kafka.md)

**Helper script:** `deploy/scripts/kafka-up.sh`
