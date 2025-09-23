FROM node:23.11.1-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat 

RUN npm install pnpm@ turbo --global
RUN pnpm config set store-dir ~/.pnpm-store

# Prune projects
FROM base AS pruner


WORKDIR /app
COPY . .
RUN turbo prune --scope=@repo/frontend --docker

# Build the project
FROM base AS builder

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile --ignore-scripts

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .


ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd packages/db && \
  pnpm prisma generate --schema=./prisma/schema
  
RUN CI=true SKIP_ENV_VALIDATION=true turbo build --filter=@repo/frontend
# Clean and regenerate with explicit binary target

RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional

FROM base AS runner

WORKDIR /app
# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./next/standalone/apps/app/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/public ./next/standalone/apps/app/public

COPY --from=builder --chown=nextjs:nodejs /app/packages/db/generated ./next/standalone/apps/frontend/generated
USER nextjs

EXPOSE 3000
ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "next/standalone/apps/frontend/server.js"]