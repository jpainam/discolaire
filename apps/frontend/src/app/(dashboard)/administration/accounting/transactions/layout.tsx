import type { PropsWithChildren } from "react";

import { Separator } from "@repo/ui/separator";

import { TransactionHeader } from "~/components/administration/transactions/TransactionHeader";
import { TransactionToolbar } from "~/components/administration/transactions/TransactionToolbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-full flex-col">
      <TransactionHeader />
      <Separator />
      <TransactionToolbar />
      {children}
    </div>
  );
}
