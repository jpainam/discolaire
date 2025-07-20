"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

import { InventoryPieChart } from "./InventoryPieChart";

const monthlyUsageData = [
  { name: "Jan", paper: 40, ink: 5, computers: 0, chairs: 2 },
  { name: "Feb", paper: 35, ink: 3, computers: 1, chairs: 0 },
  { name: "Mar", paper: 50, ink: 6, computers: 2, chairs: 3 },
  { name: "Apr", paper: 45, ink: 4, computers: 0, chairs: 1 },
  { name: "May", paper: 55, ink: 7, computers: 3, chairs: 2 },
  { name: "Jun", paper: 60, ink: 5, computers: 1, chairs: 0 },
];
export function InventorySummary2() {
  return (
    <>
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            Consumption of inventory items over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyUsageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="paper" fill="#94a3b8" name="Paper" />
              <Bar dataKey="ink" fill="#38bdf8" name="Ink" />
              <Bar dataKey="computers" fill="#a78bfa" name="Computers" />
              <Bar dataKey="chairs" fill="#fb923c" name="Chairs" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {/* <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Inventory by Category</CardTitle>
          <CardDescription>
            Distribution of items across categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              paper: {
                label: "Paper",
                color: "hsl(var(--chart-1))",
              },
              ink: {
                label: "Ink",
                color: "hsl(var(--chart-2))",
              },
              computers: {
                label: "Computers",
                color: "hsl(var(--chart-3))",
              },
              chairs: {
                label: "Chairs",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="aspect-square h-[300px]"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Pie
                data={[
                  {
                    category: "paper",
                    count: 165,
                    fill: "var(--color-paper)",
                  },
                  { category: "ink", count: 23, fill: "var(--color-ink)" },
                  {
                    category: "computers",
                    count: 78,
                    fill: "var(--color-computers)",
                  },
                  {
                    category: "chairs",
                    count: 42,
                    fill: "var(--color-chairs)",
                  },
                ]}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card> */}
      <InventoryPieChart />
    </>
  );
}
