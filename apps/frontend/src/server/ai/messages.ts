import "server-only";

import type { ModelMessage, UIMessage } from "ai";

function valueAsString(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  return "";
}

export function extractTextFromUIMessage(message: {
  content?: unknown;
  parts?: unknown;
}): string {
  const contentText = valueAsString(message.content).trim();

  if (contentText) {
    return contentText;
  }

  if (!Array.isArray(message.parts)) {
    return "";
  }

  return message.parts
    .map((part) => {
      if (typeof part !== "object" || part === null) {
        return "";
      }

      const maybePart = part as { type?: unknown; text?: unknown };
      if (maybePart.type === "text" && typeof maybePart.text === "string") {
        return maybePart.text;
      }

      return "";
    })
    .join("\n")
    .trim();
}

function normalizeRole(
  role: string,
): "system" | "user" | "assistant" | undefined {
  if (role === "system" || role === "user" || role === "assistant") {
    return role;
  }

  return undefined;
}

export function toCoreMessages(messages: UIMessage[]): ModelMessage[] {
  return messages.flatMap((message) => {
    const role = normalizeRole(message.role);
    const content = extractTextFromUIMessage(message);

    if (!role || !content) {
      return [];
    }

    return [{ role, content }];
  });
}

export function deriveChatTitle(messages: UIMessage[]): string {
  const firstUserMessage = messages.find((message) => message.role === "user");
  const rawTitle = firstUserMessage
    ? extractTextFromUIMessage(firstUserMessage)
    : "";

  const fallbackTitle = "New chat";
  const cleanTitle = rawTitle.replace(/\s+/g, " ").trim();

  if (!cleanTitle) {
    return fallbackTitle;
  }

  return cleanTitle.length > 80
    ? `${cleanTitle.slice(0, 77).trimEnd()}...`
    : cleanTitle;
}
