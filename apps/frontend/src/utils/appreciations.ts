export function getAppreciations(grade?: number | null, scale = 20): string {
  // Convert the grade to a scale of 20 if it's not already
  /*grade = grade ? Math.round((grade * 20) / scale) : undefined;
  if (grade === undefined) return "";
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
  return `${grade}`;*/
  return getNewAppreciationIPBW(grade, scale);
}

const appreciationService: Record<
  string,
  (grade?: number, scale?: number) => string
> & { default: (grade?: number, scale?: number) => string } = {
  ipbw: getNewAppreciationIPBW,
  demo: getAppreciationsIpbw,
  csac: getAppreciationsCSACONGO,
  default: getAppreciationsIpbw,
};

export function getAppreciationFn(
  key: string,
): (grade?: number, scale?: number) => string {
  const fn =
    appreciationService[key.toLowerCase()] ?? appreciationService.default;
  return fn;
}

export function getAppreciationsCSACONGO(
  grade?: number | null,
  scale = 10,
): string {
  grade = grade ? Math.round((grade * 20) / scale) : undefined;

  if (grade === undefined) return "";
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
export function getAppreciationsIpbw(
  grade?: number | null,
  scale = 20,
): string {
  /*grade = grade ? Math.round((grade * 20) / scale) : undefined;

  if (grade === undefined) return "";
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
  return `${grade}`;*/
  return getNewAppreciationIPBW(grade, scale);
}

export function getNewAppreciationIPBW(grade?: number | null, scale = 20) {
  grade = grade ? Math.round((grade * 20) / scale) : undefined;
  if (grade === undefined) return "";
  if (grade >= 18) {
    return "A+";
  } else if (grade >= 16 && grade < 18) {
    return "A";
  } else if (grade >= 15 && grade < 16) {
    return "B+";
  } else if (grade >= 14 && grade < 15) {
    return "B";
  } else if (grade >= 12 && grade > 14) {
    return "C+";
  } else if (grade >= 10 && grade < 12) {
    return "C";
  } else {
    return "D";
  }
}
