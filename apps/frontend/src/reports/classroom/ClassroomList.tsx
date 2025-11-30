import { Document, Page, Text, View } from "@react-pdf/renderer";
//import { getServerTranslations } from "~/i18n/server";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function ClassroomList({
  school,
  classrooms,
  size = "a4",
}: {
  school: RouterOutputs["school"]["getSchool"];
  size: "a4" | "letter";
  classrooms: RouterOutputs["classroom"]["all"];
}) {
  const w = [0.3, 0.3, 0.3, 0.1, 0.1];

  return (
    <Document>
      <Page
        size={size.toUpperCase() as "LETTER" | "A4"}
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
          {getHeader(school)}

          <Text
            style={{
              alignSelf: "center",
              fontSize: 12,
              fontWeight: "bold",
            }}
          >
            Liste des classes
          </Text>

          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: w[0] }}>
              <Text>{"Nom"}</Text>
            </View>

            <View style={{ flex: w[1] }}>
              <Text>{"Nom court"}</Text>
            </View>

            <View style={{ flex: w[2] }}>
              <Text>{"Prof. Princ"}</Text>
            </View>
            <View style={{ flex: w[3] }}>
              <Text>{"Effectif"}</Text>
            </View>
          </View>
          {classrooms.map((classroom, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid black",
                  paddingVertical: 2,
                  //borderBottom: "1px solid black",
                }}
              >
                <View style={{ flex: w[0] }}>
                  <Text>{classroom.name}</Text>
                </View>
                <View style={{ flex: w[1] }}>
                  <Text>{classroom.reportName}</Text>
                </View>
                <View style={{ flex: w[2] }}>
                  <Text>{decode(classroom.headTeacher?.firstName ?? "")}</Text>
                </View>
                <View style={{ flex: w[3] }}>
                  <Text>{classroom.size}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}

export default ClassroomList;
