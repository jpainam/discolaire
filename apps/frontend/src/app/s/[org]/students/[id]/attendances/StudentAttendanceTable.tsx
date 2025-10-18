"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { Badge } from "~/components/base-badge";
import { EmptyState } from "~/components/EmptyState";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "absence":
      return <UserX className="h-4 w-4" />;
    case "lateness":
      return <Clock className="h-4 w-4" />;
    case "consigne":
      return <FileText className="h-4 w-4" />;
    case "chatter":
      return <MessageSquare className="h-4 w-4" />;
    case "exclusion":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
};

export function StudentAttendanceTable() {
  const t = useTranslations();
  const { openSheet } = useSheet();
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.student.queryOptions({
      studentId: params.id,
    }),
  );

  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("term")}</TableHead>
              <TableHead>{t("details")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState className="my-8" />
                </TableCell>
              </TableRow>
            ) : (
              attendances.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div
                      className="flex cursor-pointer items-center gap-2 hover:underline"
                      onClick={() => {
                        // openSheet({
                        //   title: t("attendance_details"),
                        //   view: (
                        //     <StudentAttendanceDetails
                        //       type={record.type}
                        //       id={record.id}
                        //     />
                        //   ),
                        // });
                      }}
                    >
                      {getTypeIcon(record.type)}
                      <span className="font-medium capitalize">
                        {record.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(record.createdAt, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.term.name}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {/* <div className="truncate" title={formatDetails(record)}>
                      {formatDetails(record)}
                    </div> */}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.justifiedAbsence ? "success" : "destructive"
                      }
                      appearance={"light"}
                    >
                      {record.justifiedAbsence ? (
                        <>
                          {record.justifiedAbsence} {t("justified")}
                        </>
                      ) : (
                        t("non_justified")
                      )}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    {/* <StudentAttendanceTableDropdown record={record} /> */}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
