import {
  createLoader,
  parseAsFloat,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  latitude: parseAsFloat.withDefault(0),
  longitude: parseAsFloat.withDefault(0),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);

export const reportcardSearchParamsSchema = {
  termId: parseAsString,
  trimestreId: parseAsString,
};
export const reportcardSearchParams = createLoader(
  reportcardSearchParamsSchema,
);
export const transactionSearchParamsSchema = {
  from: parseAsIsoDate,
  to: parseAsIsoDate,
  status: parseAsString,
  classroomId: parseAsString,
};

export const transactionSearchParams = createLoader(
  transactionSearchParamsSchema,
);

export const trimestreSearchParamsSchema = {
  trimestreId: parseAsStringLiteral(["trim1", "trim2", "trim3"]),
  classroomId: parseAsString,
  format: parseAsStringLiteral(["pdf", "csv"]),
};

export const trimestreSearchParams = createLoader(trimestreSearchParamsSchema);

export const createTransactionSearchParamsSchema = {
  studentId: parseAsString,
  classroomId: parseAsString,
};

export const createTransactionSearchParams = createLoader(
  createTransactionSearchParamsSchema,
);

export const createTransactionSchemaStep1 = {
  amount: parseAsFloat,
  description: parseAsString,
  transactionType: parseAsStringLiteral(["CREDIT", "DEBIT"]),
  paymentMethod: parseAsString,
  journalId: parseAsString,
  studentId: parseAsString,
};

export const createTransactionStep1 = createLoader(
  createTransactionSchemaStep1,
);

// export const createTransactionSchemaStep2 = {
//   studentId: parseAsString,
//   classroomId: parseAsString,
//   contacts: parseAsArrayOf(parseAsString).withDefault([]),
//   fees: parseAsArrayOf(parseAsString).withDefault([]),
//   transactions: parseAsArrayOf(parseAsString).withDefault([]),
//   student: parseAsString,
//   unpaidRequiredFees: parseAsString,
// };

export const createTransactionSchema = {
  step: parseAsStringLiteral(["step1", "step2"]),
};
export const createTransactionLoader = createLoader(createTransactionSchema);
