import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    //padding: 5,
    alignItems: "center",
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    textAlign: "center",
  },
  table: {
    marginTop: 10,
    fontSize: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
  },
  footerSection: {
    marginTop: 10,
    flexDirection: "row",
  },
  footerCell: {
    flex: 1,
    padding: 5,
    borderTopWidth: 1,
    borderTopColor: "#000",
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
}
export function CSABReportCard({ size = "letter" }: CSABReportCardProps) {
  return (
    <Document>
      <Page size={size.toUpperCase() as "LETTER" | "A4"} style={styles.page}>
        <Text style={styles.header}>BULLETIN DE NOTES</Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 2 }]}>MATIERES</Text>
            <Text style={[styles.cell, { flex: 1 }]}>NOTES</Text>
            <Text style={[styles.cell, { flex: 1 }]}>SUR</Text>
            <Text style={[styles.cell, { flex: 2 }]}>
              APPRECIATIONS DU MAITRE
            </Text>
          </View>
          {subjects.map((subject, index) => (
            <View key={index} style={styles.row}>
              <Text style={[styles.cell, { flex: 2 }]}>{subject.name}</Text>
              <Text style={[styles.cell, { flex: 1 }]}>____</Text>
              <Text style={[styles.cell, { flex: 1 }]}>{subject.notes}</Text>
              <Text style={[styles.cell, { flex: 2 }]}></Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>Total: ____ / Moyenne: ____ /10 Classement: ____</Text>
          <Text>Moyenne du 1er de la classe: ____ /10</Text>
          <Text>Moyenne du dernier de la classe: ____ /10</Text>

          <View style={styles.footerSection}>
            <Text style={styles.footerCell}>Nbre d'absences:</Text>
            <Text style={styles.footerCell}>
              Appréciations et signature des parents
            </Text>
            <Text style={styles.footerCell}>
              Appréciations et signature du Maître
            </Text>
            <Text style={styles.footerCell}>
              Observations et Visa du Directeur
            </Text>
          </View>

          <View style={styles.footerSection}>
            <Text style={styles.footerCell}>Conduite:</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
