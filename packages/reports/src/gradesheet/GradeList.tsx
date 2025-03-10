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
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  gradesheet: NonNullable<RouterOutputs["gradeSheet"]["get"]>;
  grades: RouterOutputs["gradeSheet"]["grades"];
}) {
  const maxGrade = Math.max(...grades.map((grade) => grade.grade));
  const minGrade = Math.min(...grades.map((grade) => grade.grade));
  const grades10 = grades.filter((grade) => grade.grade >= 10).length;
  const len = grades.filter((grade) => !grade.isAbsent).length || 1e9;

  const males10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "male",
    ).length / len;

  const females10Rate =
    grades.filter(
      (grade) => grade.grade >= 10 && grade.student.gender == "female",
    ).length / len;

  const dateFormatter = Intl.DateTimeFormat("fr", {
    day: "numeric",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
  const average = grades.reduce((acc, grade) => acc + grade.grade, 0) / len;
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
            <Text>SITUATION FINANCIERE</Text>
            <Text></Text>
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
              <Text>Total des frais à payer: </Text>
              <Text>Total dûe: </Text>
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
                    style={{ width: "40%", paddingLeft: 5, paddingVertical: 3 }}
                  >
                    <Text>
                      {decode(grade.student.lastName ?? "")}{" "}
                      {decode(grade.student.firstName ?? "")}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{grade.student.isRepeating ? "OUI" : "NON"}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{grade.grade}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{grade.isAbsent ? "OUI" : ""}</Text>
                  </View>
                  <View
                    style={{
                      width: "5%",
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
