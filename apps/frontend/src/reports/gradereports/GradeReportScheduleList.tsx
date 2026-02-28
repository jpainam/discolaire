import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

type Term = RouterOutputs["term"]["all"][number];
type TermReportConfig = RouterOutputs["termReportConfig"]["all"][number];

function formatDate(date: Date | null | undefined, locale = "fr-FR"): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GradeReportScheduleList({
  school,
  schoolYear,
  terms,
  schedules,
}: {
  school: RouterOutputs["school"]["getSchool"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  terms: Term[];
  schedules: TermReportConfig[];
}) {
  const scheduleByTermId = new Map<string, TermReportConfig>(
    schedules.map((s) => [s.termId, s]),
  );

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
        <View style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
              marginBottom: 8,
            }}
          >
            <Text>Calendrier des examens et bulletins</Text>
            <Text>{schoolYear.name}</Text>
          </View>

          {/* Table header */}
          <View
            style={{
              flexDirection: "row",
              fontWeight: "bold",
              borderBottom: "1px solid black",
              paddingBottom: 4,
            }}
          >
            <View style={{ width: "22%" }}>
              <Text>Période</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Statut</Text>
            </View>
            <View style={{ width: "28%" }}>
              <Text>Début examens</Text>
            </View>
            <View style={{ width: "28%" }}>
              <Text>Fin examens</Text>
            </View>
            <View style={{ width: "28%" }}>
              <Text>Publication bulletins</Text>
            </View>
          </View>

          {terms.map((term, index) => {
            const schedule = scheduleByTermId.get(term.id);
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid #e5e7eb",
                  padding: "3px 2px",
                }}
              >
                <View style={{ width: "22%" }}>
                  <Text>{term.name}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text>{term.isActive ? "Actif" : "Inactif"}</Text>
                </View>
                <View style={{ width: "28%" }}>
                  <Text>{formatDate(schedule?.examStartDate)}</Text>
                </View>
                <View style={{ width: "28%" }}>
                  <Text>{formatDate(schedule?.examEndDate)}</Text>
                </View>
                <View style={{ width: "28%" }}>
                  <Text>{formatDate(schedule?.resultPublishedAt)}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
