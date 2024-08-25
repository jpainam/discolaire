import { TransactionHeader } from "@/components/administration/transactions/TransactionHeader";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex  flex-col h-full w-full">
      <TransactionHeader />
      {children}
    </div>
  );
}
