import { Document, Page, Text, View } from "@react-pdf/renderer";

import "../fonts";

import _, { sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";
import { getAppreciations } from "../utils";
import { IPBWSignature } from "./IPBWSignature";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";
import { IPBWTableHeader } from "./IPBWTableHeader";

const W = ["40%", "6%", "6%", "6%", "6%", "6%", "10%", "10%"];

export function IPBW({
  school,
  student,
  classroom,
  subjects,
  report,
  contact,
  title,
  schoolYear,
  discipline,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
  student: RouterOutputs["student"]["get"];
  title: string;
  classroom: RouterOutputs["classroom"]["get"];
  report: RouterOutputs["reportCard"]["getSequence"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  discipline: {
    absence: number;
    lateness: number;
    justifiedLateness: number;
    consigne: number;
    justifiedAbsence: number;
  };
}) {
  const { studentsReport, summary, globalRanks } = report;
  const studentReport = studentsReport.get(student.id);
  const globalRank = globalRanks.get(student.id);
  if (!studentReport || !globalRank) return <></>;
  const groups = _.groupBy(subjects, "subjectGroupId");
  const values = Array.from(globalRanks.values());
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  return (
    <Document>
      <Page
        size={"A4"}
        style={{
          paddingVertical: 20,
          paddingHorizontal: 40,
          fontSize: 7,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Roboto",
        }}
      >
        <View style={{ flexDirection: "column" }}>
          <IPBWHeader school={school} />
          <View
            style={{
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                fontSize: 10,
                textTransform: "uppercase",
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                alignSelf: "center",
                fontSize: 9,
              }}
            >
              Année scolaire {schoolYear.name}
            </Text>
          </View>
          <IPBWStudentInfo
            student={{
              firstName: student.firstName,
              lastName: student.lastName,
              gender: student.gender ?? "male",
              isRepeating: student.isRepeating,
              dateOfBirth: student.dateOfBirth,
              placeOfBirth: student.placeOfBirth,
            }}
            classroom={classroom}
            contact={contact}
          />

          <View
            style={{
              display: "flex",
              padding: 0,
              border: "1px solid black",
              flexDirection: "column",
            }}
          >
            <IPBWTableHeader W={W} />
            {Object.keys(groups).map((groupId: string, index: number) => {
              const items = groups[Number(groupId)]?.sort(
                (a, b) => a.order - b.order,
              );

              if (!items) return null;
              const group = items[0]?.subjectGroup;
              let coeff = 0;
              return (
                <>
                  {items.map((subject, index2) => {
                    const grade = studentReport.studentCourses.find(
                      (c) => c.subjectId === subject.id,
                    );
                    const subjectSummary = summary.get(subject.id);
                    coeff += grade?.grade != null ? subject.coefficient : 0;
                    return (
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          flexDirection: "row",
                          display: "flex",
                        }}
                        key={`group-${groupId}-${index2}`}
                      >
                        <View
                          style={{
                            width: W[0],
                            flexDirection: "column",
                            display: "flex",
                            borderRight: "1px solid black",
                            paddingHorizontal: 2,
                            alignItems: "flex-start",
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              overflow: "hidden",
                              maxLines: 1,
                            }}
                          >
                            {subject.course.reportName}
                          </Text>
                          <Text style={{ paddingLeft: "8px" }}>
                            {subject.teacher?.prefix}{" "}
                            {subject.teacher?.lastName}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: W[1],
                            borderRight: "1px solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text> {grade ? grade.average : ""}</Text>
                        </View>
                        <View
                          style={{
                            width: W[2],
                            borderRight: "1px solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text> {subject.coefficient}</Text>
                        </View>
                        <View
                          style={{
                            width: W[3],
                            borderRight: "1px solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text>{grade ? grade.total?.toFixed(2) : ""}</Text>
                        </View>
                        <View
                          style={{
                            width: W[4],
                            borderRight: "1px solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text>{grade ? grade.rank : ""}</Text>
                        </View>
                        <View
                          style={{
                            width: W[5],
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text>{subjectSummary?.average.toFixed(2)}</Text>
                        </View>
                        <View
                          style={{
                            width: W[6],
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text>
                            {subjectSummary?.min.toFixed(2)}/
                            {subjectSummary?.max.toFixed(2)}
                          </Text>
                        </View>
                        <View
                          style={{
                            width: W[7],
                            textTransform: "uppercase",
                            paddingLeft: 4,
                            justifyContent: "center",
                          }}
                        >
                          <Text> {getAppreciations(grade?.average)}</Text>
                        </View>
                      </View>
                    );
                  })}
                  <View
                    style={{
                      backgroundColor: "#D7D7D7",
                      fontSize: 8,
                      flexDirection: "row",
                      display: "flex",
                      fontWeight: "bold",
                      width: "100%",
                      borderBottom:
                        index === Object.keys(groups).length - 1
                          ? ""
                          : "1px solid black",
                    }}
                  >
                    <View
                      style={{
                        width: "46%",
                        paddingVertical: 2,
                        borderRight: "1px solid black",

                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ paddingLeft: 4 }}>{group?.name}</Text>
                    </View>
                    <View
                      style={{
                        width: "6%",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRight: "1px solid black",
                      }}
                    >
                      <Text>{coeff}</Text>
                    </View>

                    <View
                      style={{
                        justifyContent: "center",
                        width: "6%",
                        alignItems: "center",
                        borderRight: "1px solid black",
                      }}
                    >
                      <Text>
                        {sum(
                          items.map(
                            (subject) =>
                              studentReport.studentCourses.find(
                                (c) => c.subjectId === subject.id,
                              )?.total,
                          ),
                        ).toFixed(1)}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        width: "22%",
                        alignItems: "center",
                        borderRight: "1px solid black",
                      }}
                    >
                      <Text>
                        MOY :{" "}
                        {(
                          sum(
                            items.map(
                              (subject) =>
                                studentReport.studentCourses.find(
                                  (c) => c.subjectId === subject.id,
                                )?.total,
                            ),
                          ) / (coeff || 1)
                        ).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </>
              );
            })}
          </View>
          <IPBWSummary
            effectif={classroom.size}
            discipline={discipline}
            average={globalRank.average}
            successRate={successRate}
            summary={{
              min: Math.min(...averages),
              max: Math.max(...averages),
              average:
                averages.reduce((acc, val) => acc + val, 0) / averages.length,
            }}
            rank={globalRank.aequoRank}
          />
          <IPBWSignature />
        </View>
      </Page>
    </Document>
  );
}

export default IPBW;
