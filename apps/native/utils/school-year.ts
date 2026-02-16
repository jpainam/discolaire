import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

interface SchoolYearContext {
  userId: string;
  schoolYearId: string;
}

const configuredScheme = Constants.expoConfig?.scheme;
const appScheme =
  typeof configuredScheme === "string" && configuredScheme.length > 0
    ? configuredScheme
    : "discolaire";

function toSecureStoreSafeKeyPart(value: string): string {
  const sanitized = value.replace(/[^A-Za-z0-9._-]/g, "_");
  return sanitized.length > 0 ? sanitized : "discolaire";
}

const storageKey = `${toSecureStoreSafeKeyPart(appScheme)}_school_year_context`;

let cachedSchoolYearContext: SchoolYearContext | null = null;
let isHydrated = false;

export function getSchoolYearId(): string | null {
  return cachedSchoolYearContext?.schoolYearId ?? null;
}

export async function hydrateSchoolYearContext(): Promise<SchoolYearContext | null> {
  if (isHydrated) {
    return cachedSchoolYearContext;
  }

  const rawValue = await SecureStore.getItemAsync(storageKey);
  if (!rawValue) {
    cachedSchoolYearContext = null;
    isHydrated = true;
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<SchoolYearContext>;
    if (
      typeof parsed.userId === "string" &&
      parsed.userId.length > 0 &&
      typeof parsed.schoolYearId === "string" &&
      parsed.schoolYearId.length > 0
    ) {
      cachedSchoolYearContext = {
        userId: parsed.userId,
        schoolYearId: parsed.schoolYearId,
      };
    } else {
      cachedSchoolYearContext = null;
    }
  } catch {
    cachedSchoolYearContext = null;
  }

  isHydrated = true;
  return cachedSchoolYearContext;
}

export async function setSchoolYearContext(
  value: SchoolYearContext,
): Promise<void> {
  cachedSchoolYearContext = value;
  isHydrated = true;
  await SecureStore.setItemAsync(storageKey, JSON.stringify(value));
}

export async function clearSchoolYearContext(): Promise<void> {
  cachedSchoolYearContext = null;
  isHydrated = true;
  await SecureStore.deleteItemAsync(storageKey);
}
