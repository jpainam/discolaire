import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";

//import { getServerTranslations } from "~/i18n/server";

export function StudentList({
  school,
  students,
}: {
  school: RouterOutputs["school"]["getSchool"];

  students: RouterOutputs["enrollment"]["enrolled"];
}) {
  const w = [0.1, 0.3, 0.3, 0.2, 0.1];
  //const { t, i18n } = await getServerTranslations();
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          padding: 20,
          fontSize: 9,
          backgroundColor: "#fff",
          fontFamily: "Helvetica",
          color: "#000",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <IPBWHeader school={school} />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 4,
              fontWeight: "bold",
              fontSize: 10,
              marginBottom: 20,
            }}
          >
            <Text>Liste des élèves inscrits</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "3%" }}>
              <Text>{"No"}</Text>
            </View>
            <View style={{ flex: w[0] }}>
              <Text>{"Matric"}</Text>
            </View>
            <View style={{ flex: w[1] }}>
              <Text>{"Nom"}</Text>
            </View>
            <View style={{ flex: w[2] }}>
              <Text>{"Prénom"}</Text>
            </View>

            <View style={{ flex: w[3] }}>
              <Text>{"Classe"}</Text>
            </View>
            <View style={{ flex: w[3] }}>
              <Text>{"D.Naiss"}</Text>
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
                <View style={{ width: "3%" }}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={{ flex: w[0] }}>
                  <Text>{student.registrationNumber}</Text>
                </View>
                <View style={{ flex: w[1] }}>
                  <Text>{student.lastName}</Text>
                </View>
                <View style={{ flex: w[2] }}>
                  <Text>{student.firstName}</Text>
                </View>
                <View style={{ flex: w[2] }}>
                  <Text>{student.classroom?.reportName}</Text>
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

export default StudentList;
