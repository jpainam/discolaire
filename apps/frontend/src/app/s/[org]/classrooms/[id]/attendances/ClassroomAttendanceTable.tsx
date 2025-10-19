"use client";

import {
  memo,
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { Badge } from "~/components/base-badge";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { ClassroomEditAttendance } from "./ClassroomEditAttendance";

type AttendanceRow = RouterOutputs["attendance"]["all"][number];

function useCollator(locale: string) {
  return useMemo(
    () =>
      new Intl.Collator(locale, {
        usage: "search",
        sensitivity: "base", // case/diacritics-insensitive
        ignorePunctuation: true,
      }),
    [locale],
  );
}

function getTotalIssues(a: AttendanceRow) {
  return a.absence + a.chatter + a.exclusion + a.late;
}

function getSeverity(total: number) {
  if (total === 0) return { label: "Good", variant: "success" as const };
  if (total <= 3) return { label: "Warning", variant: "warning" as const };
  return { label: "Critical", variant: "destructive" as const };
}

export function ClassroomAttendanceTable({
  classroomId,
}: {
  classroomId: string;
}) {
  const trpc = useTRPC();
  const locale = useLocale();
  const inputId = useId();

  const { data: attendances } = useSuspenseQuery(
    trpc.attendance.all.queryOptions({ classroomId }),
  );

  const [termId] = useQueryState("termId");

  const [searchQuery, setSearchQuery] = useState("");
  const deferredQuery = useDeferredValue(searchQuery);

  const collator = useCollator(locale);
  const t = useTranslations();

  const dateFmt = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: "2-digit",
        month: "short",
        day: "numeric",
      }),
    [locale],
  );

  const filtered = useMemo(() => {
    const byTerm = termId
      ? attendances.filter((a) => a.termId === termId)
      : attendances;

    const q = deferredQuery.trim();
    if (q === "") return byTerm;

    const qLower = q.toLowerCase();

    return byTerm.filter((r) => {
      const first = r.student.firstName ?? "";
      const last = r.student.lastName ?? "";
      const reg = r.student.registrationNumber ?? "";

      // fast path: lowercase includes
      if (
        first.toLowerCase().includes(qLower) ||
        last.toLowerCase().includes(qLower) ||
        reg.toLowerCase().includes(qLower)
      )
        return true;
      return (
        collator.compare(first, q) === 0 || collator.compare(last, q) === 0
      );
    });
  }, [attendances, deferredQuery, collator, termId]);

  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    trpc.attendance.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onEdit = useCallback((id: number) => {
    // TODO: open edit drawer/modal
    // e.g., router.push(`/attendance/${id}/edit`);
    console.log("edit", id);
  }, []);

  const onDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <InputGroup className="w-96" aria-label="Search attendance records">
        <InputGroupInput
          id={inputId}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or registration…"
          aria-label="Search by name or registration"
        />
        <InputGroupAddon aria-hidden>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      {filtered.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          <p className="text-lg">No attendance records found</p>
          <p className="mt-2 text-sm">Add your first record to get started</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Term</TableHead>
                <TableHead className="text-center">Absences</TableHead>
                <TableHead className="text-center">Retards</TableHead>
                <TableHead className="text-center">Bavardages</TableHead>
                <TableHead className="text-center">Consignes</TableHead>
                <TableHead className="text-center">Exclusions</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => (
                <AttendanceRowView
                  key={record.id}
                  record={record}
                  dateFmt={dateFmt}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

const AttendanceRowView = memo(function AttendanceRowView({
  record,
  dateFmt,
  onEdit,
  onDelete,
}: {
  record: AttendanceRow;
  dateFmt: Intl.DateTimeFormat;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const total = getTotalIssues(record);
  const sev = getSeverity(total);
  const confirm = useConfirm();
  const t = useTranslations();
  const { openModal } = useModal();

  // pre-format once
  const created =
    record.createdAt instanceof Date
      ? dateFmt.format(record.createdAt)
      : dateFmt.format(new Date(record.createdAt as unknown as string));

  return (
    <TableRow>
      <TableCell>{created}</TableCell>

      <TableCell>
        <div>
          <Link
            href={`/students/${record.studentId}/attendances`}
            className="font-medium hover:underline"
          >
            {getFullName(record.student)}
          </Link>

          {/* <div className="text-muted-foreground text-sm">
            {record.student.registrationNumber}
          </div> */}
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {record.term.name}
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">{record.absence}</span>
          {record.justifiedAbsence > 0 && (
            <span className="text-muted-foreground text-xs">
              ({record.justifiedAbsence} justified)
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">{record.late}</span>
          {record.justifiedLate > 0 && (
            <span className="text-muted-foreground text-xs">
              ({record.justifiedLate} justified)
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center font-semibold">
        {record.chatter}
      </TableCell>
      <TableCell className="text-center font-semibold">
        {record.consigne}
      </TableCell>

      <TableCell className="text-center font-semibold">
        {record.exclusion}
      </TableCell>

      <TableCell className="text-center">
        <Badge variant={sev.variant} appearance="outline">
          {sev.label}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              openModal({
                title: `Update the attendance for ${record.student.lastName}`,
                view: <ClassroomEditAttendance attendance={record} />,
              });
            }}
            variant="ghost"
            size="icon"
            aria-label="Edit record"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            onClick={async () => {
              const isConfirmed = await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
              });
              if (isConfirmed) {
                onDelete(record.id);
              }
            }}
            variant="ghost"
            size="icon"
            aria-label="Delete record"
          >
            <Trash2 className="text-destructive h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});
