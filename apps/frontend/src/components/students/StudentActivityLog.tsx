"use client";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@repo/ui/components/timeline";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { useQuery } from "@tanstack/react-query";
import { PencilIcon, PlusIcon, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { EmptyState } from "../EmptyState";
import EyeIcon from "../icons/eye";

export function StudentActivityLog() {
  const params = useParams<{ id: string }>();
  const { i18n } = useLocale();
  const trpc = useTRPC();
  const logsQuery = useQuery(
    trpc.logActivity.findByEntityId.queryOptions({
      entityId: params.id,
      entityType: "student",
    })
  );
  if (logsQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }
  const logs = logsQuery.data;
  if (!logs || logs.length == 0) {
    return <EmptyState title="No activities yet" className="my-8" />;
  }

  return (
    <div className="flex justify-center items-center flex-col gap-2 py-1">
      <ToggleGroup
        variant="outline"
        type="multiple"
        defaultValue={["all"]}
        className="*:data-[slot=toggle-group-item]:w-12"
      >
        <ToggleGroupItem size={"sm"} value="read" aria-label="Toggle all">
          <EyeIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem size={"sm"} value="update" aria-label="Toggle missed">
          <PencilIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem size={"sm"} value="create" aria-label="Toggle missed">
          <PlusIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem size={"sm"} value="delete" aria-label="Toggle missed">
          <Trash className="h-4 w-4 text-destructive" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Timeline className="w-full px-2 gap-2" defaultValue={3}>
        {logs.map((item, index) => (
          <TimelineItem
            className="group-data-[orientation=vertical]/timeline:not-last:pb-1"
            key={index}
            step={item.id}
          >
            <TimelineHeader>
              <TimelineSeparator />
              <TimelineTitle className="-mt-0.5 text-xs">
                {item.user.name}
              </TimelineTitle>
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent className="text-xs ">
              <a href={item.url}>a consulter la page de {item.title}</a>
              <TimelineDate className="m-0 text-xs">
                {item.createdAt.toLocaleDateString(i18n.language, {
                  month: "short",
                  weekday: "short",
                  day: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TimelineDate>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
