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
