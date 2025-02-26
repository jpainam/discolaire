"use client";

import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useRouter } from "next/navigation";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";

export function ContactStudentTable({ id }: { id: string }) {
  const studentContactsQuery = api.contact.students.useQuery(id);
  const utils = api.useUtils();
  const confirm = useConfirm();
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
          {studentContacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <EmptyState className="my-8" />
              </TableCell>
            </TableRow>
          )}
          {studentContacts.map((stc, index) => {
            const student = stc.student;
            return (
              <TableRow key={`${stc.contactId}-${index}`}>
                <TableCell className="py-0">
                  <AvatarState pos={index} avatar={student.avatar} />
                </TableCell>
                <TableCell className="py-0">
                  <Link
                    href={
                      routes.students.contacts(student.id ?? "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {student.lastName}
                  </Link>
                </TableCell>
                <TableCell className="py-0">
                  <Link
                    href={
                      routes.students.contacts(student.id ?? "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {student.firstName}
                  </Link>
                </TableCell>
                <TableCell className="py-0">
                  {student.classroom?.name}
                </TableCell>
                <TableCell className="py-0">{student.email}</TableCell>
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
                          if (!student.id) return;
                          router.push(
                            `${routes.students.contacts(student.id)}/${id}`
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
                        variant="destructive"
                        className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                        onSelect={async () => {
                          if (!student.id) return;

                          const isConfirmed = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                          });
                          if (isConfirmed) {
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
                              }
                            );
                          }
                        }}
                      >
                        <Trash2 />
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
