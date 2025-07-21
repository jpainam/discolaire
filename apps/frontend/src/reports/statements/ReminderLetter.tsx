import { Document, Page, Text, View } from "@react-pdf/renderer";
import { toZonedTime } from "date-fns-tz";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

interface ReminderLetterProps {
  school: RouterOutputs["school"]["getSchool"];
  classroom: string;
  dueDate: Date;
  reminders: {
    studentName: string;
    amount: string;
  }[];
}
export function ReminderLetter({
  school,
  classroom,
  dueDate,
  reminders,
}: ReminderLetterProps) {
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
        {reminders.map((reminder) => {
          return (
            <View style={{ flexDirection: "column", marginBottom: 40 }}>
              {getHeader(school)}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                <Text>Lettre de Rappel</Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  fontSize: 10,
                }}
              >
                <Text>
                  Cher parent de l'élève{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {reminder.studentName}
                  </Text>
                  , de la classe de{" "}
                  <Text style={{ fontWeight: "bold" }}>{classroom}.</Text>{" "}
                  Bien-vouloir s'acquitter de votre solde de{" "}
                  <Text style={{ fontWeight: "bold" }}>{reminder.amount}</Text>{" "}
                  avant le
                  <Text style={{ fontWeight: "bold", paddingVertical: 2 }}>
                    {" "}
                    {}
                    {toZonedTime(dueDate, "UTC").toLocaleDateString("fr-FR", {
                      year: "numeric",

                      month: "short",
                      day: "numeric",
                    })}
                    .{" "}
                  </Text>
                  Passé ce délai, l'administration sera dans l'obligation de
                  le/la mettre hors des cours.
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  flexDirection: "column",
                  gap: 5,
                  marginTop: 5,
                }}
              >
                {" "}
                <Text style={{ fontWeight: "bold" }}>
                  Sincère amitiés pour votre bonne compréhension
                </Text>
                <Text style={{ fontWeight: "bold" }}>La Direction</Text>
              </View>
              <View style={{ marginTop: 38 }}></View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export default ReminderLetter;
