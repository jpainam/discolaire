/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { getServerTranslations } from "~/i18n/server";
import { getHeader } from "../headers";

interface Props {
  student: NonNullable<RouterOutputs["student"]["get"]>;
  statements: RouterOutputs["studentAccount"]["getStatements"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
}

export async function AcccountStatement({
  student,
  school,
  statements,
}: Props) {
  const { i18n } = await getServerTranslations();

  const formatAmount = (amount: number) =>
    amount.toLocaleString(i18n.language, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: "currency",
      currency: "XOF",
    });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      year: "2-digit",
      day: "numeric",
    }).format(date);

  const periodTotals: Record<string, number> = {};
  for (const item of statements) {
    const key = `${item.transactionDate.getFullYear()}-${item.transactionDate.getMonth()}`;
    const signedAmount =
      item.type === "DEBIT" ? -Math.abs(item.amount) : item.amount;
    periodTotals[key] = (periodTotals[key] ?? 0) + signedAmount;
  }

  let runningBalance = 0;
  let currentPeriodKey: string | null = null;
  let previousDate: Date | null = null;

  const totalBalance = statements.reduce(
    (acc, item) =>
      acc +
      (item.type === "DEBIT" ? -Math.abs(item.amount) : Math.abs(item.amount)),
    0,
  );

  return (
    <Document>
      <Page
        size="A4"
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 10,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View style={{ flexDirection: "column", marginBottom: 40 }}>
          {getHeader(school, { fontSize: 7 })}

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              alignSelf: "center",
              marginBottom: 10,
            }}
          >
            RELEVE DE COMPTE
          </Text>

          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              {decode(student.lastName ?? "")} {decode(student.firstName ?? "")}
            </Text>
            <View>
              <Text>Matricule : {student.registrationNumber}</Text>
              <Text>
                Date génération état :{" "}
                {new Date().toLocaleDateString(i18n.language)}
              </Text>
              <Text>
                Période :{" "}
                {`${new Date().getFullYear()}–${new Date().getFullYear() + 1}`}
              </Text>
            </View>
          </View>

          <View
            style={{
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
              paddingVertical: 4,
              flexDirection: "row",
              fontSize: 8,
              fontFamily: "Times-Roman",
            }}
          >
            {[
              { label: "Date", width: "10%" },
              { label: "Réf.Caisse", width: "10%" },
              { label: "Réf. transaction", width: "20%" },
              { label: "Libellé", width: "30%" },
              { label: "Débit", width: "10%" },
              { label: "Crédit", width: "10%" },
              { label: "Balance", width: "10%" },
            ].map(({ label, width }) => (
              <View key={label} style={{ width, alignItems: "center" }}>
                <Text>{label}</Text>
              </View>
            ))}
          </View>

          {statements.map((transaction, index) => {
            const key = `${transaction.transactionDate.getFullYear()}-${transaction.transactionDate.getMonth()}`;
            const subtotalRow = currentPeriodKey &&
              key !== currentPeriodKey &&
              previousDate && (
                <View
                  key={`subtotal-${currentPeriodKey}`}
                  style={{
                    flexDirection: "row",
                    fontSize: 8,
                    fontWeight: "bold",
                    backgroundColor: "#f0f0f0",
                    paddingVertical: 2,
                  }}
                >
                  <View style={{ width: "40%" }} />
                  <View style={{ width: "30%" }}>
                    <Text>
                      {new Intl.DateTimeFormat(i18n.language, {
                        month: "numeric",
                        year: "numeric",
                      }).format(previousDate)}{" "}
                      Total pour la période
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {(periodTotals[currentPeriodKey ?? ""] ?? 0) < 0
                        ? formatAmount(
                            Math.abs(periodTotals[currentPeriodKey ?? ""] ?? 0),
                          )
                        : ""}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {(periodTotals[currentPeriodKey ?? ""] ?? 0) > 0
                        ? formatAmount(
                            periodTotals[currentPeriodKey ?? ""] ?? 0,
                          )
                        : ""}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }} />
                </View>
              );

            const signedAmount =
              transaction.type === "DEBIT"
                ? -Math.abs(transaction.amount)
                : Math.abs(transaction.amount);
            runningBalance += signedAmount;

            previousDate = transaction.transactionDate;
            currentPeriodKey = key;

            return (
              <View key={`row-${index}`}>
                {subtotalRow}
                <View
                  style={{
                    flexDirection: "row",
                    fontSize: 8,
                    fontFamily: "Times-Roman",
                    paddingVertical: 1,
                  }}
                >
                  <View style={{ width: "10%" }}>
                    <Text>{formatDate(transaction.transactionDate)}</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>{transaction.transactionRef.slice(0, 10)}</Text>
                  </View>
                  <View style={{ width: "20%" }}>
                    <Text>
                      {transaction.id.slice(0, 4)} / {transaction.classroom}
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text>{transaction.description}</Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {transaction.type === "DEBIT"
                        ? formatAmount(transaction.amount)
                        : ""}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {transaction.type !== "DEBIT"
                        ? formatAmount(transaction.amount)
                        : ""}
                    </Text>
                  </View>
                  <View style={{ width: "10%" }}>
                    <Text>
                      {formatAmount(Math.abs(runningBalance))}
                      {runningBalance > 0 ? " cr" : ""}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Final Total */}
          <View
            style={{
              flexDirection: "row",
              fontSize: 9,
              fontWeight: "bold",
              paddingTop: 4,
              borderTop: "1px solid black",
              marginTop: 8,
            }}
          >
            <View style={{ width: "30%" }}>
              <Text>
                {decode(student.lastName ?? "")}{" "}
                {decode(student.firstName ?? "")}
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text>Total général du compte</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>
                {formatAmount(Math.abs(totalBalance))}
                {totalBalance > 0 ? " cr" : ""}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default AcccountStatement;
