"use server";

import { env } from "~/env";

export const captureException = async (message: string) => {
  try {
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });
  } catch (err: unknown) {
    console.error(err);
  }
};
