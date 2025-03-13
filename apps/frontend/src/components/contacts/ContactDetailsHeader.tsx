"use client";

import {
  ImageUpIcon,
  KeyRound,
  MoreVertical,
  Pencil,
  PlusIcon,
  Printer,
  Trash2,
  UserPlus2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import type { RouterOutputs } from "@repo/api";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { AvatarState } from "~/components/AvatarState";
import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { useRouter } from "~/hooks/use-router";
import { breadcrumbAtom } from "~/lib/atoms";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { CreateEditUser } from "../users/CreateEditUser";
import CreateEditContact from "./CreateEditContact";
import { LinkStudent } from "./LinkStudent";

export function ContactDetailsHeader({
  contact,
}: {
  contact: NonNullable<RouterOutputs["contact"]["get"]>;
}) {
  const utils = api.useUtils();
  const router = useRouter();
  const confirm = useConfirm();
  const deleteContactMutation = api.contact.delete.useMutation({
    onSettled: () => utils.contact.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.push(routes.contacts.index);
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const canDeleteContact = useCheckPermissions(
    PermissionAction.DELETE,
    "contact:profile",
    {
      id: contact.id,
    }
  );
  const { t } = useLocale();
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

  return (
    <div className="flex flex-row items-start gap-2">
      <AvatarState pos={0} className="h-auto w-[100px]" />
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />
              {!contact.userId && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("attach_user"),
                      view: (
                        <CreateEditUser entityId={contact.id} type="contact" />
                      ),
                    });
                  }}
                >
                  <UserPlus2 />
                  {t("attach_user")}
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
                          type="contact"
                          entityId={contact.id}
                          username={contact.user?.username}
                        />
                      ),
                    });
                  }}
                >
                  <KeyRound className="mr-2 h-4 w-4" />
                  {t("change_password")}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />

              <DropdownInvitation
                entityType="contact"
                entityId={contact.id}
                email={contact.email}
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
          <Button className="size-8" variant={"outline"} size={"icon"}>
            <Printer />
          </Button>

          <Button variant={"outline"} size={"sm"}>
            <ImageUpIcon />
            {t("change_avatar")}
          </Button>
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
        </div>
      </div>
    </div>
  );
}
