import type { PropsWithChildren } from "react";

import { TimetableSidebar } from "~/components/timetables/TimetableSidebar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-row">
      <TimetableSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
