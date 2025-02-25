import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

const styles = StyleSheet.create({
  cell: {
    padding: 2,
    border: "1px solid black",
  },
});
const subjects = [
  { name: "Dictée", notes: 10 },
  { name: "Questions", notes: 10 },
  { name: "Français", notes: 20 },
  { name: "Écriture", notes: 10 },
  { name: "Expression écrite", notes: 10 },
  { name: "Mathématiques", notes: 20 },
  { name: "Calcul rapide", notes: 10 },
  { name: "Questions de cours", notes: 10 },
  { name: "Arts plastiques", notes: 10 },
  { name: "Anglais", notes: 10 },
  { name: "Lecture", notes: 10 },
  { name: "Poésie", notes: 10 },
  { name: "Informatique", notes: 10 },
  { name: "Éducation musicale", notes: 10 },
  { name: "E.P.S", notes: 10 },
];

interface CSABReportCardProps {
  size?: "letter" | "a4";
  school: RouterOutputs["school"]["getSchool"];
}
export function CSAB({ size = "letter", school }: CSABReportCardProps) {
  const w = [0.2, 0.1, 0.1, 0.2, 0.1, 0.1];
  return (
    <Document>
      <Page
        size={size.toUpperCase() as "LETTER" | "A4"}
        style={{
          fontSize: 9,
          padding: 20,
          color: "#000",
          backgroundColor: "#fff",
          fontFamily: "Helvetica",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 2,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <Text>{school.name}</Text>
          </View>
        </View>
        <Text style={{ fontWeight: "bold" }}>BULLETIN DE NOTES</Text>

        <View style={{ flexDirection: "column", border: "1px solid black" }}>
          <View>
            <Text style={[styles.cell, { flex: w[0] }]}>Matieres</Text>
            <Text style={{ borderLeft: "1px solid black" }}>NOTES</Text>
            <Text style={[styles.cell, { flex: 1 }]}>SUR</Text>
            <Text style={[styles.cell, { flex: 2 }]}>
              APPRECIATIONS DU MAITRE
            </Text>
          </View>
          {subjects.map((subject, index) => (
            <View key={index} style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.cell,
                  {
                    flex: w[0],
                    borderLeft: 0,
                    borderBottom: 0,
                    borderRight: 0,
                  },
                ]}
              >
                {subject.name}
              </Text>
              <Text style={[styles.cell, { flex: w[1], borderTop: 0 }]}></Text>
              <Text
                style={[
                  styles.cell,
                  { flex: w[2], borderLeft: 0, borderRight: 0 },
                ]}
              >
                {subject.notes}
              </Text>
              <Text style={[styles.cell, { flex: w[3], borderTop: 0 }]}></Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text>Total: ____ / Moyenne: ____ /10 Classement: ____</Text>
          <Text>Moyenne du 1er de la classe: ____ /10</Text>
          <Text>Moyenne du dernier de la classe: ____ /10</Text>

          <View>
            <Text>Nbre d'absences:</Text>
            <Text>Appréciations et signature des parents</Text>
            <Text>Appréciations et signature du Maître</Text>
            <Text>Observations et Visa du Directeur</Text>
          </View>

          <View>
            <Text>Conduite:</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
