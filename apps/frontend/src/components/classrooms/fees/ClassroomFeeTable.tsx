"use client";

import { subDays } from "date-fns";
import { addDays } from "date-fns/addDays";
import { sumBy } from "lodash";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { CURRENCY } from "~/lib/constants";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { CreateEditFee } from "./CreateEditFee";

export function ClassroomFeeTable({ classroomId }: { classroomId: string }) {
  const feesQuery = api.classroom.fees.useQuery(classroomId);
  const { t, i18n } = useLocale();
  const rowClassName = "border";
  const { fullDateFormatter } = useDateFormat();
  const canDeleteClassroomFee = useCheckPermissions(
    PermissionAction.DELETE,
    "classroom:fee",
    {
      id: classroomId,
    },
  );
  const canUpdateClassroomFee = useCheckPermissions(
    PermissionAction.UPDATE,
    "classroom:fee",
    {
      id: classroomId,
    },
  );
  const utils = api.useUtils();
  const deleteFeeMutation = api.fee.delete.useMutation({
    onSettled: () => utils.fee.invalidate(),
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
    <div className="m-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("amount")}</TableHead>
            <TableHead>{t("due_date")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead>{t("is_active")} ?</TableHead>
            <TableHead>{t("journal")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fees?.map((fee) => {
            return (
              <TableRow key={fee.id} className={rowClassName}>
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
                <TableCell className="">{fee.journal?.name}</TableCell>
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
                                  title: <div>{t("edit")}</div>,
                                  className: "w-[500px]",
                                  view: <CreateEditFee fee={fee} />,
                                });
                              }}
                            >
                              <Pencil className="mr-2 h-3 w-3" />
                              {t("edit")}
                            </DropdownMenuItem>
                          )}
                          {canDeleteClassroomFee && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={async () => {
                                  const isConfirmed = await confirm({
                                    title: t("delete"),
                                    description: t("delete_confirmation"),
                                  });
                                  if (isConfirmed) {
                                    toast.promise(
                                      deleteFeeMutation.mutateAsync({
                                        id: fee.id,
                                      }),
                                      {
                                        loading: t("deleting"),
                                        success: () => {
                                          return t("deleted_successfully");
                                        },
                                        error: (error) => {
                                          return getErrorMessage(error);
                                        },
                                      },
                                    );
                                  }
                                }}
                              >
                                <Trash2 className="mr-2 h-3 w-3" />
                                <span>{t("delete")}</span>
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
          <TableRow className={rowClassName}>
            <TableCell className="font-bold uppercase">{t("total")}</TableCell>
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
  );
}
