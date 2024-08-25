export type Vaccine = {
  name: string;
  description: string;
};
export type Immunization = {
  name: string;
  description: string;
  vaccines: Record<string, string>;
};

export const vaccines: Vaccine[] = [
  {
    name: "DTaP/Tdap",
    description: "Diphtérie, tétanos, coqueluche",
  },
  {
    name: "HepatitisB",
    description: "Hépatite B",
  },
  {
    name: "Hib",
    description: "Haemophilus influenzae type B",
  },
  {
    name: "MMR",
    description: "Rougeole, oreillons, rubéole",
  },
  {
    name: "PCV",
    description: "Pneumocoque",
  },
  {
    name: "Polio",
    description: "Poliomyélite",
  },
  {
    name: "Varicella",
    description: "Varicelle",
  },
];

export const vaccineColumns = [
  "DTaP/Tdap",
  "HepatitisB",
  "Hib",
  "MMR",
  "PCV",
  "Polio",
  "Varicella",
];
const preschool: Immunization = {
  name: "Crèche",
  description: "Etre âgé de 19 mois à < 4 ans au 1er septembre",
  vaccines: {
    DTaP_Tdap: "4 doses DTaP",
    Hepatitis_B: "3 doses",
    Hib: "3 ou 4 doses * (selon le vaccin)",
    MMR: "1 dose",
    PCV: "4 doses *",
    Polio: "3 doses",
    Varicella: "1 dose **",
  },
};

const kindergarten1: Immunization = {
  name: "Ecole maternelle/école maternelle de transition",
  description: "Etre âgé de 4 ans ou plus au 1er septembre",
  vaccines: {
    DTaP_Tdap: "5 doses DTaP *",
    Hepatitis_B: "3 doses",
    Hib: "3 ou 4 doses * (selon le vaccin), (non requis à partir de 5 ans)",
    MMR: "2 dose",
    PCV: "4 doses * (non requis à partir de 5 ans)",
    Polio: "4 doses *",
    Varicella: "2 dose **",
  },
};
const kindergarten2: Immunization = {
  name: "Jardin d'enfants",
  description: "5 ans ou plus au 1er septembre",
  vaccines: {
    DTaP_Tdap: "5 doses DTaP *",
    Hepatitis_B: "3 doses",
    Hib: "3 ou 4 doses * (selon le vaccin), (non requis à partir de 5 ans)",
    MMR: "2 dose",
    PCV: "4 doses * (non requis à partir de 5 ans)",
    Polio: "4 doses *",
    Varicella: "2 dose **",
  },
};
const primaire: Immunization = {
  name: "Primaire",
  description: "7 ans ou plus au 1er septembre",
  vaccines: {
    DTaP_Tdap: "5 doses DTaP *",
    Hepatitis_B: "3 doses",
    Hib: "3 ou 4 doses * (selon le vaccin), (non requis à partir de 5 ans)",
    MMR: "2 dose",
    PCV: "4 doses * (non requis à partir de 5 ans)",
    Polio: "4 doses *",
    Varicella: "2 dose **",
  },
};
const seniorPrimaire: Immunization = {
  name: "Primaire 2nd cycle",
  description: "9 ans ou plus au 1er septembre",
  vaccines: {
    DTaP_Tdap: "5 doses DTaP *",
    Hepatitis_B: "3 doses",
    Hib: "3 ou 4 doses * (selon le vaccin), (non requis à partir de 5 ans)",
    MMR: "2 dose",
    PCV: "4 doses * (non requis à partir de 5 ans)",
    Polio: "4 doses *",
    Varicella: "2 dose **",
  },
};
export const immunizations: Immunization[] = [
  preschool,
  kindergarten1,
  kindergarten2,
  primaire,
  seniorPrimaire,
];
