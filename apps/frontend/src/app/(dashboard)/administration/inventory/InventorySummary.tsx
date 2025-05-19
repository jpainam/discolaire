"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { InventoryMonthlyUsage } from "~/components/administration/inventory/InventoryMontlyUsage";

const statusData = [
  { name: "Available", value: 240, color: "#22c55e" },
  { name: "In Use", value: 45, color: "#3b82f6" },
  { name: "Low Stock", value: 15, color: "#eab308" },
  { name: "Needs Repair", value: 8, color: "#ef4444" },
];

const monthlyUsageData = [
  { name: "Jan", paper: 40, ink: 5, computers: 0, chairs: 2 },
  { name: "Feb", paper: 35, ink: 3, computers: 1, chairs: 0 },
  { name: "Mar", paper: 50, ink: 6, computers: 2, chairs: 3 },
  { name: "Apr", paper: 45, ink: 4, computers: 0, chairs: 1 },
  { name: "May", paper: 55, ink: 7, computers: 3, chairs: 2 },
  { name: "Jun", paper: 60, ink: 5, computers: 1, chairs: 0 },
];

export function InventorySummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 px-4">
      <InventoryMonthlyUsage className="col-span-full" />
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
      <Card className="lg:col-span-3">
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
                  { category: "paper", count: 165, fill: "var(--color-paper)" },
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
      </Card>
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Item Status Overview</CardTitle>
          <CardDescription>
            Current status of all inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Teacher Assignments</CardTitle>
          <CardDescription>Items assigned to teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Ms. Johnson</div>
                  <div className="text-sm text-muted-foreground">12 items</div>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: "28%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Mr. Smith</div>
                  <div className="text-sm text-muted-foreground">9 items</div>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: "21%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Ms. Davis</div>
                  <div className="text-sm text-muted-foreground">15 items</div>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Mr. Wilson</div>
                  <div className="text-sm text-muted-foreground">7 items</div>
                </div>
                <div className="mt-1 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: "16%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
