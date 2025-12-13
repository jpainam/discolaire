import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { FundTable } from "./FundTable";

export default async function Page() {
  //batchPrefetch([trpc.transaction.quotas.queryOptions()]);
  //const t = await getTranslations();
  const queryClient = getQueryClient();
  const journals = await queryClient.fetchQuery(
    trpc.accountingJournal.all.queryOptions(),
  );
  return (
    <HydrateClient>
      <Tabs defaultValue={journals.at(0)?.id} className="px-4 py-2">
        <TabsList>
          {journals.map((j, index) => (
            <TabsTrigger key={index} value={j.id}>
              {j.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {journals.map((j, index) => {
          return (
            <TabsContent key={index} value={j.id} className="">
              <ErrorBoundary errorComponent={ErrorFallback}>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 32 }).map((_, index) => (
                        <Skeleton key={index} className="h-8" />
                      ))}
                    </div>
                  }
                >
                  <FundTable journalId={j.id} />
                </Suspense>
              </ErrorBoundary>
            </TabsContent>
          );
        })}

        <TabsContent value="school_fees"></TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
