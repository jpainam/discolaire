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

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import i18next from "i18next";
import { api } from "~/trpc/react";
import { CreateEditSchoolYear } from "./CreateEditSchoolYear";

export function SchoolYearTable() {
  const schoolYearsQuery = api.schoolYear.all.useQuery();
  const { t } = useLocale();
  const { openModal } = useModal();

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
      <div className="grid grid-cols-1 gap-2 px-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("classrooms")}</TableHead>
              <TableHead>{t("students")}</TableHead>
              <TableHead>{t("start_date")}</TableHead>
              <TableHead>{t("end_date")}</TableHead>
              <TableHead>{t("lock")}?</TableHead>
              <TableHead className="w-[96px] "></TableHead>
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
                      {schoolYear.startDate.toLocaleDateString(
                        i18next.language,
                        {
                          month: "short",
                          year: "numeric",
                          day: "2-digit",
                        },
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-2">
                      <CalendarClock className="h-4 w-4" />
                      {schoolYear.endDate.toLocaleDateString(i18next.language, {
                        month: "short",
                        year: "numeric",
                        day: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <FlatBadge
                      variant={schoolYear.isActive ? "gray" : "yellow"}
                    >
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
                              view: (
                                <CreateEditSchoolYear
                                  id={schoolYear.id}
                                  name={schoolYear.name}
                                  startDate={schoolYear.startDate}
                                  endDate={schoolYear.endDate}
                                  isActive={schoolYear.isActive}
                                />
                              ),
                            });
                          }}
                        >
                          <Pencil />
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
                          <Trash2 />
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
    </div>
  );
}
