import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";
import { decode } from "entities";

import { IPBWHeader } from "../headers/IPBWHeader";
import { getAppreciations } from "../utils";

export function GradeList({
  school,
  grades,
  classroom,
  gradesheet,
  allGrades,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  gradesheet: NonNullable<RouterOutputs["gradeSheet"]["get"]>;
  grades: RouterOutputs["gradeSheet"]["grades"];
  allGrades: RouterOutputs["gradeSheet"]["grades"];
}) {
  const maxGrade = Math.max(...allGrades.map((grade) => grade.grade));
  const minGrade = Math.min(
    ...allGrades.filter((g) => !g.isAbsent).map((grade) => grade.grade),
  );
  const grades10 = allGrades.filter((grade) => grade.grade >= 10).length;
  const len = allGrades.filter((grade) => !grade.isAbsent).length || 1e9;

  const maleCount = allGrades.filter(
    (grade) => !grade.isAbsent && grade.student.gender == "male",
  ).length;
  const males10Rate =
    allGrades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "male",
    ).length / (maleCount == 0 ? 1e9 : maleCount);

  const femaleCount = allGrades.filter(
    (grade) => !grade.isAbsent && grade.student.gender == "female",
  ).length;
  const females10Rate =
    allGrades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "female",
    ).length / (femaleCount == 0 ? 1e9 : femaleCount);

  const dateFormatter = Intl.DateTimeFormat("fr", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
  const average = allGrades.reduce((acc, grade) => acc + grade.grade, 0) / len;
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
            <Text>FICHE DE REPORT DE NOTES</Text>
            <Text>
              {classroom.name} - {gradesheet.subject.course.reportName} -{" "}
              {gradesheet.term.name}
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "column", gap: 2 }}>
              <Text>
                {gradesheet.subject.course.name} / Coeff.{" "}
                {gradesheet.subject.coefficient}
              </Text>
              <Text>{gradesheet.name}</Text>
              <Text>Prof. {gradesheet.subject.teacher?.lastName}</Text>
            </View>
            <View style={{ flexDirection: "column", gap: 2 }}>
              <Text>{dateFormatter.format(gradesheet.createdAt)}</Text>
              <Text>Echelle: {gradesheet.scale}</Text>
              <Text>Période : {gradesheet.term.name}</Text>
            </View>
            <View style={{ flexDirection: "column", gap: 2 }}>
              <Text>Max Note: {isFinite(maxGrade) ? maxGrade : "-"}</Text>
              <Text>Min Note: {isFinite(minGrade) ? minGrade : "-"}</Text>
              <Text>Note Moy.: {average.toFixed(2)}</Text>
            </View>
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
              <View
                style={{
                  width: "25%",
                  flexDirection: "column",
                  borderRight: "1px solid black",
                }}
              >
                <View
                  style={{
                    borderBottom: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Taux de réussite</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 2 }}>
                  <View
                    style={{
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>Garçons</Text>
                  </View>
                  <View
                    style={{
                      width: "50%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>Filles</Text>
                  </View>
                </View>
              </View>

              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 3,
                  borderRight: "1px solid black",
                }}
              >
                <Text>{"Taux de réussite général"}</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Observation</Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottom: "1px solid black",
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
              }}
            >
              <Item label={len.toString()} />
              <Item label={average.toFixed(2)} />
              <Item label={grades10.toString()} />
              <View
                style={{
                  width: "25%",
                  flexDirection: "row",
                  borderRight: "1px solid black",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{(males10Rate * 100).toFixed(2)}%</Text>
                </View>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "50%",
                  }}
                >
                  <Text>{(females10Rate * 100).toFixed(2)}%</Text>
                </View>
              </View>
              <Item label={((grades10 / len) * 100).toFixed(2) + "%"} />
              <Item last={true} label={getAppreciations(average)} />
            </View>
            {/* Statistic */}
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
                style={{
                  width: "45%",
                  borderRight: "1px solid black",
                  paddingLeft: 5,
                  paddingVertical: 3,
                }}
              >
                <Text>Nom et Prénom</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRight: "1px solid black",
                }}
              >
                <Text>Redoub.</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRight: "1px solid black",
                }}
              >
                <Text>Note</Text>
              </View>
              <View
                style={{
                  width: "10%",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRight: "1px solid black",
                }}
              >
                <Text>Absent</Text>
              </View>
              <Item label="Appréciation" last={true} />
            </View>
            {grades.map((grade, index) => {
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
                    <Text>
                      {decode(grade.student.lastName ?? "")}{" "}
                      {decode(grade.student.firstName ?? "")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "10%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{grade.student.isRepeating ? "OUI" : "NON"}</Text>
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
                    <Text>{grade.isAbsent ? "OUI" : ""}</Text>
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
