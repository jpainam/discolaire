"use client";

import Link from "next/link";
import { Eye, FileHeart, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AvatarState } from "~/components/AvatarState";
import { DropdownInvitation } from "~/components/shared/invitations/DropdownInvitation";
import { RelationshipSelector } from "~/components/shared/selects/RelationshipSelector";
import { routes } from "~/configs/routes";
import { getErrorMessage, showErrorToast } from "~/lib/handle-error";
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

  const updateStudentContactMutation = api.studentContact.update.useMutation();
  const deleteStudentContactMutation = api.studentContact.delete.useMutation();
  const utils = api.useUtils();

  if (studentContactsQuery.isPending) {
    return (
      <DataTableSkeleton
        columnCount={6}
        rowCount={3}
        className="px-4"
        withPagination={false}
        showViewOptions={false}
      />
    );
  }
  return (
    <div className={cn("m-2 rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 font-semibold">
            <TableHead className="font-semibold">{t("fullName")}</TableHead>
            <TableHead className="font-semibold">{t("relationship")}</TableHead>
            <TableHead className="text-right font-semibold">
              {t("email")}
            </TableHead>
            <TableHead className="text-right font-semibold">
              {t("phone")}
            </TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentContactsQuery.data?.map((c, index) => {
            const contact = c.contact;
            const relationship = c.relationship;
            return (
              <TableRow key={`${contact.id}-${index}`}>
                <TableCell className="flex items-center justify-start gap-1 py-0">
                  <AvatarState pos={index} avatar={contact.avatar} />
                  <Link
                    href={`${routes.students.contacts(c.studentId)}/${contact.id}`}
                    className={cn(
                      "ml-4 justify-center space-y-1 hover:text-blue-600 hover:underline",
                    )}
                  >
                    {getFullName(contact)}
                  </Link>
                </TableCell>
                <TableCell className="py-0">{relationship?.name}</TableCell>
                <TableCell className="py-0 text-right">
                  {contact.email ? contact.email : "N/A"}
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
                            toast.promise(
                              updateStudentContactMutation.mutateAsync(
                                {
                                  studentId: c.studentId,
                                  contactId: c.contactId,
                                  data: {
                                    relationshipId: Number(v),
                                  },
                                },
                                {
                                  onSuccess: () => {
                                    void utils.contact.students.invalidate();
                                    void utils.student.contacts.invalidate(
                                      studentId,
                                    );
                                    toast.success(t("added_successfully"));
                                  },
                                  onError: (error) => {
                                    showErrorToast(error);
                                  },
                                },
                              ),
                              {
                                loading: t("updating"),
                                error: (error) => {
                                  return getErrorMessage(error);
                                },
                                success: () => {
                                  return t("updated_successfully");
                                },
                              },
                            );
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
                              `${routes.students.contacts(c.studentId)}/${c.contactId}`,
                            );
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" /> {t("details")}
                        </DropdownMenuItem>
                        <DropdownInvitation email={c.contact.email} />
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation", {
                                name: getFullName(contact),
                              }),
                            });
                            if (isConfirmed) {
                              toast.promise(
                                deleteStudentContactMutation.mutateAsync({
                                  studentId: c.studentId,
                                  contactId: c.contactId,
                                }),
                                {
                                  loading: t("deleting"),
                                  success: async () => {
                                    await utils.student.contacts.invalidate(
                                      studentId,
                                    );
                                    await utils.contact.students.invalidate(
                                      c.contactId,
                                    );
                                    return t("deleted_successfully");
                                  },
                                  error: (error) => {
                                    return getErrorMessage(error);
                                  },
                                },
                              );
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
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
