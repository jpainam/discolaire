"use client";
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
import { CheckIcon, PencilIcon, PlusIcon, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import EyeIcon from "../icons/eye";

const items = [
  {
    id: 1,
    date: "Mar 15, 2024",
    title: "Project Kickoff",
    description:
      "Initial team meeting and project scope definition. Established key milestones and resource allocation.",
  },
  {
    id: 2,
    date: "Mar 22, 2024",
    title: "Design Phase",
    description:
      "Completed wireframes and user interface mockups. Stakeholder review and feedback incorporated.",
  },
  {
    id: 3,
    date: "Apr 5, 2024",
    title: "Development Sprint",
    description:
      "Backend API implementation and frontend component development in progress.",
  },
  {
    id: 4,
    date: "Apr 19, 2024",
    title: "Testing & Deployment",
    description:
      "Quality assurance testing, performance optimization, and production deployment preparation.",
  },
];

export function StudentActivityLog() {
  const params = useParams<{ id: string }>();
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: logs } = useQuery(
    trpc.logActivity.findByEntityId.queryOptions({
      entityId: params.id,
      entityType: "student",
    })
  );
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

      <Timeline defaultValue={3}>
        {[...items, ...items, ...items, ...items, ...items].map(
          (item, index) => (
            <TimelineItem
              key={index}
              step={item.id}
              className="group-data-[orientation=vertical]/timeline:ms-10"
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineDate>{item.date}</TimelineDate>
                <TimelineTitle>{item.title}</TimelineTitle>
                <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                  <CheckIcon
                    className="group-not-data-completed/timeline-item:hidden"
                    size={16}
                  />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent>{item.description}</TimelineContent>
            </TimelineItem>
          )
        )}
      </Timeline>
    </div>
  );
}
