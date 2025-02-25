import { Document, Image, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

//import { getServerTranslations } from "~/i18n/server";

export function ClassroomList({
  school,
  classrooms,
  size = "a4",
}: {
  school: RouterOutputs["school"]["getSchool"];
  size: "a4" | "letter";
  classrooms: RouterOutputs["classroom"]["all"];
}) {
  const w = [0.1, 0.3, 0.3, 0.2, 0.1];
  //const { t, i18n } = await getServerTranslations();
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
            marginBottom: 20,
            flex: 1,
            alignItems: "center",
          }}
        >
          {school.logo && (
            <Image
              src={school.logo}
              style={{
                width: 100,
                height: 80,
              }}
            />
          )}
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 4,
            fontWeight: "bold",
            fontSize: 12,
            marginBottom: 20,
          }}
        >
          <Text>{school.name}</Text>
          <Text>{school.name}</Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: w[0] }}>
            <Text>{"No"}</Text>
          </View>
          <View style={{ flex: w[1] }}>
            <Text>{"lastName"}</Text>
          </View>
          <View style={{ flex: w[2] }}>
            <Text>{"firstName"}</Text>
          </View>
          <View style={{ flex: w[3] }}>
            <Text>{"dateOfBirth"}</Text>
          </View>
        </View>
        {classrooms.map((classroom, index) => {
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
                <Text>{classroom.name}</Text>
              </View>
              <View style={{ flex: w[1] }}>
                <Text>{classroom.headTeacher?.firstName}</Text>
              </View>
              <View style={{ flex: w[2] }}>
                <Text>{classroom.reportName}</Text>
              </View>
              <View style={{ flex: w[3] }}>
                <Text></Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export default ClassroomList;
