"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { decode } from "entities";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AvatarState } from "~/components/AvatarState";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";

export function ContactStudentTable() {
  const confirm = useConfirm();

  const t = useTranslations();
  const canUpdateContact = useCheckPermission("contact.update");
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: studentContacts } = useSuspenseQuery(
    trpc.contact.students.queryOptions(params.id),
  );
  const queryClient = useQueryClient();
  const deleteStudentContactMutation = useMutation(
    trpc.studentContact.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const router = useRouter();

  if (studentContacts.length == 0) {
    return <EmptyComponent />;
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
                <EmptyComponent />
              </TableCell>
            </TableRow>
          )}
          {studentContacts.map((stc, index) => {
            const student = stc.student;
            return (
              <TableRow key={`${stc.contactId}-${index}`}>
                <TableCell className="w-[50px]">
                  <AvatarState pos={index} avatar={student.avatar} />
                </TableCell>
                <TableCell>
                  <Link
                    className="hover:underline"
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
                    className="text-muted-foreground hover:underline"
                    href={
                      routes.students.contacts(student.id ?? "") +
                      "/" +
                      stc.contactId
                    }
                  >
                    {decode(student.firstName ?? "")}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {student.classroom?.name}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon"} variant={"ghost"}>
                        <MoreHorizontal />
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
                        <ViewIcon />
                        {t("details")}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      {student.id && (
                        <DropdownInvitation
                          entityId={student.id}
                          entityType={"student"}
                          email={student.user?.email}
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
                            <DeleteIcon />
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
