/**
 * There are two sections: ANG (english) and FRA (french)
 * These two keywords need to be respected from ClassroomSection
 */
const ipbwTranslate = {
  ANG: {
    "Année scolaire": "School Year",
    Matières: "Subjects",
    Note: "Mark",
    Rang: "Rank",
    "Moy C": "C Avg",
    "Min/Max": "Last/First",
    Appréciation: "Remark",
    "Date et lieu de naissance": "Date and place of birth",
    Effectif: "Enrollment",
    Genre: "Gender",
    "Nom et Prénoms": "First and last name",
    Classe: "Class",
    "Identifiant Unique": "Reg. Number",
    Redoublant: "Repeater",
    "Parents / Tuteurs": "Parents / Tutors",
    "Professeur Principal": "Class Advisor",
    à: "at",
    NON: "NO",
    OUI: "YES",
    MOY: "AVG",
    "Résume des resultats": "Summary of results",
    Moyenne: "Average",
    Observation: "Observation",
    Discipline: "Discipline",
    Parents: "Parents",
    "Prof. Principal": "Class Advisor",
    "Le Chef d'établissement": "The head of the school",
    "Total absences": "No. absences",
    Justifiées: "Justified",
    "Non justifiées": "Unjustified",
    Retards: "No late",
    Consignes: "Consignes",
    Travail: "Distinction",
    Félicitations: "Congratulations",
    Encouragements: "Encouragements",
    "Tableau d'honneur": "Honour roll",
    Avertissement: "Warning",
    Blâme: "Censure",
    "Moy Max": "Max.Avg",
    "Moy Min": "Min.Avg",
    "Moy C": "C Avg",
    "Taux de reussite": "Success rate",
    "Directeur des Etudes": "Director of Studies",
    "Directeur des Etudes 1er Cycle": "Director of 1st Studies",
    "Groupe 1": "Group 1",
    "Groupe 2": "Group 2",
    "Groupe 3": "Group 3",
  },
  FRA: {},
};
export function getTranslation(lang: "fr" | "en") {
  const translate = lang == "en" ? ipbwTranslate.ANG : ipbwTranslate.FRA;
  const t = (key: string): string => {
    if (key in translate) {
      // @ts-expect-error No need to fix
      return translate[key] as string;
    } else {
      return key;
    }
  };
  return t;
}
