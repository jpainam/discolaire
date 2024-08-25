"use client";

import PDFIcon from "@/components/icons/pdf-solid";
import XMLIcon from "@/components/icons/xml-solid";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { exportToCSV } from "@/utils/export-to-csv";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { PiArrowLineUpBold } from "react-icons/pi";

type ExportButtonProps = {
  onPdfClick?: () => void;
  onExcelClick?: () => void;
  className?: string;
};
export function ExportButton({
  onPdfClick,
  onExcelClick,
  className,
}: ExportButtonProps) {
  const { t } = useLocale();
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="ml-auto hidden h-8 lg:flex">
            <PiArrowLineUpBold className="mr-2 h-5 w-5" /> {t("export")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[150px]" align="end">
          <DropdownMenuItem onClick={onPdfClick}>
            <PDFIcon className="mr-2 h-4 w-4" />
            <span>PDF</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onExcelClick}>
            <XMLIcon className="mr-2 h-4 w-4" />
            <span>Excel</span>
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type ExportButtonProps2 = {
  data: unknown[];
  header: string;
  fileName: string;
  className?: string;
};

export default function ExportButton2({
  data,
  header,
  fileName,
  className,
}: ExportButtonProps2) {
  const { t } = useLocale();
  return (
    <Button
      variant="outline"
      onClick={() => exportToCSV(data, header, fileName)}
      className={cn("@lg:w-auto w-full", className)}
    >
      <PiArrowLineUpBold className="me-1.5 h-[17px] w-[17px]" />
      {t("export")}
    </Button>
  );
}
