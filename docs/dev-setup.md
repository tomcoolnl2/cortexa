# Development Setup

## Prerequisites

-   **Node.js** v22 LTS (managed via [nvm](https://github.com/nvm-sh/nvm) — run `nvm use` to pick up the `.nvmrc`)
-   **Docker** (for PostgreSQL)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL
npm run db:up

# 3. Create database tables from the Prisma schema
npm run db:migrate

# 4. Seed demo data (user + sample deck with 5 cards)
npm run db:seed

# 5. Start the API (port 3333) and web app (port 3000)
npm run serve:dev
```

## Available Scripts

### Development Servers

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run serve:dev` | Start both API and web app               |
| `npm run serve:api` | Start only the NestJS API (port 3333)    |
| `npm run serve:web` | Start only the Next.js web app (port 3000) |
| `npm run storybook` | Start Storybook for the UI library       |

### Database

| Script              | Description                                       |
| ------------------- | ------------------------------------------------- |
| `npm run db:up`     | Start PostgreSQL in Docker                        |
| `npm run db:down`   | Stop PostgreSQL                                   |
| `npm run db:migrate`| Push Prisma schema changes to the database        |
| `npm run db:generate`| Regenerate Prisma Client after schema changes    |
| `npm run db:seed`   | Seed demo data (idempotent — clears existing data)|
| `npm run db:studio` | Open Prisma Studio (database GUI)                 |

### Testing & Quality

| Script              | Description                |
| ------------------- | -------------------------- |
| `npm run test`      | Run all tests              |
| `npm run test:domain`| Run domain logic tests    |
| `npm run lint`      | Lint all projects          |

### Build & Infrastructure

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `npm run build`      | Build all projects                  |
| `npm run build:api`  | Build only the API                  |
| `npm run build:web`  | Build only the web app              |
| `npm run graph`      | Open the Nx dependency graph        |
| `npm run docker:up`  | Start all services via Docker Compose |
| `npm run docker:down`| Stop all Docker services            |
| `npm run docker:build`| Build Docker images                |

## Database

PostgreSQL runs in Docker with the following defaults:

| Setting  | Value                                                    |
| -------- | -------------------------------------------------------- |
| Host     | `localhost:5432`                                         |
| User     | `cortexa`                                                |
| Password | `cortexa_dev`                                            |
| Database | `cortexa`                                                |
| URL      | `postgresql://cortexa:cortexa_dev@localhost:5432/cortexa`|

The Prisma schema lives at `libs/data-access/prisma/schema.prisma`. After making schema changes:

```bash
npm run db:migrate    # push changes to the database
npm run db:generate   # regenerate the Prisma Client
```

## API Endpoints

With the API running, Swagger docs are available at **http://localhost:3333/api/docs**.

Authentication is required for Deck and Card endpoints. See `docs/auth-setup.md` for Google SSO, role setup, and scenario testing flow.

### Decks

-   `GET    /api/decks`        — list all decks (with cards)
-   `GET    /api/decks/:id`    — get a single deck
-   `POST   /api/decks`        — create a deck (with cards)
-   `PATCH  /api/decks/:id`    — update deck title/description
-   `DELETE /api/decks/:id`    — delete a deck

### Cards

-   `GET    /api/decks/:deckId/cards`      — list cards in a deck
-   `POST   /api/decks/:deckId/cards`      — add a card to a deck
-   `PATCH  /api/decks/:deckId/cards/:id`  — update a card
-   `DELETE /api/decks/:deckId/cards/:id`  — delete a card

## Project Structure

```
apps/
    api/          → NestJS API (port 3333)
    web/          → Next.js web app (port 3000)
libs/
    data-access/  → Prisma schema, client, seed
    domain/       → Business logic (quiz strategies, scoring)
    types/        → Shared TypeScript interfaces and DTOs
    ui/           → Mantine-based UI components + Storybook
    api-client/   → API client helpers
    api-interfaces/ → API contract types
    hooks/        → Shared React hooks
    utils/        → Shared utilities
```
