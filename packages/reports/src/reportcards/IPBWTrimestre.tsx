import { Document, Page, Text, View } from "@react-pdf/renderer";

import "../fonts";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";
import { IPBWStudentInfo } from "./IPBWStudentInfo";

//const W = ["40%", "6%", "6%", "6%", "6%", "6%", "10%", "10%"];

export function IPBWTrimestre({
  school,
  classroom,
  schoolYear,
  student,
  contact,
  title,
}: {
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  classroom: NonNullable<RouterOutputs["classroom"]["get"]>;
  schoolYear: RouterOutputs["schoolYear"]["get"];
  student: RouterOutputs["student"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
  title: string;
}) {
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 7,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Roboto",
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <IPBWHeader school={school} />
          <View
            style={{
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                fontSize: 10,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 9,
              }}
            >
              Année scolaire {schoolYear.name}
            </Text>
          </View>
          <IPBWStudentInfo
            student={{
              firstName: student.firstName,
              lastName: student.lastName,
              gender: student.gender ?? "male",
              isRepeating: student.isRepeating,
              dateOfBirth: student.dateOfBirth,
              placeOfBirth: student.placeOfBirth,
            }}
            classroom={classroom}
            contact={contact}
          />
        </View>
      </Page>
    </Document>
  );
}
