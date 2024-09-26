"use client";

import { KeyRound, UserPlus2 } from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
import { Button } from "@repo/ui/button";

import { CreateEditUser } from "~/components/users/CreateEditUser";

export function AttachUserButton({
  userId,
  entityId,
  type,
  username,
  roleIds,
}: {
  userId?: string;
  entityId: string;
  roleIds?: string[];
  username?: string;
  type: "staff" | "contact" | "student";
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          className: "w-[500px]",
          title: userId ? t("change_password") : t("create_user"),
          view: (
            <CreateEditUser
              roleIds={roleIds}
              userId={userId}
              type={type}
              entityId={entityId}
              username={username}
            />
          ),
        });
      }}
      variant={"default"}
      size={"sm"}
    >
      {userId ? (
        <KeyRound className="mr-2 h-4 w-4" />
      ) : (
        <UserPlus2 className="mr-2 h-4 w-4" />
      )}
      {!userId ? t("create_user") : t("change_password")}
    </Button>
  );
}
