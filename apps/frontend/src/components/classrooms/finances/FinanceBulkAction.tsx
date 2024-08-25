"use client";

import { useAtomValue } from "jotai";
import { ChevronDown, SendHorizonal, SendIcon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import { useModal } from "~/hooks/use-modal";
import SendNotificationDialog from "./SendNotificationDialog";

export function FinanceBulkAction() {
  const selectedStudents = useAtomValue(selectedStudentIdsAtom);
  const { openModal } = useModal();
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"default"} size={"sm"}>
          {t("actions")}
          <ChevronDown size={16} className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("send_email_sms")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
