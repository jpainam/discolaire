import { Document, Page, Text, View } from "@react-pdf/renderer";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function FinanceList({
  school,
  students,
  amountDue,
  classroom,
  lang = "fr",
  type = "all",
  total,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  students: RouterOutputs["classroom"]["studentsBalance"];
  amountDue: number;
  type: "all" | "debit" | "credit" | "selected";
  total: number;
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
              fontSize: 12,
            }}
          >
            <Text>SITUATION FINANCIERE</Text>
            <Text>
              {type == "credit"
                ? "Liste des créditeurs"
                : type == "debit"
                  ? "Liste des débiteurs"
                  : type == "selected"
                    ? "Une sélection"
                    : ""}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              gap: 4,
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            <Text>Classe: {classroom.name}</Text>
            <Text>Effectif: {classroom.size}</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>
                Total des frais à payer:{" "}
                {amountDue
                  .toLocaleString(lang, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                    style: "currency",
                    currency: school.currency,
                  })
                  .replace(/\s/g, " ")}
              </Text>
              <Text>
                Total dûe:{" "}
                {total
                  .toLocaleString("fr-FR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                    style: "currency",
                    currency: school.currency,
                  })
                  .replace(/\s/g, " ")}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              border: "1px solid black",
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                fontWeight: "bold",
              }}
            >
              <View
                style={{
                  width: "4%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>No</Text>
              </View>
              <View
                style={{ width: "40%", paddingLeft: 5, paddingVertical: 3 }}
              >
                <Text>Nom et Prénom</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Redoublant</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Total versé</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Restant</Text>
              </View>
              <View style={{ width: "5%" }}>
                <Text></Text>
              </View>
            </View>
            {students.map((student, index) => {
              const remaining = student.balance - amountDue;
              if (type == "credit" && remaining < 0) {
                return null;
              }
              if (type == "debit" && remaining > 0) {
                return null;
              }
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderTop: "1px solid black",
                  }}
                >
                  <View
                    style={{
                      width: "4%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text> {index + 1}</Text>
                  </View>
                  <View
                    style={{ width: "40%", paddingLeft: 5, paddingVertical: 3 }}
                  >
                    <Text>
                      {decode(student.lastName ?? "")}{" "}
                      {decode(student.firstName ?? "")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{student.isRepeating ? "OUI" : "NON"}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{student.balance}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{-1 * remaining}</Text>
                  </View>
                  <View
                    style={{
                      width: "5%",
                      backgroundColor:
                        remaining < 0
                          ? "red"
                          : remaining > 0
                            ? "green"
                            : "yellow",
                    }}
                  >
                    <Text>
                      {remaining < 0 ? "#D#" : remaining > 0 ? "#C#" : "#C#"}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
