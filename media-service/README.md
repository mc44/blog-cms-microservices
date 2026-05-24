# media-service

Handles image uploads for blog posts. Production traffic uses **Cloudinary**; without credentials the service uses an in-memory registry so local runs still work.

- **Direct port:** 8083
- **Through gateway:** `http://localhost:8080/media/...`

## API

| Method | Path | Gateway auth | Description |
|--------|------|--------------|-------------|
| POST | `/media/upload` | JWT required | `multipart/form-data` file field `file` |
| GET | `/media/{publicId}` | Public | Returns metadata and URL |

Response includes `publicId` and `secureUrl` for attaching to a post’s `mediaRefs`.

## Configuration

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |

If any value is empty, uploads are stored in memory only (lost on restart). Set all three in [deploy/.env](../deploy/.env.example) for persistent production uploads.

## Run locally

```bash
# Optional Cloudinary
export CLOUDINARY_CLOUD_NAME=your-cloud
export CLOUDINARY_API_KEY=...
export CLOUDINARY_API_SECRET=...

mvn spring-boot:run
```

Listens on port **8083**. Upload through the gateway:

```bash
curl -s -X POST http://localhost:8080/media/upload \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/image.png"
```
