import {
  adminClient,
  apiKeyClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { getAuth } from "./server";

export const authClient = createAuthClient({
  plugins: [
    apiKeyClient(),
    adminClient(),
    usernameClient(),
    inferAdditionalFields<Awaited<ReturnType<typeof getAuth>>>(),
  ],
});

export const { useSession } = authClient;
