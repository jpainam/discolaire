# syntax=docker.io/docker/dockerfile:1

FROM node:23-alpine AS base

#ENV NODE_OPTIONS="--max-old-space-size=6144"
ENV NODE_OPTIONS="--max-old-space-size=8192"
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
RUN  corepack enable pnpm && pnpm i --frozen-lockfile --ignore-scripts


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV TURBO_CONCURRENCY=1
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_DISABLE_SOURCEMAPS=1

RUN corepack enable pnpm 
RUN pnpm i --ignore-scripts 
#ENV NODE_OPTIONS="--max-old-space-size=6144"
ENV NODE_OPTIONS="--max-old-space-size=8192"
# RUN --mount=type=secret,id=env \
#    set -a; . /run/secrets/env; set +a;
RUN pnpm prisma generate --schema=/app/packages/db/prisma/schema

ARG AUTH_SECRET
ARG DISCOLAIRE_API_KEY
ARG RESEND_API_KEY
ARG DATABASE_URL
ARG S3_DOCUMENT_BUCKET_NAME
ARG NEXT_PUBLIC_BASE_URL
ARG S3_ACCESS_KEY_ID
ARG S3_REGION
ARG S3_BUCKET_NAME
ARG S3_SECRET_ACCESS_KEY
ARG S3_AVATAR_BUCKET_NAME
ARG S3_IMAGE_BUCKET_NAME
ARG WHATSAPP_VERIFY_TOKEN
ARG WHATSAPP_API_TOKEN
ARG REDIS_URL
ARG SUPER_ADMIN_USERNAME
ARG NEXT_PUBLIC_MINIO_URL
ARG WHATSAPP_BUSINESS_PHONE_NUMBER_ID
ARG NOVU_API_KEY
ARG XAI_API_KEY
ARG MESSAGING_SERVICE_URL
ARG MESSAGING_SECRET_KEY
ARG NEXT_PUBLIC_DEPLOYMENT_ENV


ENV AUTH_SECRET=$AUTH_SECRET
ENV DISCOLAIRE_API_KEY=$DISCOLAIRE_API_KEY
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV S3_DOCUMENT_BUCKET_NAME=$S3_DOCUMENT_BUCKET_NAME
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_REGION=$S3_REGION
ENV S3_BUCKET_NAME=$S3_BUCKET_NAME
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY
ENV S3_AVATAR_BUCKET_NAME=$S3_AVATAR_BUCKET_NAME
ENV S3_IMAGE_BUCKET_NAME=$S3_IMAGE_BUCKET_NAME
ENV WHATSAPP_VERIFY_TOKEN=$WHATSAPP_VERIFY_TOKEN
ENV WHATSAPP_API_TOKEN=$WHATSAPP_API_TOKEN
ENV REDIS_URL=$REDIS_URL
ENV NOVU_API_KEY=$NOVU_API_KEY
ENV SUPER_ADMIN_USERNAME=$SUPER_ADMIN_USERNAME
ENV NEXT_PUBLIC_MINIO_URL=$NEXT_PUBLIC_MINIO_URL
ENV MESSAGING_SERVICE_URL=$MESSAGING_SERVICE_URL
ENV MESSAGING_SECRET_KEY=$MESSAGING_SECRET_KEY
ENV NEXT_PUBLIC_DEPLOYMENT_ENV=$NEXT_PUBLIC_DEPLOYMENT_ENV
ENV XAI_API_KEY=$XAI_API_KEY
ENV WHATSAPP_BUSINESS_PHONE_NUMBER_ID=$WHATSAPP_BUSINESS_PHONE_NUMBER_ID

RUN pnpm build --filter=@repo/frontend

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup -S -g 1001 nodejs \
 && adduser  -S -D -H -u 1001 -G nodejs nextjs

# COPY --from=builder /app/apps/frontend/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/standalone/apps/frontend ./
# COPY --from=builder --chown=nextjs:nodejs /app/apps/frontend/.next/static ./.next/static

COPY --from=builder  --chown=nextjs:nodejs /app/apps/frontend/.next/standalone ./
COPY --from=builder  --chown=nextjs:nodejs /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder  --chown=nextjs:nodejs /app/apps/frontend/public ./apps/frontend/public

RUN find /app -type d -exec chmod 755 {} \; \
 && find /app -type f -exec chmod 644 {} \; \
 && chmod 755 /app/apps/frontend/server.js

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
RUN apk add --no-cache curl
HEALTHCHECK --interval=5m --timeout=3s --start-period=60s --retries=3 \
   CMD curl -fsS http://127.0.0.1:3000/ || exit 1

CMD ["node", "apps/frontend/server.js"]