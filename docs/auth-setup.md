# Google Auth and Role-Based Access Setup

This project now supports:

- Google SSO for sign-in (first and primary user flow)
- Role-based authorization in API (`admin`, `creator`, `reader`)
- Admin-only role scenario switcher in topnav for UI/API authorization testing

## 1. Create Google OAuth Credentials

1. Open Google Cloud Console and select your project.
2. Go to **APIs & Services** -> **Credentials**.
3. Click **Create Credentials** -> **OAuth client ID**.
4. App type: **Web application**.
5. Add this Authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

6. Copy the generated Client ID and Client Secret.

## 2. Configure Environment Variables

### Web app env (`apps/web/.env.local`)

```bash
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="replace-with-a-random-long-secret"
ADMIN_EMAIL="you@gmail.com"
API_JWT_SECRET="replace-with-a-shared-jwt-secret"
```

### API env (shell export before `npm run serve:api` or `npm run serve:dev`)

```bash
export API_JWT_SECRET="replace-with-the-same-value-as-web"
export ADMIN_EMAIL="you@gmail.com"
```

`API_JWT_SECRET` must match in both web and API because the web issues a signed API JWT per session and API verifies it.

## 3. Update DB Schema and Seed Admin User

```bash
npm run db:migrate
npm run db:generate
npm run db:seed
```

The seed script creates one admin user with email from `ADMIN_EMAIL`.

## 4. Run the Stack

```bash
npm run serve:dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:3333/api`
- Swagger: `http://localhost:3333/api/docs`

## 5. Sign In and Test Scenarios

1. Open web app and click **Sign in with Google**.
2. Sign in with the same Google account as `ADMIN_EMAIL`.
3. In topnav, use **Scenario** dropdown to switch between:
   - Admin
   - Creator
   - Reader

The selected scenario is sent to the API in a dedicated header and only honored for real admin users.

## 6. Authorization Rules Implemented

### API access requirements

All Deck/Card CRUD endpoints require a valid bearer token.

### Roles

- `admin`: read/write everything owned by current user, can scenario-switch for testing
- `creator`: can read and mutate own decks/cards
- `reader`: read-only access to own decks/cards

### Endpoint policy

- `GET /api/decks` and `GET /api/decks/:id`: `admin | creator | reader`
- `POST/PATCH/DELETE /api/decks*`: `admin | creator`
- `GET /api/decks/:deckId/cards`: `admin | creator | reader`
- `POST/PATCH/DELETE /api/decks/:deckId/cards*`: `admin | creator`

## 7. Adding More SSO Providers Later

To add future SSO methods (GitHub, Microsoft Entra ID, etc.):

1. Add provider to `apps/web/src/auth.ts` providers array.
2. Keep role resolution centralized in callback logic.
3. Keep JWT claim contract stable (`sub`, `email`, `role`) so API guards do not change.
4. Optionally add provider-specific IDs in Prisma `User` model (`githubId`, `entraOid`, etc.).

This keeps your auth model extensible while preserving API authorization behavior.
