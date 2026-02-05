"use client";

import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { AddTeamIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { KeyRound, MoreVertical, UserPlus2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { DeleteIcon, EditIcon, PrinterIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { DropdownHelp } from "../shared/DropdownHelp";
import { DropdownInvitation } from "../shared/invitations/DropdownInvitation";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { CreateEditUser } from "../users/CreateEditUser";
import { AddStudentToParent } from "./AddStudentToParent";

export function ContactDetails({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const { data: contact } = useSuspenseQuery(
    trpc.contact.get.queryOptions(contactId),
  );

  const t = useTranslations();
  const { openModal } = useModal();
  const avatar = createAvatar(initials, { seed: getFullName(contact) });
  const canCreateContact = useCheckPermission("contact.create");
  const canDeleteContact = useCheckPermission("contact.delete");
  const canUpdateContact = useCheckPermission("contact.update");
  const router = useRouter();

  const deleteContactMutation = useMutation(
    trpc.contact.delete.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        router.push(`/contacts`);
      },
    }),
  );
  const confirm = useConfirm();
  return (
    <div className="flex items-center gap-2 px-4 pt-2 text-sm">
      <Avatar className="size-20">
        <AvatarImage
          src={
            contact.avatar
              ? `/api/avatars/${contact.avatar}`
              : avatar.toDataUri()
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <span className="font-medium">{getFullName(contact)}</span>
        <div className="flex items-center gap-1">
          {canUpdateContact && (
            <Button variant={"outline"} size={"icon"}>
              <EditIcon />
            </Button>
          )}
          <Button
            onClick={() => {
              window.open(`/api/pdfs/contacts/${contact.id}`, "_blank");
            }}
            variant={"outline"}
            size={"icon"}
          >
            <PrinterIcon />
          </Button>
          {canCreateContact && (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => {
                openModal({
                  className: "sm:max-w-xl",
                  title: t("link_students"),
                  description: `Ajouter des élèves à ${getFullName(contact)}`,
                  view: <AddStudentToParent contactId={contactId} />,
                });
              }}
            >
              <HugeiconsIcon
                icon={AddTeamIcon}
                className="size-4"
                strokeWidth={2}
              />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownInvitation
                entityType="contact"
                email={contact.email}
                entityId={contact.id}
              />
              <DropdownHelp />
              {!contact.userId && (
                <DropdownMenuItem
                  onSelect={() => {
                    openModal({
                      title: t("create_a_user"),
                      className: "sm:max-w-xl",
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
                      className: "sm:max-w-xl",
                      title: t("change_password"),
                      view: (
                        <CreateEditUser
                          userId={contact.userId}
                          type="contact"
                          entityId={contact.id}
                          email={contact.email}
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

              {canDeleteContact && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                      });
                      if (isConfirmed) {
                        toast.loading(t("Processing"), { id: 0 });
                        deleteContactMutation.mutate(contact.id);
                      }
                    }}
                    variant="destructive"
                  >
                    <DeleteIcon />
                    {t("delete")}
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grid w-full grid-cols-4 gap-4">
        <ItemCell
          label={t("phoneNumber") + " 1"}
          value={contact.phoneNumber1}
        />
        <ItemCell
          label={t("phoneNumber") + " 1"}
          value={contact.phoneNumber2}
        />
        <ItemCell label={t("address")} value={contact.address} />
        <ItemCell label={t("employer")} value={contact.employer} />
        <ItemCell label={t("occupation")} value={contact.occupation} />
        <div className="col-span-2">
          <ItemCell label={t("observation")} value={contact.observation} />
        </div>
      </div>
    </div>
  );
}

function ItemCell({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <span className="text-muted-foreground text-xs">{value ?? "-"}</span>
    </div>
  );
}
