import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

//import { getServerTranslations } from "~/i18n/server";

export function ClassroomStudentList({
  school,
  students,
  classroom,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  students: RouterOutputs["classroom"]["students"];
}) {
  const w = [0.1, 0.3, 0.3, 0.2, 0.1];

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
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
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
              fontSize: 10,
            }}
          >
            <Text>{classroom.name}</Text>
            <Text>{classroom.schoolYear.name}</Text>
            <Text>Liste des élèves</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: w[0] }}>
              <Text>{"No"}</Text>
            </View>
            <View style={{ flex: w[1] }}>
              <Text>{"Nom"}</Text>
            </View>
            <View style={{ flex: w[2] }}>
              <Text>{"Prenom"}</Text>
            </View>
            <View style={{ flex: w[0] }}>
              <Text>{"Redoub."}</Text>
            </View>
            <View style={{ flex: w[3] }}>
              <Text>{"Date de naiss."}</Text>
            </View>
          </View>
          {students.map((student, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid black",
                  //borderBottom: "1px solid black",
                  padding: "2px",
                }}
              >
                <View style={{ flex: w[0] }}>
                  <Text>{student.registrationNumber}</Text>
                </View>
                <View style={{ flex: w[1] }}>
                  <Text>{student.lastName}</Text>
                </View>
                <View style={{ flex: w[2] }}>
                  <Text>{student.firstName}</Text>
                </View>
                <View style={{ flex: w[0] }}>
                  <Text>{student.isRepeating ? "OUI" : "NON"}</Text>
                </View>
                <View style={{ flex: w[3] }}>
                  <Text>
                    {student.dateOfBirth?.toLocaleDateString("fr", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
export default ClassroomStudentList;
