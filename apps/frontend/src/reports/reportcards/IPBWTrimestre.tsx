import { Document, Page, Text, View } from "@react-pdf/renderer";
import _, { sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";
import { getAppreciations, getTitle } from "../utils";
import { IPBWSignatureTrimestre } from "./IPBWSignature";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";

const W = ["30%", "6%", "6%", "6%", "6%", "6%", "10%", "12%"];

export function IPBWTrimestre({
  school,
  student,
  classroom,
  subjects,
  report,
  contact,
  trimestreId,
  schoolYear,
  disciplines,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
  student: RouterOutputs["student"]["get"];
  trimestreId: string;
  classroom: RouterOutputs["classroom"]["get"];
  report: RouterOutputs["reportCard"]["getTrimestre"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  contact: RouterOutputs["student"]["getPrimaryContact"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  disciplines: RouterOutputs["discipline"]["trimestre"];
}) {
  const { studentsReport, summary, globalRanks } = report;
  const studentReport = studentsReport.get(student.id);
  const globalRank = globalRanks.get(student.id);
  if (!studentReport || !globalRank) return <></>;
  const groups = _.groupBy(subjects, "subjectGroupId");
  const values = Array.from(globalRanks.values());
  const { title, seq1, seq2 } = getTitle({ trimestreId });
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const disc = disciplines.get(student.id);
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
          fontFamily: "Helvetica",
        }}
      >
        <View style={{ flexDirection: "column" }}>
          {getHeader(school)}
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
              avatar: student.user?.avatar,
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
            <IPBWTableHeader seq1={seq1} seq2={seq2} W={W} />
            {Object.keys(groups).map((groupId: string) => {
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
                    coeff += grade?.average != null ? subject.coefficient : 0;
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
                          <Text> {grade ? grade.grade1 : ""}</Text>
                        </View>
                        <View
                          style={{
                            width: W[1],
                            borderRight: "1px solid black",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text> {grade ? grade.grade2 : ""}</Text>
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
                          {grade?.average && (
                            <Text>
                              {subjectSummary?.min.toFixed(2)}/
                              {subjectSummary?.max.toFixed(2)}
                            </Text>
                          )}
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
                      borderBottom: "1px solid black",
                    }}
                  >
                    <View
                      style={{
                        width: "48%",
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
            <View
              style={{
                flexDirection: "row",
                fontWeight: "bold",
                display: "flex",
              }}
            >
              <View
                style={{
                  width: W[0],
                  borderRight: "1px solid black",
                  padding: 2,
                }}
              >
                <Text>MOY. MENSUELLES</Text>
              </View>
              <View
                style={{
                  width: W[1],
                  padding: 2,
                  borderRight: "1px solid black",
                  alignItems: "center",
                }}
              >
                <Text>{studentReport.global.grade1Average.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  width: W[1],
                  borderRight: "1px solid black",
                  alignItems: "center",
                  padding: 2,
                }}
              >
                <Text>{studentReport.global.grade2Average.toFixed(2)}</Text>
              </View>
              <View
                style={{
                  width: W[1],
                  borderRight: "1px solid black",
                  padding: 2,
                  alignItems: "center",
                }}
              >
                <Text></Text>
              </View>
              <View
                style={{
                  width: W[2],
                  borderRight: "1px solid black",
                  padding: 2,
                  alignItems: "center",
                }}
              >
                <Text>
                  {sum(
                    studentReport.studentCourses
                      .filter((s) => s.average != null)
                      .map((s) => s.coeff),
                  )}
                </Text>
              </View>
              <View
                style={{
                  width: W[2],
                  borderRight: "1px solid black",
                  padding: 2,
                  alignItems: "center",
                }}
              >
                <Text>
                  {sum(
                    studentReport.studentCourses
                      .filter((s) => s.average != null)
                      .map((s) => s.total ?? 0),
                  ).toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
          <IPBWSummary
            effectif={classroom.size}
            average={globalRank.average}
            successRate={successRate}
            summary={{
              min: Math.min(...averages),
              max: Math.max(...averages),
              average:
                averages.reduce((acc, val) => acc + val, 0) / averages.length,
            }}
            rank={globalRank.rank + ""}
            discipline={{
              absence: disc?.absence ?? 0,
              justifiedAbsence: disc?.justifiedAbsence ?? 0,
              lateness: disc?.late ?? 0,
              justifiedLateness: disc?.justifiedLate ?? 0,
              consigne: disc?.consigne ?? 0,
            }}
          />
          <IPBWSignatureTrimestre />
        </View>
      </Page>
    </Document>
  );
}

function IPBWTableHeader({
  W,
  seq1,
  seq2,
}: {
  W: number[] | string[];
  seq1: string;
  seq2: string;
}) {
  return (
    <View
      style={{
        backgroundColor: "#000",
        color: "#fff",
        flexDirection: "row",
        display: "flex",
        paddingVertical: 2,
        borderBottom: "1px solid black",
        fontWeight: "bold",
        fontSize: 8,
      }}
    >
      <View
        style={{
          padding: 2,
          width: W[0],
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Matieres</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          width: W[1],
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>{seq1}</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          width: W[1],
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>{seq2}</Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: W[1],
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Moy</Text>
      </View>
      <View
        style={{
          width: W[2],
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Coef.</Text>
      </View>
      <View
        style={{
          width: W[3],
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Total</Text>
      </View>
      <View
        style={{
          width: W[4],
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Rang</Text>
      </View>
      <View
        style={{
          width: W[5],
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Moy.C</Text>
      </View>
      <View
        style={{
          width: W[6],
          justifyContent: "center",
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text> Min/Max</Text>
      </View>
      <View
        style={{
          width: W[7],
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 2,
        }}
      >
        <Text> Appreciation</Text>
      </View>
    </View>
  );
}

export default IPBWTrimestre;
