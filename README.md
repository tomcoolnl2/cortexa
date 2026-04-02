# Cortexa

A scalable learning platform for creating flashcard decks, practicing via quizzes, and tracking performance over time. Built as an Nx monorepo with clean architecture, designed for extensibility and future game-theory-based learning mechanics.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Mantine UI
- **Backend**: NestJS, REST API
- **Database**: PostgreSQL, Prisma ORM
- **Monorepo**: Nx
- **Testing**: Vitest
- **Design System**: Mantine + Storybook
- **Language**: TypeScript

## Prerequisites

- [Node.js](https://nodejs.org/) v24 LTS (managed via [nvm](https://github.com/nvm-sh/nvm))
- [Docker](https://www.docker.com/) & Docker Compose
- [PostgreSQL](https://www.postgresql.org/) 17 (or use the Docker setup)

## Getting Started

```bash
# Use the correct Node version
nvm use

# Install dependencies
npm install

# Start the database
npm run db:up

# Run Prisma migrations (first time)
npm run db:migrate

# Seed the database
npm run db:seed

# Start the API
npm run serve:api

# Start the frontend (in a separate terminal)
npm run serve:web

# Or start both at once
npm run serve:dev
```

## Project Structure

```
cortexa/
├── apps/
│   ├── web/                  # Next.js frontend (App Router)
│   └── api/                  # NestJS REST API
├── libs/
│   ├── ui/                   # Reusable UI components (Mantine wrappers)
│   ├── hooks/                # Shared React hooks
│   ├── api-client/           # Typed API layer (React Query hooks)
│   ├── types/                # Shared DTOs and interfaces
│   ├── utils/                # Pure utility functions
│   ├── domain/               # Core business logic (quiz strategies, scoring)
│   ├── data-access/          # Prisma ORM layer (schema, client, seed)
│   └── api-interfaces/       # Backend DTOs and validation schemas
├── docker-compose.yml
└── docs/
    └── architecture/
```

### Import Aliases

All libraries are available via `@cortexa/*` path aliases:

```typescript
import { Card, Deck } from '@cortexa/models';
import { BasicMultipleChoiceStrategy } from '@cortexa/domain';
import { CardItem } from '@cortexa/ui';
import { getPrismaClient } from '@cortexa/data-access';
```

## Development

### Common Commands

```bash
# Serve apps
npm run serve:api         # Start API on http://localhost:3333
npm run serve:web         # Start frontend on http://localhost:3000
npm run serve:dev         # Start both API + frontend

# Testing
npm run test:domain       # Run domain library tests
npm test                  # Run all tests

# Storybook
npm run storybook         # Launch Storybook for UI components

# Linting
npm run lint              # Lint all projects

# Build
npm run build             # Build all projects
npm run build:api         # Build API only
npm run build:web         # Build frontend only

# Visualize project graph
npm run graph
```

### Docker

```bash
# Start all services (API, web, PostgreSQL)
npm run docker:up

# Start only the database
npm run db:up

# Build Docker images
npm run docker:build
```

### Database

Prisma schema lives in `libs/data-access/prisma/schema.prisma`.

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create a migration
npm run db:migrate

# Seed the database
npm run db:seed

# Open Prisma Studio (visual DB editor)
npm run db:studio
```

## Architecture

### Domain Logic

Quiz logic is pluggable via the `QuizStrategy` interface:

```typescript
interface QuizStrategy {
    generateQuestions(cards: Card[], count: number): QuizQuestion[];
    evaluateAnswer(
        question: QuizQuestion,
        selectedAnswer: string,
    ): QuizAnswerResult;
    calculateScore(answers: QuizAnswerResult[]): number;
}
```

Current implementations:

- **BasicMultipleChoiceStrategy** — standard multiple-choice quiz generation and scoring

Future extensions:

- Adaptive difficulty based on performance history
- Game-theory-based payoff scoring models

### Data Model

| Model         | Description                          |
| ------------- | ------------------------------------ |
| `User`        | Platform users                       |
| `Deck`        | Collections of flashcards            |
| `Card`        | Term/definition pairs within a deck  |
| `QuizAttempt` | A user's quiz session on a deck      |
| `QuizAnswer`  | Individual answers within an attempt |

## Roadmap

- [ ] Authentication (Google SSO + JWT)
- [ ] Feature libraries (`feature-deck`, `feature-quiz`, `feature-results`)
- [ ] React Query API integration
- [ ] Adaptive quiz strategies (game theory extension)
- [ ] E2E testing (Playwright)
- [ ] CI/CD pipelines
- [ ] Kubernetes & Terraform (AWS)

## License

ISC
