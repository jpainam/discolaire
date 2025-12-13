"use client";

import { useState } from "react";
import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MoreHorizontal,
  Pencil,
  ReceiptText,
  Search,
  Trash2,
  UserCircle,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { EmptyComponent } from "../EmptyComponent";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { UserLink } from "../UserLink";
import CreateEditContact from "./CreateEditContact";
import StudentContactList from "./StudentContactList";

export function ContactTable() {
  const t = useTranslations();

  const [queryText, setQueryText] = useState<string>("");
  const debounced = useDebouncedCallback((value: string) => {
    void setQueryText(value);
  }, 300);

  const trpc = useTRPC();

  const { data: contacts, isPending } = useQuery(
    trpc.contact.all.queryOptions({
      query: queryText,
      limit: 20,
    }),
  );

  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const canDeleteContact = useCheckPermission(
    "contact",
    PermissionAction.DELETE,
  );
  const canUpdateContact = useCheckPermission(
    "contact",
    PermissionAction.UPDATE,
  );
  const deleteContactMutation = useMutation(
    trpc.contact.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );
  const router = useRouter();
  const { openSheet } = useSheet();

  return (
    <div className="">
      <div className="border-border flex flex-col items-stretch gap-3 border-b p-4 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-1 items-center gap-2 sm:gap-4">
          <InputGroup className="h-8">
            <InputGroupInput
              className="w-full pl-8"
              onChange={(e) => debounced(e.target.value)}
              placeholder={t("search")}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              {contacts?.length} results
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("address")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("occupation")}</TableHead>
              <TableCell>{t("students")}</TableCell>
              <TableHead>{t("students")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`row-${index}`}>
                  {Array.from({ length: 8 }).map((_, ind) => (
                    <TableCell key={`cell-${index}-${ind}`}>
                      <Skeleton className="h-8" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <></>
            )}
            {contacts?.map((c) => {
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <UserLink
                      name={getFullName(c)}
                      id={c.id}
                      avatar={c.user?.avatar}
                      profile="contact"
                    />
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {c.address}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.phoneNumber1} / {c.phoneNumber2}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.user?.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.occupation}
                  </TableCell>
                  <TableCell>
                    <Badge variant={"secondary"} className="border-border">
                      {c.studentContacts.length} {t("students")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
                      {c.studentContacts.map((st, index) => {
                        const avatar = createAvatar(initials, {
                          seed: getFullName(st.student),
                        });
                        return (
                          <HoverCard openDelay={300} key={`hover-${index}`}>
                            <HoverCardTrigger asChild>
                              <Avatar>
                                <AvatarImage
                                  src={avatar.toDataUri()}
                                  alt={getFullName(st.student)}
                                />
                                <AvatarFallback>ST</AvatarFallback>
                              </Avatar>
                            </HoverCardTrigger>
                            <HoverCardContent className="p-0" align="end">
                              <div className="grid grid-cols-2 gap-1 p-2 text-xs">
                                <span>{t("fullName")}</span>
                                <Link
                                  className="hover:underline"
                                  href={`/students/${st.studentId}`}
                                >
                                  {getFullName(st.student)}
                                </Link>
                                <span>{t("relationship")}</span>
                                <span>{st.relationship?.name}</span>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Open menu"
                          variant="ghost"
                          size={"icon-sm"}
                        >
                          <MoreHorizontal
                            className="size-4"
                            aria-hidden="true"
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            router.push(`/contacts/${c.id}`);
                          }}
                        >
                          <ReceiptText />
                          {t("details")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            openSheet({
                              title: t("students"),
                              view: <StudentContactList contactId={c.id} />,
                            });
                          }}
                        >
                          <Users />
                          <span className="text-sm">{t("students")}</span>
                        </DropdownMenuItem>
                        {canUpdateContact && (
                          <DropdownMenuItem
                            onSelect={() => {
                              openSheet({
                                placement: "right",
                                view: <CreateEditContact contact={c} />,
                              });
                            }}
                          >
                            <Pencil />
                            {t("edit")}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownInvitation
                          entityId={c.id}
                          entityType="contact"
                          email={c.user?.email}
                        />

                        {canDeleteContact && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              disabled={deleteContactMutation.isPending}
                              variant="destructive"
                              onSelect={async () => {
                                const isConfirmed = await confirm({
                                  title: t("delete"),
                                  description: t("delete_confirmation"),
                                });
                                if (isConfirmed) {
                                  toast.loading(t("deleting"), { id: 0 });
                                  deleteContactMutation.mutate(c.id);
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
                  </TableCell>
                </TableRow>
              );
            })}

            {contacts?.length == 0 && !isPending && (
              <TableRow>
                <TableCell colSpan={8}>
                  <EmptyComponent icon={<UserCircle />} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
