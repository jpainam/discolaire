/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StudentPerformanceChartProps {
  extended?: boolean;
}

export function StudentPerformanceChart2({
  extended = false,
}: StudentPerformanceChartProps) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    if (extended) {
      setData([
        { month: "Jan", "Class Average": 78, "Top 10%": 92, "Bottom 10%": 62 },
        { month: "Feb", "Class Average": 80, "Top 10%": 94, "Bottom 10%": 64 },
        { month: "Mar", "Class Average": 79, "Top 10%": 93, "Bottom 10%": 63 },
        { month: "Apr", "Class Average": 82, "Top 10%": 95, "Bottom 10%": 66 },
        { month: "May", "Class Average": 83, "Top 10%": 96, "Bottom 10%": 68 },
        { month: "Jun", "Class Average": 85, "Top 10%": 97, "Bottom 10%": 70 },
        { month: "Jul", "Class Average": 84, "Top 10%": 96, "Bottom 10%": 69 },
        { month: "Aug", "Class Average": 86, "Top 10%": 98, "Bottom 10%": 71 },
        { month: "Sep", "Class Average": 85, "Top 10%": 97, "Bottom 10%": 70 },
      ]);
    } else {
      setData([
        { month: "Apr", "Class Average": 82, "Top 10%": 95, "Bottom 10%": 66 },
        { month: "May", "Class Average": 83, "Top 10%": 96, "Bottom 10%": 68 },
        { month: "Jun", "Class Average": 85, "Top 10%": 97, "Bottom 10%": 70 },
        { month: "Jul", "Class Average": 84, "Top 10%": 96, "Bottom 10%": 69 },
        { month: "Aug", "Class Average": 86, "Top 10%": 98, "Bottom 10%": 71 },
        { month: "Sep", "Class Average": 85, "Top 10%": 97, "Bottom 10%": 70 },
      ]);
    }
  }, [extended]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis domain={[60, 100]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="Class Average"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Top 10%"
          stroke="#22c55e"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="Bottom 10%"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
