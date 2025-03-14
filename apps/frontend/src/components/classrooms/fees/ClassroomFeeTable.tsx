"use client";

import { subDays } from "date-fns";
import { addDays } from "date-fns/addDays";
import { sumBy } from "lodash";
import { MoreHorizontal, Pencil, ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useConfirm } from "~/providers/confirm-dialog";

import { useCheckPermission } from "~/hooks/use-permission";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { CreateEditFee } from "./CreateEditFee";

export function ClassroomFeeTable({ classroomId }: { classroomId: string }) {
  const feesQuery = api.classroom.fees.useQuery(classroomId);
  const { t, i18n } = useLocale();

  const { fullDateFormatter } = useDateFormat();
  const canDeleteClassroomFee = useCheckPermission(
    "fee",
    PermissionAction.DELETE,
  );
  const canUpdateClassroomFee = useCheckPermission(
    "fee",
    PermissionAction.UPDATE,
  );
  const utils = api.useUtils();
  const disableFeeMutation = api.fee.disable.useMutation({
    onSettled: async () => {
      await utils.classroom.fees.invalidate(classroomId);
      await utils.fee.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const deleteFeeMutation = api.fee.delete.useMutation({
    onSettled: async () => {
      await utils.classroom.fees.invalidate(classroomId);
      await utils.fee.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { openModal } = useModal();
  const confirm = useConfirm();
  if (feesQuery.isPending) {
    return (
      <DataTableSkeleton
        className="m-2"
        withPagination={false}
        showViewOptions={false}
        columnCount={6}
        rowCount={15}
      />
    );
  }
  const fees = feesQuery.data;
  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("amount")}</TableHead>
              <TableHead>{t("due_date")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("is_active")} ?</TableHead>
              <TableHead>{t("required_fees")} ?</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees?.map((fee) => {
              return (
                <TableRow key={fee.id}>
                  <TableCell className="">{fee.description}</TableCell>
                  <TableCell className="">
                    {fee.amount.toLocaleString(i18n.language, {
                      currency: CURRENCY,
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    })}{" "}
                    {CURRENCY}
                  </TableCell>
                  <TableCell className="">
                    {fullDateFormatter.format(fee.dueDate)}
                  </TableCell>
                  <TableCell className="">
                    {fee.dueDate < subDays(new Date(), 1) ? (
                      <FlatBadge variant={"green"}>{t("applied")}</FlatBadge>
                    ) : fee.dueDate > addDays(new Date(), 7) ? (
                      <FlatBadge variant={"purple"}>{t("upcoming")}</FlatBadge>
                    ) : (
                      <FlatBadge variant={"yellow"}>{t("current")}</FlatBadge>
                    )}
                  </TableCell>
                  <TableCell className="">
                    {fee.isActive ? (
                      <FlatBadge variant={"green"}>{t("active")}</FlatBadge>
                    ) : (
                      <FlatBadge variant={"red"}>{t("inactive")}</FlatBadge>
                    )}
                  </TableCell>
                  <TableCell className="">
                    <FlatBadge variant={fee.isRequired ? "red" : "green"}>
                      {fee.isRequired ? t("yes") : t("no")}
                    </FlatBadge>
                  </TableCell>
                  <TableCell className="">
                    {canUpdateClassroomFee || canDeleteClassroomFee ? (
                      <div className="flex flex-row items-center justify-end gap-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canUpdateClassroomFee && (
                              <DropdownMenuItem
                                onSelect={() => {
                                  openModal({
                                    title: t("edit"),
                                    className: "w-[500px]",
                                    view: <CreateEditFee fee={fee} />,
                                  });
                                }}
                              >
                                <Pencil />
                                {t("edit")}
                              </DropdownMenuItem>
                            )}
                            {canDeleteClassroomFee && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onSelect={() => {
                                    toast.loading(t("updating"), { id: 0 });
                                    disableFeeMutation.mutate({
                                      id: fee.id,
                                      isActive: !fee.isActive,
                                    });
                                  }}
                                >
                                  <ShieldOff />
                                  {fee.isActive ? t("disable") : t("enable")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                                  onSelect={async () => {
                                    const isConfirmed = await confirm({
                                      title: t("delete"),
                                      description: t("delete_confirmation"),
                                    });
                                    if (isConfirmed) {
                                      toast.loading(t("deleting"), { id: 0 });
                                      deleteFeeMutation.mutate(fee.id);
                                    }
                                  }}
                                >
                                  <Trash2 />
                                  {t("delete")}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <></>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell className="font-bold uppercase">
                {t("total")}
              </TableCell>
              <TableCell className="font-bold">
                {sumBy(fees, (f) => f.amount).toLocaleString(i18n.language, {
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}{" "}
                {CURRENCY}
              </TableCell>
              <TableCell colSpan={5}></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
