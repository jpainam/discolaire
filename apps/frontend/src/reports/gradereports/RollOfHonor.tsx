// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getAppreciations } from "~/utils/appreciations";
import { getHeader } from "../headers";

export function RollOfHonor({
  school,
  reports,
  classroom,
  term,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  term: RouterOutputs["term"]["get"];
  reports: {
    registrationNumber: string | null;
    studentName: string;
    dateOfBirth: Date | null;
    isRepeating: boolean;
    grade: number;
    observation: string;
  }[];
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
            <Text>TABLEAU D'HONNEUR</Text>
            <Text>
              {classroom.name} - {term.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                display: "flex",
                border: "1px solid black",
              }}
            >
              <Item label="N" width="5%" />
              <Item label="Matricule" width="12%" />
              <Item label="Noms et Prénoms" width="35%" />
              <Item label="Date/LieuNaiss" width="15%" />
              <Item label="Redou." width="10%" />
              <Item label="Moy." width="8%" />
              <Item label="Observation" width="15%" last />
            </View>

            {reports.map((report, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderBottom: "1px solid black",
                    width: "100%",
                    borderLeft: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  <View
                    style={{
                      width: "5%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text> {index + 1}</Text>
                  </View>
                  <View
                    style={{
                      width: "12%",
                      paddingLeft: 5,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{report.registrationNumber}</Text>
                  </View>
                  <View
                    style={{
                      width: "35%",
                      paddingLeft: 5,
                      paddingVertical: 3,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{report.studentName}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      paddingLeft: 5,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{report.dateOfBirth?.toLocaleDateString()}</Text>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{report.isRepeating ? "OUI" : "NON"}</Text>
                  </View>
                  <View
                    style={{
                      width: "8%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{report.grade.toFixed(2)}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      paddingLeft: 3,
                      //borderRight: "1px solid black",
                    }}
                  >
                    <Text>{getAppreciations(report.grade)}</Text>
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

function Item({
  label,
  width,
  last = false,
}: {
  label: string;
  last?: boolean;
  width?: string;
}) {
  return (
    <View
      style={{
        width: width ?? "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 3,
        borderRight: last ? "" : "1px solid black",
      }}
    >
      <Text>{label}</Text>
    </View>
  );
}
