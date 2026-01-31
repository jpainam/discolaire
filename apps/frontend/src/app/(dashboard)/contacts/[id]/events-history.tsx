"use client";

import {
  BookOpen,
  Calendar,
  CheckCircle,
  GraduationCap,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

import type { Event } from "./parent-data";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";

interface EventsHistoryProps {
  events: Event[];
}

const typeConfig = {
  meeting: { icon: Users, label: "Meeting", color: "text-primary" },
  event: { icon: Trophy, label: "Event", color: "text-accent" },
  conference: {
    icon: GraduationCap,
    label: "Conference",
    color: "text-chart-3",
  },
  workshop: { icon: BookOpen, label: "Workshop", color: "text-chart-4" },
};

export function EventsHistory({ events }: EventsHistoryProps) {
  const attendedCount = events.filter((e) => e.attended).length;
  const attendanceRate = Math.round((attendedCount / events.length) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="text-primary h-5 w-5" />
            Event Participation
          </CardTitle>
          <Badge variant="secondary">
            {attendedCount}/{events.length} attended
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Attendance Rate */}
        <div className="bg-secondary/50 mb-4 rounded-lg p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-foreground text-sm font-medium">
              Attendance Rate
            </span>
            <span className="text-primary text-sm font-bold">
              {attendanceRate}%
            </span>
          </div>
          <Progress value={attendanceRate} className="h-2" />
        </div>

        {/* Events List */}
        <div className="space-y-2">
          {events.map((event) => {
            const config = typeConfig[event.type];
            const TypeIcon = config.icon;

            return (
              <div
                key={event.id}
                className="border-border hover:bg-secondary/30 flex items-center gap-3 rounded-lg border p-3 transition-colors"
              >
                <div className={`bg-secondary rounded-lg p-2 ${config.color}`}>
                  <TypeIcon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-medium">
                    {event.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {config.label}
                  </Badge>
                  {event.attended ? (
                    <CheckCircle className="text-success h-5 w-5" />
                  ) : (
                    <XCircle className="text-muted-foreground h-5 w-5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
