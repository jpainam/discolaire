import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getAppreciations } from "~/utils/appreciations";
import { getHeader } from "../headers";

export function GradeList({
  student,
  grades,
  school,
  schoolYear,
}: {
  student: RouterOutputs["student"]["get"];
  grades: RouterOutputs["student"]["grades"];
  school: RouterOutputs["school"]["getSchool"];
  schoolYear: RouterOutputs["schoolYear"]["getCurrent"];
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
            <Text>Liste des notes de l'élève</Text>
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
                paddingVertical: 6,
              }}
            >
              <Text style={{ width: "10%" }}></Text>
              <Text style={{ width: "40%" }}>Matière</Text>
              <Text style={{ width: "20%" }}>Description</Text>
              <Text style={{ width: "10%" }}>Note</Text>
              <Text style={{ width: "15%" }}>Date</Text>
              <Text style={{ width: "10%" }}></Text>
            </View>
            {grades.map((grade, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    borderBottom:
                      index == grades.length - 1 ? "" : "1px solid black",
                    paddingVertical: 6,
                  }}
                  key={index}
                >
                  <Text style={{ width: "10%" }}>
                    {" "}
                    {grade.gradeSheet.term.shortName}
                  </Text>
                  <Text style={{ width: "40%" }}>
                    {grade.gradeSheet.subject.course.reportName}
                  </Text>
                  <Text style={{ width: "20%" }}>{grade.gradeSheet.name}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade}</Text>
                  <Text style={{ width: "15%" }}>
                    {grade.gradeSheet.createdAt.toLocaleDateString()}
                  </Text>
                  <Text style={{ width: "10%" }}>
                    {getAppreciations(grade.grade)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default GradeList;
