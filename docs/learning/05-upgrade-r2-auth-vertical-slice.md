# 05 - Upgrade R2: Auth Vertical Slice

Roadmap alignment: `R2` in `docs/ROADMAP.md`

## Objective and architecture delta

Build a production-style authentication slice:

- `auth-service` issues JWT access tokens and refresh tokens
- gateway validates JWT for protected routes
- auth domain owns logical MongoDB `auth` database

This is the first security boundary for all later services.

## Entry criteria

- `01-foundations.md` is complete
- Phase 1 runtime starts and passes health checks
- you understand current gateway smoke endpoints

## Step-by-step implementation order

1. Define auth API contract:
   - `POST /auth/login`
   - `POST /auth/refresh`
   - `POST /auth/logout` (or revoke)
2. Define token strategy:
   - short-lived access token
   - rotating refresh token
   - explicit invalidation path
3. Implement persistence in logical `auth` DB:
   - user credentials
   - refresh token metadata (hash, expiry, status, rotation lineage)
4. Add gateway route to auth service.
5. Add gateway JWT validation for protected routes.
6. Protect at least one test route to prove `401`/`403` behavior.
7. Add automated tests for login, refresh rotation, and revocation.

## Commands to run

From repo root baseline:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
docker compose -f infrastructure/docker/docker-compose.yml ps
curl -i http://localhost:8080/actuator/health
```

Suggested API verification sequence (replace with your concrete paths once implemented):

```bash
curl -i -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"change-me"}'
```

Use returned token on a protected route:

```bash
curl -i http://localhost:8080/protected/example \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## Verification checklist

- Login returns token payload with expiry info.
- Protected route without token returns `401`.
- Protected route with valid token succeeds.
- Refresh endpoint issues a new refresh token and invalidates old one.
- Logout/revoke prevents future refresh with revoked token.

## Failure injection drill

Drill: replay old refresh token after rotation.

Expected:

- request is rejected
- failure is logged with clear reason
- no new access token is minted

Recovery task:

- verify only latest refresh token lineage is active

## Definition of done

- auth endpoints exist and are test-covered
- gateway enforcement is active on protected paths
- refresh rotation and revocation are proven
- auth data remains isolated to logical `auth` database

## Portfolio evidence checklist

- API collection export (login/refresh/logout/protected route)
- short architecture note showing token lifecycle and trust boundaries
- screenshot/log proof of `401` without token and success with token
- test run output for refresh rotation/replay rejection

## Upskill prompt

Write a one-page note: "Why both gateway and owning services should enforce authorization in microservices."
