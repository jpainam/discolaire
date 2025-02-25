"use client";

import { CopyIcon, Mail, SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@repo/ui/components/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { env } from "~/env";
import { api } from "~/trpc/react";
import { CopyConfirmationDialog } from "./CopyConfirmationDialog";

export function DropdownInvitation({ email }: { email?: string | null }) {
  const { t } = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  const { openModal, closeModal } = useModal();
  const confirm = useConfirm();

  const createInvitationMutation = api.invitation.create.useMutation({
    onSuccess: (invitation) => {
      const invitationLink =
        env.NEXT_PUBLIC_BASE_URL +
        "/invite/" +
        invitation.token +
        "?email=" +
        email;
      openModal({
        title: t("copy_invite"),
        className: "w-[500px]",
        description: t("copy_invitation_link_description"),
        view: <CopyConfirmationDialog invitationLink={invitationLink} />,
      });
      toast.success(t("invitation_created"), { id: 0 });
    },

    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  return (
    <>
      <DropdownMenuItem
        disabled={createInvitationMutation.isPending}
        onSelect={() => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          createInvitationMutation.mutate({ email });
        }}
      >
        <CopyIcon className="mr-2 h-4 w-4" />
        {t("copy_invite")}
      </DropdownMenuItem>
      <DropdownMenuItem
        disabled={isLoading}
        onSelect={async () => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          setIsLoading(true);
          const isConfirmed = await confirm({
            title: t("send_invite"),
            icon: <Mail className="h-4 w-4" />,
            description: t("would_you_like_to_invite_this_person"),
            confirmText: t("yes"),
            confirmButton: {
              className: "",
            },
            cancelText: t("no"),
            alertDialogTitle: {
              className: "flex items-center gap-2",
            },
          });
          if (isConfirmed) {
            setIsLoading(true);
            toast.loading(t("sending_invite"), { id: 0 });
            await fetch(`/api/emails/invite?email=${email}`, {
              method: "GET",
            })
              .then(() => {
                toast.success(t("email_sent_successfully"), { id: 0 });
                closeModal();
              })
              .catch((error) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                toast.error(error.message, { id: 0 });
              })
              .finally(() => {
                setIsLoading(false);
              });
          }
        }}
      >
        <SendIcon className="mr-2 h-4 w-4" />
        {}
        {t("send_invite")}
      </DropdownMenuItem>
    </>
  );
}
