"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { MoreVertical, PlusIcon, Trash2 } from "lucide-react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditSubscription } from "./CreateEditSubscription";

export function SubscriptionHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="space-y-2 p-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">{t("subscriptions")}</Label>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              openModal({
                title: `${t("add")} - ${t("subscription")}`,
                view: <CreateEditSubscription />,
              });
            }}
            size={"sm"}
          >
            <PlusIcon />
            {t("create")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"} variant={"outline"} className="size-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownHelp />
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PDFIcon />
                {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <XMLIcon />
                {t("xml_export")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                {t("clear_all")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
