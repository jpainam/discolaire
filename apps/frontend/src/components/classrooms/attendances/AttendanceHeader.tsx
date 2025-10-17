"use client";

import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function AttendanceHeader() {
  const { t } = useLocale();
  const [termId, setTermId] = useQueryState("termId", {
    shallow: false,
  });
  const [attendanceType, setAttendanceType] = useQueryState("attendanceType", {
    shallow: false,
  });
  const [date, setDate] = useQueryState("date", {
    shallow: true,
  });
  const params = useParams<{ id: string }>();
  const confirm = useConfirm();
  const canDeleteAttendance = useCheckPermission(
    "attendance",
    PermissionAction.DELETE,
  );
  const canCreateAttendance = useCheckPermission(
    "attendance",
    PermissionAction.CREATE,
  );
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deletePeriodictAttendance = useMutation(
    trpc.attendance.deletePeriodic.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();

  return (
    <div className="bg-muted grid flex-row items-center gap-4 border-b px-4 py-1 md:flex">
      <div className="flex flex-row items-center gap-2">
        <Label className="hidden md:block">{t("attendance_type")}</Label>
        <Select
          defaultValue={attendanceType ?? undefined}
          onValueChange={(val) => {
            setAttendanceType(val);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("attendance_type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Journalier</SelectItem>
            <SelectItem value="periodic">Périodique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {attendanceType == "periodic" && (
        <div className="flex flex-row items-center gap-2">
          <Label className="hidden md:block">{t("periods")}</Label>
          <TermSelector
            className="md:w-[300px]"
            defaultValue={termId}
            onChange={(val) => {
              setTermId(val);
            }}
          />
        </div>
      )}
      {attendanceType == "daily" && (
        <div className="flex flex-row items-center gap-2">
          <Label>{t("date")}</Label>
          <Input
            type="date"
            className="md:w-[200px]"
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
      )}
    </div>
  );
}
