"use client";

import { useAtomValue } from "jotai";
import { MailIcon, SendHorizonal, SendIcon } from "lucide-react";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@repo/ui/components/dropdown-menu";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import SendNotificationDialog from "./SendNotificationDialog";

export function FinanceBulkAction() {
  const selectedStudents = useAtomValue(selectedStudentIdsAtom);
  const { openModal } = useModal();
  const { t } = useLocale();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <MailIcon className="mr-2 h-4 w-4 text-muted-foreground" />
        {t("notifications")}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            disabled={selectedStudents.length == 0}
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
            <FlatBadge variant={"pink"} className="ml-2 rounded-full">
              {selectedStudents.length}
            </FlatBadge>
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
