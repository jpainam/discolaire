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
  MoreHorizontal,
  UserX,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
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
import { useTRPC } from "~/trpc/react";

export interface AttendanceRecord {
  id: number;
  type: string;
  date: Date;
  term: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
  justified: boolean;
}

const formatDetails = (record: AttendanceRecord) => {
  switch (record.type) {
    case "absence": {
      const absenceDetails = record.details as { numberOfAbsences: number };
      return `${absenceDetails.numberOfAbsences} absence(s)`;
    }
    case "lateness": {
      const latenessDetails = record.details as { duration: number };
      return `${latenessDetails.duration} minutes late`;
    }
    case "consigne": {
      const consigneDetails = record.details as {
        task: string;
        duration: number;
      };
      return `${consigneDetails.duration}min - ${consigneDetails.task}`;
    }
    case "chatter": {
      const chatterDetails = record.details as { numberOfChatter: number };
      return `${chatterDetails.numberOfChatter} chatter(s)`;
    }
    case "exclusion": {
      const exclusionDetails = record.details as {
        startDate: string;
        endDate: string;
        reason: string;
      };
      return `${format(new Date(exclusionDetails.startDate), "MMM dd")} - ${format(new Date(exclusionDetails.endDate), "MMM dd")}: ${exclusionDetails.reason}`;
    }
    default:
      return "N/A";
  }
};

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
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const [termId] = useQueryState("termId");
  const { data: absences } = useSuspenseQuery(
    trpc.absence.studentSummary.queryOptions({
      studentId: params.id,
      termIds: termId ? [termId] : undefined,
    }),
  );
  const { data: latenesses } = useSuspenseQuery(
    trpc.lateness.studentSummary.queryOptions({
      studentId: params.id,
      termIds: termId ? [termId] : undefined,
    }),
  );
  const { data: consignes } = useSuspenseQuery(
    trpc.consigne.studentSummary.queryOptions({
      studentId: params.id,
      termIds: termId ? [termId] : undefined,
    }),
  );
  const { data: chatters } = useSuspenseQuery(
    trpc.chatter.studentSummary.queryOptions({
      studentId: params.id,
      termIds: termId ? [termId] : undefined,
    }),
  );
  const { data: exclusions } = useSuspenseQuery(
    trpc.exclusion.studentSummary.queryOptions({
      studentId: params.id,
      termIds: termId ? [termId] : undefined,
    }),
  );

  const data: AttendanceRecord[] = [
    ...absences.map((absence) => ({
      id: absence.id,
      type: "absence",
      date: absence.date,
      term: absence.term.name,
      details: { numberOfAbsences: absence.value },
      justified: absence.justifications.length > 0,
    })),
    ...latenesses.map((lateness) => ({
      id: lateness.id,
      type: "lateness",
      date: lateness.date,
      term: lateness.term.name,
      details: { duration: lateness.duration },
      justified: lateness.justifications.length > 0,
    })),
    ...consignes.map((consigne) => ({
      id: consigne.id,
      type: "consigne",
      date: consigne.date,
      term: consigne.term.name,
      details: { task: consigne.task, duration: consigne.duration },
      justified: false, // Consignes are not justified
    })),
    ...chatters.map((chatter) => ({
      id: chatter.id,
      type: "chatter",
      date: chatter.date,
      term: chatter.term.name,
      details: { numberOfChatter: chatter.value },
      justified: false,
    })),
    ...exclusions.map((exclusion) => ({
      id: exclusion.id,
      type: "exclusion",
      date: exclusion.startDate,
      term: exclusion.term.name,
      details: {
        startDate: exclusion.startDate,
        endDate: exclusion.endDate,
        reason: exclusion.reason,
      },
      justified: false, // Exclusions are not justified
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyState className="my-8" />
                </TableCell>
              </TableRow>
            ) : (
              data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(record.type)}
                      <span className="font-medium capitalize">
                        {record.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(record.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.term}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={formatDetails(record)}>
                      {formatDetails(record)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={record.justified ? "success" : "destructive"}
                      appearance={"light"}
                    ></Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className="size-7">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>{t("justify")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
                        <DropdownMenuItem>
                          {t("notify_parents")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>{t("delete")}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
