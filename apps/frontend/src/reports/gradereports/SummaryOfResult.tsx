// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";
import { IPBWHeader } from "../headers/IPBWHeader";

export async function SummaryOfResult({
  globalRanks,
  term,
  students,
  classroom,
}: {
  globalRanks: RouterOutputs["reportCard"]["getSequence"]["globalRanks"];
  students: RouterOutputs["classroom"]["students"];

  term: RouterOutputs["term"]["get"];
  classroom: RouterOutputs["classroom"]["get"];
}) {
  const school = await caller.school.getSchool();
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  return (
    <Document>
      <Page
        size={"A4"}
        orientation="landscape"
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
            <Text>SYNTHESE - RECAPITULATIVE DES RESULTATS</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "45%",
                flexDirection: "column",
                display: "flex",
                border: "1px solid black",
              }}
            >
              <View style={{ flexDirection: "row", display: "flex" }}>
                <View
                  style={{
                    width: "65%",
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>PERIODE</Text>
                </View>
                <View style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
                  <Text>{term.name}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid black",
                  display: "flex",
                }}
              >
                <View
                  style={{
                    width: "65%",
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>CLASSE</Text>
                </View>
                <View style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
                  <Text>{classroom.name}</Text>
                </View>
              </View>
            </View>

            <View
              style={{
                border: "1px solid black",
                width: "45%",
              }}
            >
              <Text>ANNEE SCOLAIRE {term.schoolYear.name}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
