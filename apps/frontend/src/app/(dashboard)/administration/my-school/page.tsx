import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
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

import { env } from "~/env";
import { api } from "~/trpc/server";
import { SchoolTableAction } from "./SchoolTableAction";

export default async function Page() {
  const sessions = await auth();
  if (!sessions) {
    redirect("/auth/login");
  }
  const user = sessions.user;
  if (user.username != env.SUPER_ADMIN_USERNAME) {
    redirect(`/administration/my-school/${user.schoolId}`);
  }
  const schools = await api.school.all();
  const { t } = await getServerTranslations();

  return (
    <div className="m-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("authorization")}</TableHead>
            <TableHead>{t("headmaster")}</TableHead>
            <TableHead>{t("address")}</TableHead>
            <TableHead>{t("phoneNumber")}</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState className="my-8" />
              </TableCell>
            </TableRow>
          )}
          {schools.map((school) => {
            return (
              <TableRow key={school.id}>
                <TableCell>{school.name}</TableCell>
                <TableCell>{school.authorization}</TableCell>
                <TableCell>{school.headmaster}</TableCell>
                <TableCell>{school.address}</TableCell>
                <TableCell>{school.phoneNumber1}</TableCell>
                <TableCell className="text-right">
                  <SchoolTableAction schoolId={school.id} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
