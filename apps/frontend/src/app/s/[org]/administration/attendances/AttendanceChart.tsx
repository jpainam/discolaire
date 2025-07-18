"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { useIsMobile } from "~/hooks/use-mobile";
import { useLocale } from "~/i18n";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", absence: 222, justified: 150 },
  { date: "2024-04-02", absence: 97, justified: 180 },
  { date: "2024-04-03", absence: 167, justified: 120 },
  { date: "2024-04-04", absence: 242, justified: 260 },
  { date: "2024-04-05", absence: 373, justified: 290 },
  { date: "2024-04-06", absence: 301, justified: 340 },
  { date: "2024-04-07", absence: 245, justified: 180 },
  { date: "2024-04-08", absence: 409, justified: 320 },
  { date: "2024-04-09", absence: 59, justified: 110 },
  { date: "2024-04-10", absence: 261, justified: 190 },
  { date: "2024-04-11", absence: 327, justified: 350 },
  { date: "2024-04-12", absence: 292, justified: 210 },
  { date: "2024-04-13", absence: 342, justified: 380 },
  { date: "2024-04-14", absence: 137, justified: 220 },
  { date: "2024-04-15", absence: 120, justified: 170 },
  { date: "2024-04-16", absence: 138, justified: 190 },
  { date: "2024-04-17", absence: 446, justified: 360 },
  { date: "2024-04-18", absence: 364, justified: 410 },
  { date: "2024-04-19", absence: 243, justified: 180 },
  { date: "2024-04-20", absence: 89, justified: 150 },
  { date: "2024-04-21", absence: 137, justified: 200 },
  { date: "2024-04-22", absence: 224, justified: 170 },
  { date: "2024-04-23", absence: 138, justified: 230 },
  { date: "2024-04-24", absence: 387, justified: 290 },
  { date: "2024-04-25", absence: 215, justified: 250 },
  { date: "2024-04-26", absence: 75, justified: 130 },
  { date: "2024-04-27", absence: 383, justified: 420 },
  { date: "2024-04-28", absence: 122, justified: 180 },
  { date: "2024-04-29", absence: 315, justified: 240 },
  { date: "2024-04-30", absence: 454, justified: 380 },
  { date: "2024-05-01", absence: 165, justified: 220 },
  { date: "2024-05-02", absence: 293, justified: 310 },
  { date: "2024-05-03", absence: 247, justified: 190 },
  { date: "2024-05-04", absence: 385, justified: 420 },
  { date: "2024-05-05", absence: 481, justified: 390 },
  { date: "2024-05-06", absence: 498, justified: 520 },
  { date: "2024-05-07", absence: 388, justified: 300 },
  { date: "2024-05-08", absence: 149, justified: 210 },
  { date: "2024-05-09", absence: 227, justified: 180 },
  { date: "2024-05-10", absence: 293, justified: 330 },
  { date: "2024-05-11", absence: 335, justified: 270 },
  { date: "2024-05-12", absence: 197, justified: 240 },
  { date: "2024-05-13", absence: 197, justified: 160 },
  { date: "2024-05-14", absence: 448, justified: 490 },
  { date: "2024-05-15", absence: 473, justified: 380 },
  { date: "2024-05-16", absence: 338, justified: 400 },
  { date: "2024-05-17", absence: 499, justified: 420 },
  { date: "2024-05-18", absence: 315, justified: 350 },
  { date: "2024-05-19", absence: 235, justified: 180 },
  { date: "2024-05-20", absence: 177, justified: 230 },
  { date: "2024-05-21", absence: 82, justified: 140 },
  { date: "2024-05-22", absence: 81, justified: 120 },
  { date: "2024-05-23", absence: 252, justified: 290 },
  { date: "2024-05-24", absence: 294, justified: 220 },
  { date: "2024-05-25", absence: 201, justified: 250 },
  { date: "2024-05-26", absence: 213, justified: 170 },
  { date: "2024-05-27", absence: 420, justified: 460 },
  { date: "2024-05-28", absence: 233, justified: 190 },
  { date: "2024-05-29", absence: 78, justified: 130 },
  { date: "2024-05-30", absence: 340, justified: 280 },
  { date: "2024-05-31", absence: 178, justified: 230 },
  { date: "2024-06-01", absence: 178, justified: 200 },
  { date: "2024-06-02", absence: 470, justified: 410 },
  { date: "2024-06-03", absence: 103, justified: 160 },
  { date: "2024-06-04", absence: 439, justified: 380 },
  { date: "2024-06-05", absence: 88, justified: 140 },
  { date: "2024-06-06", absence: 294, justified: 250 },
  { date: "2024-06-07", absence: 323, justified: 370 },
  { date: "2024-06-08", absence: 385, justified: 320 },
  { date: "2024-06-09", absence: 438, justified: 480 },
  { date: "2024-06-10", absence: 155, justified: 200 },
  { date: "2024-06-11", absence: 92, justified: 150 },
  { date: "2024-06-12", absence: 492, justified: 420 },
  { date: "2024-06-13", absence: 81, justified: 130 },
  { date: "2024-06-14", absence: 426, justified: 380 },
  { date: "2024-06-15", absence: 307, justified: 350 },
  { date: "2024-06-16", absence: 371, justified: 310 },
  { date: "2024-06-17", absence: 475, justified: 520 },
  { date: "2024-06-18", absence: 107, justified: 170 },
  { date: "2024-06-19", absence: 341, justified: 290 },
  { date: "2024-06-20", absence: 408, justified: 450 },
  { date: "2024-06-21", absence: 169, justified: 210 },
  { date: "2024-06-22", absence: 317, justified: 270 },
  { date: "2024-06-23", absence: 480, justified: 530 },
  { date: "2024-06-24", absence: 132, justified: 180 },
  { date: "2024-06-25", absence: 141, justified: 190 },
  { date: "2024-06-26", absence: 434, justified: 380 },
  { date: "2024-06-27", absence: 448, justified: 490 },
  { date: "2024-06-28", absence: 149, justified: 200 },
  { date: "2024-06-29", absence: 103, justified: 160 },
  { date: "2024-06-30", absence: 446, justified: 400 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  absence: {
    label: "Absences",
    color: "var(--chart-2)",
  },
  justified: {
    label: "Justi.",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AttendanceChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const { t } = useLocale();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{t("all_my_attendances")}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total des presences/justification pour les trois derniers mois
          </span>
          <span className="@[540px]/card:hidden">3 derniers mois</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            // className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            className=" *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">3 derniers mois</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 derniers jours</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 derniers jours</ToggleGroupItem>
          </ToggleGroup>
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select> */}
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillabsence" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-absence)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-absence)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-justified)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-justified)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="justified"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-justified)"
              stackId="a"
            />
            <Area
              dataKey="absence"
              type="natural"
              fill="url(#fillabsence)"
              stroke="var(--color-absence)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
