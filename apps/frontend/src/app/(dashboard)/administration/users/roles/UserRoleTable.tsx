"use client";

import { useMemo, useState } from "react";
import { AddInvoiceIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";



import { UserRoleLevel } from "@repo/db/enums";



import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { AddPermissionToRole, CreateEditUserRole } from "./CreateEditUserRole";


export function UserRoleTable() {
  const trpc = useTRPC();

  const [queryText, setQueryText] = useState<string>("");
  const debounce = useDebouncedCallback((value: string) => {
    setQueryText(value);
  }, 200);
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  const canDeleteRole = useCheckPermission("role", "delete");
  const canAddPermission = useCheckPermission("role", "update");
  const canUpdateRole = useCheckPermission("role", "update");
  const { data: roles } = useSuspenseQuery(trpc.userRole.all.queryOptions());
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
                  <TableCell>{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        r.level == UserRoleLevel.LEVEL1
                          ? "destructive"
                          : r.level == UserRoleLevel.LEVEL2
                            ? "primary"
                            : r.level == UserRoleLevel.LEVEL3
                              ? "info"
                              : r.level == UserRoleLevel.LEVEL4
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
                      {r._count.users}
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
                              Ajouter permission
                            </DropdownMenuItem>
                          )}

                          {canDeleteRole && r.level != UserRoleLevel.LEVEL1 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                disabled={!canDeleteRole}
                                variant="destructive"
                              >
                                <DeleteIcon className="text-destructive" />
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