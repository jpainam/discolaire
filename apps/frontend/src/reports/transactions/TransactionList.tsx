import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

import { IPBWHeader } from "../headers/IPBWHeader";

export function TransactionList({
  transactions,
  school,
}: {
  transactions: RouterOutputs["transaction"]["all"];
  school: RouterOutputs["school"]["getSchool"];
}) {
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
          fontFamily: "Roboto",
        }}
      >
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          {getHeader(school, { fontSize: 7 })}

          <View
            style={{
              flexDirection: "column",
              display: "flex",
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            <Text>Liste des transactions</Text>
            <Text>{/* {student.lastName} {student.firstName} */}</Text>
          </View>
          <View
            style={{
              border: "1px solid black",
              width: "100%",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                fontWeight: "bold",
                borderBottom: "1px solid black",
                paddingVertical: 6,
                fontSize: 8,
              }}
            >
              <Text style={{ width: "10%", paddingLeft: 2 }}>Date</Text>
              <Text style={{ width: "15%" }}>Compte</Text>
              <Text style={{ width: "20%" }}>Ref. Caisse</Text>
              <Text style={{ width: "10%" }}>Type</Text>
              <Text style={{ width: "25%" }}>Description</Text>
              <Text style={{ width: "10%" }}>Montant</Text>
              <Text style={{ width: "10%" }}>Status</Text>
            </View>
            {transactions.map((tra, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    borderBottom:
                      transactions.length - 1 == index ? "" : "1px solid black",
                    paddingVertical: 6,
                    fontSize: 8,
                  }}
                  key={index}
                >
                  <Text style={{ width: "10%", paddingLeft: 2 }}>
                    {tra.createdAt.toLocaleDateString()}
                  </Text>
                  <Text style={{ width: "15%" }}>{tra.student.lastName}</Text>
                  <Text style={{ width: "20%" }}>{tra.transactionRef}</Text>
                  <Text style={{ width: "10%" }}>{tra.transactionType}</Text>
                  <Text style={{ width: "25%" }}>{tra.description}</Text>
                  <Text style={{ width: "10%" }}>
                    {tra.amount.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: school.currency,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </Text>
                  <Text style={{ width: "10%" }}>{tra.status}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default TransactionList;
