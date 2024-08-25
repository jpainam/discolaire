import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";

import { JournalHeader } from "~/components/administration/fees/JournalHeader";
import { JournalTable } from "~/components/administration/fees/JournalTable";
import { api } from "~/trpc/server";

export default async function Page() {
  const journals = await api.journal.all();
  return (
    <div className="flex flex-col">
      <JournalHeader />
      <Separator />
      {journals ? <JournalTable journals={journals} /> : <EmptyState />}
    </div>
  );
}
