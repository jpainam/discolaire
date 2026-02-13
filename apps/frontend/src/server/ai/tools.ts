import "server-only";

import type { ToolSet } from "ai";
import { z } from "zod/v4";

export const aiTools = {
  getCurrentTime: {
    description: "Get the current date and time",
    inputSchema: z.object({}),
    execute: () => Promise.resolve({ currentTime: new Date().toISOString() }),
  },
} as const satisfies ToolSet;
