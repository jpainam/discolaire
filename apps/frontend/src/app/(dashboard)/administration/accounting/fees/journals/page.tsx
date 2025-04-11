import { Separator } from "@repo/ui/components/separator";

import { JournalHeader } from "~/components/administration/fees/JournalHeader";
import { JournalTable } from "~/components/administration/fees/JournalTable";
import { caller } from "~/trpc/server";

export default async function Page() {
  const journals = await caller.journal.all();
  return (
    <div className="flex flex-col">
      <JournalHeader />
      <Separator />
      <JournalTable journals={journals} />
    </div>
  );
}
