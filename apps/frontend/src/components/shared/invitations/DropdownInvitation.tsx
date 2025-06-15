"use client";

import { Mail, SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DropdownMenuItem } from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { authClient } from "~/auth/client";

export function DropdownInvitation({
  entityId,
  entityType,
  email,
}: {
  entityType: string;
  entityId: string;
  email?: string | null;
}) {
  const { t } = useLocale();

  const [isLoading, setIsLoading] = useState(false);

  //const { openModal, closeModal } = useModal();
  console.log("entityId", entityId);
  console.log("entityType", entityType);
  const confirm = useConfirm();
  // const createUserMutation = useMutation(trpc.user.create.mutationOptions({
  //   onSuccess: (newUser) => {},
  //   onError: (error) => {
  //     toast.error(t("error_creating_user", { error: error.message }));
  //   },
  // }));

  return (
    <>
      {/* <DropdownMenuItem
        onSelect={async () => {
          const token = await createUniqueInvite({ entityId, entityType });
          const invitationLink = env.NEXT_PUBLIC_BASE_URL + "/invite/" + token;
          openModal({
            title: t("copy_invite"),

            description: t("copy_invitation_link_description"),
            view: <CopyConfirmationDialog invitationLink={invitationLink} />,
          });
        }}
      >
        <CopyIcon />
        {t("copy_invite")}
      </DropdownMenuItem> */}
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

            await authClient.forgetPassword({
              email: email,
              //redirectTo: `/auth/complete-registration/${newUser.user.id}`,
            });
            toast.success(t("email_sent_successfully"), { id: 0 });
          }
        }}
      >
        <SendIcon />
        {t("send_invite")}
      </DropdownMenuItem>
    </>
  );
}
