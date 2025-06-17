// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { IPBWHeader } from "../headers/IPBWHeader";
import { getAppreciations } from "../utils";

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
              display: "flex",
              fontSize: 10,
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
              <Item label="Effectif évalué" />
              <Item label="Moy. générale de la classe" />
              <Item label="Nombre de notes >= 10" />
            </View>
          </View>
          {reports.map((grade, index) => {
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
                  style={{
                    width: "45%",
                    paddingLeft: 5,
                    paddingVertical: 3,
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{grade.studentName}</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{grade.isRepeating ? "OUI" : "NON"}</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{grade.grade}</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text></Text>
                </View>
                <View
                  style={{
                    width: "20%",
                    paddingLeft: 3,
                  }}
                >
                  <Text>{getAppreciations(grade.grade)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

function Item({ label, last = false }: { label: string; last?: boolean }) {
  return (
    <View
      style={{
        width: "15%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
        borderRight: last ? "" : "1px solid black",
      }}
    >
      <Text>{label}</Text>
    </View>
  );
}
