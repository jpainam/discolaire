import { env } from "~/env";

export const CURRENCY = "CFA";

export const isProductionEnvironment = env.NODE_ENV === "production";
export const isDevelopmentEnvironment = env.NODE_ENV === "development";
export const isTestEnvironment = false;

export const guestRegex = /^guest-\d+$/;

export const DUMMY_PASSWORD = "generateDummyPassword()";
