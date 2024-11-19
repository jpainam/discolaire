import { Fragment } from "react";
import Link from "next/link";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbTransactionDollar } from "react-icons/tb";

import { getServerTranslations } from "@repo/i18n/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { routes } from "~/configs/routes";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const { t, i18n } = await getServerTranslations();
  //const school = await api.school.getSchool();

  const account = await api.studentAccount.getByStudentId(id);
  if (!account) {
    throw new Error("Account not found");
  }
  const statements = await api.studentAccount.getStatements({ studentId: id });

  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    month: "short",
    year: "numeric",
    day: "numeric",
  });

  const totalPeriodPerMonths: Record<string, number> = {};
  statements.forEach((item) => {
    const month = item.transactionDate.getMonth();
    if (item.type == "DEBIT") {
      totalPeriodPerMonths[month] =
        (totalPeriodPerMonths[month] ?? 0) - item.amount;
    } else {
      totalPeriodPerMonths[month] =
        (totalPeriodPerMonths[month] ?? 0) + item.amount;
    }
  });

  const balance = statements.reduce((acc, item) => {
    return acc + (item.type == "DEBIT" ? -item.amount : item.amount);
  }, 0);
  let currentMonth: number | null = null;

  let previousDate: Date | null = null;

  return (
    <Table className="border-b font-mono text-xs">
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>{t("transaction_date")}</TableHead>
          <TableHead>{t("transactionRef")}</TableHead>
          <TableHead>{t("reference")}</TableHead>
          <TableHead>{t("description")}</TableHead>
          <TableHead>{t("debit")}</TableHead>
          <TableHead>{t("credit")}</TableHead>
          <TableHead>{t("balance")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {statements.map((item, index: number) => {
          const amount = item.amount.toLocaleString(i18n.language, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          });

          const itemMonth = item.transactionDate.getMonth();

          let subtotal = null;
          if (
            currentMonth !== null &&
            currentMonth !== itemMonth &&
            previousDate
          ) {
            subtotal = (
              <SubTotal
                key={`subtotal-${currentMonth}`}
                totalperiod={totalPeriodPerMonths[currentMonth] ?? 0}
                previousDate={previousDate}
              />
            );
          }

          // eslint-disable-next-line react-compiler/react-compiler
          currentMonth = itemMonth;
          previousDate = item.transactionDate;

          return (
            <Fragment key={`${item.transactionRef}-${index}`}>
              {subtotal}
              <TableRow>
                <TableCell>{dateFormat.format(item.transactionDate)}</TableCell>
                <TableCell>
                  <Link
                    href={
                      item.operation == "fee"
                        ? routes.classrooms.fees(`${item.id}`)
                        : routes.students.transactions.details(
                            id,
                            Number(item.id),
                          )
                    }
                    className="text-blue-700 hover:underline"
                  >
                    {item.transactionRef}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex flex-row items-center gap-2">
                    {item.operation == "fee" ? (
                      <LiaFileInvoiceDollarSolid className="h-4 w-4" />
                    ) : (
                      <TbTransactionDollar className="h-4 w-4" />
                    )}
                    {t(item.reference.toLowerCase())} / {item.classroom}
                  </div>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.type == "DEBIT" ? amount : ""}</TableCell>
                <TableCell>{item.type !== "DEBIT" ? amount : ""}</TableCell>
                <TableCell>
                  {Math.abs(balance).toLocaleString(i18n.language, {
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                  })}
                  {balance > 0 ? " cr" : ""}
                </TableCell>
              </TableRow>
            </Fragment>
          );
        })}
        {/* Add final subtotal if there are any statements */}

        {/* {statements.length > 0 && previousDate && (
          <SubTotal
            key="final-subtotal"
            totalperiod={totalperiod}
            previousDate={previousDate}
          />
        )} */}
        <TableRow className="font-bold">
          <TableCell colSpan={2}>{account.name}</TableCell>
          <TableCell colSpan={4}>{t("total_for_account")}</TableCell>
          <TableCell>
            {Math.abs(balance).toLocaleString(i18n.language, {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            })}
            {balance > 0 ? " cr" : ""}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

async function SubTotal({
  totalperiod,
  previousDate,
}: {
  totalperiod: number;
  previousDate: Date;
}) {
  const { t, i18n } = await getServerTranslations();
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    month: "numeric",
    year: "numeric",
  });
  const amount = Math.abs(totalperiod).toLocaleString(i18n.language, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
  return (
    <TableRow className="font-sans font-bold">
      <TableCell colSpan={3}></TableCell>
      <TableCell>
        {dateFormat.format(previousDate)} {t("total_for_period")}
      </TableCell>
      <TableCell>{totalperiod < 0 ? amount : ""}</TableCell>
      <TableCell>{totalperiod > 0 ? amount : ""}</TableCell>
    </TableRow>
  );
}
