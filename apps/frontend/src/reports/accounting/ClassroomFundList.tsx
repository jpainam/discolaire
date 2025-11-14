import { Document, Page, Text, View } from "@react-pdf/renderer";

//import { getServerTranslations } from "~/i18n/server";

import type { RouterOutputs } from "@repo/api";
import { TransactionStatus } from "@repo/db/enums";

import { getFullName } from "~/utils";
import { getHeader } from "../headers";
import { formatCurrency } from "../utils";

const signedAmount = (
  txType: "DEBIT" | "CREDIT" | "DISCOUNT",
  amount: number,
) => {
  if (txType === "DEBIT") return -Math.abs(amount);
  return Math.abs(amount);
};

const sum = (n: number[]) => {
  return n.reduce((a, b) => a + b, 0);
};

export function ClassroomFundList({
  school,
  transactions,
  students,
  classroom,
  fees,
  schoolYear,
}: {
  school: RouterOutputs["school"]["getSchool"];
  fees: RouterOutputs["classroom"]["fees"];
  classroom: RouterOutputs["classroom"]["get"];
  transactions: RouterOutputs["transaction"]["all"];
  students: RouterOutputs["classroom"]["students"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
}) {
  const totalFees = sum(fees.map((f) => f.amount));
  const balances = new Map<string, number>();

  for (const tx of transactions) {
    let prev = balances.get(tx.studentId) ?? 0;
    prev += signedAmount(tx.transactionType, tx.amount);
    balances.set(tx.studentId, prev);
  }

  const validatedTransactions = transactions
    .filter((t) => t.status == TransactionStatus.VALIDATED)
    .map((t) => t.amount);

  const pendingTransactions = transactions
    .filter((t) => t.status == TransactionStatus.PENDING)
    .map((t) => t.amount);

  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 10,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {getHeader(school, { fontSize: 7 })}
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              fontWeight: "bold",
              gap: 4,
              justifyContent: "center",
              alignItems: "center",
              fontSize: 10,
            }}
          >
            <Text>Compte caisse {classroom.name}</Text>
            <Text>{schoolYear.name}</Text>
          </View>
          <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
            <Text>Montant validé : {sum(validatedTransactions)}</Text>
            <Text>En Attente : {sum(pendingTransactions)}</Text>
            <Text>Total des frais : {totalFees}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ width: "55%" }}>
              <Text>Eleve</Text>
            </View>
            <View style={{ width: "15%" }}>
              <Text>Montant</Text>
            </View>
            <View style={{ width: "15%" }}>
              <Text>Reste</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Status</Text>
            </View>
          </View>

          {students.map((stud, index) => {
            const b = balances.get(stud.id) ?? 0;
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid black",
                  //borderBottom: "1px solid black",
                  padding: "2px",
                }}
              >
                <View style={{ width: "55%" }}>
                  <Text>{getFullName(stud)}</Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text>{formatCurrency(b)}</Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text>{formatCurrency(b - totalFees)}</Text>
                </View>

                <View
                  style={{
                    width: "10%",
                    alignItems: "center",
                    backgroundColor: b < totalFees ? "red" : "green",
                  }}
                >
                  <Text>{b < totalFees ? "DEBIT" : "CREDIT"}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
