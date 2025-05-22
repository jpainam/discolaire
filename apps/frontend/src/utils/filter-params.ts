import {
  createLoader,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
} from "nuqs/server";

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const coordinatesSearchParams = {
  latitude: parseAsFloat.withDefault(0),
  longitude: parseAsFloat.withDefault(0),
};

export const loadSearchParams = createLoader(coordinatesSearchParams);

export const reportcardSearchParamsSchema = {
  termId: parseAsInteger,
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
