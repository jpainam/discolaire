import type { PropsWithChildren } from "react";

import { ClassroomCreateGradeSheetHeader } from "./ClassroomCreateGradeSheetHeader";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <ClassroomCreateGradeSheetHeader />
      {props.children}
    </div>
  );
}
