import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";

interface ReminderLetterProps {
  school: RouterOutputs["school"]["getSchool"];
  classroom: string;
  reminders: {
    studentName: string;
    amount: string;
  }[];
}
export function ReminderLetter({
  school,
  classroom,
  reminders,
}: ReminderLetterProps) {
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          padding: 20,
          backgroundColor: "#fff",
          fontSize: 9,
          fontFamily: "Helvetica",
          color: "#000",
        }}
      >
        {reminders.map((reminder) => {
          return (
            <View style={{ flexDirection: "column" }}>
              <IPBWHeader school={school} />
              <View style={{ marginTop: 20 }}>
                <Text>Lettre de Rappel</Text>
              </View>
              <View style={{ marginTop: 20, justifyContent: "center" }}>
                <Text>
                  Cher parent de l'élève {reminder.studentName}, de la classe de{" "}
                  {classroom}; bien-vouloir s'acquitter du frais (
                  {reminder.amount}) . Passé ce délai, l'administration sera
                  dans l'obligation de le/la mettre hors des cours
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  Sincère amitiés pour votre bonne compréhension
                </Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
}

export default ReminderLetter;
