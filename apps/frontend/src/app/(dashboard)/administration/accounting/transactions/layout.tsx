import type { PropsWithChildren } from "react";

import { TransactionHeader } from "~/components/administration/transactions/TransactionHeader";
import { TransactionToolbar } from "~/components/administration/transactions/TransactionToolbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <TransactionHeader />
      <div className="px-4">
        <TransactionToolbar />
      </div>
      {children}
    </div>
  );
}
