import { Document, Page, Text, View } from "@react-pdf/renderer";
import _ from "lodash";

import type { RouterOutputs } from "@repo/api";

import { getHeader } from "../headers";
import { IPBWNotationSystem } from "./IPBWNotationSystem";
import { IPBWSignature } from "./IPBWSignature";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";
import { getTranslation } from "./translation";

const W = ["15%", "40%", "5%", "5%", "5%", "5%", "10%", "17%"];

export function IPBWCompetence({
  school,
  subjects,
  students,
  classroom,
  title,
  report,
  contacts,
  schoolYear,
  disciplines,
  skills,
  lang,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
  students: RouterOutputs["classroom"]["students"];
  classroom: RouterOutputs["classroom"]["get"];
  title: string;
  skills: RouterOutputs["skillAcquisition"]["all"];
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
  const primaryContactsMap = new Map(contacts.map((c) => [c.studentId, c]));
  const groups = _.groupBy(subjects, "subjectGroupId");
  const skillsMap = new Map(skills.map((c) => [c.subjectId, c]));
  const averages = values.map((g) => g.average);
  const successCount = averages.filter((val) => val >= 10).length;
  const successRate = successCount / averages.length;
  const average = averages.reduce((acc, val) => acc + val, 0) / averages.length;
  const t = getTranslation(lang);

  return (
    <Document>
      {Array.from(globalRanks)
        .slice(0, 1)
        .map(([key, value], index) => {
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
                paddingHorizontal: 20,
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
                  <IPBWCompetenceHeader W={W} lang={lang} />
                  {subjects.map((subject, index) => {
                    const subjectKills =
                      skillsMap.get(subject.id)?.content.split("\n") ?? [];

                    const grade = studentReport.studentCourses.find(
                      (c) => c.subjectId === subject.id,
                    );
                    const subjectSummary = summary.get(subject.id);
                    return (
                      <View
                        wrap={false}
                        id={`${student.id}-${index}`}
                        style={{
                          flexDirection: "row",
                          fontSize: 8,
                          borderBottom:
                            index == subjects.length - 1
                              ? ""
                              : "1px solid black",
                        }}
                      >
                        <View
                          style={{
                            borderRight: "1px solid black",
                            paddingHorizontal: 2,
                            gap: 2,
                            flexDirection: "column",
                            justifyContent: "center",
                            width: W[0],
                          }}
                        >
                          <Text
                            style={{
                              overflow: "hidden",
                              maxLines: 1,
                              fontWeight: "bold",
                            }}
                          >
                            {subject.course.reportName}
                          </Text>
                          <Text>
                            {subject.teacher?.prefix}{" "}
                            {subject.teacher?.lastName?.split(" ")[0]}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            width: W[1],
                            borderRight: "1px solid black",
                          }}
                        >
                          {subjectKills.map((line, lineIndex) => (
                            <View
                              key={index}
                              style={{
                                paddingVertical: 4,
                                paddingHorizontal: 2,
                                borderBottom:
                                  lineIndex == subjectKills.length - 1
                                    ? ""
                                    : "1px solid black",
                              }}
                            >
                              <Text>{line}</Text>
                            </View>
                          ))}
                        </View>
                        <View
                          style={{
                            width: W[2],
                            justifyContent: "center",
                            alignItems: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text>{grade?.grade?.toFixed(2)}</Text>
                        </View>
                        <View
                          style={{
                            width: W[3],
                            justifyContent: "center",
                            alignItems: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text>{grade?.coeff}</Text>
                        </View>
                        <View
                          style={{
                            width: W[4],
                            justifyContent: "center",
                            alignItems: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text>{grade?.total}</Text>
                        </View>
                        <View
                          style={{
                            width: W[5],
                            justifyContent: "center",
                            alignItems: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          <Text></Text>
                        </View>
                        <View
                          style={{
                            width: W[6],
                            justifyContent: "center",
                            alignItems: "center",
                            borderRight: "1px solid black",
                          }}
                        >
                          {grade?.grade && (
                            <Text>
                              [{subjectSummary?.min.toFixed(1)}-
                              {subjectSummary?.max.toFixed(1)}]
                            </Text>
                          )}
                        </View>
                        <View
                          style={{
                            width: W[7],
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text></Text>
                        </View>
                      </View>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function IPBWCompetenceHeader({ W, lang }: { W: string[]; lang: "fr" | "en" }) {
  return (
    <View
      style={{
        //backgroundColor: "#000",
        //color: "#fff",
        flexDirection: "row",
        borderBottom: "1px solid black",
        fontWeight: "bold",
        fontSize: 8,
      }}
    >
      <View
        style={{
          width: W[0],
          flexDirection: "column",
          borderRight: "1px solid black",
          paddingHorizontal: 2,
          paddingVertical: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>MATIÈRES ET</Text>
        <Text>NOM DE</Text>
        <Text>L'ENSEIGNANT</Text>
      </View>
      <CellItem w={W[1]} value="COMPÉTENCES ÉVALUÉES" />
      <CellItem w={W[2]} value="N/20" />
      <CellItem w={W[3]} value="Coef" />
      <CellItem w={W[4]} value="MxC" />
      <CellItem w={W[5]} value="COTE" />
      <CellItem w={W[6]} value="[Min - Max]" />

      <View
        style={{
          width: W[7],
          flexDirection: "column",
          paddingHorizontal: 2,
          paddingVertical: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Appréciations</Text>
        <Text>et Visa de</Text>
        <Text>l'enseignant</Text>
      </View>
    </View>
  );
}

function CellItem({ value, w }: { value: string; w?: string }) {
  return (
    <View
      style={{
        width: w,
        borderRight: "1px solid black",
        paddingHorizontal: 2,
        paddingVertical: 4,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{value}</Text>
    </View>
  );
}
