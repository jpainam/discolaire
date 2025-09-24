# ---------- Base ----------
FROM node:22-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1 TURBO_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat openssl
RUN npm i -g pnpm turbo
RUN pnpm config set store-dir ~/.pnpm-store

# ---------- Pruner ----------
FROM base AS pruner
WORKDIR /app
COPY . .
# Keep only what's needed for @repo/frontend
RUN turbo prune --scope=@repo/frontend --docker

# ---------- Builder ----------
FROM base AS builder
WORKDIR /app

# Copy pruned workspace manifests first (better caching)
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install deps for the pruned workspace (dev deps included for build)
RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --ignore-scripts

# Bring in the pruned source
COPY --from=pruner /app/out/full/ .

# Prisma client (if used by the app at runtime)
RUN if [ -d packages/db/prisma ]; then cd packages/db && pnpm prisma generate --schema=./prisma/schema; fi

# Normal build (no Next standalone)
ENV NODE_ENV=production
# Use your preferred build: turbo or direct filter
# RUN CI=true SKIP_ENV_VALIDATION=true turbo run build --filter=@repo/frontend
RUN CI=true SKIP_ENV_VALIDATION=true pnpm --filter=@repo/frontend build

# ---------- Runner ----------
FROM node:22-alpine AS runner
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
WORKDIR /app/apps/frontend

RUN npm i -g pnpm dotenv-cli
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app ./

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["pnpm", "start"]