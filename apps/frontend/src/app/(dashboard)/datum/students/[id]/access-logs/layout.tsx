import type { PropsWithChildren } from "react";

import { Separator } from "@repo/ui/separator";

import { AccessLogsHeader } from "~/components/students/access-logs/AccessLogsHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col">
      <AccessLogsHeader />
      <Separator />
      {children}
    </div>
  );
}
