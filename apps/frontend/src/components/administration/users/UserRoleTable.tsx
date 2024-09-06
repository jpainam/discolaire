"use client";

import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { attachRoleAtom } from "~/atoms/permission-atom";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";

export function UserRoleTable() {
  const { t } = useLocale();
  const usersRoleQuery = api.role.all.useQuery();
  const [attachRoleValue, setAttachRoleValue] = useAtom(attachRoleAtom);
  const { fullDateFormatter } = useDateFormat();
  const params = useParams<{ id: string }>();
  const attachRoleMutation = api.role.attach.useMutation({
    onSuccess: () => {
      toast.success(t("added_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  if (usersRoleQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex justify-end">
        <Button
          disabled={attachRoleValue.length === 0}
          onClick={() => {
            toast.loading(t("adding"), { id: 0 });
            const roleIds = attachRoleValue;
            roleIds.forEach((roleId) => {
              void attachRoleMutation.mutate({ roleId, userId: params.id });
            });
          }}
        >
          {t("attach_role")} ({attachRoleValue.length})
        </Button>
      </div>
      <ScrollArea className="min-h-[calc(100vh-20rem)] rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead>
                {t("roles")} - {t("name")}
              </TableHead>
              <TableHead>{t("users")}</TableHead>
              <TableHead>{t("attach_policy")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersRoleQuery.data?.map((role) => {
              return (
                <TableRow key={role.id}>
                  <TableCell>
                    <Checkbox
                      checked={attachRoleValue.includes(role.id)}
                      onCheckedChange={(checked) => {
                        setAttachRoleValue((prev) => {
                          if (checked) {
                            return [...prev, role.id];
                          }
                          return prev.filter((id) => id !== role.id);
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.users}</TableCell>
                  <TableCell>Attach policy</TableCell>
                  <TableCell>
                    {fullDateFormatter.format(role.createdAt)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
