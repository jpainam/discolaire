"use client";

import { format } from "date-fns";
import { AlertCircle, Clock, MessageSquare } from "lucide-react";

import { Badge } from "@repo/ui/badge";

import { AvatarState } from "~/components/AvatarState";
import { cn } from "~/lib/utils";

interface AttendanceIssue {
  id: string;
  type: "absence" | "lateness" | "chatter";
  studentName: string;
  date: Date;
  details: string;
  avatar: string;
}

const attendanceIssues: AttendanceIssue[] = [
  {
    id: "1",
    type: "absence",
    studentName: "Alice Johnson",
    date: new Date(2023, 9, 15),
    details: "Absent due to illness",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "2",
    type: "lateness",
    studentName: "Bob Smith",
    date: new Date(2023, 9, 16),
    details: "15 minutes late",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "3",
    type: "chatter",
    studentName: "Charlie Brown",
    date: new Date(2023, 9, 17),
    details: "Excessive talking during class",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "4",
    type: "absence",
    studentName: "Diana Prince",
    date: new Date(2023, 9, 18),
    details: "Absent without notice",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "5",
    type: "lateness",
    studentName: "Ethan Hunt",
    date: new Date(2023, 9, 19),
    details: "10 minutes late",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export function RecentAttendance({ className }: { className?: string }) {
  return (
    <div className={cn("py-2", className)}>
      <div className="space-y-4">
        {attendanceIssues.map((issue) => (
          <div key={issue.id} className="flex items-start space-x-4 border-b">
            <AvatarState />

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm leading-none">{issue.studentName}</p>
                <Badge
                  variant={
                    issue.type === "absence"
                      ? "destructive"
                      : issue.type === "lateness"
                        ? "secondary"
                        : "default"
                  }
                >
                  {issue.type === "absence" && (
                    <AlertCircle className="mr-1 h-3 w-3" />
                  )}
                  {issue.type === "lateness" && (
                    <Clock className="mr-1 h-3 w-3" />
                  )}
                  {issue.type === "chatter" && (
                    <MessageSquare className="mr-1 h-3 w-3" />
                  )}
                  {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{issue.details}</p>
              <p className="text-xs text-muted-foreground">
                {format(issue.date, "PPP")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
