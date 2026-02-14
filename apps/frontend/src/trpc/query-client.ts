import {
  defaultShouldDehydrateQuery,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";
import SuperJSON from "superjson";

export const isUnauthorizedTRPCError = (error: unknown): boolean => {
  if (error instanceof TRPCError) {
    return error.code === "UNAUTHORIZED";
  }

  if (typeof error === "object" && error !== null && "code" in error) {
    return (error as { code?: unknown }).code === "UNAUTHORIZED";
  }

  return false;
};

interface CreateQueryClientOptions {
  onUnauthorized?: () => void;
}

export const createQueryClient = (options: CreateQueryClientOptions = {}) =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isUnauthorizedTRPCError(error)) {
          options.onUnauthorized?.();
          return;
        }
        console.error("QueryCache", error.message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isUnauthorizedTRPCError(error)) {
          options.onUnauthorized?.();
          return;
        }
        console.error("MutationCache", error.message);
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 30 * 1000,
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
        shouldRedactErrors: () => {
          // We should not catch Next.js server errors
          // as that's how Next.js detects dynamic pages
          // so we cannot redact them.
          // Next.js also automatically redacts errors for us
          // with better digests.
          return false;
        },
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  });
