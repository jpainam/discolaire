import type { PropsWithChildren } from "react";

import { TransactionHeader } from "~/components/administration/transactions/TransactionHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full w-full flex-col">
      <TransactionHeader />
      {children}
    </div>
  );
}
