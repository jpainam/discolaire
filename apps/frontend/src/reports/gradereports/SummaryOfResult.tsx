// N° Matricule Noms et Prénoms Date/LieuNaiss Redouble Moyenne(>12) Observation

import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { caller } from "~/trpc/server";
import { getHeader } from "../headers";

export async function SummaryOfResult({
  globalRanks,
  term,
  students,
  classroom,
}: {
  globalRanks: RouterOutputs["reportCard"]["getSequence"]["globalRanks"];
  students: RouterOutputs["classroom"]["students"];

  term: RouterOutputs["term"]["get"];
  classroom: RouterOutputs["classroom"]["get"];
}) {
  const school = await caller.school.getSchool();
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const first10Students = Array.from(globalRanks)
    .slice(0, 10)
    .map(([key, value]) => {
      const student = studentsMap.get(key);
      return {
        studentName: `${student?.firstName} ${student?.lastName}`,
        average: value.average,
      };
    });

  const last10Students = Array.from(globalRanks)
    .slice(-10)
    .map(([key, value]) => {
      const student = studentsMap.get(key);
      return {
        studentName: `${student?.firstName} ${student?.lastName}`,
        average: value.average,
      };
    });

  const values = Array.from(globalRanks.values());

  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;

  let maleCount = 0;
  let maleAbove10 = 0;
  let femaleCount = 0;
  let femaleAbove10 = 0;
  Array.from(globalRanks).forEach(([key, value]) => {
    const student = studentsMap.get(key);
    if (!student) return;
    if (student.gender == "female") {
      femaleCount++;
      if (value.average >= 10) {
        femaleAbove10++;
      }
    } else {
      maleCount++;
      if (value.average >= 10) {
        maleAbove10++;
      }
    }
  });

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
            <Text>SYNTHESE - RECAPITULATIVE DES RESULTATS</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              display: "flex",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                display: "flex",
                border: "1px solid black",
              }}
            >
              <View style={{ flexDirection: "row", display: "flex" }}>
                <View
                  style={{
                    width: "65%",
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>PERIODE</Text>
                </View>
                <View style={{ paddingHorizontal: 4, paddingVertical: 1 }}>
                  <Text>{term.name}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  borderTop: "1px solid black",
                  display: "flex",
                }}
              >
                <View
                  style={{
                    width: "65%",
                    paddingHorizontal: 4,
                    paddingVertical: 1,
                    borderRight: "1px solid black",
                  }}
                >
                  <Text>CLASSE</Text>
                </View>
                <View style={{ paddingHorizontal: 4, paddingVertical: 2 }}>
                  <Text>{classroom.name}</Text>
                </View>
              </View>
            </View>
            <View
              style={{
                width: "10%",
              }}
            ></View>
            <View
              style={{
                width: "45%",
                flexDirection: "column",
                display: "flex",
              }}
            >
              <View
                style={{
                  border: "1px solid black",
                  paddingVertical: 1,
                  paddingHorizontal: 4,
                }}
              >
                <Text>ANNEE SCOLAIRE {term.schoolYear.name}</Text>
              </View>
              <View></View>
            </View>
          </View>
          <EffectifEvaluated
            effectif={students.length}
            evaluated={values.length}
            average={average}
            above10={successCount}
            successRate={successRate}
          />
          <View style={{ flexDirection: "row", display: "flex" }}>
            <EffectifByGender
              effectif={students.filter((s) => s.gender == "male").length}
              evaluated={maleCount}
              gender={"GARCONS"}
              above10={maleAbove10}
              successRate={maleAbove10 / maleCount}
            />
            <View style={{ width: "10%" }}></View>
            <EffectifByGender
              effectif={students.filter((s) => s.gender == "female").length}
              evaluated={femaleCount}
              gender={"FILLES"}
              above10={femaleAbove10}
              successRate={femaleAbove10 / femaleCount}
            />
          </View>
          <View style={{ flexDirection: "row", display: "flex" }}>
            <TenStudent data={first10Students} last={false} />
            <View style={{ width: "10%" }}></View>
            <TenStudent data={last10Students} last={true} />
          </View>
        </View>
      </Page>
    </Document>
  );
}

function TenStudent({
  data,
  last,
}: {
  data: { studentName: string; average: number }[];
  last: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        border: "1px solid black",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          display: "flex",
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{
            width: "10%",
            paddingHorizontal: 4,
            paddingVertical: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>No</Text>
        </View>
        <View
          style={{
            width: "70%",
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRight: "1px solid black",
          }}
        >
          <Text>{last ? "DIX DERNIERS" : "DIX PREMIER"}</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 4,
            paddingVertical: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "20%",
          }}
        >
          <Text>MOYENNE</Text>
        </View>
      </View>
      {data.map((student, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            display: "flex",
            borderBottom: index == data.length - 1 ? "" : "1px solid black",
          }}
        >
          <View
            style={{
              width: "10%",
              paddingHorizontal: 4,
              paddingVertical: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid black",
            }}
          >
            <Text>{index + 1}</Text>
          </View>
          <View
            style={{
              width: "70%",
              paddingHorizontal: 4,
              paddingVertical: 1,
              borderRight: "1px solid black",
            }}
          >
            <Text>{student.studentName}</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 4,
              paddingVertical: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "20%",
            }}
          >
            <Text>{student.average.toFixed(2)}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function EffectifEvaluated({
  effectif,
  evaluated,
  average,
  above10,
  successRate,
}: {
  effectif: number;
  evaluated: number;
  average: number;
  above10: number;
  successRate: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        display: "flex",
        borderBottom: "1px solid black",
        marginBottom: 4,
      }}
    >
      <View style={{ width: "10%" }}>
        <Text>Effectif: {effectif}</Text>
      </View>

      <View style={{ width: "10%" }}>
        <Text>Evalués: {evaluated}</Text>
      </View>
      <View style={{ width: "30%" }}>
        <Text>Moyenne de classe: {average.toFixed(2)}</Text>
      </View>
      <View style={{ width: "20%" }}>
        <Text>Nombre de Moy. : {above10}</Text>
      </View>
      <View>
        <Text>Taux de réussite: {(successRate * 100).toFixed(2)}%</Text>
      </View>
    </View>
  );
}

function EffectifByGender({
  effectif,
  gender,
  evaluated,
  above10,
  successRate,
}: {
  effectif: number;
  evaluated: number;
  above10: number;
  successRate: number;
  gender: string;
}) {
  //    40
  //
  return (
    <View
      style={{
        flexDirection: "column",
        display: "flex",
        border: "1px solid black",
      }}
    >
      <View style={{ flexDirection: "row", display: "flex" }}>
        <View
          style={{
            width: "80%",
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRight: "1px solid black",
          }}
        >
          <Text>EFFECTIF {gender}</Text>
        </View>
        <View
          style={{ paddingHorizontal: 4, width: "20%", paddingVertical: 1 }}
        >
          <Text>{effectif}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          borderTop: "1px solid black",
          borderBottom: "1px solid black",
          display: "flex",
        }}
      >
        <View
          style={{
            width: "80%",
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRight: "1px solid black",
          }}
        >
          <Text>{gender} AYANT COMPOSES</Text>
        </View>
        <View
          style={{ paddingHorizontal: 4, width: "20%", paddingVertical: 2 }}
        >
          <Text>{evaluated}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          borderBottom: "1px solid black",
          display: "flex",
        }}
      >
        <View
          style={{
            width: "80%",
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRight: "1px solid black",
          }}
        >
          <Text>NOMBRE DE MOYENNE {gender}</Text>
        </View>
        <View
          style={{ paddingHorizontal: 4, width: "20%", paddingVertical: 1 }}
        >
          <Text>{above10}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", display: "flex" }}>
        <View
          style={{
            width: "80%",
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRight: "1px solid black",
          }}
        >
          <Text>POURCENTAGE DE REUSSITE {gender}</Text>
        </View>
        <View
          style={{ paddingHorizontal: 4, width: "20%", paddingVertical: 1 }}
        >
          <Text>{(successRate * 100).toFixed(2)}%</Text>
        </View>
      </View>
    </View>
  );
}
