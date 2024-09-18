import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { SidebarTrigger } from "~/components/administration/sidebar";
import { api } from "~/trpc/server";
import { DenominationAction } from "./DenominationAction";
import { DenominationTableAction } from "./DenominationTableAction";

export default async function Page() {
  const { t, i18n } = await getServerTranslations();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const denominations = await api.denomination.all();

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger />
        <Label>
          {t("settings")} - {t("denominations")}
        </Label>
        <div className="ml-auto flex items-center gap-2">
          <DenominationAction />
        </div>
      </div>
      <Separator />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("createdBy")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {denominations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {denominations.map((denom) => {
              return (
                <TableRow key={denom.id}>
                  <TableCell className="py-0">{denom.name}</TableCell>

                  <TableCell className="py-0">
                    {dateFormatter.format(new Date(denom.createdAt))}
                  </TableCell>
                  <TableCell className="py-0">{denom.createdBy.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <DenominationTableAction name={denom.name} id={denom.id} />
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
