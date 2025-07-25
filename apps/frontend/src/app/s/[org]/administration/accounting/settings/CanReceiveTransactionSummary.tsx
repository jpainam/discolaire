"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { AvatarState } from "~/components/AvatarState";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { AddStaffSchedule } from "./AddStaffSchedule";

export function CanReceiveTransactionSummary({
  staffs,
}: {
  staffs: RouterOutputs["staff"]["all"];
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const staffQuery = useQuery(trpc.staff.all.queryOptions());
  const deleteScheduleTask = useMutation(
    trpc.scheduleTask.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleTask.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const scheduleTasksQuery = useQuery(
    trpc.scheduleTask.byName.queryOptions({
      name: "transaction-summary",
    }),
  );
  if (staffQuery.isPending || scheduleTasksQuery.isPending) {
    return (
      <div className="flex flex-col gap-2 rounded-md border p-1">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const parsedTask = z.object({
    staffId: z.string().min(1),
  });

  const schedules = scheduleTasksQuery.data ?? [];

  return (
    <Card className="text-sm">
      <CardHeader className="bg-muted/50 flex flex-row items-center border-b px-2 pt-0 pb-2">
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
                view: <AddStaffSchedule />,
              });
            }}
            variant={"default"}
            size={"sm"}
          >
            <PlusIcon />
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
            {schedules.map((sch, index) => {
              const parsed = parsedTask.safeParse(sch.data);
              if (!parsed.success) return null;
              const staff = staffs.find((s) => s.id === parsed.data.staffId);
              if (!staff) return null;
              return (
                <TableRow key={index}>
                  <TableCell>
                    <AvatarState avatar={staff.user?.avatar} />
                  </TableCell>
                  <TableCell>
                    {staff.prefix}
                    {staff.lastName} {staff.firstName}{" "}
                  </TableCell>
                  <TableCell>{sch.cron}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-row items-center gap-2">
                      <Button
                        onClick={() => {
                          openModal({
                            title: t("destinations"),
                            view: (
                              <AddStaffSchedule
                                scheduleTask={sch}
                                staffId={staff.id}
                              />
                            ),
                          });
                        }}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={async () => {
                          const isConfirmed = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: <Trash2 className="text-destructive" />,
                            alertDialogTitle: {
                              className: " flex gap-2 items-center",
                            },
                          });
                          if (isConfirmed) {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteScheduleTask.mutate(sch.id);
                          }
                        }}
                        variant={"ghost"}
                        size={"icon"}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="bg-muted/80 border-t p-2">
        {t("staffs")} - {schedules.length}
      </CardFooter>
    </Card>
  );
}
