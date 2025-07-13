/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import i18next from "i18next";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";

export function StudentEnrollmentTable({ studentId }: { studentId: string }) {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: enrollments } = useSuspenseQuery(
    trpc.student.enrollments.queryOptions(studentId)
  );
  const confirm = useConfirm();
  const fullDateFormatter = new Intl.DateTimeFormat(i18next.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const canDeleteEnrollment = useCheckPermission(
    "enrollment",
    PermissionAction.DELETE
  );

  const queryClient = useQueryClient();
  const deleteEnrollmentMutation = useMutation(
    trpc.enrollment.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.student.enrollments.pathFilter()
        );
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter()
        );
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

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
            <TableHead>{t("Start date")}</TableHead>
            <TableHead>{t("End date")}</TableHead>
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
                  {c.schoolYear?.name}
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
                  {canDeleteEnrollment && (
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
                              toast.loading(t("Processing..."), { id: 0 });
                              deleteEnrollmentMutation.mutate(c.id);
                            }
                          }}
                        >
                          <Trash2 />
                          {t("unenroll")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
