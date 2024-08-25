import { HealthHeader } from "@/components/students/health/HealthHeader";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col">
      <HealthHeader />
      {children}
    </div>
  );
}
