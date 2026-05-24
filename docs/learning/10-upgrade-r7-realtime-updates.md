# 10 - Upgrade R7: Realtime Updates

Roadmap alignment: `R7` in `docs/ROADMAP.md`

## Objective and architecture delta

Add authenticated realtime delivery after async foundations are stable.

Target path:

- domain event -> notification processing -> websocket broadcast -> frontend update

## Entry criteria

- `09-upgrade-r6-async-backbone.md` completed
- async event flows and consumer stability verified
- auth model is already enforced on HTTP routes

## Step-by-step implementation order

1. Define websocket authentication strategy (token validation + expiry handling).
2. Define authorization model for channels/topics.
3. Implement websocket endpoint and connection lifecycle handling.
4. Wire broadcast triggers from notification/event pipeline.
5. Update frontend client to connect, subscribe, and render updates.
6. Add reconnect behavior with safe re-auth checks.
7. Add tests for authorized and unauthorized connection attempts.

## Commands to run

Start backend stack as implemented:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Run frontend:

```bash
cd frontend
npm run dev
```

Use two browser sessions to validate fan-out and auth behavior.

## Verification checklist

- authorized client receives realtime updates
- unauthorized/stale token client is denied
- reconnect path re-establishes stream safely
- UI state updates correctly without full refresh

## Failure injection drill

Drill: disconnect network or kill websocket session during active updates.

Expected:

- client reconnects using defined strategy
- stale auth is rejected and prompts re-auth
- duplicate visual events are avoided on reconnect

Recovery task:

- restore connectivity and confirm clean event stream continuation

## Definition of done

- realtime stream is secured and functional
- fan-out works across multiple active clients
- reconnect and auth-expiry edge cases are handled
- test coverage includes auth and reconnect scenarios

## Portfolio evidence checklist

- short demo video with two clients receiving same live update
- auth denial evidence for unauthorized websocket attempt
- architecture diagram for realtime event path
- checklist of reconnect edge cases tested

## Upskill prompt

Summarize how realtime features increased system complexity and what guardrails you added to control it.
