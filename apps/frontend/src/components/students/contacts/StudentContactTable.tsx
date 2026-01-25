"use client";

import Link from "next/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  FileHeart,
  HeartIcon,
  MoreHorizontal,
  Phone,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AvatarState } from "~/components/AvatarState";
import { Pill, PillIcon } from "~/components/pill";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UserLink } from "~/components/UserLink";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { ContactIcon, DeleteIcon, ViewIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { StudentContactDetails } from "./StudentContactDetails";

export function StudentContactTable({
  studentId,
  className,
  tableClassName,
}: {
  studentId: string;
  className?: string;
  tableClassName?: string;
}) {
  const t = useTranslations();
  const confirm = useConfirm();
  const router = useRouter();
  const trpc = useTRPC();
  const { data: studentContacts } = useSuspenseQuery(
    trpc.student.contacts.queryOptions(studentId),
  );

  const { data: siblings } = useSuspenseQuery(
    trpc.student.siblings.queryOptions(studentId),
  );

  const queryClient = useQueryClient();

  const updateStudentContactMutation = useMutation(
    trpc.studentContact.update.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: () => {
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );
  const deleteStudentContactMutation = useMutation(
    trpc.studentContact.delete.mutationOptions({
      onSettled: async () => {
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
      },
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const canUpdateStudentContact = useCheckPermission("contact.update");
  const canDeleteStudentContact = useCheckPermission("contact.delete");
  const { openSheet } = useSheet();

  if (studentContacts.length == 0) {
    return (
      <div className="text-muted-foreground flex items-center gap-2 px-2 text-xs">
        Aucun parents,{" "}
        <Button
          onClick={() => {
            router.push(`/students/${studentId}/contacts`);
          }}
          variant={"link"}
          size={"sm"}
        >
          cliquez ici pour ajouter.
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className={cn("bg-background overflow-hidden", tableClassName)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead></TableHead>
              {/* <TableHead>{t("email")}</TableHead> */}
              {/* <TableHead>{t("phone")}</TableHead> */}

              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {studentContactsQuery.isPending && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <Skeleton key={index} className="h-8" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )} */}
            {/* {!studentContactsQuery.isPending &&
              studentContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              )} */}
            {studentContacts.map((c, index) => {
              const contact = c.contact;
              const relationship = c.relationship;
              return (
                <TableRow key={`${contact.id}-${index}`}>
                  <TableCell className="flex items-center justify-start gap-1">
                    <UserLink
                      id={contact.id}
                      profile="contact"
                      avatar={contact.avatar}
                      name={getFullName(contact)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="grid items-center gap-2 xl:flex">
                      <Pill>
                        <PillIcon className="text-red-500" icon={HeartIcon} />
                        {relationship?.name}
                      </Pill>
                      <Pill>
                        <PillIcon className="text-blue-500" icon={Phone} />
                        {contact.phoneNumber1}
                      </Pill>
                      <Badge variant="outline" className="gap-1.5">
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            contact.user ? "bg-emerald-500" : "bg-red-500",
                          )}
                          aria-hidden="true"
                        ></span>
                        {!contact.userId ? t("not_invited") : t("invited")}
                      </Badge>
                    </div>
                  </TableCell>
                  {/* <TableCell>{contact.email ?? "N/A"}</TableCell> */}
                  {/* <TableCell>{contact.phoneNumber1} </TableCell> */}

                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {canUpdateStudentContact && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="size-7"
                              variant={"ghost"}
                              size={"icon"}
                            >
                              <FileHeart className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent align="end">
                            <RelationshipSelector
                              className="w-full"
                              defaultValue={
                                c.relationshipId?.toString() ?? undefined
                              }
                              onChange={(v) => {
                                toast.loading(t("updating"), { id: 0 });
                                updateStudentContactMutation.mutate({
                                  studentId: c.studentId,
                                  contactId: c.contactId,
                                  data: {
                                    relationshipId: Number(v),
                                  },
                                });
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant={"ghost"} size={"icon"}>
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              openSheet({
                                view: (
                                  <StudentContactDetails
                                    studentId={c.studentId}
                                    contactId={c.contactId}
                                    studentContact={c}
                                  />
                                ),
                              });
                            }}
                          >
                            <ViewIcon />
                            {t("details")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              router.push(
                                `${routes.students.contacts(c.studentId)}/${c.contactId}`,
                              );
                            }}
                          >
                            <FileHeart className="h-4 w-4" />
                            {t("Open relationship")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              router.push(`/contacts/${c.contactId}`);
                            }}
                          >
                            <ContactIcon />
                            {t("Open contact")}
                          </DropdownMenuItem>
                          <DropdownInvitation
                            entityId={c.contact.id}
                            entityType="contact"
                            email={c.contact.user?.email}
                          />
                          {canDeleteStudentContact && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={async () => {
                                  const isConfirmed = await confirm({
                                    title: t("delete"),
                                    icon: (
                                      <Trash2 className="text-destructive" />
                                    ),
                                    alertDialogTitle: {
                                      className: "flex items-center gap-2",
                                    },
                                    description: t("delete_confirmation", {
                                      name: getFullName(contact),
                                    }),
                                  });
                                  if (isConfirmed) {
                                    toast.loading(t("deleting"), { id: 0 });
                                    deleteStudentContactMutation.mutate({
                                      studentId: c.studentId,
                                      contactId: c.contactId,
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
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {siblings.map((s, index) => {
              return (
                <TableRow key={`${index}-siblings`}>
                  <TableCell className="flex items-center justify-start gap-1">
                    <AvatarState
                      pos={getFullName(s).length}
                      avatar={s.avatar}
                    />
                    <Link href={`/students/${s.id}`}>{getFullName(s)}</Link>
                  </TableCell>
                  <TableCell>{t("siblings")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
