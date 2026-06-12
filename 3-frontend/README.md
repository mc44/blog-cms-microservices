# Frontend

Next.js blog UI. All API traffic goes through the gateway.

Assumes repo cloned and stack running; see [README.md](../README.md).

## 2. Configure

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_GATEWAY_URL` | API base (default `http://localhost:8080`) |
| `NEXT_PUBLIC_TENANT_ID` | Login tenant (default `blog-cms`) |
| `NEXT_PUBLIC_SITE_NAME` | Site title |
| `NEXT_PUBLIC_SITE_BYLINE` | e.g. `by mfajardo` |
| `NEXT_PUBLIC_SITE_TAGLINE` | Home hero text |
| `NEXT_PUBLIC_HOME_TOPICS` | Comma-separated topic pills |

Branding is env-driven. Example block in [0-deploy/.env.example](../0-deploy/.env.example). Fallbacks in [`src/lib/site.ts`](src/lib/site.ts).

For local dev, copy `NEXT_PUBLIC_*` vars into `3-frontend/.env.local`.

## 3. Run

**Docker:** included in [0-deploy/scripts/deploy.sh](../0-deploy/scripts/deploy.sh) → port **3000**

**Dev (hot reload):**

```bash
cd 3-frontend
npm install
export NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
npm run dev
```

Default seed user: `user@example.com` / `change-me`, tenant `blog-cms`.

## 4. Verify

1. Open http://localhost:3000 — home page loads
2. Go to `/login`, sign in — redirects to `/me/posts`
3. Create and publish a post — appears on `/posts`
4. DevTools → Network: all API calls go to `:8080` only (never `:8082`)

## Related

- Learning: [docs/learning/05-frontend.md](../docs/learning/05-frontend.md)
- Gateway: [1-gateway-service/README.md](../1-gateway-service/README.md)
