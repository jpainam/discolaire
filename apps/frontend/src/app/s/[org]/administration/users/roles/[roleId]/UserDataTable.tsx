"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { AddUserToRole } from "./AddUserToRole";

export function UserDataTable({ roleId }: { roleId: string }) {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  });
  const canAddRoleToUser = useCheckPermission("role", PermissionAction.CREATE);
  const canRemoveRoleFromUser = useCheckPermission(
    "role",
    PermissionAction.DELETE,
  );
  const confirm = useConfirm();
  const [debounceValue] = useDebounce(query, 300);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const router = useRouter();
  const userRolesQuery = useQuery(
    trpc.role.users.queryOptions({
      roleId: roleId,
      q: debounceValue,
    }),
  );
  const removeUserFromRole = useMutation(
    trpc.role.removeRole.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.users.pathFilter());
        toast.success(t("removed_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Input
          placeholder={t("search")}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96"
        />
        {canAddRoleToUser && (
          <Button
            variant={"default"}
            onClick={() => {
              openModal({
                className: "p-0 w-[600px]",
                title: <p className="px-4 py-2">{t("add")}</p>,
                view: <AddUserToRole roleId={roleId} />,
              });
            }}
          >
            {t("add")}
          </Button>
        )}
      </div>

      {userRolesQuery.isPending ? (
        <DataTableSkeleton rowCount={10} columnCount={4} />
      ) : (
        <></>
      )}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRolesQuery.data?.map((userRole) => {
              return (
                <TableRow key={`${userRole.roleId}-${userRole.userId}`}>
                  <TableCell className="py-0">{userRole.user.name}</TableCell>
                  <TableCell className="py-0">{userRole.user.email}</TableCell>

                  <TableCell className="py-0 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(
                              `/administration/users/${userRole.userId}`,
                            );
                          }}
                        >
                          <Eye />
                          {t("details")}
                        </DropdownMenuItem>
                        {canRemoveRoleFromUser && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                              onSelect={async () => {
                                const isConfirmed = await confirm({
                                  title: t("delete"),
                                  description: t("remove_user_from_role"),
                                });
                                if (isConfirmed) {
                                  toast.loading(t("removing"), { id: 0 });
                                  removeUserFromRole.mutate({
                                    roleId: roleId,
                                    userId: userRole.userId,
                                  });
                                }
                              }}
                            >
                              <Trash2 />
                              {t("remove")}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
            {userRolesQuery.data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
