export interface HistoryType {
  id: string;
  title: string;
  description: string;
  sub_types?: SubHistoryType[];
  observation: string;
}

export interface SubHistoryType {
  id: string;
  title: string;
  type: "radio" | "checkbox";
}
const desc = "Veuillez expliquer et documenter tout médicament...";
const ADD_ADHD: HistoryType = {
  id: "ADD_ADHD",
  title: "Attention Deficit Disorder (ADD/ADHD)",
  description: desc,
  observation: "ADD/ADHD",
};
const ALLERGIES: HistoryType = {
  id: "ALLERGIES",
  title: "Allergies",
  description: "",
  observation: "",
  sub_types: [
    {
      id: "Food",
      title: "Aliment",
      type: "checkbox",
    },
    {
      id: "Bites",
      title: "Piqûres d'insectes",
      type: "checkbox",
    },
    {
      id: "Pollens",
      title: "Pollen",
      type: "checkbox",
    },
    {
      id: "Animals",
      title: "Animaux",
      type: "checkbox",
    },
    {
      id: "Medications",
      title: "Médicaments (Veuillez documenter...)",
      type: "checkbox",
    },
    {
      id: "Epi-Pen",
      title: "L'élève utilisera-t-il un Epi-Pen à l'école?",
      type: "radio",
    },
  ],
};

const ASTHMA: HistoryType = {
  id: "ASTHMA",
  title: "Asthme",
  description: desc,
  observation: "",
  sub_types: [
    {
      id: "Inhaler",
      title: "L'élève aura-t-il un inhalateur à l'école ?",
      type: "radio",
    },
  ],
};
const MUSCLE_CONDITION: HistoryType = {
  id: "MUSCLE_CONDITION",
  title: "Condition musculaire/Mobilité",
  description: desc,
  observation: "",
};
const DIABETES: HistoryType = {
  id: "DIABETES",
  title: "Diabète",
  description: desc,
  observation: "",
  sub_types: [
    {
      id: "Insulin",
      title: "L'insuline et un glucomètre sont-ils nécessaires à l'école ?",
      type: "radio",
    },
  ],
};

const EAR_THROAT_INFECTIONS: HistoryType = {
  id: "EAR_THROAT_INFECTIONS",
  title: "Infections de l'oreille et de la gorge",
  description: "Veuillez expliquer l'historique et le traitement...",
  observation: "",
};

const EMOTIONAL_PROBLEMS: HistoryType = {
  id: "EMOTIONAL_PROBLEMS",
  title: "Problèmes émotionnels",
  description: "Veuillez documenter les conseils et tout médicament",
  observation: "",
};

const FAINTING: HistoryType = {
  id: "FAINTING",
  title: "Évanouissement",
  description: "Veuillez expliquer...",
  observation: "",
};
const HEADACHES: HistoryType = {
  id: "HEADACHES",
  title: "Maux de tête chronique ou migraines",
  description: "Veuillez expliquer...",
  observation: "",
};

export const historyData = [
  ADD_ADHD,
  ALLERGIES,
  ASTHMA,
  MUSCLE_CONDITION,
  DIABETES,
  EAR_THROAT_INFECTIONS,
  EMOTIONAL_PROBLEMS,
  FAINTING,
  HEADACHES,
];
