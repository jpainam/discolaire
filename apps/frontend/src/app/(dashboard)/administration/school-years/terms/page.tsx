import { Separator } from "@repo/ui/separator";

import { TermHeader } from "./TermHeader";
import { TermTable } from "./TermTable";

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <TermHeader />
      <Separator />
      <TermTable />
    </div>
  );
}
