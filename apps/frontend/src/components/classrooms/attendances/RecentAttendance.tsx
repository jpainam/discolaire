"use client";

import { format } from "date-fns";
import {
  AlertCircle,
  Clock,
  Columns4,
  Eye,
  MailCheckIcon,
  MessageSquare,
  MoreVerticalIcon,
  Trash2,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";

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
  const { t } = useLocale();
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

            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("details")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Columns4 className="mr-2 h-4 w-4" />
                    {t("justify")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <MailCheckIcon className="mr-2 h-4 w-4" />
                    {t("notify")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  >
                    <Trash2 />
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
