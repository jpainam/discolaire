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
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import type { RouterOutputs } from "@repo/api";
import { decode } from "entities";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { api } from "~/trpc/react";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";

export function ContactStudentTable({
  studentContacts,
}: {
  studentContacts: RouterOutputs["contact"]["students"];
}) {
  const utils = api.useUtils();
  const confirm = useConfirm();
  const router = useRouter();
  const { t } = useLocale();
  const canUpdateContact = useCheckPermission(
    "contact",
    PermissionAction.UPDATE,
  );
  const deleteStudentContactMutation = api.studentContact.delete.useMutation({
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSettled: async () => {
      await utils.contact.students.invalidate();
      await utils.student.contacts.invalidate();
    },
    onSuccess: () => {
      toast.success(t("delete_successfully"), { id: 0 });
      router.refresh();
    },
  });

  if (studentContacts.length == 0) {
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
                <TableCell>
                  <AvatarState pos={index} avatar={student.avatar} />
                </TableCell>
                <TableCell>
                  <Link
                    href={
                      routes.students.contacts(student.id ?? "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {decode(student.lastName ?? "")}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={
                      routes.students.contacts(student.id ?? "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {decode(student.firstName ?? "")}
                  </Link>
                </TableCell>
                <TableCell>{student.classroom?.name}</TableCell>

                <TableCell className=" text-right">
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
                            `${routes.students.contacts(student.id)}/${stc.contactId}`,
                          );
                        }}
                      >
                        <Eye />
                        {t("details")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      {student.id && (
                        <DropdownInvitation
                          entityId={student.id}
                          entityType={"student"}
                          email={student.email}
                        />
                      )}

                      <DropdownMenuSeparator />
                      <DropdownHelp />
                      {canUpdateContact && (
                        <>
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
                                toast.loading(t("deleting"), { id: 0 });

                                deleteStudentContactMutation.mutate({
                                  contactId: stc.contactId,
                                  studentId: student.id,
                                });
                              }
                            }}
                          >
                            <Trash2 />
                            {t("delete")}
                          </DropdownMenuItem>
                        </>
                      )}
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
