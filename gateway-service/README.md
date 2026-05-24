# gateway-service

Spring Cloud Gateway: routes to auth, blog, and media; JWT validation; forwards `X-User-Id` and `X-Tenant-Id`.

Container: **`cms-apps-gateway-1`** (VPS) or part of local `infrastructure/docker` stack. Port **8080**.

## Routes to auth-service

| Public path | Upstream |
|-------------|----------|
| `/auth/**` | `${AUTH_SERVICE_URL}` → default `http://auth-service:8081` |

Must match **auth-service** paths (`POST /auth/login`, etc.). Deploy auth first — see [../auth-service/docs/GATEWAY_INTEGRATION.md](../auth-service/docs/GATEWAY_INTEGRATION.md).

Routes `/audit/**` to audit-service (port 8084).

**Required:** `AUTH_JWT_SECRET` identical on gateway and auth-service.

## Local run

```bash
cp config/localhost.properties.example config/localhost.properties
mvn spring-boot:run
```

- Health: http://localhost:8080/actuator/health  
- Smoke: http://localhost:8080/hello  

## VPS

Started with blog-cms `deploy/docker-compose.yml` — see [deploy/README.md](../deploy/README.md).
