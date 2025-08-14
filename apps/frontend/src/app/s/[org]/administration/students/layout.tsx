import type { PropsWithChildren } from "react";

import { StudentStatAdmin } from "./StudentStatAdmin";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <StudentStatAdmin />
      {props.children}
    </div>
  );
}
