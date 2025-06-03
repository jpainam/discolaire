"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GradeDistributionChartProps {
  bySubject?: boolean;
}

export function GradeDistributionChart({
  bySubject = false,
}: GradeDistributionChartProps) {
  const [data, setData] = useState<
    | { name: string; A: number; B: number; C: number; D: number; F: number }[]
    | { name: string; value: number; color: string }[]
  >([]);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    if (bySubject) {
      setData([
        { name: "Math", A: 15, B: 20, C: 12, D: 8, F: 3 },
        { name: "Science", A: 18, B: 22, C: 10, D: 5, F: 2 },
        { name: "English", A: 12, B: 25, C: 15, D: 6, F: 1 },
        { name: "History", A: 10, B: 18, C: 20, D: 7, F: 4 },
        { name: "Art", A: 22, B: 15, C: 8, D: 3, F: 1 },
      ]);
    } else {
      setData([
        { name: "A (90-100%)", value: 42, color: "#22c55e" },
        { name: "B (80-89%)", value: 68, color: "#84cc16" },
        { name: "C (70-79%)", value: 35, color: "#eab308" },
        { name: "D (60-69%)", value: 15, color: "#f97316" },
        { name: "F (0-59%)", value: 10, color: "#ef4444" },
      ]);
    }
  }, [bySubject]);

  if (bySubject) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="A" fill="#22c55e" stackId="stack" />
          <Bar dataKey="B" fill="#84cc16" stackId="stack" />
          <Bar dataKey="C" fill="#eab308" stackId="stack" />
          <Bar dataKey="D" fill="#f97316" stackId="stack" />
          <Bar dataKey="F" fill="#ef4444" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`${value} students`, "Count"]}
          labelFormatter={(name) => `Grade: ${name}`}
        />

        {/* <Bar dataKey="value" fill={(entry) => `${entry.color}`} /> */}
      </BarChart>
    </ResponsiveContainer>
  );
}
