import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { api } from "~/trpc/server";
import { DocumentTableAction } from "./DocumentTableAction";
import { StaffDocumentHeader } from "./StaffDocumentHeader";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const staff = await api.staff.get(id);
  if (!staff) {
    notFound();
  }
  const { t, i18n } = await getServerTranslations();
  if (!staff.userId) {
    return (
      <EmptyState
        title={t("no_user_found")}
        description={t("create_a_user_first")}
      />
    );
  }
  const documents = await api.document.byUserId({ userId: staff.userId });
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="flex flex-col gap-2 pr-2">
      <StaffDocumentHeader userId={staff.userId} />
      <Separator />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState className="my-8" />
                </TableCell>
              </TableRow>
            )}
            {documents.map((document) => {
              return (
                <TableRow key={document.id}>
                  <TableCell>Icon</TableCell>
                  <TableCell>{document.title}</TableCell>
                  <TableCell>{document.description}</TableCell>
                  <TableCell>{dateFormat.format(document.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DocumentTableAction documentId={document.id} />
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
