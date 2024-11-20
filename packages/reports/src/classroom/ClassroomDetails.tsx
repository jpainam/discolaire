import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

//import { getServerTranslations } from "@repo/i18n/server";

export function ClassroomDetails({
  school,
  classroom,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
}) {
  //const { t } = await getServerTranslations();
  return (
    <Document>
      <Page
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
            flexDirection: "column",
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text>{"name"}</Text>
            <Text>{classroom.name}</Text>
            <Text>{school.name}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
