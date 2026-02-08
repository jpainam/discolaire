"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Download,
  Edit3,
  LogIn,
  Plus,
  Trash2,
  Upload,
  User,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "~/components/ui/timeline";
import { useTRPC } from "~/trpc/react";

const iconByAction: Record<string, typeof Upload> = {
  uploaded: Upload,
  downloaded: Download,
  deleted: Trash2,
  delete: Trash2,
  create: Plus,
  update: Edit3,
  login: LogIn,
};

export function ActivityTimeline({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: timeline } = useSuspenseQuery(
    trpc.staff.activities.queryOptions({ staffId, limit: 20 }),
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <Timeline defaultValue={3} className="text-xs">
          {timeline.map((item, index) => {
            const Icon = iconByAction[item.action.toLowerCase()] ?? User;
            const date = formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
            });
            return (
              <TimelineItem
                className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-4"
                key={item.id}
                step={index + 1}
              >
                <TimelineHeader>
                  <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                  <TimelineTitle className="mt-0.5 text-xs">
                    {item.title}
                  </TimelineTitle>
                  <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                    <Icon size={14} />
                  </TimelineIndicator>
                </TimelineHeader>
                <TimelineContent className="text-xs">
                  {item.description}
                  <TimelineDate className="mt-2 mb-0 text-xs">
                    {date}
                  </TimelineDate>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      </CardContent>
    </Card>
  );
}
