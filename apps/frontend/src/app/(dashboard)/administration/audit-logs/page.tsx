import { Suspense } from "react";
import { createSearchParamsCache } from "nuqs/server";

import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { fromDateForRange } from "./_config";
import { auditLogParsers } from "./_parsers";
import { ActivityAuditList } from "./ActivityAuditList";
import { ActivityFilter } from "./ActivityFilter";

const searchParamsCache = createSearchParamsCache(auditLogParsers);

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { q, range } = searchParamsCache.parse(await searchParams);

  batchPrefetch([
    // ActivityFilter: user list (static, never changes)
    trpc.logActivity.all.queryOptions({ limit: 100 }),
    // ActivityAuditList: first page matching the URL's current search + date range
    trpc.logActivity.allPaginated.queryOptions({
      query: q || undefined,
      from: fromDateForRange(range),
      page: 1,
      pageSize: 25,
    }),
  ]);

  return (
    <HydrateClient>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Suspense because ActivityFilter uses useSuspenseQuery */}
          <Suspense>
            <ActivityFilter />
          </Suspense>
          <ActivityAuditList />
        </div>
      </div>
    </HydrateClient>
  );
}
