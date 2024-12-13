"use client";

import {
  Columns4,
  Eye,
  MailCheckIcon,
  MoreVerticalIcon,
  Trash2,
} from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

export function AttendanceAction({
  type,
  attendanceId,
}: {
  type: string;
  attendanceId: number;
}) {
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            console.log("Viewing details of attendance", attendanceId);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("details")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            console.log("Justifying attendance", type);
          }}
        >
          <Columns4 className="mr-2 h-4 w-4" />
          {t("justify")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailCheckIcon className="mr-2 h-4 w-4" />
          {t("notify")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:bg-[#FF666618] focus:text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
