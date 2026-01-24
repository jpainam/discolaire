import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const activities = [
  {
    id: 1,
    type: "grade",
    title: "Graded Algebra Quiz",
    description: "Completed grading for Period 2 Algebra quiz",
    time: "10 minutes ago",
    class: "Algebra II",
    color: "bg-chart-1",
  },
  {
    id: 2,
    type: "assignment",
    title: "New Assignment Posted",
    description: "Calculus homework on derivatives - Due Friday",
    time: "1 hour ago",
    class: "AP Calculus",
    color: "bg-chart-2",
  },
  {
    id: 3,
    type: "message",
    title: "Parent Message Received",
    description: "Mrs. Johnson asked about Emily's progress",
    time: "2 hours ago",
    class: "Geometry",
    color: "bg-chart-3",
  },
  {
    id: 4,
    type: "attendance",
    title: "Attendance Submitted",
    description: "Morning attendance for all periods recorded",
    time: "3 hours ago",
    class: "All Classes",
    color: "bg-chart-4",
  },
  {
    id: 5,
    type: "grade",
    title: "Report Cards Updated",
    description: "Mid-semester grades published for Period 4",
    time: "Yesterday",
    class: "Pre-Calculus",
    color: "bg-chart-1",
  },
  {
    id: 6,
    type: "meeting",
    title: "Department Meeting",
    description: "Discussed new curriculum standards",
    time: "Yesterday",
    class: "Math Dept.",
    color: "bg-chart-5",
  },
];

export function ActivityTimeline() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        <div className="relative">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index !== activities.length - 1 && (
                <div className="bg-border absolute top-10 left-[19px] h-[calc(100%-24px)] w-px" />
              )}
              <Avatar className={cn("h-10 w-10 shrink-0", activity.color)}>
                <AvatarFallback className="text-primary-foreground text-xs font-medium">
                  {activity.type.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm leading-tight font-medium">
                    {activity.title}
                  </p>
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {activity.description}
                </p>
                <Badge variant="secondary" className="text-xs font-normal">
                  {activity.class}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
