# Claude Architecture Prompt for Stratify

You are a senior staff-level full-stack architect. Help me design and scaffold a scalable Nx monorepo for a Quizlet-like learning platform called **Stratify**, with a strong focus on clean architecture, extensibility, and long-term maintainability.

---

## Product Vision

The application allows users to:

- Create decks with term/definition pairs
- Practice via quizzes (multiple choice)
- Track performance over time

Additionally, the system should be designed to later support:

- Game Theory-based learning mechanics (adaptive scoring, strategy comparisons, payoff models)
- Experimentation with different quiz strategies and algorithms

---

## Monorepo Architecture (Nx)

Use Nx to structure the workspace with clear separation of concerns.

### Apps

1. `web` (Next.js)
   - React + TypeScript
   - App Router
   - Mantine as the primary UI library (wrap components in `ui` lib)
   - React Query for API interaction
   - TailwindCSS optional for utility classes

2. `api` (NestJS)
   - REST API
   - Modular architecture
   - DTOs, validation, service layer

3. `storybook`
   - Dedicated app for design system documentation
   - Must showcase all UI components and states

---

## Libraries (Nx)

### Frontend
- `ui` → reusable UI components built with Mantine
- `feature-*` → feature modules (deck, quiz, results)
- `hooks` → reusable React hooks
- `api-client` → typed API layer (React Query hooks)

### Shared
- `types` → shared DTOs and interfaces
- `utils` → pure utility functions

### Backend
- `data-access` → Prisma ORM layer
- `domain` → core business logic, including pluggable quiz/game logic
- `api-interfaces` → DTOs and validation schemas

---

## Design System (Mantine + Storybook)

- Mantine is the base, wrapped in `ui` components
- Centralized theme (colors, spacing, typography)
- Storybook must document:
  - Variants
  - Edge cases
  - Loading / error states
- Storybook is the source of truth for UI

---

## Testing Strategy

### Unit Testing
- Use Jest or Vitest
- Cover:
  - Domain logic (quiz + scoring)
  - Utilities
  - React components (rendering + behavior)

### E2E Testing (Later)
- Prepare structure for Cypress or Playwright
- Tests should simulate:
  - Creating decks
  - Running quizzes
  - Tracking scoring

---

## Game Theory Extension

Design the system so quiz logic is pluggable:

- `QuizStrategy` interface:
  - `generateQuestion()`
  - `evaluateAnswer()`
  - `calculateScore()`

- Implementations:
  - Basic multiple choice (MVP)
  - Adaptive difficulty / payoff-based scoring (future)

- Logic lives in `domain` library, not in controllers or UI

---

## Database

- PostgreSQL
- Prisma ORM in `data-access`
- Schema includes: User, Deck, Card, QuizAttempt, QuizAnswer
- Include migrations + seed script

---

## Authentication (Phase 2)

- Google SSO (OAuth)
- JWT backend auth
- Modular:
  - `auth` module in NestJS
  - `auth` hooks/services in frontend

---

## DevOps Foundations

- Dockerfiles for web, api, and postgres
- docker-compose for local dev
- Structure repo for future:
  - Kubernetes
  - Terraform (AWS infra)
  - CI/CD pipelines

---

## Output Expected from Claude

1. Nx workspace setup commands
2. Folder structure
3. Example of:
   - UI component (Mantine wrapped)
   - Storybook story
   - Domain logic (QuizStrategy)
   - NestJS module
4. Prisma schema
5. Unit test example for scoring logic

---

## Constraints

- Prioritize clean architecture
- Avoid tight frontend/backend coupling
- Keep business logic framework-agnostic
- Make future experimentation easy (Game Theory + strategy)

All generated code must follow this architecture.