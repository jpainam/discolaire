import type React from "react";

import { GradeAppreciationHeader } from "~/components/administration/grade-management/GradeAppreciationHeader";
import { GradeAppreciationList } from "~/components/administration/grade-management/GradeAppreciationList";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row gap-2">
      <GradeAppreciationHeader />
      <GradeAppreciationList />
      {children}
    </div>
  );
}
