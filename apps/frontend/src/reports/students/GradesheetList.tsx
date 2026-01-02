import { Document, Page, Text, View } from "@react-pdf/renderer";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function GradesheetList({
  student,
  grades,
  school,
  schoolYear,
}: {
  student: RouterOutputs["student"]["get"];
  schoolYear: RouterOutputs["schoolYear"]["getCurrent"];
  grades: {
    subject: string;
    grade1: number | null;
    grade2: number | null;
    grade3: number | null;
    grade4: number | null;
    grade5: number | null;
    grade6: number | null;
    observation: string;
  }[];
  school: RouterOutputs["school"]["getSchool"];
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
        <View style={{ flexDirection: "column", display: "flex", gap: 6 }}>
          {getHeader(school, { fontSize: 7 })}
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              fontWeight: "bold",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 12,
              textTransform: "uppercase",
            }}
          >
            <Text>Relevés de note l'élève</Text>
            <Text>
              {student.lastName} {student.firstName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 6,
              }}
            >
              <Text>{student.classroom?.name}</Text>
              <Text>{schoolYear.name}</Text>
            </View>
          </View>
          <View
            style={{
              border: "1px solid black",
              width: "100%",
              flexDirection: "column",
              display: "flex",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                display: "flex",
                fontWeight: "bold",
                borderBottom: "1px solid black",
              }}
            >
              <Text
                style={{
                  width: "40%",
                  borderRight: "1px solid black",
                  paddingHorizontal: 2,
                }}
              >
                Matière
              </Text>
              <HeadItem label="Note 1" />
              <HeadItem label="Note 2" />
              <HeadItem label="Note 3" />
              <HeadItem label="Note 4" />
              <HeadItem label="Note 5" />
              <HeadItem last={true} label="Note 6" />
            </View>
            {grades.map((grade, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    borderBottom:
                      index == grades.length - 1 ? "" : "1px solid black",
                  }}
                  key={index}
                >
                  <View
                    style={{
                      width: "40%",
                      borderRight: "1px solid black",
                      paddingHorizontal: 2,
                    }}
                  >
                    <Text>{decode(grade.subject)}</Text>
                  </View>
                  <GradeItemCell grade={grade.grade1} />
                  <GradeItemCell grade={grade.grade2} />
                  <GradeItemCell grade={grade.grade3} />
                  <GradeItemCell grade={grade.grade4} />
                  <GradeItemCell grade={grade.grade5} />
                  <GradeItemCell last={true} grade={grade.grade6} />
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
function GradeItemCell({
  last = false,
  grade,
}: {
  grade: number | null;
  last?: boolean;
}) {
  return (
    <View
      style={{
        width: "10%",
        paddingVertical: 6,
        borderRight: last ? "" : "1px solid black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{grade}</Text>
    </View>
  );
}
function HeadItem({ last = false, label }: { label: string; last?: boolean }) {
  return (
    <Text
      style={{
        width: "10%",
        textAlign: "center",
        paddingVertical: 6,
        borderRight: last ? "" : "1px solid black",
      }}
    >
      {label}
    </Text>
  );
}
