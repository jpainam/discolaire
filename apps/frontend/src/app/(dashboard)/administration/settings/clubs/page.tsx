import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/server";
import { PageHeader } from "../../PageHeader";
import { ClubAction } from "./ClubAction";
import { ClubTableAction } from "./ClubTableAction";

export default async function Page() {
  const { t } = await getServerTranslations();
  const clubs = await api.setting.clubs();

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("settings")} - ${t("clubs")}`}>
        <ClubAction />
      </PageHeader>
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
