import {
  adminClient,
  apiKeyClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./server";
export const authClient = createAuthClient({
  plugins: [
    apiKeyClient(),
    adminClient(),
    usernameClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { useSession } = authClient;
