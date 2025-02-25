"use client";

import { EyeIcon, Loader, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";

export default function ClassroomTable() {
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();
  const classroomsQuery = api.classroom.all.useQuery();
  const { openSheet } = useSheet();
  const deleteClassroomMutation = api.classroom.delete.useMutation({
    onSettled: () => utils.classroom.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const canDeleteClassroom = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom"
  );
  const canEditClassroom = useCheckPermissions(
    PermissionAction.UPDATE,
    "classroom"
  );
  const confirm = useConfirm();
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("level")}</TableHead>
            <TableHead>{t("size")}</TableHead>
            <TableHead>{t("max_size")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classroomsQuery.isPending && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <Loader className="h-6 w-6 animate-spin" />
              </TableCell>
            </TableRow>
          )}
          {classroomsQuery.data?.map((classroom) => {
            return (
              <TableRow>
                <TableCell className="py-0">
                  <Checkbox />
                </TableCell>
                <TableCell className="py-0">{classroom.name}</TableCell>
                <TableCell className="py-0">{classroom.level.name}</TableCell>
                <TableCell className="py-0">{classroom.size}</TableCell>
                <TableCell className="py-0">{classroom.maxSize}</TableCell>
                <TableCell className="py-0 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          router.push(`/datum/classrooms/${classroom.id}`);
                        }}
                      >
                        <EyeIcon className="mr-2 h-4 w-4" />
                        {t("details")}
                      </DropdownMenuItem>
                      {canEditClassroom && (
                        <DropdownMenuItem
                          onSelect={() => {
                            openSheet({
                              title: <span className="px-4">{t("edit")}</span>,
                              className: "w-[600px]",
                              view: (
                                <CreateEditClassroom classroom={classroom} />
                              ),
                            });
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                      )}
                      {canDeleteClassroom && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={async () => {
                              const isConfirmed = await confirm({
                                title: t("delete"),
                                description: t("delete_confirmation"),
                                icon: (
                                  <Trash2 className="h-8 w-8 text-destructive" />
                                ),
                                alertDialogTitle: {
                                  className: "flex items-center gap-2",
                                },
                              });
                              if (isConfirmed) {
                                toast.loading(t("deleting"), { id: 0 });
                                deleteClassroomMutation.mutate(classroom.id);
                              }
                            }}
                            className="bg-destructive text-destructive-foreground"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </>
                      )}
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
