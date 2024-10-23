import Link from "next/link";

import { getServerTranslations } from "@repo/i18n/server";
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
import { CreateRoleButton } from "./CreateRoleButton";
import { EditDeleteAction } from "./EditDeleteAction";

export default async function Page() {
  const { t, i18n } = await getServerTranslations();
  const roles = await api.role.all();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("roles")}>
        <CreateRoleButton />
      </PageHeader>

      <div className="mx-2 rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>
                {t("roles")} - {t("name")}
              </TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("users")}</TableHead>
              <TableHead>{t("policies")}</TableHead>
              <TableHead>{t("created")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => {
              return (
                <TableRow key={role.id}>
                  <TableCell>
                    <Link href={`./roles/${role.id}`}>{role.name}</Link>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>{role.users}</TableCell>
                  <TableCell>{role.policies}</TableCell>
                  <TableCell>{dateFormatter.format(role.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <EditDeleteAction
                      id={role.id}
                      name={role.name}
                      description={role.description ?? undefined}
                    />
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
