"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { GitCompare, GitFork, GitMerge, GitPullRequest } from "lucide-react";

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

const items = [
  {
    date: "15 minutes ago",
    description:
      "Forked the repository to create a new branch for development.",
    icon: GitFork,
    id: 1,
    title: "Forked Repository",
  },
  {
    date: "10 minutes ago",
    description:
      "Submitted PR #342 with new feature implementation. Waiting for code review from team leads.",
    icon: GitPullRequest,
    id: 2,
    title: "Pull Request Submitted",
  },
  {
    date: "5 minutes ago",
    description:
      "Received comments on PR. Minor adjustments needed in error handling and documentation.",
    icon: GitCompare,
    id: 3,
    title: "Comparing Branches",
  },
  {
    description:
      "Merged the feature branch into the main branch. Ready for deployment.",
    icon: GitMerge,
    id: 4,
    title: "Merged Branch",
  },
];

export function ActivityTimeline({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: timeline } = useSuspenseQuery(
    trpc.staff.timelines.queryOptions(staffId),
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <Timeline defaultValue={3} className="text-xs">
          {items.slice(0, 4).map((item) => (
            <TimelineItem
              className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-4"
              key={item.id}
              step={item.id}
            >
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                <TimelineTitle className="mt-0.5 text-xs">
                  {item.title}
                </TimelineTitle>
                <TimelineIndicator className="bg-primary/10 group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                  <item.icon size={14} />
                </TimelineIndicator>
              </TimelineHeader>
              <TimelineContent className="text-xs">
                {item.description}
                <TimelineDate className="mt-2 mb-0 text-xs">
                  {item.date}
                </TimelineDate>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
}
