"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Pencil, PlusCircleIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";

import { AvatarState } from "~/components/AvatarState";
import { EmptyState } from "~/components/EmptyState";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { AddStaffSchedule } from "./CreateTransactionNotificationScheduledTask";
import { cronValues } from "./cron-values";

export function CanReceiveTransactionSummary({
  staffs,
  className,
}: {
  staffs: RouterOutputs["staff"]["all"];
  className?: string;
}) {
  const t = useTranslations();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const staffQuery = useQuery(trpc.staff.all.queryOptions());
  const deleteScheduleTask = useMutation(
    trpc.scheduleTask.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.scheduleTask.pathFilter());
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
      <div
        className={cn("flex flex-col gap-2 rounded-md border p-1", className)}
      >
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
    <Card className={className}>
      <CardHeader>
        <CardTitle>{t("notifications")}</CardTitle>
        <CardDescription>{t("transaction_summary")}</CardDescription>
        <CardAction>
          <Button
            onClick={() => {
              openModal({
                title: t("notifications"),
                view: <AddStaffSchedule />,
              });
            }}
            className="size-7"
            variant={"default"}
            size={"icon"}
          >
            <PlusCircleIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="gap-0 p-0">
        <div className="bg-background overflow-hidden border-t">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
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
                      <AvatarState
                        className="h-7 w-7"
                        avatar={staff.user?.avatar}
                      />
                    </TableCell>
                    <TableCell>
                      {staff.prefix}
                      {staff.lastName} {staff.firstName}{" "}
                    </TableCell>
                    <TableCell>
                      {t(
                        cronValues.find((cr) => cr.value == sch.cron)?.name ??
                          "",
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size="icon"
                            className="size-7"
                          >
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              openModal({
                                title: t("notifications"),
                                view: (
                                  <AddStaffSchedule
                                    scheduleTask={sch}
                                    staffId={staff.id}
                                  />
                                ),
                              });
                            }}
                          >
                            <Pencil className="h-4 w-4" /> {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={async () => {
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
                          >
                            <Trash2 className="h-4 w-4" />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
