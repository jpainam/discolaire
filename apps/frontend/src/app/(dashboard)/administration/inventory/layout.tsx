import type { PropsWithChildren } from "react";
import { InventoryHeader } from "./InventoryHeader";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col py-2">
      <InventoryHeader />
      {props.children}
    </div>
  );
}
