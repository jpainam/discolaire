import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { IPBWHeader } from "../headers/IPBWHeader";

export function AccessLogs({
  school,
  logs,
}: {
  school: RouterOutputs["school"]["getSchool"];
  logs: RouterOutputs["user"]["loginActivities"];
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
            <Text>Access Logs</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ width: "15%" }}>
              <Text>User</Text>
            </View>
            <View style={{ width: "40%" }}>
              <Text>Ip Address</Text>
            </View>
            <View style={{ width: "35%" }}>
              <Text>Agent</Text>
            </View>
            <View style={{ width: "10%" }}>
              <Text>Date</Text>
            </View>
          </View>

          {logs.map((log, index) => {
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
                  <Text>{log.user.name}</Text>
                </View>
                <View style={{ width: "40%" }}>
                  <Text>{log.ipAddress}</Text>
                </View>
                <View style={{ width: "35%" }}>
                  <Text>{log.userAgent}</Text>
                </View>
                <View style={{ width: "10%" }}>
                  <Text>{log.loginDate.toLocaleDateString()}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
}
