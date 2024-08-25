"use client";

import Link from "next/link";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { EmptyState } from "@repo/ui/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useAlert } from "~/hooks/use-alert";
import { useLocale } from "~/hooks/use-locale";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { DataTableSkeleton } from "../data-table/data-table-skeleton";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";

export function ContactStudentTable({ id }: { id: string }) {
  const studentContactsQuery = api.contact.students.useQuery(id);
  const utils = api.useUtils();
  const { openAlert } = useAlert();
  const router = useRouter();
  const { t } = useLocale();
  const deleteStudentContactMutation = api.studentContact.delete.useMutation();
  if (studentContactsQuery.isPending) {
    return (
      <DataTableSkeleton
        withPagination={false}
        showViewOptions={false}
        rowCount={3}
        columnCount={4}
      />
    );
  }
  const studentContacts = studentContactsQuery.data;
  if (!studentContacts) {
    return <EmptyState className="m-8" />;
  }
  return (
    <div className="h-fit flex-col gap-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead></TableHead>
            <TableHead>{t("lastName")}</TableHead>
            <TableHead>{t("firstName")}</TableHead>
            <TableHead>{t("classroom")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentContacts.map((stc, index) => {
            const student = stc?.student;
            return (
              <TableRow key={`${stc.contactId}-${index}`}>
                <TableCell className="py-0">
                  <AvatarState pos={index} avatar={student?.avatar} />
                </TableCell>
                <TableCell className="py-0">
                  <Link
                    href={
                      routes.students.contacts(student?.id || "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {student?.lastName}
                  </Link>
                </TableCell>
                <TableCell className="py-0">
                  <Link
                    href={
                      routes.students.contacts(student?.id || "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {student?.firstName}
                  </Link>
                </TableCell>
                <TableCell className="py-0">
                  {student?.classroom?.shortName}
                </TableCell>
                <TableCell className="py-0">{student?.email}</TableCell>
                <TableCell className="py-0 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon"} variant={"ghost"}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => {
                          if (!student?.id) return;
                          router.push(
                            `${routes.students.contacts(student.id)}/${id}`,
                          );
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {t("details")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownInvitation email={student.email} />
                      <DropdownMenuSeparator />
                      <DropdownHelp />
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={() => {
                          openAlert({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            onConfirm: () => {
                              if (!student.id) return;
                              toast.promise(
                                deleteStudentContactMutation.mutateAsync({
                                  contactId: stc.contactId,
                                  studentId: student.id,
                                }),
                                {
                                  success: async () => {
                                    await utils.contact.students.invalidate();
                                    await utils.student.contacts.invalidate();
                                    return t("delete_successfully");
                                  },
                                  error: (error) => {
                                    return getErrorMessage(error);
                                  },
                                },
                              );
                            },
                          });
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
