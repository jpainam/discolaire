import { Document, Page, Text, View } from "@react-pdf/renderer";

const frenchItems = [
  {
    title: "COMMENTAIRES RELATIFS AU TRAVAIL SCOLAIRE DE L'ÉLÈVE",
    items: [
      "Très bonne appropriation des savoirs",
      "Très bon développement des habiletés",
      "Très bon développement des compétences",
    ],
  },
  {
    title: "RECOMMANDATIONS RELATIVES AU TRAVAIL SCOLAIRE DE L'ÉLÈVE",
    items: [
      "Améliorer l'appropriation des notions fondamentales de la compétence",
      "Améliorer la technique de restitution des savoirs",
      "Améliorer les habiletés spécifiques",
      "Améliorer la capacité d'intégration des ressources",
    ],
  },
  {
    title: "COMMENTAIRES RELATIFS AU COMPORTEMENT DE L'ÉLEVE",
    items: [
      "Élève assidu",
      "Elève ponctuel",
      "Participe activement aux activités de la classe",
      "Respectueux",
      "Obéissant",
      "Très poli",
      "Alerte et vif",
      "Calme et posé",
      "Honnête",
      "Aide ses camarades à comprendre les leçons",
      "Studieux et travailleur",
    ],
  },
  {
    title: "RECOMMANDATIONS RELATIVES AU COMPORTEMENT DE L'ÉLÈVE",
    items: [
      "Être plus participatif",
      "Doit être plus éveillé",
      "Faire d'avantage ses devoirs",
      "Avoir le sens de la collaboration",
      "Doit être concentré et attentif",
      "Être volontaire",
      "Faire preuve de plus de motivation",
      "Développer l'estime de soi",
      "améliorer sa ponctualité / assiduité",
    ],
  },
];
const englishItems = [
  {
    title: "COMMENTS ON THE STUDENT'S ACADEMIC WORK",
    items: [
      "Very good acquisition of knowledge",
      "Very good development of skills",
      "very well development of competences",
    ],
  },
  {
    title: "RECOMMENDATIONS ON THE STUDENT'S ACADEMIC WORK",
    items: [
      "Work on the appreciation of the basic notions of the competences",
      "Improve on the technics of knowledge restitution",
      "Improve on specific skills",
      "Improve on Integration of resources",
    ],
  },
  {
    title: "COMMENTS ON THE STUDENT'S CONDUCT",
    items: [
      "Assiduous student",
      "Punctual",
      "Active student",
      "Respectful Obedient",
      "Very polite",
      "Alert and active",
      "Calm and composed",
      "Honest",
      "Helps classmates understand lessons",
      "hard-working and industrious",
    ],
  },
  {
    title: "RECOMMENDATIONS ON THE STUDENT'S CONDUCT",
    items: [
      "Participate more In class",
      "Be more alert",
      "Encouraged to do homework",
      "Work on team spirit",
      "Be more attentive Volonteer more",
      "Develop self esteem",
      "Work on punctuality and assiduity",
    ],
  },
];
export function IPBWTeachersComments() {
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
        <View style={{ flexDirection: "column", gap: 10, display: "flex" }}>
          <View
            style={{
              flexDirection: "column",
              gap: 4,
              fontSize: 12,
              fontWeight: "bold",
              alignItems: "center",
            }}
          >
            <Text>LISTE DES COMMENTAIRES POUR L'ENSEIGNANT</Text>
            <Text>LIST OF COMMENTS FOR TEACHERS</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                gap: 8,
                width: "50%",
              }}
            >
              {frenchItems.map((section, index) => {
                return (
                  <TableItem
                    key={index}
                    title={section.title}
                    items={section.items}
                    backgroundColor="#AECCE4"
                  />
                );
              })}
              <Text style={{ fontSize: 7 }}>
                NB: Cette liste n'est pas exhaustive et peut être étendue
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                gap: 8,
                width: "50%",
              }}
            >
              {englishItems.map((section, index) => {
                return (
                  <TableItem
                    key={index}
                    title={section.title}
                    items={section.items}
                    backgroundColor="#FFEE8C"
                  />
                );
              })}
              <Text style={{ fontSize: 7 }}>
                NB: this list is not exhaustive and may be expanded.
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

function TableItem({
  title,
  items,
  backgroundColor,
}: {
  title: string;
  items: string[];
  backgroundColor: string;
}) {
  return (
    <View
      style={{
        flexDirection: "column",
        fontSize: 9,
        border: "1px solid black",
      }}
    >
      <View
        style={{
          borderBottom: "1px solid black",
          fontWeight: "bold",
          padding: 2,
          backgroundColor: backgroundColor,
        }}
      >
        <Text>{title}</Text>
      </View>
      {items.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              borderBottom: index == items.length - 1 ? "" : "1px solid black",
              padding: 2,
            }}
          >
            <Text>{item}</Text>
          </View>
        );
      })}
    </View>
  );
}
