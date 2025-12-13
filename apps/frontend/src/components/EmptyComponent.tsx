import type { ReactNode } from "react";
import { FileTextIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";

export function EmptyComponent({
  title,
  description,
  content,
  icon,
}: {
  title?: string;
  description?: string;
  content?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon ?? <FileTextIcon />}</EmptyMedia>
        <EmptyTitle>{title ?? "No data"}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{content}</EmptyContent>
    </Empty>
  );
}
