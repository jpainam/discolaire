import { PropsWithChildren } from "react";

import { HealthHeader } from "~/components/students/health/HealthHeader";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col">
      <HealthHeader />
      {children}
    </div>
  );
}
