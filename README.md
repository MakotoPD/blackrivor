# Black Rivor Wrap Studio

Public website and studio operations panel for a Sunderland vehicle wrapping business. Built with Nuxt 4, Tailwind CSS 4, PostgreSQL 18 and Docker.

## Included

- responsive UK-facing marketing site with an animated colour-change hero
- quote enquiries saved directly to the CRM
- client database and job history
- booking management with overlap protection
- vinyl / PPF stock tracking with reorder levels
- UK GDPR-aware newsletter subscribers and campaign drafts
- secure, HTTP-only admin sessions and login rate limiting
- automatic, checksum-protected SQL migrations on every container start
- privacy notice and service terms

## Start lokalny

```bash
cp .env.example .env
pnpm install
docker compose up -d db
pnpm db:migrate
pnpm db:seed # optional demo records
pnpm dev
```

The admin panel is available at `/admin`. The local default is `admin@blackrivor.co.uk` / `change-me-now`. Set a strong `ADMIN_PASSWORD` before any public deployment.

## Docker

```bash
docker compose up --build
```

The application container waits for PostgreSQL and applies any missing migration before the server starts.

## Checks

```bash
pnpm typecheck
pnpm test
pnpm build
```

Newsletter campaigns are stored and scheduled in the panel. Actual delivery should be connected to a transactional email provider (for example Postmark or Resend) once provider credentials and the sending domain are available.
