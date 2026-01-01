"use client";

import { useParams, usePathname } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

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

export function PrintAction() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-42">
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
