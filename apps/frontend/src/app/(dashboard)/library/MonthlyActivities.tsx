"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ChartContainer, ChartTooltip } from "@repo/ui/components/chart";
import { cn } from "@repo/ui/lib/utils";

import { CustomTooltipContent } from "~/components/charts-extra";

// "use client";
// import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@repo/ui/components/card";
// import type { ChartConfig } from "@repo/ui/components/chart";
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@repo/ui/components/chart";
// import { cn } from "@repo/ui/lib/utils";
// import { CalendarDays } from "lucide-react";
// import { useTranslations } from "next-intl";
// const chartData = [
//   { month: "Jan", borrowed: 186, returned: 80 },
//   { month: "Fev", borrowed: 305, returned: 200 },
//   { month: "Mars", borrowed: 237, returned: 120 },
//   { month: "Avril", borrowed: 73, returned: 190 },
//   { month: "Mai", borrowed: 209, returned: 130 },
//   { month: "Juin", borrowed: 214, returned: 140 },
// ];

// export function MonthlyActivities({ className }: { className?: string }) {
//
//   const chartConfig = {
//     borrowed: {
//       label: t("borrowed"),
//       color: "var(--chart-1)",
//     },
//     returned: {
//       label: t("returned"),
//       color: "var(--chart-2)",
//     },
//   } satisfies ChartConfig;
//   return (
//     <Card className={cn("p-0 gap-0", className)}>
//       <CardHeader className="bg-muted/50 p-4 border-b">
//         <CardTitle className="flex flex-row items-center gap-2">
//           <CalendarDays />
//           {t("monthly_activities")}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-0">
//         <ChartContainer config={chartConfig}>
//           <BarChart accessibilityLayer data={chartData}>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="month"
//               tickLine={false}
//               tickMargin={10}
//               axisLine={false}
//               // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
//               tickFormatter={(value) => value.slice(0, 3)}
//             />
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent indicator="dashed" />}
//             />
//             <Bar dataKey="borrowed" fill="var(--color-borrowed)" radius={4} />
//             <Bar dataKey="returned" fill="var(--color-returned)" radius={4} />
//           </BarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

const chartData = [
  { month: "Jan 2025", borrowed: 20, returned: 10, overdue: 10 },
  { month: "Feb 2025", borrowed: 8, returned: 45, overdue: 17 },
  { month: "Mar 2025", borrowed: 4, returned: 46, overdue: 10 },
  { month: "Apr 2025", borrowed: 18, returned: 47, overdue: 20 },
  { month: "May 2025", borrowed: 18, returned: 60, overdue: 40 },
  { month: "Jun 2025", borrowed: 25, returned: 60, overdue: 15 },
  { month: "Jul 2025", borrowed: 10, returned: 25, overdue: 10 },
  { month: "Aug 2025", borrowed: 20, returned: 40, overdue: 25 },
  { month: "Sep 2025", borrowed: 45, returned: 70, overdue: 30 },
  { month: "Oct 2025", borrowed: 25, returned: 30, overdue: 35 },
  { month: "Nov 2025", borrowed: 5, returned: 15, overdue: 10 },
  { month: "Dec 2025", borrowed: 20, returned: 30, overdue: 15 },
];

const chartConfig = {
  borrowed: {
    label: "Borrowed",
    color: "var(--chart-4)",
  },
  returned: {
    label: "Returned",
    color: "var(--chart-1)",
  },
  overdue: {
    label: "Enterprise",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MonthlyActivities({ className }: { className?: string }) {
  const id = useId();

  const t = useTranslations();
  // Get first and last month with type assertions
  const firstMonth = chartData[0]?.month ?? "Jan 2025";
  const lastMonth = chartData[chartData.length - 1]?.month ?? "Dec 2025";
  const total = chartData.reduce(
    (acc, { borrowed, returned, overdue }) =>
      acc + borrowed + returned + overdue,
    0,
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("monthly_activities")}</CardTitle>
        <CardDescription className="flex items-start gap-2">
          <Badge className="border-none bg-emerald-500/24 text-emerald-500">
            {total.toLocaleString()} emprunts
          </Badge>
        </CardDescription>
        <CardAction className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="bg-chart-4 size-1.5 shrink-0 rounded-xs"
            ></div>
            <div className="text-muted-foreground/50 text-[13px]/3">
              {t("borrowed")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="bg-chart-1 size-1.5 shrink-0 rounded-xs"
            ></div>
            <div className="text-muted-foreground/50 text-[13px]/3">
              {t("returned")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="bg-chart-3 size-1.5 shrink-0 rounded-xs"
            ></div>
            <div className="text-muted-foreground/50 text-[13px]/3">
              {t("overdue")}
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--chart-1)]/15"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            maxBarSize={20}
            margin={{ left: -12, right: 12, top: 12 }}
          >
            <defs>
              <linearGradient id={`${id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" />
                <stop offset="100%" stopColor="var(--chart-2)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={12}
              ticks={[firstMonth, lastMonth]}
              //stroke="var(--border)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) =>
                value === 0 ? "0" : `${value.toFixed(0)}`
              }
            />
            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    borrowed: "var(--chart-4)",
                    returned: "var(--chart-1)",
                    overdue: "var(--chart-3)",
                  }}
                  labelMap={{
                    borrowed: t("borrowed"),
                    returned: t("returned"),
                    overdue: t("overdue"),
                  }}
                  dataKeys={["borrowed", "returned", "overdue"]}
                  valueFormatter={(value) => `${value.toLocaleString()}`}
                />
              }
            />
            <Bar dataKey="borrowed" fill="var(--chart-4)" stackId="a" />
            <Bar dataKey="returned" fill={`url(#${id}-gradient)`} stackId="a" />
            <Bar dataKey="overdue" fill="var(--chart-3)" stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
