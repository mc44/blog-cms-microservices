# Blog & Media CMS
## System Design Document

Author: Marc Fajardo  
Version: 2.0  
Status: Phase 1 — Blog CMS MVP

---

# 1. Project Overview

## Purpose

A distributed **blog CMS** with JWT auth, editorial workflow (drafts → published), categories/tags, and Cloudinary-backed media. The Next.js frontend talks only to the API gateway.

The platform focuses on:
- Post and revision management
- Categories and tags
- Media upload via Cloudinary (metadata/refs in Mongo `blog`)
- Gateway-routed REST APIs with correlation IDs
- Secure authentication (JWT + refresh rotation)

This project is intended to demonstrate:
- Microservice architecture
- Event-driven communication
- Queue-based processing
- Real-time systems
- Secure authentication
- Observability and monitoring
- Production deployment practices

---

# 2. Core Goals

## Functional Goals

- Create and manage posts (draft / published)
- Categories and tags
- Image upload and embed via media-service → Cloudinary
- Login and JWT-protected authoring APIs
- Optional notifications / analytics (later phases)

## Technical Goals

- Distributed microservices architecture
- Kafka-compatible event streaming (Redpanda; see [docs/kafka.md](docs/kafka.md)) — optional via `KAFKA_ENABLED`
- RabbitMQ-based async job handling (deferred)
- Dockerized deployment
- CI/CD support
- Observability stack
- Horizontal scalability

---

# 3. High-Level Architecture

```text
                     ┌─────────────────────┐
                     │     Next.js App     │
                     │   Editor / Admin    │
                     └──────────┬──────────┘
                                ▼
                     ┌─────────────────────┐
                     │    API Gateway      │
                     └──────────┬──────────┘
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
     ┌────────────┐    ┌────────────┐    ┌────────────┐
     │Auth Service│    │Blog Service│    │Media Svc   │
     └─────┬──────┘    └─────┬──────┘    └─────┬──────┘
           │                 │                  │
           ▼                 ▼                  ▼
      MongoDB `auth`   MongoDB `blog`      Cloudinary
```

---

# 4. Architecture Style

## Microservices

Each domain is isolated into independent services.

**Benefits**

- Independent deployment
- Better scalability
- Service isolation
- Easier maintenance
- Technology flexibility

---

# 5. Services

## 5.1 API Gateway

**Responsibilities**

- Route requests
- JWT validation
- Rate limiting
- Request logging
- Security headers
- CORS handling

**Technology**

- Spring Cloud Gateway

## 5.2 Auth Service

**Responsibilities**

- User authentication
- JWT issuance
- Refresh tokens
- Role-based access control
- Session invalidation

**Features**

- Single-session enforcement
- Refresh token rotation
- Password hashing
- Login audit trail

**Database**

- MongoDB (logical `auth` database on shared cluster or dedicated cluster per environment)

## 5.3 Incident Service

**Responsibilities**

- Incident creation
- Status management
- Incident lifecycle
- SLA tracking

**Kafka Events Published** (Phase 2+)

- `incident.created`
- `incident.updated`
- `incident.resolved`
- `incident.escalated`

**Database**

- MongoDB (logical `incidents` database)

## 5.4 Task Service

**Responsibilities**

- Task assignment
- Workflow tracking
- Priority management
- Task comments

**Kafka Events Published** (Phase 2+)

- `task.created`
- `task.assigned`
- `task.completed`

**Database**

- MongoDB (logical `tasks` database)

## 5.5 Notification Service

**Responsibilities**

- Email notifications
- In-app notifications
- WebSocket pushes
- Delayed escalation alerts

**RabbitMQ usage**

Retryable jobs, delayed notifications, email queue processing, dead-letter queues for failed jobs.

## 5.6 Audit Service

**Responsibilities**

- Immutable event logging
- Operational audit trail
- Security audit tracking

**Kafka consumers** (Phase 2+)

Consumes domain events written to Kafka for centralized audit ingestion.

**Database**

- MongoDB (logical `audit` database)

## 5.7 Analytics Service

**Responsibilities**

- SLA metrics
- Incident analytics
- Dashboard aggregation
- Reporting

**Kafka consumers** (Phase 2+)

Consumes `incident`, `task`, and `notification`-related domain events.

**Analytics store**

- MongoDB write models / aggregates (`analytics` logical database); optional external OLAP later

---

# 6. Communication Strategy

## Synchronous communication

**REST APIs** — CRUD operations, user requests, authentication flows.

## Asynchronous communication

### Kafka

**Used for**

- Event streaming
- Decoupled communication
- Analytics pipelines
- Audit tracking

**Why Kafka**

- Durable event storage
- High throughput
- Replayability
- Consumer groups
- Event-driven architecture

Prefer **Kafka in KRaft mode** or a managed Kafka service for new deployments; avoid coupling to ZooKeeper-based deployment long term.

### RabbitMQ

**Used for**

- Background jobs
- Delayed processing
- Retry handling
- Notification queues

**Why RabbitMQ**

- Task queues
- Reliable retries
- Worker-based processing
- Dead-letter queues

---

# 7. Frontend Architecture

## Technology stack

- Next.js 15
- TypeScript
- TailwindCSS
- shadcn/ui
- TanStack Query
- Zustand
- WebSockets (Phase 2+)

## Frontend features

**Dashboard**

- Incident overview
- Active incidents
- SLA countdowns
- Analytics graphs

**Real-time activity feed**

- Incident updates
- Task updates
- User actions

**Incident timeline**

- Chronological operational history

**Admin panel**

- User management
- RBAC management
- Queue monitoring

---

# 8. Real-Time System Design

**Phase 2+** recommendation: defer building WebSocket-centric UX until RabbitMQ/Kafka foundations are stable; real-time increases auth, scaling, and ops burden on the VPS.

**WebSocket flow (target)**

Incident updated → Kafka event published → Notification Service consumes event → WebSocket broadcast → Next.js client receives live update.

---

# 9. Database Design

## Per-service logical database pattern

Each service owns its own **logical MongoDB database** (recommended MVP on a single Atlas cluster or local `mongo` with multiple databases: `auth`, `incidents`, `tasks`, `audit`, `analytics`).

**Benefits**

- Loose coupling at the datastore boundary
- Independent schema evolution per service
- Service isolation consistent with bounded contexts

| Service           | Logical database | Technology |
|------------------|-----------------|------------|
| Auth Service     | `auth`           | MongoDB    |
| Incident Service | `incidents`      | MongoDB    |
| Task Service     | `tasks`          | MongoDB    |
| Audit Service    | `audit`          | MongoDB    |
| Analytics Service| `analytics`      | MongoDB    |

**Runtime note**

MongoDB Atlas (hosted) plus optional local Docker `mongo` for offline development.

---

# 10. Security Design

## Authentication

- JWT access tokens
- Refresh tokens
- Token rotation

## Authorization

- RBAC
- Route-based permissions
- Resource-level authorization enforced in owning services even when JWT is validated at the gateway

## Security features

- Rate limiting
- Password hashing
- Audit trails
- Secure headers
- HTTPS enforcement (NGINX terminates TLS toward clients)

Atlas / DB access via **scoped connection strings** in secrets—not committed to the repository.

---

# 11. Observability Stack

- **Prometheus** — Metrics collection  
- **Grafana** — Monitoring dashboards  
- **Loki** — Centralized logging  
- **Zipkin** — Distributed tracing  

**(Phase 3+)** Align with roadmap and Compose profiles so metrics stack is optional for early development.

---

# 12. Deployment Architecture

## Deployment target

VPS hosted on mfajardo.com (or equivalent), fronted by **NGINX**.

## Phase 1 (MVP runtime) — minimal Compose

Start local and early production with fewer moving parts:

- `gateway-service`
- `mongo`, `redis`
- Optional placeholders for downstream HTTP routes until incident/auth services are wired  
- Omit **Kafka**, **ZooKeeper**, and **RabbitMQ** until Phase 2 (see [§17](#17-mvp-scope))

## Full target stack (later phases)

`docker-compose` (or Compose profiles) may include:

- `gateway`
- `auth-service`, `incident-service`, `task-service`
- `notification-service`, `audit-service`, `analytics-service`
- `mongo`, `redis`, `rabbitmq`
- Kafka (prefer KRaft or managed)
- NGINX reverse proxy / TLS
- `grafana`, `prometheus`, `loki` (observability)

---

# 13. Infrastructure Components

| Component       | Purpose                    |
|----------------|----------------------------|
| Docker Compose | Container orchestration    |
| NGINX          | Reverse proxy / TLS        |
| Redis          | Caching/session support    |
| MongoDB        | Primary persistent storage |
| Kafka          | Event streaming (Phase 2+) |
| RabbitMQ       | Background jobs            |

---

# 14. CI/CD Pipeline

**GitHub Actions**

1. Run tests  
2. Build services (path-filtered jobs so only changed artifacts rebuild)  
3. Build Docker images  
4. Push images to registry  
5. Deploy to VPS / restart scoped containers  

---

# 15. Scalability Strategy

## Horizontal scaling

Stateless services can scale independently:

- `notification-service`
- `analytics-service`
- `gateway-service`

## Future Kubernetes migration

Possible upgrade paths:

- Kubernetes
- Helm charts
- Auto-scaling
- Service mesh

---

# 16. Reliability Features

## Retry policies

- RabbitMQ retry queues
- Exponential backoff

## Dead letter queues

Failed jobs redirect to DLQs.

## Idempotency

Prevent duplicate event processing.

## Circuit breakers

Reduce cascading failures on synchronous hops.

---

# 17. MVP Scope

## Phase 1

- Authentication  
- Incident management  
- Task management  
- Basic notifications  
- Docker deployment (minimal Compose per [§12](#12-deployment-architecture))

## Phase 2

- Kafka integration  
- RabbitMQ workers  
- Real-time updates  
- Analytics dashboard  

## Phase 3

- Observability stack  
- Distributed tracing  
- SLA automation  
- Escalation workflows  

---

# 18. Advanced Features

**Potential enhancements**

- Event replay (replay incident history from Kafka)
- AI incident summaries
- SLA automation (timed escalation)
- Multi-tenant architecture
- Mobile push notifications

---

# 19. Key Engineering Concepts Demonstrated

- Distributed systems
- Event-driven architecture
- CQRS-style read projections (analytics/audit consuming events) scoped to bounded examples
- Async processing
- Real-time communication (Phase 2+)
- Infrastructure orchestration
- Observability
- Production deployment
- Security architecture

---

# 20. Resume Value

This project demonstrates:

- Senior backend engineering concepts
- Full-stack architecture
- Infrastructure deployment
- Microservice communication
- Distributed event systems
- Production-oriented engineering practices

---

# 21. Suggested Repository Structure

```
blog-cms-microservices/

├── 0-deploy/
├── 1-gateway-service/
├── 2-blog-service/
├── 3-frontend/
├── 4-media-service/
├── 5-audit-service/
├── docs/
└── README.md
```

Auth-service lives in [mc44/auth-service](https://github.com/mc44/auth-service) (separate repository).

---

# 22. Future Expansion

**Potential evolution**

- Kubernetes deployment  
- Service discovery  
- Multi-region deployment  
- Event sourcing  
- Deeper CQRS modeling where justified  
- Temporal workflow engine  
- OpenTelemetry integration  

---

# 23. Conclusion

The Operations & Incident Coordination Platform is designed as a production-oriented distributed system that demonstrates modern backend engineering principles, event-driven architecture, observability, and scalable deployment practices.

The project emphasizes real-world operational complexity while remaining feasible for solo development and deployment on a VPS infrastructure.