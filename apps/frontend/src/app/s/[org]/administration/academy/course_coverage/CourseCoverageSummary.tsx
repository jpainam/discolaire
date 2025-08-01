"use client";

import {
  CheckCircle,
  MoreHorizontal,
  Pin,
  Settings,
  Share2,
  Trash,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components//dropdown-menu";
import { Progress } from "@repo/ui/components//progress";
import { Separator } from "@repo/ui/components//separator";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { cn } from "@repo/ui/lib/utils";

import { Badge } from "~/components/base-badge";

export function CourseCoverageSummary() {
  const performance = [
    {
      label: "Deals Closed",
      value: 27,
      trend: 12,
      trendDir: "up",
    },
    {
      label: "Revenue",
      value: "$182.4k",
      trend: 6,
      trendDir: "up",
    },
    {
      label: "Conversion",
      value: "72%",
      trend: 3,
      trendDir: "down",
    },
  ];
  const pipelineProgress = 76;
  const activity = [
    {
      text: "Closed deal with FinSight Inc.",
      date: "Today",
      state: "secondary",
      color: "text-green-500",
    },
    {
      text: "3 new leads added to Pipeline.",
      date: "Yesterday",
      state: "secondary",
      color: "text-green-500",
    },
    {
      text: "Follow-up scheduled.",
      date: "2 days ago",
      state: "destructive",
      color: "text-destructive",
    },
  ];

  return (
    <div className="flex items-center justify-center">
      {/* Card */}
      <Card className="w-full">
        <CardHeader className="">
          <CardTitle className="flex flex-col gap-1">
            <span>Staff Performance</span>
            <span className="text-muted-foreground text-xs font-normal">
              Sales Manager
            </span>
          </CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="-me-1.5 size-7"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TriangleAlert /> Add Alert
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pin /> Pin to Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 /> Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Q3 Performance */}
          <div>
            <div className="text-accent-foreground mb-2.5 text-sm font-medium">
              Q3 Performance
            </div>
            <div className="grid grid-cols-3 gap-2">
              {performance.map((item) => (
                <div
                  className="flex flex-col items-start justify-start"
                  key={item.label}
                >
                  <div className="text-foreground text-xl font-bold">
                    {item.value}
                  </div>
                  <div className="text-muted-foreground mb-1 text-xs font-medium">
                    {item.label}
                  </div>

                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-xs font-semibold",
                      item.trendDir === "up"
                        ? "text-green-500"
                        : "text-destructive",
                    )}
                  >
                    {item.trendDir === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {item.trendDir === "up" ? "+" : "-"}
                    {item.trend}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Pipeline Progress */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-foreground text-sm font-medium">
                Pipeline Progress
              </span>
              <span className="text-foreground text-xs font-semibold">
                {pipelineProgress}%
              </span>
            </div>
            <Progress value={pipelineProgress} className="bg-muted" />
          </div>

          <Separator />

          {/* Recent Activity */}
          <div>
            <div className="text-foreground mb-2.5 text-sm font-medium">
              Recent Activity
            </div>
            <ul className="space-y-2">
              {activity.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-2.5 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className={cn("h-3.5 w-3.5", a.color)} />
                    <span className="text-foreground truncate text-xs">
                      {a.text}
                    </span>
                  </span>
                  <Badge
                    variant={
                      a.state === "secondary" ? "secondary" : "destructive"
                    }
                    appearance="light"
                    size="sm"
                  >
                    {a.date}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex h-auto gap-2.5 py-3.5">
          <Button variant="outline" className="flex-1">
            Schedule
          </Button>
          <Button className="flex-1">Full Report</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
