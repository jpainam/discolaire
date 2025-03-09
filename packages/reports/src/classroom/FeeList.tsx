import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

import { IPBWHeader } from "../headers/IPBWHeader";

//import { getServerTranslations } from "~/i18n/server";

export function FeeList({
  school,
  fees,
  lang = "fr",
  classroom,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  fees: RouterOutputs["classroom"]["fees"];
  lang?: "fr" | "en" | "es";
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
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <IPBWHeader style={{ fontSize: 7 }} school={school} />
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
            <Text>{classroom.name}</Text>
            <Text>{classroom.schoolYear.name}</Text>
            <Text>Frais scolaires</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text>Libellé</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>Montant</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>Echéance</Text>
            </View>
          </View>
          {fees.map((fee, index) => {
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
                <View style={{ width: "50%" }}>
                  <Text>{fee.description}</Text>
                </View>
                <View style={{ width: "20%" }}>
                  <Text>
                    {fee.amount.toLocaleString(lang, {
                      style: "currency",
                      currency: school.currency,
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </Text>
                </View>
                <View style={{ width: "20%" }}>
                  <Text>
                    {fee.dueDate.toLocaleDateString(lang, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
