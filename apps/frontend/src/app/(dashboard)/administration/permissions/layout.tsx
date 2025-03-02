import type { PropsWithChildren } from "react";
import { PermissionAction } from "./PermissionAction";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <PermissionAction />
      {children}
    </div>
  );
}
