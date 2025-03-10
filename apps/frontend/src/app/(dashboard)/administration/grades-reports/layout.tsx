import type { PropsWithChildren } from "react";
import { GradesReportsHeader } from "./GradesReportsHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="w-full flex flex-col">
      <GradesReportsHeader />
      {children}
    </div>
  );
}
