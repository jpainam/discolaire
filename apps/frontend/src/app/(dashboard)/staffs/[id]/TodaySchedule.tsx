import { Clock, MapPin, Users } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

const schedule = [
  {
    id: 1,
    period: "Period 1",
    time: "8:00 - 8:50 AM",
    class: "Algebra II",
    room: "Room 204",
    students: 28,
    status: "completed",
  },
  {
    id: 2,
    period: "Period 2",
    time: "9:00 - 9:50 AM",
    class: "Geometry",
    room: "Room 204",
    students: 32,
    status: "completed",
  },
  {
    id: 3,
    period: "Period 3",
    time: "10:00 - 10:50 AM",
    class: "AP Calculus",
    room: "Room 210",
    students: 24,
    status: "current",
  },
  {
    id: 4,
    period: "Period 4",
    time: "11:00 - 11:50 AM",
    class: "Pre-Calculus",
    room: "Room 204",
    students: 30,
    status: "upcoming",
  },
  {
    id: 5,
    period: "Lunch",
    time: "12:00 - 12:45 PM",
    class: "Break",
    room: "—",
    students: 0,
    status: "upcoming",
  },
  {
    id: 6,
    period: "Period 5",
    time: "1:00 - 1:50 PM",
    class: "Algebra II",
    room: "Room 204",
    students: 26,
    status: "upcoming",
  },
];

export function TodaySchedule() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {"Today's Schedule"}
          </CardTitle>
          <Badge variant="outline" className="text-xs font-normal">
            Thursday, Jan 23
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center gap-4 rounded-lg p-3 transition-colors",
              item.status === "current"
                ? "bg-primary/10 ring-primary/20 ring-1"
                : item.status === "completed"
                  ? "opacity-60"
                  : "hover:bg-muted/50",
            )}
          >
            <div className="w-20 shrink-0">
              <p className="text-muted-foreground text-xs font-medium">
                {item.period}
              </p>
              <p className="text-muted-foreground text-xs">
                {item.time.split(" - ")[0]}
              </p>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.class}</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin className="h-3 w-3" />
                  {item.room}
                </span>
                {item.students > 0 && (
                  <span className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Users className="h-3 w-3" />
                    {item.students}
                  </span>
                )}
              </div>
            </div>
            {item.status === "current" && (
              <Badge className="bg-accent text-accent-foreground">
                <Clock className="mr-1 h-3 w-3" />
                Now
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
