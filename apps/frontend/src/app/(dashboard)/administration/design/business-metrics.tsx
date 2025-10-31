import { ArrowRight, DollarSign, TrendingUp, Users } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";

const metrics = [
  {
    id: 1,
    title: "Revenue Growth",
    subtitle: "Monthly revenue target",
    icon: TrendingUp,
    status: "On Track",
    progress: 75,
    target: 100000,
    current: 75000,
    unit: "$",
  },
  {
    id: 2,
    title: "Customer Acquisition",
    subtitle: "New customers this quarter",
    icon: Users,
    status: "Behind",
    progress: 60,
    target: 1000,
    current: 600,
    unit: "",
  },
  {
    id: 3,
    title: "Average Order Value",
    subtitle: "Target AOV for Q3",
    icon: DollarSign,
    status: "Ahead",
    progress: 110,
    target: 150,
    current: 165,
    unit: "$",
  },
];

const statusColors = {
  "On Track":
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Behind: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Ahead: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export function BusinessMetrics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Business Metrics</h2>
        <Button variant="outline" size="sm">
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">{metric.subtitle}</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span
                    // @ts-expect-error  fix it
                    className={`rounded-full px-2 py-1 ${statusColors[metric.status]}`}
                  >
                    {metric.status}
                  </span>
                  <span className="text-muted-foreground">
                    {metric.current} / {metric.target} {metric.unit}
                  </span>
                </div>
                <div className="bg-secondary h-1.5 w-full rounded-full">
                  <div
                    className="bg-primary h-1.5 rounded-full"
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {metric.unit}
                    {metric.target.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    {metric.progress}% complete
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
