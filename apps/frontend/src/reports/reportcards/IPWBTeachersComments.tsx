import { Document, Page, View } from "@react-pdf/renderer";

export function IPBWTeachersComments() {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          paddingVertical: 20,
          paddingHorizontal: 30,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View
          style={{ flexDirection: "column", gap: 8, display: "flex" }}
        ></View>
      </Page>
    </Document>
  );
}
