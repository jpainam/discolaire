import { Document, Page, Text, View } from "@react-pdf/renderer";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function SubjectList({
  school,
  subjects,
  classroom,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
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
            <Text>Liste des enseignements</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "20%" }}>
              <Text>Nom</Text>
            </View>
            <View style={{ width: "20%" }}>
              <Text>Nom court</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Groupe</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Coefficient</Text>
            </View>
            <View style={{ width: "5%" }}>
              <Text>Ordre</Text>
            </View>
            <View style={{ width: "25%" }}>
              <Text>Prof.</Text>
            </View>
          </View>
          {subjects.map((subject, index) => {
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
                <View style={{ width: "20%" }}>
                  <Text>{subject.course.name}</Text>
                </View>
                <View style={{ width: "20%" }}>
                  <Text>{subject.course.reportName}</Text>
                </View>
                <View style={{ width: "15%" }}>
                  <Text>{subject.subjectGroup?.name}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text>{subject.coefficient}</Text>
                </View>
                <View style={{ width: "5%" }}>
                  <Text>{subject.order}</Text>
                </View>
                <View style={{ width: "25%" }}>
                  <Text>
                    {subject.teacher?.prefix}{" "}
                    {decode(subject.teacher?.lastName ?? "")}
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
