"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import i18next from "i18next";
import { BookCopy, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TransactionType } from "@repo/db";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import type { FlatBadgeVariant } from "~/components/FlatBadge";
import { EmptyState } from "~/components/EmptyState";
import FlatBadge from "~/components/FlatBadge";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { DeleteTransaction } from "./DeleteTransaction";

export function TransactionTable() {
  const params = useParams<{ id: string }>();
  const { t, i18n } = useLocale();
  const fullDateFormatter = new Intl.DateTimeFormat(i18next.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const trpc = useTRPC();
  const { data: transactions } = useSuspenseQuery(
    trpc.student.transactions.queryOptions(params.id),
  );
  const queryClient = useQueryClient();

  const canDeleteTransaction = useCheckPermission(
    "transaction",
    PermissionAction.DELETE,
  );
  const canUpdateTransaction = useCheckPermission(
    "transaction",
    PermissionAction.UPDATE,
  );
  const canReadTransaction = useCheckPermission(
    "transaction",
    PermissionAction.READ,
  );

  const updateTransactionMutation = useMutation(
    trpc.transaction.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        await queryClient.invalidateQueries(trpc.studentAccount.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  return (
    <div className="px-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
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
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <EmptyState className="my-8" />
                </TableCell>
              </TableRow>
            )}

            {transactions.map((transaction) => {
              return (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {canReadTransaction ? (
                      <Link
                        className="hover:text-blue-600 hover:underline"
                        href={routes.students.transactions.details(
                          params.id,
                          transaction.id,
                        )}
                      >
                        {transaction.transactionRef}
                      </Link>
                    ) : (
                      <> {transaction.transactionRef}</>
                    )}
                  </TableCell>
                  <TableCell>
                    {transaction.transactionType == TransactionType.DISCOUNT ? (
                      <FlatBadge variant="pink">{t("discount")}</FlatBadge>
                    ) : transaction.transactionType == TransactionType.DEBIT ? (
                      <FlatBadge variant="red">{t("debit")}</FlatBadge>
                    ) : (
                      <FlatBadge variant="green">{t("credit")}</FlatBadge>
                    )}
                  </TableCell>
                  <TableCell>
                    {fullDateFormatter.format(transaction.createdAt)}
                  </TableCell>
                  <TableCell>
                    {canReadTransaction ? (
                      <Link
                        className="hover:text-blue-600 hover:underline"
                        href={routes.students.transactions.details(
                          params.id,
                          transaction.id,
                        )}
                      >
                        {transaction.description}
                      </Link>
                    ) : (
                      <>{transaction.description}</>
                    )}
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
                    {(canUpdateTransaction || canDeleteTransaction) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-label="Open menu"
                            variant="ghost"
                            size={"sm"}
                          >
                            <MoreHorizontal
                              className="size-4"
                              aria-hidden="true"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canUpdateTransaction && (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <BookCopy className="text-muted-foreground mr-2 h-4 w-4" />
                                {t("status")}
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup
                                  value={transaction.status}
                                  onValueChange={(value) => {
                                    if (
                                      [
                                        "PENDING",
                                        "CANCELED",
                                        "VALIDATED",
                                      ].includes(value)
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
                                      toast.error(t("invalid_status"), {
                                        id: 0,
                                      });
                                    }
                                  }}
                                >
                                  <DropdownMenuRadioItem
                                    value={"VALIDATED"}
                                    className="capitalize"
                                  >
                                    <FlatBadge variant={"green"}>
                                      <CheckCircledIcon
                                        className="text-muted-foreground mr-2 size-4"
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
                                        className="text-muted-foreground mr-2 size-4"
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
                                        className="text-muted-foreground mr-2 size-4"
                                        aria-hidden="true"
                                      />
                                      {t("pending")}
                                    </FlatBadge>
                                  </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                          )}
                          {canDeleteTransaction && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                  openModal({
                                    title: t("delete"),

                                    view: (
                                      <DeleteTransaction
                                        transactionIds={[transaction.id]}
                                      />
                                    ),
                                  });
                                }}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                                {t("delete")}
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
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
          className="text-muted-foreground size-4"
          aria-hidden="true"
        />
      ) : status === "VALIDATED" ? (
        <CheckCircledIcon
          className="text-muted-foreground size-4"
          aria-hidden="true"
        />
      ) : (
        <StopwatchIcon
          className="text-muted-foreground size-4"
          aria-hidden="true"
        />
      )}
      <span className="capitalize">{t(status)}</span>
    </FlatBadge>
  );
}
