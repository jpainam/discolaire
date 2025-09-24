# Base stage with Alpine image
FROM node:23.11.1-alpine AS base
WORKDIR /app

# # # Install necessary packages
RUN apk update && apk add --no-cache libc6-compat openssh git

ENV NODE_OPTIONS="--max-old-space-size=6144"

# # # Install pnpm and turbo globally define you specific version according to the package.json
RUN npm install -g pnpm turbo  
RUN pnpm config set store-dir ~/.pnpm-store

# # #############################################################
# # # Stage 1 - Pruning unnecessary files                       #
# # #############################################################

FROM base AS pruner

# Copy all files to the container and Prune files that are not needed for the specified project
COPY . .
RUN npx turbo prune --scope=@repo/frontend --docker

# # #############################################################
# # # Stage 2 - Installing dependencies and building            #
# # #############################################################

FROM base AS builder
WORKDIR /app
# # Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

# Install dependencies using pnpm, using a cache for faster builds
RUN --mount=type=cache,id=pnpm-store,target=~/.pnpm-store pnpm install --ignore-scripts

# # Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

RUN pnpm prisma generate --schema=packages/db/prisma/schema
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1

# Set environment variables for build
ENV RESEND_API_KEY="dummy-key-for-build"
ENV AUTH_SECRET="dummy-auth-secret"
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DISCOLAIRE_API_KEY="dummy-api-key"
ENV S3_ACCESS_KEY_ID="dummy"
ENV S3_SECRET_ACCESS_KEY="dummy"
ENV S3_REGION="us-east-1"
ENV S3_BUCKET_NAME="dummy"
ENV S3_AVATAR_BUCKET_NAME="dummy"
ENV S3_IMAGE_BUCKET_NAME="dummy"
ENV S3_DOCUMENT_BUCKET_NAME="dummy"
ENV WHATSAPP_VERIFY_TOKEN="dummy"
ENV WHATSAPP_API_TOKEN="dummy"
ENV REDIS_URL="redis://localhost:6379"
ENV SUPER_ADMIN_USERNAME="admin"
ENV NEXT_PUBLIC_BASE_URL="http://localhost:3000"
ENV NEXT_PUBLIC_DEPLOYMENT_ENV="production"
ENV NEXT_PUBLIC_MINIO_URL="http://localhost:9000"
ENV NEXT_PUBLIC_PROSPECT_SERVICE_URL="http://localhost:3001"
ENV NEXT_PUBLIC_LIBRARY_SERVICE_URL="http://localhost:3002"
ENV MESSAGING_SERVICE_URL="http://localhost:3003"
ENV MESSAGING_SECRET_KEY="dummy"
ENV NOVU_API_KEY="dummy"
ENV WHATSAPP_BUSINESS_PHONE_NUMBER_ID="dummy"

RUN CI=true SKIP_ENV_VALIDATION=true turbo build --filter=@repo/frontend
#RUN CI=true pnpm prune --prod --no-optional

# # Cleanup: Remove source files that are not needed
RUN rm -rf ./**/*/src
RUN rm -rf apps/frontend/.next/standalone/node_modules


# # #############################################################
# # # Stage 3 - Run the application                             #
# # #############################################################

FROM base AS runner

WORKDIR /app/

ENV NODE_ENV="production"

# Copy built files from the builder stage
# COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/ .     

# Create necessary directories and copy static files
RUN mkdir -p apps/frontend/.next/standalone/apps/frontend/.next/public/_next/static

# Copy public folder if it exists
RUN if [ -d "apps/frontend/public" ]; then \
    cp -r apps/frontend/public/* apps/frontend/.next/standalone/apps/frontend/.next/public/ || true; \
    fi

# Copy Next.js static files if they exist
RUN if [ -d "apps/frontend/.next/static" ]; then \
    cp -r apps/frontend/.next/static/* apps/frontend/.next/standalone/apps/frontend/.next/public/_next/static/ || true; \
    fi

CMD ["node", "apps/frontend/.next/standalone/apps/frontend/server.js"]