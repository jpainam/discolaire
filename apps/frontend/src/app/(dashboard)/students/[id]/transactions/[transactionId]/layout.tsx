import type { PropsWithChildren } from "react";

import { TransactionDetailsHeader } from "./TransactionDetailsHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2 ">
      <TransactionDetailsHeader />
      {children}
    </div>
  );
}
