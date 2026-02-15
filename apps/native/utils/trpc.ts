import type { AppRouter } from "@repo/api";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import { Platform } from "react-native";
import { authClient } from "./auth-client";
import { env } from "./env";
import { getSchoolYearId } from "./school-year";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    },
  },
});

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient({
    links: [
      loggerLink({
        enabled: (opts) =>
          process.env.NODE_ENV === "development" ||
          (opts.direction === "down" && opts.result instanceof Error),
        colorMode: "ansi",
      }),
      httpBatchLink({
        transformer: superjson,
        url: `${env.EXPO_PUBLIC_SERVER_URL}/api/trpc`,
        headers() {
          const headers = new Map<string, string>();
          headers.set("discolaire-tenant", env.EXPO_PUBLIC_TENANT);

          if (Platform.OS === "web") {
            return Object.fromEntries(headers);
          }

          const cookieParts: string[] = [];
          const authCookies = authClient.getCookie();
          if (authCookies) {
            cookieParts.push(authCookies);
          }

          const schoolYearId = getSchoolYearId();
          if (schoolYearId) {
            cookieParts.push(`x-school-year=${encodeURIComponent(schoolYearId)}`);
          }

          if (cookieParts.length > 0) {
            headers.set("Cookie", cookieParts.join("; "));
          }

          return Object.fromEntries(headers);
        },
      }),
    ],
  }),
  queryClient,
});

export { type RouterInputs, type RouterOutputs } from "@repo/api";
