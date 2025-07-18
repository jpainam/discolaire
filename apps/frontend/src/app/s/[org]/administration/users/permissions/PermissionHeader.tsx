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
import { LockKeyhole, MoreVertical } from "lucide-react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
export function PermissionHeader({ defaultValue }: { defaultValue: string }) {
  const { t } = useLocale();
  const router = useRouter();
  return (
    <div className="flex flex-row justify-between px-4 py-2 border-b items-center gap-2">
      <div className="flex flex-row items-center gap-2">
        <LockKeyhole className="w-4 h-4" />
        <Label>{t("permissions")}</Label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("user")}</Label>
        <UserSelector
          className="w-96"
          defaultValue={defaultValue}
          onChange={(val) => {
            router.push(`/administration/users/permissions?userId=${val}`);
          }}
        />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="size-8" variant="outline" size={"icon"}>
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
