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
import {
  BadgeCheckIcon,
  Banknote,
  BookCopy,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { TransactionType } from "@repo/db/enums";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Button } from "~/components/ui/button";
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
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { DeleteIcon } from "~/icons";
import { CURRENCY } from "~/lib/constants";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { DeleteTransaction } from "./DeleteTransaction";

export function StudentTransactionTable() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const locale = useLocale();
  const fullDateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const trpc = useTRPC();
  const { data: transactions } = useSuspenseQuery(
    trpc.student.transactions.queryOptions(params.id),
  );
  const queryClient = useQueryClient();

  const canDeleteTransaction = useCheckPermission("transaction.delete");
  const canUpdateTransaction = useCheckPermission("transaction.update");
  const canReadTransaction = useCheckPermission("transaction.read");

  const updateTransactionMutation = useMutation(
    trpc.transaction.updateStatus.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.student.transactions.pathFilter(),
        );
        await queryClient.invalidateQueries(
          trpc.student.getStatements.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  return (
    <div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("transactionRef")}</TableHead>
              <TableHead>{t("transactionType")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("amount")}</TableHead>

              <TableHead></TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <EmptyComponent />
                </TableCell>
              </TableRow>
            )}

            {transactions.map((transaction) => {
              const createdBy = transaction.createdBy;
              const name = createdBy?.name ?? createdBy?.username;
              //const avatar = createdBy?.avatar;
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
                      <Badge appearance={"light"} variant="info">
                        {t("discount")}
                      </Badge>
                    ) : transaction.transactionType == TransactionType.DEBIT ? (
                      <Badge variant="destructive" appearance={"light"}>
                        {t("debit")}
                      </Badge>
                    ) : (
                      <Badge appearance={"light"} variant="success">
                        {t("credit")}
                      </Badge>
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
                    {transaction.amount.toLocaleString(locale, {
                      style: "currency",
                      currency: CURRENCY,
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  {/* <TableCell>
                    <TransactionStatus status={transaction.status} />
                  </TableCell> */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        <Banknote />
                        {transaction.journal?.name}
                      </Badge>

                      <Badge
                        variant="secondary"
                        className={cn(
                          transaction.status == "VALIDATED"
                            ? "bg-blue-500 text-white dark:bg-blue-600"
                            : "bg-red-500 text-white dark:bg-red-600",
                        )}
                      >
                        <BadgeCheckIcon />
                        {t(transaction.status)}
                      </Badge>

                      <Badge variant={"secondary"}>{name}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {(canUpdateTransaction || canDeleteTransaction) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size={"icon"}>
                            <MoreHorizontal aria-hidden="true" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canUpdateTransaction && (
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <BookCopy className="text-muted-foreground h-4 w-4" />
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
                                    <Badge
                                      appearance={"light"}
                                      variant={"success"}
                                    >
                                      <CheckCircledIcon
                                        className="text-muted-foreground size-4"
                                        aria-hidden="true"
                                      />
                                      {t("validate")}
                                    </Badge>
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem
                                    value={"CANCELED"}
                                    className="capitalize"
                                  >
                                    <Badge
                                      appearance={"light"}
                                      variant={"destructive"}
                                    >
                                      <CrossCircledIcon
                                        className="text-muted-foreground size-4"
                                        aria-hidden="true"
                                      />
                                      {t("cancel")}
                                    </Badge>
                                  </DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem
                                    value={"PENDING"}
                                    className="capitalize"
                                  >
                                    <Badge
                                      variant={"warning"}
                                      appearance={"light"}
                                    >
                                      <StopwatchIcon
                                        className="text-muted-foreground size-4"
                                        aria-hidden="true"
                                      />
                                      {t("pending")}
                                    </Badge>
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
                                <DeleteIcon />
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
  const t = useTranslations();
  return (
    <Badge
      size={"xs"}
      appearance={"light"}
      variant={
        status == "VALIDATED"
          ? "success"
          : status == "CANCELED"
            ? "destructive"
            : status == "PENDING"
              ? "warning"
              : "secondary"
      }
    >
      {status === "CANCELED" ? (
        <CrossCircledIcon />
      ) : status === "VALIDATED" ? (
        <CheckCircle />
      ) : (
        <StopwatchIcon />
      )}
      <span className="capitalize">{t(status)}</span>
    </Badge>
  );
}
