# 07 - Upgrade R4: Frontend Integration

Roadmap alignment: `R4` in `docs/ROADMAP.md`

## Objective and architecture delta

Connect frontend workflows to authenticated backend APIs so the platform becomes usable end to end.

Core outcomes:

- login UX with real auth backend
- incidents/tasks list and detail flows from live APIs
- safe handling of loading, empty, and auth-error states

## Entry criteria

- `06-upgrade-r3-core-domain-services.md` completed
- auth endpoints and protected routes are working
- incident/task APIs are functional through gateway

## Step-by-step implementation order

1. Bootstrap frontend and environment variables.
2. Build API client abstraction for gateway calls.
3. Implement login page and token/session handling.
4. Add authenticated fetch behavior for incidents/tasks.
5. Build incident and task views (list first, then details/actions).
6. Add robust UX for loading/error/unauthorized states.
7. Add smoke tests for login and core views.

## Commands to run

Backend stack:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Frontend app:

```bash
cd frontend
npm install
npm run dev
```

Browser check target:

- `http://localhost:3000` (default Next.js)

## Verification checklist

- login succeeds against live backend
- failed login displays clear, non-leaky error
- incidents/tasks screens load from real APIs
- token-expiry path redirects to login or refresh flow safely

## Failure injection drill

Drill: expire or invalidate user token, then reload protected page.

Expected:

- frontend detects auth failure cleanly
- user is prompted to re-authenticate
- app does not get stuck in infinite retry loops

Recovery task:

- re-login and confirm previous screens recover correctly

## Definition of done

- full login to core domain data flow works in UI
- protected views enforce auth state correctly
- UX handles real-world API latency and failure states
- minimal frontend smoke tests are in place

## Portfolio evidence checklist

- short screen recording: login -> incidents -> tasks -> logout/expiry
- screenshots of loading/error/empty states
- architecture note on frontend auth/session strategy
- list of API routes consumed by frontend

## Upskill prompt

Document where you keep state (server, query cache, local UI) and why that split improves reliability.
