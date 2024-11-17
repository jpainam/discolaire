import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import { Label } from "@repo/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/server";
import { StaffLevelAction } from "./StaffLevelAction";
import { StaffLevelTableAction } from "./StaffLevelTableAction";

export default async function Page() {
  const { t } = await getServerTranslations();
  const degrees = await api.degree.all();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Label>{`${t("settings")} - ${t("staff_level")}`}</Label>
        <StaffLevelAction />
      </div>
      <div className="mx-2 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {degrees.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {degrees.map((degree) => {
              return (
                <TableRow key={degree.id}>
                  <TableCell className="py-0">{degree.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <StaffLevelTableAction name={degree.name} id={degree.id} />
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
