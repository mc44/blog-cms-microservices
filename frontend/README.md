# frontend

Next.js application for the public blog and authenticated editor. All API calls go to the **gateway** — never directly to blog, media, or auth ports.

## Prerequisites

- Gateway running at `http://localhost:8080`
- auth-service running (login proxied as `/auth/login`)
- Blog stack healthy (`/actuator/health` on gateway)

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_GATEWAY_URL` | `http://localhost:8080` | API base URL |
| `NEXT_PUBLIC_SITE_NAME` | `Blog CMS` | Site title in layout |

## Development

```bash
npm install
export NEXT_PUBLIC_GATEWAY_URL=http://localhost:8080
npm run dev
```

Open **http://localhost:3000**.

### Sign-in

Use a user that exists in auth-service for your `BLOG_TENANT_ID` (deploy default seed):

| Field | Example |
|-------|---------|
| Tenant | `blog-cms` |
| Email | `user@example.com` |
| Password | `change-me` |

### Main routes

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Home |
| `/posts` | Public | Published posts |
| `/posts/[id]` | Public | Single post |
| `/authors/[authorId]` | Public | Posts by author |
| `/login` | Public | Login |
| `/me/posts` | Auth | Your posts |
| `/posts/new` | Auth | Create post |
| `/posts/[id]/edit` | Auth | Edit post |

## Production build

```bash
npm run build
npm run start
```

In Docker, the image is built by [deploy/scripts/deploy.sh](../deploy/scripts/deploy.sh) and listens on port **3000**.
