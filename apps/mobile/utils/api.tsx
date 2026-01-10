import type { AppRouter } from "@repo/api";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";
import { authClient } from "./auth";

import { getBaseUrl } from "./base-url";
import { getSchoolYear, getToken, setSchoolYear } from "./session-store";

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
        url: `${getBaseUrl()}/api/trpc`,
        headers() {
          const headers = new Map<string, string>();
          headers.set("x-trpc-source", "expo-react");
          // I'll extract the tenant from the logged user info later.
          headers.set("discolaire-tenant", "public");
          // TODO Temporary setting up a default school year
          setSchoolYear("cmcw47cfx0001rz9rbf924zvb");
          const schoolYear = getSchoolYear();

          const cookies =
            authClient.getCookie() + ";x-school-year=" + schoolYear;

          // add cookies to the headers
          if (cookies) {
            headers.set("Cookie", cookies);
          }

          const token = getToken();
          if (token) headers.set("Authorization", `Bearer ${token}`);

          return Object.fromEntries(headers);
        },
      }),
    ],
  }),
  queryClient,
});

export { type RouterInputs, type RouterOutputs } from "@repo/api";
