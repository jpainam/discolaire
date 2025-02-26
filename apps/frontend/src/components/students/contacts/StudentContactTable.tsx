"use client";

import { Eye, FileHeart, MoreHorizontal, Trash2 } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { EmptyState } from "~/components/EmptyState";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useRouter } from "next/navigation";
import { AvatarState } from "~/components/AvatarState";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

export function StudentContactTable({
  studentId,
  className,
}: {
  studentId: string;
  className?: string;
}) {
  const studentContactsQuery = api.student.contacts.useQuery(studentId);
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();

  const updateStudentContactMutation = api.studentContact.update.useMutation({
    onSettled: async () => {
      await utils.contact.students.invalidate();
      await utils.student.contacts.invalidate(studentId);
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"));
    },
  });
  const deleteStudentContactMutation = api.studentContact.delete.useMutation({
    onSettled: async () => {
      await utils.student.contacts.invalidate();
      await utils.contact.students.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"));
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const utils = api.useUtils();
  const canDeleteStudentContact = useCheckPermissions(
    PermissionAction.DELETE,
    "student:contact",
    {
      id: studentId,
    }
  );

  const studentContacts = studentContactsQuery.data ?? [];
  return (
    <div className={cn("m-2 rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("fullName")}</TableHead>
            <TableHead>{t("relationship")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("phone")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentContactsQuery.isPending && (
            <TableRow>
              <TableCell colSpan={6}>
                <div className="grid grid-cols-6 gap-2">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="h-8" />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          )}
          {!studentContactsQuery.isPending && studentContacts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {studentContacts.map((c, index) => {
            const contact = c.contact;
            const relationship = c.relationship;
            return (
              <TableRow key={`${contact.id}-${index}`}>
                <TableCell className="flex items-center justify-start gap-1 py-0">
                  <AvatarState pos={index} avatar={contact.avatar} />
                  <Link
                    href={`${routes.students.contacts(c.studentId)}/${contact.id}`}
                    className={cn(
                      "ml-4 justify-center space-y-1 hover:text-blue-600 hover:underline"
                    )}
                  >
                    {getFullName(contact)}
                  </Link>
                </TableCell>
                <TableCell className="py-0">{relationship?.name}</TableCell>
                <TableCell className="py-0 text-right">
                  {contact.email ?? "N/A"}
                </TableCell>
                <TableCell className="py-0 text-right">
                  {contact.phoneNumber1}{" "}
                </TableCell>
                <TableCell className="py-0">
                  {contact.userId ? (
                    <FlatBadge variant={"green"}>{t("invited")}</FlatBadge>
                  ) : (
                    <FlatBadge variant={"red"}>{t("not_invited")}</FlatBadge>
                  )}
                </TableCell>
                <TableCell className="py-0">
                  <div className="flex items-center justify-end gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <FileHeart className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end">
                        <RelationshipSelector
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(
                              `${routes.students.contacts(c.studentId)}/${c.contactId}`
                            );
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" /> {t("details")}
                        </DropdownMenuItem>
                        <DropdownInvitation email={c.contact.email} />
                        {canDeleteStudentContact && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                              onSelect={async () => {
                                const isConfirmed = await confirm({
                                  title: t("delete"),
                                  icon: (
                                    <Trash2 className="h-6 w-6 text-destructive" />
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
                              <Trash2 />
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
        </TableBody>
      </Table>
    </div>
  );
}
