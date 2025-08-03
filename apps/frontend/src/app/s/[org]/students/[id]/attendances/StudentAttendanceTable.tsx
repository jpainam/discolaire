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
import { useQueryState } from "nuqs";

import { Badge } from "@repo/ui/components/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { useTRPC } from "~/trpc/react";

type AttendanceType =
  | "absence"
  | "lateness"
  | "consigne"
  | "chatter"
  | "exclusion";
export interface AttendanceRecord {
  id: string;
  type: AttendanceType;
  date: string;
  term: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
  justified: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "justified":
      return (
        <Badge
          variant="default"
          className="bg-green-100 text-green-800 hover:bg-green-100"
        >
          Justified
        </Badge>
      );
    case "pending":
      return (
        <Badge
          variant="default"
          className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        >
          Pending
        </Badge>
      );
    case "not_justified":
      return <Badge variant="destructive">Not Justified</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const canJustify = (record: AttendanceRecord) => {
  return ["absence", "lateness", "exclusion"].includes(record.type);
};

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

interface AttendanceTableProps {
  data: AttendanceRecord[];
  onJustify: (record: AttendanceRecord) => void;
}

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
      details: { numberOfAbsences: absence.justifications.length },
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
      details: { numberOfChatter: chatter.justifications.length },
      justified: chatter.justifications.length > 0,
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
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("type")}</TableHead>
          <TableHead>{t("date")}</TableHead>
          <TableHead>{t("term")}</TableHead>
          <TableHead>{t("details")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
