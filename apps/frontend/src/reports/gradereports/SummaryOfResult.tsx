// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";
import { IPBWHeader } from "../headers/IPBWHeader";

export async function SummaryOfResult({
  term,
  course,
}: {
  term: RouterOutputs["term"]["get"];
  course: RouterOutputs["course"]["get"];
}) {
  const school = await caller.school.getSchool();
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
            <Text>
              {course.reportName} - {term.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
            }}
          ></View>
        </View>
      </Page>
    </Document>
  );
}
