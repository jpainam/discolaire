import { checkPermissions } from "@repo/api/permission";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import FlatBadge from "~/components/FlatBadge";
import { NoPermission } from "~/components/no-permission";
import { getServerTranslations } from "~/i18n/server";
import { PermissionAction } from "~/permissions";

import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/server";
import { FinanceGroupAction } from "./FinanceGroupAction";
import { GroupTableAction } from "./GroupTableAction";

export default async function Page() {
  const canReadFinnaceGroup = await checkPermissions(
    PermissionAction.READ,
    "accounting:group"
  );
  if (!canReadFinnaceGroup) {
    return <NoPermission />;
  }
  const canCreateGroups = await checkPermissions(
    PermissionAction.CREATE,
    "accounting:group"
  );
  const canEditGroup = await checkPermissions(
    PermissionAction.UPDATE,
    "accounting:group"
  );
  const canDeleteGroups = await checkPermissions(
    PermissionAction.DELETE,
    "accounting:group"
  );

  const { t, i18n } = await getServerTranslations();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const groups = await api.accounting.groups();

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex flex-row items-center justify-between">
        <Label>
          {t("finances")} - {t("group")}
        </Label>
        {canCreateGroups && <FinanceGroupAction />}
      </div>
      <Separator />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("created_by")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {groups.map((group) => {
              return (
                <TableRow key={group.id}>
                  <TableCell className="py-0">{group.name}</TableCell>
                  <TableCell className="py-0">
                    <FlatBadge
                      variant={group.type == "AMOUNT" ? "yellow" : "blue"}
                    >
                      {group.type == "AMOUNT" ? t("amount") : t("percent")}
                    </FlatBadge>
                    <FlatBadge className="ml-2 px-2">
                      {group.value} {group.type == "AMOUNT" ? CURRENCY : "%"}
                    </FlatBadge>
                  </TableCell>
                  <TableCell className="py-0">
                    {dateFormatter.format(new Date(group.createdAt))}
                  </TableCell>
                  <TableCell className="py-0">{group.createdById}</TableCell>
                  <TableCell className="py-0 text-right">
                    {(canCreateGroups || canDeleteGroups) && (
                      <GroupTableAction
                        canEdit={canEditGroup}
                        type={group.type}
                        value={group.value}
                        name={group.name}
                        canAdd={canCreateGroups}
                        canDelete={canDeleteGroups}
                        id={group.id}
                      />
                    )}
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
