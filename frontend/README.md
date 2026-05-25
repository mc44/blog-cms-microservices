# Frontend

Next.js blog UI. All API traffic goes through the gateway.

## Prerequisites

- Gateway at `http://localhost:8080`
- auth-service running (login via `/auth/login`)

## Branding (public template)

This frontend is meant to be **forked and rebranded via environment variables**. Avoid editing component copy for your site name, tagline, or links—set env vars instead (or change fallbacks in [`src/lib/site.ts`](src/lib/site.ts)).

| Variable | Template fallback (no env) | mfajardo example (see `deploy/.env.example`) |
|----------|---------------------------|-----------------------------------------------|
| `NEXT_PUBLIC_SITE_NAME` | `blog` | `blog` |
| `NEXT_PUBLIC_SITE_BYLINE` | (hidden) | `by mfajardo` |
| `NEXT_PUBLIC_SITE_TAGLINE` | Generic template sentence | Multi-topic incl. software dev |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | Same as tagline | Optional SEO override |
| `NEXT_PUBLIC_HOME_TOPICS` | `Writing,Notes` | `Software,Productivity,Psychology,Building,Habits` |
| `NEXT_PUBLIC_AUTHOR_LABEL` | Shortened user id | `Marc Fajardo` |
| `NEXT_PUBLIC_MFAJARDO_URL` | — | `https://mfajardo.com` |
| `NEXT_PUBLIC_WEEKLY_URL` | — | `https://weekly.mfajardo.com` |
| `NEXT_PUBLIC_FOCUS_URL` | — | `https://focus.mfajardo.com` |

**Where branding appears**

- **Home page only:** hero tagline, topic pills, optional “Also building …” links.
- **Header and footer (all pages):** site name + byline, footer tagline, optional Elsewhere links.
- **Articles listing and post pages:** neutral copy (“Articles”, “Published posts from this site.”).

**Disable Elsewhere links:** leave `NEXT_PUBLIC_MFAJARDO_URL`, `WEEKLY_URL`, and `FOCUS_URL` unset or empty.

## API environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_GATEWAY_URL` | `http://localhost:8080` | API base URL |
| `NEXT_PUBLIC_TENANT_ID` | `blog-cms` | Login tenant |

## Development

```bash
npm install
cp ../deploy/.env.example ../deploy/.env   # or use frontend .env.local with NEXT_PUBLIC_* vars
export NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
npm run dev
```

Open http://localhost:3000.

For local dev with full mfajardo branding, copy the branding block from [`deploy/.env.example`](../deploy/.env.example) into `frontend/.env.local` (Next.js loads it automatically).

Default seed user (when auth uses defaults): `user@example.com` / `change-me`, tenant `blog-cms`.

## Production

```bash
npm run build
npm run start
```

Or use the Docker image from [deploy/scripts/deploy.sh](../deploy/scripts/deploy.sh).
