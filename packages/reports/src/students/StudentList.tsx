import { Document, Image, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

//import { getServerTranslations } from "@repo/i18n/server";

export function StudentList({
  school,
  students,
  size = "a4",
}: {
  school: RouterOutputs["school"]["getSchool"];
  size: "a4" | "letter";

  students: RouterOutputs["student"]["all"];
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
      </Page>
    </Document>
  );
}

export default StudentList;
