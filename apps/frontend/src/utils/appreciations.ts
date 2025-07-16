export function getAppreciations(grade?: number | null) {
  if (grade === undefined || grade == null) return "";
  if (grade >= 0 && grade < 4) {
    return "Nul";
  } else if (grade >= 4 && grade < 6) {
    return "Très faible";
  } else if (grade >= 6 && grade < 8) {
    return "Faible";
  } else if (grade >= 8 && grade < 9) {
    return "Insuffisant";
  } else if (grade >= 9 && grade < 10) {
    return "Médiocre";
  } else if (grade >= 10 && grade < 11) {
    return "Moyen";
  } else if (grade >= 11 && grade < 12) {
    return "Passable";
  } else if (grade >= 12 && grade < 14) {
    return "Assez bien";
  } else if (grade >= 14 && grade < 16) {
    return "Bien";
  } else if (grade >= 16 && grade < 18) {
    return "Très bien";
  } else if (grade >= 18 && grade <= 20) {
    return "Excellent";
  }
  return `${grade}`;
}
