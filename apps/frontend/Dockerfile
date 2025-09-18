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

COPY apps/frontend/public apps/frontend/.next/standalone/public
#RUN mkdir -p apps/frontend/.next/standalone/public/_next/static
#RUN cp -r apps/frontend/.next/static/* apps/frontend/.next/standalone/public/_next/static

CMD node apps/frontend/.next/standalone/server.js
