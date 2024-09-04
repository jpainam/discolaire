"use client";

import {
  CalendarClock,
  CalendarDays,
  MoreHorizontal,
  Pencil,
  SchoolIcon,
  Trash2,
} from "lucide-react";
import { FaLock, FaUnlockAlt, FaUsers } from "react-icons/fa";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { CreateEditSchoolYear } from "./CreateEditSchoolYear";

export function SchoolYearTable() {
  const schoolYearsQuery = api.schoolYear.all.useQuery();
  const { t } = useLocale();
  const { openModal } = useModal();
  const { fullDateFormatter } = useDateFormat();
  const utils = api.useUtils();
  const confirm = useConfirm();
  const deleteSchoolYearMutation = api.schoolYear.delete.useMutation({
    onSettled: () => utils.schoolYear.invalidate(),
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
  });

  if (schoolYearsQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="m-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("classrooms")}</TableHead>
            <TableHead>{t("students")}</TableHead>
            <TableHead>{t("start_date")}</TableHead>
            <TableHead>{t("end_date")}</TableHead>
            <TableHead>{t("lock")}?</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schoolYearsQuery.data?.map((schoolYear) => {
            return (
              <TableRow key={schoolYear.id}>
                <TableCell> {schoolYear.name}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-2">
                    <SchoolIcon className="h-4 w-4" />
                    {schoolYear.classroom}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-2">
                    <FaUsers className="h-4 w-4" />
                    {schoolYear.enrollment}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {fullDateFormatter.format(schoolYear.startDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-2">
                    <CalendarClock className="h-4 w-4" />
                    {fullDateFormatter.format(schoolYear.endDate)}
                  </div>
                </TableCell>
                <TableCell>
                  <FlatBadge variant={schoolYear.isActive ? "gray" : "yellow"}>
                    {schoolYear.isActive ? (
                      <>
                        <FaUnlockAlt className="mr-2 h-4 w-4" />
                        {t("no")}
                      </>
                    ) : (
                      <>
                        <FaLock className="mr-2 h-4 w-4" />
                        {t("yes")}
                      </>
                    )}
                  </FlatBadge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          openModal({
                            title: `${t("edit")} - ${t("schoolYear")}`,
                            description: schoolYear.name,
                            className: "w-96",
                            view: (
                              <CreateEditSchoolYear
                                id={schoolYear.id}
                                name={schoolYear.name}
                                startDate={schoolYear.startDate}
                                endDate={schoolYear.endDate}
                                isActive={schoolYear.isActive ?? true}
                              />
                            ),
                          });
                        }}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        disabled={!schoolYear.isActive}
                        onSelect={async () => {
                          const isConfirm = await confirm({
                            icon: (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            ),
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            alertDialogTitle: {
                              className: "flex items-center gap-2",
                            },
                          });
                          if (isConfirm) {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteSchoolYearMutation.mutate(schoolYear.id);
                          }
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("Delete")}
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
