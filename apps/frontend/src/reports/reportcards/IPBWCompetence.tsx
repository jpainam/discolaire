import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { RouterOutputs } from "@repo/api";

import { FontAwesomeIcon } from "../components/FontAwesomeIcon";
import { getHeader } from "../headers";
import { IPBWStudentInfo } from "./IPBWStudentInfo";
import { getTranslation } from "./translation";

const W = ["15%", "40%", "5%", "5%", "5%", "5%", "10%", "15%"];

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
  term,
}: {
  subjects: RouterOutputs["classroom"]["subjects"];
  students: RouterOutputs["classroom"]["students"];
  classroom: RouterOutputs["classroom"]["get"];
  title: string;
  term: RouterOutputs["term"]["get"];
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
  const skillsMap = new Map(skills.map((c) => [c.subjectId, c]));
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
                        borderBottom: "1px solid black",
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
                            key={`${subject.id}-${lineIndex}`}
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
                        <Text>{grade?.rank}</Text>
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
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      width: "60%",
                      fontWeight: "bold",
                      display: "flex",
                      justifyContent: "flex-end",
                      borderRight: "1px solid black",
                      padding: 2,
                    }}
                  >
                    <Text style={{ textAlign: "right" }}>TOTAL</Text>
                  </View>
                  <View
                    style={{
                      width: W[3],
                      ...styles.cell,
                    }}
                  >
                    <Text>{studentReport.global.totalCoeff}</Text>
                  </View>
                  <View
                    style={{
                      width: W[4],
                      ...styles.cell,
                    }}
                  >
                    <Text>{value.total}</Text>
                  </View>
                  <View
                    style={{
                      fontWeight: "bold",
                      width: "25%",
                      padding: 2,
                    }}
                  >
                    <Text>MOYENNE: {value.average.toFixed(2)}</Text>
                  </View>
                </View>
              </View>

              <IPBWCompetenceSummary
                max={Math.min(...averages)}
                min={Math.max(...averages)}
                avgClass={average}
                rank={value.aequoRank}
                average={value.average}
                total={value.total}
                nbAvg={averages.filter((a) => a >= 10).length}
                coeff={studentReport.global.totalCoeff}
                term={term}
                successRate={successRate}
                discipline={{
                  absence: disc?.absence,
                  justifiedAbsence: disc?.justifiedAbsence,
                  late: disc?.late,
                  justifiedLate: disc?.justifiedLate,
                  consigne: disc?.consigne,
                }}
              />
            </View>
          </Page>
        );
      })}
    </Document>
  );
}
function SummaryTitle({
  label,
  w,
  last = false,
}: {
  label: string;
  w: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        paddingVertical: 2,
        width: w,
        alignItems: "center",
        justifyContent: "center",
        borderRight: last ? "" : "1px solid black",
        fontWeight: "bold",
        fontSize: 9,
      }}
    >
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    borderRight: "1px solid black",
  },
});
const WW = ["12%", "5%", "12%", "8%", "20%", "15%"];
function IPBWCompetenceSummary({
  discipline,
  min,
  max,
  term,
  coeff,
  successRate,
  avgClass,
  nbAvg,
  total,
  rank,
  average,
}: {
  min: number;
  max: number;
  rank: string;
  average: number;
  total: number;
  coeff: number;
  term: RouterOutputs["term"]["get"];
  avgClass: number;
  nbAvg: number;
  successRate: number;
  discipline: {
    absence?: number;
    justifiedAbsence?: number;
    late?: number;
    justifiedLate?: number;
    consigne?: number;
  };
}) {
  return (
    <View
      wrap={false}
      style={{
        marginTop: 10,
        width: "100%",
        border: "1px solid black",
        flexDirection: "column",
      }}
    >
      <View style={{ borderBottom: "1px solid black", flexDirection: "row" }}>
        <SummaryTitle w="34%" label="Discipline" />
        <SummaryTitle w="33%" label="Travail de l'élève" />
        <SummaryTitle w="33%" label="Profil de la classe" last={true} />
      </View>
      {/* Abs. non. J. (h) */}
      <View
        style={{
          borderBottom: "1px solid black",
          flexDirection: "row",
        }}
      >
        <View
          style={{ width: WW[0], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Abs. non. J. (h)</Text>
        </View>
        <View style={{ width: WW[1], ...styles.cell }}>
          <DisciplineItem value={discipline.absence} />
        </View>
        <View
          style={{ width: WW[2], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Avertissement de conduite</Text>
        </View>
        <View style={{ width: WW[1], borderRight: "1px solid black" }}></View>

        <View
          style={{
            flexDirection: "column",
            padding: 2,
            width: WW[3],
            borderRight: "1px solid black",
          }}
        >
          <Text>TOTAL</Text>
          <Text>GENERAL</Text>
        </View>
        <View
          style={{
            width: WW[1],
            ...styles.cell,
          }}
        >
          <Text>{total}</Text>
        </View>
        <View
          style={{
            fontWeight: "bold",
            width: WW[4],
            ...styles.cell,
          }}
        >
          <Text>APPRECIATIONS</Text>
        </View>
        <View
          style={{
            width: WW[3],
            borderRight: "1px solid black",
            padding: 2,
          }}
        >
          <Text>Moyenne. Générale</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            padding: 2,
          }}
        >
          <Text>{avgClass.toFixed(2)}</Text>
        </View>
      </View>
      <View
        style={{
          borderBottom: "1px solid black",
          flexDirection: "row",
        }}
      >
        <View
          style={{ width: WW[0], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Abs just. (h)</Text>
        </View>
        <View style={{ width: WW[1], ...styles.cell }}>
          <DisciplineItem value={discipline.justifiedAbsence} />
        </View>
        <View
          style={{ width: WW[2], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Blâme de conduite</Text>
        </View>
        <View style={{ width: WW[1], borderRight: "1px solid black" }}></View>
        <View
          style={{ width: WW[3], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>COEFF</Text>
        </View>
        <View
          style={{
            width: WW[1],
            ...styles.cell,
          }}
        >
          <Text>{coeff}</Text>
        </View>
        <CTBAItem
          l1="CTBA"
          l2="CBA"
          checked1={average >= 16}
          checked2={average >= 14 && average < 16}
        />
        <View
          style={{
            width: WW[3],
            fontWeight: "bold",
            ...styles.cell,
          }}
        >
          <Text>[Min - Max]</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            padding: 2,
          }}
        >
          <Text>
            {min.toFixed(2)} - {max.toFixed(2)}
          </Text>
        </View>
      </View>
      {/* Retards (nombre de fois) */}
      <View
        style={{
          borderBottom: "1px solid black",
          flexDirection: "row",
        }}
      >
        <View
          style={{ width: WW[0], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Retards (nombre de fois)</Text>
        </View>
        <View style={{ width: WW[1], ...styles.cell }}>
          <DisciplineItem value={discipline.late} />
        </View>
        <View
          style={{ width: WW[2], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Exclusions (jours)</Text>
        </View>
        <View style={{ width: WW[1], borderRight: "1px solid black" }}></View>
        <View
          style={{
            width: WW[3],
            padding: 2,
            borderRight: "1px solid black",
            textTransform: "uppercase",
          }}
        >
          <Text>MOYENNE {term.shortName}</Text>
        </View>
        <View
          style={{
            width: WW[1],
            fontWeight: "bold",
            ...styles.cell,
          }}
        >
          <Text>{average.toFixed(2)}</Text>
        </View>
        <CTBAItem
          l1="CA"
          l2="CMA"
          checked1={average >= 12 && average < 14}
          checked2={average >= 10 && average < 12}
        />
        <View
          style={{
            width: WW[3],
            ...styles.cell,
          }}
        >
          <Text>Nombre de moyennes</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            padding: 2,
          }}
        >
          <Text>{nbAvg}</Text>
        </View>
      </View>
      {/* Consignes (heures) */}
      <View
        style={{
          borderBottom: "1px solid black",
          flexDirection: "row",
        }}
      >
        <View
          style={{ width: WW[0], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Consignes (heures)</Text>
        </View>
        <View style={{ width: WW[1], ...styles.cell }}>
          <DisciplineItem value={discipline.consigne} />
        </View>
        <View
          style={{ width: WW[2], borderRight: "1px solid black", padding: 2 }}
        >
          <Text>Exclusion définitive</Text>
        </View>
        <View style={{ width: WW[1], borderRight: "1px solid black" }}></View>
        <View
          style={{ width: WW[3], padding: 2, borderRight: "1px solid black" }}
        >
          <Text>COTE</Text>
        </View>
        <View
          style={{
            width: WW[1],
            ...styles.cell,
          }}
        >
          <Text>{rank}</Text>
        </View>
        <View
          style={{
            width: WW[4],
            borderRight: "1px solid black",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              borderRight: "1px solid black",
              width: "75%",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <Text>CNA</Text>
          </View>
          <View
            style={{
              width: "25%",
              ...styles.cell,
              borderRight: "",
            }}
          >
            {average < 10 && (
              <FontAwesomeIcon
                faIcon={faCheck}
                style={{ color: "#000", width: "8px" }}
              />
            )}
          </View>
        </View>
        <View
          style={{
            width: WW[3],
            padding: 2,
            borderRight: "1px solid black",
          }}
        >
          <Text>Taux de réussite</Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            padding: 2,
          }}
        >
          <Text>{(successRate * 100).toFixed(2)}%</Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          fontSize: 8,
          //borderBottom: "1px solid black"
        }}
      >
        <View
          style={{
            alignItems: "center",
            borderRight: "1px solid black",
            width: "34%",
            height: 100,
            paddingTop: 4,
            paddingHorizontal: 2,
          }}
        >
          <Text>Appréciation du travail de l'élève (points forts</Text>
          <Text>et points à améliorer)</Text>
        </View>

        <View
          style={{
            borderRight: "1px solid black",
            alignItems: "center",
            paddingTop: 4,
            width: "13%",
            height: 100,
          }}
        >
          <Text>Visa du parent /</Text>
          <Text>Tuteur</Text>
        </View>
        <View
          style={{
            width: "20%",
            alignItems: "center",
            paddingTop: 4,
            borderRight: "1px solid black",
          }}
        >
          <Text>Nom et visa du </Text>
          <Text>professeur principal</Text>
        </View>
        <View
          style={{
            width: "33%",
            alignItems: "center",
            paddingTop: 4,
          }}
        >
          <Text>Le Chef d'établissement</Text>
        </View>
      </View>
    </View>
  );
}

function CTBAItem({
  l1,
  l2,
  checked1,
  checked2,
}: {
  l1: string;
  l2: string;
  checked1: boolean;
  checked2: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        width: WW[4],
        borderRight: "1px solid black",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          borderBottom: "1px solid black",
        }}
      >
        <View
          style={{ borderRight: "1px solid black", width: "75%", padding: 2 }}
        >
          <Text>{l1}</Text>
        </View>
        <View
          style={{
            width: "25%",
            ...styles.cell,
            borderRight: "",
          }}
        >
          {checked1 && (
            <FontAwesomeIcon
              faIcon={faCheck}
              style={{ color: "#000", width: "8px" }}
            />
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row" }}>
        <View
          style={{ borderRight: "1px solid black", width: "75%", padding: 2 }}
        >
          <Text>{l2}</Text>
        </View>
        <View
          style={{
            width: "25%",
            ...styles.cell,
            borderRight: "",
          }}
        >
          {checked2 && (
            <FontAwesomeIcon
              faIcon={faCheck}
              style={{ color: "#000", width: "8px" }}
            />
          )}
        </View>
      </View>
    </View>
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

function DisciplineItem({ value }: { value?: number }) {
  return <Text>{value != 0 ? value : ""}</Text>;
}
