import type { PropsWithChildren } from "react";

import { ClassroomFinancialSituationHeader } from "./ClassroomFinancialSituationHeader";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2">
      <ClassroomFinancialSituationHeader />
      {props.children}
    </div>
  );
}
