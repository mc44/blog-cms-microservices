# Security notes

## Exposed secrets in git history

A root `.env.local` file was previously committed. It contained MongoDB Atlas credentials and JWT-related secrets. Removing the file from the latest commit does **not** erase it from older commits.

### Required actions

1. **MongoDB Atlas** — Rotate the database user password (or delete the user and create a new one) in the Atlas console. Treat the old connection string as compromised.
2. **Auth service** — Generate new values for `AUTH_JWT_SECRET` and `AUTH_REFRESH_TOKEN_HMAC_KEY` in auth-service `deploy/.env`.
3. **Blog CMS** — Set the same `AUTH_JWT_SECRET` in `deploy/.env` (must match auth).
4. **Redeploy** — Restart auth-service and the blog-cms stack so running containers pick up the new secrets.

### Where secrets belong

| File | Commit? | Purpose |
|------|---------|---------|
| `deploy/.env` | No (gitignored) | Production/local Docker apps |
| `deploy/.env.example` | Yes | Placeholders only |
| `frontend/.env.local` | No | Optional `NEXT_PUBLIC_*` for Next.js dev |
| Root `.env.local` | No | Removed; do not recreate in the repo |

### Public repository

If this repository was ever public, assume the leaked credentials were scraped. Rotation is the minimum; optionally purge `.env.local` from all history with `git filter-repo` or BFG and force-push (coordinate with anyone who has cloned the repo).
