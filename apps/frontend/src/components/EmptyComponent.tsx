import type { ReactNode } from "react";
import { BirdIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";

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
        <EmptyMedia variant="icon">{icon ?? <BirdIcon />}</EmptyMedia>
        <EmptyTitle>{title ?? "No data"}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{content}</EmptyContent>
    </Empty>
  );
}
