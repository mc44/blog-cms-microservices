# media-service

Image uploads for blog posts. Cloudinary in production; in-memory store when credentials are unset.

Assumes repo cloned; upload via gateway at `:8080`.

## 2. Configure

| Variable | Purpose |
|----------|---------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |

Set all three in `0-deploy/.env` for persistent uploads. Omit for dev (in-memory, lost on restart).

## 3. Run

**Docker:** [0-deploy/scripts/deploy.sh](../0-deploy/scripts/deploy.sh)

**JVM:**

```bash
cd 4-media-service
# Optional: export CLOUDINARY_* vars
mvn spring-boot:run
```

Listens on port **8083**; clients use gateway `/media/**`.

## 4. Verify

```bash
export TOKEN="<accessToken from login>"

curl -s -X POST http://localhost:8080/media/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/image.png"
# → JSON with publicId and secureUrl

curl -s "http://localhost:8080/media/<publicId>"
# → metadata JSON
```

## Related

- Learning: [docs/learning/06-media-service.md](../docs/learning/06-media-service.md)
- Gateway auth rules: [1-gateway-service/README.md](../1-gateway-service/README.md)
