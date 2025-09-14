FROM node:24-alpine AS base

RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app

RUN npm install -g turbo
COPY . .
RUN turbo prune --scope=@repo/frontend --docker

FROM base AS installer
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo

ARG TURBO_TEAM
ARG TURBO_TOKEN

ENV TURBO_TEAM=$TURBO_TEAM
ENV TURBO_TOKEN=$TURBO_TOKEN

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY .npmrc .npmrc

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --ignore-scripts


# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

## This would be useful for browser environment variables that are actually baked at build time and you aren't passing them in otherwise.
# COPY .env .env 
RUN pnpm --filter @repo/db generate
RUN CI=true SKIP_ENV_VALIDATION=true turbo run build --filter=@repo/frontend...

FROM base AS runner
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

EXPOSE 3000
ENV PORT=3000

ENV NODE_ENV=production
ENV HOSTNAME=localhost

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/frontend/next.config.ts .
COPY --from=installer /app/apps/frontend/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

CMD ["node", "server.js"]