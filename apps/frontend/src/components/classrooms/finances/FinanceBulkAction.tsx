"use client";

import { MailIcon, SendHorizonal, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components/dropdown-menu";

import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import SendNotificationDialog from "./SendNotificationDialog";

export function FinanceBulkAction() {
  const { openModal } = useModal();

  const t = useTranslations();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <MailIcon className="text-muted-foreground mr-2 h-4 w-4" />
        {t("notifications")}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            //disabled={selectedStudents.length == 0}
            onSelect={() => {
              openModal({
                description: t("compose_and_schedule_email_sms"),
                title: "Send Email",
                view: <SendNotificationDialog />,
                className: "w-[600px] p-4",
              });
            }}
          >
            <SendIcon className="mr-2 h-4 w-4" />
            {t("current_selection")}{" "}
            <FlatBadge
              variant={"pink"}
              className="ml-2 rounded-full"
            ></FlatBadge>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              //send nontification
            }}
          >
            <SendHorizonal className="mr-2 h-4 w-4" />
            {t("reminder_to_debtors")}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
