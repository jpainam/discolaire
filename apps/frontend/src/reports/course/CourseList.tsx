import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

//import { getServerTranslations } from "~/i18n/server";

import { getHeader } from "../headers";

export function CourseList({
  school,
  courses,
  schoolYear,
}: {
  school: RouterOutputs["school"]["getSchool"];
  courses: RouterOutputs["course"]["all"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
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
            <Text>Liste des matières</Text>
            <Text>{schoolYear.name}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ width: "15%" }}>
              <Text>Code</Text>
            </View>
            <View style={{ width: "40%" }}>
              <Text>Libelle</Text>
            </View>
            <View style={{ width: "35%" }}>
              <Text>Nom Court</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Active</Text>
            </View>
          </View>

          {courses.map((course, index) => {
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
                <View style={{ width: "15%" }}>
                  <Text>{course.shortName}</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>{course.name}</Text>
                </View>
                <View style={{ width: "35%" }}>
                  <Text>{course.reportName}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text>{course.isActive ? "OUI" : "NON"}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
