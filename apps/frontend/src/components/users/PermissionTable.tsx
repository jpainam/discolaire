"use client";
import { Switch } from "@repo/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { permissions } from "~/configs/permissions";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";

// interface PermissionTableProps {
//   permissions: {
//     name: string;
//     action: PermissionAction;
//     conditions: string[];
//   };
//   userId: string;
// }
export function PermissionTable({ userId }: { userId: string }) {
  const { t } = useLocale();
  const permissionMutation = api.user.updatePermission.useMutation({
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });
  const debounced = useDebouncedCallback(
    (permission: string, action: string, checked: boolean) => {
      permissionMutation.mutate({
        userId: userId,
        permission: permission,
        action: action,
        allow: checked,
      });
    },
    2000,
  );
  return (
    <div className="bg-background overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/50">
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("read")}</TableHead>
            <TableHead>{t("edit")}</TableHead>
            <TableHead>{t("create")}</TableHead>
            <TableHead>{t("delete")}</TableHead>
            {/* <TableHead>{t("conditions")}</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((perm, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{t(perm.title)}</TableCell>
              <TableCell>
                <Switch
                  onCheckedChange={(checked) => {
                    debounced(perm.permission, "Read", checked);
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch
                  onCheckedChange={(checked) => {
                    debounced(perm.permission, "Read", checked);
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch
                  onCheckedChange={(checked) => {
                    debounced(perm.permission, "Read", checked);
                  }}
                />
              </TableCell>
              <TableCell>
                <Switch />
              </TableCell>
              {/* <TableCell>
                <Textarea rows={2}></Textarea>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
