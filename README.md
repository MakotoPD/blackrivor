# Black Rivor Wrap Studio

Nowa strona i panel operacyjny studia car wrapping w Sunderland: Nuxt, Tailwind CSS, PostgreSQL 18 i Docker.

## Start lokalny

```bash
cp .env.example .env
pnpm install
docker compose up -d db
pnpm db:migrate
pnpm dev
```

Panel administracyjny jest dostępny pod `/admin`. Przed pierwszym uruchomieniem produkcyjnym ustaw bezpieczne `ADMIN_PASSWORD` i `SESSION_SECRET`.

## Docker

```bash
docker compose up --build
```

Kontener aplikacji automatycznie uruchamia brakujące migracje przed startem serwera.

