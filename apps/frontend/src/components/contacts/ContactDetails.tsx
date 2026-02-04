"use client";

import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { AddTeamIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PrinterIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { Button } from "../ui/button";
import { AddStudentToParent } from "./AddStudentToParent";

export function ContactDetails({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const { data: contact } = useSuspenseQuery(
    trpc.contact.get.queryOptions(contactId),
  );

  const t = useTranslations();
  const { openModal } = useModal();
  const avatar = createAvatar(initials, { seed: getFullName(contact) });
  const canCreateContact = useCheckPermission("contact.create");
  return (
    <div className="flex items-center gap-2 px-4 pt-2">
      <Avatar className="size-20">
        <AvatarImage
          src={
            contact.avatar
              ? `/api/avatars/${contact.avatar}`
              : avatar.toDataUri()
          }
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <span className="text-md font-medium">{getFullName(contact)}</span>
        <div className="flex items-center gap-1">
          <Button variant={"outline"} size={"sm"}>
            <PrinterIcon />
            {t("print")}
          </Button>
          {canCreateContact && (
            <Button
              variant={"outline"}
              onClick={() => {
                openModal({
                  className: "sm:max-w-xl",
                  title: t("link_students"),
                  description: `Ajouter des élèves à ${getFullName(contact)}`,
                  view: <AddStudentToParent contactId={contactId} />,
                });
              }}
            >
              <HugeiconsIcon
                icon={AddTeamIcon}
                className="size-4"
                strokeWidth={2}
              />
              {t("link_students")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
