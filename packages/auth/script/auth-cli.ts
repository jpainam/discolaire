/**
 * @fileoverview Better Auth CLI Configuration
 *
 * This file is used exclusively by the Better Auth CLI to generate database schemas.
 * DO NOT USE THIS FILE DIRECTLY IN YOUR APPLICATION.
 *
 * This configuration is consumed by the CLI command:
 * `pnpx @better-auth/cli generate --config script/auth-cli.ts --output ../db/src/auth-schema.ts`
 *  What i run:
 *  pnpm dlx @better-auth/cli generate --config packages/auth/script/auth-cli.ts --output packages/db/src/auth-schema.prisma
 *
 * For actual authentication usage, import from "../src/index.ts" instead.
 */

import { initAuth } from "../src/index";

/**
 * CLI-only authentication configuration for schema generation.
 *
 * @warning This configuration is NOT intended for runtime use.
 * @warning Use the main auth configuration from "../src/index.ts" for your application.
 */
export const auth = initAuth({
  secret: process.env.AUTH_SECRET,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://example.domain.com",
  tenant: "demo",
  //discordClientId: "1234567890",
  //discordClientSecret: "1234567890",
});
