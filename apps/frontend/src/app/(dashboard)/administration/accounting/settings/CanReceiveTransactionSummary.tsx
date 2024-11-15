"use client";

import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { EmptyState } from "@repo/ui/EmptyState";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { AvatarState } from "~/components/AvatarState";
import { api } from "~/trpc/react";
import { AddStaffSchedule } from "./AddStaffSchedule";

export function CanReceiveTransactionSummary({
  timezones,
}: {
  timezones: string[];
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const utils = api.useUtils();

  const staffQuery = api.staff.all.useQuery();
  const scheduleJobsQuery = api.scheduleJob.byType.useQuery({
    type: "transaction-summary",
  });
  if (staffQuery.isPending || scheduleJobsQuery.isPending) {
    return (
      <div className="flex flex-col gap-2 rounded-md border p-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  const staffs = staffQuery.data ?? [];
  const schedules = scheduleJobsQuery.data ?? [];

  return (
    <Card className="text-sm">
      <CardHeader className="flex flex-row items-center border-b bg-muted/50 px-2 pb-2 pt-0">
        <CardTitle className="p-0">
          {t("destinations")} - {t("transaction_summary")}
        </CardTitle>
        {/* <CardDescription>
          {t("will_receive_transaction_summary_description")}
        </CardDescription> */}
        <div className="ml-auto">
          <Button
            onClick={() => {
              openModal({
                className: "w-[500px]",
                title: t("destinations"),
                view: (
                  <AddStaffSchedule staffs={staffs} timezones={timezones} />
                ),
              });
            }}
            variant={"default"}
            size={"sm"}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            {t("add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("frequence")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {schedules.map((sch) => {
              return (
                <TableRow>
                  <TableCell>
                    <AvatarState avatar={sch.user.avatar} />
                  </TableCell>
                  <TableCell>{sch.user.name}</TableCell>
                  <TableCell>{sch.cron}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-row items-center gap-2">
                      <Button variant={"ghost"} size={"icon"}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={async () => {
                          const isConfirmed = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: (
                              <Trash2 className="h-6 w-6 text-destructive" />
                            ),
                            alertDialogTitle: {
                              className: " flex gap-2 items-center",
                            },
                          });
                          if (isConfirmed) {
                            toast.loading(t("deleting"), { id: 0 });
                            fetch(`/api/trigger/schedules/${sch.id}`, {
                              method: "DELETE",
                            })
                              .then(() => {
                                toast.success(t("deleted_successfully"), {
                                  id: 0,
                                });
                                void utils.scheduleJob.invalidate();
                              })
                              .catch((e) => {
                                toast.error(e, { id: 0 });
                              })
                              .finally(() => {
                                toast.dismiss(0);
                              });
                          }
                        }}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="border-t bg-muted/80 p-2">
        {t("staffs")} - {schedules.length}
      </CardFooter>
    </Card>
  );
}
