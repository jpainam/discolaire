"use client";

import { Ban, CloudDownload, MoreHorizontal, RefreshCcw } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import type { ReportQueue } from "~/types/report";

export function ReportQueueTableActions({ report }: { report: ReportQueue }) {
  const { t } = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"icon"} className="h-7 w-8">
          <MoreHorizontal className="h-3.2 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={report.status != "COMPLETED"}>
            <CloudDownload className="mr-2 h-4 w-4" />
            <span>{t("download")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // toast.promise(updateReportQueueStatus(report.id, "PENDING"), {
              //   loading: t("updating_status"),
              //   success: () => {
              //     return t("pending");
              //   },
              //   error: (error) => {
              //     return getErrorMessage(error);
              //   },
              // });
            }}
            disabled={report.status == "PENDING"}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            <span>{t("retry")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              // toast.promise(updateReportQueueStatus(report.id, "CANCELLED"), {
              //   loading: t("cancelling"),
              //   success: () => {
              //     return t("cancelled");
              //   },
              //   error: (error) => {
              //     return getErrorMessage(error);
              //   },
              // });
            }}
            disabled={report.status != "PENDING"}
          >
            <Ban className="mr-2 h-4 w-4" />
            <span>{t("cancel")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {/* <DeleteReportQueueDialog
            //disabled={report.status != "COMPLETED" && report.status != "FAILED"}
            reportId={report.id}
          /> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
