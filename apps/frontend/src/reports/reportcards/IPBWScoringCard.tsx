import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  tableHead: {
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    borderLeft: "1px solid black",
  },
  tableCell: {
    padding: 2,
    borderLeft: "1px solid black",
  },
  headTitle: {
    fontWeight: "bold",
    textDecoration: "underline",
    fontSize: 10,
  },
  standardText: {
    lineHeight: 1.5,
    marginBottom: 10,
  },
  text: {
    textAlign: "justify",
    fontSize: 9,
    lineHeight: 1.5,
  },
  doubleSpacedText: {
    lineHeight: 2.0,
    marginBottom: 10,
  },
});

export function IPBWScoringCard() {
  return (
    <Document>
      <Page
        size="A4"
        style={{
          paddingVertical: 20,
          paddingHorizontal: 30,
          backgroundColor: "#fff",
          color: "#000",
          fontFamily: "Helvetica",
        }}
      >
        <View style={{ flexDirection: "column", gap: 8, display: "flex" }}>
          <PerformanceGridFrench />
          <FrenchText />
          <View style={{ height: 2 }}></View>
          <PerformanceGridEnglish />
          <EnglishText />
        </View>
      </Page>
    </Document>
  );
}
const W = ["22%", "12%", "8%", "24%", "34%"];
function PerformanceGridEnglish() {
  return (
    <View style={{ flexDirection: "column", gap: 4 }}>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 12,
        }}
      >
        PERFORMANCE GRID
      </Text>
      <View style={{ border: "1px solid black", fontSize: 9 }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#FFEE8C",
            fontWeight: "bold",
            borderBottom: "1px solid black",
          }}
        >
          <View
            style={{
              width: W[0],

              ...styles.tableHead,
              borderLeft: "",
            }}
          >
            <Text>LEVEL OF PERFORMANCE</Text>
          </View>
          <View
            style={{
              width: W[1],
              ...styles.tableHead,
            }}
          >
            <Text>MARK/20</Text>
          </View>
          <View
            style={{
              width: W[2],
              ...styles.tableHead,
            }}
          >
            <Text>GRADE</Text>
          </View>
          <View
            style={{
              width: W[3],
              ...styles.tableHead,
            }}
          >
            <Text>MARK IN PERCENTAGE (%)</Text>
          </View>
          <View
            style={{
              width: W[4],
              ...styles.tableHead,
            }}
          >
            <Text>REMARKS 2</Text>
          </View>
        </View>
        <PerformanceItem
          borderTop={false}
          level="Level 4"
          cote={"A+"}
          cote2="A"
          grade={"18 < m < 20"}
          grade2="16 < m < 18"
          percent={"From 90% to 100%"}
          percent2="From 80 to 89%"
          app={"Competences Very Well Acquired (CVWA)"}
        />
        <PerformanceItem
          level="Level 3"
          cote={"B+"}
          cote2="B"
          grade={"15 < m < 16"}
          grade2="14 < m < 15"
          percent={"From 75 to 79%"}
          percent2="From 70 to 74%"
          app={"Competences Well Acquired (CWA)"}
        />
        <PerformanceItem
          level="Level 2"
          cote={"C+"}
          cote2="C"
          grade={"12 < m < 14"}
          grade2="10 < m < 12"
          percent={"From 60 to 69%"}
          percent2="From 50 to 59%"
          app={"Competences Acquired (CA)"}
          app2={"Competences Averagely Acquired (CAA)"}
        />
        <PerformanceItem
          level="Level 1"
          grade="m < 10"
          cote="D"
          percent="< 50%"
          app={"Competences Not Acquired (CNA)"}
        />
        {/* <PerformanceItem level="Niveau 2" percent="De 80 à 89%" app="Compétences bien acquises (CBA)" /> */}
      </View>
    </View>
  );
}

function PerformanceItem({
  level,
  grade,
  grade2,
  cote,
  cote2,
  percent,
  percent2,
  app,
  app2,
  borderTop = true,
}: {
  level: string;
  grade: string;
  grade2?: string;
  cote: string;
  cote2?: string;
  percent: string;
  percent2?: string;
  app: string;
  app2?: string;
  borderTop?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        borderTop: borderTop ? "1px solid black" : "",
      }}
    >
      <View
        style={{
          width: W[0],
          ...styles.tableCell,
          borderLeft: "",
          justifyContent: "center",
        }}
      >
        <Text>{level}</Text>
      </View>
      {grade2 ? (
        <View
          style={{
            width: W[1],
          }}
        >
          <View
            style={{
              ...styles.tableCell,
              width: "100%",
              borderBottom: "1px solid black",
            }}
          >
            <Text>{grade}</Text>
          </View>
          <View
            style={{
              width: "100%",
              ...styles.tableCell,
            }}
          >
            <Text>{grade}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: W[1],
            ...styles.tableCell,
          }}
        >
          <Text>{grade}</Text>
        </View>
      )}
      {cote2 ? (
        <View style={{ width: W[2] }}>
          <View
            style={{
              width: "100%",
              ...styles.tableCell,
              textAlign: "center",
              borderBottom: "1px solid black",
            }}
          >
            <Text>{cote}</Text>
          </View>
          <View
            style={{
              ...styles.tableCell,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Text>{cote2}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: W[2],
            ...styles.tableCell,
            textAlign: "center",
          }}
        >
          <Text>{cote}</Text>
        </View>
      )}
      {percent2 ? (
        <View
          style={{
            width: W[3],
          }}
        >
          <View
            style={{
              width: "100%",
              borderBottom: "1px solid black",
              ...styles.tableCell,
            }}
          >
            <Text>{percent}</Text>
          </View>
          <View
            style={{
              width: "100%",
              ...styles.tableCell,
            }}
          >
            <Text>{percent2}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: W[3],
            ...styles.tableCell,
          }}
        >
          <Text>{percent}</Text>
        </View>
      )}
      {app2 ? (
        <View style={{ width: W[4] }}>
          <View
            style={{
              width: "100%",
              ...styles.tableCell,
              borderBottom: "1px solid black",
            }}
          >
            <Text>{app}</Text>
          </View>
          <View
            style={{
              width: "100%",
              ...styles.tableCell,
            }}
          >
            <Text>{app2}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            width: W[4],
            ...styles.tableCell,
            justifyContent: "center",
          }}
        >
          <Text>{app}</Text>
        </View>
      )}
    </View>
  );
}
function PerformanceGridFrench() {
  return (
    <View style={{ flexDirection: "column", gap: 4 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        GRILLE DE NOTATION
      </Text>
      <View style={{ border: "1px solid black", fontSize: 9 }}>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#AECCE4",
            fontWeight: "bold",
            borderBottom: "1px solid black",
          }}
        >
          <View
            style={{
              width: W[0],

              ...styles.tableHead,
              borderLeft: "",
            }}
          >
            <Text>NIVEAU DE RENDEMENT</Text>
          </View>
          <View
            style={{
              width: W[1],
              ...styles.tableHead,
            }}
          >
            <Text>NOTE/20</Text>
          </View>
          <View
            style={{
              width: W[2],
              ...styles.tableHead,
            }}
          >
            <Text>COTE </Text>
          </View>
          <View
            style={{
              width: W[3],
              ...styles.tableHead,
            }}
          >
            <Text>NOTE EN POURCENTAGE (%)</Text>
          </View>
          <View
            style={{
              width: W[4],
              ...styles.tableHead,
            }}
          >
            <Text>APPRECIATION</Text>
          </View>
        </View>
        <PerformanceItem
          borderTop={false}
          level="Niveau 4"
          cote={"A+"}
          cote2="A"
          grade={"18 < m < 20"}
          grade2="16 < m < 18"
          percent={"De 90% à 100%"}
          percent2="De 80 à 89%"
          app={"Compétences très bien acquises (CTBA)"}
        />
        <PerformanceItem
          level="Niveau 3"
          cote={"B+"}
          cote2="B"
          grade={"15 < m < 16"}
          grade2="14 < m < 15"
          percent={"De 75 à 79%"}
          percent2="De 70 à 74%"
          app={"Compétences bien acquises (CBA)"}
        />
        <PerformanceItem
          level="Niveau 2"
          cote={"C+"}
          cote2="C"
          grade={"12 < m < 14"}
          grade2="10 < m < 12"
          percent={"De 60 à 69%"}
          percent2="De 50 à 59%"
          app={"Compétences acquises (CA)"}
          app2={"Compétences moyennement acquises (CMA)"}
        />
        <PerformanceItem
          level="Niveau 1"
          grade="m < 10"
          cote="D"
          percent="< 50%"
          app="Compétences non acquises (CNA)"
        />
      </View>
    </View>
  );
}
function EnglishText() {
  return (
    <View
      style={{
        flexDirection: "column",
        gap: 6,
        textAlign: "justify",
      }}
    >
      <Text style={styles.headTitle}>
        DESCRIPTION OF STUDENT PERFORMANCE LEVELS
      </Text>
      <Text style={styles.text}>
        The level of performance is determined by the score obtained in the
        summative assessment.
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Level 1</Text> indicates
        unsatisfactory performance. The student performance is below average and
        will require assistance where competences were not acquired (mentoring,
        extra homework).
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Level 2</Text>, while indicating
        success, C means performance that is not entirely satisfactory. The
        student demonstrates,{" "}
        <Text style={{ fontWeight: "bold" }}>with limited effectiveness</Text>,
        the ability to mobilise resources to develop the competence. Performance
        at this level shows that the student needs to improve considerably to
        overcome specific shortcomings i n his/her learning (extra support
        needed).
      </Text>
      <Text style={styles.text}>
        C+ means the performance is fairly satisfactory. The student
        demonstrates,{" "}
        <Text style={{ fontWeight: "bold" }}> with certain effectiveness</Text>,
        the ability t o mobilise resources t o develop the competence.
        Performance at this level shows that the student should strive to
        overcome specific shortcomings in his/her learning.
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Level 3</Text> shows satisfactory
        performance. The student demonstrates,{" "}
        <Text style={{ fontWeight: "bold" }}>with effectiveness</Text>, the
        ability to mobilise resources to develop the competence. Performance at
        this level shows that the student is learning successfully.
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Level 4</Text> means that the
        student's performance is very high. Th e student demonstrates,{" "}
        <Text style={{ fontWeight: "bold" }}>
          with a great deal of effectiveness
        </Text>
        , the ability to mobilise resources to develop the competence. This
        level shows that the student excellently mastered his/her learning.
      </Text>
    </View>
  );
}
function FrenchText() {
  return (
    <View
      style={{
        flexDirection: "column",
        gap: 6,
        textAlign: "justify",
      }}
    >
      <Text style={styles.headTitle}>
        DESCRIPTION DES NIVEAUX DE RENDEMENT DE L'ÉLÈVE
      </Text>
      <Text style={styles.text}>
        Le niveau de rendement est déterminé par les résultats obtenus après
        l'évaluation des apprentissages.
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Le niveau 1</Text> indique un
        rendement non satisfaisant. L'élève est en dessous de la moyenne, Il a
        besoin d'un accompagnement particulier pour les compétences non acquises
        (tutorat, devoirs supplémentaires...).
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Le niveau 2</Text>, bien qu'il
        indique une réussite, la{" "}
        <Text style={{ fontWeight: "bold" }}>cote C</Text> correspond à un
        niveau de rendement qui ne donne pas entièrement satisfaction. L'élève
        démontre avec
        <Text style={{ fontWeight: "bold" }}> une efficacité limitée</Text>{" "}
        l'habileté à mobiliser des resources pour développer la compétence. Un
        rendement à ce niveau exige que l'élève s'améliore considérablement pour
        combler des insuffisances spécifiques dans ses apprentissages
        (accompagnement par des travaux supplémentaires).
      </Text>
      <Text style={styles.text}>
        Par ailleurs, la <Text style={{ fontWeight: "bold" }}>cote C+</Text>{" "}
        correspond à un niveau de rendement assez satisfaisant. À ce stade,
        l'élève démontre avec une certaine{" "}
        <Text style={{ fontWeight: "bold" }}>efficacité</Text> l'habileté à
        mobiliser des resources pour développer la compétence. Un rendement à ce
        niveau indique que l'élève devrait s'efforcer de corriger les
        insuffisances identifiées dans ses apprentissages.
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Le niveau 3</Text> indique un
        rendement satisfaisant. L'élève démontre avec{" "}
        <Text style={{ fontWeight: "bold" }}>efficacité</Text> l'habileté à
        mobiliser des resources pour développer la compétence. Un rendement à ce
        niveau montre que l'élève mène bien ses apprentissages.
      </Text>
      <Text style={styles.text}>
        <Text style={{ fontWeight: "bold" }}>Le niveau 4</Text> signifie que le
        rendement de l'élève est très élevé. L'élève démontre avec{" "}
        <Text style={{ fontWeight: "bold" }}> beaucoup d'efficacité</Text>{" "}
        l'habileté à mobiliser des resources pour développer la compétence. Ce
        niveau montre que l'élève a mené avec brio ses apprentissages.
      </Text>
    </View>
  );
}
