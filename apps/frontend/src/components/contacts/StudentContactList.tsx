"use client";

import { useQueryClient } from "@tanstack/react-query";
import { inferProcedureOutput } from "@trpc/server";
import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { useAlert } from "@repo/lib/hooks/use-alert";
import { useModal } from "@repo/lib/hooks/use-modal";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { EmptyState } from "@repo/ui/EmptyState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@repo/ui/pagination";
import { Separator } from "@repo/ui/separator";
import { Skeleton } from "@repo/ui/skeleton";

import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { generateStringColor } from "~/utils/colors";
import { getFullName } from "~/utils/full-name";
import { routes } from "../../configs/routes";
import { AvatarState } from "../AvatarState";
import { ScrollArea } from "../ui/scroll-area";
import { LinkStudent } from "./LinkStudent";

type StudentContactOutput = NonNullable<
  inferProcedureOutput<AppRouter["contact"]["students"]>
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
  const { openAlert } = useAlert();
  const queryClient = useQueryClient();
  const deleteStudentContactMutation = api.studentContact.delete.useMutation();
  const utils = api.useUtils();
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  if (contactStudentsQuery.isPending || contactQuery.isPending) {
    return <Skeleton className="h-full w-48" />;
  }

  return (
    <div className="p-2">
      {contactQuery.data && (
        <Button
          variant={"outline"}
          onClick={() => {
            const contact = contactQuery.data;
            if (!contact) return;
            openModal({
              className: "p-0 w-[600px]",
              title: <div className="px-4 py-2">{t("link_students")}</div>,
              view: <LinkStudent contactId={contact.id} />,
            });
          }}
        >
          <ExternalLink className="mr-1 h-3 w-3" /> {t("link_students")}
        </Button>
      )}

      {contactStudentsQuery?.data?.length === 0 && (
        <EmptyState
          title={t("no_data")}
          description={`${contactQuery?.data?.prefix} ${getFullName(contactQuery?.data)}`}
        />
      )}
      <ScrollArea className="h-[calc(100vh-15rem)]">
        {contactStudentsQuery?.data?.map(
          (studentcontact: StudentContactOutput, index) => {
            const student = studentcontact.student;
            const contact = contactQuery.data;
            const color = generateStringColor();
            return (
              <Card
                key={index}
                className="mt-1 border border-t-8"
                style={{
                  borderTopColor: color ?? "lightgray",
                }}
              >
                <CardHeader className="flex w-full flex-row items-start gap-12 border-b bg-muted/50 p-2">
                  <div className="grid gap-0.5">
                    <CardTitle className="group flex items-center">
                      <AvatarState
                        avatar={student?.avatar}
                        className="h-[60px] w-[60px]"
                        pos={getFullName(student).length}
                      />
                    </CardTitle>
                  </div>
                  <div className="ml-auto flex flex-col gap-1">
                    <Button
                      size="sm"
                      onClick={() => {
                        student &&
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
                      {student?.dateOfBirth &&
                        dateFormatter.format(new Date(student?.dateOfBirth))}
                      {!student?.dateOfBirth && "N/A"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 text-sm">
                  <ul className="grid gap-2 p-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("lastName")}
                      </span>
                      <span className="truncate">{student?.lastName}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {t("firstName")}
                      </span>
                      <span className="truncate">{student?.firstName}</span>
                    </li>
                  </ul>
                  <Separator className="my-2" />
                  <dl className="grid gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">
                        {t("classroom")}
                      </dt>
                      <dd>{student?.classroom?.shortName || ""}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">
                        {t("studentContactName")}
                      </dt>
                      <dd>{getFullName(contact)}</dd>
                    </div>
                  </dl>
                </CardContent>
                <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-2 py-1">
                  <Pagination className="ml-auto mr-0 w-auto p-0">
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          onClick={() => {
                            openAlert({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                              onConfirm: () => {
                                if (!student || !contact) {
                                  toast.error(
                                    t("student id or contact id is missing"),
                                  );
                                  return;
                                }
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
                              },
                            });
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
      </ScrollArea>
    </div>
  );
}
