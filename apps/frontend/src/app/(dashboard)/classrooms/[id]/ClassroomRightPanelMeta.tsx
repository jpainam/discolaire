"use client";

import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Download, MessageSquare } from "lucide-react";

import { EmptyComponent } from "~/components/EmptyComponent";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function ClassroomRightPanelMeta({
  classroomId,
}: {
  classroomId: string;
}) {
  const trpc = useTRPC();
  const { data: classroom, isPending } = useQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, t) => (
          <Skeleton className="h-20" key={t} />
        ))}
      </div>
    );
  }
 
  const cl = {
    name: "Grade 10-A",
    code: "CLS-2024-10A",
    academicYear: "2023-2024",
    level: "Grade 10",
    teacher: "Ms. Sarah Johnson",
    schedule: "Mon-Fri, 8:00 AM - 3:00 PM",
    enrolled: 28,
    capacity: 35,
    maleStudents: 15,
    femaleStudents: 13,
    newStudents: 3,
    returningStudents: 25,
    classAverage: 87.5,
    topPerformers: 8,
    averagePerformers: 17,
    atRisk: 3,
    passRate: 92,
    subjects: "Math, Science, English, History",
    attendanceRate7Days: 94,
    attendanceRate30Days: 91,
    absenceTrend: "improving",
    lateArrivals: 12,
    fullyPaid: 85,
    outstandingBalance: 4200,
    lastAttendance: "2 hours ago",
    lastGrade: "1 day ago",
    lastAnnouncement: "3 days ago",
  };

  if (!classroom) {
    return <EmptyComponent />;
  }

  return (
    <div>
      <Accordion
        type="multiple"
        defaultValue={[
          "identity",
          "population",
          "academic",
          "attendance",
          "financial",
          "activity",
          "actions",
        ]}
        className="w-full rounded-none border-none"
      >
        {/* Identity & Context */}
        <AccordionItem value="identity">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Identity & Context
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField label="cl Name" value={classroom.name} />
              <MetaField label="Code" value={classroom.reportName} />
              <MetaField label="Academic Year" value={cl.academicYear} />
              <MetaField label="Level" value={cl.level} />
              <MetaField label="Homeroom Teacher" value={cl.teacher} />
              <MetaField label="Schedule" value={cl.schedule} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Population & Capacity */}
        <AccordionItem value="population">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Population & Capacity
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField label="Total Enrolled" value={cl.enrolled} />
              <MetaField
                label="Capacity"
                value={`${cl.enrolled} / ${cl.capacity}`}
              />
              <MetaField
                label="Gender Distribution"
                value={`${cl.maleStudents}M / ${cl.femaleStudents}F`}
              />
              <MetaField label="New Students" value={cl.newStudents} />
              <MetaField
                label="Returning Students"
                value={cl.returningStudents}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Academic Health */}
        <AccordionItem value="academic">
          <AccordionTrigger className="text-muted-foreground text-sm font-semibold tracking-wide uppercase hover:no-underline">
            Academic Health
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Class Average"
                value={`${cl.classAverage}%`}
                badge={{ variant: "success", text: "Good" }}
              />
              <MetaField label="Top Performers" value={cl.topPerformers} />
              <MetaField
                label="Average Performers"
                value={cl.averagePerformers}
              />
              <MetaField
                label="At Risk"
                value={cl.atRisk}
                badge={{ variant: "warning", text: "Alert" }}
              />
              <MetaField label="Pass Rate" value={`${cl.passRate}%`} />
              <MetaField label="Subjects Taught" value={cl.subjects} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Attendance Overview */}
        <AccordionItem value="attendance">
          <AccordionTrigger className="text-muted-foreground text-sm font-semibold tracking-wide uppercase hover:no-underline">
            Attendance Overview
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Last 7 Days"
                value={`${cl.attendanceRate7Days}%`}
                badge={{ variant: "success", text: "Good" }}
              />
              <MetaField
                label="Last 30 Days"
                value={`${cl.attendanceRate30Days}%`}
              />
              <MetaField
                label="Trend"
                value="Improving"
                badge={{ variant: "success", text: "↑" }}
              />
              <MetaField label="Late Arrivals" value={cl.lateArrivals} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Financial Snapshot */}
        <AccordionItem value="financial">
          <AccordionTrigger className="text-muted-foreground text-sm font-semibold tracking-wide uppercase hover:no-underline">
            Financial Snapshot
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Fully Paid"
                value={`${cl.fullyPaid}%`}
                badge={{ variant: "success", text: "Good" }}
              />
              <MetaField
                label="Outstanding Balance"
                value={`$${cl.outstandingBalance.toLocaleString()}`}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recent Activity */}
        <AccordionItem value="activity">
          <AccordionTrigger className="text-muted-foreground text-sm font-semibold tracking-wide uppercase hover:no-underline">
            Recent Activity
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-foreground font-medium">
                    Last attendance taken
                  </p>
                  <p className="text-muted-foreground">{cl.lastAttendance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-foreground font-medium">
                    Last grade published
                  </p>
                  <p className="text-muted-foreground">{cl.lastGrade}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-foreground font-medium">
                    Last announcement sent
                  </p>
                  <p className="text-muted-foreground">{cl.lastAnnouncement}</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Quick Actions */}
        <AccordionItem value="actions">
          <AccordionTrigger className="text-muted-foreground text-sm font-semibold tracking-wide uppercase hover:no-underline">
            Quick Actions
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 pt-2">
              <Button
                variant="default"
                className="w-full justify-start"
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Take Attendance
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Class Message
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Class List
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Timetable
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

interface MetaFieldProps {
  label: string;
  value: string | number;
  badge?: {
    variant: "success" | "warning" | "danger" | "neutral";
    text: string;
  };
}

export function MetaField({ label, value, badge }: MetaFieldProps) {
  const badgeColors = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    neutral: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-xs/relaxed leading-none">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span className="text-foreground text-xs/relaxed leading-none font-medium">
          {value}
        </span>
        {badge && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              badgeColors[badge.variant],
            )}
          >
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
