"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { inferProcedureOutput } from "@trpc/server";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { EmptyState } from "@repo/ui/EmptyState";
import FlatBadge from "@repo/ui/FlatBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { useAlert } from "~/hooks/use-alert";
import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { routes } from "../../../configs/routes";

type StudentEnrollmentProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["student"]["enrollments"]>
>[number];

export function StudentEnrollmentTable({
  enrollments,
}: {
  enrollments: StudentEnrollmentProcedureOutput[];
}) {
  const { t } = useLocale();
  const { openAlert, closeAlert } = useAlert();
  const { fullDateFormatter } = useDateFormat();
  const deleteEnrollmentMutation = api.enrollment.delete.useMutation();
  const utils = api.useUtils();
  const queryClient = useQueryClient();
  const router = useRouter();
  if (enrollments.length === 0) {
    return <EmptyState className="my-2" />;
  }
  return (
    <div className="m-2 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("schoolYear")}</TableHead>
            <TableHead>{t("classroom")}</TableHead>
            <TableHead>{t("enrollment_date")}</TableHead>
            <TableHead>{t("start_date")}</TableHead>
            <TableHead>{t("end_date")}</TableHead>
            <TableHead>{t("observation")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((c) => {
            const createdAt = fullDateFormatter.format(
              c.createdAt ?? new Date(),
            );
            const enrollmentStartDate = fullDateFormatter.format(
              c.schoolYear?.enrollmentStartDate ?? new Date(),
            );
            const enrolmmentEndDate = fullDateFormatter.format(
              c.schoolYear?.enrollmentEndDate ?? new Date(),
            );

            return (
              <TableRow key={c.id}>
                <TableCell className="items-center justify-center">
                  {c.schoolYearId}
                </TableCell>
                <TableCell className="items-center justify-center">
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={routes.classrooms.details(c.classroomId ?? "#")}
                  >
                    {c.classroom?.name}
                  </Link>
                </TableCell>
                <TableCell>{createdAt}</TableCell>
                <TableCell>{enrollmentStartDate}</TableCell>
                <TableCell>{enrolmmentEndDate}</TableCell>
                <TableCell className="items-center justify-center">
                  {c.observation || "N/A"}
                </TableCell>
                <TableCell>
                  <FlatBadge variant="green">{t("enrolled")}</FlatBadge>
                </TableCell>

                <TableCell className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="h-8 w-8"
                        size={"icon"}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer bg-destructive text-destructive-foreground"
                        onSelect={() => {
                          openAlert({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            onConfirm: () => {
                              toast.promise(
                                deleteEnrollmentMutation.mutateAsync(c.id),
                                {
                                  loading: t("unenrolling"),
                                  error: (error) => {
                                    closeAlert();
                                    return getErrorMessage(error);
                                  },
                                  success: async () => {
                                    await utils.student.invalidate();
                                    closeAlert();
                                    return t("unenrolled");
                                  },
                                },
                              );
                            },
                          });
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("unenroll")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
