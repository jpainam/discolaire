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
import { Mail, MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
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
import { ClassroomEditAttendance } from "~/components/classrooms/attendances/ClassroomEditAttendance";
import { EmptyComponent } from "~/components/EmptyComponent";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

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
  return (
    a.absence +
    a.chatter +
    a.exclusion +
    a.late -
    a.justifiedAbsence -
    a.justifiedLate
  );
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

  const onDelete = useCallback(
    (id: number) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  if (filtered.length === 0) {
    return (
      <EmptyComponent
        title="Aucune présence"
        description="Veuillez choisir une période et saisir les présences"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <InputGroup className="w-96" aria-label="Search attendance records">
        <InputGroupInput
          id={inputId}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("search")}
        />
        <InputGroupAddon aria-hidden>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Date</TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("registrationNumber")}</TableHead>
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
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const AttendanceRowView = memo(function AttendanceRowView({
  record,
  onDelete,
}: {
  record: AttendanceRow;
  onDelete: (id: number) => void;
}) {
  const total = getTotalIssues(record);
  const sev = getSeverity(total);
  const confirm = useConfirm();
  const locale = useLocale();
  const t = useTranslations();
  const { openModal } = useModal();
  const canDeleteAttendance = useCheckPermission(
    "attendance",
    PermissionAction.DELETE,
  );
  const canUpdateAttendance = useCheckPermission(
    "attendance",
    PermissionAction.UPDATE,
  );

  return (
    <TableRow>
      <TableCell>
        {record.createdAt.toLocaleDateString(locale, {
          year: "2-digit",
          month: "short",
          day: "numeric",
        })}
      </TableCell>

      <TableCell className="py-0">
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
      <TableCell className="text-muted-foreground py-0">
        {record.student.registrationNumber}
      </TableCell>

      <TableCell className="text-muted-foreground py-0">
        {record.term.name}
      </TableCell>

      <TableCell className="py-0 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">{record.absence}</span>
          {record.justifiedAbsence > 0 && (
            <span className="text-muted-foreground text-xs">
              ({record.justifiedAbsence} justified)
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="py-0 text-center">
        <div className="flex flex-col items-center gap-1">
          <span className="font-semibold">{record.late}</span>
          {record.justifiedLate > 0 && (
            <span className="text-muted-foreground text-xs">
              ({record.justifiedLate} justified)
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="py-0 text-center">{record.chatter}</TableCell>
      <TableCell className="py-0 text-center">{record.consigne}</TableCell>

      <TableCell className="py-0 text-center">{record.exclusion}</TableCell>

      <TableCell className="py-0 text-center">
        <Badge variant={sev.variant} appearance="outline">
          {sev.label}
        </Badge>
      </TableCell>

      <TableCell className="py-0 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon-sm"}>
              <MoreVertical className="size-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Mail />
              {t("notify")}
            </DropdownMenuItem>
            {canUpdateAttendance && (
              <DropdownMenuItem
                onSelect={() => {
                  openModal({
                    title: `Modifier la présence ${record.student.lastName}`,
                    description: record.term.name,
                    view: <ClassroomEditAttendance attendance={record} />,
                  });
                }}
              >
                <Pencil />
                {t("edit")}
              </DropdownMenuItem>
            )}
            {canDeleteAttendance && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onSelect={async () => {
                    const isConfirmed = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                    });
                    if (isConfirmed) {
                      toast.loading(t("Processing"), { id: 0 });
                      onDelete(record.id);
                    }
                  }}
                >
                  <Trash2 />
                  {t("delete")}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});
