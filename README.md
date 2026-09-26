# Black Rivor Wrap Studio

Public website and studio operations panel for a Sunderland vehicle wrapping business. Built with Nuxt 4, Tailwind CSS 4, PostgreSQL 18 and Docker.

## Included

- responsive UK-facing marketing site with an animated colour-change hero
- quote enquiries saved directly to the CRM
- client database and job history
- booking management with overlap protection
- vinyl / PPF stock tracking with reorder levels
- Tiptap newsletter composer with image/link formatting, live preview and campaign history
- SMTP delivery, scheduled campaigns and per-recipient unsubscribe links
- encrypted Email, WhatsApp Cloud API, Telegram and webhook notification integrations
- alerts for enquiries, bookings, low film stock, job changes and unsubscribes
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

The admin panel is available at `/admin`. The local default is `admin@blackrivor.co.uk` / `change-me-now`. Set a strong `ADMIN_PASSWORD` and `INTEGRATION_ENCRYPTION_KEY` before any public deployment.

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

## Email and notifications

Configure channels in **Admin → Integrations**. Email uses standard SMTP through Nodemailer, so it works with a hosted mailbox or a transactional provider that exposes SMTP. The same enabled SMTP connection delivers internal email alerts and newsletters.

WhatsApp connects directly to Meta Cloud API and expects an approved utility template with one body variable (`{{1}}`). Telegram uses a bot token and chat ID. The webhook channel can forward the same events to tools such as n8n or Make. Provider credentials are encrypted at rest and never returned to the browser.

Scheduled newsletter campaigns are checked once per minute. Every recipient receives an individual unsubscribe URL, plus standard `List-Unsubscribe` headers. Campaign events and delivery results remain available in the admin history.
