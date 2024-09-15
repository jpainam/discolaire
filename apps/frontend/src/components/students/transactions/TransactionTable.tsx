"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircledIcon,
  CrossCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { MoreHorizontal, Trash2 } from "lucide-react";

import type { FlatBadgeVariant } from "@repo/ui/FlatBadge";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { EmptyState } from "@repo/ui/EmptyState";
import FlatBadge from "@repo/ui/FlatBadge";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { routes } from "~/configs/routes";
import { CURRENCY } from "~/lib/constants";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";

export function TransactionTable() {
  const params = useParams<{ id: string }>();
  const { t, i18n } = useLocale();
  const { fullDateFormatter } = useDateFormat();
  const transactionsQuery = api.student.transactions.useQuery(params.id);
  return (
    <div className="mx-2 rounded-lg border">
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
                <TableCell>{transaction.transactionRef}</TableCell>
                <TableCell>{transaction.transactionType}</TableCell>
                <TableCell>
                  {fullDateFormatter.format(transaction.createdAt)}
                </TableCell>
                <TableCell>
                  <Link
                    className="hover:text-blue-600 hover:underline"
                    href={routes.students.transactions.details(
                      params.id,
                      transaction.id,
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
                  {transaction.status && (
                    <TransactionStatus status={transaction.status} />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        aria-label="Open menu"
                        variant="ghost"
                        size={"sm"}
                      >
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="bg-destructive text-destructive-foreground"
                        onSelect={() => {
                          console.log("clicked");
                        }}
                      >
                        <Trash2 className="mr-2 size-4" aria-hidden="true" />
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
  );
}

function TransactionStatus({ status }: { status: string }) {
  const { t } = useLocale();
  let variant = "gray";
  if (status === "VALIDATED") {
    variant = "green";
  } else if (status === "CANCELLED") {
    variant = "pink";
  } else if (status === "IN_PROGRESS") {
    variant = "yellow";
  }

  return (
    <FlatBadge className="gap-2" variant={variant as FlatBadgeVariant}>
      {status === "CANCELLED" ? (
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
