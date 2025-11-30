"use client";

import { KeyRound, UserPlus2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";

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
      size={"sm"}
    >
      {userId ? (
        <KeyRound className="h-4 w-4" />
      ) : (
        <UserPlus2 className="h-4 w-4" />
      )}
      {!userId ? t("create_a_user") : t("change_password")}
    </Button>
  );
}
