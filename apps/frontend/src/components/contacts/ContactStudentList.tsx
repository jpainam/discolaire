"use client";

import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
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
import { DeleteIcon, UsersIcon, ViewIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { Badge } from "../base-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { AddStudentToParent } from "./AddStudentToParent";

export function ContactStudentList({
  contactId,
  className,
}: {
  contactId: string;
  className?: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: contactStudents } = useSuspenseQuery(
    trpc.contact.students.queryOptions(contactId),
  );
  const { data: contact } = useSuspenseQuery(
    trpc.contact.get.queryOptions(contactId),
  );

  const { openModal } = useModal();

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

  const canDeleteContact = useCheckPermission("contact.delete");
  const canCreateContact = useCheckPermission("contact.create");

  return (
    <div
      className={cn(
        "flex flex-col gap-2 overflow-y-auto px-4 py-2 text-sm",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <Label>{t("students")}</Label>
        <div className="ml-auto flex items-center gap-2">
          {canCreateContact && (
            <Button
              variant={"outline"}
              onClick={() => {
                openModal({
                  className: "sm:max-w-xl",
                  title: t("link_students"),
                  description: `Ajouter des élèves à ${getFullName(contact)}`,
                  view: <AddStudentToParent contactId={contactId} />,
                });
              }}
            >
              <UsersIcon />
              {t("link_students")}
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]"></TableHead>
              <TableHead className="text-center">
                {t("registrationNumber")}
              </TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead className="text-center">{t("dateOfBirth")}</TableHead>
              <TableHead className="text-center">{t("classroom")}</TableHead>
              <TableHead className="w-full"></TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactStudents.length === 0 && (
              <TableRow>
                <TableCell>
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
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {student.registrationNumber}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/students/${student.id}`}
                      className="hover:underline"
                    >
                      {getFullName(student)}
                    </Link>
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
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => {
                          router.push(`/students/${student.id}`);
                        }}
                        size={"icon-sm"}
                        variant={"ghost"}
                      >
                        <ViewIcon />
                      </Button>
                      {canDeleteContact && (
                        <Button
                          onClick={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });

                            if (isConfirmed) {
                              toast.loading(t("deleting"), { id: 0 });
                              deleteStudentContactMutation.mutate({
                                studentId: studentcontact.studentId,
                                contactId: contact.id,
                              });
                            }
                          }}
                          size={"icon-sm"}
                          variant={"ghost"}
                        >
                          <DeleteIcon className="text-destructive" />
                        </Button>
                      )}
                    </div>
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
