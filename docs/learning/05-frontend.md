# 05 — Frontend

## Goal

How Next.js talks only to the gateway, stores JWTs, and renders public vs authenticated flows.

## Prerequisites

[04 — Blog service](./04-blog-service.md) — stack running.

## Concepts

**Single API URL:** `NEXT_PUBLIC_GATEWAY_URL` only — never `:8082` or `:8081`.

**Token storage:** `localStorage` via [`src/lib/auth.ts`](../../3-frontend/src/lib/auth.ts).

**Key files:** [`src/lib/api.ts`](../../3-frontend/src/lib/api.ts) (all fetch calls), [`src/components/post-editor.tsx`](../../3-frontend/src/components/post-editor.tsx) (create/publish UI).

**Server components:** public `/posts` fetches without JWT. Editor and `/me/posts` attach `Authorization`.

Branding: env vars — see [3-frontend/README.md](../../3-frontend/README.md).

## Hands-on

```bash
cd 3-frontend
npm install
export NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
npm run dev
```

1. Open http://localhost:3000
2. Sign in at `/login`
3. Create and publish a post
4. DevTools → Network: requests only to `:8080`

## Verify

Published post visible on `/posts`. Network tab shows no direct service port calls.

## Checkpoint

1. Where is the access token stored?
2. Can server-rendered `/posts` load without a JWT?
3. Which file performs `POST /auth/login`?
4. What env var sets the API base URL?
5. Does the frontend call audit-service directly?

## Next

[06 — Media service](./06-media-service.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Frontend
