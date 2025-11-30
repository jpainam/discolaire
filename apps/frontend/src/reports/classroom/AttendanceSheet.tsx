/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { decode } from "entities";

//import { getServerTranslations } from "~/i18n/server";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";

export function AttendanceSheet({
  school,
  classroom,
  students,
  type,
}: {
  school: RouterOutputs["school"]["getSchool"];
  type: "weekly" | "periodic";
  students: RouterOutputs["classroom"]["students"];
  classroom: RouterOutputs["classroom"]["get"];
}) {
  const w = ["3%", "15%", "3%", "2$"];
  const w_cell = "21%";

  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: type == "periodic" ? 40 : 20,
          fontSize: 7,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {getHeader(school)}
          <View
            style={{
              flexDirection: "column",
              fontSize: 12,
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              fontWeight: "bold",
            }}
          >
            <Text>
              Fiche de présence{" "}
              {type == "periodic" ? "périodique" : "hebdomadaire"}
            </Text>
            <Text>{classroom.name}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 10,
              marginVertical: 10,
              fontWeight: "bold",
            }}
          >
            <Text>Effectif: {classroom.size}</Text>
            <Text>
              {type == "weekly"
                ? "Semaine du _____________________ au _____________________"
                : "Période _____________________"}
            </Text>
          </View>
          {type == "periodic" ? (
            <PeriodicAttendanceSheet students={students} />
          ) : (
            <View
              style={{
                flexDirection: "column",
                border: "1px solid black",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    width: w[0],
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Text>No</Text>
                </View>
                <View
                  style={{
                    width: w[1],
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Noms et Prenoms</Text>
                </View>
                <View
                  style={{
                    width: w_cell,
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    paddingVertical: 2,
                    alignItems: "center",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>Lundi</Text>
                </View>
                <View
                  style={{
                    width: w_cell,
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>Mardi</Text>
                </View>
                <View
                  style={{
                    width: w_cell,
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    borderLeft: "1px solid black",
                    alignItems: "center",
                  }}
                >
                  <Text>Mercredi</Text>
                </View>
                <View
                  style={{
                    width: w_cell,
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>Jeudi</Text>
                </View>
                <View
                  style={{
                    width: w_cell,
                    justifyContent: "center",
                    alignItems: "center",
                    borderLeft: "1px solid black",
                  }}
                >
                  <Text>Vendredi</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  display: "flex",
                  borderBottom: "1px solid black",
                }}
              >
                <View
                  style={{
                    width: "18%",
                    padding: 2,
                    borderRight: "1px solid black",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  <Text>HEURES</Text>
                </View>
                {Array.from({ length: 7 * 5 }).map((_, i) => {
                  return (
                    <View
                      key={i}
                      style={{
                        width: w[2]!,
                        borderLeft: i % 7 == 0 ? "1px solid black" : "",
                        borderRight: i == 34 ? "" : "1px solid black",
                      }}
                    ></View>
                  );
                })}
              </View>

              <View>
                {students.map((student, index) => (
                  <View
                    key={student.id}
                    style={{
                      flexDirection: "row",
                      borderBottom:
                        index == students.length - 1 ? "" : "1px solid black",
                    }}
                  >
                    <View
                      style={{
                        width: w[0],
                        borderRight: "1px solid black",
                        paddingVertical: 2,
                        paddingHorizontal: 1,
                      }}
                    >
                      <Text>{index + 1}</Text>
                    </View>
                    <View
                      style={{
                        width: w[1],
                        borderRight: "1px solid black",
                        justifyContent: "center",
                        paddingLeft: 2,
                      }}
                    >
                      <Text>{student.lastName}</Text>
                    </View>

                    {Array.from({ length: 7 * 5 }).map((_, i) => {
                      return (
                        <View
                          key={i}
                          style={{
                            width: w[2]!,
                            borderLeft: i % 7 == 0 ? "1px solid black" : "",
                            borderRight: i == 34 ? "" : "1px solid black",
                          }}
                        ></View>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}

function PeriodicAttendanceSheet({
  students,
}: {
  students: RouterOutputs["classroom"]["students"];
}) {
  return (
    <View style={{ flexDirection: "column", border: "1px solid black" }}>
      <View
        style={{
          flexDirection: "row",
          fontWeight: "bold",
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{
            width: "3%",
            paddingVertical: 3,
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>No</Text>
        </View>
        <View
          style={{
            width: "30%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>Noms et Prenoms</Text>
        </View>
        <View
          style={{
            width: "10%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>D.Naiss</Text>
        </View>
        <View
          style={{
            width: "8%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>T.Absen.</Text>
        </View>
        <View
          style={{
            width: "8%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>Ab.Jus</Text>
        </View>
        <View
          style={{
            width: "8%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>Cons.</Text>
        </View>
        <View
          style={{
            width: "8%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>Retard</Text>
        </View>
        <View
          style={{
            width: "8%",
            justifyContent: "center",
            alignItems: "center",
            borderRight: "1px solid black",
          }}
        >
          <Text>Bavar.</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            paddingLeft: 2,
            alignItems: "center",
          }}
        >
          <Text>Excl./Obs</Text>
        </View>
      </View>
      {students.map((student, index) => {
        return (
          <View
            style={{
              flexDirection: "row",
              borderBottom:
                index == students.length - 1 ? "" : "1px solid black",
            }}
            key={student.id}
          >
            <View style={{ borderRight: "1px solid black", width: "3%" }}>
              <Text>{index + 1}</Text>
            </View>
            <View style={{ width: "30%" }}>
              <Text
                style={{
                  paddingVertical: 2,
                  paddingLeft: 2,
                  borderRight: "1px solid black",
                }}
              >
                {decode(student.lastName ?? "")}{" "}
                {decode(student.firstName ?? "")}
              </Text>
            </View>
            <View
              style={{
                width: "10%",
                borderRight: "1px solid black",
                paddingLeft: 3,
                justifyContent: "center",
              }}
            >
              <Text>{student.dateOfBirth?.toLocaleDateString()}</Text>
            </View>
            {Array.from({ length: 5 }).map((_, i) => {
              return (
                <View
                  key={i}
                  style={{
                    width: "8%",
                    borderRight: i == 5 ? "" : "1px solid black",
                  }}
                ></View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}
