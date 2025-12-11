import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { getFullName } from "~/utils";
import { getHeader } from "../headers";
import { formatCurrency } from "../utils";

interface ReminderLetterProps {
  school: RouterOutputs["school"]["getSchool"];
  classroom: string;
  dueDate: Date;
  amountDue: number;
  journalId: string;
  students: RouterOutputs["classroom"]["studentsBalance"];
}
export function ReminderLetter({
  school,
  classroom,
  journalId,
  amountDue,
  dueDate,
  students,
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
        {students.map((stud) => {
          const journalBalance = stud.journals.find(
            (j) => j.journalId === journalId,
          );
          if (!journalBalance) {
            return null;
          }
          const solde = journalBalance.balance - amountDue;
          if (solde >= 0) {
            return null;
          }
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
                    {getFullName(stud)}
                  </Text>
                  , de la classe de{" "}
                  <Text style={{ fontWeight: "bold" }}>{classroom}.</Text>{" "}
                  Bien-vouloir s'acquitter de votre solde de{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {formatCurrency(solde)}
                  </Text>{" "}
                  avant le{" "}
                  <Text style={{ fontWeight: "bold", paddingVertical: 2 }}>
                    {dueDate.toLocaleDateString("fr-FR", {
                      year: "numeric",
                      timeZone: "UTC",
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
