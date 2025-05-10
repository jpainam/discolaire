import type { PropsWithChildren } from "react";
import { PrintAction } from "./PrintAction";
import { TransactionTabMenu } from "./TransactionTabMenu";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between border-b py-1 px-4">
        <TransactionTabMenu />
        <PrintAction />
      </div>
      {props.children}
    </div>
  );
}
