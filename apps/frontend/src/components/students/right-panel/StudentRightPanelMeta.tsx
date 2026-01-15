"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock, Clock2Icon, Clock3Icon, Edit, FileText, MessageSquare, PlusCircle } from "lucide-react";



import { EmptyComponent } from "~/components/EmptyComponent";
import FlatBadge from "~/components/FlatBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { StudentPerformanceTrend } from "./StudentPerformanceTrend";


export function StudentRightPanelMeta({ studentId }: { studentId: string }) {
  const trpc = useTRPC();
  const { data: student, isPending } = useQuery(
    trpc.student.get.queryOptions(studentId),
  );
  const stud = {
    name: "Emma Thompson",
    registrationNumber: "STU-2024-0145",
    classroom: "Grade 10-A",
    level: "Grade 10",
    status: "Active",
    currentAverage: 92,
    globalRank: 12,
    classroomRank: 3,
    strongestSubject: "Mathematics (98%)",
    weakestSubject: "Physical Education (85%)",
    riskFlag: false,
    attendanceRate: 96,
    justifiedAbsences: 2,
    unjustifiedAbsences: 0,
    latenessCount: 3,
    disciplinaryRecords: 0,
    feesStatus: "Paid",
    outstandingBalance: 0,
    lastPaymentDate: "Jan 5, 2024",
    primaryParent: "Robert Thompson",
    secondaryParent: "Jennifer Thompson",
    notificationPreference: "Email + SMS",
    documentsUploaded: 8,
    missingDocuments: 0,
    lastGradeUpdate: "2 days ago",
    lastAttendance: "Today, 8:00 AM",
    lastParentMessage: "5 days ago",
  };
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, t) => (
          <Skeleton className="h-20" key={t} />
        ))}
      </div>
    );
  }
  if (!student) {
    return <EmptyComponent />;
  }
  return (
    <div>
      <Accordion
        type="multiple"
        defaultValue={[
          "identity",
          "academic",
          "attendance",
          "financial",
          "parents",
          "documents",
          "timeline",
          "actions",
          "trend"
        ]}
        className="w-full rounded-none border-none"
      >
        {/* Identity */}
        <AccordionItem value="identity">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Identity
          </AccordionTrigger>
          <AccordionContent>
            <Test1 />
            <div className="space-y-3 pt-2">
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                    ET
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-foreground font-semibold">Name</h3>
                  <p className="text-muted-foreground text-sm">
                    {student.registrationNumber}
                  </p>
                </div>
              </div>
              <MetaField
                label="Classroom"
                value={student.classroom?.name ?? ""}
              />
              <MetaField
                label="Level"
                value={student.classroom?.reportName ?? ""}
              />
              <MetaField
                label="Status"
                value={stud.status}
                badge={{ variant: "success", text: "Active" }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="trend">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Academic Summary
          </AccordionTrigger>
          <AccordionContent>
            <StudentPerformanceTrend />
          </AccordionContent>
        </AccordionItem>

        {/* Academic Summary */}
        <AccordionItem value="academic">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Academic Summary
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Current Average"
                value={`${stud.currentAverage}%`}
                badge={{ variant: "success", text: "Excellent" }}
              />
              <MetaField label="Global Rank" value={`#${stud.globalRank}`} />
              <MetaField
                label="Classroom Rank"
                value={`#${stud.classroomRank}`}
              />
              <MetaField
                label="Strongest Subject"
                value={stud.strongestSubject}
              />
              <MetaField label="Weakest Subject" value={stud.weakestSubject} />
              {stud.riskFlag && (
                <MetaField
                  label="Risk Status"
                  value="At Risk"
                  badge={{ variant: "danger", text: "Alert" }}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Attendance & Behavior */}
        <AccordionItem value="attendance">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Attendance & Behavior
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Attendance Rate"
                value={`${stud.attendanceRate}%`}
                badge={{ variant: "success", text: "Good" }}
              />
              <MetaField
                label="Justified Absences"
                value={stud.justifiedAbsences}
              />
              <MetaField
                label="Unjustified Absences"
                value={stud.justifiedAbsences}
              />
              <MetaField label="Lateness Count" value={stud.latenessCount} />
              <MetaField
                label="Disciplinary Records"
                value={stud.disciplinaryRecords}
                badge={{ variant: "success", text: "None" }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Financial Status */}
        <AccordionItem value="financial">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Financial Status
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Fees Status"
                value={stud.feesStatus}
                badge={{ variant: "success", text: "Paid" }}
              />
              <MetaField
                label="Outstanding Balance"
                value={`$${stud.outstandingBalance}`}
              />
              <MetaField label="Last Payment" value={stud.lastPaymentDate} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Parents / Guardians */}
        <AccordionItem value="parents">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Parents / Guardians
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField label="Primary Contact" value={stud.primaryParent} />
              <MetaField
                label="Secondary Contact"
                value={stud.secondaryParent}
              />
              <MetaField
                label="Notification Preference"
                value={stud.notificationPreference}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Documents */}
        <AccordionItem value="documents">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Documents
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <MetaField
                label="Uploaded Documents"
                value={stud.documentsUploaded}
              />
              {stud.missingDocuments > 0 ? (
                <MetaField
                  label="Missing Documents"
                  value={stud.missingDocuments}
                  badge={{ variant: "warning", text: "Action Needed" }}
                />
              ) : (
                <MetaField
                  label="Document Status"
                  value="Complete"
                  badge={{ variant: "success", text: "✓" }}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Recent Timeline */}
        <AccordionItem value="timeline">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Recent Timeline
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-foreground font-medium">
                    Last grade update
                  </p>
                  <p className="text-muted-foreground">
                    {stud.lastGradeUpdate}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-foreground font-medium">
                    Last attendance event
                  </p>
                  <p className="text-muted-foreground">{stud.lastAttendance}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="text-muted-foreground mt-0.5 h-4 w-4" />
                <div>
                  <p className="text-foreground font-medium">
                    Last message to parent
                  </p>
                  <p className="text-muted-foreground">
                    {stud.lastParentMessage}
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Quick Actions */}
        <AccordionItem value="actions">
          <AccordionTrigger className="text-muted-foreground tracking-wide uppercase hover:no-underline">
            Quick Actions
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-2 pt-2">
              <Button
                variant="default"
                className="w-full justify-start"
                size="sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Grade
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Observation
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message Parents
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                size="sm"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
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
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <Label className="text-foreground font-medium">{value}</Label>
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

function Test1() {
  return (
    <div
      className={cn(
        "hover:bg-muted/50 mx-1 w-full cursor-pointer rounded-sm border p-2",
        // today > period.end
        //   ? "bg-muted opacity-50"
        //   : isSameDay(period.start, today)
        //     ? "bg-red-600"
        //     : "bg-card",
      )}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex flex-col gap-0">
          <span className="overflow-hidden text-xs font-semibold">Dupont</span>
          <span className="text-muted-foreground overflow-hidden text-xs">
            Mathematique
          </span>
        </div>
        <div className="text-xs font-extralight">
          {/* {period.start.toLocaleDateString(locale, {
              weekday: "short",
              day: "2-digit",
              month: "short",
            })} */}
        </div>
      </div>
      <div className="text-muted-foreground flex justify-between text-sm">
        <FlatBadge variant={"green"}>
          <Clock2Icon className="mr-2 h-4 w-4" />
          {/* {period.start.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
            })} */}
        </FlatBadge>
        <FlatBadge variant={"pink"}>
          <Clock3Icon className="mr-2 h-4 w-4" />
          {/* {period.end.toLocaleTimeString(locale, {
              hour: "2-digit",
              minute: "2-digit",
            })} */}
        </FlatBadge>
      </div>
    </div>
  );
}