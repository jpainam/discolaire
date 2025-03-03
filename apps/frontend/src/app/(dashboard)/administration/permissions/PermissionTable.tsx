"use client";
import { PermissionType } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
import { useAtom } from "jotai";
import { MoreVerticalIcon, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { api } from "~/trpc/react";
import { permissionAtom } from "./permission-atoms";
export function PermissionTable() {
  const { t } = useLocale();

  const permissionQuery = api.permission.all.useQuery();
  const permissionGroupQuery = api.permission.groups.useQuery();
  const [permissionIds, setPermissionIds] = useAtom(permissionAtom);

  const utils = api.useUtils();
  const deletePermission = api.permission.delete.useMutation({
    onSettled: () => {
      void utils.permission.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();
  const permissions = permissionQuery.data ?? [];

  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>{t("title")}</TableHead>
            <TableHead>{t("show")}</TableHead>
            <TableHead>{t("create")}</TableHead>
            <TableHead>{t("edit")}</TableHead>
            <TableHead>{t("delete")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(permissionQuery.isPending || permissionGroupQuery.isPending) && (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )}

          {permissionGroupQuery.data?.map((item) => {
            const perms = permissions.filter((per) => per.groupId === item.id);
            const permsByType = {
              CREATE: perms.find((per) => per.type === PermissionType.CREATE),
              UPDATE: perms.find((per) => per.type === PermissionType.UPDATE),
              DELETE: perms.find((per) => per.type === PermissionType.DELETE),
              READ: perms.find((per) => per.type === PermissionType.READ),
            };
            return (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={
                      permsByType.READ
                        ? permissionIds.includes(permsByType.READ.id)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      if (permsByType.READ) {
                        setPermissionIds((prev) =>
                          checked
                            ? [...prev, permsByType.READ?.id ?? ""]
                            : prev.filter((id) => id !== permsByType.READ?.id),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={
                      permsByType.CREATE
                        ? permissionIds.includes(permsByType.CREATE.id)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      if (permsByType.CREATE) {
                        setPermissionIds((prev) =>
                          checked
                            ? [...prev, permsByType.CREATE?.id ?? ""]
                            : prev.filter(
                                (id) => id !== permsByType.CREATE?.id,
                              ),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={
                      permsByType.UPDATE
                        ? permissionIds.includes(permsByType.UPDATE.id)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      if (permsByType.UPDATE) {
                        setPermissionIds((prev) =>
                          checked
                            ? [...prev, permsByType.UPDATE?.id ?? ""]
                            : prev.filter(
                                (id) => id !== permsByType.UPDATE?.id,
                              ),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={
                      permsByType.DELETE
                        ? permissionIds.includes(permsByType.DELETE.id)
                        : false
                    }
                    onCheckedChange={(checked) => {
                      if (permsByType.DELETE) {
                        setPermissionIds((prev) =>
                          checked
                            ? [...prev, permsByType.DELETE?.id ?? ""]
                            : prev.filter(
                                (id) => id !== permsByType.DELETE?.id,
                              ),
                        );
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={"ghost"} size={"icon"}>
                        <MoreVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil />
                        {t("edit")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                        onSelect={async () => {
                          const isConfirmed = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: <Trash2 className="text-destructive" />,
                            alertDialogTitle: {
                              className: "flex items-center gap-1",
                            },
                          });
                          if (isConfirmed) {
                            toast.loading(t("deleting"), { id: 0 });
                            deletePermission.mutate(item.id);
                          }
                        }}
                      >
                        <Trash2 />
                        {t("delete")}
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
