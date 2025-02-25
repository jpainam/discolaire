import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function getAssetUrl() {
  return "https://discolaire-public.s3.eu-central-1.amazonaws.com";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return "https://app.discolaire.com";
}
