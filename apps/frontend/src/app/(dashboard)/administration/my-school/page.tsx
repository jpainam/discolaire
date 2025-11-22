import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { getSession } from "~/auth/server";
import { EmptyComponent } from "~/components/EmptyComponent";
import { env } from "~/env";
import { getServerTranslations } from "~/i18n/server";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";
import { SchoolTableAction } from "./SchoolTableAction";

export default async function Page() {
  const sessions = await getSession();
  if (!sessions) {
    redirect("/auth/login");
  }
  const user = sessions.user;
  if (user.username != env.SUPER_ADMIN_USERNAME) {
    redirect(`/administration/my-school/${user.schoolId}`);
  }
  const schools = await caller.school.all();
  const { t } = await getServerTranslations();
  const canUpdateSchool = await checkPermission(
    "school",
    PermissionAction.UPDATE,
  );
  const canDeleteSchool = await checkPermission(
    "school",
    PermissionAction.DELETE,
  );
  const canReadSchool = await checkPermission("school", PermissionAction.READ);

  return (
    <div className="rounded-lg border">
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
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
          {schools.map((school) => {
            return (
              <TableRow key={school.id}>
                <TableCell>
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={
                      canReadSchool
                        ? `/administration/my-school/${school.id}`
                        : "#"
                    }
                  >
                    {school.name}
                  </Link>
                </TableCell>
                <TableCell>{school.authorization}</TableCell>
                <TableCell>{school.headmaster}</TableCell>
                <TableCell>{school.address}</TableCell>
                <TableCell>{school.phoneNumber1}</TableCell>
                <TableCell className="text-right">
                  {(canDeleteSchool || canUpdateSchool) && (
                    <SchoolTableAction schoolId={school.id} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
