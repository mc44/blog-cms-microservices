# 06 - Upgrade R3: Core Blog Domain Services

Roadmap alignment: `R3` in `docs/ROADMAP.md`

## Objective and architecture delta

Deliver core CMS capability by implementing:

- `blog-service` (posts, drafts, categories, tags, revisions)
- `media-service` (Cloudinary uploads, asset verification)
- gateway routes for both domains
- correlation ID propagation across request hops

Each service must own its logical MongoDB database where applicable (`auth`, `blog`). Media bytes live in Cloudinary only.

## Entry criteria

- `05-upgrade-r2-auth-vertical-slice.md` completed
- protected routes and identity flow already working

## Step-by-step implementation order

1. Model domain entities: `Post`, `Category`, `Tag`, `Revision`, publish states.
2. Implement blog APIs: create, get, list, update status.
3. Implement media APIs: upload, verify by `public_id`.
4. Add blog–media linkage validation (reject unknown `cloudinaryPublicId`).
5. Add gateway routing to `blog-service` and `media-service`.
6. Propagate `X-Correlation-Id` from gateway to services.
7. Add contract/integration tests for cross-service workflows.

## Commands to run

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

```bash
curl -i -X POST http://localhost:8080/blog/posts \
  -H "Content-Type: application/json" \
  -H "X-Correlation-Id: demo-r3-001" \
  -d '{"title":"Hello CMS","content":"First post","status":"DRAFT"}'
```

## Verification checklist

- post create/read/update works through gateway
- media upload returns `public_id` and `secure_url` (with Cloudinary env set)
- post with invalid media reference returns client error
- same correlation ID appears in gateway and downstream logs

## Definition of done

- blog and media services reachable through gateway
- linkage validation enforced
- correlation IDs consistently propagated
