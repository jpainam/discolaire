"use client";

import { CopyIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { DropdownMenuItem } from "@repo/ui/dropdown-menu";

import { env } from "~/env";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CopyConfirmationDialog } from "./CopyConfirmationDialog";
import { InviteConfirmationDialog } from "./InviteConfirmationDialog";

export function DropdownInvitation({ email }: { email?: string | null }) {
  const { t } = useLocale();

  const { openModal } = useModal();
  const createInvitationMutation = api.invitation.create.useMutation();

  return (
    <>
      <DropdownMenuItem
        onSelect={() => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          toast.promise(
            createInvitationMutation.mutateAsync({ email, name: "" }),
            {
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
            },
          );
        }}
      >
        <CopyIcon className="mr-2 h-4 w-4" />
        {t("copy_invite")}
      </DropdownMenuItem>
      <DropdownMenuItem
        onSelect={() => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          openModal({
            className: "w-[350px] p-2",
            description: t("would_you_like_to_invite_this_person"),
            title: t("send_invite"),
            view: <InviteConfirmationDialog name="" email={email} />,
          });
        }}
      >
        <SendIcon className="mr-2 h-4 w-4" />
        {}
        {t("send_invite")}
      </DropdownMenuItem>
    </>
  );
}
