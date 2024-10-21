"use client";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/hooks/use-locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

export function DirectoryTable({
  directories,
}: {
  directories: RouterOutputs["directory"]["all"];
}) {
  const { t } = useLocale();
  console.log(directories);
  return (
    <div className="mx-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("lastName")}</TableHead>
            <TableHead>{t("firstName")}</TableHead>
            <TableHead>{t("phone")} 1</TableHead>
            <TableHead>{t("phone")} 2</TableHead>
            <TableHead>{t("email")} </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {directories.map((directory, index) => {
            return (
              <TableRow key={`${index}-repertory`}>
                <TableCell className="py-0">{directory.lastName}</TableCell>
                <TableCell className="py-0">{directory.firstName}</TableCell>
                <TableCell className="py-0">{directory.phoneNumber1}</TableCell>
                <TableCell className="py-0">{directory.phoneNumber2}</TableCell>
                <TableCell className="py-0">{directory.email}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
