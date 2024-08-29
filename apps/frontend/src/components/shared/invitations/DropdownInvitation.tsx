import { CopyIcon, SendIcon } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { DropdownMenuItem } from "@repo/ui/dropdown-menu";

import { env } from "~/env";
import { api } from "~/trpc/server";
import { CopyConfirmationDialog } from "./CopyConfirmationDialog";
import { InviteConfirmationDialog } from "./InviteConfirmationDialog";

export function DropdownInvitation({ email }: { email?: string | null }) {
  const { t } = useLocale();

  const { openModal } = useModal();

  return (
    <>
      <DropdownMenuItem
        onSelect={async () => {
          if (!email) {
            toast.error(t("email_not_found"));
            return;
          }
          const invitationCode = await api.invitation.create({ email });
          const invitationLink =
            env.NEXT_PUBLIC_BASE_URL +
            "/invite/" +
            invitationCode.token +
            "?email=" +
            email;
          openModal({
            title: t("copy_invite"),
            className: "w-[500px]",
            description: t("copy_invitation_link_description"),
            view: <CopyConfirmationDialog invitationLink={invitationLink} />,
          });
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
            view: <InviteConfirmationDialog email={email} />,
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
