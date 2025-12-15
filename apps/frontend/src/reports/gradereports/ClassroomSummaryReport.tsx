import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getAppreciations } from "~/utils/appreciations";
import { getHeader } from "../headers";

//const HEADER_TOP_OFFSET = 27;
//const HEADER_HEIGHT = 120;
const COL_WIDTH = 27;

export function ClassroomSummaryReport({
  school,
  title,
  classroom,
  students,
  subjects,
  report,
  disciplines,
}: {
  school: RouterOutputs["school"]["getSchool"];
  title: string;
  classroom: RouterOutputs["classroom"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
  students: RouterOutputs["classroom"]["students"];
  report: RouterOutputs["reportCard"]["getSequence"];
  disciplines: RouterOutputs["discipline"]["sequence"];
}) {
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const { studentsReport, summary: _summary, globalRanks } = report;
  const values = Array.from(globalRanks.values());
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = averages.length == 0 ? 0 : successCount / averages.length;
  const average =
    averages.length == 0
      ? 0
      : averages.reduce((acc, val) => acc + val, 0) / averages.length;
  return (
    <Document>
      <Page
        size={"A4"}
        orientation="landscape"
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
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
            <Text>PROCES VERBAL RECAPITULATIF DES RESULTATS</Text>
          </View>
          <View
            style={{
              marginVertical: 6,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                fontSize: 8,
                justifyContent: "space-between",
              }}
            >
              <Text>{classroom.name}</Text>
              <Text>{title}</Text>
              <Text>{classroom.schoolYear.name}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                fontWeight: "bold",
                fontSize: 8,
                justifyContent: "space-between",
              }}
            >
              <Text>Effectif : {classroom.size}</Text>
              <Text>Moy. Classe : {average.toFixed(2)}</Text>
              <Text>Taux de réussite :{(successRate * 100).toFixed(2)}%</Text>
            </View>
          </View>
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              display: "flex",
              borderTop: "1px solid black",
              borderBottom: "1px solid black",
              marginTop: 6,
              fontSize: 7,
            }}
          >
            <View
              style={{
                paddingLeft: 2,
                paddingVertical: 4,
                borderLeft: "1px solid black",
                width: "15%",
                justifyContent: "center",
              }}
            >
              <Text>Nom & Prenom</Text>
            </View>
            <OtherTitle title={"Red"} />
            {subjects
              .sort((a, b) => a.order - b.order)
              .map((subject, index) => {
                return (
                  <View
                    style={{
                      width: COL_WIDTH,
                      borderLeft: "1px solid black",
                    }}
                    key={`${index}${subject.id}`}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                      }}
                    >
                      {subject.course.shortName.slice(0, 3)}
                    </Text>
                  </View>
                );
              })}
            <OtherTitle width={COL_WIDTH + 6} title={"Total"} />
            {["Moy. Gen", "Rang", "Abs. N.J", " Abs. J", "Consigne", "App"].map(
              (t) => (
                <OtherTitle last={t == "App"} title={t} />
              ),
            )}
          </View>
          <View
            style={{
              fontSize: 7,
            }}
          >
            {Array.from(globalRanks).map(([key, value], index) => {
              const studentReport = studentsReport.get(key);
              const student = studentsMap.get(key);
              if (!studentReport || !student) {
                return null;
              }
              const disc = disciplines.get(student.id);
              return (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    borderBottom: "1px solid black",
                  }}
                  key={`${index}-${student.id}`}
                >
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      paddingLeft: 2,
                      paddingVertical: 4,
                      width: "15%",
                      justifyContent: "center",
                    }}
                  >
                    <Text>
                      {student.lastName ?? student.firstName} (
                      {student.gender?.at(0)?.toUpperCase()})
                    </Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH,
                      //paddingHorizontal: 2,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{student.isRepeating ? "Oui" : "Non"}</Text>
                  </View>
                  {subjects
                    .sort((a, b) => a.order - b.order)
                    .map((subject, index) => {
                      const g = studentReport.studentCourses.find(
                        (c) => c.subjectId === subject.id,
                      )?.average;
                      return (
                        <View
                          key={`grade-${index}${subject.id}`}
                          style={{
                            borderLeft: "1px solid black",
                            width: COL_WIDTH,
                            //paddingHorizontal: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text> {g ? g.toFixed(2) : "-"}</Text>
                        </View>
                      );
                    })}
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH + 6,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>
                      {studentReport.studentCourses
                        .map((c) => c.total)
                        .reduce((a, v) => (a ?? 0) + (v ?? 0), 0)
                        ?.toFixed(1)}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{value.average.toFixed(2)}</Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text> {value.rank}</Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>
                      {disc?.absence
                        ? disc.absence - disc.justifiedAbsence
                        : ""}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{disc?.justifiedAbsence}</Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      width: COL_WIDTH,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{disc?.consigne}</Text>
                  </View>
                  <View
                    style={{
                      borderLeft: "1px solid black",
                      borderRight: "1px solid black",
                      width: COL_WIDTH,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{getAppreciations(average)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View
            style={{
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontStyle: "italic",
                fontSize: 6,
              }}
            >
              Imprimé le{" "}
              {new Date().toLocaleDateString("fr-FR", {
                month: "short",
                year: "numeric",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function OtherTitle({
  width,
  last,
  title,
}: {
  title: string;
  width?: number;
  last?: boolean;
}) {
  return (
    <View
      style={{
        width: width ?? COL_WIDTH,
        borderRight: last ? "1px solid black" : "",
        borderLeft: "1px solid black",
      }}
    >
      <Text
        style={{
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </View>
  );
}
