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
import { EyeIcon, PencilIcon, PlusIcon, Trash, Trash2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { EmptyState } from "../EmptyState";

export function StudentActivityLog() {
  const params = useParams<{ id: string }>();
  const { t, i18n } = useLocale();
  const trpc = useTRPC();
  const logsQuery = useQuery(
    trpc.logActivity.findByEntityId.queryOptions({
      entityId: params.id,
      entityType: "student",
    }),
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
        {logs.map((item, index) => {
          let action = "";
          let icon = null;
          if (item.type === "CREATE") {
            icon = <PlusIcon size={14} />;
            action = "has created";
          } else if (item.type === "UPDATE") {
            icon = <PencilIcon size={14} />;
            action = "has updated";
          } else if (item.type === "DELETE") {
            icon = <Trash2Icon size={14} className="text-destructive" />;
            action = "has deleted";
          } else {
            icon = <EyeIcon size={14} />;
            action = "has read";
          }
          return (
            <TimelineItem
              className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-1"
              key={index}
              step={item.id}
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineTitle className="-mt-0.5 text-xs">
                  {item.user.name}
                </TimelineTitle>
                <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                  {icon}
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent className="text-xs ">
                {t(action)}{" "}
                <a className="text-blue-500 underline" href={item.url}>
                  {item.title}
                </a>
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
          );
        })}
      </Timeline>
    </div>
  );
}
