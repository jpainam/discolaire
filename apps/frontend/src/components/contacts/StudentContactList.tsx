"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/components/pagination";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { PermissionAction } from "~/permissions";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
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
  const contactStudentsQuery = api.contact.students.useQuery(contactId);
  const contactQuery = api.contact.get.useQuery(contactId);

  const { openModal } = useModal();
  const { t, i18n } = useLocale();
  const router = useRouter();
  const confirm = useConfirm();

  const deleteStudentContactMutation = api.studentContact.delete.useMutation();
  const utils = api.useUtils();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const canCreateContact = useCheckPermission(
    "contact",
    PermissionAction.CREATE,
  );

  return (
    <div className="overflow-y-auto px-4 text-sm gap-2 flex flex-col">
      {contactQuery.data && canCreateContact && (
        <Button
          className="w-fit"
          onClick={() => {
            const contact = contactQuery.data;
            if (!contact) return;
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
            //const color = generateStringColor();
            return (
              <Card
                key={index}
                className="gap-0 p-0 shadow-none"
                // style={{
                //   borderTopColor: color,
                // }}
              >
                <CardHeader className="flex w-full flex-row items-start gap-12 border-b bg-muted/50 p-2">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center">
                      <AvatarState
                        avatar={student.avatar}
                        className="h-[60px] w-[60px]"
                        pos={getFullName(student).length}
                      />
                    </CardTitle>
                  </div>
                  <div className="ml-auto flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push(
                          routes.students.details(studentcontact.studentId),
                        );
                      }}
                      variant="outline"
                      className="h-8 justify-start gap-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                        {t("profile")}
                      </span>
                    </Button>
                    <div className="pl-1 text-xs text-muted-foreground">
                      {t("bornOn")}:{" "}
                      {student.dateOfBirth &&
                        dateFormatter.format(student.dateOfBirth)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 text-sm">
                  <ul className="grid gap-2 p-2">
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
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-2 py-1">
                  <Pagination className="ml-auto mr-0 w-auto p-0">
                    <PaginationContent>
                      <PaginationItem>
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
                              toast.promise(
                                deleteStudentContactMutation.mutateAsync({
                                  studentId: studentcontact.studentId,
                                  contactId: contact.id,
                                }),
                                {
                                  loading: t("deleting"),
                                  success: async () => {
                                    await utils.student.contacts.invalidate();
                                    await utils.contact.students.invalidate();

                                    return t("deleted_successfully");
                                  },
                                  error: (error) => {
                                    return getErrorMessage(error);
                                  },
                                },
                              );
                            }
                          }}
                          size="icon"
                          className="w-8"
                          variant="outline"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">{t("delete")}</span>
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            );
          },
        )}
      </div>
    </div>
  );
}
