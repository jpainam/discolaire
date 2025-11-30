"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import {
  ImageMinus,
  ImageUpIcon,
  KeyRound,
  MoreVertical,
  Pencil,
  PlusIcon,
  Printer,
  Trash2,
  UserIcon,
  UserPlus2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { breadcrumbAtom } from "~/lib/atoms";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { SimpleTooltip } from "../simple-tooltip";
import { ChangeAvatarButton } from "../users/ChangeAvatarButton";
import { CreateEditUser } from "../users/CreateEditUser";
import CreateEditContact from "./CreateEditContact";
import { LinkStudent } from "./LinkStudent";

export function ContactDetailsHeader() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const { data: contact } = useSuspenseQuery(
    trpc.contact.get.queryOptions(params.id),
  );

  const router = useRouter();
  const confirm = useConfirm();
  const queryClient = useQueryClient();

  const deleteContactMutation = useMutation(
    trpc.contact.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.contact.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(routes.contacts.index);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const canDeleteContact = useCheckPermission(
    "contact",
    PermissionAction.DELETE,
  );

  const t = useTranslations();
  const { openSheet } = useSheet();
  const { openModal } = useModal();

  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("contacts"), url: "/contacts" },
      { name: getFullName(contact), url: `/contacts/${contact.id}` },
    ];
    setBreadcrumbs(breads);
  }, [contact, setBreadcrumbs, t]);

  const canUpdateContact = useCheckPermission(
    "contact",
    PermissionAction.UPDATE,
  );
  const canCreateContact = useCheckPermission(
    "contact",
    PermissionAction.CREATE,
  );

  const handleDeleteAvatar = async (userId: string) => {
    toast.loading(t("deleting"), { id: 0 });
    const response = await fetch("/api/upload/avatars", {
      method: "DELETE",
      body: JSON.stringify({
        userId: userId,
      }),
    });
    if (response.ok) {
      toast.success(t("deleted_successfully"), {
        id: 0,
      });
      await queryClient.invalidateQueries(trpc.contact.get.pathFilter());
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { error } = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      toast.error(error ?? response.statusText, { id: 0 });
    }
  };

  return (
    <div className="flex flex-row items-start gap-2">
      <AvatarState
        pos={contact.lastName?.length}
        avatar={contact.user?.avatar}
        className="h-auto w-[100px]"
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          {canUpdateContact && (
            <Button
              onClick={() => {
                openSheet({
                  title: (
                    <>
                      {t("edit")} - {contact.lastName ?? contact.firstName}
                    </>
                  ),

                  view: <CreateEditContact contact={contact} />,
                });
              }}
              variant={"outline"}
              size={"icon"}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {contact.userId && (
            <SimpleTooltip content={t("user")}>
              <Button
                onClick={() => {
                  router.push(`/users/${contact.userId}`);
                }}
                size={"icon"}
                aria-label="User"
                variant="outline"
              >
                <UserIcon className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
          )}
          <Button variant={"outline"} size={"icon"}>
            <Printer />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />
              <DropdownMenuSeparator />
              {!contact.userId && canCreateContact && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("create_a_user"),
                      view: (
                        <CreateEditUser entityId={contact.id} type="contact" />
                      ),
                    });
                  }}
                >
                  <UserPlus2 />
                  {t("create_a_user")}
                </DropdownMenuItem>
              )}
              {contact.userId && (
                <DropdownMenuItem
                  onSelect={() => {
                    if (!contact.userId) return;
                    openModal({
                      title: t("change_password"),
                      view: (
                        <CreateEditUser
                          userId={contact.userId}
                          email={contact.user?.email}
                          type="contact"
                          entityId={contact.id}
                          username={contact.user?.username}
                        />
                      ),
                    });
                  }}
                >
                  <KeyRound />
                  {t("change_password")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />

              <DropdownInvitation
                entityType="contact"
                entityId={contact.id}
                email={contact.user?.email}
              />

              {canDeleteContact && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                        icon: <Trash2 className="text-destructive" />,
                        alertDialogTitle: {
                          className: "flex items-center gap-1",
                        },
                      });
                      if (isConfirmed) {
                        toast.loading(t("deleting"), { id: 0 });
                        deleteContactMutation.mutate(contact.id);
                      }
                    }}
                    variant="destructive"
                    className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                  >
                    <Trash2 />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid flex-row gap-2 md:flex">
          {contact.user?.avatar ? (
            <Button
              onClick={() => {
                if (!contact.userId) return;
                void handleDeleteAvatar(contact.userId);
              }}
              variant={"outline"}
              size={"sm"}
            >
              <ImageMinus />
              {t("Remove avatar")}
            </Button>
          ) : (
            <>
              {contact.userId ? (
                <ChangeAvatarButton userId={contact.userId}>
                  <Button variant={"outline"} size={"sm"}>
                    <ImageUpIcon />
                    {t("change_avatar")}
                  </Button>
                </ChangeAvatarButton>
              ) : null}
            </>
          )}

          {canCreateContact && (
            <Button
              onClick={() => {
                openModal({
                  className: "p-0 w-[600px]",
                  title: <p className="px-4 pt-2">{t("link_students")}</p>,
                  view: <LinkStudent contactId={contact.id} />,
                });
              }}
              size={"sm"}
            >
              <PlusIcon />
              {t("link_students")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
