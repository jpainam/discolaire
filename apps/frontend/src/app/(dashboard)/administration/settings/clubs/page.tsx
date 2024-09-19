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
import { ClubAction } from "./ClubAction";
import { ClubTableAction } from "./ClubTableAction";

export default async function Page() {
  const { t } = await getServerTranslations();
  const clubs = await api.setting.clubs();

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-row items-center gap-2">
        <SidebarTrigger />
        <Label>
          {t("settings")} - {t("clubs")} - {t("organizations")}
        </Label>
        <div className="ml-auto flex items-center gap-2">
          <ClubAction />
        </div>
      </div>
      <Separator />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubs.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {clubs.map((club) => {
              return (
                <TableRow key={club.id}>
                  <TableCell className="py-0">{club.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <ClubTableAction name={club.name} id={club.id} />
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
