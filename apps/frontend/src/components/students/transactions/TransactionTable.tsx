"use client";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { BookCopy, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { EmptyState } from "~/components/EmptyState";
import type { FlatBadgeVariant } from "~/components/FlatBadge";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { DeleteTransaction } from "./DeleteTransaction";

export function TransactionTable() {
  const params = useParams<{ id: string }>();
  const { t, i18n } = useLocale();
  const { fullDateFormatter } = useDateFormat();
  const transactionsQuery = api.student.transactions.useQuery(params.id);
  const utils = api.useUtils();
  const canDeleteTransaction = useCheckPermissions(
    PermissionAction.DELETE,
    "transaction"
  );

  const updateTransactionMutation = api.transaction.updateStatus.useMutation({
    onSettled: async () => {
      await utils.transaction.invalidate();
      await utils.student.transactions.invalidate();
      await utils.studentAccount.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });
  const { openModal } = useModal();
  return (
    <Table className="border-y">
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>{t("transactionRef")}</TableHead>
          <TableHead>{t("transactionType")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
          <TableHead>{t("description")}</TableHead>
          <TableHead>{t("amount")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactionsQuery.data?.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              <EmptyState className="my-8" />
            </TableCell>
          </TableRow>
        )}
        {transactionsQuery.isPending && (
          <TableRow>
            <TableCell colSpan={7}>
              <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </TableCell>
          </TableRow>
        )}
        {transactionsQuery.data?.map((transaction) => {
          return (
            <TableRow key={transaction.id}>
              <TableCell>
                <Link
                  className="hover:text-blue-600 hover:underline"
                  href={routes.students.transactions.details(
                    params.id,
                    transaction.id
                  )}
                >
                  {transaction.transactionRef}
                </Link>
              </TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>
                {fullDateFormatter.format(transaction.createdAt)}
              </TableCell>
              <TableCell>
                <Link
                  className="hover:text-blue-600 hover:underline"
                  href={routes.students.transactions.details(
                    params.id,
                    transaction.id
                  )}
                >
                  {transaction.description}
                </Link>
              </TableCell>
              <TableCell>
                {transaction.amount.toLocaleString(i18n.language, {
                  style: "currency",
                  currency: CURRENCY,
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                })}
              </TableCell>
              <TableCell>
                <TransactionStatus status={transaction.status} />
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-label="Open menu" variant="ghost" size={"sm"}>
                      <MoreHorizontal className="size-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <BookCopy className="mr-2 h-4 w-4" />
                        {t("status")}
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={transaction.status}
                          onValueChange={(value) => {
                            if (
                              ["PENDING", "CANCELED", "VALIDATED"].includes(
                                value
                              )
                            ) {
                              const v = value as
                                | "PENDING"
                                | "CANCELED"
                                | "VALIDATED";
                              toast.loading(t("updating"), { id: 0 });
                              updateTransactionMutation.mutate({
                                transactionId: transaction.id,
                                status: v,
                              });
                            } else {
                              toast.error(t("invalid_status"), { id: 0 });
                            }
                          }}
                        >
                          <DropdownMenuRadioItem
                            value={"VALIDATED"}
                            className="capitalize"
                          >
                            <FlatBadge variant={"green"}>
                              <CheckCircledIcon
                                className="mr-2 size-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                              {t("validate")}
                            </FlatBadge>
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            value={"CANCELED"}
                            className="capitalize"
                          >
                            <FlatBadge variant={"red"}>
                              <CrossCircledIcon
                                className="mr-2 size-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                              {t("cancel")}
                            </FlatBadge>
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem
                            value={"PENDING"}
                            className="capitalize"
                          >
                            <FlatBadge variant={"yellow"}>
                              <StopwatchIcon
                                className="mr-2 size-4 text-muted-foreground"
                                aria-hidden="true"
                              />
                              {t("pending")}
                            </FlatBadge>
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    {canDeleteTransaction && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
                          onSelect={() => {
                            openModal({
                              title: t("delete"),
                              className: "w-[400px]",
                              view: (
                                <DeleteTransaction
                                  transactionId={transaction.id}
                                />
                              ),
                            });
                          }}
                        >
                          <Trash2 className="mr-2 size-4" aria-hidden="true" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function TransactionStatus({ status }: { status: string }) {
  const { t } = useLocale();
  let variant = "gray";
  if (status === "VALIDATED") {
    variant = "green";
  } else if (status === "CANCELED") {
    variant = "red";
  } else if (status === "PENDING") {
    variant = "yellow";
  }

  return (
    <FlatBadge className="gap-2" variant={variant as FlatBadgeVariant}>
      {status === "CANCELED" ? (
        <CrossCircledIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      ) : status === "VALIDATED" ? (
        <CheckCircledIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      ) : (
        <StopwatchIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
      )}
      <span className="capitalize">{t(status)}</span>
    </FlatBadge>
  );
}
