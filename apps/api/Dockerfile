FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx nx build api --configuration=production

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist/apps/api ./
RUN npm ci --omit=dev

EXPOSE 3333
CMD ["node", "main.js"]
