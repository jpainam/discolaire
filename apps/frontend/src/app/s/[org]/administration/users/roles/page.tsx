import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

import { Label } from "@repo/ui/components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { CreateRoleButton } from "./CreateRoleButton";
import { EditDeleteAction } from "./EditDeleteAction";

export default async function Page() {
  const { t, i18n } = await getServerTranslations();
  const roles = await caller.role.all();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-row items-center justify-between">
        <Label>{t("roles")}</Label>
        <CreateRoleButton />
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
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
                    <Link
                      className="flex flex-row items-center gap-1 text-blue-500 underline"
                      href={`./roles/${role.id}`}
                    >
                      {role.name}
                      <ExternalLinkIcon className="h-4 w-4" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.users}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {role.policies}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(role.createdAt)}
                  </TableCell>
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
