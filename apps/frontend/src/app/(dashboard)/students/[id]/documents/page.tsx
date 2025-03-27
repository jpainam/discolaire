import { FileTextIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { DocumentTableAction } from "~/components/shared/DocumentTableAction";
import { StudentDocumentHeader } from "~/components/students/documents/StudentDocumentHeader";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const student = await api.student.get(id);
  const { t, i18n } = await getServerTranslations();
  if (!student.userId) {
    return <EmptyState />;
  }
  const documents = await api.document.byUserId({ ownerId: student.userId });
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <div className="flex flex-col gap-2">
      <StudentDocumentHeader userId={student.userId} />

      <div className="mx-2 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("created_at")}</TableHead>
              <TableHead>{t("created_by")}</TableHead>
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
                  <TableCell className="w-10 py-0">
                    <FileTextIcon className="h-4 w-4" />
                  </TableCell>
                  <TableCell className="py-0">{document.title}</TableCell>
                  <TableCell className="py-0">{document.description}</TableCell>
                  <TableCell className="py-0">
                    {dateFormat.format(document.createdAt)}
                  </TableCell>
                  <TableCell className="py-0">
                    {document.createdBy.name ?? t("unknown")}
                  </TableCell>
                  <TableCell className="py-0 text-right">
                    <DocumentTableAction
                      url={document.url}
                      documentId={document.id}
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
