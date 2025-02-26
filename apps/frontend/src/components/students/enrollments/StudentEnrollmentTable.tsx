/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { EmptyState } from "~/components/EmptyState";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useRouter } from "next/navigation";
import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";

type StudentEnrollmentProcedureOutput = NonNullable<
  RouterOutputs["student"]["enrollments"]
>[number];

export function StudentEnrollmentTable({
  enrollments,
}: {
  enrollments: StudentEnrollmentProcedureOutput[];
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const { fullDateFormatter } = useDateFormat();
  const utils = api.useUtils();
  const router = useRouter();
  const deleteEnrollmentMutation = api.enrollment.delete.useMutation({
    onSettled: async () => {
      await utils.student.invalidate();
    },
    onSuccess: () => {
      toast.success(t("unenrolled"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

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
              c.createdAt ?? new Date()
            );
            const enrollmentStartDate = fullDateFormatter.format(
              c.schoolYear?.enrollmentStartDate ?? new Date()
            );
            const enrolmmentEndDate = fullDateFormatter.format(
              c.schoolYear?.enrollmentEndDate ?? new Date()
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
                  {c.observation ?? "N/A"}
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
                        variant="destructive"
                        className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                        onSelect={async () => {
                          const isConfirmed = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: (
                              <Trash2 className="h-5 w-5 text-destructive" />
                            ),
                            alertDialogTitle: {
                              className: "flex items-center gap-2",
                            },
                          });
                          if (isConfirmed) {
                            toast.loading(t("unenrolling"));
                            deleteEnrollmentMutation.mutate(c.id);
                          }
                        }}
                      >
                        <Trash2 />
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
