import { Document, Page, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import "../fonts";

//import { getServerTranslations } from "~/i18n/server";

import { decode } from "entities";

import { getHeader } from "../headers";

export function GradesheetList({
  school,
  gradesheets,
  classroom,
}: {
  school: RouterOutputs["school"]["getSchool"];
  classroom: RouterOutputs["classroom"]["get"];
  gradesheets: RouterOutputs["classroom"]["gradesheets"];
}) {
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 30,
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
            <Text>LISTE DES NOTES</Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              gap: 4,
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            <Text>Classe: {classroom.name}</Text>
            <Text>Effectif: {classroom.size}</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>
                Professeur Principal: {classroom.classroomLeader?.lastName}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              display: "flex",
              border: "1px solid black",
              marginVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                fontWeight: "bold",
              }}
            >
              <View
                style={{
                  width: "4%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>No</Text>
              </View>
              <View
                style={{
                  width: "20%",
                  borderRight: "1px solid black",
                  paddingLeft: 5,
                  paddingVertical: 3,
                }}
              >
                <Text>Matières</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Prof.</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Coef</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Noté</Text>
              </View>

              <View
                style={{
                  width: "7%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Abs.</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  justifyContent: "center",
                  borderRight: "1px solid black",
                  alignItems: "center",
                }}
              >
                <Text>Moy</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Min</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Max</Text>
              </View>
              <View
                style={{
                  width: "7%",
                  borderRight: "1px solid black",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Poids</Text>
              </View>
              <View
                style={{
                  width: "15%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Période</Text>
              </View>
            </View>
            {gradesheets.map((gr, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    fontSize: 9,
                    borderTop: "1px solid black",
                  }}
                >
                  <View
                    style={{
                      width: "4%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text> {index + 1}</Text>
                  </View>
                  <View
                    style={{
                      width: "20%",
                      paddingLeft: 5,
                      paddingVertical: 3,
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{gr.subject.course.reportName}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{decode(gr.subject.teacher?.lastName ?? "")}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      borderRight: "1px solid black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{gr.subject.coefficient}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      borderRight: "1px solid black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{gr.num_grades}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      borderRight: "1px solid black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{gr.num_is_absent}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      borderRight: "1px solid black",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text>{gr.avg.toFixed(2)}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{isFinite(gr.min) ? gr.min.toFixed(2) : ""}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{isFinite(gr.max) ? gr.max.toFixed(2) : ""}</Text>
                  </View>
                  <View
                    style={{
                      width: "7%",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRight: "1px solid black",
                    }}
                  >
                    <Text>{gr.weight}</Text>
                  </View>
                  <View
                    style={{
                      width: "15%",
                      justifyContent: "center",
                      alignItems: "center",
                      //fontSize: 7,
                    }}
                  >
                    <Text>{gr.term.name}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
