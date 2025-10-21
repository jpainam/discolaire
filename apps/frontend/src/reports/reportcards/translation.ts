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
    "Moy.C": "C.Avg",
    "Min/Max": "Last/First",
    Appreciation: "Remark",
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
  },
  FRA: {},
};
export function getTranslation(section?: string) {
  const translate = section == "ANG" ? ipbwTranslate.ANG : ipbwTranslate.FRA;
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
