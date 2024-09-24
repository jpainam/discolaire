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
import { SportAction } from "./SportAction";
import { SportTableAction } from "./SportTableAction";

export default async function Page() {
  const { t } = await getServerTranslations();
  const sports = await api.setting.sports();

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("settings")} - ${t("sports")}`}>
        <SportAction />
      </PageHeader>

      <div className="mx-2 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sports.length === 0 && (
              <TableRow>
                <TableCell colSpan={2}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {sports.map((sport) => {
              return (
                <TableRow key={sport.id}>
                  <TableCell className="py-0">{sport.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <SportTableAction name={sport.name} id={sport.id} />
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
