import type { PropsWithChildren } from "react";

import { AssignmentSidebar } from "./AssignmentSidebar";
import { AssignmentToolbar } from "./AssignmentToolbar";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <AssignmentSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AssignmentToolbar />

        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
