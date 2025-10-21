// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

//import { getServerTranslations } from "~/i18n/server";

import { caller } from "~/trpc/server";
import { getAppreciations } from "~/utils/appreciations";
import { getHeader } from "../headers";

export async function StatisticByCourse({
  stats,
  term,
  course,
}: {
  stats: RouterOutputs["course"]["statistics"];
  term: RouterOutputs["term"]["get"];
  course: RouterOutputs["course"]["get"];
}) {
  const school = await caller.school.getSchool();
  return (
    <Document>
      <Page
        size={"A4"}
        orientation="landscape"
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 10,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {getHeader(school, { fontSize: 7 })}
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
            <Text>STATISTIQUES DES NOTES PAR MATIERE</Text>
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
                borderLeft: "1px solid black",
                borderRight: "1px solid black",
                borderTop: "1px solid black",
              }}
            >
              <Item label="Classe" width="15%" />
              <Item label="Enseignant" width="20%" />
              <Item label="Evalué/Effectif" width="10%" />
              <Item label="Moy. générale" width="8%" />
              <Item label="Moy >= 10" width="8%" />
              <Item label="% garçons >=10" width="8%" />
              <Item label="% filles >=10" width="8%" />
              <Item label="Taux de réussite" width="8%" />
              <Item label="Appreciation" width="10%" last />
            </View>

            {stats.map((row, idx) => (
              <View
                style={{
                  borderTop: "1px solid black",
                  flexDirection: "row",
                  borderRight: "1px solid black",
                  borderLeft: "1px solid black",
                  borderBottom:
                    idx === stats.length - 1 ? "1px solid black" : "",
                  width: "100%",
                  display: "flex",
                }}
                key={idx}
              >
                <View
                  style={{
                    width: "15%",
                    paddingVertical: 8,
                    paddingLeft: 4,
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>{row.classroom.reportName}</Text>
                </View>
                <View
                  style={{
                    width: "20%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>{row.teacher?.lastName}</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>
                    {row.evaluated} / {row.total}
                  </Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>{row.avg.toFixed(2)}</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>{row.above10}</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>{(row.boysRate * 100).toFixed(2)}%</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>{(row.girlsRate * 100).toFixed(2)}%</Text>
                </View>
                <View
                  style={{
                    width: "8%",
                    borderRight: "1px solid black",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Text>{(row.totalRate * 100).toFixed(2)}%</Text>
                </View>
                <View
                  style={{
                    width: "10%",
                    paddingLeft: 4,
                    paddingVertical: 8,
                  }}
                >
                  <Text>{getAppreciations(row.avg)}</Text>
                </View>
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
        paddingVertical: 4,
        borderRight: last ? "" : "1px solid black",
      }}
    >
      <Text>{label}</Text>
    </View>
  );
}
