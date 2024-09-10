"use client";

import { MoreHorizontal } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebounce } from "use-debounce";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { EmptyState } from "@repo/ui/EmptyState";
import { Input } from "@repo/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/react";

export function UserDataTable({ roleId }: { roleId: string }) {
  const [query, setQuery] = useQueryState("q", {
    defaultValue: "",
  });
  const [debounceValue] = useDebounce(query, 300);
  const { t } = useLocale();
  const userRolesQuery = api.role.users.useQuery({
    roleId: roleId,
    q: debounceValue,
  });
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Input
          placeholder={t("search")}
          onChange={(e) => setQuery(e.target.value)}
          className="w-96"
        />
        <Button variant={"default"}>{t("add")}</Button>
      </div>

      {userRolesQuery.isPending ? (
        <DataTableSkeleton className="mx-2" rowCount={10} columnCount={4} />
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
                  <TableCell>{userRole.user.name}</TableCell>
                  <TableCell>{userRole.user.email}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
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
