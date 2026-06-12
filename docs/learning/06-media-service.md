# 06 — Media service

## Goal

Image upload through the gateway, Cloudinary storage (or dev fallback), and blog validation of `mediaRefs`.

## Prerequisites

[05 — Frontend](./05-frontend.md) — `$TOKEN` from login.

## Concepts

**Upload:** `POST /media/upload` requires JWT. **Read:** `GET /media/{publicId}` is public.

**Cloudinary vs dev:** empty `CLOUDINARY_*` in `0-deploy/.env` → in-memory store (lost on restart).

**Post linkage:** frontend stores `publicId` in `mediaRefs`; blog validates via `MediaValidationClient` before save.

## Hands-on

```bash
curl -s -X POST http://localhost:8080/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.jpg"

curl -s -X POST http://localhost:8080/blog/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"title":"With cover","content":"Text","status":"DRAFT","mediaRefs":[{"cloudinaryPublicId":"<publicId>","secureUrl":"<secureUrl>"}]}'
```

## Verify

Upload returns `publicId` and `secureUrl`. Post create with valid ref returns **201**.

## Checkpoint

1. Why is upload protected but GET public?
2. Where do image bytes live in production?
3. What happens if Cloudinary env vars are empty?
4. Which service rejects an invalid `cloudinaryPublicId`?
5. Does media-service store bytes in Mongo?

## Next

[07 — Audit service](./07-audit-service.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md) → Media
