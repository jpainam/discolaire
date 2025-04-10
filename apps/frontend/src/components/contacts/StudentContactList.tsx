"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { routes } from "../../configs/routes";
import { AvatarState } from "../AvatarState";
import { LinkStudent } from "./LinkStudent";

type StudentContactOutput = NonNullable<
  RouterOutputs["contact"]["students"]
>[number];

export default function StudentContactList({
  contactId,
}: {
  contactId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const contactStudentsQuery = useQuery(
    trpc.contact.students.queryOptions(contactId),
  );
  const contactQuery = useQuery(trpc.contact.get.queryOptions(contactId));

  const { openModal } = useModal();
  const { t, i18n } = useLocale();
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

  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const canDeleteContact = useCheckPermission(
    "contact",
    PermissionAction.DELETE,
  );
  const canCreateContact = useCheckPermission(
    "contact",
    PermissionAction.CREATE,
  );

  return (
    <div className="overflow-y-auto px-4 text-sm gap-2 flex flex-col">
      {contactQuery.data && canCreateContact && (
        <Button
          className="w-fit"
          size={"sm"}
          onClick={() => {
            const contact = contactQuery.data;

            openModal({
              className: "p-0 w-[600px]",
              title: <div className="px-4 pt-2">{t("link_students")}</div>,
              view: <LinkStudent contactId={contact.id} />,
            });
          }}
        >
          <ExternalLink /> {t("link_students")}
        </Button>
      )}

      {contactStudentsQuery.data?.length === 0 && (
        <EmptyState
          title={t("no_data")}
          description={`${contactQuery.data?.prefix} ${getFullName(contactQuery.data)}`}
        />
      )}
      <div className="flex flex-col gap-2">
        {contactStudentsQuery.data?.map(
          (studentcontact: StudentContactOutput, index) => {
            const student = studentcontact.student;
            const contact = contactQuery.data;

            return (
              <Card key={index} className="p-0 gap-0">
                <CardHeader className="border-b gap-0 bg-muted/50 p-2">
                  <CardTitle>
                    <AvatarState
                      avatar={student.user?.avatar}
                      className="h-[60px] w-[60px]"
                      pos={getFullName(student).length}
                    />
                  </CardTitle>
                  <CardAction className="gap-2 flex flex-col">
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push(
                          routes.students.details(studentcontact.studentId),
                        );
                      }}
                      variant="outline"
                    >
                      <ExternalLink />

                      {t("profile")}
                    </Button>
                    <div className="text-xs text-muted-foreground">
                      {t("bornOn")}:{" "}
                      {student.dateOfBirth &&
                        dateFormatter.format(student.dateOfBirth)}
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent className="p-2 text-sm">
                  <ul className="grid gap-2 ">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("lastName")}
                      </span>
                      <span className="truncate">{student.lastName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("firstName")}
                      </span>
                      <span className="truncate">{student.firstName}</span>
                    </li>

                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("classroom")}
                      </span>
                      <span>{student.classroom?.name ?? ""}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("studentContactName")}
                      </span>
                      <span>{getFullName(contact)}</span>
                    </li>
                  </ul>
                </CardContent>
                {canDeleteContact && (
                  <CardFooter className="border-t gap-0 flex flex-row items-center mb-3 justify-end">
                    <Button
                      onClick={async () => {
                        if (!contact?.id) {
                          return;
                        }
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
                      size="icon"
                      className="sisze-8"
                      variant="outline"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">{t("delete")}</span>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            );
          },
        )}
      </div>
    </div>
  );
}
