"use client";

import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, ViewIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { routes } from "../../configs/routes";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { AddStudentToParent } from "./AddStudentToParent";

export function ContactStudentSheetList({
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

  const t = useTranslations();
  const locale = useLocale();
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

  const dateFormatter = Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const canDeleteContact = useCheckPermission("contact.delete");
  const canCreateContact = useCheckPermission("contact.create");

  return (
    <div className={cn("flex flex-col gap-2 overflow-y-auto p-1", className)}>
      {contactQuery.data && canCreateContact && (
        <Button
          onClick={() => {
            openModal({
              className: "sm:max-w-xl",
              title: t("link_students"),
              description: `Ajouter des élèves à ${getFullName(contactQuery.data)}`,
              view: <AddStudentToParent contactId={contactId} />,
            });
          }}
        >
          <ExternalLink /> {t("link_students")}
        </Button>
      )}

      {contactStudentsQuery.data?.length === 0 && (
        <EmptyComponent
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
          const avatar = createAvatar(initials, {
            seed: getFullName(student),
          });

          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle>
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
                </CardTitle>
                <CardAction>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => {
                        router.push(
                          routes.students.details(studentcontact.studentId),
                        );
                      }}
                      variant={"ghost"}
                      size={"icon-xs"}
                    >
                      <ViewIcon />
                    </Button>
                    {canDeleteContact && (
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
                        size="icon-xs"
                        variant="ghost"
                      >
                        <DeleteIcon className="text-destructive" />
                        <span className="sr-only">{t("delete")}</span>
                      </Button>
                    )}
                  </div>
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label> {t("lastName")}</Label>
                  <span className="text-muted-foreground">
                    {student.lastName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label> {t("firstName")}</Label>
                  <span className="text-muted-foreground">
                    {student.firstName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Label>{t("dateOfBirth")}</Label>
                  <span className="text-muted-foreground">
                    {student.dateOfBirth &&
                      dateFormatter.format(student.dateOfBirth)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <Label> {t("classroom")}</Label>
                  <span className="text-muted-foreground">
                    {student.classroom?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Label> {t("contact")} / Parent</Label>
                  <span className="text-muted-foreground">
                    {getFullName(contact)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
