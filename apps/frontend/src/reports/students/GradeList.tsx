import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

import { IPBWHeader } from "../headers/IPBWHeader";
import { getAppreciations } from "../utils";

export function GradeList({
  student,
  grades,
  school,
}: {
  student: RouterOutputs["student"]["get"];
  grades: RouterOutputs["student"]["grades"];
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
          fontFamily: "Roboto",
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
              <Text style={{ width: "20%" }}>Séquence</Text>
              <Text style={{ width: "20%" }}>Matière</Text>
              <Text style={{ width: "20%" }}>Description</Text>
              <Text style={{ width: "10%" }}>Note</Text>
              <Text style={{ width: "15%" }}>Date</Text>
              <Text style={{ width: "20%" }}>Appréciation</Text>
            </View>
            {grades.map((grade, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    borderBottom: "1px solid black",
                    paddingVertical: 6,
                  }}
                  key={index}
                >
                  <Text style={{ width: "20%" }}>
                    {grade.gradeSheet.term.name}
                  </Text>
                  <Text style={{ width: "20%" }}>
                    {grade.gradeSheet.subject.course.reportName}
                  </Text>
                  <Text style={{ width: "20%" }}>{grade.gradeSheet.name}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade}</Text>
                  <Text style={{ width: "15%" }}>
                    {grade.gradeSheet.createdAt.toLocaleDateString()}
                  </Text>
                  <Text style={{ width: "20%" }}>
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
