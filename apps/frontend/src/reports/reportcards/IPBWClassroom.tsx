import { Document, Page, Text, View } from "@react-pdf/renderer";
import _, { sum } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { getAppreciations } from "~/utils/appreciations";
import { getHeader } from "../headers";
import { IPBWNotationSystem } from "./IPBWNotationSystem";
import { IPBWSignature } from "./IPBWSignature";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";
import { IPBWTableHeader } from "./IPBWTableHeader";
import { getTranslation } from "./translation";

const W = ["40%", "6%", "6%", "6%", "6%", "6%", "10%", "10%"];

export function IPBWClassroom({
  school,
  subjects,
  students,
  classroom,
  title,
  report,
  contacts,
  schoolYear,
  disciplines,
  lang,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
  students: RouterOutputs["classroom"]["students"];
  classroom: RouterOutputs["classroom"]["get"];
  title: string;
  report: RouterOutputs["reportCard"]["getSequence"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  contacts: RouterOutputs["student"]["getPrimaryContacts"];
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  disciplines: RouterOutputs["discipline"]["sequence"];
  lang: "fr" | "en";
}) {
  const { studentsReport, summary, globalRanks } = report;
  const values = Array.from(globalRanks.values());
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const primaryContactsMap = new Map(
    contacts.filter((c) => c.studentId).map((c) => [c.studentId, c]),
  );
  const groups = _.groupBy(subjects, "subjectGroupId");
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const t = getTranslation(lang);

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
              paddingVertical: 15,
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
                  {t("Année scolaire")} {schoolYear.name}
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
                <IPBWTableHeader W={W} lang={lang} />
                {Object.keys(groups).map((groupId: string, index: number) => {
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
                        const subjectSummary = summary.get(subject.id);
                        coeff += grade?.grade != null ? subject.coefficient : 0;
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
                              <Text>
                                {" "}
                                {grade ? grade.average?.toFixed(2) : ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: W[2],
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {" "}
                                {grade?.grade != null
                                  ? subject.coefficient
                                  : ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: W[3],
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {grade?.grade != null
                                  ? grade.total?.toFixed(2)
                                  : ""}
                              </Text>
                            </View>
                            <View
                              style={{
                                width: W[4],
                                borderRight: "1px solid black",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text>
                                {grade?.grade != null ? grade.rank : ""}
                              </Text>
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
                              {subjectSummary && (
                                <Text>
                                  {subjectSummary.min.toFixed(2)}/
                                  {subjectSummary.max.toFixed(2)}
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
                          <Text> {coeff}</Text>
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
                                  )?.total ?? 0,
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
                            {t("MOY")} :{" "}
                            {(
                              sum(
                                items.map(
                                  (subject) =>
                                    studentReport.studentCourses.find(
                                      (c) => c.subjectId === subject.id,
                                    )?.total ?? 0,
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
                discipline={{
                  absence: disc?.absence ?? 0,
                  justifiedAbsence: disc?.justifiedAbsence ?? 0,
                  late: disc?.late ?? 0,
                  justifiedLate: disc?.justifiedLate ?? 0,
                  consigne: disc?.consigne ?? 0,
                }}
                lang={lang}
                average={value.average}
                successRate={successRate}
                summary={{
                  min: Math.min(...averages),
                  max: Math.max(...averages),
                  average: average,
                }}
                rank={value.aequoRank}
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
                <IPBWSignature cycle={classroom.cycle?.name} lang={lang} />
              </View>
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export default IPBWClassroom;
