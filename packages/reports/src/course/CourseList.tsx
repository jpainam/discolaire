import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { IPBWHeader } from "../headers/IPBWHeader";

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
              fontSize: 10,
            }}
          >
            <Text>Liste des matières</Text>
            <Text>{schoolYear.name}</Text>
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
                <View style={{ width: "10%" }}>
                  <Text>{course.shortName}</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>{course.name}</Text>
                </View>
                <View style={{ width: "40%" }}>
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
