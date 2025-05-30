export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  dateOfBirth: string;
  placeOfBirth: string;
  isAdventist: boolean;
  isBaptized: boolean;
  address: string;
  isNew: boolean;
  isRepeating: boolean;
  currentClass: string;
  admissionDate: string;
  parents: Parent[];
  academicTerms: AcademicTerm[];
  fees: Fee[];
  transactions: Transaction[];
  financialInfo?: {
    currentBalance: number;
    lastTransactionDate: string;
  };
}

export interface Parent {
  fullName: string;
  relationship: string;
  photoUrl: string;
  phoneNumber: string;
  email: string;
  address: string;
  occupation: string;
  isEmergencyContact: boolean;
}

export interface AcademicTerm {
  name: string;
  period: string;
  grades: Grade[];
}

export interface Grade {
  subject: string;
  score: number;
  teacher: string;
}

export interface Fee {
  id: string;
  name: string;
  period: string;
  amount: number;
  amountPaid: number;
  dueDate: string;
  payments: Payment[];
}

export interface Payment {
  date: string;
  amount: number;
  method: string;
  reference: string;
}

export interface Transaction {
  title: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: "credit" | "debit";
}
