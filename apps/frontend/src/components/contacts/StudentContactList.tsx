"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import { cn } from "@repo/ui/lib/utils";

import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { routes } from "../../configs/routes";
import { AvatarState } from "../AvatarState";
import { LinkStudent } from "./LinkStudent";

export default function StudentContactList({
  contactId,
  className,
}: {
  contactId: string;
  className?: string;
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
    <div
      className={cn(
        "flex flex-col gap-2 overflow-y-auto px-4 text-sm",
        className,
      )}
    >
      {contactQuery.data && canCreateContact && (
        <Button
          className="w-fit"
          size={"sm"}
          onClick={() => {
            openModal({
              className: "p-0 w-[600px]",
              title: <div className="px-4 pt-2">{t("link_students")}</div>,
              view: <LinkStudent contactId={contactId} />,
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
      {(contactQuery.isPending || contactStudentsQuery.isPending) && (
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {contactStudentsQuery.data?.map((studentcontact, index) => {
          const student = studentcontact.student;
          const contact = contactQuery.data;

          return (
            <Card key={index} className="gap-0 p-0">
              <CardHeader className="bg-muted/50 gap-0 border-b p-2">
                <CardTitle>
                  <AvatarState
                    avatar={student.user?.avatar}
                    className="h-[60px] w-[60px]"
                    pos={getFullName(student).length}
                  />
                </CardTitle>
                <CardAction className="flex flex-col gap-2">
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
                  <div className="text-muted-foreground text-xs">
                    {t("bornOn")}:{" "}
                    {student.dateOfBirth &&
                      dateFormatter.format(student.dateOfBirth)}
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent className="p-2 text-sm">
                <ul className="grid gap-2">
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
                <CardFooter className="mb-3 flex flex-row items-center justify-end gap-0 border-t">
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
                    <Trash2 className="text-destructive h-4 w-4" />
                    <span className="sr-only">{t("delete")}</span>
                  </Button>
                </CardFooter>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
