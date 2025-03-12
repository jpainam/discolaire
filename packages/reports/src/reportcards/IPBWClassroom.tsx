import { Document, Page, Text, View } from "@react-pdf/renderer";
import { sortBy } from "lodash";

import type { RouterOutputs } from "@repo/api";

import { IPBWHeader } from "../headers/IPBWHeader";
import { IPBWGroup } from "./IPBWGroup";
import { IPBWSignature } from "./IPBWSignature";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { IPBWSummary } from "./IPBWSummary";
import { IPBWTableHeader } from "./IPBWTableHeader";

const W = ["40%", "6%", "6%", "6%", "6%", "6%", "10%", "10%"];
type ClassroomReportCardType = RouterOutputs["reportCard"]["getGrades2"];
export function IPBWClassroom({
  school,
  subjects,
  students,
  classroom,
  results,
  contacts,
  grades,
  summary,
  schoolYear,
}: {
  school: NonNullable<RouterOutputs["school"]["getSchool"]>;
  students: RouterOutputs["classroom"]["students"];
  subjects: RouterOutputs["classroom"]["subjects"];
  classroom: RouterOutputs["classroom"]["get"];
  schoolYear: RouterOutputs["schoolYear"]["get"];
  contacts: RouterOutputs["student"]["getPrimaryContact"][];
  results: RouterOutputs["reportCard"]["getClassroom"]["result"];
  grades: RouterOutputs["reportCard"]["getGrades2"];
  summary: RouterOutputs["reportCard"]["getClassroom"]["summary"];
}) {
  const gradesMap: Record<string, ClassroomReportCardType> = {};
  grades.forEach((grade) => {
    const studentId = grade.studentId;
    if (!gradesMap[grade.studentId]) {
      gradesMap[grade.studentId] = [];
    }
    gradesMap[studentId]?.push(grade);
  });
  return (
    <Document>
      {results.map((result, index) => {
        const rank =
          index == 0 || results[index - 1]?.avg != result.avg
            ? result.rank.toString()
            : results[index - 1]?.rank.toString() + " ex";

        const student = students.find((s) => s.id === result.id);
        if (!student) return null;
        const contact = contacts.find((c) => c && c.studentId === student.id);
        if (!contact) return null;
        const grades = gradesMap[student.id];
        if (!grades) return null;
        //const groups = _.groupBy(grades, "subjectGroup.id");
        const groups: Record<number, ClassroomReportCardType> = {};
        subjects.forEach((subject) => {
          const subjectGrades = grades.filter(
            (grade) => grade.subjectId === subject.id,
          );
          const group = subject.subjectGroup;
          if (!group) return;
          if (!groups[group.id]) {
            groups[group.id] = [];
          }
          groups[group.id]?.push(...subjectGrades);
        });
        return (
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
                  }}
                >
                  BULLETIN SCOLAIRE DU PREMIER TRIMESTRE
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
                  let cards = groups[Number(groupId)];
                  if (!cards || cards.length == 0) return null;
                  cards = sortBy(cards, "order").filter((c) => !c.isAbsent);
                  const card = cards[0];
                  if (!card) return null;
                  const group = card.subjectGroup;
                  if (!group) return null;
                  return (
                    <IPBWGroup
                      W={W}
                      cards={cards.map((c) => ({
                        courseName: c.course.name,
                        coefficient: c.coefficient,
                        rank: c.rank,
                        classroom: {
                          min: c.classroom.min,
                          max: c.classroom.max,
                          avg: c.classroom.avg,
                        },
                        teacher: {
                          prefix: c.teacher?.prefix ?? "",
                          lastName: c.teacher?.lastName ?? "",
                          firstName: c.teacher?.firstName ?? "",
                        },
                        isAbsent: c.isAbsent,
                        avg: c.avg,
                      }))}
                      key={groupId}
                      groupName={card.subjectGroup?.name ?? ""}
                      lastRow={index === Object.keys(groups).length - 1}
                    />
                  );
                })}
              </View>
              {result.avg && (
                <IPBWSummary
                  effectif={classroom.size}
                  average={result.avg}
                  summary={summary}
                  rank={rank}
                />
              )}
              <IPBWSignature />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}

export default IPBWClassroom;
