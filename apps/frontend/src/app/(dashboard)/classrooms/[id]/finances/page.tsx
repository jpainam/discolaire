import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "~/components/error-fallback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomFinanceHeader } from "./ClassroomFinanceHeader";
import { ClassroomFinanceTable } from "./ClassroomFinanceTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const queryClient = getQueryClient();
  const journals = await queryClient.fetchQuery(
    trpc.accountingJournal.all.queryOptions(),
  );
  const params = await props.params;
  const fees = await queryClient.fetchQuery(
    trpc.classroom.fees.queryOptions(params.id),
  );

  const journalIds = fees.map((fee) => fee.journalId);
  const currentJournals = journals.filter((journal) =>
    journalIds.includes(journal.id),
  );
  const one = currentJournals[0];
  return (
    <HydrateClient>
      <ClassroomFinanceHeader />
      <Tabs defaultValue={one?.id}>
        <TabsList>
          {currentJournals.map((journal, index) => (
            <TabsTrigger key={index} value={journal.id}>
              {journal.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {currentJournals.map((journal, index) => (
          <TabsContent key={index} value={journal.id}>
            <ErrorBoundary errorComponent={ErrorFallback}>
              <ClassroomFinanceTable
                fees={fees}
                classroomId={params.id}
                journalId={journal.id}
              />
            </ErrorBoundary>
          </TabsContent>
        ))}
      </Tabs>
    </HydrateClient>
  );
}
