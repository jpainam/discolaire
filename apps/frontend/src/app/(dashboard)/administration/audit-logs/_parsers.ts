import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export type DateRange = "today" | "7d" | "30d" | "all";

export const DATE_RANGE_LABELS: Record<DateRange, string> = {
  today: "Aujourd'hui",
  "7d": "7 derniers jours",
  "30d": "30 derniers jours",
  all: "Tout",
};

export const auditLogParsers = {
  q: parseAsString.withDefault(""),
  range: parseAsStringLiteral(["today", "7d", "30d", "all"]).withDefault("all"),
  actions: parseAsArrayOf(parseAsString).withDefault([]),
  types: parseAsArrayOf(parseAsString).withDefault([]),
  users: parseAsArrayOf(parseAsString).withDefault([]),
  open: parseAsBoolean.withDefault(true),
  page: parseAsInteger.withDefault(1),
};
