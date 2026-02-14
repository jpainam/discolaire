"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
} from "~/components/ui/card";
import { useTRPC } from "~/trpc/react";
import { InventoryPieChart } from "./InventoryPieChart";

export function InventorySummary2() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.inventoryUsage.monthlySummary.queryOptions(),
  );

  return (
    <>
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Stock Movement</CardTitle>
          <CardDescription>
            Monthly stock entries and withdrawals over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="stockIn" fill="var(--chart-1)" name="Stock in" />
              <Bar dataKey="stockOut" fill="var(--chart-3)" name="Stock out" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <InventoryPieChart />
    </>
  );
}
