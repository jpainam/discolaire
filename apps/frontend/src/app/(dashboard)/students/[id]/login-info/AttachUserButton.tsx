"use client";

import { KeyRound, UserPlus2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { CreateEditUser } from "~/components/users/CreateEditUser";
import { useModal } from "~/hooks/use-modal";

export function AttachUserButton({
  userId,
  entityId,
  type,
  username,
  email,
}: {
  userId?: string;
  entityId: string;
  username?: string;
  email?: string | null;
  type: "staff" | "contact" | "student";
}) {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          title: userId ? t("change_password") : t("create_a_user"),
          view: (
            <CreateEditUser
              userId={userId}
              type={type}
              entityId={entityId}
              email={email}
              username={username}
            />
          ),
        });
      }}
      variant={"default"}
    >
      {userId ? <KeyRound /> : <UserPlus2 />}
      {!userId ? t("create_a_user") : t("change_password")}
    </Button>
  );
}
