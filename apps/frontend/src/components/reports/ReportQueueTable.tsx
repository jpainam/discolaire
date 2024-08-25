"use client";

import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@repo/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { Ban, Check, CircleX } from "lucide-react";

import { useLocale } from "~/hooks/use-locale";
import { ReportQueue } from "~/types/report";
import { useDateFormat } from "~/utils/date-format";
import FlatBadge from "../ui/FlatBadge";
import { ReportQueueTableActions } from "./ReportQueueTableActions";

export function ReportQueueTable({ reports }: { reports: ReportQueue[] }) {
  const { t } = useLocale();
  const { fullDateTimeFormatter, fullDateFormatter } = useDateFormat();

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("created")}</TableHead>
            <TableHead>{t("jobName")}</TableHead>
            <TableHead>{t("expectedDate")}</TableHead>
            <TableHead>{t("started")}</TableHead>
            <TableHead>{t("ended")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((rep) => {
            return (
              <TableRow key={rep.id}>
                <TableCell className="font-medium">
                  {rep?.createdAt &&
                    fullDateTimeFormatter.format(new Date(rep?.createdAt))}
                </TableCell>
                <TableCell>
                  {" "}
                  <Link
                    href={rep?.signedUrl ?? "#"}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    {rep?.code}: {rep?.name}
                  </Link>{" "}
                </TableCell>
                <TableCell>
                  {rep?.expectedDate &&
                    fullDateTimeFormatter.format(new Date(rep.expectedDate))}
                </TableCell>
                <TableCell>
                  {rep?.startedAt
                    ? fullDateTimeFormatter.format(new Date(rep?.startedAt))
                    : "-"}
                </TableCell>
                <TableCell>
                  {rep?.completedAt
                    ? fullDateTimeFormatter.format(new Date(rep?.completedAt))
                    : "-"}
                </TableCell>
                <TableCell>
                  <FlatBadge
                    className=""
                    variant={
                      rep.status == "IN_PROGRESS"
                        ? "yellow"
                        : rep.status == "COMPLETED"
                          ? "green"
                          : rep.status == "CANCELLED"
                            ? "purple"
                            : "red"
                    }
                  >
                    {rep.status == "IN_PROGRESS" && (
                      <ReloadIcon className="h-4 w-4 animate-spin" />
                    )}
                    {rep.status == "COMPLETED" && <Check className="h-4 w-4" />}
                    {rep.status == "CANCELLED" && <Ban className="h-4 w-4" />}
                    {rep.status == "FAILED" && <CircleX className="h-4 w-4" />}
                    <span className="ml-2">{t(rep?.status as string)}</span>
                  </FlatBadge>
                </TableCell>
                <TableCell className="flex flex-row justify-end">
                  <ReportQueueTableActions report={rep} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Separator />
      <div className="mb-4 flex flex-col items-start justify-start gap-3 px-4 text-sm">
        <div className="flex flex-row gap-4">
          <Check className="h-4 w-4 text-orange-500" />
          {t("queueJobDetail1")}
        </div>
        <div className="flex flex-row gap-4">
          <Check className="text-brown-500 h-4 w-4" />
          {t("queueJobDetail2")}
        </div>
        <div className="flex flex-row gap-4">
          <Check className="h-4 w-4 text-blue-500" />
          {t("queueJobDetail3")}
        </div>
        <div className="flex flex-row gap-4">
          <Check className="h-4 w-4 text-green-500" />
          {t("queueJobDetail4")}
        </div>
        <div className="flex flex-row gap-4">
          <Check className="h-4 w-4 text-red-500" />
          {t("queueJobDetail5")}
        </div>
      </div>
    </div>
  );
}
