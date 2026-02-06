import { Document, Page, Text, View } from "@react-pdf/renderer";
import _, { sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { getAppreciations } from "~/utils/appreciations";
import { getHeader } from "../headers";
import { IPBWNotationSystem } from "./IPBWNotationSystem";
import { IPBWSignatureAnnual } from "./IPBWSignature";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";

const W = {
  subject: 28,
  seq: 6,
  moy: 6,
  coeff: 6,
  total: 6,
  rang: 6,
  appreciation: 12,
};

export function IPBWAnnual({
  school,
  subjects,
  students,
  classroom,
  report,
  contacts,
  schoolYear,
  disciplines,
  lang,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
  students: RouterOutputs["classroom"]["students"];

  classroom: RouterOutputs["classroom"]["get"];
  report: RouterOutputs["reportCard"]["getAnnualReport"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  contacts: RouterOutputs["student"]["getPrimaryContacts"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  disciplines: RouterOutputs["discipline"]["annual"];
  lang: "fr" | "en";
}) {
  const { studentsReport, summary: _summary, globalRanks } = report;
  const values = Array.from(globalRanks.values());
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const primaryContactsMap = new Map(contacts.map((c) => [c.studentId, c]));
  const groups = _.groupBy(subjects, "subjectGroupId");
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const printedAt = new Date().toLocaleDateString(
    lang == "fr" ? "fr-FR" : "en-US",
    {
      year: "numeric",
      month: "numeric",
      day: "2-digit",
      hour12: true,
    },
  );
  return (
    <Document>
      {Array.from(globalRanks).map(([key, value], index) => {
        const studentReport = studentsReport.get(key);
        const student = studentsMap.get(key);
        const contact = primaryContactsMap.get(key);
        if (!studentReport || !student) {
          return null;
        }
        const disc = disciplines.get(student.id);
        return (
          <Page
            size={"A4"}
            key={`page-${index}-${key}`}
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
              {getHeader(school, { fontSize: 7 })}
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
                  BULLETIN ANNUEL
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
                  avatar: student.avatar,
                  firstName: student.firstName,
                  lastName: student.lastName,
                  gender: student.gender ?? "male",
                  isRepeating: student.isRepeating,
                  dateOfBirth: student.dateOfBirth,
                  placeOfBirth: student.placeOfBirth,
                  registrationNumber: student.registrationNumber,
                }}
                lang={lang}
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
                <IPBWTableHeader />
                {Object.keys(groups).map((groupId: string) => {
                  const items = groups[Number(groupId)]?.sort(
                    (a, b) => a.order - b.order,
                  );

                  if (!items) return null;
                  const group = items[0]?.subjectGroup;
                  let coeff = 0;

                  return (
                    <>
                      {items.map((subject, index) => {
                        const grade = studentReport.studentCourses.find(
                          (c) => c.subjectId === subject.id,
                        );
                        //const subjectSummary = summary.get(subject.id);
                        coeff +=
                          grade?.average != null ? subject.coefficient : 0;
                        return (
                          <View
                            style={{
                              borderBottom: "1px solid black",
                              flexDirection: "row",
                              display: "flex",
                            }}
                            key={`${subject.id}-${student.id}-${index}`}
                          >
                            <View
                              style={{
                                width: `${W.subject}%`,
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
                            {grade?.grades.map((g, i) => {
                              return (
                                <View
                                  key={`g-${subject.id}-${student.id}-${i}`}
                                  style={{
                                    width: `${W.seq}%`,
                                    borderRight: "1px solid black",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Text> {g ?? ""}</Text>
                                </View>
                              );
                            })}

                            <View
                              style={{
                                width: `${W.moy}%`,
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {grade ? grade.average?.toFixed(2) : ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: `${W.coeff}%`,
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {grade?.average != null
                                  ? subject.coefficient
                                  : ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: `${W.total}%`,
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {grade?.average != null
                                  ? grade.total?.toFixed(2)
                                  : ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: `${W.rang}%`,
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {grade?.average != null ? grade.rank : ""}
                              </Text>
                            </View>

                            <View
                              style={{
                                width: `${W.appreciation}%`,
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
                          flexDirection: "row",
                          display: "flex",
                          fontWeight: "bold",
                          borderBottom: "1px solid black",
                        }}
                      >
                        <View
                          style={{
                            width: `${W.subject + W.seq * 6 + W.moy}%`,
                            padding: 2,
                            borderRight: "1px solid black",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ paddingLeft: 4 }}>{group?.name}</Text>
                        </View>
                        <View
                          style={{
                            width: `${W.coeff}%`,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text> {coeff}</Text>
                        </View>

                        <View
                          style={{
                            justifyContent: "center",
                            width: `${W.total}%`,
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
                                  )?.total ?? 0,
                              ),
                            ).toFixed(1)}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "center",
                            width: `${W.rang + W.appreciation}%`,
                            alignItems: "center",
                            //borderRight: "1px solid black",
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
                      width: `${W.subject}%`,
                      borderRight: "1px solid black",
                      padding: 2,
                    }}
                  >
                    <Text>MOY. MENSUELLES</Text>
                  </View>
                  {studentReport.global.periodAverages.map((avg, ii) => {
                    return (
                      <View
                        key={`${student.id}-${ii}`}
                        style={{
                          width: `${W.seq}%`,
                          padding: 2,
                          borderRight: "1px solid black",
                          alignItems: "center",
                        }}
                      >
                        <Text>{avg.toFixed(2)}</Text>
                      </View>
                    );
                  })}

                  <View
                    style={{
                      width: `${W.moy}%`,
                      borderRight: "1px solid black",
                      padding: 2,
                      alignItems: "center",
                    }}
                  >
                    <Text></Text>
                  </View>
                  <View
                    style={{
                      width: `${W.coeff}%`,
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
                      width: `${W.total}%`,
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
                discipline={{
                  absence: disc?.absence ?? 0,
                  justifiedAbsence: disc?.justifiedAbsence ?? 0,
                  late: disc?.late ?? 0,
                  justifiedLate: disc?.justifiedLate ?? 0,
                  consigne: disc?.consigne ?? 0,
                }}
                effectif={classroom.size}
                average={value.average}
                successRate={successRate}
                summary={{
                  min: Math.min(...averages),
                  max: Math.max(...averages),
                  average: average,
                }}
                lang={lang}
                rank={`${value.rank}`}
              />
              <View
                style={{
                  flexDirection: "row",
                  gap: 2,
                  width: "100%",
                  display: "flex",
                  paddingTop: 4,
                }}
              >
                <IPBWNotationSystem lang={lang} />
                <IPBWSignatureAnnual lang={lang} />
              </View>
            </View>
            <Text
              style={{
                position: "absolute",
                left: -40,
                top: 500,
                fontSize: 7,
                //color: "#333",
                //fontWeight: "bold",
                transform: "rotate(-90deg)",
                //letterSpacing: 0.6,
              }}
            >
              Fait à Nkolfoulou 1, le {printedAt} par discolaire
            </Text>
          </Page>
        );
      })}
    </Document>
  );
}

function IPBWTableHeader() {
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
          width: `${W.subject}%`,
          alignItems: "center",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Matieres</Text>
      </View>
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          style={{
            justifyContent: "center",
            width: `${W.seq}%`,
            alignItems: "center",
            borderRight: "1px solid black",
            paddingHorizontal: 2,
          }}
          key={index}
        >
          <Text>{`S${index + 1}`}</Text>
        </View>
      ))}

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: `${W.moy}%`,
          borderRight: "1px solid black",
          paddingHorizontal: 2,
        }}
      >
        <Text>Moy</Text>
      </View>
      <View
        style={{
          width: `${W.coeff}%`,
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
          width: `${W.total}%`,
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
          width: `${W.rang}%`,
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
          width: `${W.appreciation}%`,
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
