import type { PropsWithChildren } from "react";

import { PageHeader } from "../PageHeader";
import { CreateSchoolAction } from "./CreateSchoolAction";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <PageHeader title="My School">
        <CreateSchoolAction />
      </PageHeader>
      {children}
    </div>
  );
}
