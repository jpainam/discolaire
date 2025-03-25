"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";

import { useParams, usePathname } from "next/navigation";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";

export function PrintAction() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownHelp />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            let url = `/api/pdfs/student/${params.id}/transactions?format=pdf`;
            if (pathname.includes("/account")) {
              url = `/api/pdfs/student/${params.id}/account?format=pdf`;
            }
            window.open(url, "_blank");
          }}
        >
          <PDFIcon />
          {t("pdf_export")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            window.open(
              `/api/pdfs/student/${params.id}/transactions?format=csv`,
              "_blank",
            );
          }}
        >
          <XMLIcon />
          {t("xml_export")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
