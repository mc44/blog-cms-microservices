# Docker — local all-in-one stack

Single compose file for development: **infrastructure/docker/docker-compose.yml**.

From the **repository root**:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

## Containers started

| Service (compose key) | Typical container name | Port | Notes |
|----------------------|------------------------|------|--------|
| `mongo` | `docker-mongo-1` | 27017 | Volume `mongo-data` |
| `redis` | `docker-redis-1` | 6379 | |
| `auth-service` | `docker-auth-service-1` | 8081 | DB `auth` |
| `gateway` | `docker-gateway-1` | 8080 | Routes `/auth`, `/blog`, `/media` |
| `blog-service` | `docker-blog-service-1` | 8082 | DB `blog` |
| `media-service` | `docker-media-service-1` | 8083 | Cloudinary env |

Exact container names depend on your project directory name; list with:

```bash
docker compose -f infrastructure/docker/docker-compose.yml ps
```

## Smoke checks

- Gateway: http://localhost:8080/hello  
- Login: `POST http://localhost:8080/auth/login` with `{"tenantId":"blog-cms","email":"user@example.com","password":"change-me"}`  

## Production on a VPS

Use separate compose files with explicit container layers — not this file:

1. Mongo (+ optional Redis): [deploy/prereqs](../../deploy/prereqs/README.md)  
2. Apps: [deploy/](../../deploy/README.md)
