"use client";

import { Button } from "@repo/ui/components/button";
import { UserPlus2 } from "lucide-react";
import { CreateEditUser } from "~/components/users/CreateEditUser";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

export function LinkUser({
  entityId,
  type,
}: {
  entityId: string;
  type: "staff" | "student" | "contact";
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      size={"sm"}
      onClick={() => {
        openModal({
          title: t("create_a_user"),
          view: <CreateEditUser entityId={entityId} type={type} />,
        });
      }}
    >
      <UserPlus2 />
      {t("create_a_user")}
    </Button>
  );
}
