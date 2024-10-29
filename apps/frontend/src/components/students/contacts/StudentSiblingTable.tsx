import Link from "next/link";

import type { RouterOutputs } from "@repo/api";
import { getServerTranslations } from "@repo/i18n/server";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { EmptyState } from "@repo/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { routes } from "~/configs/routes";
import { api } from "~/trpc/server";
import { getFullName } from "~/utils/full-name";

type StudentContactGetProcedureOutput = RouterOutputs["studentContact"]["get"];

export async function StudentSiblingTable({
  studentContact,
}: {
  studentContact: StudentContactGetProcedureOutput;
}) {
  if (!studentContact) {
    return <EmptyState description="No student contact found" />;
  }
  const linkedStudents = await api.contact.students(studentContact.contactId);
  const contact = studentContact.contact;
  const { t } = await getServerTranslations();
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-center space-y-0 border-b bg-muted/50 px-2 py-1">
        <CardTitle className="text-md group flex items-center py-0">
          {t("studentsLinkedTo", {
            name: `${contact.prefix} ${getFullName(contact)}`,
          })}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {linkedStudents.length > 1 ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted font-semibold">
                <TableHead className="font-semibold">{t("fullName")}</TableHead>
                <TableHead className="font-semibold">
                  {t("relationship")}
                </TableHead>
                <TableHead className="font-semibold">
                  {t("classroom")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedStudents.map((linkedStd, index) => {
                const student = linkedStd.student;
                if (linkedStd.studentId === studentContact.studentId)
                  return null;
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Link
                        className="justify-center hover:text-blue-600 hover:underline"
                        href={`${routes.students.contacts(linkedStd.studentId)}/${contact.id}`}
                      >
                        {student.lastName}
                      </Link>
                    </TableCell>
                    <TableCell>{linkedStd.relationship?.name}</TableCell>
                    <TableCell>{student.classroom?.name}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-md m-4 flex flex-col items-center justify-center gap-4">
            <EmptyState
              iconClassName="w-[100px] h-auto"
              description={t("noOtherStudentsLinkedToThisContact")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
