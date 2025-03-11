import type { PropsWithChildren } from "react";
import { TimetableHeader } from "./TimetableHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2">
      <TimetableHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
