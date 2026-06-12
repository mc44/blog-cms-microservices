# 00 — Architecture and repositories

## Goal

Mental model of the system: repos, ports, networks, and data ownership before you run Docker or read Java.

## Prerequisites

None.

## Concepts

### Two repositories

| Repository | Contains |
|------------|----------|
| **[auth-service](https://github.com/mc44/auth-service)** | Login, JWT, Mongo `auth` |
| **blog-cms-microservices** (this repo) | `0-deploy` through `5-audit-service` |

### Numbered folders (build order)

| Folder | Port | Role |
|--------|------|------|
| `0-deploy/` | 27018, 8080, 3000 | Mongo, compose, scripts |
| `1-gateway-service/` | 8080 | Public API edge |
| `2-blog-service/` | 8082 | Posts, taxonomy |
| `3-frontend/` | 3000 | Next.js UI |
| `4-media-service/` | 8083 | Uploads |
| `5-audit-service/` | 8084 | Audit trail |

Auth: **8081**, Mongo **27017** ([auth-service](https://github.com/mc44/auth-service)).

### Data ownership

| Service | Database |
|---------|----------|
| auth-service | `auth` |
| blog-service | `blog` |
| audit-service | `audit` |
| media-service | Cloudinary (no Mongo required) |

Identity on blog requests comes from JWT claims forwarded as headers by the gateway — blog-service does not query auth Mongo.

### Docker networks

| Network | Members |
|---------|---------|
| `auth-platform` | auth-service, auth Mongo |
| `cms-internal` | blog Mongo, gateway, blog, media, audit, frontend |

Gateway joins **both** networks.

## Hands-on

```bash
ls -d 0-deploy 1-gateway-service 2-blog-service 3-frontend 4-media-service 5-audit-service
```

Confirm auth is deployed: [auth-service deploy/README.md](https://github.com/mc44/auth-service/blob/main/deploy/README.md).

## Verify

You can name each numbered folder and its port without opening code.

## Checkpoint

1. Why are auth and blog in separate Git repositories?
2. Which port does the browser use for API calls?
3. Which MongoDB port holds the `blog` database?
4. Name the two Docker networks.
5. Does blog-service query the `auth` database directly?

## Next

[01 — Deploy](./01-deploy.md)

## Related

Code map: [appendix-code-map.md](./appendix-code-map.md)
