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
// import { useLocale } from "~/i18n";
// const chartData = [
//   { month: "Jan", borrowed: 186, returned: 80 },
//   { month: "Fev", borrowed: 305, returned: 200 },
//   { month: "Mars", borrowed: 237, returned: 120 },
//   { month: "Avril", borrowed: 73, returned: 190 },
//   { month: "Mai", borrowed: 209, returned: 130 },
//   { month: "Juin", borrowed: 214, returned: 140 },
// ];

// export function MonthlyActivities({ className }: { className?: string }) {
//   const { t } = useLocale();
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

"use client";

import { useId } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import { ChartContainer, ChartTooltip } from "@repo/ui/components/chart";
import { cn } from "@repo/ui/lib/utils";
import { CustomTooltipContent } from "~/components/charts-extra";
import { useLocale } from "~/i18n";

const chartData = [
  { month: "Jan 2025", individual: 2000, team: 1000, enterprise: 1000 },
  { month: "Feb 2025", individual: 800, team: 4500, enterprise: 1700 },
  { month: "Mar 2025", individual: 400, team: 4600, enterprise: 1000 },
  { month: "Apr 2025", individual: 1800, team: 4700, enterprise: 2000 },
  { month: "May 2025", individual: 1800, team: 6000, enterprise: 4000 },
  { month: "Jun 2025", individual: 2500, team: 6000, enterprise: 1500 },
  { month: "Jul 2025", individual: 1000, team: 2500, enterprise: 1000 },
  { month: "Aug 2025", individual: 2000, team: 4000, enterprise: 2500 },
  { month: "Sep 2025", individual: 4500, team: 7000, enterprise: 3000 },
  { month: "Oct 2025", individual: 2500, team: 3000, enterprise: 3500 },
  { month: "Nov 2025", individual: 500, team: 1500, enterprise: 1000 },
  { month: "Dec 2025", individual: 2000, team: 3000, enterprise: 1500 },
];

const chartConfig = {
  individual: {
    label: "Individual",
    color: "var(--chart-4)",
  },
  team: {
    label: "Team",
    color: "var(--chart-1)",
  },
  enterprise: {
    label: "Enterprise",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function MonthlyActivities({ className }: { className?: string }) {
  const id = useId();

  const { t } = useLocale();
  // Get first and last month with type assertions
  const firstMonth = chartData[0]?.month ?? "Jan 2025";
  const lastMonth = chartData[chartData.length - 1]?.month ?? "Dec 2025";

  return (
    <Card className={cn("gap-4", className)}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>{t("monthly_activities")}</CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">12,296</div>
              <Badge className="mt-1.5 bg-emerald-500/24 text-emerald-500 border-none">
                +11.9%
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-xs bg-chart-4"
              ></div>
              <div className="text-[13px]/3 text-muted-foreground/50">
                Individual
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-xs bg-chart-1"
              ></div>
              <div className="text-[13px]/3 text-muted-foreground/50">Team</div>
            </div>
            <div className="flex items-center gap-2">
              <div
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-xs bg-chart-3"
              ></div>
              <div className="text-[13px]/3 text-muted-foreground/50">
                Enterprise
              </div>
            </div>
          </div>
        </div>
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
              stroke="var(--border)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value === 0 ? "0" : `${(value / 1000).toFixed(0)}K`
              }
            />
            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    individual: "var(--chart-4)",
                    team: "var(--chart-1)",
                    enterprise: "var(--chart-3)",
                  }}
                  labelMap={{
                    individual: "Individual",
                    team: "Team",
                    enterprise: "Enterprise",
                  }}
                  dataKeys={["individual", "team", "enterprise"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              }
            />
            <Bar dataKey="individual" fill="var(--chart-4)" stackId="a" />
            <Bar dataKey="team" fill={`url(#${id}-gradient)`} stackId="a" />
            <Bar dataKey="enterprise" fill="var(--chart-3)" stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
