import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { EmptyState } from "~/components/EmptyState";
import { routes } from "~/configs/routes";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const teachings = await caller.staff.teachings(params.id);
  const { t } = await getServerTranslations();
  if (teachings.length === 0) {
    return <EmptyState className="py-8" title={t("no_teachings_found")} />;
  }

  return (
    <div className="m-2 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-10"></TableHead>
            <TableHead>{t("classroom")}</TableHead>
            <TableHead>{t("course")}</TableHead>
            <TableHead>{t("coefficient")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachings.map((teaching, index) => {
            return (
              <TableRow key={teaching.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <Link
                    className="text-blue-600 underline"
                    href={routes.classrooms.details(teaching.classroom.id)}
                  >
                    {teaching.classroom.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={routes.classrooms.subjects(teaching.classroom.id)}
                  >
                    {teaching.course.name}
                  </Link>
                </TableCell>
                <TableCell>{teaching.coefficient}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
