"use client";

import Link from "next/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreVertical, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { StudentStatus } from "@repo/db/enums";

import { EmptyComponent } from "~/components/EmptyComponent";
import FlatBadge from "~/components/FlatBadge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function StudentEnrollmentTable({
  student,
}: {
  student: RouterOutputs["student"]["get"];
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: enrollments } = useSuspenseQuery(
    trpc.student.enrollments.queryOptions(student.id),
  );
  const confirm = useConfirm();
  const locale = useLocale();
  const fullDateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const canDeleteEnrollment = useCheckPermission("enrollment", "delete");

  const queryClient = useQueryClient();
  const deleteEnrollmentMutation = useMutation(
    trpc.enrollment.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.student.enrollments.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.classroom.students.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.student.get.pathFilter());
        toast.success(t("success"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  if (enrollments.length === 0) {
    return <EmptyComponent />;
  }

  const disabled = student.status !== StudentStatus.ACTIVE;
  return (
    <div className="px-4 py-2">
      <div className="bg-background overflow-hidden rounded-md border">
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
              const createdAt = fullDateFormatter.format(c.createdAt);
              const enrollmentStartDate = fullDateFormatter.format(
                c.schoolYear.enrollmentStartDate ?? new Date(),
              );
              const enrolmmentEndDate = fullDateFormatter.format(
                c.schoolYear.enrollmentEndDate ?? new Date(),
              );

              return (
                <TableRow key={c.id}>
                  <TableCell className="items-center justify-center">
                    {c.schoolYear.name}
                  </TableCell>
                  <TableCell className="items-center justify-center">
                    <Link
                      className="hover:text-blue-600 hover:underline"
                      href={routes.classrooms.details(c.classroomId)}
                    >
                      {c.classroom.name}
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
                          <Button variant={"outline"} size={"icon"}>
                            <MoreVertical />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={!c.schoolYear.isActive || disabled}
                            onSelect={async () => {
                              const isConfirmed = await confirm({
                                title: t("delete"),
                                description: t("delete_confirmation"),
                                icon: (
                                  <Trash2 className="text-destructive h-5 w-5" />
                                ),
                                alertDialogTitle: {
                                  className: "flex items-center gap-2",
                                },
                              });
                              if (isConfirmed) {
                                toast.loading(t("Processing"), { id: 0 });
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
    </div>
  );
}
