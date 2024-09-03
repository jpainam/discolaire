"use client";

import { render } from "@react-email/components";
import { CopyIcon, Mail, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { SendInvite } from "@repo/transactional/emails/SendInvite";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DropdownMenuItem } from "@repo/ui/dropdown-menu";

import { env } from "~/env";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CopyConfirmationDialog } from "./CopyConfirmationDialog";

export function DropdownInvitation({ email }: { email?: string | null }) {
  const { t } = useLocale();
  const sendEmailMutation = api.messaging.sendEmail.useMutation({
    onSuccess: () => {
      toast.success(t("email_sent"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const { openModal } = useModal();
  const confirmationInvitation = useConfirm();

  const sendInvitation = api.invitation.create.useMutation({
    onSuccess: async (invitation) => {
      if (!email) {
        toast.error(t("email_not_found", { id: 0 }));
        return;
      }
      const invitationLink =
        env.NEXT_PUBLIC_BASE_URL +
        "/invite/" +
        invitation.token +
        "?email=" +
        email;
      const emailHtml = await render(
        <SendInvite
          username={invitation.name}
          invitedByUsername="Admin"
          invitedByEmail="support@discolaire.com"
          schoolName="Portal Scoalire"
          inviteLink={invitationLink}
        />,
      );
      void sendEmailMutation.mutate({
        to: [email],
        subject: "Invitation to Discolaire",
        body: emailHtml,
      });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createInvitationMutation = api.invitation.create.useMutation();

  return (
    <>
      <DropdownMenuItem
        onSelect={() => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          toast.promise(createInvitationMutation.mutateAsync({ email }), {
            success: (invitation) => {
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
                view: (
                  <CopyConfirmationDialog invitationLink={invitationLink} />
                ),
              });
              return t("invitation_created");
            },
            error: (error) => {
              return getErrorMessage(error);
            },
          });
        }}
      >
        <CopyIcon className="mr-2 h-4 w-4" />
        {t("copy_invite")}
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={async () => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          const result = await confirmationInvitation({
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
          if (result) {
            toast.loading(t("sending_invite"), { id: 0 });
            sendInvitation.mutate({
              email: email,
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
