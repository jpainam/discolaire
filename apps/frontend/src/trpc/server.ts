import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cookies, headers } from "next/headers";
import { cache } from "react";

import type { AppRouter } from "@repo/api";
import { createCaller, createTRPCContext } from "@repo/api";
import { auth } from "@repo/auth";

import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");
  heads.set("schoolYearId", (await cookies()).get("schoolYear")?.value ?? "");

  return createTRPCContext({
    session: await auth(),
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
//   queryOptions: T
// ) {
//   const queryClient = getQueryClient();
//   if (queryOptions.queryKey[1]?.type === "infinite") {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
//     void queryClient.prefetchInfiniteQuery(queryOptions as any);
//   } else {
//     void queryClient.prefetchQuery(queryOptions);
//   }
// }
