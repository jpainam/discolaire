// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { IPBWHeader } from "../headers/IPBWHeader";
import { getAppreciations } from "../utils";

const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 10 },
  table: { display: "flex", width: "auto", marginVertical: 10 },
  row: { flexDirection: "row" },
  cell: {
    border: "1px solid black",
    padding: 4,
    flexGrow: 1,
    textAlign: "center",
  },
  header: { backgroundColor: "#eee", fontWeight: "bold" },
});
export function StatisticByCourse({
  school,
  stats,
  term,
  course,
}: {
  school: RouterOutputs["school"]["getSchool"];
  stats: RouterOutputs["course"]["statistics"];
  term: RouterOutputs["term"]["get"];
  course: RouterOutputs["course"]["get"];
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
              fontSize: 12,
            }}
          >
            <Text>STATISTIQUES DES NOTES PAR CLASSE</Text>
            <Text>
              {course.reportName} - {term.name}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                display: "flex",
                border: "1px solid black",
              }}
            >
              <Item label="N" width="5%" />
              <Item label="Matricule" width="12%" />
              <Item label="Noms et Prénoms" width="35%" />
              <Item label="Date/LieuNaiss" width="15%" />
              <Item label="Redou." width="10%" />
              <Item label="Moy." width="8%" />
              <Item label="Observation" width="15%" last />
            </View>

            {stats.map((row, idx) => (
              <View style={styles.row} key={idx}>
                <Text style={styles.cell}>{row.classroom.reportName}</Text>
                <Text style={styles.cell}>{row.teacher?.lastName}</Text>
                <Text style={styles.cell}>{row.total}</Text>
                <Text style={styles.cell}>{row.avg.toFixed(2)}</Text>
                <Text style={styles.cell}>{row.above10}</Text>
                <Text style={styles.cell}>{row.boysRate}%</Text>
                <Text style={styles.cell}>{row.girlsRate}%</Text>
                <Text style={styles.cell}>{row.totalRate}%</Text>
                <Text style={styles.cell}>{getAppreciations(row.avg)}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}

function Item({
  label,
  width,
  last = false,
}: {
  label: string;
  last?: boolean;
  width?: string;
}) {
  return (
    <View
      style={{
        width: width ?? "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 3,
        borderRight: last ? "" : "1px solid black",
      }}
    >
      <Text>{label}</Text>
    </View>
  );
}
