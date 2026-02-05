import { Mail, ShieldAlert } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

export function NoPermission({
  title,
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
}: {
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShieldAlert className="text-yellow-600" />
        </EmptyMedia>
        <EmptyTitle>{title ?? "Permission Required"}</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {description ??
            "You don't have the necessary permissions to access this content."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <Mail className="h-4 w-4" />
          Contact Administration
        </Button>
      </EmptyContent>
    </Empty>
  );
}
