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

export type Tenant = (typeof SCHOOL_TENANTS)[number];

/**
 * Per-tenant admin email overrides.
 * Only list tenants that need a custom set — all others fall back to ADMIN_EMAIL.
 */
export const TENANT_ADMIN_EMAILS: Partial<Record<Tenant, string[]>> = {
  // csac: ["admin@csac.cd"],
  // demo: ["jpainam@gmail.com", "another@example.com"],
  // ipbw: ["direction@ipbw.cd"],
  app: ["fezeu71@gmail.com", "jpainam@gmail.com", "gmboudie@gmail.com"],
};

/** Returns the admin email list for a tenant, falling back to [ADMIN_EMAIL]. */
export function getTenantAdminEmails(tenant: Tenant): string[] {
  return TENANT_ADMIN_EMAILS[tenant] ?? [ADMIN_EMAIL];
}

/** Returns the base URL for a tenant (e.g. https://csac.discolaire.com). */
export function tenantBaseUrl(tenant: Tenant): string {
  return `https://${tenant}.discolaire.com`;
}

/** Returns the window [nextMonday, nextSunday] relative to `now`. */
export function nextWeekWindow(now: Date) {
  const monday = startOfDay(nextMonday(now));
  const sunday = addDays(monday, 6);
  sunday.setHours(23, 59, 59, 999);
  return { monday, sunday };
}
