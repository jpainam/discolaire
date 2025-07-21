import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function GradesheetList({
  student,
  grades,
  school,
}: {
  student: RouterOutputs["student"]["get"];
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
              <Text style={{ width: "40%", paddingHorizontal: 2 }}>
                Matière
              </Text>
              <Text style={{ width: "10%" }}>Note 1</Text>
              <Text style={{ width: "10%" }}>Note 2</Text>
              <Text style={{ width: "10%" }}>Note 3</Text>
              <Text style={{ width: "10%" }}>Note 4</Text>
              <Text style={{ width: "10%" }}>Note 5</Text>
              <Text style={{ width: "10%" }}>Note 6</Text>
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
                  <Text style={{ width: "40%", paddingHorizontal: 2 }}>
                    {grade.subject}
                  </Text>
                  <Text style={{ width: "10%" }}>{grade.grade1}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade2}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade3}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade4}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade5}</Text>
                  <Text style={{ width: "10%" }}>{grade.grade6}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
