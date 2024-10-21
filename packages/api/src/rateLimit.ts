import type { RatelimitConfig } from "@unkey/ratelimit";
import { TRPCError } from "@trpc/server";
import { NoopRatelimit, Ratelimit } from "@unkey/ratelimit";

import type { TrpcContextType } from "./trpc";
import { env } from "../env";
import { t } from "./trpc";

export const ipIdentifier = (_ctx: TrpcContextType) => `ip:127.0.0.1`;
export const accountIdentifier = (ctx: TrpcContextType) =>
  `account:${ctx.session?.user.id}`;
export const schoolIdentifier = (ctx: TrpcContextType) =>
  `org:${ctx.session?.user.schoolId}`;

const cachedLimiters = new Map<string, Ratelimit | NoopRatelimit>();

interface RatelimiterConfig {
  /**
   * Number of requests allowed
   */
  limit: number;
  /**
   * Duration of the rate limit window
   * @default '1h'
   */
  duration?: RatelimitConfig["duration"];
  /**
   * Namespace for the rate limit
   */
  namespace: RatelimitConfig["namespace"];
  /**
   * Function to create the identifier for the rate limit
   * @default ipIdentifier
   */
  createIdentifier?: (ctx: TrpcContextType) => string;
}

export const ratelimiter = ({
  limit,
  duration = "1h",
  namespace = "default-api",
  createIdentifier = ipIdentifier,
}: RatelimiterConfig) =>
  t.middleware(async ({ ctx, path, next }) => {
    let limiter = cachedLimiters.get(path);

    if (!limiter) {
      limiter = env.UNKEY_ROOT_KEY
        ? new Ratelimit({
            async: true,
            namespace,
            limit,
            duration,
            rootKey: env.UNKEY_ROOT_KEY,
          })
        : new NoopRatelimit();
      cachedLimiters.set(path, limiter);
    }
    const identifier = createIdentifier(ctx);
    const result = await limiter.limit(identifier);

    if (result.success) {
      return next();
    } else {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Too many requests, try again in ${Math.floor((result.reset - Date.now()) / 1000)} seconds`,
      });
    }
  });
