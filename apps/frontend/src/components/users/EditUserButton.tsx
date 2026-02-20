"use client";

import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { EditIcon } from "~/icons";
import { CreateEditUser } from "./CreateEditUser";

export function EditUserButton({
  userId,
  username,
  email,
  type,
}: {
  userId: string;
  username: string;
  email?: string | null;
  type: "staff" | "contact" | "student";
}) {
  const { openModal } = useModal();
  const t = useTranslations();

  return (
    <Button
      variant={"outline"}
      onClick={() =>
        openModal({
          className: "sm:max-w-xl",
          title: t("edit"),
          view: (
            <CreateEditUser
              userId={userId}
              username={username}
              email={email}
              type={type}
            />
          ),
        })
      }
    >
      <EditIcon />
      {t("edit")}
    </Button>
  );
}
