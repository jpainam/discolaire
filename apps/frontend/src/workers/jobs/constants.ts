import { addDays, nextMonday, startOfDay } from "date-fns";

export const FROM = "Discolaire <contact@discolaire.com>";

// Tenants that hold school data (exclude the bare postgres "public" schema)
export const SCHOOL_TENANTS = ["csac", "demo", "ipbw", "app"] as const;

export const WEEKDAY_LABELS: Record<number, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};

export const ADMIN_EMAIL = "jpainam@gmail.com";

/** Returns the window [nextMonday, nextSunday] relative to `now`. */
export function nextWeekWindow(now: Date) {
  const monday = startOfDay(nextMonday(now));
  const sunday = addDays(monday, 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}
