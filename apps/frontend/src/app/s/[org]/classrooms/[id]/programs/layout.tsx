import type { PropsWithChildren } from "react";

import { SubjectProgramHeader } from "./SubjectProgramHeader";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2">
      <SubjectProgramHeader />
      {props.children}
    </div>
  );
}
