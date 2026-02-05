"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, ClipboardCheck, TrendingUp, Users } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";
import { useTRPC } from "~/trpc/react";

export function StatsCards({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: allstats } = useSuspenseQuery(
    trpc.staff.stats.queryOptions(staffId),
  );
  const stats = useMemo(() => {
    return [
      {
        name: "Total Students",
        value: allstats.students,
        change: "+12 this semester",
        icon: Users,
        trend: "up",
      },
      {
        name: "Active Classes",
        value: allstats.classrooms,
        change: "Algebra, Geometry, Calculus",
        icon: BookOpen,
        trend: "neutral",
      },
      {
        name: "Assignments Graded",
        value: allstats.gradesheets,
        change: "12 pending review",
        icon: ClipboardCheck,
        trend: "up",
      },
      {
        name: "Avg. Class Performance",
        value: "82%",
        change: "+5% from last month",
        icon: TrendingUp,
        trend: "up",
      },
    ];
  }, [allstats]);
  return (
    <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="overflow-hidden">
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-sm font-medium">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold tracking-tight">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs">{stat.change}</p>
              </div>
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                <stat.icon className="text-primary h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
