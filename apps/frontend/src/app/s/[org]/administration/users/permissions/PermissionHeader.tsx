"use client";

import { LockKeyhole, MoreVertical } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useLocale } from "~/i18n";

export function PermissionHeader() {
  const { t } = useLocale();
  const [userId, setUserId] = useQueryState("userId");
  return (
    <div className="flex flex-row items-center justify-between gap-2 border-b px-4 py-2">
      <div className="flex flex-row items-center gap-2">
        <LockKeyhole className="h-4 w-4" />
        <Label>{t("permissions")}</Label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("user")}</Label>
        <UserSelector
          className="w-96"
          defaultValue={userId ?? ""}
          onChange={(val) => {
            void setUserId(val ?? null);
          }}
        />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"icon-sm"}>
              <MoreVertical />
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
