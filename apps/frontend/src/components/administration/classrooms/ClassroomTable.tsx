"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EyeIcon, Loader, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export default function ClassroomTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const router = useRouter();
  const classroomsQuery = useQuery(trpc.classroom.all.queryOptions());
  const { openSheet } = useSheet();
  const deleteClassroomMutation = useMutation(
    trpc.classroom.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.classroom.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const canDeleteClassroom = useCheckPermission(
    "classroom",
    PermissionAction.DELETE,
  );
  const canEditClassroom = useCheckPermission(
    "classroom",
    PermissionAction.UPDATE,
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
                          router.push(`/classrooms/${classroom.id}`);
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                        {t("details")}
                      </DropdownMenuItem>
                      {canEditClassroom && (
                        <DropdownMenuItem
                          onSelect={() => {
                            openSheet({
                              title: t("edit_a_classroom"),
                              description: t("edit_classroom_description"),
                              view: (
                                <CreateEditClassroom classroom={classroom} />
                              ),
                            });
                          }}
                        >
                          <Pencil />
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
                                  <Trash2 className="text-destructive h-8 w-8" />
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
          })}
        </TableBody>
      </Table>
    </div>
  );
}
