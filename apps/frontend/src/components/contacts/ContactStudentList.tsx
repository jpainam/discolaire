"use client";

import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, IDCardIcon, UsersIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { Badge } from "../base-badge";
import { UpdateRegistrationNumber } from "../students/UpdateRegistrationNumber";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ContactStudentList({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: contactStudents } = useSuspenseQuery(
    trpc.contact.students.queryOptions(contactId),
  );
  const { data: contact } = useSuspenseQuery(
    trpc.contact.get.queryOptions(contactId),
  );

  const t = useTranslations();
  //const locale = useLocale();
  const router = useRouter();
  const confirm = useConfirm();

  const deleteStudentContactMutation = useMutation(
    trpc.studentContact.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  const canUpdateStudent = useCheckPermission("student.update");

  const canDeleteContact = useCheckPermission("contact.delete");

  return (
    <div className="px-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead className="text-center">
                {t("registrationNumber")}
              </TableHead>
              <TableHead className="text-center">{t("dateOfBirth")}</TableHead>
              <TableHead className="text-center">{t("classroom")}</TableHead>
              <TableHead></TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <EmptyComponent
                    title={"Aucun élève"}
                    description="Commencer par ajouter des élèves"
                    content=""
                    icon={<UsersIcon />}
                  />
                </TableCell>
              </TableRow>
            )}
            {contactStudents.map((studentcontact) => {
              const student = studentcontact.student;
              const avatar = createAvatar(initials, {
                seed: getFullName(student),
              });
              return (
                <TableRow key={student.id}>
                  <TableCell>
                    <Link
                      href={`/students/${student.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            student.avatar
                              ? `/api/avatars/${student.avatar}`
                              : avatar.toDataUri()
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      {getFullName(student)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {student.registrationNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.dateOfBirth?.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {student.classroom && (
                      <Link
                        href={`/classrooms/${student.classroom.id}`}
                        className="text-muted-foreground hover:underline"
                      >
                        {student.classroom.name}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {studentcontact.primaryContact && (
                        <Badge
                          size={"xs"}
                          variant={"success"}
                          appearance={"light"}
                        >
                          Contact primaire
                        </Badge>
                      )}
                      {studentcontact.emergencyContact && (
                        <Badge
                          size={"xs"}
                          variant={"destructive"}
                          appearance={"light"}
                        >
                          Contact d'urgence
                        </Badge>
                      )}
                      {studentcontact.schoolPickup && (
                        <Badge
                          size={"xs"}
                          variant={"info"}
                          appearance={"light"}
                        >
                          Pickup
                        </Badge>
                      )}
                    </div>
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
                            router.push(`/students/${student.id}`);
                          }}
                        >
                          <ViewIcon />
                          {t("details")}
                        </DropdownMenuItem>
                        {canUpdateStudent && (
                          <DropdownMenuItem
                            onSelect={() => {
                              openModal({
                                title: "Modifier matricule",
                                description: getFullName(student),
                                view: (
                                  <UpdateRegistrationNumber
                                    studentId={studentcontact.studentId}
                                    registrationNumber={
                                      student.registrationNumber
                                    }
                                  />
                                ),
                              });
                            }}
                          >
                            <IDCardIcon />
                            Modifier matricule
                          </DropdownMenuItem>
                        )}

                        {canDeleteContact && (
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={async () => {
                              await confirm({
                                title: t("delete"),
                                description: t("delete_confirmation"),

                                onConfirm: async () => {
                                  await deleteStudentContactMutation.mutateAsync(
                                    {
                                      studentId: studentcontact.studentId,
                                      contactId: contact.id,
                                    },
                                  );
                                },
                              });
                            }}
                          >
                            <DeleteIcon />
                            {t("delete")}
                          </DropdownMenuItem>
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
    </div>
  );
}
