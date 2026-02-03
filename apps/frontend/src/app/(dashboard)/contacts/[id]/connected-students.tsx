"use client";

import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Car,
  MoreHorizontal,
  UserCheck,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useCheckPermission } from "~/hooks/use-permission";
import { DeleteIcon, HeartIcon, UsersIcon, ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function ConnectedStudents({ contactId }: { contactId: string }) {
  const trpc = useTRPC();

  const { data: studentContacts, isPending } = useQuery(
    trpc.contact.students.queryOptions(contactId),
  );
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const canUpdateContact = useCheckPermission("contact.update");
  const deleteStudentContactMutation = useMutation(
    trpc.studentContact.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.studentContact.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <UsersIcon className="text-primary h-4 w-4" />
          Connected Students
        </CardTitle>
        <CardAction>
          <Badge variant="secondary">
            {studentContacts?.length} {t("students")}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {isPending ? (
            <div className="grid grid-cols-1 gap-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : studentContacts?.length == 0 ? (
            <EmptyComponent
              title="Aucun élève"
              description="Commencer par lier quelques élèves"
            />
          ) : (
            studentContacts?.map((std) => {
              const student = std.student;
              const avatar = createAvatar(initials, {
                seed: getFullName(student),
              });
              return (
                <div key={student.id} className="flex flex-col gap-2">
                  <Item className="p-0">
                    <ItemMedia>
                      <Avatar className="size-10">
                        <AvatarImage
                          src={
                            student.avatar
                              ? `/api/avatars/${student.avatar}`
                              : avatar.toDataUri()
                          }
                        />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="gap-2">
                      <ItemTitle>
                        <Link
                          className="hover:underline"
                          href={`/students/${student.id}`}
                        >
                          {getFullName(student)}
                        </Link>
                      </ItemTitle>
                      <ItemDescription className="flex items-center gap-2">
                        {student.classroom && (
                          <Badge variant={"outline"} size={"xs"}>
                            <Link href={`/classrooms/${student.classroom.id}`}>
                              {student.classroom.name}
                            </Link>
                          </Badge>
                        )}
                        {std.relationship && (
                          <Badge
                            variant="secondary"
                            size={"xs"}
                            appearance={"light"}
                            //className={relationshipColors[student.relationship]}
                          >
                            {std.relationship.name}
                          </Badge>
                        )}

                        {std.primaryContact && (
                          <Badge
                            variant="success"
                            appearance={"light"}
                            size={"xs"}
                          >
                            <UserCheck className="h-3 w-3" />
                            Primary Contact
                          </Badge>
                        )}

                        {std.schoolPickup && (
                          <Badge
                            size={"xs"}
                            appearance={"light"}
                            variant="info"
                          >
                            <Car className="h-3 w-3" />
                            Pickup Authorized
                          </Badge>
                        )}

                        {std.emergencyContact && (
                          <Badge
                            size={"xs"}
                            variant="warning"
                            appearance={"light"}
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Emergency Contact
                          </Badge>
                        )}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <ViewIcon />
                            {t("details")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <HeartIcon />
                            {t("relationship")}
                          </DropdownMenuItem>

                          {canUpdateContact && (
                            <>
                              {" "}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onSelect={async () => {
                                  const isConfirmed = await confirm({
                                    title: t("delete"),
                                    description: t("delete_confirmation"),
                                  });
                                  if (isConfirmed) {
                                    toast.loading(t("Processing"), { id: 0 });
                                    deleteStudentContactMutation.mutate({
                                      studentId: std.studentId,
                                      contactId: std.contactId,
                                    });
                                  }
                                }}
                                className="text-destructive"
                              >
                                <DeleteIcon />
                                {t("delete")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </ItemActions>
                  </Item>
                  <Separator />
                </div>
              );
            })
          )}
        </div>

        <Button variant="outline" className="mt-4 w-full gap-2 bg-transparent">
          <Users className="h-4 w-4" />
          Link Another Student
        </Button>
      </CardContent>
    </Card>
  );
}
