import Link from "next/link";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { EmptyComponent } from "~/components/EmptyComponent";
import { routes } from "~/configs/routes";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

type StudentContactGetProcedureOutput = RouterOutputs["studentContact"]["get"];

export async function StudentSiblingTable({
  studentContact,
}: {
  studentContact: StudentContactGetProcedureOutput;
}) {
  if (!studentContact) {
    return <EmptyComponent description="No student contact found" />;
  }
  const linkedStudents = await caller.contact.students(
    studentContact.contactId,
  );
  const contact = studentContact.contact;
  const { t } = await getServerTranslations();
  return (
    <Card className="mb-10 p-0">
      <CardHeader className="bg-muted/50 flex flex-row items-center border-b p-0 px-2 py-1">
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
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>{t("relationship")}</TableHead>
                <TableHead>{t("classroom")}</TableHead>
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
                        {decode(student.lastName ?? student.firstName ?? "")}
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
            <EmptyComponent
              description={t("noOtherStudentsLinkedToThisContact")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
