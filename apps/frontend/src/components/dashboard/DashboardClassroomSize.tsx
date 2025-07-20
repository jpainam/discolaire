"use client";

/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useSuspenseQuery } from "@tanstack/react-query";
import { Warehouse } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";

import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function DashboardClassroomSize({ className }: { className?: string }) {
  const { t } = useLocale();
  // useEffect(() => {
  //   void captureException(new Error("DashboardClassroomSize").stack ?? "");
  // }, []);
  const trpc = useTRPC();
  const { data: classrooms } = useSuspenseQuery(
    trpc.classroom.all.queryOptions(),
  );
  const chartConfig = {
    maxSize: {
      label: t("max_size"),
      color: "var(--chart-5)",
    },
    size: {
      label: t("effective"),
      color: "var(--chart-3)",
    },
    difference: {
      label: t("difference"),
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const filteredData = classrooms.slice(0, 10).map((classroom) => {
    return {
      name: classroom.name,
      maxSize: classroom.maxSize || 0,
      size: classroom.size,
      difference: (classroom.maxSize || 0) - classroom.size,
    };
  });

  // const [filteredData, setFilteredData] = React.useState<
  //   { name: string; maxSize: number; size: number }[]
  // >([]);

  // useEffect(() => {

  //   setFilteredData(data ?? []);
  // }, [classroomsQuery.data]);

  // if (classroomsQuery.isPending) {
  //   return (
  //     <div className="col-span-full flex w-full flex-col">
  //       <div className="flex w-full flex-row gap-4 p-2">
  //         <Skeleton className="h-[200px] w-1/3" />
  //         <Skeleton className="h-[200px] w-2/3" />
  //       </div>
  //       <div className="flex w-full flex-row gap-4 p-2">
  //         <Skeleton className="h-[200px] w-1/3" />
  //         <Skeleton className="h-[200px] w-2/3" />
  //       </div>
  //     </div>
  //   );
  // }
  // if (classroomsQuery.isError) {
  //   showErrorToast(classroomsQuery.error);
  //   return;
  // }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          {t("classrooms")} - {t("size")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-60 w-full p-0" config={chartConfig}>
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="w-[200px]" indicator="dashed" />
              }
            />
            <Bar dataKey="maxSize" fill="var(--color-maxSize)" radius={4} />
            <Bar dataKey="size" fill="var(--color-size)" radius={4} />
            <Bar
              dataKey="difference"
              fill="var(--color-difference)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
