import { Document, Page, Text, View } from "@react-pdf/renderer";
//import { getServerTranslations } from "~/i18n/server";
import { decode } from "entities";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function ProgramList({
  school,
  subjects,
  classroom,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  subjects:
    | RouterOutputs["classroom"]["subjects"]
    | RouterOutputs["subject"]["get"][];
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
            <Text>Program scolaire </Text>
          </View>

          {subjects.map((subject, index) => {
            return (
              <View key={index} style={{ flexDirection: "column", gap: 2 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 4,
                    fontWeight: "bold",
                    borderBottom: "1px solid black",
                  }}
                >
                  <Text>{subject.course.name}</Text>
                  <Text>{decode(subject.teacher?.lastName ?? "")}</Text>
                  <Text>Coeff. {subject.coefficient}</Text>
                </View>
                <View>{subject.program}</View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
