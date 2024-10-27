import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";

import { SidebarTrigger } from "~/components/administration/sidebar";

export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 pt-2">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger />
        <Label>{title}</Label>
        {children && (
          <div className="mx-2 ml-auto flex items-center gap-2">{children}</div>
        )}
      </div>
      <Separator />
    </div>
  );
}
