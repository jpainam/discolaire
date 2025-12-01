import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

import type { ErrorCode } from "./errors";
import { ChatSDKError } from "./errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    const { code, cause } = (await response.json()) as {
      code: ErrorCode;
      cause?: string;
    };
    throw new ChatSDKError(code, cause);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return response.json();
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function generateId({ length = 8, prefix = "" } = {}) {
  return `${prefix}${customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    length,
  )()}`;
}

/**
 * Stole this from the @radix-ui/primitive
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

export function getSheetName(sheetName: string) {
  return sheetName.replace(/[/\\?*[\]:]/g, "_");
}

export function isRichText(htmlText: string): boolean {
  const richTextTags =
    /<(b|i|u|strong|em|p|h[1-6]|ul|ol|li|a|img|video|table|tr|td|th|br|blockquote|span|div|style|font)[^>]*>/i;

  return richTextTags.test(htmlText);
}
export function getFileBasename(url: string): string {
  //const parsedUrl = new URL(url);
  //const pathParts = parsedUrl.pathname.split("/");
  const pathParts = url.split("/");
  return pathParts.pop() ?? url;
}

export async function fetchWithErrorHandlers(
  input: RequestInfo | URL,
  init?: RequestInit,
) {
  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      const { code, cause } = (await response.json()) as {
        code: ErrorCode;
        cause?: string;
      };
      throw new ChatSDKError(code, cause);
    }

    return response;
  } catch (error: unknown) {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw new ChatSDKError("offline:chat");
    }

    throw error;
  }
}

export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(localStorage.getItem(key) ?? "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateStringColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getLatenessValue(value: string) {
  if (!value.includes(":")) {
    return parseInt(value, 10);
  }
  const [hours, minutes] = value.split(":").map(Number);
  return (hours ?? 0) * 60 + (minutes ?? 0);
}

export function getWeekdayName(dayNumber: number, locale = "en-US"): string {
  // Create a reference date where Sunday = 0
  const referenceDate = new Date(1970, 0, 4 + dayNumber); // Jan 4, 1970 is a Sunday

  return new Intl.DateTimeFormat(locale, { weekday: "long" }).format(
    referenceDate,
  );
}
