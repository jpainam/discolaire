import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getFullName } from "~/utils";
import { getHeader } from "../headers";
import { formatCurrency } from "../utils";

export function FinanceList({
  school,
  students,
  amountDues,
  classroom,
  journals,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  students: RouterOutputs["classroom"]["studentsBalance"];
  amountDues: Map<string, number>;
  journals: RouterOutputs["accountingJournal"]["all"];
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
              {new Date().toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
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
                style={{ width: "25%", paddingLeft: 5, paddingVertical: 3 }}
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
                  width: "55%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Total versé</Text>
              </View>
            </View>
            {students.map((student, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderTop: "1px solid black",
                    fontSize: 8,
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
                    style={{ width: "25%", paddingLeft: 5, paddingVertical: 3 }}
                  >
                    <Text>{getFullName(student)}</Text>
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
                      width: "55%",
                      justifyContent: "center",
                      alignItems: "center",
                      //backgroundColor: "red",
                    }}
                  >
                    {journals.map((journal) => {
                      const amountDue = amountDues.get(journal.id) ?? 0;
                      const paid =
                        student.journals.find((j) => j.journalId === journal.id)
                          ?.balance ?? 0;
                      const remaining = amountDue - paid;
                      return (
                        <Text
                          style={{
                            color: remaining > 0 ? "red" : "",
                          }}
                          key={journal.id}
                        >
                          {journal.name}: {formatCurrency(paid)} (Dû:{" "}
                          {formatCurrency(remaining)} )
                        </Text>
                      );
                    })}
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
