"use client";

import { FileText } from "lucide-react";
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

const data = [
  { subject: "ANG", max: 15, moy: 8.5 },
  { subject: "Mat", max: 5, moy: 3 },
  { subject: "Mat", max: 16, moy: 0 },
  { subject: "Mat", max: 15, moy: 5 },
  { subject: "Géo", max: 19, moy: 13.5 },
  { subject: "Géo", max: 20, moy: 14.5 },
  { subject: "ESF", max: 20, moy: 14.5 },
  { subject: "ANG", max: 20, moy: 11 },
];

export function NotesChart() {
  return (
    <div className="bg-card border-border flex h-full flex-col rounded-xl border p-4">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="text-muted-foreground h-4 w-4" />
        <h2 className="text-foreground text-sm font-semibold">
          Notes récentes
        </h2>
      </div>
      <div className="min-h-[220px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barGap={2}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 20]}
              ticks={[0, 5, 10, 15, 20]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend
              formatter={(value) => (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--color-muted-foreground)",
                  }}
                >
                  {value === "max" ? "Max" : "Moy."}
                </span>
              )}
              iconSize={10}
              iconType="circle"
            />
            <Bar
              dataKey="max"
              fill="var(--color-primary)"
              radius={[3, 3, 0, 0]}
              name="max"
            />
            <Bar
              dataKey="moy"
              fill="var(--color-warning)"
              radius={[3, 3, 0, 0]}
              name="moy"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
