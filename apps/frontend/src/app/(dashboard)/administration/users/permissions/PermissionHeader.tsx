"use client";

import { LockKeyhole, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { updatePermission } from "~/actions/update_policies";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { CreateEditPermission } from "./CreateEditPermission";

export function PermissionHeader() {
  const t = useTranslations();
  const { openModal } = useModal();

  return (
    <div className="flex flex-row items-center justify-between gap-2 border-b px-4 py-2">
      <div className="flex flex-row items-center gap-2">
        <LockKeyhole className="h-4 w-4" />
        <Label>{t("permissions")}</Label>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={async () => {
            toast.loading("Updating....", { id: 0 });
            await updatePermission();
            toast.success("Update completed", { id: 0 });
          }}
        >
          Update Permission
        </Button>
        <Button
          onClick={() => {
            openModal({
              title: t("add"),
              description: t("Permission"),
              className: "sm:max-w-xl",
              view: <CreateEditPermission />,
            });
          }}
        >
          <PlusIcon />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
