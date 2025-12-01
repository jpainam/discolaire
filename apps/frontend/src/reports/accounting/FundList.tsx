import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";
import { formatCurrency } from "../utils";

export function FundList({
  school,
  quotas,
  schoolYear,
}: {
  school: RouterOutputs["school"]["getSchool"];
  quotas: RouterOutputs["transaction"]["quotas"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
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
            <Text>Compte caisse global</Text>
            <Text>{schoolYear.name}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ width: "40%" }}>
              <Text>Classe</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Effectif</Text>
            </View>
            <View style={{ width: "15%" }}>
              <Text>Total attendu</Text>
            </View>
            <View style={{ width: "15%" }}>
              <Text>Montant recu</Text>
            </View>
            <View style={{ width: "15%" }}>
              <Text>Difference</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Status</Text>
            </View>
          </View>

          {quotas.map((q, index) => {
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
                <View style={{ width: "40%" }}>
                  <Text>{q.classroom}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text>{q.effectif}</Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text>{formatCurrency(q.revenue)}</Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text>{formatCurrency(q.paid)}</Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text>{formatCurrency(q.remaining)}</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    backgroundColor: q.paid < q.revenue ? "red" : "green",
                  }}
                >
                  <Text>{q.paid < q.revenue ? "DEBIT" : "CREDIT"}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
