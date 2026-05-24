# media-service

Uploads images to **Cloudinary** and returns `publicId` + `secureUrl` for blog posts.

## API

| Method | Path | Auth |
|--------|------|------|
| POST | `/media/upload` | JWT required at gateway |
| GET | `/media/{publicId}` | Public |

## Configuration

| Variable | Description |
|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | API key |
| `CLOUDINARY_API_SECRET` | API secret |

If any credential is missing, the service uses an **in-memory dev registry** (uploads are not persisted to Cloudinary). Suitable for local/VPS testing without Cloudinary; set all three vars in [`deploy/.env`](../deploy/.env.example) for production.

## Local run

```bash
export CLOUDINARY_CLOUD_NAME=your-cloud
export CLOUDINARY_API_KEY=...
export CLOUDINARY_API_SECRET=...
mvn spring-boot:run
```

Port **8083**.
