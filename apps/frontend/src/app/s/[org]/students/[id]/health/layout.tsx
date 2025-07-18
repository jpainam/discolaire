import type { PropsWithChildren } from "react";

import { HealthHeader } from "~/components/students/health/HealthHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <HealthHeader />
      {children}
    </div>
  );
}
