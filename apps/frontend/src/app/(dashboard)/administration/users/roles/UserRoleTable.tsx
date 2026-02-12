"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AddInvoiceIcon, AddTeamIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { RoleLevel } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { AddUserSelector } from "./AddUserSelector";
import { AddPermissionToRole, CreateEditUserRole } from "./CreateEditUserRole";

export function UserRoleTable() {
  const trpc = useTRPC();

  const [queryText, setQueryText] = useState<string>("");
  const queryClient = useQueryClient();
  const debounce = useDebouncedCallback((value: string) => {
    setQueryText(value);
  }, 200);
  const { openModal } = useModal();
  const { openSheet } = useSheet();

  const canDeleteRole = useCheckPermission("role.delete");
  const canAddPermission = useCheckPermission("role.update");
  const canUpdateRole = useCheckPermission("role.update");
  const canUpdateUser = useCheckPermission("user.update");
  const deleteRoleMutation = useMutation(
    trpc.role.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.pathFilter());
        await queryClient.invalidateQueries(trpc.permission.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const confirm = useConfirm();
  const { data: roles } = useSuspenseQuery(trpc.role.all.queryOptions());
  const t = useTranslations();
  const filtered = useMemo(() => {
    if (!queryText) return roles;
    const q = queryText.toLowerCase();
    return roles.filter(
      (r) =>
        r.description.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q),
    );
  }, [roles, queryText]);
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        <InputGroup className="w-full lg:w-1/2 xl:w-1/3">
          <InputGroupInput
            onChange={(e) => debounce(e.target.value)}
            placeholder={t("search")}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="overflow-hidden rounded-lg border bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[10px]"></TableHead>
              <TableHead>{t("Label")}</TableHead>
              <TableHead>{t("Description")}</TableHead>
              <TableHead className="text-center">{t("Level")}</TableHead>
              <TableHead className="text-center">{t("Users")}</TableHead>
              <TableHead className="text-center">{t("Permissions")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Link
                      href={`/administration/users/roles/${r.id}`}
                      className="hover:underline"
                    >
                      {r.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        r.level == RoleLevel.LEVEL1
                          ? "destructive"
                          : r.level == RoleLevel.LEVEL2
                            ? "primary"
                            : r.level == RoleLevel.LEVEL3
                              ? "info"
                              : r.level == RoleLevel.LEVEL4
                                ? "secondary"
                                : "warning"
                      }
                      appearance={"outline"}
                    >
                      {r.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={"warning"} appearance={"light"}>
                      {r._count.userRoles}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={"info"} appearance={"light"}>
                      {r._count.permissionRoles}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canUpdateRole && (
                            <DropdownMenuItem
                              onSelect={() => {
                                openModal({
                                  className: "sm:max-w-xl",
                                  title: `${t("edit")} - ${r.name}`,
                                  description: r.description,
                                  view: <CreateEditUserRole role={r} />,
                                });
                              }}
                            >
                              <EditIcon />
                              {t("edit")}
                            </DropdownMenuItem>
                          )}
                          {canAddPermission && (
                            <DropdownMenuItem
                              onSelect={() => {
                                openSheet({
                                  className:
                                    "min-w-1/3 w-full sm:max-w-4xl w-1/3",
                                  title: "Ajouter une permission",
                                  description: `${r.name} - ${r.description}`,
                                  view: <AddPermissionToRole roleId={r.id} />,
                                });
                              }}
                            >
                              <HugeiconsIcon
                                icon={AddInvoiceIcon}
                                strokeWidth={2}
                                className="size-4"
                              />
                              Ajouter permissions
                            </DropdownMenuItem>
                          )}
                          {canUpdateUser && (
                            <DropdownMenuItem
                              onSelect={() => {
                                openModal({
                                  title: "Ajouter un utilisateur",
                                  description:
                                    "Choisir un utilisateur et ajouter",
                                  className: "sm:max-w-xl",
                                  view: <AddUserSelector roleId={r.id} />,
                                });
                              }}
                            >
                              <HugeiconsIcon
                                icon={AddTeamIcon}
                                strokeWidth={2}
                                className="size-4"
                              />
                              {t("Add user")}
                            </DropdownMenuItem>
                          )}

                          {canDeleteRole && r.level != RoleLevel.LEVEL1 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={async () => {
                                  await confirm({
                                    title: t("delete"),
                                    description: t("delete_confirmation"),

                                    onConfirm: async () => {
                                      toast.loading(t("Processing"), { id: 0 });
                                      await deleteRoleMutation.mutateAsync(
                                        r.id,
                                      );
                                    },
                                  });
                                }}
                                disabled={!canDeleteRole}
                                variant="destructive"
                              >
                                <DeleteIcon />
                                {t("delete")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
